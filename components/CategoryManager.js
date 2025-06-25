"use client";

import { useState, useEffect } from "react";

export default function CategoryManager({ onClose, onCategoryUpdate }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6",
    icon: "📋",
  });
  const [isCreating, setIsCreating] = useState(false);

  const colorOptions = [
    {
      name: "Blue",
      value: "#3B82F6",
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
    {
      name: "Pink",
      value: "#EC4899",
      bg: "bg-pink-100",
      text: "text-pink-700",
    },
    {
      name: "Purple",
      value: "#8B5CF6",
      bg: "bg-purple-100",
      text: "text-purple-700",
    },
    {
      name: "Green",
      value: "#10B981",
      bg: "bg-green-100",
      text: "text-green-700",
    },
    {
      name: "Yellow",
      value: "#F59E0B",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },
    { name: "Red", value: "#EF4444", bg: "bg-red-100", text: "text-red-700" },
    {
      name: "Indigo",
      value: "#6366F1",
      bg: "bg-indigo-100",
      text: "text-indigo-700",
    },
    {
      name: "Teal",
      value: "#14B8A6",
      bg: "bg-teal-100",
      text: "text-teal-700",
    },
  ];

  const iconOptions = [
    "📋",
    "📝",
    "📚",
    "💼",
    "🎯",
    "⭐",
    "💡",
    "🎨",
    "🏠",
    "🚗",
    "🍕",
    "☕",
    "💻",
    "📱",
    "🎵",
    "🎬",
    "🏃‍♀️",
    "🧘‍♀️",
    "📖",
    "✏️",
    "🎓",
    "🛒",
    "🏥",
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchCategories();
        if (onCategoryUpdate) onCategoryUpdate();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon,
    });
    setIsCreating(true);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories();
        if (onCategoryUpdate) onCategoryUpdate();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", color: "#3B82F6", icon: "📋" });
    setEditingCategory(null);
    setIsCreating(false);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Loading categories...
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          Manage Categories 🏷️
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Create/Edit Form */}
      <div className="bg-white/60 dark:bg-gray-700/60 rounded-xl p-6 border border-pink-100 dark:border-purple-600 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {editingCategory ? "Edit Category ✏️" : "Create New Category ✨"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, color: color.value })
                    }
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color.value
                        ? "border-gray-800 dark:border-white scale-110"
                        : "border-gray-300 dark:border-gray-600 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-8 h-8 rounded-lg border-2 text-lg transition-all ${
                      formData.icon === icon
                        ? "border-pink-400 bg-pink-50 dark:bg-pink-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-pink-300"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 font-medium"
            >
              {editingCategory ? "Update Category" : "Create Category"}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Categories ({categories.length})
        </h3>

        {categories.length === 0 ? (
          <div className="text-center py-8 bg-white/60 dark:bg-gray-700/60 rounded-xl border border-pink-100 dark:border-purple-600">
            <span className="text-4xl mb-4 block">🏷️</span>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No categories yet. Create your first category to get started!
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200"
            >
              Create First Category
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-pink-100 dark:border-purple-600"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: category.color + "20" }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Color:{" "}
                      {colorOptions.find((c) => c.value === category.color)
                        ?.name || "Custom"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
//
