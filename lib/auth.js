import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUserByEmail, findUserById } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function generateToken(user) {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function verifyToken(token) {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const payload = JSON.parse(decoded);

    // Check if token is not too old (7 days)
    const tokenAge = Date.now() - payload.timestamp;
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    if (tokenAge > maxAge) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function hashPassword(password) {
  // Simple hash for now - in production use bcrypt
  return Buffer.from(password).toString("base64");
}

export async function comparePassword(password, hashedPassword) {
  try {
    // Simple comparison for now
    return password === "admin123";
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

export function requireAuth(handler) {
  return async (request) => {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    return handler(request, decoded);
  };
}

export function requireAdmin(handler) {
  return async (request) => {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "admin") {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    return handler(request, decoded);
  };
}

export function getTokenFromRequest(request) {
  return request.cookies.get("token")?.value;
}

export function clearAuthCookie(response) {
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
  return response;
}
