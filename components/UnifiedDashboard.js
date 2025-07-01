"use client";

import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import CategoryManager from "./CategoryManager";
import TaskList from "./TaskList";
import UserManager from "./UserManager";
import TaskForm from "./TaskForm";
import Calendar from "./Calendar";
import Pomodoro from "./Pomodoro";
import Timer from "./Timer";
import Clock from "./Clock";
import ProjectManager from "./ProjectManager";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import AIChatBot from "./AIChatBot";
import DraftArticlesBox from "./DraftArticlesBox";
import ContentCalendarBox from "./ContentCalendarBox";
import React from "react";
import ResearchToolsBox from "./ResearchToolsBox";
import {
  PERMISSIONS,
  ROLE_METADATA,
  getDefaultPermissions,
} from "@/lib/role-metadata";

// Placeholder components for Settings, Roles, Permissions
function Settings({ onProfileUpdate }) {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initial, setInitial] = useState({ avatar: null, name: "", bio: "" });
  const [appearance, setAppearance] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("appearance") || "system";
    }
    return "system";
  });
  const [language, setLanguage] = useState("en");
  const [startWeekMonday, setStartWeekMonday] = useState(false);
  const [autoTimezone, setAutoTimezone] = useState(true);
  const [timezone, setTimezone] = useState("GMT+05:45 Kathmandu");
  const [openLinksDesktop, setOpenLinksDesktop] = useState(false);
  const [openOnStart, setOpenOnStart] = useState("last");
  const [cookieSettings, setCookieSettings] = useState("customize");
  const [showViewHistory, setShowViewHistory] = useState(true);
  const [profileDiscoverability, setProfileDiscoverability] = useState(true);
  const [accent, setAccent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accent") || "#ec4899"; // default pink
    }
    return "#ec4899";
  });
  const [savedAccent, setSavedAccent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accent") || "#ec4899";
    }
    return "#ec4899";
  });
  const [savedAppearance, setSavedAppearance] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("appearance") || "system";
    }
    return "system";
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Animate theme transitions
  const [themeTransitioning, setThemeTransitioning] = useState(false);
  useEffect(() => {
    if (themeTransitioning) {
      const timeout = setTimeout(() => setThemeTransitioning(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [themeTransitioning]);

  // Load user info on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setAvatar(data.user.avatar || null);
          setBio(data.user.bio || "");
          setInitial({
            avatar: data.user.avatar || null,
            name: data.user.name || "",
            bio: data.user.bio || "",
          });
        }
      });
  }, []);

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar, bio }),
      });
      if (res.ok) {
        setSuccess(true);
        setInitial({ avatar, name, bio });
        if (onProfileUpdate) {
          const data = await res.json();
          onProfileUpdate(data.user);
        }
        setTimeout(() => setSuccess(false), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const changed =
    name !== initial.name || avatar !== initial.avatar || bio !== initial.bio;

  // Handle theme switching
  useEffect(() => {
    setThemeTransitioning(true);
    if (appearance === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("appearance", "dark");
    } else if (appearance === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("appearance", "light");
    } else {
      // system
      localStorage.setItem("appearance", "system");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [appearance]);

  // Handle accent color switching
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accent);
    localStorage.setItem("accent", accent);
  }, [accent]);

  // Accent color palette
  const accentPalette = [
    "#ec4899", // pink
    "#a855f7", // purple
    "#f59e42", // orange
    "#10b981", // green
    "#3b82f6", // blue
    "#fbbf24", // yellow
    "#ef4444", // red
    "#6366f1", // indigo
    "#14b8a6", // teal
  ];

  // Detect if there are unsaved changes
  const unsaved = accent !== savedAccent || appearance !== savedAppearance;

  // Save handler
  const handleSavePreferences = () => {
    setSavedAccent(accent);
    setSavedAppearance(appearance);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1500);
    // localStorage and CSS variable are already updated by useEffect
  };

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-yellow dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 rounded-2xl shadow-lg p-8 border border-accent">
      {/* Theme transition overlay */}
      {themeTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-500 bg-white dark:bg-gray-900 opacity-60 animate-fade" />
      )}
      {/* User Profile Section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-accent shadow-md bg-white"
          />
          <label
            className="absolute bottom-0 right-0 bg-accent hover:bg-accent/90 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors"
            title="Change avatar"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <span className="text-lg">📷</span>
          </label>
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-xl font-bold bg-transparent border-b-2 border-accent focus:border-accent outline-none text-gray-900 dark:text-white w-full mb-1"
            placeholder="Your Name"
          />
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            {email}
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-white/60 dark:bg-gray-800/60 border border-accent rounded-lg p-2 text-gray-900 dark:text-white resize-none focus:border-accent dark:focus:border-accent outline-none"
            rows={3}
            maxLength={300}
            placeholder="Add a short bio about yourself..."
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleSave}
              disabled={!changed || loading}
              className="px-4 py-2 bg-gradient-to-r from-accent to-accent text-white rounded-lg font-medium shadow hover:from-accent/90 hover:to-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
            {success && (
              <span className="text-green-500 font-medium">Saved!</span>
            )}
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Settings
      </h1>
      {/* Preferences */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Preferences
        </h2>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Appearance
            </div>
            <div className="text-sm text-gray-500">
              Customize how the app looks on your device.
            </div>
          </div>
          <select
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white"
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
          >
            <option value="system">Use system setting</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        {/* Accent Color Picker */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Accent Color
            </div>
            <div className="text-sm text-gray-500">
              Personalize your accent color.
            </div>
          </div>
          <div className="flex items-center gap-2">
            {accentPalette.map((color) => (
              <button
                key={color}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                  accent === color
                    ? "border-[var(--accent-color)] scale-110"
                    : "border-gray-200 dark:border-gray-700 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setAccent(color)}
                aria-label={`Accent ${color}`}
              />
            ))}
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
              title="Custom accent color"
            />
          </div>
        </div>
        {/* Save Changes Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSavePreferences}
            disabled={!unsaved}
            className={`px-6 py-2 rounded-lg font-semibold shadow bg-accent text-white transition-all duration-200 focus:outline-none focus:ring-2 ring-accent disabled:opacity-50 disabled:cursor-not-allowed ${
              unsaved ? "hover:opacity-90" : ""
            }`}
          >
            {saveSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </section>
      {/* Language & Time */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Language & Time
        </h2>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Language
            </div>
            <div className="text-sm text-gray-500">
              Change the language used in the user interface.
            </div>
          </div>
          <select
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English (US)</option>
            <option value="np">Nepali</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
          </select>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Start week on Monday
            </div>
            <div className="text-sm text-gray-500">
              This will change how all calendars in your app look.
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={startWeekMonday}
              onChange={(e) => setStartWeekMonday(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:bg-accent peer-checked:bg-accent/20 transition-all"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {startWeekMonday ? "On" : "Off"}
            </span>
          </label>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Set timezone automatically using your location
            </div>
            <div className="text-sm text-gray-500">
              Reminders, notifications and emails are delivered based on your
              time zone.
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={autoTimezone}
              onChange={(e) => setAutoTimezone(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:bg-accent peer-checked:bg-accent/20 transition-all"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {autoTimezone ? "On" : "Off"}
            </span>
          </label>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Timezone
            </div>
            <div className="text-sm text-gray-500">
              Current timezone setting.
            </div>
          </div>
          <select
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="GMT+05:45 Kathmandu">(GMT+05:45) Kathmandu</option>
            <option value="GMT+05:30 India">(GMT+05:30) India</option>
            <option value="GMT+00:00 London">(GMT+00:00) London</option>
            <option value="GMT-05:00 New York">(GMT-05:00) New York</option>
            <option value="GMT+09:00 Tokyo">(GMT+09:00) Tokyo</option>
          </select>
        </div>
      </section>
      {/* Desktop app */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Desktop app
        </h2>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Open links in desktop app
            </div>
            <div className="text-sm text-gray-500">
              You must have the Windows app installed.
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={openLinksDesktop}
              onChange={(e) => setOpenLinksDesktop(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:bg-accent peer-checked:bg-accent/20 transition-all"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {openLinksDesktop ? "On" : "Off"}
            </span>
          </label>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Open on start
            </div>
            <div className="text-sm text-gray-500">
              Choose what to show when the app starts or you switch workspaces.
            </div>
          </div>
          <select
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white"
            value={openOnStart}
            onChange={(e) => setOpenOnStart(e.target.value)}
          >
            <option value="last">Last visited page</option>
            <option value="dashboard">Dashboard</option>
            <option value="tasks">Tasks</option>
          </select>
        </div>
      </section>
      {/* Privacy */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Privacy
        </h2>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Cookie settings
            </div>
            <div className="text-sm text-gray-500">
              Customize cookies.{" "}
              <a href="#" className="underline">
                See Cookie Notice
              </a>{" "}
              for details.
            </div>
          </div>
          <select
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white"
            value={cookieSettings}
            onChange={(e) => setCookieSettings(e.target.value)}
          >
            <option value="customize">Customize</option>
            <option value="accept-all">Accept all</option>
            <option value="reject-all">Reject all</option>
          </select>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Show my view history
            </div>
            <div className="text-sm text-gray-500">
              People with edit or full access will be able to see when you've
              viewed a page.
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showViewHistory}
              onChange={(e) => setShowViewHistory(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:bg-accent peer-checked:bg-accent/20 transition-all"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {showViewHistory ? "On" : "Off"}
            </span>
          </label>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Profile discoverability
            </div>
            <div className="text-sm text-gray-500">
              Users with your email can see your name and profile picture when
              inviting you to a new workspace.
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={profileDiscoverability}
              onChange={(e) => setProfileDiscoverability(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:bg-accent peer-checked:bg-accent/20 transition-all"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {profileDiscoverability ? "On" : "Off"}
            </span>
          </label>
        </div>
      </section>
    </div>
  );
}

function RolesManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editRoles, setEditRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // List of all possible roles
  const allRoles = [
    "admin",
    "hr",
    "marketing",
    "finance",
    "blog_writer",
    "seo_manager",
    "project_manager",
    "developer",
    "designer",
    "user",
    "moderator",
    "editor",
    "viewer",
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
      })
      .catch((error) => {
        setError("Error fetching users");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setEditRoles(user.roles || []);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditRoles([]);
    setError("");
    setSuccess("");
  };

  const handleRoleChange = (role) => {
    if (editRoles.includes(role)) {
      setEditRoles(editRoles.filter((r) => r !== role));
    } else {
      setEditRoles([...editRoles, role]);
    }
  };

  const handleSave = async (user) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          roles: editRoles,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update roles");
      setSuccess("Roles updated");
      setEditUserId(null);
      setEditRoles([]);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
          👥 Role Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          View and edit user roles. Click a user's roles to edit.
        </p>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <thead className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
            <tr>
              <th className="px-6 py-4 text-left text-gray-800 dark:text-gray-200 font-semibold text-lg">
                Name
              </th>
              <th className="px-6 py-4 text-left text-gray-800 dark:text-gray-200 font-semibold text-lg">
                Email
              </th>
              <th className="px-6 py-4 text-left text-gray-800 dark:text-gray-200 font-semibold text-lg">
                Roles
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {user.name || user.email}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    {editUserId === user._id ? (
                      <div className="flex flex-wrap gap-2">
                        {allRoles.map((role) => (
                          <button
                            key={role}
                            type="button"
                            className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm border transition-colors ${
                              editRoles.includes(role)
                                ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white border-transparent"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                            }`}
                            onClick={() => handleRoleChange(role)}
                            disabled={saving}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="flex flex-wrap gap-2 cursor-pointer"
                        onClick={() => handleEdit(user)}
                        title="Click to edit roles"
                      >
                        {(user.roles || []).map((role) => (
                          <span
                            key={role}
                            className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900 dark:to-pink-900 dark:text-purple-200 rounded-full text-xs font-medium shadow-sm"
                          >
                            {role}
                          </span>
                        ))}
                        <span className="text-xs text-blue-500 ml-2">Edit</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editUserId === user._id && (
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-1 rounded bg-accent text-white font-semibold shadow"
                          onClick={() => handleSave(user)}
                          disabled={saving || editRoles.length === 0}
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="px-4 py-1 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold shadow"
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RolesManagerBox() {
  return <RolesManager />;
}

// Add TemplateDetailPanel component
function TemplateDetailPanel({ template, onBack, onSaveProject }) {
  // Local state for editable fields per template type
  const [fitnessRows, setFitnessRows] = useState([
    { day: "Mon", exercise: "", sets: "", reps: "", notes: "" },
    { day: "Tue", exercise: "", sets: "", reps: "", notes: "" },
    { day: "Wed", exercise: "", sets: "", reps: "", notes: "" },
    { day: "Thu", exercise: "", sets: "", reps: "", notes: "" },
    { day: "Fri", exercise: "", sets: "", reps: "", notes: "" },
    { day: "Sat", exercise: "", sets: "", reps: "", notes: "" },
    { day: "Sun", exercise: "", sets: "", reps: "", notes: "" },
  ]);
  const [fitnessGoals, setFitnessGoals] = useState([
    "Run 5km in under 30 minutes",
    "Bench press 100kg",
    "Exercise 4x per week",
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Add similar state for other templates as needed...

  // Add/Edit/Delete for fitness goals
  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFitnessGoals([...fitnessGoals, newGoal.trim()]);
      setNewGoal("");
    }
  };
  const handleDeleteGoal = (idx) => {
    setFitnessGoals(fitnessGoals.filter((_, i) => i !== idx));
  };
  const handleEditGoal = (idx, value) => {
    setFitnessGoals(fitnessGoals.map((g, i) => (i === idx ? value : g)));
  };

  // Add/Edit/Delete for fitness rows
  const handleFitnessRowChange = (idx, field, value) => {
    setFitnessRows(
      fitnessRows.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
  };

  // Save as Project (example for fitness)
  const handleSaveAsProject = () => {
    const project = {
      name: template.name,
      description: `Created from template: ${template.name}`,
      color: "#10b981",
      icon: template.icon,
      files: [],
      templateKey: template.key,
      fitness: { rows: fitnessRows, goals: fitnessGoals },
      createdAt: Date.now(),
    };
    // Save to localStorage projects
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const id = Date.now();
    const newProject = { ...project, id };
    localStorage.setItem("projects", JSON.stringify([...projects, newProject]));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    if (onSaveProject) onSaveProject(id);
  };

  // --- Habit Tracker ---
  const [habitList, setHabitList] = useState([
    { name: "Meditate", days: Array(7).fill(false) },
    { name: "Read", days: Array(7).fill(false) },
    { name: "Exercise", days: Array(7).fill(false) },
    { name: "Journal", days: Array(7).fill(false) },
  ]);
  const [newHabit, setNewHabit] = useState("");
  const handleHabitNameChange = (idx, value) => {
    setHabitList(
      habitList.map((h, i) => (i === idx ? { ...h, name: value } : h))
    );
  };
  const handleHabitDayToggle = (idx, dayIdx) => {
    setHabitList(
      habitList.map((h, i) =>
        i === idx
          ? { ...h, days: h.days.map((d, j) => (j === dayIdx ? !d : d)) }
          : h
      )
    );
  };
  const handleAddHabit = () => {
    if (newHabit.trim()) {
      setHabitList([
        ...habitList,
        { name: newHabit.trim(), days: Array(7).fill(false) },
      ]);
      setNewHabit("");
    }
  };
  const handleDeleteHabit = (idx) => {
    setHabitList(habitList.filter((_, i) => i !== idx));
  };

  // --- Travel Planner ---
  const [trips, setTrips] = useState([
    { destination: "Paris", dates: "", notes: "" },
    { destination: "Tokyo", dates: "", notes: "" },
    { destination: "New York", dates: "", notes: "" },
  ]);
  const handleTripChange = (idx, field, value) => {
    setTrips(trips.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  };
  const handleAddTrip = () => {
    setTrips([...trips, { destination: "", dates: "", notes: "" }]);
  };
  const handleDeleteTrip = (idx) => {
    setTrips(trips.filter((_, i) => i !== idx));
  };
  const [packingList, setPackingList] = useState([
    "Passport",
    "Tickets",
    "Clothes",
    "Toiletries",
  ]);
  const [newPacking, setNewPacking] = useState("");
  const handleAddPacking = () => {
    if (newPacking.trim()) {
      setPackingList([...packingList, newPacking.trim()]);
      setNewPacking("");
    }
  };
  const handleDeletePacking = (idx) => {
    setPackingList(packingList.filter((_, i) => i !== idx));
  };
  const handlePackingChange = (idx, value) => {
    setPackingList(packingList.map((g, i) => (i === idx ? value : g)));
  };

  // --- Study Planner ---
  const [studyRows, setStudyRows] = useState([
    { day: "Mon", subject: "", topic: "", time: "" },
    { day: "Tue", subject: "", topic: "", time: "" },
    { day: "Wed", subject: "", topic: "", time: "" },
    { day: "Thu", subject: "", topic: "", time: "" },
    { day: "Fri", subject: "", topic: "", time: "" },
    { day: "Sat", subject: "", topic: "", time: "" },
    { day: "Sun", subject: "", topic: "", time: "" },
  ]);
  const handleStudyRowChange = (idx, field, value) => {
    setStudyRows(
      studyRows.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };
  const [assignments, setAssignments] = useState([
    "Math Homework (Due Friday)",
    "Read Chapter 5 of History",
    "Science Project (Due next week)",
  ]);
  const [newAssignment, setNewAssignment] = useState("");
  const handleAssignmentChange = (idx, value) => {
    setAssignments(assignments.map((a, i) => (i === idx ? value : a)));
  };
  const handleAddAssignment = () => {
    if (newAssignment.trim()) {
      setAssignments([...assignments, newAssignment.trim()]);
      setNewAssignment("");
    }
  };
  const handleDeleteAssignment = (idx) => {
    setAssignments(assignments.filter((_, i) => i !== idx));
  };

  // --- Meal Planner ---
  const [mealRows, setMealRows] = useState([
    { day: "Mon", breakfast: "", lunch: "", dinner: "" },
    { day: "Tue", breakfast: "", lunch: "", dinner: "" },
    { day: "Wed", breakfast: "", lunch: "", dinner: "" },
    { day: "Thu", breakfast: "", lunch: "", dinner: "" },
    { day: "Fri", breakfast: "", lunch: "", dinner: "" },
    { day: "Sat", breakfast: "", lunch: "", dinner: "" },
    { day: "Sun", breakfast: "", lunch: "", dinner: "" },
  ]);
  const handleMealRowChange = (idx, field, value) => {
    setMealRows(
      mealRows.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };
  const [groceryList, setGroceryList] = useState([
    "Eggs",
    "Chicken",
    "Vegetables",
    "Rice",
  ]);
  const [newGrocery, setNewGrocery] = useState("");
  const handleGroceryChange = (idx, value) => {
    setGroceryList(groceryList.map((g, i) => (i === idx ? value : g)));
  };
  const handleAddGrocery = () => {
    if (newGrocery.trim()) {
      setGroceryList([...groceryList, newGrocery.trim()]);
      setNewGrocery("");
    }
  };
  const handleDeleteGrocery = (idx) => {
    setGroceryList(groceryList.filter((_, i) => i !== idx));
  };

  // --- Project Roadmap ---
  const [milestones, setMilestones] = useState([
    { name: "Project Kickoff", due: "", status: "Planned" },
    { name: "Phase 1: Research", due: "", status: "Planned" },
    { name: "Phase 2: Development", due: "", status: "Planned" },
    { name: "Phase 3: Testing", due: "", status: "Planned" },
    { name: "Launch", due: "", status: "Planned" },
  ]);
  const [newMilestone, setNewMilestone] = useState("");
  const handleMilestoneChange = (idx, field, value) => {
    setMilestones(
      milestones.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };
  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      setMilestones([
        ...milestones,
        { name: newMilestone.trim(), due: "", status: "Planned" },
      ]);
      setNewMilestone("");
    }
  };
  const handleDeleteMilestone = (idx) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  // --- Finance Manager ---
  const [budgetRows, setBudgetRows] = useState([
    { category: "Rent", budgeted: "", spent: "", notes: "" },
    { category: "Groceries", budgeted: "", spent: "", notes: "" },
    { category: "Transport", budgeted: "", spent: "", notes: "" },
    { category: "Entertainment", budgeted: "", spent: "", notes: "" },
    { category: "Savings", budgeted: "", spent: "", notes: "" },
  ]);
  const handleBudgetRowChange = (idx, field, value) => {
    setBudgetRows(
      budgetRows.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };
  const [savingsGoals, setSavingsGoals] = useState([
    "Save $5000 for emergency fund",
    "Pay off credit card debt",
    "Invest 10% of income",
  ]);
  const [newSavingsGoal, setNewSavingsGoal] = useState("");
  const handleSavingsGoalChange = (idx, value) => {
    setSavingsGoals(savingsGoals.map((g, i) => (i === idx ? value : g)));
  };
  const handleAddSavingsGoal = () => {
    if (newSavingsGoal.trim()) {
      setSavingsGoals([...savingsGoals, newSavingsGoal.trim()]);
      setNewSavingsGoal("");
    }
  };
  const handleDeleteSavingsGoal = (idx) => {
    setSavingsGoals(savingsGoals.filter((_, i) => i !== idx));
  };

  // --- Reading List ---
  const [books, setBooks] = useState([
    "The Great Gatsby",
    "Atomic Habits",
    "Deep Work",
  ]);
  const [newBook, setNewBook] = useState("");
  const handleBookChange = (idx, value) => {
    setBooks(books.map((b, i) => (i === idx ? value : b)));
  };
  const handleAddBook = () => {
    if (newBook.trim()) {
      setBooks([...books, newBook.trim()]);
      setNewBook("");
    }
  };
  const handleDeleteBook = (idx) => {
    setBooks(books.filter((_, i) => i !== idx));
  };
  const [articles, setArticles] = useState([
    "How to Focus in a Distracted World",
    "The Science of Habit Formation",
  ]);
  const [newArticle, setNewArticle] = useState("");
  const handleArticleChange = (idx, value) => {
    setArticles(articles.map((a, i) => (i === idx ? value : a)));
  };
  const handleAddArticle = () => {
    if (newArticle.trim()) {
      setArticles([...articles, newArticle.trim()]);
      setNewArticle("");
    }
  };
  const handleDeleteArticle = (idx) => {
    setArticles(articles.filter((_, i) => i !== idx));
  };

  // --- Self-Care Journal ---
  const [reflection, setReflection] = useState("");
  const [selfCareList, setSelfCareList] = useState([
    { name: "Meditation", checked: false },
    { name: "Exercise", checked: false },
    { name: "Read a book", checked: false },
    { name: "Connect with a friend", checked: false },
  ]);
  const [newSelfCare, setNewSelfCare] = useState("");
  const handleSelfCareCheck = (idx) => {
    setSelfCareList(
      selfCareList.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      )
    );
  };
  const handleSelfCareNameChange = (idx, value) => {
    setSelfCareList(
      selfCareList.map((item, i) =>
        i === idx ? { ...item, name: value } : item
      )
    );
  };
  const handleAddSelfCare = () => {
    if (newSelfCare.trim()) {
      setSelfCareList([
        ...selfCareList,
        { name: newSelfCare.trim(), checked: false },
      ]);
      setNewSelfCare("");
    }
  };
  const handleDeleteSelfCare = (idx) => {
    setSelfCareList(selfCareList.filter((_, i) => i !== idx));
  };

  // ... existing handleSaveAsProject ...

  // Render for each template type (showing Habit Tracker and Travel Planner as examples)
  if (template.key === "habit") {
    return (
      <div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 border border-accent">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
        >
          ← Back to Templates
        </button>
        <h3 className="text-xl font-bold text-accent flex items-center gap-2 mb-2">
          ✅ Habit Tracker
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Build and track daily habits for personal growth.
        </p>
        <div className="bg-white/70 dark:bg-gray-800/70 border border-accent rounded-xl p-6 mb-6">
          <h4 className="font-semibold mb-2">Daily Habits</h4>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">Habit</th>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <th key={day} className="p-2">
                      {day}
                    </th>
                  )
                )}
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {habitList.map((habit, idx) => (
                <tr key={idx} className="border-t border-accent/30">
                  <td className="p-2 font-medium">
                    <input
                      className="bg-transparent border-b border-accent/30 focus:border-accent outline-none"
                      value={habit.name}
                      onChange={(e) =>
                        handleHabitNameChange(idx, e.target.value)
                      }
                    />
                  </td>
                  {habit.days.map((checked, dayIdx) => (
                    <td key={dayIdx} className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleHabitDayToggle(idx, dayIdx)}
                      />
                    </td>
                  ))}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDeleteHabit(idx)}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 mt-2">
            <input
              className="flex-1 bg-transparent border-b border-accent/30 focus:border-accent outline-none"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Add new habit..."
            />
            <button
              onClick={handleAddHabit}
              className="px-3 py-1 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
            >
              Add
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveAsProject}
            className="px-6 py-2 rounded-lg font-semibold shadow bg-accent text-white transition-all duration-200 focus:outline-none focus:ring-2 ring-accent hover:opacity-90"
          >
            Save as Project
          </button>
        </div>
        {saveSuccess && (
          <div className="mt-4 text-green-600 dark:text-green-400 font-medium">
            Project saved! Check your Projects section.
          </div>
        )}
      </div>
    );
  }
  if (template.key === "travel") {
    return (
      <div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 border border-accent">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
        >
          ← Back to Templates
        </button>
        <h3 className="text-xl font-bold text-accent flex items-center gap-2 mb-2">
          ✈️ Travel Planner
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Organize trips, itineraries, and packing lists.
        </p>
        <div className="bg-white/70 dark:bg-gray-800/70 border border-accent rounded-xl p-6 mb-6">
          <h4 className="font-semibold mb-2">Upcoming Trips</h4>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">Destination</th>
                <th className="p-2">Dates</th>
                <th className="p-2">Notes</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip, idx) => (
                <tr key={idx} className="border-t border-accent/30">
                  <td className="p-2 font-medium">
                    <input
                      className="bg-transparent border-b border-accent/30 focus:border-accent outline-none"
                      value={trip.destination}
                      onChange={(e) =>
                        handleTripChange(idx, "destination", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="bg-transparent border-b border-accent/30 focus:border-accent outline-none"
                      value={trip.dates}
                      onChange={(e) =>
                        handleTripChange(idx, "dates", e.target.value)
                      }
                      placeholder="YYYY-MM-DD"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="bg-transparent border-b border-accent/30 focus:border-accent outline-none"
                      value={trip.notes}
                      onChange={(e) =>
                        handleTripChange(idx, "notes", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDeleteTrip(idx)}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddTrip}
              className="px-3 py-1 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
            >
              Add Trip
            </button>
          </div>
        </div>
        <div className="bg-white/70 dark:bg-gray-800/70 border border-accent rounded-xl p-6 mb-6">
          <h4 className="font-semibold mb-2">Packing List</h4>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
            {packingList.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <input
                  className="flex-1 bg-transparent border-b border-accent/30 focus:border-accent outline-none"
                  value={item}
                  onChange={(e) => handlePackingChange(idx, e.target.value)}
                />
                <button
                  onClick={() => handleDeletePacking(idx)}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-2">
            <input
              className="flex-1 bg-transparent border-b border-accent/30 focus:border-accent outline-none"
              value={newPacking}
              onChange={(e) => setNewPacking(e.target.value)}
              placeholder="Add new item..."
            />
            <button
              onClick={handleAddPacking}
              className="px-3 py-1 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
            >
              Add
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveAsProject}
            className="px-6 py-2 rounded-lg font-semibold shadow bg-accent text-white transition-all duration-200 focus:outline-none focus:ring-2 ring-accent hover:opacity-90"
          >
            Save as Project
          </button>
        </div>
        {saveSuccess && (
          <div className="mt-4 text-green-600 dark:text-green-400 font-medium">
            Project saved! Check your Projects section.
          </div>
        )}
      </div>
    );
  }
  // ... Repeat for study, meal, project, finance, reading, selfcare ...
  // fallback for custom templates
  return (
    <div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 border border-accent">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
      >
        ← Back to Templates
      </button>
      <div className="text-gray-700 dark:text-gray-300">
        This template is ready for your customization!
      </div>
    </div>
  );
}

// Add TemplatesPanel component
function TemplatesPanel() {
  // Load templates from localStorage or use defaults
  const defaultTemplates = [
    {
      key: "fitness",
      name: "Fitness Tracker",
      icon: "🏋️‍♂️",
      description: "Track workouts, set fitness goals, and monitor progress.",
      builtIn: true,
    },
    {
      key: "finance",
      name: "Finance Manager",
      icon: "💰",
      description: "Manage budgets, expenses, and savings with ease.",
      builtIn: true,
    },
    {
      key: "study",
      name: "Study Planner",
      icon: "📚",
      description: "Organize study sessions, assignments, and deadlines.",
      builtIn: true,
    },
    {
      key: "habit",
      name: "Habit Tracker",
      icon: "✅",
      description: "Build and track daily habits for personal growth.",
      builtIn: true,
    },
    {
      key: "meal",
      name: "Meal Planner",
      icon: "🍽️",
      description: "Plan meals, grocery lists, and track nutrition.",
      builtIn: true,
    },
    {
      key: "project",
      name: "Project Roadmap",
      icon: "🗺️",
      description: "Visualize project milestones and timelines.",
      builtIn: true,
    },
    {
      key: "reading",
      name: "Reading List",
      icon: "📖",
      description: "Keep track of books and articles you want to read.",
      builtIn: true,
    },
    {
      key: "travel",
      name: "Travel Planner",
      icon: "✈️",
      description: "Organize trips, itineraries, and packing lists.",
      builtIn: true,
    },
    {
      key: "selfcare",
      name: "Self-Care Journal",
      icon: "🧘‍♀️",
      description: "Reflect on your well-being and self-care routines.",
      builtIn: true,
    },
  ];
  const [templates, setTemplates] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("templates");
      if (saved) return JSON.parse(saved);
    }
    return defaultTemplates;
  });
  const [form, setForm] = useState({
    name: "",
    icon: "🗂️",
    description: "",
  });
  const [editingIdx, setEditingIdx] = useState(null);
  const [used, setUsed] = useState(null);
  const [detail, setDetail] = useState(null);
  const [lastSavedProjectId, setLastSavedProjectId] = useState(null);
  const iconOptions = [
    "🗂️",
    "🏋️‍♂️",
    "💰",
    "📚",
    "✅",
    "🍽️",
    "🗺️",
    "📖",
    "✈️",
    "🧘‍♀️",
    "💡",
    "🎯",
    "⭐",
    "🏠",
    "🚗",
    "🍕",
    "☕",
    "💻",
    "📱",
    "🎵",
    "🎬",
    "🏃‍♀️",
    "🎓",
    "🛒",
    "🏥",
  ];

  // Save templates to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("templates", JSON.stringify(templates));
    }
  }, [templates]);

  // Add or update template
  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.icon.trim() || !form.description.trim())
      return;
    if (editingIdx !== null) {
      // Edit
      setTemplates((prev) =>
        prev.map((tpl, i) =>
          i === editingIdx
            ? { ...tpl, ...form, builtIn: tpl.builtIn || false }
            : tpl
        )
      );
      setEditingIdx(null);
    } else {
      // Add
      setTemplates((prev) => [
        ...prev,
        {
          key: `custom-${Date.now()}`,
          name: form.name,
          icon: form.icon,
          description: form.description,
          builtIn: false,
        },
      ]);
    }
    setForm({ name: "", icon: "🗂️", description: "" });
  };

  // Edit template
  const handleEdit = (idx) => {
    setEditingIdx(idx);
    setForm({
      name: templates[idx].name,
      icon: templates[idx].icon,
      description: templates[idx].description,
    });
  };

  // Delete template
  const handleDelete = (idx) => {
    if (templates[idx].builtIn) return;
    setTemplates((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingIdx(null);
    setForm({ name: "", icon: "🗂️", description: "" });
  };

  const router = useRouter();

  if (detail) {
    return (
      <TemplateDetailPanel
        template={detail}
        onBack={() => setDetail(null)}
        onSaveProject={(id) => {
          setLastSavedProjectId(id);
          setDetail(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 border border-accent">
      <h2 className="text-2xl font-bold text-accent mb-6 flex items-center gap-2">
        🗂️ Productivity Templates
      </h2>
      {/* Add/Edit Template Form */}
      <form
        onSubmit={handleSave}
        className="mb-8 bg-white/70 dark:bg-gray-800/70 border border-accent rounded-xl p-6 flex flex-col gap-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Icon
            </label>
            <div className="flex gap-1 flex-wrap max-w-xs">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`w-8 h-8 rounded-lg border-2 text-lg transition-all ${
                    form.icon === icon
                      ? "border-accent bg-accent/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-accent"
                  }`}
                  onClick={() => setForm((f) => ({ ...f, icon }))}
                  aria-label={`Icon ${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2 border border-accent rounded-lg focus:ring-2 ring-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Workout Log, Budget Tracker"
              required
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full px-4 py-2 border border-accent rounded-lg focus:ring-2 ring-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe this template"
              required
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          {editingIdx !== null && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg font-semibold bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-semibold shadow bg-accent text-white transition-all duration-200 focus:outline-none focus:ring-2 ring-accent hover:opacity-90"
          >
            {editingIdx !== null ? "Save Changes" : "Add Template"}
          </button>
        </div>
      </form>
      {lastSavedProjectId && (
        <div className="mb-6 text-green-600 dark:text-green-400 font-medium">
          Project created!{" "}
          <a
            href="#projects"
            className="underline text-accent"
            onClick={() => setDetail(null)}
          >
            View in Projects
          </a>
        </div>
      )}
      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((tpl, idx) => {
          // Pick a unique pastel gradient for each card
          const pastelGradients = [
            "from-pastel-pink via-pastel-blue to-pastel-yellow",
            "from-pastel-yellow via-pastel-mint to-pastel-blue",
            "from-pastel-purple via-pastel-pink to-pastel-blue",
            "from-pastel-blue via-pastel-mint to-pastel-yellow",
            "from-pastel-lilac via-pastel-pink to-pastel-yellow",
            "from-pastel-mint via-pastel-blue to-pastel-pink",
            "from-pastel-yellow via-pastel-lilac to-pastel-blue",
            "from-pastel-blue via-pastel-yellow to-pastel-mint",
            "from-pastel-pink via-pastel-yellow to-pastel-blue",
          ];
          const gradient = pastelGradients[idx % pastelGradients.length];

          // Mini preview for built-in templates
          let miniPreview = null;
          if (tpl.key === "fitness") {
            miniPreview = (
              <div className="text-xs mt-2">
                <div className="flex gap-2 mb-1">
                  <span className="font-bold">Mon</span>
                  <span className="bg-white/60 rounded px-2">Squats</span>
                  <span className="bg-white/60 rounded px-2">3x12</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold">Tue</span>
                  <span className="bg-white/60 rounded px-2">Pushups</span>
                  <span className="bg-white/60 rounded px-2">4x10</span>
                </div>
              </div>
            );
          } else if (tpl.key === "finance") {
            miniPreview = (
              <div className="text-xs mt-2">
                <div className="flex gap-2 mb-1">
                  <span className="font-bold">Rent</span>
                  <span className="bg-white/60 rounded px-2">$1200</span>
                  <span className="bg-white/60 rounded px-2">$1200</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold">Groceries</span>
                  <span className="bg-white/60 rounded px-2">$300</span>
                  <span className="bg-white/60 rounded px-2">$250</span>
                </div>
              </div>
            );
          } else if (tpl.key === "study") {
            miniPreview = (
              <div className="text-xs mt-2">
                <div className="flex gap-2 mb-1">
                  <span className="font-bold">Mon</span>
                  <span className="bg-white/60 rounded px-2">Math</span>
                  <span className="bg-white/60 rounded px-2">Algebra</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold">Tue</span>
                  <span className="bg-white/60 rounded px-2">History</span>
                  <span className="bg-white/60 rounded px-2">WWII</span>
                </div>
              </div>
            );
          } else if (tpl.key === "habit") {
            miniPreview = (
              <div className="text-xs mt-2 flex gap-2">
                <span className="bg-white/60 rounded px-2">Meditate</span>
                <span className="bg-white/60 rounded px-2">Read</span>
                <span className="bg-white/60 rounded px-2">Exercise</span>
              </div>
            );
          } else if (tpl.key === "meal") {
            miniPreview = (
              <div className="text-xs mt-2">
                <div className="flex gap-2 mb-1">
                  <span className="font-bold">Mon</span>
                  <span className="bg-white/60 rounded px-2">Oatmeal</span>
                  <span className="bg-white/60 rounded px-2">Salad</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold">Tue</span>
                  <span className="bg-white/60 rounded px-2">Eggs</span>
                  <span className="bg-white/60 rounded px-2">Chicken</span>
                </div>
              </div>
            );
          } else if (tpl.key === "project") {
            miniPreview = (
              <div className="text-xs mt-2 flex gap-2">
                <span className="bg-white/60 rounded px-2">Kickoff</span>
                <span className="bg-white/60 rounded px-2">Research</span>
                <span className="bg-white/60 rounded px-2">Dev</span>
              </div>
            );
          } else if (tpl.key === "reading") {
            miniPreview = (
              <div className="text-xs mt-2 flex gap-2">
                <span className="bg-white/60 rounded px-2">Gatsby</span>
                <span className="bg-white/60 rounded px-2">Atomic Habits</span>
                <span className="bg-white/60 rounded px-2">Deep Work</span>
              </div>
            );
          } else if (tpl.key === "travel") {
            miniPreview = (
              <div className="text-xs mt-2 flex gap-2">
                <span className="bg-white/60 rounded px-2">Paris</span>
                <span className="bg-white/60 rounded px-2">Tokyo</span>
                <span className="bg-white/60 rounded px-2">NYC</span>
              </div>
            );
          } else if (tpl.key === "selfcare") {
            miniPreview = (
              <div className="text-xs mt-2 flex gap-2">
                <span className="bg-white/60 rounded px-2">Meditation</span>
                <span className="bg-white/60 rounded px-2">Exercise</span>
                <span className="bg-white/60 rounded px-2">Read</span>
              </div>
            );
          }

          return (
            <div
              key={tpl.key}
              className={`relative group bg-gradient-to-br ${gradient} border-2 border-accent rounded-2xl p-6 flex flex-col gap-3 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[var(--accent-color)]`}
              style={{ minHeight: 210 }}
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 rounded-2xl bg-white/90 group-hover:bg-white transition-all z-0" />
              <div className="relative z-10">
                {/* TEMPLATE badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-pastel-blue/80 text-accent text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-accent tracking-wide uppercase">
                    TEMPLATE
                  </span>
                </div>
                {/* Icon and Title */}
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-4xl drop-shadow-lg animate-float">
                    {tpl.icon}
                  </span>
                  <span className="text-lg font-bold text-[#22223b] drop-shadow-sm">
                    {tpl.name}
                  </span>
                </div>
                {/* Description */}
                <div className="text-sm text-[#22223b] mb-1">
                  {tpl.description}
                </div>
                {/* Mini Preview */}
                <div className="text-[#22223b]">{miniPreview}</div>
                {/* Use Template Button */}
                <div className="flex gap-2 mt-auto">
                  <button
                    className="px-4 py-2 rounded-full font-semibold shadow bg-pastel-pink text-[#22223b] hover:bg-pastel-blue hover:text-pastel-pink transition-all duration-200 focus:outline-none focus:ring-2 ring-accent flex items-center gap-2 text-sm"
                    onClick={() => router.push(`/templates/${tpl.key}`)}
                  >
                    <span>✨</span> Use Template
                  </button>
                  {!tpl.builtIn && (
                    <>
                      <button
                        className="px-3 py-1 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-[#22223b] dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded-lg font-semibold bg-red-400 text-white hover:bg-red-500 transition-all text-sm"
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function UnifiedDashboard({
  user = { avatar: null, role: "user" },
  onLogout,
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState("calendar");
  const [profileAvatar, setProfileAvatar] = useState(user.avatar || null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userManagementOpen, setUserManagementOpen] = useState(false);

  // Social Media Management hooks (must be at the top, before any function definitions)
  const [showAddSocialForm, setShowAddSocialForm] = useState(false);
  const [newSocialPost, setNewSocialPost] = useState({
    title: "",
    stats: "",
    date: "",
  });
  const [recentSocialPosts, setRecentSocialPosts] = useState([
    {
      title: "How to Boost Your Brand on Instagram",
      stats: "2 days ago · 1,200 likes · 300 shares",
    },
    {
      title: "5 Twitter Trends to Watch in 2024",
      stats: "4 days ago · 900 likes · 150 retweets",
    },
  ]);

  // Role-specific navigation items
  const getRoleSpecificNav = (role) => {
    const baseNav = [
      { key: "dashboard", label: "Dashboard", icon: "🏠" },
      { key: "projects", label: "Projects", icon: "📁" },
      { key: "templates", label: "Templates", icon: "🗂️" },
      { key: "settings", label: "Settings", icon: "⚙️" },
    ];

    const roleNav = {
      admin: [
        ...baseNav,
        { key: "analytics", label: "Analytics", icon: "📊" },
        { key: "system", label: "System", icon: "⚙️" },
      ],
      hr: [
        ...baseNav,
        { key: "employees", label: "Employees", icon: "👥" },
        { key: "recruitment", label: "Recruitment", icon: "📋" },
        { key: "performance", label: "Performance", icon: "📈" },
        { key: "reports", label: "Reports", icon: "📊" },
        { key: "hr-projects", label: "HR Projects", icon: "📁" },
      ],
      marketing: [
        ...baseNav,
        { key: "campaigns", label: "Campaigns", icon: "📢" },
        { key: "content", label: "Content", icon: "📝" },
        { key: "analytics", label: "Analytics", icon: "📊" },
        { key: "social", label: "Social Media", icon: "📱" },
      ],
      finance: [
        ...baseNav,
        { key: "budgets", label: "Budgets", icon: "💰" },
        { key: "expenses", label: "Expenses", icon: "💸" },
        { key: "reports", label: "Reports", icon: "📊" },
        { key: "forecasting", label: "Forecasting", icon: "📈" },
      ],
      blog_writer: [
        ...baseNav,
        { key: "articles", label: "Articles", icon: "📝" },
        { key: "drafts", label: "Drafts", icon: "📄" },
        { key: "calendar", label: "Content Calendar", icon: "📅" },
        { key: "research", label: "Research", icon: "🔍" },
      ],
      seo_manager: [
        ...baseNav,
        { key: "keywords", label: "Keywords", icon: "🔑" },
        { key: "rankings", label: "Rankings", icon: "📈" },
        { key: "content", label: "Content", icon: "📝" },
        { key: "analytics", label: "SEO Analytics", icon: "📊" },
      ],
      project_manager: [
        ...baseNav,
        { key: "teams", label: "Teams", icon: "👥" },
        { key: "timeline", label: "Timeline", icon: "📅" },
        { key: "resources", label: "Resources", icon: "📦" },
        { key: "reports", label: "Reports", icon: "📊" },
      ],
      developer: [
        ...baseNav,
        { key: "code", label: "Code", icon: "💻" },
        { key: "bugs", label: "Bugs", icon: "🐛" },
        { key: "deployments", label: "Deployments", icon: "🚀" },
        { key: "documentation", label: "Documentation", icon: "📚" },
      ],
      designer: [
        ...baseNav,
        { key: "designs", label: "Designs", icon: "🎨" },
        { key: "assets", label: "Assets", icon: "🖼️" },
        { key: "prototypes", label: "Prototypes", icon: "📱" },
        { key: "inspiration", label: "Inspiration", icon: "💡" },
      ],
    };

    return roleNav[role] || baseNav;
  };

  const nav = getRoleSpecificNav(user.role);

  // Track open dropdowns
  const [openDropdowns, setOpenDropdowns] = useState({});
  useEffect(() => {
    // Open the dropdown if a child is active
    nav.forEach((item) => {
      if (item.children && item.children.some((c) => c.key === activeSection)) {
        setOpenDropdowns((prev) => ({ ...prev, [item.key]: true }));
      }
    });
    // eslint-disable-next-line
  }, [activeSection]);

  // Fetch users when in user management section
  useEffect(() => {
    if (activeSection === "users" && user.role === "admin") {
      setUsersLoading(true);
      fetch("/api/admin/stats")
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.users || []);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        })
        .finally(() => {
          setUsersLoading(false);
        });
    }
  }, [activeSection, user.role, refreshKey]);

  // Helper to render sidebar items
  const renderNav = (items, parent = null) => (
    <ul className="space-y-1">
      {items.map((item) => {
        if (item.adminOnly && user.role !== "admin") return null;
        const isActive = activeSection === item.key;
        const isDropdown = item.isDropdown;
        const isOpen = openDropdowns[item.key];

        return (
          <li key={item.key}>
            <button
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                isActive || (isDropdown && isOpen)
                  ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                  : "text-gray-700 dark:text-gray-200 hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300"
              }`}
              onClick={() => {
                if (isDropdown) {
                  setOpenDropdowns((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key],
                  }));
                } else if (item.key === "templates") {
                  // Navigate to the templates page
                  router.push("/templates");
                } else {
                  setActiveSection(item.key);
                }
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {isDropdown && (
                <span className="ml-auto text-xs">{isOpen ? "▲" : "▼"}</span>
              )}
            </button>
            {isDropdown && isOpen && item.children && (
              <div className="ml-4 mt-1 border-l border-purple-500 pl-2">
                {renderNav(item.children, item.key)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  // Role-specific content rendering
  const renderRoleSpecificContent = () => {
    const roleContent = {
      admin: {
        analytics: (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">System Analytics</h2>
            <p>Admin analytics dashboard</p>
          </div>
        ),
        system: (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">System Settings</h2>
            <p>System configuration panel</p>
          </div>
        ),
      },
      hr: {
        employees: (
          <>
            <div className="p-6 bg-teal-100 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Employees</h2>
              <p>HR employee dashboard</p>
            </div>
            <EmployeesBox />
          </>
        ),
        recruitment: (
          <>
            <div className="p-6 bg-orange-100 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Recruitment</h2>
              <p>Recruitment management</p>
            </div>
            <RecruitmentBox />
          </>
        ),
        performance: (
          <>
            <div className="p-6 bg-purple-100 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Performance Reviews</h2>
              <p>Performance management</p>
            </div>
            <PerformanceReviewsBox />
          </>
        ),
        reports: (
          <>
            <div className="p-6 bg-pink-100 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">HR Reports</h2>
              <p>HR reporting dashboard</p>
            </div>
            <HRReportsBox />
          </>
        ),
        "hr-projects": (
          <>
            <div className="p-6 bg-pink-100 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">HR Projects</h2>
              <p>HR project management and tracking</p>
            </div>
            <HRProjectsBox />
          </>
        ),
      },
      marketing: {
        campaigns: (
          <>
            <div className="p-6 bg-blue-100 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Marketing Campaigns</h2>
              <p>Campaign management</p>
            </div>
            <EditableCampaignsBox />
          </>
        ),
        content: (
          <>
            <div className="p-6 bg-pink-100 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Content Management</h2>
              <p>Content creation and management</p>
            </div>
            <EditableContentManagementBox />
          </>
        ),
        analytics: (
          <>
            <div className="p-6 bg-yellow-100 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Marketing Analytics</h2>
              <p>Marketing performance metrics</p>
            </div>
            {/* Editable Analytics Box with Chart */}
            <EditableAnalyticsBox />
          </>
        ),
        social: (
          <div>
            <div className="mb-6 p-4 bg-teal-600 text-white rounded-lg shadow font-bold text-xl text-center tracking-wide">
              Social Media Management
            </div>
            <div className="p-6 bg-gray-900 dark:bg-gray-800 rounded-lg shadow-md text-white">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span role="img" aria-label="Social Media">
                  📱
                </span>{" "}
                Social Media
              </h2>
              <div className="mb-4">
                <p className="text-lg font-semibold">Social Media Overview</p>
                <ul className="list-disc list-inside text-gray-200 text-base mt-2 space-y-1">
                  <li>
                    Followers: <span className="font-bold">12,500</span>
                  </li>
                  <li>
                    Posts This Week: <span className="font-bold">8</span>
                  </li>
                  <li>
                    Engagement Rate: <span className="font-bold">5.2%</span>
                  </li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold mb-1">Recent Posts</p>
                <div className="space-y-2">
                  {recentSocialPosts.map((post, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 rounded p-3 flex flex-col gap-1"
                    >
                      <span className="font-medium">{post.title}</span>
                      <span className="text-xs text-gray-400">
                        {post.stats}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold mb-1">Upcoming Campaigns</p>
                <ul className="list-disc list-inside text-gray-200 text-base space-y-1">
                  <li>Spring Sale Launch - Mar 20</li>
                  <li>Influencer Collaboration - Mar 25</li>
                </ul>
              </div>
              {/* Add more social media widgets/content below as needed */}
              <div className="mt-6">
                <button
                  className="bg-gray-700 text-white border-2 border-accent px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-800 transition-all"
                  onClick={() => setShowAddSocialForm((v) => !v)}
                >
                  {showAddSocialForm ? "Cancel" : "Add Social Media Content"}
                </button>
              </div>
              {showAddSocialForm && (
                <form
                  className="mt-6 bg-gray-800 p-4 rounded-lg flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newSocialPost.title && newSocialPost.stats) {
                      setRecentSocialPosts([
                        {
                          title: newSocialPost.title,
                          stats: newSocialPost.stats,
                        },
                        ...recentSocialPosts,
                      ]);
                      setNewSocialPost({ title: "", stats: "", date: "" });
                      setShowAddSocialForm(false);
                    }
                  }}
                >
                  <input
                    className="bg-gray-900 text-white border border-accent rounded px-3 py-2 focus:outline-none"
                    placeholder="Post Title"
                    value={newSocialPost.title}
                    onChange={(e) =>
                      setNewSocialPost({
                        ...newSocialPost,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    className="bg-gray-900 text-white border border-accent rounded px-3 py-2 focus:outline-none"
                    placeholder="Stats (e.g. 1 day ago · 500 likes · 100 shares)"
                    value={newSocialPost.stats}
                    onChange={(e) =>
                      setNewSocialPost({
                        ...newSocialPost,
                        stats: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gray-700 text-white border-2 border-accent px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-800 transition-all"
                  >
                    Add Post
                  </button>
                </form>
              )}
            </div>
          </div>
        ),
        projects: <ProjectsBox />,
      },
      finance: {
        budgets: (
          <>
            <div className="p-6 bg-gradient-to-br from-[#F5F5FF] to-[#FAFAFF] rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Budget Management</h2>
              <p className="text-gray-600">
                Track and manage departmental budgets
              </p>
            </div>
            <ExpenseBudgetBox />
          </>
        ),
        expenses: (
          <>
            <div className="p-6 bg-gradient-to-br from-[#F5F5FF] to-[#FAFAFF] rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Expense Tracking</h2>
              <p className="text-gray-600">Monitor and analyze expenses</p>
            </div>
            <ExpenseBudgetBox />
          </>
        ),
        reports: (
          <>
            <div className="p-6 bg-gradient-to-br from-[#F5F5FF] to-[#FAFAFF] rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Financial Reports</h2>
              <p className="text-gray-600">View and manage financial reports</p>
            </div>
            <FinancialReportBox />
          </>
        ),
        forecasting: (
          <>
            <div className="p-6 bg-gradient-to-br from-[#F5F5FF] to-[#FAFAFF] rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Financial Forecasting</h2>
              <p className="text-gray-600">
                Manage revenue and expense forecasts
              </p>
            </div>
            <RevenueForecastBox />
            <ExpenseForecastBox />
          </>
        ),
      },
      blog_writer: {
        articles: (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Article Management</h2>
            <p>Blog article management</p>
          </div>
        ),
        drafts: (
          <>
            <div className="p-6 bg-gradient-to-br from-[#E6FFE6] to-[#F0FFF0] rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4 text-[#2E8B57]">
                Draft Articles
              </h2>
              <p className="text-gray-600">
                Manage your article drafts and works in progress
              </p>
            </div>
            <DraftArticlesBox />
          </>
        ),
        calendar: (
          <>
            <div className="p-6 bg-gradient-to-br from-[#E6E6FF] to-[#F0F0FF] rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4 text-[#6B46C1]">
                Content Calendar
              </h2>
              <p className="text-gray-600">
                Plan and schedule your content publishing
              </p>
            </div>
            <ContentCalendarBox />
          </>
        ),
        research: (
          <>
            <div className="p-6 bg-gradient-to-br from-[#FFE6F3] to-[#FFF0F9] rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4 text-[#FF69B4]">
                Research Tools
              </h2>
              <p className="text-gray-600">
                Content research and topic analysis
              </p>
            </div>
            <ResearchToolsBox />
          </>
        ),
      },
      seo_manager: {
        keywords: (
          <>
            <div className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Keyword Research</h2>
              <p>SEO keyword management</p>
            </div>
            <SEOKeywordsBox />
          </>
        ),
        rankings: (
          <>
            <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Search Rankings</h2>
              <p>Ranking tracking</p>
            </div>
            <SEORankingsBox />
          </>
        ),
        content: (
          <>
            <div className="p-6 bg-gradient-to-br from-pink-100 to-pink-200 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">SEO Content</h2>
              <p>SEO-optimized content</p>
            </div>
            <SEOContentBox />
          </>
        ),
        analytics: (
          <>
            <div className="p-6 bg-gradient-to-br from-cyan-100 to-blue-200 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">SEO Analytics</h2>
              <p>SEO performance metrics</p>
            </div>
            <SEOInfoBox />
          </>
        ),
      },
      project_manager: {
        teams: (
          <>
            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-400 text-black rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Team Management</h2>
              <p className="text-blue-100">
                Manage project teams and assignments
              </p>
            </div>
            <TeamInfoBox />
            <TeamManagementBox />
          </>
        ),
        timeline: (
          <>
            <div className="p-6 bg-gradient-to-br from-purple-600 to-purple-400 text-white rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Project Timeline</h2>
              <p className="text-purple-100">
                Track project milestones and deadlines
              </p>
            </div>
            <TimelineInfoBox />
            <ProjectTimelineBox />
          </>
        ),
        resources: (
          <>
            <div className="p-6 bg-gradient-to-br from-green-600 to-green-400 text-white rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Resource Management</h2>
              <p className="text-green-100">
                Allocate and track project resources
              </p>
            </div>
            <ResourceInfoBox />
            <ResourceManagementBox />
          </>
        ),
        reports: (
          <>
            <div className="p-6 bg-gradient-to-br from-pink-600 to-pink-400 text-white rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Project Reports</h2>
              <p className="text-pink-100">
                Generate and view project analytics
              </p>
            </div>
            <ReportInfoBox />
            <ProjectReportsBox />
          </>
        ),
      },
      developer: {
        code: (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Code Repository</h2>
            <p>Code management</p>
          </div>
        ),
        bugs: (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Bug Tracking</h2>
            <p>Bug management</p>
          </div>
        ),
        deployments: (
          <>
            <div className="p-6 bg-gradient-to-br from-green-100 to-yellow-100 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4 text-green-700">
                Deployments
              </h2>
              <p>Deployment management</p>
            </div>
            <DeploymentInfoBox />
          </>
        ),
        documentation: (
          <>
            <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-700">
                Documentation
              </h2>
              <p>Technical documentation</p>
            </div>
            <DevDocsBox />
          </>
        ),
      },
      designer: {
        designs: (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Design Projects</h2>
            <p>Design project management</p>
          </div>
        ),
        assets: (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Design Assets</h2>
            <p>Asset management</p>
          </div>
        ),
        prototypes: (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Prototypes</h2>
            <p>Prototype management</p>
          </div>
        ),
        inspiration: (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Inspiration Board</h2>
            <p>Design inspiration</p>
          </div>
        ),
      },
    };

    return roleContent[user.role]?.[activeSection] || null;
  };

  // Main content rendering
  let mainContent = null;
  if (activeSection === "dashboard") {
    mainContent = (
      <Dashboard
        user={user}
        onAddTask={() => setShowTaskForm(true)}
        onManageCategories={() => setActiveSection("project-categories")}
        refreshKey={refreshKey}
      />
    );
  } else if (activeSection === "project-categories") {
    mainContent = (
      <CategoryManager
        onClose={() => setActiveSection("dashboard")}
        onCategoryUpdate={() => setRefreshKey((k) => k + 1)}
      />
    );
  } else if (activeSection === "project-list") {
    mainContent = <ProjectManager />;
  } else if (activeSection === "settings") {
    mainContent = (
      <Settings
        onProfileUpdate={(updated) => setProfileAvatar(updated.avatar)}
      />
    );
  } else if (activeSection === "users" && user.role === "admin") {
    mainContent = (
      <>
        <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 text-gray-900 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <p className="text-gray-600">
            Manage system users and their accounts
          </p>
        </div>

        {/* Create User Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowUserManager(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg hover:from-green-500 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <span className="mr-2">👤</span>
            Create New User
          </button>
        </div>

        {/* Users List */}
        {usersLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">👥</span>
            <p className="text-gray-500 mb-4">No users found.</p>
            <button
              onClick={() => setShowUserManager(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg hover:from-green-500 hover:to-blue-500 transition-all duration-200"
            >
              Create First User
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Users ({users.length})
              </h3>
            </div>

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
                      Roles
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
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                              u.role === "admin"
                                ? "bg-gradient-to-r from-pink-400 to-purple-400"
                                : "bg-gradient-to-r from-blue-400 to-green-400"
                            }`}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(u.roles && u.roles.length > 0
                            ? u.roles
                            : [u.role || "user"]
                          ).map((roleKey) => (
                            <span
                              key={roleKey}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold"
                            >
                              {roleKey}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {u.taskCount || 0} tasks
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setShowUserManager(true);
                            }}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          {u.role !== "admin" && (
                            <button
                              onClick={async () => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this user?"
                                  )
                                ) {
                                  try {
                                    const response = await fetch(
                                      `/api/admin/users/${u._id}`,
                                      {
                                        method: "DELETE",
                                      }
                                    );
                                    if (response.ok) {
                                      setRefreshKey((k) => k + 1);
                                    } else {
                                      alert("Failed to delete user");
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error deleting user:",
                                      error
                                    );
                                    alert("Error deleting user");
                                  }
                                }
                              }}
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
          </div>
        )}

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
                onUserUpdate={() => setRefreshKey((k) => k + 1)}
              />
            </div>
          </div>
        )}
      </>
    );
  } else if (activeSection === "roles" && user.role === "admin") {
    mainContent = (
      <>
        <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 text-gray-900 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Role Management</h2>
          <p className="text-gray-600">Create and manage user roles</p>
        </div>
        <RolesManager />
      </>
    );
  } else if (activeSection === "permissions" && user.role === "admin") {
    mainContent = (
      <>
        <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 text-gray-900 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Permission Management</h2>
          <p className="text-gray-600">Configure role-based permissions</p>
        </div>
        <PermissionsManager user={user} />
      </>
    );
  } else if (activeSection === "templates") {
    mainContent = <TemplatesPanel />;
  } else {
    // Check for role-specific content
    const roleContent = renderRoleSpecificContent();
    if (roleContent) {
      mainContent = roleContent;
    } else {
      mainContent = (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
          <p className="text-gray-600">Role: {user.role}</p>
          <p className="text-gray-600">This is your personalized dashboard.</p>
        </div>
      );
    }
  }

  // Show add task button except in settings, roles, permissions, user management
  const showAddTaskBtn = ![
    "settings",
    "roles",
    "permissions",
    "users",
  ].includes(activeSection);

  // Tools sidebar content
  const toolTabs = [
    { key: "calendar", label: "Calendar", icon: "📅", component: <Calendar /> },
    { key: "pomodoro", label: "Pomodoro", icon: "🍅", component: <Pomodoro /> },
    { key: "timer", label: "Timer", icon: "⏱️", component: <Timer /> },
    { key: "clock", label: "Clock", icon: "🕐", component: <Clock /> },
  ];

  // Listen for avatar changes from Settings
  const handleProfileUpdate = (updated) => {
    if (updated && updated.avatar) setProfileAvatar(updated.avatar);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        // Call the onLogout prop to update parent state
        if (onLogout) {
          onLogout();
        }
        // Clear any local storage or state if needed
        localStorage.clear();
        // Force a hard navigation to the home page
        window.location.href = "/";
      } else {
        console.error("Logout failed:", response.status);
        // Fallback: clear cookie manually and redirect
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear cookie manually and redirect
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/";
    }
  };

  // User Management Dropdown Section (admin only)
  const userManagementDropdown =
    user.role === "admin" ? (
      <div className="mt-8">
        <div className="px-6 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
          User Management
        </div>
        <ul className="space-y-1 px-4">
          <li>
            <button
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                ["roles", "permissions"].includes(activeSection)
                  ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                  : "text-gray-700 dark:text-gray-200 hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300"
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
                        activeSection === "roles"
                          ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                          : "text-gray-700 dark:text-gray-200 hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300"
                      }`}
                      onClick={() => setActiveSection("roles")}
                    >
                      <span className="text-lg">🛡️</span>
                      <span>Roles</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                        activeSection === "permissions"
                          ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                          : "text-gray-700 dark:text-gray-200 hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300"
                      }`}
                      onClick={() => setActiveSection("permissions")}
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
    ) : null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 relative">
      {/* Sidebar */}
      <aside className="flex flex-col h-screen w-64 border-r shadow-xl bg-white/90 border-gray-200 dark:bg-[#181c2a] dark:border-gray-800 transition-colors duration-300">
        {/* Logo/Header */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800 justify-between transition-colors duration-300">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-wide">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {/* Debug info */}
          <div className="px-4 py-2 text-xs text-gray-500 mb-2">
            Role: {user.role} | Items: {nav.length}
            {nav.map((item) => ` | ${item.key}`).join("")}
          </div>
          {renderNav(nav)}
          {userManagementDropdown}
        </nav>
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-pastel-pink text-gray-900 rounded-lg hover:bg-pastel-blue transition-all duration-200 shadow-md hover:shadow-lg font-bold"
          >
            <span className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
            Logout
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto relative">
        {activeSection === "settings" ? (
          <Settings onProfileUpdate={handleProfileUpdate} />
        ) : (
          mainContent
        )}
        {showAddTaskBtn && (
          <button
            className="fixed bottom-8 right-8 z-40 bg-accent text-white rounded-full shadow-lg p-5 text-3xl hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-4 ring-accent"
            onClick={() => setShowTaskForm(true)}
            title="Add Task"
            style={{
              right: toolsOpen ? "22rem" : "2rem",
              transition: "right 0.3s",
            }}
          >
            ➕
          </button>
        )}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-accent">
              <TaskForm
                onClose={() => setShowTaskForm(false)}
                onTaskCreated={() => {
                  setShowTaskForm(false);
                  setRefreshKey((k) => k + 1);
                }}
              />
            </div>
          </div>
        )}
        {/* Tools Sidebar Toggle Button */}
        <button
          className={`fixed top-8 right-8 z-50 p-3 rounded-full bg-accent text-white shadow-lg hover:opacity-90 transition-all duration-200 ${
            toolsOpen ? "hidden" : ""
          }`}
          onClick={() => setToolsOpen(true)}
          title="Open Productivity Tools"
        >
          🛠️
        </button>
        {/* Tools Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-l border-accent shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
            toolsOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-accent">
            <span className="text-xl font-bold text-accent tracking-wide">
              Tools
            </span>
            <button
              className="text-gray-400 hover:text-accent"
              onClick={() => setToolsOpen(false)}
              title="Close Tools"
            >
              ✕
            </button>
          </div>
          {/* Tool Tabs */}
          <div className="flex border-b border-accent">
            {toolTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTool(tab.key)}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-sm font-medium transition-colors gap-1 ${
                  activeTool === tab.key
                    ? "text-accent border-b-2 border-accent bg-accent/10 dark:bg-accent/20"
                    : "text-gray-400 hover:text-accent"
                }`}
                style={{ minWidth: 0 }}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
          {/* Tool Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {toolTabs.find((tab) => tab.key === activeTool)?.component}
          </div>
        </div>
        {/* AI Chat Bot */}
        <AIChatBot />
      </main>
    </div>
  );
}

// Add this new component at the bottom of the file:
function EditableCampaignsBox() {
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newName && newStatus) {
      setCampaigns([
        ...campaigns,
        { id: Date.now(), name: newName, status: newStatus },
      ]);
      setNewName("");
      setNewStatus("");
      setShowForm(false);
    }
  };

  return (
    <div className="p-6 bg-orange-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Campaigns
      </h2>
      {campaigns.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center min-h-[60px]">
          <span className="mb-2">No campaigns for now</span>
          <button
            className="w-12 h-12 flex items-center justify-center bg-orange-300 text-3xl text-white rounded-full shadow hover:bg-orange-400 transition-all"
            onClick={() => setShowForm(true)}
            title="Add Campaign"
          >
            +
          </button>
        </div>
      )}
      {showForm && (
        <form className="flex flex-col gap-2 mb-4" onSubmit={handleAdd}>
          <input
            className="bg-orange-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
            placeholder="Campaign Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <input
            className="bg-orange-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
            placeholder="Status (e.g. Planned, Active)"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-3 py-1 rounded font-semibold"
            >
              Add
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-3 py-1 rounded font-semibold"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {campaigns.length > 0 && (
        <ul className="space-y-2">
          {campaigns.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-2 bg-orange-50 rounded px-3 py-2"
            >
              <span className="font-semibold">{c.name}</span>
              <span className="ml-2 text-xs bg-orange-200 px-2 py-0.5 rounded">
                {c.status}
              </span>
            </li>
          ))}
        </ul>
      )}
      {campaigns.length > 0 && !showForm && (
        <div className="flex justify-center mt-4">
          <button
            className="w-10 h-10 flex items-center justify-center bg-orange-300 text-2xl text-white rounded-full shadow hover:bg-orange-400 transition-all"
            onClick={() => setShowForm(true)}
            title="Add Campaign"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

// Add this new component at the bottom of the file:
function ProjectsBox() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      status: "In Progress",
      dueDate: "2024-04-15",
    },
    {
      id: 2,
      name: "Mobile App Development",
      status: "Planning",
      dueDate: "2024-05-01",
    },
    {
      id: 3,
      name: "Database Migration",
      status: "Completed",
      dueDate: "2024-03-30",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [newProject, setNewProject] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newProject.trim()) return;

    const project = {
      id: Date.now(),
      name: newProject,
      status: "Planning",
      dueDate: new Date().toISOString().split("T")[0],
    };

    setProjects([...projects, project]);
    setNewProject("");
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
  };

  const handleSave = (id) => {
    setProjects(
      projects.map((p) =>
        p.id === id
          ? { ...p, name: document.getElementById(`project-${id}`).value }
          : p
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="bg-gradient-to-br from-[#E6F3FF] to-[#F0F9FF] p-6 rounded-lg shadow-md border border-[#B8D9F3]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Projects</h3>
      <form onSubmit={handleAdd} className="mb-4">
        <input
          type="text"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="Add new project..."
          className="w-full p-2 rounded border border-[#B8D9F3] focus:outline-none focus:border-[#7FB3E3]"
        />
      </form>
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between bg-white/60 p-3 rounded border border-[#B8D9F3]"
          >
            {editingId === project.id ? (
              <input
                id={`project-${project.id}`}
                type="text"
                defaultValue={project.name}
                className="flex-1 p-1 rounded border border-[#B8D9F3]"
              />
            ) : (
              <div className="flex-1">
                <div className="font-medium text-gray-800">{project.name}</div>
                <div className="text-sm text-gray-600">
                  Status: {project.status} | Due: {project.dueDate}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === project.id ? (
                <button
                  onClick={() => handleSave(project.id)}
                  className="text-[#7FB3E3] hover:text-[#5A9AD3]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(project)}
                  className="text-[#7FB3E3] hover:text-[#5A9AD3]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-400 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HRProjectsBox() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Employee Onboarding Revamp",
      status: "In Progress",
      dueDate: "2024-04-20",
      type: "Process Improvement",
      assignedTo: "HR Team A",
    },
    {
      id: 2,
      name: "Annual Performance Review System",
      status: "Planning",
      dueDate: "2024-05-15",
      type: "System Implementation",
      assignedTo: "HR Team B",
    },
    {
      id: 3,
      name: "Employee Wellness Program",
      status: "Completed",
      dueDate: "2024-03-25",
      type: "Employee Engagement",
      assignedTo: "Wellness Committee",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [newProject, setNewProject] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newProject.trim()) return;

    const project = {
      id: Date.now(),
      name: newProject,
      status: "Planning",
      dueDate: new Date().toISOString().split("T")[0],
      type: "New Initiative",
      assignedTo: "Unassigned",
    };

    setProjects([...projects, project]);
    setNewProject("");
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
  };

  const handleSave = (id) => {
    setProjects(
      projects.map((p) =>
        p.id === id
          ? {
              ...p,
              name: document.getElementById(`hr-project-${id}`).value,
              type: document.getElementById(`hr-project-type-${id}`).value,
              assignedTo: document.getElementById(`hr-project-assigned-${id}`)
                .value,
            }
          : p
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="bg-gradient-to-br from-[#E6F3FF] to-[#F0F9FF] p-6 rounded-lg shadow-md border border-[#B8D9F3]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">HR Projects</h3>
      <form onSubmit={handleAdd} className="mb-4">
        <input
          type="text"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="Add new HR project..."
          className="w-full p-2 rounded border border-[#B8D9F3] focus:outline-none focus:border-[#7FB3E3]"
        />
      </form>
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between bg-white/60 p-3 rounded border border-[#B8D9F3]"
          >
            {editingId === project.id ? (
              <div className="flex-1 space-y-2">
                <input
                  id={`hr-project-${project.id}`}
                  type="text"
                  defaultValue={project.name}
                  className="w-full p-1 rounded border border-[#B8D9F3]"
                />
                <select
                  id={`hr-project-type-${project.id}`}
                  defaultValue={project.type}
                  className="w-full p-1 rounded border border-[#B8D9F3]"
                >
                  <option>Process Improvement</option>
                  <option>System Implementation</option>
                  <option>Employee Engagement</option>
                  <option>Training & Development</option>
                  <option>Policy Update</option>
                  <option>New Initiative</option>
                </select>
                <input
                  id={`hr-project-assigned-${project.id}`}
                  type="text"
                  defaultValue={project.assignedTo}
                  className="w-full p-1 rounded border border-[#B8D9F3]"
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="font-medium text-gray-800">{project.name}</div>
                <div className="text-sm text-gray-600">
                  Status: {project.status} | Due: {project.dueDate}
                </div>
                <div className="text-sm text-gray-600">
                  Type: {project.type} | Assigned: {project.assignedTo}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === project.id ? (
                <button
                  onClick={() => handleSave(project.id)}
                  className="text-[#7FB3E3] hover:text-[#5A9AD3]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(project)}
                  className="text-[#7FB3E3] hover:text-[#5A9AD3]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-400 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmployeesBox() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Alice Johnson", status: "Active" },
    { id: 2, name: "Bob Smith", status: "On Leave" },
    { id: 3, name: "Carol Lee", status: "Inactive" },
  ]);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newName && newStatus) {
      setEmployees([
        ...employees,
        { id: Date.now(), name: newName, status: newStatus },
      ]);
      setNewName("");
      setNewStatus("");
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setEditName(emp.name);
    setEditStatus(emp.status);
  };

  const handleSave = (id) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, name: editName, status: editStatus } : emp
      )
    );
    setEditingId(null);
    setEditName("");
    setEditStatus("");
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="p-6 bg-blue-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Employees</h2>
      <ul className="mb-4 space-y-2">
        {employees.map((emp) => (
          <li
            key={emp.id}
            className="flex items-center gap-2 bg-blue-50 rounded px-3 py-2"
          >
            {editingId === emp.id ? (
              <>
                <input
                  className="bg-blue-50 text-gray-900 border border-gray-400 rounded px-2 py-1 mr-2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <select
                  className="bg-blue-50 text-gray-900 border border-gray-400 rounded px-2 py-1 mr-2"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleSave(emp.id)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="font-semibold">{emp.name}</span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded ${
                    emp.status === "Active"
                      ? "bg-green-200 text-green-800"
                      : emp.status === "On Leave"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {emp.status}
                </span>
                <button
                  className="bg-yellow-400 text-blue-900 px-2 py-1 rounded ml-2"
                  onClick={() => handleEdit(emp)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded ml-1"
                  onClick={() => handleDelete(emp.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form className="flex gap-2" onSubmit={handleAdd}>
        <input
          className="bg-blue-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
          placeholder="Employee Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <select
          className="bg-blue-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          type="submit"
          className="bg-blue-400 text-white px-3 py-1 rounded font-semibold"
        >
          Add
        </button>
      </form>
    </div>
  );
}

function RecruitmentBox() {
  const [candidates, setCandidates] = useState([
    { id: 1, name: "David Brown", status: "Interview Scheduled" },
    { id: 2, name: "Eva Green", status: "Offer Sent" },
    { id: 3, name: "Frank White", status: "Application Received" },
  ]);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newName && newStatus) {
      setCandidates([
        ...candidates,
        { id: Date.now(), name: newName, status: newStatus },
      ]);
      setNewName("");
      setNewStatus("");
    }
  };

  const handleEdit = (cand) => {
    setEditingId(cand.id);
    setEditName(cand.name);
    setEditStatus(cand.status);
  };

  const handleSave = (id) => {
    setCandidates(
      candidates.map((cand) =>
        cand.id === id ? { ...cand, name: editName, status: editStatus } : cand
      )
    );
    setEditingId(null);
    setEditName("");
    setEditStatus("");
  };

  const handleDelete = (id) => {
    setCandidates(candidates.filter((cand) => cand.id !== id));
  };

  return (
    <div className="p-6 bg-pink-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Recruitment</h2>
      <ul className="mb-4 space-y-2">
        {candidates.map((cand) => (
          <li
            key={cand.id}
            className="flex items-center gap-2 bg-pink-50 rounded px-3 py-2"
          >
            {editingId === cand.id ? (
              <>
                <input
                  className="bg-pink-50 text-gray-900 border border-gray-400 rounded px-2 py-1 mr-2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <select
                  className="bg-pink-50 text-gray-900 border border-gray-400 rounded px-2 py-1 mr-2"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Interview Scheduled">
                    Interview Scheduled
                  </option>
                  <option value="Offer Sent">Offer Sent</option>
                  <option value="Application Received">
                    Application Received
                  </option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleSave(cand.id)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="font-semibold">{cand.name}</span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded ${
                    cand.status === "Interview Scheduled"
                      ? "bg-blue-200 text-blue-800"
                      : cand.status === "Offer Sent"
                      ? "bg-green-200 text-green-800"
                      : cand.status === "Application Received"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {cand.status}
                </span>
                <button
                  className="bg-yellow-400 text-pink-900 px-2 py-1 rounded ml-2"
                  onClick={() => handleEdit(cand)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded ml-1"
                  onClick={() => handleDelete(cand.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form className="flex gap-2" onSubmit={handleAdd}>
        <input
          className="bg-pink-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
          placeholder="Candidate Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <select
          className="bg-pink-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Offer Sent">Offer Sent</option>
          <option value="Application Received">Application Received</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          type="submit"
          className="bg-pink-400 text-white px-3 py-1 rounded font-semibold"
        >
          Add
        </button>
      </form>
    </div>
  );
}

function PerformanceReviewsBox() {
  const [reviews, setReviews] = useState([
    { id: 1, title: "Q1 Review", status: "Completed" },
    { id: 2, title: "Mid-Year Feedback", status: "In Progress" },
    { id: 3, title: "Annual Appraisal", status: "Pending" },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTitle && newStatus) {
      setReviews([
        ...reviews,
        { id: Date.now(), title: newTitle, status: newStatus },
      ]);
      setNewTitle("");
      setNewStatus("");
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditTitle(review.title);
    setEditStatus(review.status);
  };

  const handleSave = (id) => {
    setReviews(
      reviews.map((review) =>
        review.id === id
          ? { ...review, title: editTitle, status: editStatus }
          : review
      )
    );
    setEditingId(null);
    setEditTitle("");
    setEditStatus("");
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  return (
    <div className="p-6 bg-indigo-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Performance Reviews</h2>
      <ul className="mb-4 space-y-2">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="flex items-center gap-2 bg-indigo-50 rounded px-3 py-2"
          >
            {editingId === review.id ? (
              <>
                <input
                  className="bg-indigo-50 text-gray-900 border border-gray-400 rounded px-2 py-1 mr-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <select
                  className="bg-indigo-50 text-gray-900 border border-gray-400 rounded px-2 py-1 mr-2"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                </select>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleSave(review.id)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="font-semibold">{review.title}</span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded ${
                    review.status === "Completed"
                      ? "bg-green-200 text-green-800"
                      : review.status === "In Progress"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {review.status}
                </span>
                <button
                  className="bg-yellow-400 text-indigo-900 px-2 py-1 rounded ml-2"
                  onClick={() => handleEdit(review)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded ml-1"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form className="flex gap-2" onSubmit={handleAdd}>
        <input
          className="bg-indigo-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
          placeholder="Review Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <select
          className="bg-indigo-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-400 text-white px-3 py-1 rounded font-semibold"
        >
          Add
        </button>
      </form>
    </div>
  );
}

function HRReportsBox() {
  const [reports, setReports] = useState([
    { id: 1, title: "Attendance Report", status: "Completed" },
    { id: 2, title: "Leave Report", status: "Pending" },
    { id: 3, title: "Payroll Report", status: "In Progress" },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTitle && newStatus) {
      setReports([
        ...reports,
        { id: Date.now(), title: newTitle, status: newStatus },
      ]);
      setNewTitle("");
      setNewStatus("");
    }
  };

  const handleEdit = (report) => {
    setEditingId(report.id);
    setEditTitle(report.title);
    setEditStatus(report.status);
  };

  const handleSave = (id) => {
    setReports(
      reports.map((report) =>
        report.id === id
          ? { ...report, title: editTitle, status: editStatus }
          : report
      )
    );
    setEditingId(null);
    setEditTitle("");
    setEditStatus("");
  };

  const handleDelete = (id) => {
    setReports(reports.filter((report) => report.id !== id));
  };

  return (
    <div className="p-6 bg-yellow-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">HR Reports</h2>
      <ul className="mb-4 space-y-2">
        {reports.map((report) => (
          <li
            key={report.id}
            className="flex items-center gap-2 bg-yellow-50 rounded px-3 py-2"
          >
            {editingId === report.id ? (
              <>
                <input
                  className="bg-yellow-50 text-gray-900 border border-gray-400 rounded px-2 py-1 mr-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <select
                  className="bg-yellow-50 text-gray-900 border border-gray-400 rounded px-2 py-1 mr-2"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                </select>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleSave(report.id)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="font-semibold">{report.title}</span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded ${
                    report.status === "Completed"
                      ? "bg-green-200 text-green-800"
                      : report.status === "In Progress"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {report.status}
                </span>
                <button
                  className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded ml-2"
                  onClick={() => handleEdit(report)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded ml-1"
                  onClick={() => handleDelete(report.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form className="flex gap-2" onSubmit={handleAdd}>
        <input
          className="bg-yellow-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
          placeholder="Report Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <select
          className="bg-yellow-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
        <button
          type="submit"
          className="bg-yellow-400 text-white px-3 py-1 rounded font-semibold"
        >
          Add
        </button>
      </form>
    </div>
  );
}

function PermissionsManager() {
  // List of role keys and their display info
  const roles = [
    { key: "admin", name: "Admin", icon: "👑" },
    { key: "hr", name: "HR", icon: "🧑‍💼" },
    { key: "marketing", name: "Marketing", icon: "📈" },
    { key: "blog_writer", name: "Blog Writer", icon: "✍️" },
    { key: "seo_manager", name: "SEO Manager", icon: "🔍" },
    { key: "project_manager", name: "Project Manager", icon: "🗂️" },
    { key: "developer", name: "Developer", icon: "💻" },
    { key: "designer", name: "Designer", icon: "🎨" },
  ];
  const permLabels = [
    { key: "canAdd", label: "Add" },
    { key: "canEdit", label: "Edit" },
    { key: "canDelete", label: "Delete" },
    { key: "canView", label: "View" },
    { key: "canManageUsers", label: "Manage Users" },
    { key: "canManageBlog", label: "Manage Blog" },
    { key: "canManageMarketing", label: "Manage Marketing" },
    { key: "canManageSEO", label: "Manage SEO" },
    { key: "canManageProjects", label: "Manage Projects" },
    { key: "canManageDesign", label: "Manage Design" },
    { key: "canManageDevelopment", label: "Manage Development" },
  ];
  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
        🛡️ Roles & Permissions Matrix
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
            <tr>
              <th className="px-4 py-3 text-left">Role</th>
              {permLabels.map((perm) => (
                <th key={perm.key} className="px-2 py-3 text-center">
                  {perm.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => {
              const perms = getDefaultPermissions(role.key);
              return (
                <tr
                  key={role.key}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="px-4 py-2 font-semibold whitespace-nowrap">
                    {role.icon} {ROLE_METADATA[role.key]?.name || role.name}
                  </td>
                  {permLabels.map((perm) => (
                    <td key={perm.key} className="px-2 py-2 text-center">
                      {perms[perm.key] ? (
                        <span className="text-green-500">✔️</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
        <span className="font-semibold">Admin</span> has all permissions. Others
        have selective ones.
      </p>
    </div>
  );
}

// Add PermissionsManager to the export for use in the dashboard
export function PermissionsManagerBox() {
  return <PermissionsManager />;
}
