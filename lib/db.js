import mongoose from "mongoose";
import User from "./models/User.js";
import Task from "./models/Task.js";
import Category from "./models/Category.js";
import Project from "./models/Project.js";
import Page from "./models/Page.js";

// MongoDB connection with connection pooling
let isConnected = false;
let connectionPromise = null;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return true;
  }

  // Prevent multiple simultaneous connection attempts
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const connectionString =
        process.env.MONGODB_URI || "mongodb://localhost:27017/productivity-app";

      await mongoose.connect(connectionString, {
        maxPoolSize: 10, // Connection pool size
        serverSelectionTimeoutMS: 5000, // Timeout for server selection
        socketTimeoutMS: 45000, // Socket timeout
        bufferMaxEntries: 0, // Disable mongoose buffering
      });

      isConnected = true;
      console.log("Connected to MongoDB with connection pooling");
      return true;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      // Fallback to in-memory database for demo purposes
      console.log("Falling back to in-memory database");
      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

// Simple in-memory database for demo purposes (fallback)
// In production, you would use MongoDB Atlas or another cloud database

let users = [
  {
    _id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$12$BAFveCg4mJs2lcnUSYi1AOT4kR8WQwva/YxbjWbIp3M3vZDdCHmMO", // password: admin123 (working hash)
    role: "admin",
    createdAt: new Date(),
    permissions: {
      canAdd: true,
      canEdit: true,
      canDelete: true,
      canReset: true,
    },
  },
];
let tasks = [];
let categories = [];
let projects = [];

// Cache for frequently accessed data
const cache = {
  userTasks: new Map(), // userId -> tasks
  userCategories: new Map(), // userId -> categories
  stats: new Map(), // userId -> stats
  lastUpdated: new Map(), // cache key -> timestamp
};

const CACHE_TTL = 30000; // 30 seconds cache TTL

// Cache management functions
const isCacheValid = (key) => {
  const lastUpdate = cache.lastUpdated.get(key);
  return lastUpdate && Date.now() - lastUpdate < CACHE_TTL;
};

const updateCache = (key, data) => {
  cache[key].set(key, data);
  cache.lastUpdated.set(key, Date.now());
};

const clearCache = (key) => {
  cache[key].delete(key);
  cache.lastUpdated.delete(key);
};

// Track if admin has been initialized
let adminInitialized = false;

// Initialize admin user with proper password hash
const initializeAdminUser = async () => {
  if (adminInitialized) {
    console.log("✅ Admin user already initialized");
    return;
  }

  try {
    const bcrypt = await import("bcryptjs");
    const adminPassword = "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Find and update the admin user
    const adminUser = users.find((user) => user.email === "admin@example.com");
    if (adminUser) {
      adminUser.password = hashedPassword;
      adminInitialized = true;
      console.log("✅ Admin user initialized with password: admin123");
    } else {
      // Create admin user if not found
      const newAdminUser = {
        _id: "admin-1",
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        permissions: {
          canAdd: true,
          canEdit: true,
          canDelete: true,
          canReset: true,
        },
      };
      users.push(newAdminUser);
      adminInitialized = true;
      console.log("✅ Admin user created with password: admin123");
    }
  } catch (error) {
    console.error("❌ Failed to initialize admin user:", error);
  }
};

