import { NextResponse } from "next/server";
import { connectDB, getUsers, findUserByEmail } from "@/lib/db";
import { comparePassword } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    const users = getUsers();
    const adminUser = findUserByEmail("admin@example.com");

    let adminTest = "Not found";
    if (adminUser) {
      const passwordTest = await comparePassword(
        "admin123",
        adminUser.password
      );
      adminTest = passwordTest ? "Valid password" : "Invalid password";
    }

    return NextResponse.json({
      totalUsers: users.length,
      adminUser: adminUser
        ? {
            email: adminUser.email,
            role: adminUser.role,
            hasPassword: !!adminUser.password,
            passwordTest: adminTest,
          }
        : null,
      allUsers: users.map((u) => ({
        email: u.email,
        role: u.role,
        hasPassword: !!u.password,
      })),
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
