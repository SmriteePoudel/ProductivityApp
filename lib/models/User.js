import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator", "editor", "viewer"],
    default: "user",
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    maxlength: [300, "Bio cannot be more than 300 characters"],
    default: "",
  },
  permissions: {
    // Basic CRUD permissions
    canAdd: { type: Boolean, default: true },
    canEdit: { type: Boolean, default: true },
    canDelete: { type: Boolean, default: true },
    canView: { type: Boolean, default: true },

    // Administrative permissions
    canReset: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    canManageRoles: { type: Boolean, default: false },
    canManagePermissions: { type: Boolean, default: false },

    // Content management permissions
    canManageTasks: { type: Boolean, default: true },
    canManageCategories: { type: Boolean, default: true },
    canManageProjects: { type: Boolean, default: true },
    canManagePages: { type: Boolean, default: true },

    // System permissions
    canAccessAdminPanel: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: false },
    canExportData: { type: Boolean, default: false },
    canImportData: { type: Boolean, default: false },

    // Sharing and collaboration permissions
    canShareContent: { type: Boolean, default: true },
    canInviteUsers: { type: Boolean, default: false },
    canManageTeams: { type: Boolean, default: false },

    // Advanced permissions
    canBulkOperations: { type: Boolean, default: false },
    canOverridePermissions: { type: Boolean, default: false },
    canViewAllData: { type: Boolean, default: false },
  },
  // Role history for audit trail
  roleHistory: [
    {
      role: { type: String, required: true },
      assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      assignedAt: { type: Date, default: Date.now },
      reason: { type: String, default: "" },
    },
  ],
  // Additional role metadata
  roleMetadata: {
    isActive: { type: Boolean, default: true },
    lastRoleChange: { type: Date },
    roleExpiryDate: { type: Date },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Update role metadata when role changes
  if (this.isModified("role")) {
    this.roleMetadata.lastRoleChange = new Date();

    // Add to role history
    if (!this.roleHistory) {
      this.roleHistory = [];
    }

    this.roleHistory.push({
      role: this.role,
      assignedAt: new Date(),
    });
  }

  next();
});

// Static method to get default permissions for a role
userSchema.statics.getDefaultPermissions = function (role) {
  const defaultPermissions = {
    user: {
      canAdd: true,
      canEdit: true,
      canDelete: true,
      canView: true,
      canReset: false,
      canManageUsers: false,
      canManageRoles: false,
      canManagePermissions: false,
      canManageTasks: true,
      canManageCategories: true,
      canManageProjects: true,
      canManagePages: true,
      canAccessAdminPanel: false,
      canViewAnalytics: false,
      canExportData: false,
      canImportData: false,
      canShareContent: true,
      canInviteUsers: false,
      canManageTeams: false,
      canBulkOperations: false,
      canOverridePermissions: false,
      canViewAllData: false,
    },
    admin: {
      canAdd: true,
      canEdit: true,
      canDelete: true,
      canView: true,
      canReset: true,
      canManageUsers: true,
      canManageRoles: true,
      canManagePermissions: true,
      canManageTasks: true,
      canManageCategories: true,
      canManageProjects: true,
      canManagePages: true,
      canAccessAdminPanel: true,
      canViewAnalytics: true,
      canExportData: true,
      canImportData: true,
      canShareContent: true,
      canInviteUsers: true,
      canManageTeams: true,
      canBulkOperations: true,
      canOverridePermissions: true,
      canViewAllData: true,
    },
    moderator: {
      canAdd: true,
      canEdit: true,
      canDelete: true,
      canView: true,
      canReset: false,
      canManageUsers: true,
      canManageRoles: false,
      canManagePermissions: false,
      canManageTasks: true,
      canManageCategories: true,
      canManageProjects: true,
      canManagePages: true,
      canAccessAdminPanel: true,
      canViewAnalytics: true,
      canExportData: true,
      canImportData: false,
      canShareContent: true,
      canInviteUsers: true,
      canManageTeams: true,
      canBulkOperations: true,
      canOverridePermissions: false,
      canViewAllData: true,
    },
    editor: {
      canAdd: true,
      canEdit: true,
      canDelete: false,
      canView: true,
      canReset: false,
      canManageUsers: false,
      canManageRoles: false,
      canManagePermissions: false,
      canManageTasks: true,
      canManageCategories: true,
      canManageProjects: true,
      canManagePages: true,
      canAccessAdminPanel: false,
      canViewAnalytics: false,
      canExportData: false,
      canImportData: false,
      canShareContent: true,
      canInviteUsers: false,
      canManageTeams: false,
      canBulkOperations: false,
      canOverridePermissions: false,
      canViewAllData: false,
    },
    viewer: {
      canAdd: false,
      canEdit: false,
      canDelete: false,
      canView: true,
      canReset: false,
      canManageUsers: false,
      canManageRoles: false,
      canManagePermissions: false,
      canManageTasks: false,
      canManageCategories: false,
      canManageProjects: false,
      canManagePages: false,
      canAccessAdminPanel: false,
      canViewAnalytics: false,
      canExportData: false,
      canImportData: false,
      canShareContent: false,
      canInviteUsers: false,
      canManageTeams: false,
      canBulkOperations: false,
      canOverridePermissions: false,
      canViewAllData: false,
    },
  };

  return defaultPermissions[role] || defaultPermissions.user;
};

// Instance method to check if user has a specific permission
userSchema.methods.hasPermission = function (permission) {
  return this.permissions[permission] === true;
};

// Instance method to check if user has any of the given permissions
userSchema.methods.hasAnyPermission = function (permissions) {
  return permissions.some((permission) => this.hasPermission(permission));
};

// Instance method to check if user has all of the given permissions
userSchema.methods.hasAllPermissions = function (permissions) {
  return permissions.every((permission) => this.hasPermission(permission));
};

// Instance method to check if user can perform an action on a resource
userSchema.methods.canPerform = function (action, resource) {
  const permissionMap = {
    create: "canAdd",
    read: "canView",
    update: "canEdit",
    delete: "canDelete",
    manage: `canManage${resource.charAt(0).toUpperCase() + resource.slice(1)}`,
  };

  const permission = permissionMap[action];
  return permission ? this.hasPermission(permission) : false;
};

export default mongoose.models.User || mongoose.model("User", userSchema);
