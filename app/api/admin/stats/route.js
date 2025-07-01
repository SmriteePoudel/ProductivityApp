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
import User from "@/lib/models/User"; // ✅ Corrected import path for consistency

export const GET = requireAdmin(async (request) => {
  try {
    await connectDB();

    const [stats, users, tasks, categories, activeUserCount] =
      await Promise.all([
        getSystemStats(),
        getUsers(),
        getAllTasks(),
        getAllCategories(),
        getActiveUserCount(),
      ]);

    // Add task count for each user
    const usersWithTaskCount = await Promise.all(
      users.map(async (user) => {
        const userTasks = await findTasksByUser(user._id);
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          roles: user.roles || [user.role],
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          taskCount: userTasks.length,
        };
      })
    );

    return NextResponse.json({
      stats,
      users: usersWithTaskCount,
      tasks: tasks.slice(0, 10),
      categories: categories.slice(0, 10),
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
