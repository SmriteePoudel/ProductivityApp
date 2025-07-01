"use client";

import { useState, useEffect } from "react";
import UserManager from "./UserManager";
import TaskAllocation from "./TaskAllocation";
import AssignedTasks from "./AssignedTasks";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);
  const [showTaskAllocation, setShowTaskAllocation] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assignedTasksRefreshKey, setAssignedTasksRefreshKey] = useState(0);
  const [recentAssignedTasks, setRecentAssignedTasks] = useState([]);
  const [userManagementOpen, setUserManagementOpen] = useState(false);

  useEffect(() => {
    fetchAdminStats();
    fetchRecentAssignedTasks();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAssignedTasks = async () => {
    try {
      const response = await fetch("/api/tasks?assignedBy=admin&limit=5");
      if (response.ok) {
        const data = await response.json();
        setRecentAssignedTasks(data.tasks || []);
      }
    } catch (error) {
      console.error("Error fetching recent assigned tasks:", error);
    }
  };

  const handleResetAll = async () => {
    if (
      !confirm(
        "Are you sure you want to reset ALL data? This action cannot be undone!"
      )
    ) {
      return;
    }

    setResetLoading(true);
    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
      });

      if (response.ok) {
        alert("All data has been reset successfully!");
        fetchAdminStats();
      } else {
        alert("Failed to reset data");
      }
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Error resetting data");
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserManager(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserManager(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAdminStats();
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  const handleUserUpdate = () => {
    fetchAdminStats();
    setShowUserManager(false);
    setEditingUser(null);
  };

  const handleTaskCreated = () => {
    fetchAdminStats();
    setAssignedTasksRefreshKey((k) => k + 1);
    fetchRecentAssignedTasks();
  };

  // User Management Dropdown Section
  const userManagementDropdown = (
    <div className="mt-8">
      <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
        User Management
      </div>
      <ul className="space-y-1 px-4">
        <li>
          <button
            className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
              ["roles", "permissions"].includes(activeTab)
                ? "bg-purple-100 text-purple-700"
                : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
            }`}
            onClick={() => setUserManagementOpen((prev) => !prev)}
          >
            <span className="text-lg">👥</span>
            <span>User Management</span>
            <span className="ml-auto text-xs">
              {userManagementOpen ? "▲" : "▼"}
            </span>
          </button>
          {userManagementOpen && (
            <div className="ml-4 mt-1 border-l border-purple-500 pl-2">
              <ul className="space-y-1">
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                      activeTab === "roles"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                    onClick={() => setActiveTab("roles")}
                  >
                    <span className="text-lg">🛡️</span>
                    <span>Roles</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                      activeTab === "permissions"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                    onClick={() => setActiveTab("permissions")}
                  >
                    <span className="text-lg">🔑</span>
                    <span>Permissions</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </li>
      </ul>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-50 to-purple-50 relative">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 w-72 bg-white/90 backdrop-blur-md border-r border-pink-200 shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-pink-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full">
              <span className="text-xl">👑</span>
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-wide">
              Admin Panel
            </span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-pink-600"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="text-xs uppercase text-gray-500 px-4 mb-2">
            Admin Navigation
          </div>
          <ul className="space-y-1 px-4">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                  activeTab === "dashboard"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                <span className="text-lg">📊</span>
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("task-allocation")}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                  activeTab === "task-allocation"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                <span className="text-lg">📋</span>
                <span>Task Allocation</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("assigned-tasks")}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                  activeTab === "assigned-tasks"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                <span className="text-lg">📝</span>
                <span>Assigned Tasks</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleCreateUser}
                className="flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-700"
              >
                <span className="text-lg">👤</span>
                <span>Create User</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleResetAll}
                disabled={resetLoading}
                className="flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
              >
                <span className="text-lg">🗑️</span>
                <span>{resetLoading ? "Resetting..." : "Reset Data"}</span>
              </button>
            </li>
          </ul>

          {/* User Management Dropdown Section */}
          {userManagementDropdown}
        </nav>

        <div className="p-4 border-t border-pink-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg hover:from-red-500 hover:to-pink-500 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {!sidebarOpen && (
        <button
          className="fixed z-50 top-4 left-4 lg:hidden p-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto relative">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-pink-100 p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {activeTab === "dashboard" && "Admin Dashboard"}
                  {activeTab === "task-allocation" && "Task Allocation"}
                  {activeTab === "assigned-tasks" && "Assigned Tasks"}
                </h1>
                <p className="text-gray-600">
                  {activeTab === "dashboard" &&
                    "System overview and user management"}
                  {activeTab === "task-allocation" &&
                    "Assign tasks to team members"}
                  {activeTab === "assigned-tasks" &&
                    "Monitor task progress and status"}
                </p>
              </div>
            </div>
            {activeTab === "task-allocation" && (
              <button
                onClick={() => setShowTaskAllocation(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-xl font-medium hover:from-green-500 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>📋</span>
                Assign New Task
              </button>
            )}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-pink-600">
                      {stats?.totalUsers || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-pink-100 rounded-full">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats?.activeUserCount || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <span className="text-2xl">🟢</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Tasks
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats?.totalTasks || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats?.completedTasks || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Assigned Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span>
                Recently Assigned Tasks
              </h2>
              {recentAssignedTasks.length === 0 ? (
                <div className="text-gray-500 flex items-center gap-2">
                  <span className="text-2xl">🗒️</span> No tasks have been
                  assigned yet.
                </div>
              ) : (
                <ul className="divide-y divide-pink-50">
                  {recentAssignedTasks.map((task) => (
                    <li key={task._id} className="py-3 flex items-center gap-4">
                      <span className="text-2xl">
                        {task.category === "work"
                          ? "💼"
                          : task.category === "personal"
                          ? "👤"
                          : task.category === "urgent"
                          ? "🚨"
                          : task.category === "meeting"
                          ? "🤝"
                          : task.category === "project"
                          ? "📁"
                          : "📌"}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          Assigned to: {task.assignedToName || "Unknown User"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {task.dueDate
                            ? `Due: ${new Date(
                                task.dueDate
                              ).toLocaleDateString()}`
                            : null}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === "urgent"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "high"
                            ? "bg-orange-100 text-orange-700"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Admin Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚙️</span>
                Admin Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab("task-allocation")}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-xl font-medium hover:from-green-500 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span>📋</span>
                  Assign Tasks
                </button>
                <button
                  onClick={handleCreateUser}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span>👤</span>
                  Create New User
                </button>
                <button
                  onClick={handleResetAll}
                  disabled={resetLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl font-medium hover:from-red-500 hover:to-pink-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? (
                    <span className="animate-spin">🔄</span>
                  ) : (
                    <span>🗑️</span>
                  )}
                  {resetLoading ? "Resetting..." : "Reset All Data"}
                </button>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  User Management 👥
                </h2>
                <span className="text-sm text-gray-500">
                  {users.length} user{users.length !== 1 ? "s" : ""} registered
                </span>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">👥</span>
                  <p className="text-gray-500 mb-4">No users registered yet.</p>
                  <button
                    onClick={handleCreateUser}
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg hover:from-green-500 hover:to-blue-500 transition-all duration-200"
                  >
                    Create First User
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Tasks
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                  user.role === "admin"
                                    ? "bg-gradient-to-r from-pink-400 to-purple-400"
                                    : "bg-gradient-to-r from-blue-400 to-green-400"
                                }`}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">
                                {user.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {user.email}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {(user.roles && user.roles.length > 0
                                ? user.roles
                                : [user.role || "user"]
                              ).map((roleKey) => {
                                const roleObj = [
                                  { key: "admin", label: "Admin", icon: "👑" },
                                  { key: "user", label: "User", icon: "👤" },
                                  {
                                    key: "developer",
                                    label: "Developer",
                                    icon: "💻",
                                  },
                                  {
                                    key: "designer",
                                    label: "Designer",
                                    icon: "🎨",
                                  },
                                  { key: "hr", label: "HR", icon: "🧑‍💼" },
                                  {
                                    key: "marketing",
                                    label: "Marketing",
                                    icon: "📢",
                                  },
                                  {
                                    key: "finance",
                                    label: "Finance",
                                    icon: "💰",
                                  },
                                  {
                                    key: "blog_writer",
                                    label: "Blog Writer",
                                    icon: "📝",
                                  },
                                  {
                                    key: "seo_manager",
                                    label: "SEO Manager",
                                    icon: "🔍",
                                  },
                                  {
                                    key: "project_manager",
                                    label: "Project Manager",
                                    icon: "📁",
                                  },
                                  {
                                    key: "moderator",
                                    label: "Moderator",
                                    icon: "🛡️",
                                  },
                                  {
                                    key: "editor",
                                    label: "Editor",
                                    icon: "✏️",
                                  },
                                  {
                                    key: "viewer",
                                    label: "Viewer",
                                    icon: "👁️",
                                  },
                                ].find((r) => r.key === roleKey);
                                return (
                                  <span
                                    key={roleKey}
                                    className={`px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1`}
                                  >
                                    <span>{roleObj ? roleObj.icon : "👤"}</span>
                                    {roleObj ? roleObj.label : roleKey}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {user.taskCount || 0} tasks
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm"
                              >
                                Edit
                              </button>
                              {user.role !== "admin" && (
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "task-allocation" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-center py-12">
              <span className="text-6xl mb-6 block">📋</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Task Allocation Center
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Assign tasks to team members, set priorities, and track
                progress. Keep your team organized and productive.
              </p>
              <button
                onClick={() => setShowTaskAllocation(true)}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
              >
                <span>📋</span>
                Assign New Task
              </button>
            </div>
          </div>
        )}

        {activeTab === "assigned-tasks" && (
          <AssignedTasks refreshKey={assignedTasksRefreshKey} />
        )}

        {activeTab === "roles" && (
          <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 text-gray-900 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Role Management</h2>
            <p className="text-gray-600">Create and manage user roles</p>
            {/* Add your RolesManager component here if you have one */}
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 text-gray-900 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Permission Management</h2>
            <p className="text-gray-600">Configure role-based permissions</p>
            {/* Add your PermissionsManager component here if you have one */}
          </div>
        )}
      </main>

      {/* User Manager Modal */}
      {showUserManager && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-pink-100">
            <UserManager
              user={editingUser}
              onClose={() => {
                setShowUserManager(false);
                setEditingUser(null);
              }}
              onUserUpdate={handleUserUpdate}
            />
          </div>
        </div>
      )}

      {/* Task Allocation Modal */}
      {showTaskAllocation && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <TaskAllocation
            onClose={() => setShowTaskAllocation(false)}
            onTaskCreated={handleTaskCreated}
          />
        </div>
      )}
    </div>
  );
}
