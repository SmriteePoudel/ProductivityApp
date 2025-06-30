"use client";

import { useState, useEffect } from "react";

export default function AssignedTasks({ refreshKey = 0 }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAssignedTasks();
    // eslint-disable-next-line
  }, [refreshKey]);

  const fetchAssignedTasks = async () => {
    try {
      const response = await fetch("/api/tasks?assignedBy=admin");
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error("Error fetching assigned tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "work":
        return "💼";
      case "personal":
        return "👤";
      case "urgent":
        return "🚨";
      case "meeting":
        return "🤝";
      case "project":
        return "📁";
      default:
        return "📌";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status === "pending";
    if (filter === "in_progress") return task.status === "in_progress";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchAssignedTasks(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading assigned tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>📋</span>
          Assigned Tasks
        </h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">📋</span>
          <p className="text-gray-500 mb-2">
            {filter === "all"
              ? "No tasks have been assigned yet."
              : `No ${filter} tasks found.`}
          </p>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="text-pink-600 hover:text-pink-700 text-sm"
            >
              View all tasks
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">
                    {getCategoryIcon(task.category)}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>👤 {task.assignedToName || "Unknown User"}</span>
                      {task.dueDate && (
                        <span>
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        📅 {new Date(task.assignedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => updateTaskStatus(task._id, "pending")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    task.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => updateTaskStatus(task._id, "in_progress")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    task.status === "in_progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateTaskStatus(task._id, "completed")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
