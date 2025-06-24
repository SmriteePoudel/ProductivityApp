import { NextResponse } from "next/server";
import { connectDB, findTasksByUser } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

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

    const tasks = findTasksByUser(decoded.userId);

    // Calculate stats
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const pending = tasks.filter((task) => task.status === "pending").length;
    const overdue = tasks.filter((task) => {
      if (!task.dueDate || task.status === "completed") return false;
      return new Date(task.dueDate) < new Date();
    }).length;

    return NextResponse.json({
      total,
      completed,
      pending,
      overdue,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
