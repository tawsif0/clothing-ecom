const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// MUST load dotenv before anything else that uses process.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const { uploadImageBuffer } = require('../config/cloudinary');

const imagesToUpload = [
  {
    title: 'Floral Summer Dress',
    filePath: 'C:\\Users\\arbei\\.gemini\\antigravity-ide\\brain\\b2ac158f-60a7-412c-9763-6afaa854f510\\floral_dress_1779527968418.png'
  },
  {
    title: 'Denim Jacket',
    filePath: 'C:\\Users\\arbei\\.gemini\\antigravity-ide\\brain\\b2ac158f-60a7-412c-9763-6afaa854f510\\denim_jacket_1779528929644.png'
  },
  {
    title: 'Striped T‑Shirt',
    filePath: 'C:\\Users\\arbei\\.gemini\\antigravity-ide\\brain\\b2ac158f-60a7-412c-9763-6afaa854f510\\striped_tshirt_1779528947106.png'
  }
];

async function main() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    for (const item of imagesToUpload) {
      const product = await Product.findOne({ title: item.title });
      if (!product) {
        console.log(`⚠️ Product not found: ${item.title}`);
        continue;
      }

      if (!fs.existsSync(item.filePath)) {
        console.log(`⚠️ Image file not found: ${item.filePath}`);
        continue;
      }

      console.log(`Uploading image for ${item.title}...`);
      const buffer = fs.readFileSync(item.filePath);
      
      const uploaded = await uploadImageBuffer(buffer, {
        folder: "marketplace/products",
        resource_type: "image",
      });

      if (uploaded && uploaded.secure_url) {
        // Create new ProductImage
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

        // Update product to use only this new image
        product.images = [newImg._id];
        await product.save();
        console.log(`✅ Updated ${item.title} with real image: ${uploaded.secure_url}`);
      }
    }

    console.log('🎉 Done updating images!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
