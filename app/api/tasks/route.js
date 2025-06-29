import { NextResponse } from "next/server";
import {
  connectDB,
  addTask,
  findTasksByUser,
  getAllTasks,
  updateTask,
  deleteTask,
} from "@/lib/db.js";
import { verifyToken } from "@/lib/auth.js";

// GET - Fetch tasks (users see their own, admins see all)
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
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Get tasks based on role (now async)
    let userTasks;
    if (decoded.role === "admin") {
      userTasks = await getAllTasks();
    } else {
      userTasks = await findTasksByUser(decoded.userId);
    }

    // Apply filters efficiently
    if (status) {
      userTasks = userTasks.filter((task) => task.status === status);
    }
    if (priority) {
      userTasks = userTasks.filter((task) => task.priority === priority);
    }
    if (category) {
      userTasks = userTasks.filter((task) => task.category === category);
    }

    // Sort by creation date (newest first)
    if (userTasks.length > 0) {
      userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Apply pagination
    const total = userTasks.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = userTasks.slice(startIndex, endIndex);

    return NextResponse.json({
      tasks: paginatedTasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new task
export async function POST(request) {
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

    const taskData = await request.json();

    // Validate required fields
    if (!taskData.title) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    // Create new task with user ID (now async)
    const task = await addTask({
      ...taskData,
      user: decoded.userId,
    });

    return NextResponse.json(
      { message: "Task created successfully", task },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
