import { NextResponse } from "next/server";
import {
  connectDB,
  updateTask,
  deleteTask,
  findTasksByUser,
  findTaskById,
  getAllTasks,
} from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET - Fetch a specific task
export async function GET(request, { params }) {
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

    const { id } = params;
    let task;

    if (decoded.role === "admin") {
      // Admin can access any task
      task = findTaskById(id);
    } else {
      // User can only access their own tasks
      const userTasks = findTasksByUser(decoded.userId);
      task = userTasks.find((t) => t._id === id);
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Get task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a task
export async function PUT(request, { params }) {
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

    const { id } = params;
    const updates = await request.json();

    let task;
    if (decoded.role === "admin") {
      // Admin can update any task
      task = findTaskById(id);
    } else {
      // User can only update their own tasks
      const userTasks = findTasksByUser(decoded.userId);
      task = userTasks.find((t) => t._id === id);
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update task
    const updatedTask = updateTask(id, updates);
    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a task
export async function DELETE(request, { params }) {
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

    const { id } = params;

    let task;
    if (decoded.role === "admin") {
      // Admin can delete any task
      task = findTaskById(id);
    } else {
      // User can only delete their own tasks
      const userTasks = findTasksByUser(decoded.userId);
      task = userTasks.find((t) => t._id === id);
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Delete task
    const success = deleteTask(id);
    if (!success) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
