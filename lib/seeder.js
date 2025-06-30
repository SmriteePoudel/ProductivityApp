import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Task from "./models/Task.js";
import Project from "./models/Project.js";
import Page from "./models/Page.js";
import { hashPassword } from "./auth.js";

// Role-based users with specific credentials
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

const sampleCategories = [
  { name: "Work", color: "#3B82F6", icon: "💼" },
  { name: "Personal", color: "#10B981", icon: "👤" },
  { name: "Health", color: "#EF4444", icon: "🏃‍♂️" },
  { name: "Learning", color: "#8B5CF6", icon: "📚" },
  { name: "Finance", color: "#F59E0B", icon: "💰" },
  { name: "Home", color: "#06B6D4", icon: "🏠" },
  { name: "Travel", color: "#84CC16", icon: "✈️" },
  { name: "Shopping", color: "#EC4899", icon: "🛒" },
];

const sampleTasks = [
  {
    title: "Complete project proposal",
    description:
      "Finish the quarterly project proposal document for the new feature development.",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tags: ["work", "proposal", "quarterly"],
    isImportant: true,
    estimatedTime: 120,
  },
  {
    title: "Review code changes",
    description: "Review pull requests for the authentication module.",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    tags: ["work", "code-review", "authentication"],
    isImportant: false,
    estimatedTime: 60,
  },
  {
    title: "Morning workout",
    description: "Complete 30-minute cardio session and strength training.",
    status: "completed",
    priority: "medium",
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ["health", "workout", "morning"],
    isImportant: true,
    estimatedTime: 30,
    actualTime: 35,
  },
];

const sampleProjects = [
  {
    name: "Website Redesign",
    description:
      "Complete overhaul of the company website with modern design and improved UX.",
    status: "in-progress",
    priority: "high",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    tags: ["design", "development", "ux"],
    budget: 15000,
    progress: 45,
  },
  {
    name: "Mobile App Development",
    description:
      "Development of a new mobile application for iOS and Android platforms.",
    status: "planning",
    priority: "medium",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    tags: ["mobile", "development", "ios", "android"],
    budget: 25000,
    progress: 10,
  },
];

const samplePages = [
  {
    title: "Project Guidelines",
    content:
      "Comprehensive guidelines for project management and development processes.",
    type: "documentation",
    tags: ["guidelines", "process", "management"],
    isPublic: true,
  },
  {
    title: "Team Meeting Notes",
    content:
      "Weekly team meeting notes and action items for the development team.",
    type: "notes",
    tags: ["meeting", "team", "notes"],
    isPublic: false,
  },
];

// Helper function to get random items from an array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get random date between start and end
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    await connectDB();

    // Seed users
    console.log("👥 Seeding users...");
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

    // Seed categories
    console.log("📂 Seeding categories...");
    for (const categoryData of sampleCategories) {
      const existingCategory = await Category.findOne({
        name: categoryData.name,
      });
      if (!existingCategory) {
        const category = new Category(categoryData);
        await category.save();
        console.log(`✅ Created category: ${category.name}`);
      }
    }

    // Seed tasks
    console.log("📝 Seeding tasks...");
    const allUsers = await User.find();
    const allCategories = await Category.find();

    for (const taskData of sampleTasks) {
      const task = new Task({
        ...taskData,
        userId: getRandomItems(allUsers, 1)[0]._id,
        categoryId: getRandomItems(allCategories, 1)[0]._id,
      });
      await task.save();
      console.log(`✅ Created task: ${task.title}`);
    }

    // Seed projects
    console.log("📊 Seeding projects...");
    for (const projectData of sampleProjects) {
      const project = new Project({
        ...projectData,
        userId: getRandomItems(allUsers, 1)[0]._id,
      });
      await project.save();
      console.log(`✅ Created project: ${project.name}`);
    }

    // Seed pages
    console.log("📄 Seeding pages...");
    for (const pageData of samplePages) {
      const page = new Page({
        ...pageData,
        userId: getRandomItems(allUsers, 1)[0]._id,
      });
      await page.save();
      console.log(`✅ Created page: ${page.title}`);
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

export const seedUsers = async () => {
  try {
    console.log("🌱 Starting user seeding...");
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

    console.log("🎉 User seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  }
};

export const seedCategories = async () => {
  try {
    console.log("📂 Seeding categories...");
    await connectDB();

    for (const categoryData of sampleCategories) {
      const existingCategory = await Category.findOne({
        name: categoryData.name,
      });
      if (!existingCategory) {
        const category = new Category(categoryData);
        await category.save();
        console.log(`✅ Created category: ${category.name}`);
      }
    }

    console.log("🎉 Category seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
};

export const resetDatabase = async () => {
  try {
    console.log("🗑️  Resetting database...");
    await connectDB();

    // Drop all collections
    await mongoose.connection.dropDatabase();
    console.log("✅ Database reset completed!");

    // Re-seed the database
    await seedDatabase();
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  }
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];

  switch (command) {
    case "users":
      seedUsers().then(() => process.exit(0));
      break;
    case "categories":
      seedCategories().then(() => process.exit(0));
      break;
    case "reset":
      resetDatabase().then(() => process.exit(0));
      break;
    default:
      seedDatabase().then(() => process.exit(0));
  }
}
