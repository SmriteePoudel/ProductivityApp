import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../lib/models/User.js";

const connectMongoDB = async () => {
  try {
    const connectionString =
      process.env.MONGODB_URI || "mongodb://localhost:27017/productivity-app";
    await mongoose.connect(connectionString);
    console.log("✅ Connected to MongoDB");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    return false;
  }
};

const createUsers = async () => {
  console.log("🔧 Creating/updating users in MongoDB...");

  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: true,
        canReset: true,
        canManageUsers: true,
        canManageRoles: true,
        canManagePermissions: true,
        canAccessAdminPanel: true,
        canViewAnalytics: true,
        canExportData: true,
        canImportData: true,
        canOverridePermissions: true,
      },
    },
    {
      name: "HR Manager",
      email: "hr@example.com",
      password: "hr123",
      role: "hr",
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: false,
        canView: true,
        canManageHR: true,
        canViewAnalytics: true,
        canExportData: true,
      },
    },
    {
      name: "Marketing Specialist",
      email: "marketing@example.com",
      password: "marketing123",
      role: "marketing",
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: false,
        canView: true,
        canManageMarketing: true,
        canViewAnalytics: true,
        canExportData: true,
      },
    },
    {
      name: "Finance Manager",
      email: "finance@example.com",
      password: "finance123",
      role: "finance",
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: false,
        canView: true,
        canManageFinance: true,
        canViewAnalytics: true,
        canExportData: true,
      },
    },
    {
      name: "Blog Writer",
      email: "blog@example.com",
      password: "blog123",
      role: "blog_writer",
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: false,
        canView: true,
        canManageBlog: true,
        canShareContent: true,
      },
    },
    {
      name: "SEO Manager",
      email: "seo@example.com",
      password: "seo123",
      role: "seo_manager",
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: false,
        canView: true,
        canManageSEO: true,
        canViewAnalytics: true,
        canExportData: true,
      },
    },
    {
      name: "Project Manager",
      email: "pm@example.com",
      password: "pm123",
      role: "project_manager",
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: false,
        canView: true,
        canManageProjects: true,
        canManageTeams: true,
        canInviteUsers: true,
        canViewAnalytics: true,
      },
    },
    {
      name: "Developer",
      email: "dev@example.com",
      password: "dev123",
      role: "developer",
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: false,
        canView: true,
        canManageDevelopment: true,
        canManageProjects: true,
        canViewAnalytics: true,
      },
    },
    {
      name: "Designer",
      email: "design@example.com",
      password: "design123",
      role: "designer",
      permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: false,
        canView: true,
        canManageDesign: true,
        canShareContent: true,
        canViewAnalytics: true,
      },
    },
  ];

  for (const userData of users) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Check if user exists
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        // Update existing user
        existingUser.name = userData.name;
        existingUser.password = hashedPassword;
        existingUser.role = userData.role;
        existingUser.permissions = userData.permissions;
        await existingUser.save();
        console.log(`   ✅ Updated user: ${userData.email} (${userData.role})`);
      } else {
        // Create new user
        const newUser = new User({
          ...userData,
          password: hashedPassword,
        });
        await newUser.save();
        console.log(`   ✅ Created user: ${userData.email} (${userData.role})`);
      }
    } catch (error) {
      console.error(`   ❌ Error with user ${userData.email}:`, error.message);
    }
  }
};

// Test MongoDB authentication
const testMongoDBAuth = async () => {
  console.log("\n🧪 Testing MongoDB authentication...");

  try {
    const adminUser = await User.findOne({ email: "admin@example.com" });
    if (!adminUser) {
      console.log("❌ Admin user not found in MongoDB");
      return;
    }

    console.log("✅ Admin user found in MongoDB:");
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);

    // Test password
    const isValidPassword = await bcrypt.compare(
      "admin123",
      adminUser.password
    );
    console.log(`   Password valid: ${isValidPassword ? "✅ YES" : "❌ NO"}`);

    if (isValidPassword) {
      console.log("\n🎉 MongoDB authentication test PASSED!");
    } else {
      console.log("\n❌ MongoDB authentication test FAILED!");
    }
  } catch (error) {
    console.error("❌ MongoDB auth test error:", error);
  }
};

// Main function
const main = async () => {
  console.log("🚀 Setting up MongoDB users...");

  const connected = await connectMongoDB();
  if (!connected) {
    console.log("❌ Cannot connect to MongoDB. Exiting.");
    process.exit(1);
  }

  await createUsers();
  await testMongoDBAuth();

  console.log("\n📋 Login Credentials:");
  console.log("=====================");
  console.log("Admin: admin@example.com / admin123");
  console.log("HR: hr@example.com / hr123");
  console.log("Marketing: marketing@example.com / marketing123");
  console.log("Finance: finance@example.com / finance123");
  console.log("Blog: blog@example.com / blog123");
  console.log("SEO: seo@example.com / seo123");
  console.log("Project Manager: pm@example.com / pm123");
  console.log("Developer: dev@example.com / dev123");
  console.log("Designer: design@example.com / design123");

  await mongoose.disconnect();
  console.log("\n✅ MongoDB users setup complete!");
};

main().catch(console.error);
