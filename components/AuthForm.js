"use client";

import { useState } from "react";

export default function AuthForm({ onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState("login"); // login, register, about
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint =
        activeTab === "login" ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        onAuthSuccess(data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "role"
          ? e.target.value.toLowerCase()
          : e.target.value,
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
    setError("");
  };

  const renderAboutContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
          About Productivity Hub 🚀
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your all-in-one productivity solution designed to help you stay
          organized, focused, and achieve your goals.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-2">
            <span className="text-lg">📋</span>
            Task Management
          </h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Organize tasks, set priorities, and track progress with our
            intuitive task management system.
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2 mb-2">
            <span className="text-lg">📊</span>
            Project Tracking
          </h4>
          <p className="text-green-700 dark:text-green-300 text-sm">
            Manage projects, track milestones, and collaborate with team members
            effectively.
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2 mb-2">
            <span className="text-lg">🎯</span>
            Goal Setting
          </h4>
          <p className="text-purple-700 dark:text-purple-300 text-sm">
            Set SMART goals, track progress, and celebrate achievements with our
            goal management tools.
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
          <h4 className="font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2 mb-2">
            <span className="text-lg">⏰</span>
            Time Management
          </h4>
          <p className="text-orange-700 dark:text-orange-300 text-sm">
            Use Pomodoro timers, track time spent on tasks, and optimize your
            productivity workflow.
          </p>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-teal-200 dark:border-teal-800">
          <h4 className="font-semibold text-teal-800 dark:text-teal-200 flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            AI Assistant
          </h4>
          <p className="text-teal-700 dark:text-teal-300 text-sm">
            Get intelligent suggestions, automated task organization, and
            personalized productivity insights.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            🎉 Ready to Get Started?
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Join thousands of users who have transformed their productivity with
            our platform.
          </p>
          <button
            onClick={() => handleTabChange("register")}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Get Started Now ✨
          </button>
        </div>
      </div>
    </div>
  );

  const renderAuthForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {activeTab === "register" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name 💫
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required={activeTab === "register"}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="Enter your name"
          />
        </div>
      )}

      {activeTab === "register" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role 👑
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Admin: full control · Moderator: manage content · Editor:
            create/edit content · Viewer: read-only
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email ✉️
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password 🔒
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-pink-300 to-purple-400 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm hover:shadow-md"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <span>
            {activeTab === "login" ? "Sign In ✨" : "Create Account ✨"}
          </span>
        )}
      </button>
    </form>
  );

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 dark:border-purple-600 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            <span className="text-3xl">🌸</span>
            <span className="text-3xl">✨</span>
            <span className="text-3xl">🌸</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Productivity Hub
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your journey to better productivity starts here
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => handleTabChange("login")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "login"
                ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            🔐 Login
          </button>
          <button
            onClick={() => handleTabChange("register")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "register"
                ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            📝 Register
          </button>
          <button
            onClick={() => handleTabChange("about")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "about"
                ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            ℹ️ About
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "about" ? renderAboutContent() : renderAuthForm()}

        {/* Tab Footer */}
        {activeTab !== "about" && (
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                handleTabChange(activeTab === "login" ? "register" : "login")
              }
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium transition-colors"
            >
              {activeTab === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
