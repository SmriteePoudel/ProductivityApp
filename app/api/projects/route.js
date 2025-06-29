import { NextResponse } from "next/server";
import {
  connectDB,
  getProjects,
  addProject,
  findProjectsByUser,
  getAllProjects,
} from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

let projectCache = null;
let projectCacheTime = 0;
const PROJECT_CACHE_TTL = 10 * 1000; // 10 seconds

// GET - Fetch projects (users see their own, admins see all)
export async function GET(request) {
  try {
    await connectDB();

    // Caching: Only cache for default (no filters, page 1) requests
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const isDefault = !status && page === 1 && limit === 10;
    if (
      isDefault &&
      projectCache &&
      Date.now() - projectCacheTime < PROJECT_CACHE_TTL
    ) {
      return NextResponse.json(projectCache);
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
      console.error("[API/projects][GET] No token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error("[API/projects][GET] Invalid token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get projects based on role
    let projects;
    if (decoded.role === "admin") {
      projects = getAllProjects();
    } else {
      projects = findProjectsByUser(decoded.userId);
    }

    // Apply filters
    if (status) {
      projects = projects.filter((project) => project.status === status);
    }

    // Sort by creation date (newest first)
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const total = projects.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    // Only return minimal fields for the list
    const minimalProjects = paginatedProjects.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description,
      color: p.color,
      icon: p.icon,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      files: p.files
        ? p.files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
        : [],
    }));

    const result = {
      projects: minimalProjects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
    if (isDefault) {
      projectCache = result;
      projectCacheTime = Date.now();
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API/projects][GET] Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new project (supports FormData for file uploads)
export async function POST(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      console.error("[API/projects][POST] No token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error("[API/projects][POST] Invalid token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    let projectData = {};
    let files = [];
    let isFormData = false;

    // Check if request is FormData (file upload)
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      isFormData = true;
      const formData = await request.formData();
      projectData = {
        name: formData.get("name"),
        description: formData.get("description") || "",
        color: formData.get("color") || "#3b82f6",
        icon: formData.get("icon") || "📁",
        status: formData.get("status") || "active",
      };
      files = formData.getAll("files");
    } else {
      projectData = await request.json();
    }

    // Validate required fields
    if (!projectData.name) {
      console.error("[API/projects][POST] Project name is required");
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    let uploadedFiles = [];
    if (isFormData && files && files.length > 0) {
      // Save files to /public/uploads/projects/[projectId]
      const tempId = Date.now().toString();
      const uploadsDir = join(
        process.cwd(),
        "public",
        "uploads",
        "projects",
        tempId
      );
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
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
        ];
        if (!allowedTypes.includes(file.type)) continue;
        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) continue;
        // Generate unique filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${timestamp}_${safeName}`;
        const filePath = join(uploadsDir, fileName);
        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);
        // Add file info
        uploadedFiles.push({
          name: file.name,
          fileName,
          path: `/uploads/projects/${tempId}/${fileName}`,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          uploadedBy: decoded.userId,
        });
      }
      projectData.files = uploadedFiles;
      projectData._id = tempId;
    }

    // Create new project
    const project = addProject({
      ...projectData,
      user: decoded.userId,
    });

    return NextResponse.json(
      { message: "Project created successfully", project },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API/projects][POST] Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
