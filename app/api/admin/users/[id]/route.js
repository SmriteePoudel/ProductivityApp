import { NextResponse } from "next/server";
import { connectDB, updateUser, deleteUser, findUserById } from "@/lib/db";
import { hashPassword, verifyToken } from "@/lib/auth";

export async function PUT(request, { params }) {
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

    const { id } = params;
    const { name, email, password, role, roles } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Validate roles array if present
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
    let rolesToUse = undefined;
    if (roles && Array.isArray(roles)) {
      for (const r of roles) {
        if (!validRoles.includes(r)) {
          return NextResponse.json(
            { error: `Invalid role: ${r}` },
            { status: 400 }
          );
        }
      }
      rolesToUse = roles;
    }

    // Validate single role if present
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = findUserById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData = { name, email };
    if (rolesToUse) {
      updateData.roles = rolesToUse;
      updateData.role = rolesToUse[0]; // for legacy
    } else if (role) {
      updateData.role = role;
      updateData.roles = [role];
    }

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
        roles: updatedUser.roles,
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

export async function DELETE(request, { params }) {
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

    const { id } = params;

    // Check if user exists
    const existingUser = findUserById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from deleting themselves
    if (decoded.userId === id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete user
    deleteUser(id);

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
