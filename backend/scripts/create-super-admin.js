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

const createSuperAdmin = async () => {
  try {
    await connect();
    console.log("Connected to MongoDB.");

    const email = "super@admin.com";
    let admin = await User.findOne({ email });

    const superAdminSettings = {
      isSuperAdmin: true,
      permissions: {
        manageOrders: true,
        manageProducts: true,
        manageUsers: true,
        manageReports: true,
        manageWebsite: true
      }
    };

    if (!admin) {
      admin = await User.create({
        name: "Super Admin",
        email: email,
        phone: "01999887766",
        password: "superpassword123",
        userType: "admin",
        status: "active",
        adminSettings: superAdminSettings
      });
      console.log("Super Admin created successfully!");
    } else {
      // Update existing to super admin
      admin.password = "superpassword123";
      admin.userType = "admin";
      admin.adminSettings = superAdminSettings;
      await admin.save();
      console.log("Updated existing user to Super Admin!");
    }

    console.log(`Credentials -> Email: ${email} | Password: superpassword123`);
    process.exit(0);
  } catch (err) {
    console.error("Error creating super admin:", err);
    process.exit(1);
  }
};

createSuperAdmin();
