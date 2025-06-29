import { NextResponse } from "next/server";

// Error handling middleware
export function withErrorHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error("API Error:", error);

      // Handle different types of errors
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { error: "Validation failed", details: error.message },
          { status: 400 }
        );
      }

      if (error.name === "MongoError" && error.code === 11000) {
        return NextResponse.json(
          { error: "Duplicate entry", details: "This record already exists" },
          { status: 409 }
        );
      }

      if (error.name === "CastError") {
        return NextResponse.json(
          { error: "Invalid ID format" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

// Request validation middleware
export function validateRequest(schema) {
  return (handler) => {
    return async (request, context) => {
      try {
        const body = await request.json();
        const { error } = schema.validate(body);

        if (error) {
          return NextResponse.json(
            { error: "Validation failed", details: error.details[0].message },
            { status: 400 }
          );
        }

        return await handler(request, context);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid request body" },
          { status: 400 }
        );
      }
    };
  };
}

// Rate limiting middleware (simple in-memory)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100;

export function withRateLimit(handler) {
  return async (request, context) => {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, []);
    }

    const requests = rateLimitMap.get(ip);
    const validRequests = requests.filter((time) => time > windowStart);

    if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    validRequests.push(now);
    rateLimitMap.set(ip, validRequests);

    return await handler(request, context);
  };
}

// CORS middleware
export function withCORS(handler) {
  return async (request, context) => {
    const response = await handler(request, context);

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  };
}

// Logging middleware
export function withLogging(handler) {
  return async (request, context) => {
    const start = Date.now();
    const method = request.method;
    const url = request.url;

    console.log(`[${new Date().toISOString()}] ${method} ${url} - Started`);

    try {
      const response = await handler(request, context);
      const duration = Date.now() - start;

      console.log(
        `[${new Date().toISOString()}] ${method} ${url} - Completed (${duration}ms) - ${
          response.status
        }`
      );

      return response;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(
        `[${new Date().toISOString()}] ${method} ${url} - Failed (${duration}ms) - ${
          error.message
        }`
      );
      throw error;
    }
  };
}

// Combined middleware
export function withMiddleware(handler, options = {}) {
  let wrappedHandler = handler;

  if (options.errorHandler !== false) {
    wrappedHandler = withErrorHandler(wrappedHandler);
  }

  if (options.rateLimit !== false) {
    wrappedHandler = withRateLimit(wrappedHandler);
  }

  if (options.cors !== false) {
    wrappedHandler = withCORS(wrappedHandler);
  }

  if (options.logging !== false) {
    wrappedHandler = withLogging(wrappedHandler);
  }

  return wrappedHandler;
}
