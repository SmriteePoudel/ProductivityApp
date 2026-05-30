"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoleManagementPage() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const AVAILABLE_PERMISSIONS = {
    basic: [
      { key: "canAdd", label: "Add Content", description: "Create new items" },
      {
        key: "canEdit",
        label: "Edit Content",
        description: "Modify existing items",
      },
      {
        key: "canDelete",
        label: "Delete Content",
        description: "Remove items",
      },
      {
        key: "canView",
        label: "View Content",
        description: "Read access to content",
      },
    ],
    admin: [
      {
        key: "canReset",
        label: "System Reset",
        description: "Reset system data",
      },
      {
        key: "canManageUsers",
        label: "Manage Users",
        description: "Create and edit users",
      },
      {
        key: "canManageRoles",
        label: "Manage Roles",
        description: "Create and edit roles",
      },
      {
        key: "canManagePermissions",
        label: "Manage Permissions",
        description: "Configure permissions",
      },
    ],
    content: [
      {
        key: "canManageTasks",
        label: "Manage Tasks",
        description: "Full task management",
      },
      {
        key: "canManageCategories",
        label: "Manage Categories",
        description: "Category management",
      },
      {
        key: "canManageProjects",
        label: "Manage Projects",
        description: "Project management",
      },
      {
        key: "canManagePages",
        label: "Manage Pages",
        description: "Page management",
      },
    ],
    system: [
      {
        key: "canAccessAdminPanel",
        label: "Admin Panel",
        description: "Access admin dashboard",
      },
      {
        key: "canViewAnalytics",
        label: "View Analytics",
        description: "Access analytics data",
      },
      {
        key: "canExportData",
        label: "Export Data",
        description: "Export system data",
      },
      {
        key: "canImportData",
        label: "Import Data",
        description: "Import system data",
      },
    ],
    collaboration: [
      {
        key: "canShareContent",
        label: "Share Content",
        description: "Share items with others",
      },
      {
        key: "canInviteUsers",
        label: "Invite Users",
        description: "Invite new users",
      },
      {
        key: "canManageTeams",
        label: "Manage Teams",
        description: "Team management",
      },
    ],
    advanced: [
      {
        key: "canBulkOperations",
        label: "Bulk Operations",
        description: "Perform bulk actions",
      },
      {
        key: "canOverridePermissions",
        label: "Override Permissions",
        description: "Override user permissions",
      },
      {
        key: "canViewAllData",
        label: "View All Data",
        description: "Access all system data",
      },
    ],
    department: [
      {
        key: "canManageHR",
        label: "Manage HR",
        description: "HR department access",
      },
      {
        key: "canManageMarketing",
        label: "Manage Marketing",
        description: "Marketing department access",
      },
      {
        key: "canManageFinance",
        label: "Manage Finance",
        description: "Finance department access",
      },
      {
        key: "canManageBlog",
        label: "Manage Blog",
        description: "Blog management",
      },
      {
        key: "canManageSEO",
        label: "Manage SEO",
        description: "SEO management",
      },
      {
        key: "canManageDevelopment",
        label: "Manage Development",
        description: "Development access",
      },
      {
        key: "canManageDesign",
        label: "Manage Design",
        description: "Design department access",
      },
    ],
  };

  // Default role template
  const defaultRole = {
    name: "",
    key: "",
    description: "",
    icon: "👤",
    color: "from-blue-400 to-green-400",
    level: 1,
    permissions: [],
    isActive: true,
  };

  const [formData, setFormData] = useState(defaultRole);

  useEffect(() => {
    fetchRoles();

    // Check if we're editing a role from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const editRoleKey = urlParams.get("edit");
    if (editRoleKey) {
      // Find the role to edit
      const roleToEdit = roles.find((role) => role.key === editRoleKey);
      if (roleToEdit) {
        handleEdit(roleToEdit);
      }
    }
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/roles", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to fetch roles. Status:",
          response.status,
          errorText
        );
        setError("Failed to fetch roles from server. Showing default roles.");
        // Fallback to default roles
        setRoles([
          {
            _id: "admin",
            name: "Administrator",
            key: "admin",
            description:
              "Full system access with complete control over all features, users, and data.",
            icon: "👑",
            color: "from-pink-400 to-purple-400",
            level: 5,
            permissions: Object.values(AVAILABLE_PERMISSIONS)
              .flat()
              .map((p) => p.key),
            isActive: true,
          },
          {
            _id: "user",
            name: "Standard User",
            key: "user",
            description: "Basic user access with limited permissions.",
            icon: "👤",
            color: "from-blue-400 to-green-400",
            level: 1,
            permissions: ["canAdd", "canEdit", "canView", "canShareContent"],
            isActive: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setError("Network error: Failed to fetch roles. Showing default roles.");
      // Fallback to default roles
      setRoles([
        {
          _id: "admin",
          name: "Administrator",
          key: "admin",
          description:
            "Full system access with complete control over all features, users, and data.",
          icon: "👑",
          color: "from-pink-400 to-purple-400",
          level: 5,
          permissions: Object.values(AVAILABLE_PERMISSIONS)
            .flat()
            .map((p) => p.key),
          isActive: true,
        },
        {
          _id: "user",
          name: "Standard User",
          key: "user",
          description: "Basic user access with limited permissions.",
          icon: "👤",
          color: "from-blue-400 to-green-400",
          level: 1,
          permissions: ["canAdd", "canEdit", "canView", "canShareContent"],
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Validate form
      if (!formData.name.trim()) {
        setError("Role name is required");
        return;
      }
      if (!formData.key.trim()) {
        setError("Role key is required");
        return;
      }
      if (formData.permissions.length === 0) {
        setError("At least one permission must be selected");
        return;
      }

      const url = editingRole
        ? `/api/admin/roles/${editingRole._id}`
        : "/api/admin/roles";
      const method = editingRole ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        setSuccess(
          editingRole
            ? "Role updated successfully!"
            : "Role created successfully!"
        );
        setShowForm(false);
        setEditingRole(null);
        setFormData(defaultRole);
        fetchRoles();

        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save role");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      key: role.key,
      description: role.description,
      icon: role.icon,
      color: role.color,
      level: role.level,
      permissions: role.permissions || [],
      isActive: role.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (roleId) => {
    if (
      !confirm(
        "Are you sure you want to delete this role? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSuccess("Role deleted successfully!");
        fetchRoles();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      setError("Network error. Please try again.");
    }
  };

  const handlePermissionToggle = (permissionKey) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter((p) => p !== permissionKey)
        : [...prev.permissions, permissionKey],
    }));
  };

  const resetForm = () => {
    setFormData(defaultRole);
    setEditingRole(null);
    setShowForm(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span>🛡️</span>
                Role Management
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage user roles with custom permissions
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/admin-dashboard")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-200"
              >
                + Add New Role
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Role Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingRole ? "Edit Role" : "Create New Role"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                    placeholder="e.g., Content Manager"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Key *
                  </label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        key: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                    placeholder="e.g., content_manager"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                  placeholder="Describe the role's purpose and responsibilities"
                />
              </div>

              {/* Visual Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                    placeholder="👤"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Gradient
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                  >
                    <option value="from-blue-400 to-green-400">
                      Blue to Green
                    </option>
                    <option value="from-purple-400 to-pink-400">
                      Purple to Pink
                    </option>
                    <option value="from-red-400 to-orange-400">
                      Red to Orange
                    </option>
                    <option value="from-green-400 to-blue-400">
                      Green to Blue
                    </option>
                    <option value="from-yellow-400 to-orange-400">
                      Yellow to Orange
                    </option>
                    <option value="from-indigo-400 to-purple-400">
                      Indigo to Purple
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={
                      isNaN(formData.level) || formData.level === undefined
                        ? 1
                        : formData.level
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Permissions ({formData.permissions.length} selected)
                </label>
                <div className="space-y-4">
                  {Object.entries(AVAILABLE_PERMISSIONS).map(
                    ([category, permissions]) => (
                      <div
                        key={category}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h3 className="text-lg font-medium text-gray-800 mb-3 capitalize">
                          {category} Permissions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {permissions.map((permission) => (
                            <label
                              key={permission.key}
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(
                                  permission.key
                                )}
                                onChange={() =>
                                  handlePermissionToggle(permission.key)
                                }
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {permission.label}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {permission.description}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">🔄</span>
                      Saving...
                    </span>
                  ) : (
                    <span>{editingRole ? "Update Role" : "Create Role"}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Roles List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Existing Roles
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div
                key={role._id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl bg-gradient-to-r ${role.color}`}
                    >
                      {role.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {role.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Level {role.level}</span>
                        <span>•</span>
                        <span>{role.permissions?.length || 0} permissions</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            role.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {role.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    {role.key !== "admin" && (
                      <button
                        onClick={() => handleDelete(role._id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{role.description}</p>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Key Permissions:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions?.slice(0, 5).map((permission) => {
                      const perm = Object.values(AVAILABLE_PERMISSIONS)
                        .flat()
                        .find((p) => p.key === permission);
                      return (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {perm?.label || permission}
                        </span>
                      );
                    })}
                    {role.permissions?.length > 5 && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        +{role.permissions.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
