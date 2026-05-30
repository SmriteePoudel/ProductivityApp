import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

// GET - Fetch a specific permission
export const GET = requireAdmin(async (request, { params }) => {
  try {
    const { key } = params;

    // Default permissions lookup
    const defaultPermissions = {
      canAdd: {
        key: "canAdd",
        label: "Add Content",
        description: "Create new items",
        category: "basic",
        isActive: true,
        isCustom: false,
      },
      canEdit: {
        key: "canEdit",
        label: "Edit Content",
        description: "Modify existing items",
        category: "basic",
        isActive: true,
        isCustom: false,
      },
      canDelete: {
        key: "canDelete",
        label: "Delete Content",
        description: "Remove items",
        category: "basic",
        isActive: true,
        isCustom: false,
      },
      canView: {
        key: "canView",
        label: "View Content",
        description: "Read access to content",
        category: "basic",
        isActive: true,
        isCustom: false,
      },
      canReset: {
        key: "canReset",
        label: "System Reset",
        description: "Reset system data",
        category: "admin",
        isActive: true,
        isCustom: false,
      },
      canManageUsers: {
        key: "canManageUsers",
        label: "Manage Users",
        description: "Create and edit users",
        category: "admin",
        isActive: true,
        isCustom: false,
      },
      canManageRoles: {
        key: "canManageRoles",
        label: "Manage Roles",
        description: "Create and edit roles",
        category: "admin",
        isActive: true,
        isCustom: false,
      },
      canManagePermissions: {
        key: "canManagePermissions",
        label: "Manage Permissions",
        description: "Configure permissions",
        category: "admin",
        isActive: true,
        isCustom: false,
      },
      canManageTasks: {
        key: "canManageTasks",
        label: "Manage Tasks",
        description: "Full task management",
        category: "content",
        isActive: true,
        isCustom: false,
      },
      canManageCategories: {
        key: "canManageCategories",
        label: "Manage Categories",
        description: "Category management",
        category: "content",
        isActive: true,
        isCustom: false,
      },
      canManageProjects: {
        key: "canManageProjects",
        label: "Manage Projects",
        description: "Project management",
        category: "content",
        isActive: true,
        isCustom: false,
      },
      canManagePages: {
        key: "canManagePages",
        label: "Manage Pages",
        description: "Page management",
        category: "content",
        isActive: true,
        isCustom: false,
      },
      canAccessAdminPanel: {
        key: "canAccessAdminPanel",
        label: "Admin Panel",
        description: "Access admin dashboard",
        category: "system",
        isActive: true,
        isCustom: false,
      },
      canViewAnalytics: {
        key: "canViewAnalytics",
        label: "View Analytics",
        description: "Access analytics data",
        category: "system",
        isActive: true,
        isCustom: false,
      },
      canExportData: {
        key: "canExportData",
        label: "Export Data",
        description: "Export system data",
        category: "system",
        isActive: true,
        isCustom: false,
      },
      canImportData: {
        key: "canImportData",
        label: "Import Data",
        description: "Import system data",
        category: "system",
        isActive: true,
        isCustom: false,
      },
      canShareContent: {
        key: "canShareContent",
        label: "Share Content",
        description: "Share items with others",
        category: "collaboration",
        isActive: true,
        isCustom: false,
      },
      canInviteUsers: {
        key: "canInviteUsers",
        label: "Invite Users",
        description: "Invite new users",
        category: "collaboration",
        isActive: true,
        isCustom: false,
      },
      canManageTeams: {
        key: "canManageTeams",
        label: "Manage Teams",
        description: "Team management",
        category: "collaboration",
        isActive: true,
        isCustom: false,
      },
      canBulkOperations: {
        key: "canBulkOperations",
        label: "Bulk Operations",
        description: "Perform bulk actions",
        category: "advanced",
        isActive: true,
        isCustom: false,
      },
      canOverridePermissions: {
        key: "canOverridePermissions",
        label: "Override Permissions",
        description: "Override user permissions",
        category: "advanced",
        isActive: true,
        isCustom: false,
      },
      canViewAllData: {
        key: "canViewAllData",
        label: "View All Data",
        description: "Access all system data",
        category: "advanced",
        isActive: true,
        isCustom: false,
      },
      canManageHR: {
        key: "canManageHR",
        label: "Manage HR",
        description: "HR department access",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      canManageMarketing: {
        key: "canManageMarketing",
        label: "Manage Marketing",
        description: "Marketing department access",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      canManageFinance: {
        key: "canManageFinance",
        label: "Manage Finance",
        description: "Finance department access",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      canManageBlog: {
        key: "canManageBlog",
        label: "Manage Blog",
        description: "Blog management",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      canManageSEO: {
        key: "canManageSEO",
        label: "Manage SEO",
        description: "SEO management",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      canManageDevelopment: {
        key: "canManageDevelopment",
        label: "Manage Development",
        description: "Development access",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      canManageDesign: {
        key: "canManageDesign",
        label: "Manage Design",
        description: "Design department access",
        category: "department",
        isActive: true,
        isCustom: false,
      },
    };

    const permission = defaultPermissions[key];

    if (!permission) {
      return NextResponse.json(
        { success: false, error: "Permission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      permission,
      message: "Permission retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching permission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch permission" },
      { status: 500 }
    );
  }
});

// PUT - Update a permission
export const PUT = requireAdmin(async (request, { params }) => {
  try {
    const { key } = params;
    const body = await request.json();
    const { label, description, category, isActive } = body;

    // Validation
    if (!label || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Permission label and description are required",
        },
        { status: 400 }
      );
    }

    // For now, we'll just return success since we don't have a permissions collection
    // In a real implementation, you would update this in the database
    const updatedPermission = {
      key,
      label,
      description,
      category: category || "custom",
      isActive: isActive !== false,
      isCustom: true,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      permission: updatedPermission,
      message: "Permission updated successfully",
    });
  } catch (error) {
    console.error("Error updating permission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update permission" },
      { status: 500 }
    );
  }
});

// DELETE - Delete a permission
export const DELETE = requireAdmin(async (request, { params }) => {
  try {
    const { key } = params;

    // Check if it's a default permission (should not be deleted)
    const defaultPermissionKeys = [
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
    ];

    if (defaultPermissionKeys.includes(key)) {
      return NextResponse.json(
        { success: false, error: "Cannot delete default permissions" },
        { status: 400 }
      );
    }

    // For now, we'll just return success since we don't have a permissions collection
    // In a real implementation, you would delete this from the database

    return NextResponse.json({
      success: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting permission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete permission" },
      { status: 500 }
    );
  }
});
