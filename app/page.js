"use client";

import { useState, useEffect } from "react";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import CategoryManager from "@/components/CategoryManager";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";
import AdminDashboard from "@/components/AdminDashboard";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshDashboard = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your productivity space... ✨
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex items-center justify-center p-4">
        <AuthForm onAuthSuccess={(userData) => setUser(userData.user)} />
      </div>
    );
  }

  // Show admin dashboard for admin users
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-pink-100 dark:border-purple-600 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Productivity App ✨
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-pink-100 dark:border-purple-600 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Welcome back, {user.name}! ✨
              </h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Logout 👋
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-6">
            <Dashboard
              user={user}
              onAddTask={() => setShowTaskForm(true)}
              onManageCategories={() => setShowCategoryManager(true)}
              refreshKey={refreshKey}
            />
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-pink-100 dark:border-purple-600">
            <TaskForm
              onClose={() => setShowTaskForm(false)}
              onTaskCreated={refreshDashboard}
            />
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-pink-100 dark:border-purple-600 max-h-[90vh] overflow-y-auto">
            <CategoryManager
              onClose={() => setShowCategoryManager(false)}
              onCategoryUpdate={refreshDashboard}
            />
          </div>
        </div>
      )}
    </div>
  );
}
