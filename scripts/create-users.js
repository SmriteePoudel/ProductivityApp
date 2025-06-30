import { connectDB } from "../lib/db.js";
import User from "../lib/models/User.js";
import { hashPassword } from "../lib/auth.js";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    bio: "System administrator with full access to all features and complete control over the system.",
  },
  {
    name: "HR Manager",
    email: "hr@example.com",
    password: "hr123",
    role: "hr",
    bio: "Human Resources manager responsible for employee management and team coordination.",
  },
  {
    name: "Marketing Specialist",
    email: "marketing@example.com",
    password: "marketing123",
    role: "marketing",
    bio: "Marketing specialist focused on campaigns, content creation, and brand management.",
  },
  {
    name: "Finance Manager",
    email: "finance@example.com",
    password: "finance123",
    role: "finance",
    bio: "Finance manager handling budgets, expenses, and financial reporting.",
  },
  {
    name: "Blog Writer",
    email: "blog@example.com",
    password: "blog123",
    role: "blog_writer",
    bio: "Content writer creating engaging blog posts and articles for the company.",
  },
  {
    name: "SEO Manager",
    email: "seo@example.com",
    password: "seo123",
    role: "seo_manager",
    bio: "SEO specialist optimizing content and managing search engine rankings.",
  },
  {
    name: "Project Manager",
    email: "pm@example.com",
    password: "pm123",
    role: "project_manager",
    bio: "Project manager coordinating development teams and managing project timelines.",
  },
  {
    name: "Developer",
    email: "dev@example.com",
    password: "dev123",
    role: "developer",
    bio: "Software developer working on application development and code implementation.",
  },
  {
    name: "Designer",
    email: "design@example.com",
    password: "design123",
    role: "designer",
    bio: "UI/UX designer creating beautiful and functional user interfaces.",
  },
];

async function createUsers() {
  try {
    console.log("🌱 Starting user creation...");
    await connectDB();

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      const hashedPassword = await hashPassword(userData.password);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      await user.save();
      console.log(
        `✅ Created user: ${userData.name} (${userData.email}) - Role: ${userData.role}`
      );
    }

    console.log("\n🎉 User creation completed!");
    console.log("\n📋 Login Credentials:");
    console.log("=====================");
    users.forEach((user) => {
      console.log(`${user.name} (${user.role}):`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error creating users:", error);
  }
}

createUsers().then(() => process.exit(0));
