import User from "./models/User.js";

// Permission constants for easy reference
export const PERMISSIONS = {
  // Basic CRUD permissions
  CAN_ADD: "canAdd",
  CAN_EDIT: "canEdit",
  CAN_DELETE: "canDelete",
  CAN_VIEW: "canView",

  // Administrative permissions
  CAN_RESET: "canReset",
  CAN_MANAGE_USERS: "canManageUsers",
  CAN_MANAGE_ROLES: "canManageRoles",
  CAN_MANAGE_PERMISSIONS: "canManagePermissions",

  // Content management permissions
  CAN_MANAGE_TASKS: "canManageTasks",
  CAN_MANAGE_CATEGORIES: "canManageCategories",
  CAN_MANAGE_PROJECTS: "canManageProjects",
  CAN_MANAGE_PAGES: "canManagePages",

  // System permissions
  CAN_ACCESS_ADMIN_PANEL: "canAccessAdminPanel",
  CAN_VIEW_ANALYTICS: "canViewAnalytics",
  CAN_EXPORT_DATA: "canExportData",
  CAN_IMPORT_DATA: "canImportData",

  // Sharing and collaboration permissions
  CAN_SHARE_CONTENT: "canShareContent",
  CAN_INVITE_USERS: "canInviteUsers",
  CAN_MANAGE_TEAMS: "canManageTeams",

  // Advanced permissions
  CAN_BULK_OPERATIONS: "canBulkOperations",
  CAN_OVERRIDE_PERMISSIONS: "canOverridePermissions",
  CAN_VIEW_ALL_DATA: "canViewAllData",
};

// Role definitions with their default permissions
export const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  EDITOR: "editor",
  USER: "user",
  VIEWER: "viewer",
};

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  BASIC_CRUD: [
    PERMISSIONS.CAN_ADD,
    PERMISSIONS.CAN_EDIT,
    PERMISSIONS.CAN_DELETE,
    PERMISSIONS.CAN_VIEW,
  ],
  ADMINISTRATIVE: [
    PERMISSIONS.CAN_RESET,
    PERMISSIONS.CAN_MANAGE_USERS,
    PERMISSIONS.CAN_MANAGE_ROLES,
    PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  ],
  CONTENT_MANAGEMENT: [
    PERMISSIONS.CAN_MANAGE_TASKS,
    PERMISSIONS.CAN_MANAGE_CATEGORIES,
    PERMISSIONS.CAN_MANAGE_PROJECTS,
    PERMISSIONS.CAN_MANAGE_PAGES,
  ],
  SYSTEM: [
    PERMISSIONS.CAN_ACCESS_ADMIN_PANEL,
    PERMISSIONS.CAN_VIEW_ANALYTICS,
    PERMISSIONS.CAN_EXPORT_DATA,
    PERMISSIONS.CAN_IMPORT_DATA,
  ],
  COLLABORATION: [
    PERMISSIONS.CAN_SHARE_CONTENT,
    PERMISSIONS.CAN_INVITE_USERS,
    PERMISSIONS.CAN_MANAGE_TEAMS,
  ],
  ADVANCED: [
    PERMISSIONS.CAN_BULK_OPERATIONS,
    PERMISSIONS.CAN_OVERRIDE_PERMISSIONS,
    PERMISSIONS.CAN_VIEW_ALL_DATA,
  ],
};

// Role descriptions and metadata
export const ROLE_METADATA = {
  [ROLES.ADMIN]: {
    name: "Administrator",
    description:
      "Full system access with complete control over all features, users, and data.",
    color: "#DC2626",
    icon: "👑",
    level: 5,
    capabilities: [
      "Create, read, update, delete all content",
      "Manage users and roles",
      "Access admin panel and analytics",
      "Export and import data",
      "Override permissions",
      "View all data across the system",
      "Bulk operations",
      "System configuration",
    ],
  },
  [ROLES.MODERATOR]: {
    name: "Moderator",
    description:
      "Enhanced user with team management capabilities and administrative access.",
    color: "#7C3AED",
    icon: "🛡️",
    level: 4,
    capabilities: [
      "Create, read, update, delete content",
      "Manage users (but not roles)",
      "Access admin panel",
      "View analytics and export data",
      "Invite users and manage teams",
      "Bulk operations",
      "View all data",
    ],
  },
  [ROLES.EDITOR]: {
    name: "Editor",
    description:
      "Content creator with ability to create and edit but not delete content.",
    color: "#059669",
    icon: "✏️",
    level: 3,
    capabilities: [
      "Create and edit content",
      "View content",
      "Share content",
      "Cannot delete content",
      "No administrative access",
    ],
  },
  [ROLES.USER]: {
    name: "User",
    description:
      "Standard user with basic CRUD operations on their own content.",
    color: "#3B82F6",
    icon: "👤",
    level: 2,
    capabilities: [
      "Create, read, update, delete own content",
      "Share content",
      "View own data",
      "No administrative access",
    ],
  },
  [ROLES.VIEWER]: {
    name: "Viewer",
    description: "Read-only access for stakeholders and external parties.",
    color: "#6B7280",
    icon: "👁️",
    level: 1,
    capabilities: [
      "View content only",
      "Cannot create, edit, or delete",
      "Limited access to shared content",
      "No administrative access",
    ],
  },
};

