import { NextResponse } from "next/server";
import {
  connectDB,
  findTasksByUser,
  getAllTasks,
  findCategoriesByUser,
  getAllCategories,
} from "@/lib/db.js";
import { verifyToken } from "@/lib/auth.js";

// GET - Fetch all dashboard data in a single request
export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 5;

    // Get user tasks (now async)
    let userTasks;
    if (decoded.role === "admin") {
      userTasks = await getAllTasks();
    } else {
      userTasks = await findTasksByUser(decoded.userId);
    }

    // Calculate stats
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

    // Get user categories (now async)
    let userCategories;
    if (decoded.role === "admin") {
      userCategories = await getAllCategories();
    } else {
      userCategories = await findCategoriesByUser(decoded.userId);
    }

    // Get recent tasks (sorted by creation date, newest first)
    const recentTasks = userTasks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return NextResponse.json({
      stats,
      recentTasks,
      categories: userCategories,
      user: {
        id: decoded.userId,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
