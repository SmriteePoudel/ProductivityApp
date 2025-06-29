import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";
import { getUserFromRequest } from "@/lib/auth.js";
import Page from "@/lib/models/Page.js";

// GET - Fetch pages (users see their own, admins see all)
export async function GET(request) {
  try {
    await connectDB();

    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    let query = {};
    if (user.role !== "admin") {
      query = {
        $or: [{ user: user.userId }, { sharedWith: user.userId }],
      };
    }

    const pages = await Page.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name email")
      .populate("sharedWith", "name email");

    const total = await Page.countDocuments(query);

    return NextResponse.json({
      pages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get pages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new page
export async function POST(request) {
  try {
    await connectDB();

    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pageData = await request.json();

    // Validate required fields
    if (!pageData.name) {
      return NextResponse.json(
        { error: "Page name is required" },
        { status: 400 }
      );
    }

    // Create new page
    const page = new Page({
      ...pageData,
      user: user.userId,
      boxes: pageData.boxes || [],
      sharedWith: pageData.sharedWith || [],
    });

    await page.save();

    return NextResponse.json(
      { message: "Page created successfully", page },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create page error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
