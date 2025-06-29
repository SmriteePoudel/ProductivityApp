import { NextResponse } from "next/server";
import { connectDB, findUserByEmail } from "@/lib/db.js";
import { generateToken, comparePassword } from "@/lib/auth.js";

export async function POST(request) {
  try {
    console.log("🔐 Login attempt started");

    const { email, password } = await request.json();
    console.log(`📧 Login attempt for email: "${email}"`);

    // Validate input
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    const dbConnected = await connectDB();
    console.log("Database connected:", dbConnected ? "MongoDB" : "In-memory");

    // Find user by email (now async)
    const user = await findUserByEmail(email);
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log(`✅ User found: ${user.name} (${user.role})`);

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      console.log(`❌ Invalid password for user: ${email}`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log(`✅ Password verified for user: ${email}`);

    // Generate JWT token
    const token = generateToken(user);
    console.log("✅ JWT token generated");

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
        },
      },
      { status: 200 }
    );

    // Set secure cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    console.log("✅ Login successful, secure cookie set");
    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
