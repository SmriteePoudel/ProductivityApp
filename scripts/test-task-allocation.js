import mongoose from "mongoose";
import Task from "../lib/models/Task.js";
import User from "../lib/models/User.js";

const testTaskAllocation = async () => {
  console.log("🧪 Testing Task Allocation System...");

  try {
    const connectionString =
      process.env.MONGODB_URI || "mongodb://localhost:27017/productivity-app";
    await mongoose.connect(connectionString);
    console.log("✅ Connected to MongoDB");

    const nonAdminUser = await User.findOne({ role: { $ne: "admin" } });
    if (!nonAdminUser) {
      console.log(
        "❌ No non-admin users found. Please create some users first."
      );
      return;
    }

    console.log(
      `✅ Found user to assign tasks to: ${nonAdminUser.name} (${nonAdminUser.email})`
    );

    const testTask = new Task({
      title: "Test Task from Admin",
      description: "This is a test task assigned by the admin",
      status: "pending",
      priority: "high",
      category: "work",
      user: nonAdminUser._id,
      assignedBy: "admin",
      assignedAt: new Date(),
      assignedToName: nonAdminUser.name,
    });

    await testTask.save();
    console.log("✅ Test task created and assigned successfully");

    const savedTask = await Task.findById(testTask._id);
    console.log("📋 Task details:");
    console.log(`   Title: ${savedTask.title}`);
    console.log(`   Assigned to: ${savedTask.assignedToName}`);
    console.log(`   Assigned by: ${savedTask.assignedBy}`);
    console.log(`   Status: ${savedTask.status}`);
    console.log(`   Priority: ${savedTask.priority}`);

    const adminAssignedTasks = await Task.find({ assignedBy: "admin" });
    console.log(
      `\n📊 Total tasks assigned by admin: ${adminAssignedTasks.length}`
    );

    const userTasks = await Task.find({ user: nonAdminUser._id });
    console.log(`📊 Total tasks for ${nonAdminUser.name}: ${userTasks.length}`);

    console.log("\n🎉 Task allocation system test PASSED!");
    console.log("\n📋 Next steps:");
    console.log("1. Login as admin (admin@example.com / admin123)");
    console.log("2. Go to Task Allocation tab");
    console.log("3. Assign tasks to users");
    console.log("4. Login as other users to see their assigned tasks");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Task allocation test failed:", error);
  }
};

testTaskAllocation();
