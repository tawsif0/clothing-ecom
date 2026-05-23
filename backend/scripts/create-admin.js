require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGODB_DBNAME || "ecommerce_single"
  });
};

const createAdmin = async () => {
  try {
    await connect();
    console.log("Connected to MongoDB.");

    const email = "admin@admin.com";
    let admin = await User.findOne({ email });

    if (!admin) {
      admin = await User.create({
        name: "Super Admin",
        email: email,
        phone: "01711223344",
        password: "password123",
        userType: "admin",
        status: "active",
        adminSettings: {}
      });
      console.log("Admin created successfully!");
    } else {
      // If it exists, let's update password
      admin.password = "password123";
      admin.userType = "admin";
      await admin.save();
      console.log("Admin already existed, updated password to password123!");
    }

    console.log(`Credentials -> Email: ${email} | Password: password123`);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
