import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { verifyToken } from "@/lib/auth";
import { findProjectById, updateProject } from "@/lib/db";

// DELETE - Delete a file from a project
export async function DELETE(request, { params }) {
  try {
    const { projectId, fileName } = params;

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get the project
    const project = findProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user owns the project or is admin
    if (project.user !== decoded.userId && decoded.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Find the file in the project
    const fileIndex = project.files?.findIndex(
      (file) => file.fileName === fileName
    );
    if (fileIndex === -1 || !project.files) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete the physical file
    const filePath = join(
      process.cwd(),
      "public",
      "uploads",
      "projects",
      projectId,
      fileName
    );
    try {
      await unlink(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
      // Continue even if file doesn't exist
    }

    // Remove file from project
    const updatedFiles = project.files.filter(
      (file) => file.fileName !== fileName
    );
    const updatedProject = updateProject(projectId, {
      files: updatedFiles,
    });

    return NextResponse.json({
      message: "File deleted successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
