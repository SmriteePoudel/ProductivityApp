"use client";

import { useState, useEffect, useCallback } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Debounced fetch function to prevent excessive API calls
  const debouncedFetch = useCallback(
    (() => {
      let timeoutId;
      return (filters, page) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fetchTasks(filters, page);
        }, 300);
      };
    })(),
    []
  );

  useEffect(() => {
    fetchTasks(filters, pagination.page);
    fetchCategories();
  }, []); // Only run on mount

  useEffect(() => {
    debouncedFetch(filters, pagination.page);
  }, [filters, pagination.page, debouncedFetch]);

  const fetchTasks = async (currentFilters, currentPage) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: pagination.limit,
        ...currentFilters,
      });

      const response = await fetch(`/api/tasks?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages,
        }));
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Optimistically update the task in the local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error("Update task error:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Optimistically remove the task from local state
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      }
    } catch (error) {
      console.error("Delete task error:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      case "in-progress":
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case "pending":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-pink-100 dark:border-purple-600 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters 🔍
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priority: e.target.value }))
            }
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-pink-100 dark:border-purple-600">
            <span className="text-6xl mb-4 block">🌸</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or create a new task!
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-6 border border-pink-100 dark:border-purple-600 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() =>
                      handleStatusChange(
                        task._id,
                        task.status === "completed" ? "pending" : "completed"
                      )
                    }
                    className="w-5 h-5 text-pink-400 bg-gray-100 border-gray-300 rounded focus:ring-pink-200"
                  />
                  <div className="flex-1">
                    <h3
                      className={`font-medium text-lg ${
                        task.status === "completed"
                          ? "line-through text-gray-500"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Due: {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-200 dark:hover:bg-pink-900/40 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-200 dark:hover:bg-pink-900/40 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
