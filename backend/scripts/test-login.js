require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.MONGODB_DBNAME || "ecommerce_single"
    });
    
    console.log("Connected to MongoDB");

    const user = await User.findOne({ email: "admin@admin.com" });
    if (!user) {
      console.log("User not found!");
      process.exit(1);
    }
    
    console.log("User found:", user.email, "Type:", user.userType);
    
    const isMatch = await bcrypt.compare("password123", user.password);
    console.log("Password matches?", isMatch);

    try {
      const loggedIn = await User.findByCredentials("admin@admin.com", "password123");
      console.log("findByCredentials success:", loggedIn.email);
    } catch(e) {
      console.log("findByCredentials error:", e.message);
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

testLogin();
