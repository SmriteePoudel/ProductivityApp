"use client";

import { useState, useEffect } from "react";

export default function Dashboard({
  user,
  onAddTask,
  onManageCategories,
  refreshKey = 0,
}) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, tasksResponse] = await Promise.all([
        fetch("/api/tasks/stats"),
        fetch("/api/tasks?limit=5"),
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setRecentTasks(tasksData.tasks || []);
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
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
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Welcome back, {user.name}! ✨
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Let's make today productive and beautiful! 🌸
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-pastel-pink/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-accent shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-pastel-blue rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-pastel-mint/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-accent shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-green-500">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-pastel-yellow rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-pastel-yellow/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-accent shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-yellow-500">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-pastel-pink rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-pastel-blue/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-accent shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Overdue
              </p>
              <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
            </div>
            <div className="p-3 bg-pastel-mint rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-pastel-lilac/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-accent shadow-sm">
        <h2 className="text-xl font-semibold gradient-text mb-4">
          Quick Actions ✨
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onAddTask}
            className="px-6 py-3 bg-gradient-to-r from-pastel-pink to-pastel-blue text-accent rounded-lg hover:from-pastel-blue hover:to-pastel-pink transition-all duration-300 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <span>➕</span>
            <span>Add New Task</span>
          </button>
          <button
            onClick={onManageCategories}
            className="px-6 py-3 bg-pastel-yellow text-accent rounded-lg hover:bg-pastel-mint transition-colors flex items-center space-x-2"
          >
            <span>🏷️</span>
            <span>Manage Categories</span>
          </button>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-pastel-blue/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-accent shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold gradient-text">
            Recent Tasks 📋
          </h2>
          <a
            href="#"
            className="text-accent hover:text-pastel-pink text-sm font-medium"
          >
            View All →
          </a>
        </div>

        {recentTasks.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">🌸</span>
            <p className="text-gray-500 dark:text-gray-400">
              No tasks yet. Create your first task to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 rounded focus:ring-pink-200"
                    readOnly
                  />
                  <div>
                    <h3
                      className={`font-medium ${
                        task.status === "completed"
                          ? "line-through text-gray-500"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
