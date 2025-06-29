import { NextResponse } from "next/server";
import { connectDB, findUserById, updateUser } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

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

    // Return user info from token
    return NextResponse.json({
      user: {
        _id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.role === "admin" ? "Admin User" : "User",
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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
    const user = findUserById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const body = await request.json();
    const { name, avatar, bio, permissions } = body;
    const updatedUser = updateUser(user._id, {
      ...(name !== undefined ? { name } : {}),
      ...(avatar !== undefined ? { avatar } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(permissions !== undefined ? { permissions } : {}),
    });
    return NextResponse.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        permissions: updatedUser.permissions,
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
