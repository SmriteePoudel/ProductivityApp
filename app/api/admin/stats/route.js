import { NextResponse } from "next/server";
import {
  connectDB,
  getSystemStats,
  getUsers,
  getAllTasks,
  getAllCategories,
  findTasksByUser,
  getActiveUserCount,
} from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const GET = requireAdmin(async (request) => {
  try {
    await connectDB();

    const stats = getSystemStats();
    const users = getUsers();
    const tasks = getAllTasks();
    const categories = getAllCategories();
    const activeUserCount = getActiveUserCount();

    // Add task count for each user
    const usersWithTaskCount = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      taskCount: findTasksByUser(user._id).length,
    }));

    return NextResponse.json({
      stats,
      users: usersWithTaskCount,
      tasks: tasks.slice(0, 10), // Return first 10 tasks
      categories: categories.slice(0, 10), // Return first 10 categories
      activeUserCount,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
