require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductImage = require('../models/ProductImage');

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    // Ensure a category exists – use first existing or create a generic one
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({ name: 'Girls Clothing', slug: 'girls-clothing', type: 'General' });
      console.log('🗂️ Created fallback category', category._id);
    }

    // Helper to create a placeholder image and return its ObjectId
    async function createPlaceholderImage(text) {
      const url = `https://placehold.co/400x500?text=${encodeURIComponent(text)}`;
      const img = await ProductImage.create({ data: url, publicId: '', mimeType: 'image/png', size: 0, format: 'png', width: 400, height: 500, resourceType: 'image' });
      return img._id;
    }

    const productsData = [
      { title: 'Girl Dress 1', description: 'Lovely summer dress for girls.', price: 49.99, imagesText: 'Girl%20Dress%201' },
      { title: 'Girl Dress 2', description: 'Comfortable cotton dress.', price: 39.99, imagesText: 'Girl%20Dress%202' },
      { title: 'Girl Dress 3', description: 'Elegant evening dress.', price: 79.99, imagesText: 'Girl%20Dress%203' },
    ];

    for (const data of productsData) {
      const imageId = await createPlaceholderImage(data.imagesText);
      const product = await Product.create({
        title: data.title,
        description: data.description,
        price: data.price,
        salePrice: data.price,
        priceType: 'fixed',
        category: category._id,
        productType: 'General',
        publicationStatus: 'published',
        approvalStatus: 'approved',
        isActive: true,
        images: [imageId],
      });
      console.log('🛍️ Created product', product.title, '=>', product._id);
    }

    console.log('✅ Sample products created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();
