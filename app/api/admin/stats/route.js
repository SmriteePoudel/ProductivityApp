import { NextResponse } from "next/server";
import {
  connectDB,
  getSystemStats,
  getUsers,
  getAllTasks,
  getAllCategories,
  findTasksByUser,
  getActiveUserCount,
} from "@/lib/db.js";
import { requireAdmin } from "@/lib/auth.js";

export const GET = requireAdmin(async (request) => {
  try {
    await connectDB();

    const stats = await getSystemStats();
    const users = await getUsers();
    const tasks = await getAllTasks();
    const categories = await getAllCategories();
    const activeUserCount = await getActiveUserCount();

    // Add task count for each user
    const usersWithTaskCount = await Promise.all(
      users.map(async (user) => {
        const userTasks = await findTasksByUser(user._id);
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          taskCount: userTasks.length,
        };
      })
    );

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
