import mongoose from "mongoose";
import User from "../lib/models/User.js";

const checkMongoDB = async () => {
  console.log("🔍 Checking MongoDB connection and users...");

  try {
    const connectionString =
      process.env.MONGODB_URI || "mongodb://localhost:27017/productivity-app";
    console.log(`Connecting to: ${connectionString}`);

    await mongoose.connect(connectionString);
    console.log("✅ Connected to MongoDB");

    const adminUser = await User.findOne({ email: "admin@example.com" });
    if (adminUser) {
      console.log("✅ Admin user found in MongoDB:");
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Has password: ${!!adminUser.password}`);
    } else {
      console.log("❌ Admin user NOT found in MongoDB");
    }

    const userCount = await User.countDocuments();
    console.log(`📊 Total users in MongoDB: ${userCount}`);

    const allUsers = await User.find({}, "name email role");
    console.log("👥 All users in MongoDB:");
    allUsers.forEach((user) => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });

    await mongoose.disconnect();
    console.log("✅ MongoDB check complete");
  } catch (error) {
    console.error("❌ MongoDB check failed:", error.message);
  }
};

checkMongoDB();
