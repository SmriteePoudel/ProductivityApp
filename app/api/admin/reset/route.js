import { NextResponse } from "next/server";
import { resetAllData, resetAdminPassword } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// POST - Reset all data and admin password
export async function POST(request) {
  try {
    const handler = async (req, user) => {
      console.log("🔄 Admin reset requested by:", user.email);

      // Reset admin password first
      const passwordReset = await resetAdminPassword();
      console.log("Password reset result:", passwordReset);

      // Then reset all data
      const result = resetAllData();
      console.log("Data reset result:", result);

      return NextResponse.json({
        message: "All data and admin password have been reset successfully",
        adminCredentials: {
          email: "admin@example.com",
          password: "admin123",
        },
      });
    };

    return await requireAdmin(handler)(request);
  } catch (error) {
    console.error("Admin reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
