/**
 * Bulk‑create three “Three Piece” girl‑clothing products with images.
 * ---------------------------------------------------------------
 * 1️⃣  Generates placeholder images (via placehold.co) – no manual upload needed.
 * 2️⃣  If a brand named “Girls Clothing” does not exist, it creates it.
 * 3️⃣  If a category named “Three Piece” does not exist, it creates it.
 * 4️⃣  Sends a multipart/form‑data POST request to the product create endpoint.
 *
 * Run with:
 *   node backend/scripts/createThreePieceProducts.js
 *
 * Prerequisites:
 *   • Backend server must be running (npm run dev or node server.js)
 *   • `axios` and `form-data` are installed (`npm i axios form-data`)
 *   • .env contains VITE_API_URL (e.g. http://localhost:3000)
 */

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const User = require('../models/User');
const ProductImage = require('../models/ProductImage');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
// Helpers
// ---------------------------------------------------------------------------
async function downloadImage(url, dest) {
  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  await new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(dest);
    response.data.pipe(stream);
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

/**
 * Ensure a brand exists, otherwise create it.
 * Returns the brand ID.
 */
async function ensureBrand(name, adminId) {
  let brand = await Brand.findOne({ name });
  if (brand) return brand._id;

  brand = await Brand.create({
    name,
    description: `${name} brand`,
    isActive: true,
    createdBy: adminId,
    vendor: null
  });
  return brand._id;
}

/**
 * Ensure a category exists, otherwise create it.
 * Returns the category ID.
 */
async function ensureCategory(name) {
  let category = await Category.findOne({ name });
  if (category) return category._id;

  category = await Category.create({
    name,
    description: `${name} category`,
    isActive: true,
  });
  return category._id;
}

async function createPlaceholderImage(text) {
  const url = `https://placehold.co/400x500?text=${encodeURIComponent(text)}`;
  const img = await ProductImage.create({ data: url, publicId: '', mimeType: 'image/png', size: 0, format: 'png', width: 400, height: 500, resourceType: 'image' });
  return img._id;
}

// ---------------------------------------------------------------------------
// Main workflow
// ---------------------------------------------------------------------------
(async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    const adminUser = await User.findOne({ userType: 'admin' });
    if (!adminUser) {
        throw new Error("Admin user not found");
    }

    // ---- 1️⃣ Get brand & category IDs -------------------------------------------------
    const brandId = await ensureBrand('Girls Clothing', adminUser._id);
    const categoryId = await ensureCategory('Three Piece');

    // ---- 2️⃣ Define product data -------------------------------------------------------
    const products = [
      {
        title: 'Floral Summer Dress',
        description: 'Light‑weight floral dress perfect for summer outings.',
        price: 49.99,
        salePrice: 39.99,
        sku: 'FLD-001',
        productType: 'Popular',
        images: [
          'https://placehold.co/400x500?text=Floral%20Dress%201',
          'https://placehold.co/400x500?text=Floral%20Dress%202',
        ],
      },
      {
        title: 'Denim Jacket',
        description: 'Classic denim jacket with a comfy fit for teenage girls.',
        price: 79.99,
        salePrice: 69.99,
        sku: 'DJ-002',
        productType: 'Hot deals',
        images: ['https://placehold.co/400x500?text=Denim%20Jacket'],
      },
      {
        title: 'Striped T‑Shirt',
        description: 'Casual striped tee made from breathable cotton.',
        price: 29.99,
        salePrice: 24.99,
        sku: 'STS-003',
        productType: 'Latest',
        images: ['https://placehold.co/400x500?text=Striped%20T-Shirt'],
      },
    ];

    // ---- 3️⃣ Loop through products and insert directly -------------------------
    for (const p of products) {
      const imageIds = [];
      for (const imgText of p.images) {
         // placehold.co images now extracted from the raw URL text logic
         const match = imgText.match(/text=(.*)$/);
         const text = match ? decodeURIComponent(match[1]) : p.title;
         const imgId = await createPlaceholderImage(text);
         imageIds.push(imgId);
      }

      const product = await Product.create({
        title: p.title,
        description: p.description,
        price: p.price,
        sku: p.sku,
        productType: p.productType,
        brand: brandId,
        category: categoryId,
        isActive: true,
        approvalStatus: 'approved',
        publicationStatus: 'published',
        images: imageIds,
        priceType: 'single',
      });

      console.log(`✅ Created product: ${product.title}`);
    }

    console.log('🎉 All three products uploaded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Script failed:', err);
    process.exit(1);
  }
})();
