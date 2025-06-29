import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Task from "./models/Task.js";
import Project from "./models/Project.js";
import Page from "./models/Page.js";

// Sample data for seeding with comprehensive permissions
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    bio: "System administrator with full access to all features and complete control over the system.",
    permissions: User.getDefaultPermissions("admin"),
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
    bio: "Product manager working on multiple projects with standard user permissions.",
    permissions: User.getDefaultPermissions("user"),
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "moderator",
    bio: "Team lead managing development tasks with enhanced permissions for team management.",
    permissions: User.getDefaultPermissions("moderator"),
  },
  {
    name: "Bob Wilson",
    email: "bob@example.com",
    password: "password123",
    role: "user",
    bio: "Developer focused on frontend tasks with limited delete permissions.",
    permissions: {
      ...User.getDefaultPermissions("user"),
      canDelete: false, // Custom permission override
    },
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    role: "viewer",
    bio: "Stakeholder reviewing project progress with read-only access.",
    permissions: User.getDefaultPermissions("viewer"),
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "password123",
    role: "editor",
    bio: "Content editor with ability to create and edit but not delete content.",
    permissions: User.getDefaultPermissions("editor"),
  },
  {
    name: "Diana Prince",
    email: "diana@example.com",
    password: "password123",
    role: "moderator",
    bio: "Senior moderator with additional analytics access.",
    permissions: {
      ...User.getDefaultPermissions("moderator"),
      canViewAnalytics: true,
      canExportData: true,
    },
  },
  {
    name: "Edward Norton",
    email: "edward@example.com",
    password: "password123",
    role: "user",
    bio: "Junior developer with basic user permissions.",
    permissions: User.getDefaultPermissions("user"),
  },
  {
    name: "Fiona Gallagher",
    email: "fiona@example.com",
    password: "password123",
    role: "viewer",
    bio: "Client representative with read-only access to specific projects.",
    permissions: {
      ...User.getDefaultPermissions("viewer"),
      canViewAnalytics: true, // Can view project analytics
    },
  },
  {
    name: "George Lucas",
    email: "george@example.com",
    password: "password123",
    role: "editor",
    bio: "Creative director with enhanced editing capabilities.",
    permissions: {
      ...User.getDefaultPermissions("editor"),
      canShareContent: true,
      canInviteUsers: true,
    },
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
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    tags: ["work", "proposal", "quarterly"],
    isImportant: true,
    estimatedTime: 120, // 2 hours
  },
  {
    title: "Review code changes",
    description: "Review pull requests for the authentication module.",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    tags: ["work", "code-review", "authentication"],
    isImportant: false,
    estimatedTime: 60, // 1 hour
  },
  {
    title: "Morning workout",
    description: "Complete 30-minute cardio session and strength training.",
    status: "completed",
    priority: "medium",
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    tags: ["health", "workout", "morning"],
    isImportant: true,
    estimatedTime: 30,
    actualTime: 35,
  },
  {
    title: "Read React documentation",
    description: "Study the latest React hooks and best practices.",
    status: "pending",
    priority: "low",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    tags: ["learning", "react", "documentation"],
    isImportant: false,
    estimatedTime: 90, // 1.5 hours
  },
  {
    title: "Pay utility bills",
    description: "Pay electricity, water, and internet bills for this month.",
    status: "pending",
    priority: "high",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    tags: ["finance", "bills", "utilities"],
    isImportant: true,
    estimatedTime: 15, // 15 minutes
  },
  {
    title: "Plan weekend trip",
    description:
      "Research and plan activities for the upcoming weekend getaway.",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    tags: ["travel", "planning", "weekend"],
    isImportant: false,
    estimatedTime: 45, // 45 minutes
  },
  {
    title: "Buy groceries",
    description:
      "Purchase weekly groceries including fruits, vegetables, and household items.",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    tags: ["shopping", "groceries", "weekly"],
    isImportant: false,
    estimatedTime: 60, // 1 hour
  },
  {
    title: "Clean apartment",
    description:
      "Deep clean the apartment including kitchen, bathroom, and living room.",
    status: "pending",
    priority: "low",
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    tags: ["home", "cleaning", "maintenance"],
    isImportant: false,
    estimatedTime: 120, // 2 hours
  },
];

