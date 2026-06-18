import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./src/modules/auth/auth.model.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin user already exists. Overwriting password...");
      existingAdmin.password = "22222222";
      await existingAdmin.save();
      console.log("Admin password updated!");
    } else {
      const newAdmin = new User({
        name: "Super Admin",
        email: "admin@gmail.com",
        password: "22222222",
        role: "admin",
      });

      await newAdmin.save();
      console.log("Admin user created successfully!");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding admin:", error);
    mongoose.connection.close();
  }
};

seedAdmin();