// Permission checking utilities
export class PermissionManager {
  static hasPermission(user, permission) {
    if (!user || !user.permissions) return false;
    return user.permissions[permission] === true;
  }

  static hasAnyPermission(user, permissions) {
    if (!user || !user.permissions) return false;
    return permissions.some((permission) =>
      this.hasPermission(user, permission)
    );
  }

  static hasAllPermissions(user, permissions) {
    if (!user || !user.permissions) return false;
    return permissions.every((permission) =>
      this.hasPermission(user, permission)
    );
  }

  static canPerform(user, action, resource) {
    const permissionMap = {
      create: PERMISSIONS.CAN_ADD,
      read: PERMISSIONS.CAN_VIEW,
      update: PERMISSIONS.CAN_EDIT,
      delete: PERMISSIONS.CAN_DELETE,
      manage: `canManage${
        resource.charAt(0).toUpperCase() + resource.slice(1)
      }`,
    };

    const permission = permissionMap[action];
    return permission ? this.hasPermission(user, permission) : false;
  }

  static canAccessResource(user, resource, action = "read") {
    // Check if user has permission to perform action on resource
    if (!this.canPerform(user, action, resource)) {
      return false;
    }

    // Additional checks for specific resources
    switch (resource.toLowerCase()) {
      case "admin":
        return this.hasPermission(user, PERMISSIONS.CAN_ACCESS_ADMIN_PANEL);
      case "analytics":
        return this.hasPermission(user, PERMISSIONS.CAN_VIEW_ANALYTICS);
      case "users":
        return this.hasPermission(user, PERMISSIONS.CAN_MANAGE_USERS);
      case "roles":
        return this.hasPermission(user, PERMISSIONS.CAN_MANAGE_ROLES);
      default:
        return true;
    }
  }

  static canViewAllData(user) {
    return this.hasPermission(user, PERMISSIONS.CAN_VIEW_ALL_DATA);
  }

  static canManageUsers(user) {
    return this.hasPermission(user, PERMISSIONS.CAN_MANAGE_USERS);
  }

  static canManageRoles(user) {
    return this.hasPermission(user, PERMISSIONS.CAN_MANAGE_ROLES);
  }

  static canOverridePermissions(user) {
    return this.hasPermission(user, PERMISSIONS.CAN_OVERRIDE_PERMISSIONS);
  }

  static getRoleLevel(role) {
    return ROLE_METADATA[role]?.level || 0;
  }

  static canAssignRole(assigner, targetRole) {
    const assignerLevel = this.getRoleLevel(assigner.role);
    const targetLevel = this.getRoleLevel(targetRole);

    // Can only assign roles at or below your own level
    return assignerLevel >= targetLevel;
  }

  static canModifyUser(modifier, targetUser) {
    const modifierLevel = this.getRoleLevel(modifier.role);
    const targetLevel = this.getRoleLevel(targetUser.role);

    // Can only modify users at or below your own level
    return modifierLevel > targetLevel;
  }

  static getDefaultPermissions(role) {
    return User.getDefaultPermissions(role);
  }

  static validatePermissions(permissions) {
    const validPermissions = Object.values(PERMISSIONS);
    const invalidPermissions = Object.keys(permissions).filter(
      (permission) => !validPermissions.includes(permission)
    );

    if (invalidPermissions.length > 0) {
      throw new Error(`Invalid permissions: ${invalidPermissions.join(", ")}`);
    }

    return true;
  }

  static mergePermissions(basePermissions, additionalPermissions) {
    return {
      ...basePermissions,
      ...additionalPermissions,
    };
  }

  static getPermissionSummary(user) {
    if (!user || !user.permissions) return {};

    const summary = {
      role: user.role,
      roleMetadata: ROLE_METADATA[user.role] || {},
      permissions: {},
      groups: {},
    };

    // Group permissions by category
    Object.keys(PERMISSION_GROUPS).forEach((groupName) => {
      const groupPermissions = PERMISSION_GROUPS[groupName];
      summary.groups[groupName] = groupPermissions.map((permission) => ({
        permission,
        granted: this.hasPermission(user, permission),
      }));
    });

    // Individual permissions
    Object.values(PERMISSIONS).forEach((permission) => {
      summary.permissions[permission] = this.hasPermission(user, permission);
    });

    return summary;
  }
}

// Middleware for permission checking
export const requirePermission = (permission) => {
  return (handler) => {
    return async (request, context) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!PermissionManager.hasPermission(user, permission)) {
        return Response.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }

      return handler(request, context);
    };
  };
};

export const requireAnyPermission = (permissions) => {
  return (handler) => {
    return async (request, context) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!PermissionManager.hasAnyPermission(user, permissions)) {
        return Response.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }

      return handler(request, context);
    };
  };
};

export const requireAllPermissions = (permissions) => {
  return (handler) => {
    return async (request, context) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!PermissionManager.hasAllPermissions(user, permissions)) {
        return Response.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }

      return handler(request, context);
    };
  };
};

// Helper function to get user from request (import from auth.js)
import { getUserFromRequest } from "./auth.js";
