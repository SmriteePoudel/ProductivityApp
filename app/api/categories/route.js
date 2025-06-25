import { NextResponse } from "next/server";
import {
  connectDB,
  getCategories,
  addCategory,
  findCategoriesByUser,
  getAllCategories,
} from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET - Fetch categories (users see their own, admins see all)
export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    console.log("Categories API - Token:", token ? "Present" : "Missing");

    if (!token) {
      console.log("Categories API - No token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    console.log(
      "Categories API - Token decoded:",
      decoded ? "Success" : "Failed"
    );

    if (!decoded) {
      console.log("Categories API - Invalid token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    let categories;
    if (decoded.role === "admin") {
      categories = getAllCategories();
    } else {
      categories = findCategoriesByUser(decoded.userId);
    }

    console.log("Categories API - Returning categories:", categories.length);
    return NextResponse.json({ categories });
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

    // Create new category
    const category = addCategory({
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
