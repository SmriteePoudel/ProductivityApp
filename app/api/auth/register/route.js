import { NextResponse } from "next/server";
import { connectDB, addUser, findUserByEmail } from "@/lib/db";
import { generateToken, hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const dbConnected = await connectDB();
    console.log(
      "[REGISTER] DB Connected:",
      dbConnected ? "MongoDB" : "In-memory DB"
    );

    const { name, email, password, role = "user" } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Validate role
    if (
      role &&
      !["user", "admin", "moderator", "editor", "viewer"].includes(role)
    ) {
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
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
      console.log(`[REGISTER] Password hashed for ${email}`);
    } catch (err) {
      console.error("[REGISTER] Password hashing failed:", err);
      return NextResponse.json(
        { error: "Password hashing failed" },
        { status: 500 }
      );
    }

    // Create user
    let user;
    try {
      user = addUser({
        name,
        email,
        password: hashedPassword, // Save only the hashed password
        role,
      });
      console.log(`[REGISTER] User created: ${user.email}, role: ${user.role}`);
    } catch (err) {
      console.error("[REGISTER] User creation failed:", err);
      return NextResponse.json(
        { error: "User creation failed", details: String(err) },
        { status: 500 }
      );
    }

    // Generate JWT token
    let token;
    try {
      token = generateToken(user);
    } catch (err) {
      console.error("[REGISTER] Token generation failed:", err);
      return NextResponse.json(
        { error: "Token generation failed" },
        { status: 500 }
      );
    }

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
    console.error("[REGISTER] Internal server error:", error, error?.stack);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: String(error),
        stack: error?.stack,
      },
      { status: 500 }
    );
  }
}
