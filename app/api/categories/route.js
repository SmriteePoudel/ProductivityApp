import { NextResponse } from "next/server";
import {
  connectDB,
  addCategory,
  findCategoriesByUser,
  getAllCategories,
} from "@/lib/db.js";
import { verifyToken } from "@/lib/auth.js";

// GET - Fetch categories (users see their own, admins see all)
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

    // Get categories based on role (now async)
    let userCategories;
    if (decoded.role === "admin") {
      userCategories = await getAllCategories();
    } else {
      userCategories = await findCategoriesByUser(decoded.userId);
    }

    return NextResponse.json({ categories: userCategories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new category
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

    const categoryData = await request.json();

    // Validate required fields
    if (!categoryData.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Create new category with user ID (now async)
    const category = await addCategory({
      ...categoryData,
      user: decoded.userId,
    });

    return NextResponse.json(
      { message: "Category created successfully", category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
