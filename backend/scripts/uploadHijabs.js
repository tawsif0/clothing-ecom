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

// Path to generated Hijab image
const HIJAB_IMG_PATH = 'C:\\Users\\arbei\\.gemini\\antigravity-ide\\brain\\b2ac158f-60a7-412c-9763-6afaa854f510\\hijab_product_1779532370493.png';

// 10 Hijab Products
const newProducts = [
  { title: "Premium Chiffon Hijab - Rose", price: 850, type: "Hijabs", sku: "HJ-001", isHot: true },
  { title: "Everyday Jersey Hijab - Navy", price: 600, type: "Hijabs", sku: "HJ-002" },
  { title: "Crinkle Cotton Hijab - Olive", price: 750, type: "Hijabs", sku: "HJ-003" },
  { title: "Silk Blend Occasion Hijab", price: 1200, type: "Hijabs", sku: "HJ-004", isHot: true },
  { title: "Modal Wrap Hijab - Black", price: 900, type: "Hijabs", sku: "HJ-005" },
  { title: "Georgette Floral Print Hijab", price: 950, type: "Hijabs", sku: "HJ-006" },
  { title: "Instant Slip-on Hijab - Grey", price: 700, type: "Hijabs", sku: "HJ-007" },
  { title: "Luxury Satin Hijab - Gold", price: 1500, type: "Hijabs", sku: "HJ-008", isHot: true },
  { title: "Pearl Embellished Hijab", price: 1800, type: "Hijabs", sku: "HJ-009" },
  { title: "Basic Viscose Undercap + Hijab Set", price: 1100, type: "Hijabs", sku: "HJ-010" }
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

    const brandId = await ensureBrand('Modest Wear', adminUser._id);
    const categoryId = await ensureCategory('Hijabs');
    
    console.log('Uploading Hijab Image...');
    const hijabImageId = await uploadLocalImageToCloudinary(HIJAB_IMG_PATH);

    console.log('\n--- Uploading 10 New Hijab Products ---');
    for (const p of newProducts) {
      const product = await Product.create({
        title: p.title,
        description: `High quality ${p.title} for women, offering elegance and comfort.`,
        price: p.price,
        sku: p.sku,
        productType: p.isHot ? 'Hot deals' : 'Popular',
        brand: brandId,
        category: categoryId,
        isActive: true,
        approvalStatus: 'approved',
        publicationStatus: 'published',
        images: [hijabImageId],
        priceType: 'single',
      });
      console.log(`✅ Created: ${product.title} (${p.type})`);
    }

    console.log('\n🎉 Successfully uploaded 10 Hijab products!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Script failed:', err);
    process.exit(1);
  }
}

main();
