import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUserByEmail, findUserById } from "./db.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export function generateToken(user) {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
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

// Helper function to get user from request
export async function getUserFromRequest(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return decoded;
}
