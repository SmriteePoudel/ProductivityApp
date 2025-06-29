import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    return NextResponse.json({
      received: {
        email: email,
        password: password,
        emailLength: email?.length || 0,
        passwordLength: password?.length || 0,
      },
      expected: {
        email: "admin@example.com",
        password: "admin123",
        emailLength: 15,
        passwordLength: 8,
      },
      isValid: email === "admin@example.com" && password === "admin123",
      message: "Use email: admin@example.com and password: admin123",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
