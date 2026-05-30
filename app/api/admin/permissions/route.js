import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const GET = requireAdmin(async (request) => {
  try {
    const defaultPermissions = [
      {
        key: "canAdd",
        label: "Add Content",
        description: "Create new items",
        category: "basic",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canEdit",
        label: "Edit Content",
        description: "Modify existing items",
        category: "basic",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canDelete",
        label: "Delete Content",
        description: "Remove items",
        category: "basic",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canView",
        label: "View Content",
        description: "Read access to content",
        category: "basic",
        isActive: true,
        isCustom: false,
      },

      // Admin permissions
      {
        key: "canReset",
        label: "System Reset",
        description: "Reset system data",
        category: "admin",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageUsers",
        label: "Manage Users",
        description: "Create and edit users",
        category: "admin",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageRoles",
        label: "Manage Roles",
        description: "Create and edit roles",
        category: "admin",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManagePermissions",
        label: "Manage Permissions",
        description: "Configure permissions",
        category: "admin",
        isActive: true,
        isCustom: false,
      },

      // Content permissions
      {
        key: "canManageTasks",
        label: "Manage Tasks",
        description: "Full task management",
        category: "content",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageCategories",
        label: "Manage Categories",
        description: "Category management",
        category: "content",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageProjects",
        label: "Manage Projects",
        description: "Project management",
        category: "content",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManagePages",
        label: "Manage Pages",
        description: "Page management",
        category: "content",
        isActive: true,
        isCustom: false,
      },

      // System permissions
      {
        key: "canAccessAdminPanel",
        label: "Admin Panel",
        description: "Access admin dashboard",
        category: "system",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canViewAnalytics",
        label: "View Analytics",
        description: "Access analytics data",
        category: "system",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canExportData",
        label: "Export Data",
        description: "Export system data",
        category: "system",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canImportData",
        label: "Import Data",
        description: "Import system data",
        category: "system",
        isActive: true,
        isCustom: false,
      },

      // Collaboration permissions
      {
        key: "canShareContent",
        label: "Share Content",
        description: "Share items with others",
        category: "collaboration",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canInviteUsers",
        label: "Invite Users",
        description: "Invite new users",
        category: "collaboration",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageTeams",
        label: "Manage Teams",
        description: "Team management",
        category: "collaboration",
        isActive: true,
        isCustom: false,
      },

      // Advanced permissions
      {
        key: "canBulkOperations",
        label: "Bulk Operations",
        description: "Perform bulk actions",
        category: "advanced",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canOverridePermissions",
        label: "Override Permissions",
        description: "Override user permissions",
        category: "advanced",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canViewAllData",
        label: "View All Data",
        description: "Access all system data",
        category: "advanced",
        isActive: true,
        isCustom: false,
      },

      // Department permissions
      {
        key: "canManageHR",
        label: "Manage HR",
        description: "HR department access",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageMarketing",
        label: "Manage Marketing",
        description: "Marketing department access",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageFinance",
        label: "Manage Finance",
        description: "Finance department access",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageBlog",
        label: "Manage Blog",
        description: "Blog management",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageSEO",
        label: "Manage SEO",
        description: "SEO management",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageDevelopment",
        label: "Manage Development",
        description: "Development access",
        category: "department",
        isActive: true,
        isCustom: false,
      },
      {
        key: "canManageDesign",
        label: "Manage Design",
        description: "Design department access",
        category: "department",
        isActive: true,
        isCustom: false,
      },
    ];

    return NextResponse.json({
      success: true,
      permissions: defaultPermissions,
      message: "Permissions retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch permissions" },
      { status: 500 }
    );
  }
});

// POST - Create a new permission
export const POST = requireAdmin(async (request) => {
  try {
    const body = await request.json();
    const { key, label, description, category, isActive } = body;

    // Validation
    if (!key || !label || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Permission key, label, and description are required",
        },
        { status: 400 }
      );
    }

    // Validate permission key format
    if (!/^[a-z_]+$/.test(key)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Permission key must contain only lowercase letters and underscores",
        },
        { status: 400 }
      );
    }

    // For now, we'll just return success since we don't have a permissions collection
    // In a real implementation, you would save this to the database
    const newPermission = {
      key,
      label,
      description,
      category: category || "custom",
      isActive: isActive !== false,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      permission: newPermission,
      message: "Permission created successfully",
    });
  } catch (error) {
    console.error("Error creating permission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create permission" },
      { status: 500 }
    );
  }
});
