import { NextResponse } from "next/server";
import { connectDB, resetAllData } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const POST = requireAdmin(async (request) => {
  try {
    await connectDB();

    const result = resetAllData();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Reset data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
