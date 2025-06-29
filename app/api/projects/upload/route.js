import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { verifyToken } from "@/lib/auth";
import { findProjectById, updateProject } from "@/lib/db";

// POST - Upload files to a project
export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const formData = await request.formData();
    const projectId = formData.get("projectId");
    const files = formData.getAll("files");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(
      process.cwd(),
      "public",
      "uploads",
      "projects",
      projectId
    );
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uploadedFiles = [];

    // Process each file
    for (const file of files) {
      if (!file || !(file instanceof File)) continue;

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/zip",
        "application/x-rar-compressed",
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed` },
          { status: 400 }
        );
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 10MB` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${timestamp}_${safeName}`;
      const filePath = join(uploadsDir, fileName);

      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Add file info to project
      const fileInfo = {
        name: file.name,
        originalName: file.name,
        fileName: fileName,
        path: `/uploads/projects/${projectId}/${fileName}`,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: decoded.userId,
      };

      uploadedFiles.push(fileInfo);
    }

    // Update project with new files
    const currentFiles = project.files || [];
    const updatedFiles = [...currentFiles, ...uploadedFiles];

    const updatedProject = updateProject(projectId, {
      files: updatedFiles,
    });

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
      project: updatedProject,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
