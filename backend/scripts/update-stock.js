const path = require('path');
const dotenv = require('dotenv');

// Load dotenv
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const Product = require('../models/Product');

async function main() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined in .env");
    }

    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    // Retrieve all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products in the database.`);

    let updatedCount = 0;

    for (const product of products) {
      let isModified = false;

      // Update main stock to 100
      if (product.stock !== 100) {
        product.stock = 100;
        isModified = true;
      }

      // If the product has variations, update each variation's stock to 100 as well
      if (product.variations && product.variations.length > 0) {
        product.variations.forEach((variation) => {
          if (variation.stock !== 100) {
            variation.stock = 100;
            isModified = true;
          }
        });
        // Inform Mongoose variations array has changed
        product.markModified('variations');
      }

      if (isModified) {
        await product.save();
        console.log(`✅ Updated stock to 100 for product: "${product.title || product.name || product._id}"`);
        updatedCount++;
      }
    }

    console.log(`🎉 Stock update completed! Updated stock for ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating product stocks:', error);
    process.exit(1);
  }
}

main();
