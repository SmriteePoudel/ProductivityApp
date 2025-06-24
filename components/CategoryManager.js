"use client";

import { useState, useEffect } from "react";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#f8bbd0", // baby pink pastel (default for all pages)
    icon: "🏷️",
  });
  const [error, setError] = useState("");

  const iconOptions = [
    "🌸",
    "🌺",
    "🌷",
    "🌹",
    "🌻",
    "🌼",
    "💐",
    "🎀",
    "💖",
    "💕",
    "💗",
    "💓",
    "💝",
    "💞",
    "💟",
    "✨",
    "��",
    "⭐",
    "💫",
    "🎈",
    "🎊",
    "🎉",
    "🎁",
    "🎂",
  ];

  const colorOptions = [
    "#ff9ecd",
    "#ffb3d9",
    "#ffcce6",
    "#ffd6e7",
    "#ffe6f2",
    "#fff0f5",
    "#e6e6fa",
    "#d8bfd8",
    "#dda0dd",
    "#ee82ee",
    "#da70d6",
    "#ba55d3",
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
      console.error("Fetch categories error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

      const data = await response.json();

      if (response.ok) {
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ name: "", color: "#ff9ecd", icon: "��" });
        fetchCategories();
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon,
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? Tasks in this category will be unassigned."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Delete category error:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: "", color: "#ff9ecd", icon: "🌸" });
    setError("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-pink-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Categories ✨
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl hover:from-pink-500 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span>➕</span>
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="bg-white/80 dark:bg-purple-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-200 dark:border-purple-600">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-100 mb-4">
            {editingCategory ? "Edit Category ✨" : "Create New Category ✨"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2"
              >
                Category Name * 💖
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-3 border-2 border-pink-200 dark:border-purple-600 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent dark:bg-purple-700 dark:text-white transition-all duration-300 placeholder-purple-400"
                placeholder="Enter your beautiful category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                Icon ✨
              </label>
              <div className="grid grid-cols-8 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-3 text-xl rounded-xl border-2 transition-all duration-300 ${
                      formData.icon === icon
                        ? "border-pink-400 bg-pink-100 dark:bg-pink-900/30 shadow-lg scale-110"
                        : "border-pink-200 dark:border-purple-600 hover:border-pink-300 dark:hover:border-purple-500 hover:scale-105"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                Color 🎨
              </label>
              <div className="grid grid-cols-6 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
                      formData.color === color
                        ? "border-purple-800 dark:border-white shadow-lg scale-110"
                        : "border-pink-200 dark:border-purple-600 hover:border-pink-300 dark:hover:border-purple-500 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl hover:from-pink-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {editingCategory ? "Update Category ✨" : "Create Category ✨"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border-2 border-pink-200 dark:border-purple-600 text-purple-600 dark:text-purple-300 rounded-xl hover:bg-pink-50 dark:hover:bg-purple-700/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white/80 dark:bg-purple-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-200 dark:border-purple-600">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 sparkle-animation">🏷️</div>
            <p className="text-purple-600 dark:text-purple-300 mb-2 text-lg">
              No categories yet
            </p>
            <p className="text-sm text-purple-500 dark:text-purple-400">
              Create categories to organize your tasks ✨
            </p>
          </div>
        ) : (
          <div className="divide-y divide-pink-200 dark:divide-purple-600">
            {categories.map((category) => (
              <div
                key={category._id}
                className="p-6 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-purple-700/50 dark:hover:to-pink-700/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-purple-800 dark:text-purple-100">
                        {category.name}
                      </h4>
                      <p className="text-sm text-purple-500 dark:text-purple-400">
                        Created{" "}
                        {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors p-2 hover:bg-purple-50 dark:hover:bg-purple-700/20 rounded-full"
                      title="Edit category"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                      title="Delete category"
                    >
                      🗑️
                    </button>
                  </div>
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