// Function to reset admin password
export const resetAdminPassword = async () => {
  try {
    const bcrypt = await import("bcryptjs");
    const adminPassword = "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = users.find((user) => user.email === "admin@example.com");
    if (adminUser) {
      adminUser.password = hashedPassword;
      adminInitialized = true;
      console.log("✅ Admin password reset to: admin123");
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Failed to reset admin password:", error);
    return false;
  }
};

// Initialize admin user when the module loads
initializeAdminUser();

export const getUsers = () => users;
export const getTasks = () => tasks;
export const getCategories = () => categories;

// Enhanced database functions with MongoDB support
export const addUser = async (user) => {
  if (!user.name || !user.email || !user.password || !user.role) {
    throw new Error("Missing required user fields");
  }

  const validRoles = ["user", "admin", "moderator", "editor", "viewer"];
  if (!validRoles.includes(user.role)) {
    throw new Error("Invalid role: " + user.role);
  }

  // Get default permissions for the role
  const defaultPermissions = User.getDefaultPermissions(user.role);

  // Merge with any custom permissions provided
  const finalPermissions = {
    ...defaultPermissions,
    ...user.permissions,
  };

  try {
    // Try MongoDB first
    if (isConnected) {
      const newUser = new User({
        ...user,
        permissions: finalPermissions,
      });
      const savedUser = await newUser.save();
      return savedUser;
    }
  } catch (error) {
    console.log("MongoDB user creation failed, falling back to in-memory");
  }

  // Fallback to in-memory
  const newUser = {
    ...user,
    _id: Date.now().toString(),
    permissions: finalPermissions,
  };
  console.log("[addUser] Creating user:", newUser);
  users.push(newUser);
  clearCache(`userTasks_${newUser._id}`);
  clearCache(`userCategories_${newUser._id}`);
  clearCache(`stats_${newUser._id}`);
  return newUser;
};

export const findUserByEmail = async (email) => {
  try {
    // Try MongoDB first
    if (isConnected) {
      return await User.findOne({ email: email.toLowerCase() });
    }
  } catch (error) {
    console.log("MongoDB user lookup failed, falling back to in-memory");
  }

  // Fallback to in-memory
  return users.find((user) => user.email === email);
};

export const findUserById = async (id) => {
  try {
    // Try MongoDB first
    if (isConnected) {
      return await User.findById(id);
    }
  } catch (error) {
    console.log("MongoDB user lookup failed, falling back to in-memory");
  }

  // Fallback to in-memory
  return users.find((user) => user._id === id);
};

export const updateUser = (id, updates) => {
  const index = users.findIndex((user) => user._id === id);
  if (index !== -1) {
    // Merge permissions if present
    if (updates.permissions) {
      users[index].permissions = {
        ...users[index].permissions,
        ...updates.permissions,
      };
      updates = { ...updates };
      delete updates.permissions;
    }
    users[index] = { ...users[index], ...updates };
    // Clear user-related caches
    clearCache(`userTasks_${id}`);
    clearCache(`userCategories_${id}`);
    clearCache(`stats_${id}`);
    return users[index];
  }
  return null;
};

export const deleteUser = (id) => {
  const index = users.findIndex((user) => user._id === id);
  if (index !== -1) {
    users.splice(index, 1);
    // Also delete all tasks and categories for this user
    tasks = tasks.filter((task) => task.user !== id);
    categories = categories.filter((cat) => cat.user !== id);
    // Clear all caches
    clearCache(`userTasks_${id}`);
    clearCache(`userCategories_${id}`);
    clearCache(`stats_${id}`);
    return true;
  }
  return false;
};

export const addTask = async (task) => {
  try {
    // Try MongoDB first
    if (isConnected) {
      const newTask = new Task(task);
      const savedTask = await newTask.save();
      return savedTask;
    }
  } catch (error) {
    console.log("MongoDB task creation failed, falling back to in-memory");
  }

  // Fallback to in-memory
  const newTask = {
    ...task,
    _id: Date.now().toString(),
    createdAt: new Date(),
  };
  tasks.push(newTask);
  clearCache(`userTasks_${task.user}`);
  clearCache(`stats_${task.user}`);
  return newTask;
};

export const updateTask = (id, updates) => {
  const index = tasks.findIndex((task) => task._id === id);
  if (index !== -1) {
    const oldTask = tasks[index];
    tasks[index] = { ...tasks[index], ...updates };
    // Clear user-related caches
    clearCache(`userTasks_${oldTask.user}`);
    clearCache(`stats_${oldTask.user}`);
    return tasks[index];
  }
  return null;
};

export const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task._id === id);
  if (index !== -1) {
    const task = tasks[index];
    tasks.splice(index, 1);
    // Clear user-related caches
    clearCache(`userTasks_${task.user}`);
    clearCache(`stats_${task.user}`);
    return true;
  }
  return null;
};

export const findTasksByUser = async (userId) => {
  try {
    // Try MongoDB first
    if (isConnected) {
      return await Task.find({ user: userId }).populate("category");
    }
  } catch (error) {
    console.log("MongoDB task lookup failed, falling back to in-memory");
  }

  // Fallback to in-memory
  const cacheKey = `userTasks_${userId}`;
  if (isCacheValid(cacheKey)) {
    return cache.userTasks.get(cacheKey) || [];
  }
  const userTasks = tasks.filter((task) => task.user === userId);
  cache.userTasks.set(cacheKey, userTasks);
  cache.lastUpdated.set(cacheKey, Date.now());
  return userTasks;
};

export const findTaskById = (id) => {
  return tasks.find((task) => task._id === id);
};

export const addCategory = async (category) => {
  try {
    // Try MongoDB first
    if (isConnected) {
      const newCategory = new Category(category);
      const savedCategory = await newCategory.save();
      return savedCategory;
    }
  } catch (error) {
    console.log("MongoDB category creation failed, falling back to in-memory");
  }

  // Fallback to in-memory
  const newCategory = { ...category, _id: Date.now().toString() };
  categories.push(newCategory);
  clearCache(`userCategories_${category.user}`);
  return newCategory;
};

