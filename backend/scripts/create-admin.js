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

    const email = "sadmin@gmail.com";
    const phone = "01711223344";

    // 1. Check if there's any user with the same phone but a different email
    // to avoid duplicate key errors.
    const duplicatePhoneUser = await User.findOne({ 
      phone: User.normalizePhone(phone), 
      email: { $ne: email } 
    });
    if (duplicatePhoneUser) {
      console.log(`Found another user with phone ${phone} (${duplicatePhoneUser.email}). Deleting it to prevent duplicate phone constraint...`);
      await User.deleteOne({ _id: duplicatePhoneUser._id });
    }

    // 2. Find or create the admin user
    let admin = await User.findOne({ email });
    if (!admin) {
      console.log("Admin not found. Creating a new one...");
      admin = new User({ email });
    } else {
      console.log("Admin found. Updating credentials...");
    }

    admin.name = "Super Admin";
    admin.phone = phone;
    admin.password = "Admin0155@";
    admin.userType = "admin";
    admin.status = "active";
    admin.adminSettings = {
      isSuperAdmin: true,
      permissions: {
        manageOrders: true,
        manageProducts: true,
        manageUsers: true,
        manageReports: true,
        manageWebsite: true
      }
    };

    await admin.save();
    console.log("Admin saved/updated successfully!");
    console.log(`Credentials -> Email: ${email} | Password: Admin0155@`);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
