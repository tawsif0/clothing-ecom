const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// MUST load dotenv before anything else that uses process.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const User = require('../models/User');
const { uploadImageBuffer } = require('../config/cloudinary');

// Paths to our generated images
const SAREE_IMG_PATH = 'C:\\Users\\arbei\\.gemini\\antigravity-ide\\brain\\b2ac158f-60a7-412c-9763-6afaa854f510\\saree_red_1779532012290.png';
const THREE_PIECE_IMG_PATH = 'C:\\Users\\arbei\\.gemini\\antigravity-ide\\brain\\b2ac158f-60a7-412c-9763-6afaa854f510\\floral_dress_1779527968418.png';

// 15 Traditional Bangladeshi Products
const newProducts = [
  { title: "Jamdani Silk Saree", price: 5500, type: "Saree", sku: "SAR-001", isHot: true },
  { title: "Cotton Tant Saree", price: 2200, type: "Saree", sku: "SAR-002" },
  { title: "Half Silk Rajshahi Saree", price: 3500, type: "Saree", sku: "SAR-003" },
  { title: "Katan Bridal Saree", price: 12000, type: "Saree", sku: "SAR-004", isHot: true },
  { title: "Dhakai Muslin Saree", price: 8500, type: "Saree", sku: "SAR-005" },

  { title: "Designer Georgette Three Piece", price: 3200, type: "Three Piece", sku: "TP-001", isHot: true },
  { title: "Pure Cotton Print Three Piece", price: 1800, type: "Three Piece", sku: "TP-002" },
  { title: "Boutique Silk Three Piece", price: 4500, type: "Three Piece", sku: "TP-003" },
  { title: "Linen Embroidered Three Piece", price: 2800, type: "Three Piece", sku: "TP-004" },
  { title: "Party Wear Net Three Piece", price: 5200, type: "Three Piece", sku: "TP-005", isHot: true },

  { title: "Casual Cotton Two Piece", price: 1500, type: "Two Piece", sku: "TW-001" },
  { title: "Stylish Rayon Kurti Set", price: 2100, type: "Two Piece", sku: "TW-002" },
  { title: "Block Print Two Piece", price: 1750, type: "Two Piece", sku: "TW-003", isHot: true },
  { title: "Khadi Fabric Salwar Kameez", price: 2400, type: "Two Piece", sku: "TW-004" },
  { title: "Embroidered Georgette Two Piece", price: 2900, type: "Two Piece", sku: "TW-005" }
];

async function ensureCategory(name) {
  let category = await Category.findOne({ name });
  if (category) return category._id;
  category = await Category.create({ name, description: `${name} category`, isActive: true });
  return category._id;
}

async function ensureBrand(name, adminId) {
  let brand = await Brand.findOne({ name });
  if (brand) return brand._id;
  brand = await Brand.create({ name, description: `${name} brand`, isActive: true, createdBy: adminId });
  return brand._id;
}

async function uploadLocalImageToCloudinary(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  const uploaded = await uploadImageBuffer(buffer, {
    folder: "marketplace/products",
    resource_type: "image",
  });
  const newImg = await ProductImage.create({
    data: uploaded.secure_url,
    publicId: uploaded.public_id,
    mimeType: 'image/png',
    size: uploaded.bytes,
    format: uploaded.format,
    width: uploaded.width,
    height: uploaded.height,
    resourceType: 'image'
  });
  return newImg._id;
}

async function main() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    const adminUser = await User.findOne({ userType: 'admin' });
    if (!adminUser) throw new Error("Admin user not found");

    const brandId = await ensureBrand('Aarong Style', adminUser._id);
    
    // Upload base images to Cloudinary ONCE and reuse them
    console.log('Uploading Saree Image...');
    const sareeImageId = await uploadLocalImageToCloudinary(SAREE_IMG_PATH);
    console.log('Uploading Three/Two Piece Image...');
    const pieceImageId = await uploadLocalImageToCloudinary(THREE_PIECE_IMG_PATH);

    // 1. Fix existing products that lack valid images
    console.log('\n--- Fixing existing products without images ---');
    const existingProducts = await Product.find({});
    let fixedCount = 0;
    for (const prod of existingProducts) {
      if (!prod.images || prod.images.length === 0) {
        prod.images = [pieceImageId];
        await prod.save();
        fixedCount++;
        console.log(`Fixed missing image for: ${prod.title}`);
      }
    }
    console.log(`Total existing products fixed: ${fixedCount}`);

    // 2. Upload the 15 new products
    console.log('\n--- Uploading 15 New Traditional Products ---');
    for (const p of newProducts) {
      const categoryId = await ensureCategory(p.type);
      const imageId = p.type === 'Saree' ? sareeImageId : pieceImageId;

      const product = await Product.create({
        title: p.title,
        description: `Beautiful traditional Bangladeshi ${p.type} made with high-quality fabric.`,
        price: p.price,
        sku: p.sku,
        productType: p.isHot ? 'Hot deals' : 'Latest',
        brand: brandId,
        category: categoryId,
        isActive: true,
        approvalStatus: 'approved',
        publicationStatus: 'published',
        images: [imageId],
        priceType: 'single',
      });
      console.log(`✅ Created: ${product.title} (${p.type})`);
    }

    console.log('\n🎉 Successfully uploaded 15 products and fixed missing images!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Script failed:', err);
    process.exit(1);
  }
}

main();