export const updateCategory = (id, updates) => {
  const index = categories.findIndex((category) => category._id === id);
  if (index !== -1) {
    const oldCategory = categories[index];
    categories[index] = { ...categories[index], ...updates };
    // Clear user-related caches
    clearCache(`userCategories_${oldCategory.user}`);
    return categories[index];
  }
  return null;
};

export const deleteCategory = (id) => {
  const index = categories.findIndex((category) => category._id === id);
  if (index !== -1) {
    const category = categories[index];
    categories.splice(index, 1);
    // Clear user-related caches
    clearCache(`userCategories_${category.user}`);
    return true;
  }
  return false;
};

export const findCategoryById = (id) => {
  return categories.find((category) => category._id === id);
};

export const findCategoriesByUser = async (userId) => {
  try {
    // Try MongoDB first
    if (isConnected) {
      return await Category.find({ user: userId });
    }
  } catch (error) {
    console.log("MongoDB category lookup failed, falling back to in-memory");
  }

  // Fallback to in-memory
  const cacheKey = `userCategories_${userId}`;
  if (isCacheValid(cacheKey)) {
    return cache.userCategories.get(cacheKey) || [];
  }
  const userCategories = categories.filter(
    (category) => category.user === userId
  );
  cache.userCategories.set(cacheKey, userCategories);
  cache.lastUpdated.set(cacheKey, Date.now());
  return userCategories;
};

// Optimized stats calculation with caching
export const getUserStats = (userId) => {
  const cacheKey = `stats_${userId}`;

  // Check cache first
  if (isCacheValid(cacheKey)) {
    return cache.stats.get(cacheKey);
  }

  // Calculate stats
  const userTasks = findTasksByUser(userId);
  const now = new Date();

  const stats = {
    total: userTasks.length,
    completed: userTasks.filter((task) => task.status === "completed").length,
    pending: userTasks.filter((task) => task.status === "pending").length,
    overdue: userTasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== "completed"
    ).length,
  };

  // Update cache
  cache.stats.set(cacheKey, stats);
  cache.lastUpdated.set(cacheKey, Date.now());

  return stats;
};

export const resetAllData = () => {
  users = users.filter((user) => user.role === "admin");
  tasks = [];
  categories = [];
  projects = [];
  // Clear all caches
  cache.userTasks.clear();
  cache.userCategories.clear();
  cache.stats.clear();
  cache.lastUpdated.clear();
};

export const getAllTasks = async () => {
  try {
    // Try MongoDB first
    if (isConnected) {
      return await Task.find({})
        .populate("user", "name email")
        .populate("category");
    }
  } catch (error) {
    console.log("MongoDB task lookup failed, falling back to in-memory");
  }

  // Fallback to in-memory
  return tasks;
};

export const getAllCategories = async () => {
  try {
    // Try MongoDB first
    if (isConnected) {
      return await Category.find({}).populate("user", "name email");
    }
  } catch (error) {
    console.log("MongoDB category lookup failed, falling back to in-memory");
  }

  // Fallback to in-memory
  return categories;
};

export const getProjects = () => projects;
export const getAllProjects = () => projects;

export const addProject = (project) => {
  const newProject = {
    ...project,
    _id: Date.now().toString(),
    createdAt: new Date(),
  };
  projects.push(newProject);
  return newProject;
};

export const updateProject = (id, updates) => {
  const index = projects.findIndex((project) => project._id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    return projects[index];
  }
  return null;
};

export const deleteProject = (id) => {
  const index = projects.findIndex((project) => project._id === id);
  if (index !== -1) {
    projects.splice(index, 1);
    return true;
  }
  return false;
};

export const findProjectById = (id) => {
  return projects.find((project) => project._id === id);
};

export const findProjectsByUser = (userId) => {
  return projects.filter((project) => project.user === userId);
};

export const getSystemStats = () => {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    totalUsers: users.length,
    totalTasks: tasks.length,
    totalCategories: categories.length,
    totalProjects: projects.length,
    tasksCreatedThisWeek: tasks.filter(
      (task) => new Date(task.createdAt) >= lastWeek
    ).length,
    completedTasksThisWeek: tasks.filter(
      (task) =>
        task.status === "completed" &&
        task.completedAt &&
        new Date(task.completedAt) >= lastWeek
    ).length,
  };
};

export const getActiveUserCount = () => {
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeUsers = new Set(
    tasks
      .filter((task) => new Date(task.createdAt) >= lastWeek)
      .map((task) => task.user)
  );
  return activeUsers.size;
};
