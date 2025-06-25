"use client";

import { useState, useEffect } from "react";

export default function UserManager({ user, onClose, onUserUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
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
            Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative">
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === "user"}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="sr-only"
              />
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.role === "user"
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                    👤
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">User</div>
                    <div className="text-sm text-gray-500">
                      Regular user access
                    </div>
                  </div>
                </div>
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === "admin"}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="sr-only"
              />
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.role === "admin"
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white">
                    👑
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Admin</div>
                    <div className="text-sm text-gray-500">
                      Full system access
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>
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