const sampleProjects = [
  {
    name: "E-commerce Platform",
    description: "Building a modern e-commerce platform with React and Node.js",
    color: "#3B82F6",
    icon: "🛍️",
    status: "active",
    files: [
      {
        name: "project-requirements.pdf",
        type: "application/pdf",
        size: 2048576,
        url: "/uploads/projects/requirements.pdf",
      },
      {
        name: "design-mockups.fig",
        type: "application/fig",
        size: 1048576,
        url: "/uploads/projects/mockups.fig",
      },
    ],
  },
  {
    name: "Mobile App Development",
    description: "Creating a cross-platform mobile app using React Native",
    color: "#10B981",
    icon: "📱",
    status: "active",
    files: [
      {
        name: "app-specification.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 1536000,
        url: "/uploads/projects/spec.docx",
      },
    ],
  },
  {
    name: "Data Analysis Dashboard",
    description: "Developing a real-time data visualization dashboard",
    color: "#8B5CF6",
    icon: "📊",
    status: "on-hold",
    files: [],
  },
  {
    name: "API Documentation",
    description: "Comprehensive API documentation for the backend services",
    color: "#F59E0B",
    icon: "📖",
    status: "completed",
    files: [
      {
        name: "api-docs.html",
        type: "text/html",
        size: 512000,
        url: "/uploads/projects/api-docs.html",
      },
    ],
  },
];

const samplePages = [
  {
    name: "Meeting Notes",
    boxes: [
      {
        type: "text",
        content:
          "Team Meeting - January 15, 2024\n\nAgenda:\n- Q1 goals review\n- New feature planning\n- Resource allocation\n\nAction Items:\n- John: Prepare budget proposal\n- Jane: Research new technologies\n- Bob: Update project timeline",
      },
    ],
  },
  {
    name: "Project Ideas",
    boxes: [
      {
        type: "text",
        content:
          "Future Project Ideas:\n\n1. AI-powered task prioritization\n2. Time tracking integration\n3. Team collaboration features\n4. Mobile app development\n5. Advanced analytics dashboard",
      },
    ],
  },
  {
    name: "Personal Goals",
    boxes: [
      {
        type: "text",
        content:
          "2024 Personal Goals:\n\nHealth:\n- Exercise 4 times per week\n- Maintain healthy diet\n- Get 8 hours of sleep\n\nCareer:\n- Learn React Native\n- Complete AWS certification\n- Lead a major project\n\nPersonal:\n- Read 24 books this year\n- Travel to 3 new countries\n- Learn to play guitar",
      },
    ],
  },
];

// Role descriptions for documentation
const roleDescriptions = {
  admin: {
    name: "Administrator",
    description:
      "Full system access with complete control over all features, users, and data.",
    capabilities: [
      "Create, read, update, delete all content",
      "Manage users and roles",
      "Access admin panel and analytics",
      "Export and import data",
      "Override permissions",
      "View all data across the system",
      "Bulk operations",
      "System configuration",
    ],
    color: "#DC2626", // Red
    icon: "👑",
  },
  moderator: {
    name: "Moderator",
    description:
      "Enhanced user with team management capabilities and administrative access.",
    capabilities: [
      "Create, read, update, delete content",
      "Manage users (but not roles)",
      "Access admin panel",
      "View analytics and export data",
      "Invite users and manage teams",
      "Bulk operations",
      "View all data",
    ],
    color: "#7C3AED", // Purple
    icon: "🛡️",
  },
  editor: {
    name: "Editor",
    description:
      "Content creator with ability to create and edit but not delete content.",
    capabilities: [
      "Create and edit content",
      "View content",
      "Share content",
      "Cannot delete content",
      "No administrative access",
    ],
    color: "#059669", // Green
    icon: "✏️",
  },
  user: {
    name: "User",
    description:
      "Standard user with basic CRUD operations on their own content.",
    capabilities: [
      "Create, read, update, delete own content",
      "Share content",
      "View own data",
      "No administrative access",
    ],
    color: "#3B82F6", // Blue
    icon: "👤",
  },
  viewer: {
    name: "Viewer",
    description: "Read-only access for stakeholders and external parties.",
    capabilities: [
      "View content only",
      "Cannot create, edit, or delete",
      "Limited access to shared content",
      "No administrative access",
    ],
    color: "#6B7280", // Gray
    icon: "👁️",
  },
};

