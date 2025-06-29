import { NextResponse } from "next/server";
import { getUsers } from "@/lib/db";

export async function POST() {
  try {
    // Remove all users except the default admin
    const users = getUsers();
    const adminEmail = "admin@example.com";
    const adminUser = users.find((u) => u.email === adminEmail);
    users.length = 0;
    if (adminUser) users.push(adminUser);
    return NextResponse.json({
      message: "All users except admin have been deleted.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset users", details: String(error) },
      { status: 500 }
    );
  }
}
