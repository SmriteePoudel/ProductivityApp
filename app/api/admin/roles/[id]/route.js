import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";


export const GET = requireAdmin(async (request, { params }) => {
  try {
    const { id } = params;

    const defaultRoles = {
      admin: {
        _id: "admin",
        name: "Administrator",
        key: "admin",
        description:
          "Full system access with complete control over all features, users, and data.",
        icon: "👑",
        color: "from-pink-400 to-purple-400",
        level: 5,
        permissions: [
          "canAdd",
          "canEdit",
          "canDelete",
          "canView",
          "canReset",
          "canManageUsers",
          "canManageRoles",
          "canManagePermissions",
          "canManageTasks",
          "canManageCategories",
          "canManageProjects",
          "canManagePages",
          "canAccessAdminPanel",
          "canViewAnalytics",
          "canExportData",
          "canImportData",
          "canShareContent",
          "canInviteUsers",
          "canManageTeams",
          "canBulkOperations",
          "canOverridePermissions",
          "canViewAllData",
          "canManageHR",
          "canManageMarketing",
          "canManageFinance",
          "canManageBlog",
          "canManageSEO",
          "canManageDevelopment",
          "canManageDesign",
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        _id: "user",
        name: "Standard User",
        key: "user",
        description: "Basic user access with limited permissions.",
        icon: "👤",
        color: "from-blue-400 to-green-400",
        level: 1,
        permissions: ["canAdd", "canEdit", "canView", "canShareContent"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      moderator: {
        _id: "moderator",
        name: "Moderator",
        key: "moderator",
        description:
          "Enhanced user with team management capabilities and administrative access.",
        icon: "🛡️",
        color: "from-orange-400 to-red-400",
        level: 3,
        permissions: [
          "canAdd",
          "canEdit",
          "canDelete",
          "canView",
          "canManageUsers",
          "canManageTasks",
          "canManageCategories",
          "canAccessAdminPanel",
          "canViewAnalytics",
          "canExportData",
          "canShareContent",
          "canInviteUsers",
          "canManageTeams",
          "canBulkOperations",
          "canViewAllData",
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      editor: {
        _id: "editor",
        name: "Editor",
        key: "editor",
        description:
          "Content creator with ability to create and edit but not delete content.",
        icon: "✏️",
        color: "from-emerald-400 to-teal-400",
        level: 2,
        permissions: [
          "canAdd",
          "canEdit",
          "canView",
          "canShareContent",
          "canManagePages",
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const role = defaultRoles[id];
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({ role });
  } catch (error) {
    console.error("Get role error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});

// PUT - Update a role
export const PUT = requireAdmin(async (request, { params }) => {
  try {
    const { id } = params;
    const updateData = await request.json();

    // Validate required fields
    if (!updateData.name || !updateData.key) {
      return NextResponse.json(
        { error: "Role name and key are required" },
        { status: 400 }
      );
    }

    // Prevent updating admin role key
    if (id === "admin" && updateData.key !== "admin") {
      return NextResponse.json(
        { error: "Cannot change admin role key" },
        { status: 400 }
      );
    }

    // In a real application, you would update this in the database
    console.log("Role updated:", { id, updateData });

    return NextResponse.json({
      message: "Role updated successfully",
      role: {
        _id: id,
        ...updateData,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});

// DELETE - Delete a role
export const DELETE = requireAdmin(async (request, { params }) => {
  try {
    const { id } = params;

    // Prevent deleting admin role
    if (id === "admin") {
      return NextResponse.json(
        { error: "Cannot delete admin role" },
        { status: 400 }
      );
    }

    // Prevent deleting user role
    if (id === "user") {
      return NextResponse.json(
        { error: "Cannot delete user role" },
        { status: 400 }
      );
    }

    // In a real application, you would delete this from the database
    console.log("Role deleted:", id);

    return NextResponse.json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Delete role error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