// Helper function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to get random items from an array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get random date within a range
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Main seeding function
export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    await User.deleteMany({});
    await Category.deleteMany({});
    await Task.deleteMany({});
    await Project.deleteMany({});
    await Page.deleteMany({});

    // Create users
    console.log("👥 Creating users...");
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${savedUser.name} (${savedUser.email})`);
    }

    // Create categories for each user
    console.log("📂 Creating categories...");
    const createdCategories = [];
    for (const user of createdUsers) {
      const userCategories = sampleCategories.map((categoryData) => ({
        ...categoryData,
        user: user._id,
      }));

      for (const categoryData of userCategories) {
        const category = new Category(categoryData);
        const savedCategory = await category.save();
        createdCategories.push(savedCategory);
      }
      console.log(
        `✅ Created ${userCategories.length} categories for ${user.name}`
      );
    }

    // Create tasks for each user
    console.log("📝 Creating tasks...");
    for (const user of createdUsers) {
      const userCategories = createdCategories.filter(
        (cat) => cat.user.toString() === user._id.toString()
      );

      // Create 3-8 tasks per user
      const taskCount = Math.floor(Math.random() * 6) + 3;
      const userTasks = getRandomItems(sampleTasks, taskCount);

      for (const taskData of userTasks) {
        const randomCategory =
          userCategories.length > 0
            ? getRandomItems(userCategories, 1)[0]._id
            : null;

        const task = new Task({
          ...taskData,
          user: user._id,
          category: randomCategory,
        });
        await task.save();
      }
      console.log(`✅ Created ${taskCount} tasks for ${user.name}`);
    }

    // Create projects for each user
    console.log("📁 Creating projects...");
    for (const user of createdUsers) {
      // Create 2-4 projects per user
      const projectCount = Math.floor(Math.random() * 3) + 2;
      const userProjects = getRandomItems(sampleProjects, projectCount);

      for (const projectData of userProjects) {
        const project = new Project({
          ...projectData,
          user: user._id,
        });
        await project.save();
      }
      console.log(`✅ Created ${projectCount} projects for ${user.name}`);
    }

    // Create pages for each user
    console.log("📄 Creating pages...");
    for (const user of createdUsers) {
      // Create 1-3 pages per user
      const pageCount = Math.floor(Math.random() * 3) + 1;
      const userPages = getRandomItems(samplePages, pageCount);

      for (const pageData of userPages) {
        const page = new Page({
          ...pageData,
          user: user._id,
        });
        await page.save();
      }
      console.log(`✅ Created ${pageCount} pages for ${user.name}`);
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Tasks: ${await Task.countDocuments()}`);
    console.log(`   - Projects: ${await Project.countDocuments()}`);
    console.log(`   - Pages: ${await Page.countDocuments()}`);

    // Display login credentials
    console.log("\n🔑 Login Credentials:");
    createdUsers.forEach((user) => {
      const password =
        sampleUsers.find((u) => u.email === user.email)?.password ||
        "password123";
      console.log(`   ${user.name} (${user.email}): ${password}`);
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

// Function to seed specific data
export const seedUsers = async () => {
  try {
    console.log("👥 Seeding users only...");
    await connectDB();

    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const hashedPassword = await hashPassword(userData.password);
        const user = new User({
          ...userData,
          password: hashedPassword,
        });
        await user.save();
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      } else {
        console.log(`⏭️ User already exists: ${userData.email}`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};

export const seedCategories = async () => {
  try {
    console.log("📂 Seeding categories...");
    await connectDB();

    const users = await User.find({});
    for (const user of users) {
      for (const categoryData of sampleCategories) {
        const existingCategory = await Category.findOne({
          name: categoryData.name,
          user: user._id,
        });

        if (!existingCategory) {
          const category = new Category({
            ...categoryData,
            user: user._id,
          });
          await category.save();
          console.log(`✅ Created category: ${category.name} for ${user.name}`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
};

// Function to reset database
export const resetDatabase = async () => {
  try {
    console.log("🗑️ Resetting database...");
    await connectDB();

    await User.deleteMany({});
    await Category.deleteMany({});
    await Task.deleteMany({});
    await Project.deleteMany({});
    await Page.deleteMany({});

    console.log("✅ Database reset completed!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  }
};

// Export individual seeding functions
export {
  sampleUsers,
  sampleCategories,
  sampleTasks,
  sampleProjects,
  samplePages,
};

// If this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];

  switch (command) {
    case "seed":
      seedDatabase();
      break;
    case "users":
      seedUsers();
      break;
    case "categories":
      seedCategories();
      break;
    case "reset":
      resetDatabase();
      break;
    default:
      console.log("Usage: node seeder.js [seed|users|categories|reset]");
      console.log("  seed      - Seed all data");
      console.log("  users     - Seed users only");
      console.log("  categories - Seed categories only");
      console.log("  reset     - Reset all data");
  }
}
