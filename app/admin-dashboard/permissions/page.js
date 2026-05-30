"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PermissionManagementPage() {
  const router = useRouter();
  const [permissions, setPermissions] = useState([]);
  const [editingPermission, setEditingPermission] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Default permissions structure
  const DEFAULT_PERMISSIONS = {
    basic: [
      {
        key: "canAdd",
        label: "Add Content",
        description: "Create new items",
        category: "basic",
        isActive: true,
      },
      {
        key: "canEdit",
        label: "Edit Content",
        description: "Modify existing items",
        category: "basic",
        isActive: true,
      },
      {
        key: "canDelete",
        label: "Delete Content",
        description: "Remove items",
        category: "basic",
        isActive: true,
      },
      {
        key: "canView",
        label: "View Content",
        description: "Read access to content",
        category: "basic",
        isActive: true,
      },
    ],
    admin: [
      {
        key: "canReset",
        label: "System Reset",
        description: "Reset system data",
        category: "admin",
        isActive: true,
      },
      {
        key: "canManageUsers",
        label: "Manage Users",
        description: "Create and edit users",
        category: "admin",
        isActive: true,
      },
      {
        key: "canManageRoles",
        label: "Manage Roles",
        description: "Create and edit roles",
        category: "admin",
        isActive: true,
      },
      {
        key: "canManagePermissions",
        label: "Manage Permissions",
        description: "Configure permissions",
        category: "admin",
        isActive: true,
      },
    ],
    content: [
      {
        key: "canManageTasks",
        label: "Manage Tasks",
        description: "Full task management",
        category: "content",
        isActive: true,
      },
      {
        key: "canManageCategories",
        label: "Manage Categories",
        description: "Category management",
        category: "content",
        isActive: true,
      },
      {
        key: "canManageProjects",
        label: "Manage Projects",
        description: "Project management",
        category: "content",
        isActive: true,
      },
      {
        key: "canManagePages",
        label: "Manage Pages",
        description: "Page management",
        category: "content",
        isActive: true,
      },
    ],
    system: [
      {
        key: "canAccessAdminPanel",
        label: "Admin Panel",
        description: "Access admin dashboard",
        category: "system",
        isActive: true,
      },
      {
        key: "canViewAnalytics",
        label: "View Analytics",
        description: "Access analytics data",
        category: "system",
        isActive: true,
      },
      {
        key: "canExportData",
        label: "Export Data",
        description: "Export system data",
        category: "system",
        isActive: true,
      },
      {
        key: "canImportData",
        label: "Import Data",
        description: "Import system data",
        category: "system",
        isActive: true,
      },
    ],
    collaboration: [
      {
        key: "canShareContent",
        label: "Share Content",
        description: "Share items with others",
        category: "collaboration",
        isActive: true,
      },
      {
        key: "canInviteUsers",
        label: "Invite Users",
        description: "Invite new users",
        category: "collaboration",
        isActive: true,
      },
      {
        key: "canManageTeams",
        label: "Manage Teams",
        description: "Team management",
        category: "collaboration",
        isActive: true,
      },
    ],
    advanced: [
      {
        key: "canBulkOperations",
        label: "Bulk Operations",
        description: "Perform bulk actions",
        category: "advanced",
        isActive: true,
      },
      {
        key: "canOverridePermissions",
        label: "Override Permissions",
        description: "Override user permissions",
        category: "advanced",
        isActive: true,
      },
      {
        key: "canViewAllData",
        label: "View All Data",
        description: "Access all system data",
        category: "advanced",
        isActive: true,
      },
    ],
    department: [
      {
        key: "canManageHR",
        label: "Manage HR",
        description: "HR department access",
        category: "department",
        isActive: true,
      },
      {
        key: "canManageMarketing",
        label: "Manage Marketing",
        description: "Marketing department access",
        category: "department",
        isActive: true,
      },
      {
        key: "canManageFinance",
        label: "Manage Finance",
        description: "Finance department access",
        category: "department",
        isActive: true,
      },
      {
        key: "canManageBlog",
        label: "Manage Blog",
        description: "Blog management",
        category: "department",
        isActive: true,
      },
      {
        key: "canManageSEO",
        label: "Manage SEO",
        description: "SEO management",
        category: "department",
        isActive: true,
      },
      {
        key: "canManageDevelopment",
        label: "Manage Development",
        description: "Development access",
        category: "department",
        isActive: true,
      },
      {
        key: "canManageDesign",
        label: "Manage Design",
        description: "Design department access",
        category: "department",
        isActive: true,
      },
    ],
  };

  const PERMISSION_CATEGORIES = [
    {
      key: "basic",
      name: "Basic",
      color: "from-blue-400 to-cyan-400",
      icon: "🔧",
    },
    {
      key: "admin",
      name: "Administrative",
      color: "from-red-400 to-pink-400",
      icon: "👑",
    },
    {
      key: "content",
      name: "Content",
      color: "from-green-400 to-emerald-400",
      icon: "📝",
    },
    {
      key: "system",
      name: "System",
      color: "from-purple-400 to-pink-400",
      icon: "⚙️",
    },
    {
      key: "collaboration",
      name: "Collaboration",
      color: "from-orange-400 to-red-400",
      icon: "🤝",
    },
    {
      key: "advanced",
      name: "Advanced",
      color: "from-indigo-400 to-purple-400",
      icon: "🚀",
    },
    {
      key: "department",
      name: "Department",
      color: "from-teal-400 to-cyan-400",
      icon: "🏢",
    },
    {
      key: "custom",
      name: "Custom",
      color: "from-gray-400 to-slate-400",
      icon: "🎯",
    },
  ];

  // Default permission template
  const defaultPermission = {
    key: "",
    label: "",
    description: "",
    category: "custom",
    isActive: true,
    isCustom: true,
  };

  const [formData, setFormData] = useState(defaultPermission);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/permissions", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPermissions(data.permissions || []);
      } else {
        console.warn("Failed to fetch permissions, using default permissions");
        // Flatten default permissions
        const allPermissions = Object.values(DEFAULT_PERMISSIONS).flat();
        setPermissions(allPermissions);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      // Fallback to default permissions
      const allPermissions = Object.values(DEFAULT_PERMISSIONS).flat();
      setPermissions(allPermissions);
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
      if (!formData.key.trim()) {
        setError("Permission key is required");
        return;
      }
      if (!formData.label.trim()) {
        setError("Permission label is required");
        return;
      }
      if (!formData.description.trim()) {
        setError("Permission description is required");
        return;
      }

      // Check if permission key already exists
      const existingPermission = permissions.find(
        (p) => p.key === formData.key
      );
      if (existingPermission && !editingPermission) {
        setError("Permission key already exists");
        return;
      }

      const url = editingPermission
        ? `/api/admin/permissions/${editingPermission.key}`
        : "/api/admin/permissions";
      const method = editingPermission ? "PUT" : "POST";

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
          editingPermission
            ? "Permission updated successfully!"
            : "Permission created successfully!"
        );
        setShowForm(false);
        setEditingPermission(null);
        setFormData(defaultPermission);
        fetchPermissions();

        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save permission");
      }
    } catch (error) {
      console.error("Error saving permission:", error);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (permission) => {
    setEditingPermission(permission);
    setFormData({
      key: permission.key,
      label: permission.label,
      description: permission.description,
      category: permission.category,
      isActive: permission.isActive,
      isCustom: permission.isCustom || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (permissionKey) => {
    if (
      !confirm(
        "Are you sure you want to delete this permission? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/permissions/${permissionKey}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSuccess("Permission deleted successfully!");
        fetchPermissions();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete permission");
      }
    } catch (error) {
      console.error("Error deleting permission:", error);
      setError("Network error. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData(defaultPermission);
    setEditingPermission(null);
    setShowForm(false);
    setError("");
  };

  const getPermissionsByCategory = () => {
    const grouped = {};
    permissions.forEach((permission) => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Loading permissions...</p>
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
                <span>🔑</span>
                Permission Management
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage custom permissions for roles
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
                className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg hover:from-green-500 hover:to-blue-500 transition-all duration-200"
              >
                + Add New Permission
              </button>
            </div>
          </div>
        </div>

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

        {/* Permission Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPermission
                  ? "Edit Permission"
                  : "Create New Permission"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Permission Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission Key *
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
                  placeholder="e.g., can_manage_reports"
                  required
                  disabled={editingPermission && !editingPermission.isCustom}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be used in code. Use lowercase with underscores.
                </p>
              </div>

              {/* Permission Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                  placeholder="e.g., Manage Reports"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                  placeholder="Describe what this permission allows users to do"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                >
                  {PERMISSION_CATEGORIES.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Inactive permissions won't be available for assignment to
                  roles
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg hover:from-green-500 hover:to-blue-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">🔄</span>
                      Saving...
                    </span>
                  ) : (
                    <span>
                      {editingPermission
                        ? "Update Permission"
                        : "Create Permission"}
                    </span>
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

        <div className="space-y-6">
          {Object.entries(getPermissionsByCategory()).map(
            ([categoryKey, categoryPermissions]) => {
              const category = PERMISSION_CATEGORIES.find(
                (c) => c.key === categoryKey
              );
              if (!category) return null;

              return (
                <div
                  key={categoryKey}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${category.color}`}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {category.name} Permissions
                      </h2>
                      <p className="text-gray-600">
                        {categoryPermissions.length} permissions
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryPermissions.map((permission) => (
                      <div
                        key={permission.key}
                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                          permission.isActive
                            ? "border-gray-200"
                            : "border-gray-300 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                              {permission.label}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {permission.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                                {permission.key}
                              </code>
                              {!permission.isActive && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                  Inactive
                                </span>
                              )}
                              {permission.isCustom && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  Custom
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(permission)}
                              className="px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-xs"
                            >
                              Edit
                            </button>
                            {permission.isCustom && (
                              <button
                                onClick={() => handleDelete(permission.key)}
                                className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-xs"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
