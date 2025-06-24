import { NextResponse } from "next/server";
import {
  connectDB,
  getTasks,
  addTask,
  findTasksByUser,
  getAllTasks,
} from "@/lib/db";
import { verifyToken } from "@/lib/auth";

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

    // Get tasks based on role
    let tasks;
    if (decoded.role === "admin") {
      tasks = getAllTasks();
    } else {
      tasks = findTasksByUser(decoded.userId);
    }

    // Apply filters
    if (status) tasks = tasks.filter((task) => task.status === status);
    if (priority) tasks = tasks.filter((task) => task.priority === priority);
    if (category) tasks = tasks.filter((task) => task.category === category);

    // Sort by creation date (newest first)
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const total = tasks.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

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

    // Create new task
    const task = addTask({
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
