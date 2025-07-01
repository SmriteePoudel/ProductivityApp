import { NextResponse } from "next/server";
import {
  connectDB,
  addUser,
  findUserByEmail,
  updateUser,
  findUserById,
} from "@/lib/db";
import { generateToken, hashPassword, verifyToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    // Verify admin access
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { name, email, password, roles } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate roles
    const validRoles = [
      "user",
      "admin",
      "moderator",
      "editor",
      "viewer",
      "developer",
      "designer",
      "hr",
      "marketing",
      "finance",
      "blog_writer",
      "seo_manager",
      "project_manager",
    ];
    const rolesToUse =
      roles && Array.isArray(roles) && roles.length > 0 ? roles : ["user"];
    for (const r of rolesToUse) {
      if (!validRoles.includes(r)) {
        return NextResponse.json(
          { error: `Invalid role: ${r}` },
          { status: 400 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await addUser({
      name,
      email,
      password: hashedPassword,
      roles: rolesToUse,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    // Verify admin access
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id, name, email, password, role } = await request.json();

    // Validate input
    if (!id || !name || !email) {
      return NextResponse.json(
        { error: "ID, name, and email are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = findUserById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData = { name, email };
    if (role) updateData.role = role;

    // Hash password if provided
    if (password && password.trim()) {
      updateData.password = await hashPassword(password);
    }

    // Update user
    const updatedUser = updateUser(id, updateData);

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
