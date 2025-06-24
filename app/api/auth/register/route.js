import { NextResponse } from "next/server";
import { connectDB, addUser, findUserByEmail } from "@/lib/db";
import { generateToken, hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password, role = "user" } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = addUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT token
    const token = generateToken(user);

    // Create response
    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
