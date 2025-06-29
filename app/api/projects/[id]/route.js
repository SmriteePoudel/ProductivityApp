import { NextResponse } from "next/server";
import {
  connectDB,
  findProjectById,
  updateProject,
  deleteProject,
  findProjectsByUser,
} from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET - Fetch a specific project
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

    // Find project
    let project;
    if (decoded.role === "admin") {
      project = findProjectById(id);
    } else {
      const userProjects = findProjectsByUser(decoded.userId);
      project = userProjects.find((p) => p._id === id);
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a project
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

    // Find project
    let project;
    if (decoded.role === "admin") {
      project = findProjectById(id);
    } else {
      const userProjects = findProjectsByUser(decoded.userId);
      project = userProjects.find((p) => p._id === id);
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update project
    const updatedProject = updateProject(id, updates);
    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project
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

    // Find project
    let project;
    if (decoded.role === "admin") {
      project = findProjectById(id);
    } else {
      const userProjects = findProjectsByUser(decoded.userId);
      project = userProjects.find((p) => p._id === id);
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete project
    const success = deleteProject(id);
    if (!success) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
