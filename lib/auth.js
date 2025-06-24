import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUserByEmail, findUserById } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function generateToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function authenticateUser(email, password) {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  return user;
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

    const user = findUserById(decoded.userId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 401 });
    }

    return handler(request, user);
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

    const user = findUserById(decoded.userId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 401 });
    }

    return handler(request, user);
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
