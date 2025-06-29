import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Simple in-memory categories storage
let categories = [];

// GET - Fetch categories (users see their own, admins see all)
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

    // Get categories based on role
    let userCategories = categories;
    if (decoded.role !== "admin") {
      userCategories = categories.filter(
        (category) => category.user === decoded.userId
      );
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

    // Create new category
    const category = {
      ...categoryData,
      _id: Date.now().toString(),
      user: decoded.userId,
    };

    categories.push(category);

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
