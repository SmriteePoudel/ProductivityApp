import { connectDB } from "../lib/db.js";
import User from "../lib/models/User.js";
import { hashPassword } from "../lib/auth.js";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "HR Manager",
    email: "hr@example.com",
    password: "hr123",
    role: "hr",
  },
  {
    name: "Marketing Specialist",
    email: "marketing@example.com",
    password: "marketing123",
    role: "marketing",
  },
  {
    name: "Finance Manager",
    email: "finance@example.com",
    password: "finance123",
    role: "finance",
  },
  {
    name: "Blog Writer",
    email: "blog@example.com",
    password: "blog123",
    role: "blog_writer",
  },
  {
    name: "SEO Manager",
    email: "seo@example.com",
    password: "seo123",
    role: "seo_manager",
  },
  {
    name: "Project Manager",
    email: "pm@example.com",
    password: "pm123",
    role: "project_manager",
  },
  {
    name: "Developer",
    email: "dev@example.com",
    password: "dev123",
    role: "developer",
  },
  {
    name: "Designer",
    email: "design@example.com",
    password: "design123",
    role: "designer",
  },
];

async function resetAllPasswords() {
  try {
    console.log("🔧 Resetting all user passwords...");
    await connectDB();

    for (const userData of users) {
      const user = await User.findOne({ email: userData.email });

      if (user) {
        console.log(`✅ Resetting password for ${userData.name}...`);
        const hashedPassword = await hashPassword(userData.password);
        user.password = hashedPassword;
        await user.save();
        console.log(
          `   ✅ ${userData.email} password reset to: ${userData.password}`
        );
      } else {
        console.log(`❌ User not found: ${userData.email}`);
      }
    }

    console.log("\n🎉 All passwords reset successfully!");
    console.log("\n📋 Updated Login Credentials:");
    console.log("=============================");
    users.forEach((user) => {
      console.log(`${user.name} (${user.role}):`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error resetting passwords:", error);
  }
}

resetAllPasswords().then(() => process.exit(0));
