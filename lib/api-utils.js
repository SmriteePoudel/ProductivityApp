import { NextResponse } from "next/server";

// Standard API response formats
export const apiResponse = {
  success: (data, message = "Success", status = 200) => {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
      },
      { status }
    );
  },

  error: (message = "Error", status = 500, details = null) => {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (details) {
      response.details = details;
    }

    return NextResponse.json(response, { status });
  },

  validationError: (errors, message = "Validation failed") => {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  },

  notFound: (message = "Resource not found") => {
    return NextResponse.json(
      {
        success: false,
        message,
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  },

  unauthorized: (message = "Unauthorized") => {
    return NextResponse.json(
      {
        success: false,
        message,
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  },

  forbidden: (message = "Forbidden") => {
    return NextResponse.json(
      {
        success: false,
        message,
        timestamp: new Date().toISOString(),
      },
      { status: 403 }
    );
  },
};

// Pagination utilities
export const paginateResults = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: data.length,
      pages: Math.ceil(data.length / limit),
      hasNext: endIndex < data.length,
      hasPrev: page > 1,
    },
  };
};

// Data sanitization utilities
export const sanitizeUser = (user) => {
  if (!user) return null;

  const { password, ...sanitizedUser } = user.toObject ? user.toObject() : user;
  return sanitizedUser;
};

export const sanitizeTask = (task) => {
  if (!task) return null;

  const sanitizedTask = task.toObject ? task.toObject() : task;

  // Format dates
  if (sanitizedTask.createdAt) {
    sanitizedTask.createdAt = new Date(sanitizedTask.createdAt).toISOString();
  }
  if (sanitizedTask.updatedAt) {
    sanitizedTask.updatedAt = new Date(sanitizedTask.updatedAt).toISOString();
  }
  if (sanitizedTask.dueDate) {
    sanitizedTask.dueDate = new Date(sanitizedTask.dueDate).toISOString();
  }
  if (sanitizedTask.completedAt) {
    sanitizedTask.completedAt = new Date(
      sanitizedTask.completedAt
    ).toISOString();
  }

  return sanitizedTask;
};

export const sanitizeProject = (project) => {
  if (!project) return null;

  const sanitizedProject = project.toObject ? project.toObject() : project;

  // Format dates
  if (sanitizedProject.createdAt) {
    sanitizedProject.createdAt = new Date(
      sanitizedProject.createdAt
    ).toISOString();
  }
  if (sanitizedProject.updatedAt) {
    sanitizedProject.updatedAt = new Date(
      sanitizedProject.updatedAt
    ).toISOString();
  }

  return sanitizedProject;
};

// Query parameter utilities
export const parseQueryParams = (searchParams) => {
  return {
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 10,
    sort: searchParams.get("sort") || "createdAt",
    order: searchParams.get("order") || "desc",
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    category: searchParams.get("category") || "",
  };
};

// Filter utilities
export const applyFilters = (data, filters) => {
  let filteredData = [...data];

  if (filters.status) {
    filteredData = filteredData.filter(
      (item) => item.status === filters.status
    );
  }

  if (filters.priority) {
    filteredData = filteredData.filter(
      (item) => item.priority === filters.priority
    );
  }

  if (filters.category) {
    filteredData = filteredData.filter(
      (item) => item.category === filters.category
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        item.name?.toLowerCase().includes(searchTerm)
    );
  }

  return filteredData;
};

// Sort utilities
export const applySorting = (data, sortBy = "createdAt", order = "desc") => {
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle date sorting
    if (aValue instanceof Date || bValue instanceof Date) {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle string sorting
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
    }
    if (typeof bValue === "string") {
      bValue = bValue.toLowerCase();
    }

    if (order === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return sortedData;
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// File upload utilities
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  } = options;

  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File too large" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "File type not allowed" };
  }

  return { valid: true };
};
