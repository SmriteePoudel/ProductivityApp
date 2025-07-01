"use client";

import { useState, useEffect } from "react";

export default function UserManager({ user, onClose, onUserUpdate }) {
  const ALL_ROLES = [
    { key: "admin", label: "Admin", desc: "Full system access", icon: "👑" },
    { key: "user", label: "User", desc: "Regular user access", icon: "👤" },
    {
      key: "developer",
      label: "Developer",
      desc: "Developer tools",
      icon: "💻",
    },
    { key: "designer", label: "Designer", desc: "Design tools", icon: "🎨" },
    { key: "hr", label: "HR", desc: "HR dashboard", icon: "🧑‍💼" },
    {
      key: "marketing",
      label: "Marketing",
      desc: "Marketing dashboard",
      icon: "📢",
    },
    { key: "finance", label: "Finance", desc: "Finance dashboard", icon: "💰" },
    {
      key: "blog_writer",
      label: "Blog Writer",
      desc: "Blog tools",
      icon: "📝",
    },
    { key: "seo_manager", label: "SEO Manager", desc: "SEO tools", icon: "🔍" },
    {
      key: "project_manager",
      label: "Project Manager",
      desc: "Project management",
      icon: "📁",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roles: ["user"],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        roles: Array.isArray(user.roles)
          ? user.roles
          : user.role
          ? [user.role]
          : ["user"],
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!user && !formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = "At least one role must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const url = user ? `/api/admin/users/${user._id}` : "/api/admin/users";
      const method = user ? "PUT" : "POST";

      const payload = { ...formData };
      if (!formData.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onUserUpdate();
        onClose();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Error saving user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          {user ? "Edit User ✏️" : "Create New User ✨"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white text-gray-900 ${
              errors.name ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="Enter full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white text-gray-900 ${
              errors.email ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password {user && "(leave blank to keep current)"}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white text-gray-900 ${
              errors.password ? "border-red-300" : "border-gray-200"
            }`}
            placeholder={
              user ? "Enter new password (optional)" : "Enter password"
            }
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roles
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ALL_ROLES.map((role) => (
              <label
                key={role.key}
                className="relative flex items-center gap-2 cursor-pointer p-2 border rounded-lg transition-all bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-300"
              >
                <input
                  type="checkbox"
                  name="roles"
                  value={role.key}
                  checked={formData.roles.includes(role.key)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => {
                      let newRoles = prev.roles || [];
                      if (checked) {
                        newRoles = [...newRoles, role.key];
                      } else {
                        newRoles = newRoles.filter((r) => r !== role.key);
                      }
                      return { ...prev, roles: newRoles };
                    });
                  }}
                  className="accent-purple-500 w-5 h-5"
                />
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-lg bg-purple-100">
                  {role.icon}
                </span>
                <span>
                  <span className="font-medium text-gray-900">
                    {role.label}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {role.desc}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {errors.roles && (
            <p className="text-red-500 text-sm mt-1">{errors.roles}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">🔄</span>
                Saving...
              </span>
            ) : (
              <span>{user ? "Update User" : "Create User"}</span>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
