require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGODB_DBNAME || "ecommerce_single"
  });
};

const seedCategories = async () => {
  try {
    await connect();
    console.log("Connected to MongoDB.");

    const categories = [
      { name: "Abayas", type: "Women", status: "active", isActive: true },
      { name: "Hijabs", type: "Women", status: "active", isActive: true },
      { name: "Outerwear", type: "Unisex", status: "active", isActive: true },
      { name: "Panjabi", type: "Men", status: "active", isActive: true },
      { name: "T-Shirts", type: "Men", status: "active", isActive: true },
      { name: "Jewellery", type: "Accessories", status: "active", isActive: true },
      { name: "Polo Shirts", type: "Men", status: "active", isActive: true }
    ];

    for (const cat of categories) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        { $set: cat },
        { upsert: true, new: true }
      );
      console.log(`Ensured category: ${cat.name} is active.`);
    }

    // Ensure any existing categories are active so they show up
    await Category.updateMany({}, { $set: { isActive: true } });

    console.log("Categories checked and seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding categories:", err);
    process.exit(1);
  }
};

seedCategories();
