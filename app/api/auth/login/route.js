import { NextResponse } from "next/server";

// Simple in-memory user for testing
const adminUser = {
  _id: "admin-1",
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$12$BAFveCg4mJs2lcnUSYi1AOT4kR8WQwva/YxbjWbIp3M3vZDdCHmMO", // admin123
  role: "admin",
};

// Simple JWT-like token generation
function generateSimpleToken(user) {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

// Simple password comparison
async function comparePassword(inputPassword, hashedPassword) {
  try {
    console.log(`🔍 Comparing passwords:`);
    console.log(`   Input password: "${inputPassword}"`);
    console.log(`   Expected password: "admin123"`);
    console.log(`   Password length: ${inputPassword.length}`);
    console.log(`   Expected length: 8`);

    // For now, just check if it's admin123
    const result = inputPassword === "admin123";
    console.log(`   Comparison result: ${result}`);
    return result;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

export async function POST(request) {
  try {
    console.log("🔐 Login attempt started");

    const { email, password } = await request.json();
    console.log(`📧 Login attempt for email: "${email}"`);
    console.log(`🔑 Password received: "${password}"`);
    console.log(`📏 Email length: ${email.length}`);
    console.log(`📏 Password length: ${password.length}`);

    // Validate input
    if (!email || !password) {
      console.log("❌ Missing email or password");
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if it's admin login
    if (email === "admin@example.com") {
      console.log("✅ Admin login attempt detected");

      // Verify password
      const isValidPassword = await comparePassword(
        password,
        adminUser.password
      );
      if (!isValidPassword) {
        console.log(`❌ Invalid password for admin`);
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      console.log(`✅ Admin password verified`);

      // Generate token
      const token = generateSimpleToken(adminUser);
      console.log("✅ Token generated");

      // Create response
      const response = NextResponse.json(
        {
          message: "Login successful",
          user: {
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
          },
        },
        { status: 200 }
      );

      // Set cookie
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      console.log("✅ Login successful, cookie set");
      return response;
    }

    // For any other email, return invalid credentials
    console.log(`❌ User not found: ${email}`);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
