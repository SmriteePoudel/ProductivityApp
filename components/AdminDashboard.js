"use client";

import { useState, useEffect } from "react";
import UserManager from "./UserManager";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAdminStats();
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
              <button className="flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium bg-pink-100 text-pink-700">
                <span className="text-lg">📊</span>
                <span>Dashboard</span>
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
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  System overview and user management
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
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
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
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

        {/* Admin Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>⚙️</span>
            Admin Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCreateUser}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-xl font-medium hover:from-green-500 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role === "admin" ? "👑 Admin" : "👤 User"}
                        </span>
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
    </div>
  );
}
