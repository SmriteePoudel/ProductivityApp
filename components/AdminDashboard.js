"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-pink-100 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">System overview and management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg hover:from-red-500 hover:to-pink-500 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats?.pendingTasks || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            Admin Actions
          </h2>
          <div className="flex flex-wrap gap-4">
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
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Registered Users
          </h2>
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
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 hover:bg-pink-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {user.role === "admin" ? "👑 Admin" : "👤 User"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
