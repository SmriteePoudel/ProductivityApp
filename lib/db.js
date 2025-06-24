// Simple in-memory database for demo purposes
// In production, you would use MongoDB Atlas or another cloud database

let users = [];
let tasks = [];
let categories = [];

export const connectDB = async () => {
  // Simulate database connection
  console.log("Connected to in-memory database");
  return true;
};

export const getUsers = () => users;
export const getTasks = () => tasks;
export const getCategories = () => categories;

export const addUser = (user) => {
  const newUser = { ...user, _id: Date.now().toString() };
  users.push(newUser);
  return newUser;
};

export const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

export const findUserById = (id) => {
  return users.find((user) => user._id === id);
};

export const updateUser = (id, updates) => {
  const index = users.findIndex((user) => user._id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
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
    return true;
  }
  return false;
};

export const addTask = (task) => {
  const newTask = {
    ...task,
    _id: Date.now().toString(),
    createdAt: new Date(),
  };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id, updates) => {
  const index = tasks.findIndex((task) => task._id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    return tasks[index];
  }
  return null;
};

export const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task._id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    return true;
  }
  return false;
};

export const findTasksByUser = (userId) => {
  return tasks.filter((task) => task.user === userId);
};

export const findTaskById = (id) => {
  return tasks.find((task) => task._id === id);
};

export const addCategory = (category) => {
  const newCategory = { ...category, _id: Date.now().toString() };
  categories.push(newCategory);
  return newCategory;
};

export const updateCategory = (id, updates) => {
  const index = categories.findIndex((cat) => cat._id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    return categories[index];
  }
  return null;
};

export const deleteCategory = (id) => {
  const index = categories.findIndex((cat) => cat._id === id);
  if (index !== -1) {
    categories.splice(index, 1);
    return true;
  }
  return false;
};

export const findCategoryById = (id) => {
  return categories.find((cat) => cat._id === id);
};

export const findCategoriesByUser = (userId) => {
  return categories.filter((cat) => cat.user === userId);
};

// Admin functions
export const resetAllData = () => {
  users = [];
  tasks = [];
  categories = [];
  return { message: "All data has been reset" };
};

export const getAllTasks = () => {
  return tasks;
};

export const getAllCategories = () => {
  return categories;
};

export const getSystemStats = () => {
  return {
    totalUsers: users.length,
    totalTasks: tasks.length,
    totalCategories: categories.length,
    completedTasks: tasks.filter((task) => task.status === "completed").length,
    pendingTasks: tasks.filter((task) => task.status === "pending").length,
    inProgressTasks: tasks.filter((task) => task.status === "in-progress")
      .length,
  };
};
