import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Simple in-memory data storage
let tasks = [];
let categories = [];

// GET - Fetch all dashboard data in a single request
export async function GET(request) {
  try {
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

    // Get user tasks
    const userTasks =
      decoded.role === "admin"
        ? tasks
        : tasks.filter((task) => task.user === decoded.userId);

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

    // Get user categories
    const userCategories =
      decoded.role === "admin"
        ? categories
        : categories.filter((cat) => cat.user === decoded.userId);

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
