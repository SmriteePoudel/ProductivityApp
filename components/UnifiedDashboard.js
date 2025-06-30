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
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "user",
      purpose: "Default role for general usage",
      permissions: [
        "read_own_content",
        "create_content",
        "edit_own_content",
        "delete_own_content",
      ],
      userCount: 0,
      color: "from-blue-500 to-cyan-600",
      icon: "👤",
    },
    {
      id: 2,
      name: "admin",
      purpose: "Full control over everything",
      permissions: [
        "read_all",
        "create_all",
        "edit_all",
        "delete_all",
        "manage_users",
        "manage_roles",
        "manage_permissions",
        "system_settings",
      ],
      userCount: 0,
      color: "from-purple-600 to-pink-600",
      icon: "👑",
    },
    {
      id: 3,
      name: "moderator",
      purpose:
        "Can manage other users' content (edit/delete), but not full admin power",
      permissions: [
        "read_all",
        "create_content",
        "edit_all",
        "delete_all",
        "moderate_content",
        "manage_categories",
      ],
      userCount: 0,
      color: "from-orange-500 to-red-600",
      icon: "🛡️",
    },
    {
      id: 4,
      name: "editor",
      purpose: "Can create and edit content, but cannot manage users",
      permissions: [
        "read_all",
        "create_content",
        "edit_all",
        "delete_own_content",
        "publish_content",
      ],
      userCount: 0,
      color: "from-green-500 to-emerald-600",
      icon: "✏️",
    },
    {
      id: 5,
      name: "viewer",
      purpose: "Read-only access to certain areas",
      permissions: ["read_public", "read_own_content"],
      userCount: 0,
      color: "from-gray-500 to-slate-600",
      icon: "👁️",
    },
  ]);

  const [editingRole, setEditingRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const allPermissions = [
    {
      key: "read_public",
      label: "Read Public Content",
      description: "Can view public content",
      icon: "📖",
    },
    {
      key: "read_own_content",
      label: "Read Own Content",
      description: "Can view their own content",
      icon: "📄",
    },
    {
      key: "read_all",
      label: "Read All Content",
      description: "Can view all content",
      icon: "🔍",
    },
    {
      key: "create_content",
      label: "Create Content",
      description: "Can create new content",
      icon: "➕",
    },
    {
      key: "edit_own_content",
      label: "Edit Own Content",
      description: "Can edit their own content",
      icon: "✏️",
    },
    {
      key: "edit_all",
      label: "Edit All Content",
      description: "Can edit any content",
      icon: "🔄",
    },
    {
      key: "delete_own_content",
      label: "Delete Own Content",
      description: "Can delete their own content",
      icon: "🗑️",
    },
    {
      key: "delete_all",
      label: "Delete All Content",
      description: "Can delete any content",
      icon: "💥",
    },
    {
      key: "publish_content",
      label: "Publish Content",
      description: "Can publish content",
      icon: "📢",
    },
    {
      key: "moderate_content",
      label: "Moderate Content",
      description: "Can moderate user content",
      icon: "⚖️",
    },
    {
      key: "manage_categories",
      label: "Manage Categories",
      description: "Can manage content categories",
      icon: "📂",
    },
    {
      key: "manage_users",
      label: "Manage Users",
      description: "Can manage user accounts",
      icon: "👥",
    },
    {
      key: "manage_roles",
      label: "Manage Roles",
      description: "Can manage user roles",
      icon: "🎭",
    },
    {
      key: "manage_permissions",
      label: "Manage Permissions",
      description: "Can manage system permissions",
      icon: "🔐",
    },
    {
      key: "system_settings",
      label: "System Settings",
      description: "Can access system settings",
      icon: "⚙️",
    },
  ];

  const roleColors = [
    "from-blue-500 to-cyan-600",
    "from-purple-600 to-pink-600",
    "from-orange-500 to-red-600",
    "from-green-500 to-emerald-600",
    "from-gray-500 to-slate-600",
    "from-yellow-500 to-orange-600",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-purple-600",
    "from-teal-500 to-cyan-600",
    "from-red-500 to-pink-600",
  ];

  const roleIcons = [
    "👤",
    "👑",
    "🛡️",
    "✏️",
    "👁️",
    "🔧",
    "📊",
    "🎯",
    "⚡",
    "🌟",
  ];

  const handleAddNewRole = () => {
    const newRole = {
      id: Date.now(), // Generate unique ID
      name: "",
      purpose: "",
      permissions: [],
      userCount: 0,
      color: roleColors[Math.floor(Math.random() * roleColors.length)],
      icon: roleIcons[Math.floor(Math.random() * roleIcons.length)],
    };
    setEditingRole(newRole);
    setIsAdding(true);
    setShowForm(true);
  };

  const handleEdit = (role) => {
    setEditingRole({ ...role });
    setIsAdding(false);
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editingRole.name.trim()) {
      alert("Role name is required!");
      return;
    }

    if (isAdding) {
      // Check if role name already exists
      if (
        roles.some(
          (role) => role.name.toLowerCase() === editingRole.name.toLowerCase()
        )
      ) {
        alert("A role with this name already exists!");
        return;
      }
      // Add new role
      setRoles([...roles, editingRole]);
    } else {
      // Update existing role
      setRoles(roles.map((r) => (r.id === editingRole.id ? editingRole : r)));
    }

    setEditingRole(null);
    setIsAdding(false);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingRole(null);
    setIsAdding(false);
    setShowForm(false);
  };

  const togglePermission = (permissionKey) => {
    if (!editingRole) return;

    const newPermissions = editingRole.permissions.includes(permissionKey)
      ? editingRole.permissions.filter((p) => p !== permissionKey)
      : [...editingRole.permissions, permissionKey];

    setEditingRole({ ...editingRole, permissions: newPermissions });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          🎭 Role Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Manage user roles and their associated permissions to control access
          across your application
        </p>
      </div>

      {/* Add Role Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAddNewRole}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
        >
          <span className="text-xl">➕</span>
          Add New Role
        </button>
      </div>

      {/* Roles List */}
      <div className="grid gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{role.icon || "👤"}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                    {role.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {role.purpose}
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                    {role.userCount} users assigned
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(role)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-md"
                >
                  ✏️ Edit
                </button>
                {role.name !== "admin" && role.name !== "user" && (
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to delete the ${role.name} role?`
                        )
                      ) {
                        setRoles(roles.filter((r) => r.id !== role.id));
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-md"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="text-lg">🔐</span>
                  Permissions ({role.permissions.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => {
                    const permInfo = allPermissions.find(
                      (p) => p.key === permission
                    );
                    return (
                      <span
                        key={permission}
                        className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900 dark:to-emerald-900 dark:text-green-200 rounded-full text-xs font-medium shadow-sm"
                        title={permInfo?.description}
                      >
                        {permInfo?.icon} {permInfo?.label || permission}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {showForm && editingRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{editingRole.icon || "👤"}</span>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {isAdding
                        ? "Create New Role"
                        : `Edit Role: ${editingRole.name}`}
                    </h3>
                    <p className="text-white/90">
                      {isAdding
                        ? "Configure new role permissions and settings"
                        : "Configure role permissions and settings"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={editingRole.name}
                    onChange={(e) =>
                      setEditingRole({ ...editingRole, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none transition-colors"
                    disabled={
                      !isAdding &&
                      (editingRole.name === "admin" ||
                        editingRole.name === "user")
                    }
                    placeholder="Enter role name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Role Icon
                  </label>
                  <input
                    type="text"
                    value={editingRole.icon || ""}
                    onChange={(e) =>
                      setEditingRole({ ...editingRole, icon: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none transition-colors text-center text-2xl"
                    placeholder="🎭"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Purpose
                </label>
                <textarea
                  value={editingRole.purpose}
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, purpose: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  rows="3"
                  placeholder="Describe the purpose of this role..."
                />
              </div>

              {/* Permissions Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Permissions ({editingRole.permissions.length} selected)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  {allPermissions.map((permission) => (
                    <label
                      key={permission.key}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                        editingRole.permissions.includes(permission.key)
                          ? "border-purple-300 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={editingRole.permissions.includes(
                          permission.key
                        )}
                        onChange={() => togglePermission(permission.key)}
                        className="rounded text-purple-600 focus:ring-purple-500 focus:ring-2"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xl">{permission.icon}</span>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-200">
                            {permission.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {permission.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  {isAdding ? "💾 Create Role" : "💾 Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
function PermissionsManager({ user }) {
  const [permissions, setPermissions] = useState({
    read_public: {
      user: true,
      admin: true,
      moderator: true,
      editor: true,
      viewer: true,
    },
    read_own_content: {
      user: true,
      admin: true,
      moderator: true,
      editor: true,
      viewer: true,
    },
    read_all: {
      user: false,
      admin: true,
      moderator: true,
      editor: true,
      viewer: false,
    },
    create_content: {
      user: true,
      admin: true,
      moderator: true,
      editor: true,
      viewer: false,
    },
    edit_own_content: {
      user: true,
      admin: true,
      moderator: true,
      editor: true,
      viewer: false,
    },
    edit_all: {
      user: false,
      admin: true,
      moderator: true,
      editor: true,
      viewer: false,
    },
    delete_own_content: {
      user: true,
      admin: true,
      moderator: true,
      editor: true,
      viewer: false,
    },
    delete_all: {
      user: false,
      admin: true,
      moderator: true,
      editor: false,
      viewer: false,
    },
    publish_content: {
      user: false,
      admin: true,
      moderator: false,
      editor: true,
      viewer: false,
    },
    moderate_content: {
      user: false,
      admin: true,
      moderator: true,
      editor: false,
      viewer: false,
    },
    manage_categories: {
      user: false,
      admin: true,
      moderator: true,
      editor: false,
      viewer: false,
    },
    manage_users: {
      user: false,
      admin: true,
      moderator: false,
      editor: false,
      viewer: false,
    },
    manage_roles: {
      user: false,
      admin: true,
      moderator: false,
      editor: false,
      viewer: false,
    },
    manage_permissions: {
      user: false,
      admin: true,
      moderator: false,
      editor: false,
      viewer: false,
    },
    system_settings: {
      user: false,
      admin: true,
      moderator: false,
      editor: false,
      viewer: false,
    },
  });

  const permissionCategories = [
    {
      name: "Content Access",
      permissions: ["read_public", "read_own_content", "read_all"],
    },
    {
      name: "Content Management",
      permissions: [
        "create_content",
        "edit_own_content",
        "edit_all",
        "delete_own_content",
        "delete_all",
        "publish_content",
      ],
    },
    {
      name: "Moderation",
      permissions: ["moderate_content", "manage_categories"],
    },
    {
      name: "User Management",
      permissions: ["manage_users", "manage_roles", "manage_permissions"],
    },
    {
      name: "System",
      permissions: ["system_settings"],
    },
  ];

  const permissionLabels = {
    read_public: "Read Public Content",
    read_own_content: "Read Own Content",
    read_all: "Read All Content",
    create_content: "Create Content",
    edit_own_content: "Edit Own Content",
    edit_all: "Edit All Content",
    delete_own_content: "Delete Own Content",
    delete_all: "Delete All Content",
    publish_content: "Publish Content",
    moderate_content: "Moderate Content",
    manage_categories: "Manage Categories",
    manage_users: "Manage Users",
    manage_roles: "Manage Roles",
    manage_permissions: "Manage Permissions",
    system_settings: "System Settings",
  };

  const roles = ["user", "admin", "moderator", "editor", "viewer"];

  const savePermissions = (newPerms) => {
    setPermissions(newPerms);
    // In a real app, you'd save to backend here
    console.log("Permissions updated:", newPerms);
  };

  const handleToggle = (perm, role) => {
    const newPerms = {
      ...permissions,
      [perm]: {
        ...permissions[perm],
        [role]: !permissions[perm][role],
      },
    };
    savePermissions(newPerms);
  };

  const resetToDefaults = () => {
    const defaultPermissions = {
      read_public: {
        user: true,
        admin: true,
        moderator: true,
        editor: true,
        viewer: true,
      },
      read_own_content: {
        user: true,
        admin: true,
        moderator: true,
        editor: true,
        viewer: true,
      },
      read_all: {
        user: false,
        admin: true,
        moderator: true,
        editor: true,
        viewer: false,
      },
      create_content: {
        user: true,
        admin: true,
        moderator: true,
        editor: true,
        viewer: false,
      },
      edit_own_content: {
        user: true,
        admin: true,
        moderator: true,
        editor: true,
        viewer: false,
      },
      edit_all: {
        user: false,
        admin: true,
        moderator: true,
        editor: true,
        viewer: false,
      },
      delete_own_content: {
        user: true,
        admin: true,
        moderator: true,
        editor: true,
        viewer: false,
      },
      delete_all: {
        user: false,
        admin: true,
        moderator: true,
        editor: false,
        viewer: false,
      },
      publish_content: {
        user: false,
        admin: true,
        moderator: false,
        editor: true,
        viewer: false,
      },
      moderate_content: {
        user: false,
        admin: true,
        moderator: true,
        editor: false,
        viewer: false,
      },
      manage_categories: {
        user: false,
        admin: true,
        moderator: true,
        editor: false,
        viewer: false,
      },
      manage_users: {
        user: false,
        admin: true,
        moderator: false,
        editor: false,
        viewer: false,
      },
      manage_roles: {
        user: false,
        admin: true,
        moderator: false,
        editor: false,
        viewer: false,
      },
      manage_permissions: {
        user: false,
        admin: true,
        moderator: false,
        editor: false,
        viewer: false,
      },
      system_settings: {
        user: false,
        admin: true,
        moderator: false,
        editor: false,
        viewer: false,
      },
    };
    savePermissions(defaultPermissions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Permission Management
        </h2>
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-6 gap-4 items-center">
            <div className="col-span-2">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Permission
              </h3>
            </div>
            {roles.map((role) => (
              <div key={role} className="text-center">
                <span className="font-medium text-gray-700 dark:text-gray-300 capitalize text-sm">
                  {role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Categories */}
        {permissionCategories.map((category) => (
          <div key={category.name}>
            <div className="bg-gray-100 dark:bg-gray-600 px-6 py-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                {category.name}
              </h4>
            </div>
            {category.permissions.map((permission) => (
              <div
                key={permission}
                className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-2">
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {permissionLabels[permission]}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {permission}
                    </div>
                  </div>
                  {roles.map((role) => (
                    <div key={role} className="text-center">
                      <label className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={permissions[permission][role]}
                          onChange={() => handleToggle(permission, role)}
                          className="rounded text-accent focus:ring-accent"
                          disabled={user.role !== "admin"}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          Role Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          {roles.map((role) => {
            const rolePermissions = Object.values(permissions).filter(
              (perm) => perm[role]
            ).length;
            const totalPermissions = Object.keys(permissions).length;
            return (
              <div key={role} className="text-center">
                <div className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {role}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {rolePermissions}/{totalPermissions} permissions
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Add ProjectManager component
// ProjectManager component is now imported from ./ProjectManager.js

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
        {
          key: "user-management",
          label: "User Management",
          icon: "👥",
          isDropdown: true,
          children: [
            { key: "users", label: "Users", icon: "👤" },
            { key: "roles", label: "Roles", icon: "🛡️" },
            { key: "permissions", label: "Permissions", icon: "🔑" },
          ],
        },
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
                  ? "bg-accent/20 text-accent"
                  : "text-gray-200 hover:bg-accent/10 hover:text-accent"
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
              <div className="ml-4 mt-1 border-l border-accent pl-2">
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
            <EditableSEOKeywordsBox />
          </>
        ),
        rankings: (
          <>
            <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">Search Rankings</h2>
              <p>Ranking tracking</p>
            </div>
            <EditableSEORankingsBox />
          </>
        ),
        content: (
          <>
            <div className="p-6 bg-gradient-to-br from-pink-100 to-pink-200 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">SEO Content</h2>
              <p>SEO-optimized content</p>
            </div>
            <EditableSEOContentBox />
          </>
        ),
        analytics: (
          <>
            <div className="p-6 bg-gradient-to-br from-cyan-100 to-blue-200 text-gray-900 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">SEO Analytics</h2>
              <p>SEO performance metrics</p>
            </div>
            <EditableSEOInfoBox />
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
            <EditableTeamInfoBox />
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
            <EditableTimelineInfoBox />
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
            <EditableResourceInfoBox />
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
            <EditableReportInfoBox />
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
            <EditableDeploymentInfoBox />
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
            <EditableDevDocsBox />
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
      <UserManager
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUserUpdate={() => setRefreshKey((k) => k + 1)}
      />
    );
  } else if (activeSection === "roles" && user.role === "admin") {
    mainContent = <RolesManager />;
  } else if (activeSection === "permissions") {
    mainContent = <PermissionsManager user={user} />;
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
        <nav className="flex-1 py-4 overflow-y-auto">{renderNav(nav)}</nav>
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

function EditableAnalyticsBox() {
  const [analytics, setAnalytics] = useState([
    { id: 1, label: "Leads Generated", value: 320 },
    { id: 2, label: "Cost per Lead", value: "$7.50" },
    { id: 3, label: "CTR", value: "4.2%" },
  ]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editValue, setEditValue] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newLabel && newValue) {
      setAnalytics([
        ...analytics,
        { id: Date.now(), label: newLabel, value: newValue },
      ]);
      setNewLabel("");
      setNewValue("");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditValue(item.value);
  };

  const handleSave = (id) => {
    setAnalytics(
      analytics.map((item) =>
        item.id === id ? { ...item, label: editLabel, value: editValue } : item
      )
    );
    setEditingId(null);
    setEditLabel("");
    setEditValue("");
  };

  const handleDelete = (id) => {
    setAnalytics(analytics.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 bg-blue-200 text-gray-900 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span role="img" aria-label="Chart">
          📈
        </span>{" "}
        Campaign Analytics (Editable)
      </h3>
      {/* Dummy Chart Placeholder */}
      <div className="bg-blue-100 rounded-lg p-4 mb-4 flex items-center justify-center">
        <span className="text-gray-500 text-lg">[Chart Placeholder]</span>
      </div>
      <ul className="mb-4 space-y-2">
        {analytics.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            {editingId === item.id ? (
              <>
                <input
                  className="bg-blue-900 text-white border border-white rounded px-2 py-1 mr-2"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                />
                <input
                  className="bg-blue-900 text-white border border-white rounded px-2 py-1 mr-2"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleSave(item.id)}
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
                <span className="font-semibold">{item.label}:</span>
                <span className="ml-1">{item.value}</span>
                <button
                  className="bg-yellow-400 text-blue-900 px-2 py-1 rounded ml-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded ml-1"
                  onClick={() => handleDelete(item.id)}
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
          className="bg-blue-900 text-white border border-white rounded px-2 py-1"
          placeholder="Metric Label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <input
          className="bg-blue-900 text-white border border-white rounded px-2 py-1"
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-3 py-1 rounded font-semibold"
        >
          Add
        </button>
      </form>
    </div>
  );
}

// Update the EditableContentManagementBox to use a different pastel color (green)
function EditableContentManagementBox() {
  const [items, setItems] = useState([
    { id: 1, title: "YouTube Video: Product Demo", status: "Draft" },
    { id: 2, title: "Newsletter: April Edition", status: "Scheduled" },
    { id: 3, title: "LinkedIn Post: Company Milestone", status: "Published" },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTitle && newStatus) {
      setItems([
        ...items,
        { id: Date.now(), title: newTitle, status: newStatus },
      ]);
      setNewTitle("");
      setNewStatus("");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditStatus(item.status);
  };

  const handleSave = (id) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, title: editTitle, status: editStatus }
          : item
      )
    );
    setEditingId(null);
    setEditTitle("");
    setEditStatus("");
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 bg-green-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Content List</h2>
      <ul className="mb-4 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            {editingId === item.id ? (
              <>
                <input
                  className="bg-green-50 text-gray-900 border border-gray-400 rounded px-2 py-1 mr-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  className="bg-green-50 text-gray-900 border border-gray-400 rounded px-2 py-1 mr-2"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleSave(item.id)}
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
                <span className="font-semibold">{item.title}</span>
                <span className="ml-2 text-xs bg-green-200 px-2 py-0.5 rounded">
                  {item.status}
                </span>
                <button
                  className="bg-yellow-400 text-green-900 px-2 py-1 rounded ml-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded ml-1"
                  onClick={() => handleDelete(item.id)}
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
          className="bg-green-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
          placeholder="Content Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          className="bg-green-50 text-gray-900 border border-gray-400 rounded px-2 py-1"
          placeholder="Status (e.g. Draft, Published)"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-3 py-1 rounded font-semibold"
        >
          Add
        </button>
      </form>
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

// ... existing code ...
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
// ... existing code ...

function RevenueForecastBox() {
  const [forecasts, setForecasts] = useState([
    {
      id: 1,
      quarter: "Q1 2024",
      revenue: 250000,
      growth: 15,
      confidence: "High",
      notes: "Expected growth in SaaS subscriptions",
    },
    {
      id: 2,
      quarter: "Q2 2024",
      revenue: 287500,
      growth: 12,
      confidence: "Medium",
      notes: "New product launch impact",
    },
    {
      id: 3,
      quarter: "Q3 2024",
      revenue: 315000,
      growth: 8,
      confidence: "Medium",
      notes: "Seasonal adjustment considered",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [newForecast, setNewForecast] = useState({
    quarter: "",
    revenue: "",
    growth: "",
    confidence: "Medium",
    notes: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newForecast.quarter || !newForecast.revenue) return;

    const forecast = {
      id: Date.now(),
      ...newForecast,
    };

    setForecasts([...forecasts, forecast]);
    setNewForecast({
      quarter: "",
      revenue: "",
      growth: "",
      confidence: "Medium",
      notes: "",
    });
  };

  const handleEdit = (forecast) => {
    setEditingId(forecast.id);
  };

  const handleSave = (id) => {
    setForecasts(
      forecasts.map((f) =>
        f.id === id
          ? {
              ...f,
              quarter: document.getElementById(`forecast-quarter-${id}`).value,
              revenue: Number(
                document.getElementById(`forecast-revenue-${id}`).value
              ),
              growth: Number(
                document.getElementById(`forecast-growth-${id}`).value
              ),
              confidence: document.getElementById(`forecast-confidence-${id}`)
                .value,
              notes: document.getElementById(`forecast-notes-${id}`).value,
            }
          : f
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setForecasts(forecasts.filter((f) => f.id !== id));
  };

  const inputClasses =
    "w-full p-2 rounded border border-[#B8F3B8] focus:outline-none focus:border-[#7FE37F] text-black placeholder-gray-500";
  const editInputClasses =
    "w-full p-1 rounded border border-[#B8F3B8] text-black";

  return (
    <div className="bg-gradient-to-br from-[#E6FFE6] to-[#F0FFF0] p-6 rounded-lg shadow-md border border-[#B8F3B8]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Revenue Forecasts
      </h3>
      <form onSubmit={handleAdd} className="mb-4 space-y-2">
        <input
          type="text"
          value={newForecast.quarter}
          onChange={(e) =>
            setNewForecast({ ...newForecast, quarter: e.target.value })
          }
          placeholder="Quarter (e.g., Q1 2024)"
          className={inputClasses}
        />
        <input
          type="number"
          value={newForecast.revenue}
          onChange={(e) =>
            setNewForecast({ ...newForecast, revenue: e.target.value })
          }
          placeholder="Revenue Forecast"
          className={inputClasses}
        />
        <input
          type="number"
          value={newForecast.growth}
          onChange={(e) =>
            setNewForecast({ ...newForecast, growth: e.target.value })
          }
          placeholder="Growth % Expected"
          className={inputClasses}
        />
        <select
          value={newForecast.confidence}
          onChange={(e) =>
            setNewForecast({ ...newForecast, confidence: e.target.value })
          }
          className={inputClasses}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <input
          type="text"
          value={newForecast.notes}
          onChange={(e) =>
            setNewForecast({ ...newForecast, notes: e.target.value })
          }
          placeholder="Notes"
          className={inputClasses}
        />
        <button
          type="submit"
          className="w-full bg-[#7FE37F] text-white p-2 rounded hover:bg-[#5AD35A] transition-colors"
        >
          Add Forecast
        </button>
      </form>
      <div className="space-y-3">
        {forecasts.map((forecast) => (
          <div
            key={forecast.id}
            className="flex items-center justify-between bg-white/60 p-3 rounded border border-[#B8F3B8]"
          >
            {editingId === forecast.id ? (
              <div className="flex-1 space-y-2">
                <input
                  id={`forecast-quarter-${forecast.id}`}
                  type="text"
                  defaultValue={forecast.quarter}
                  className={editInputClasses}
                />
                <input
                  id={`forecast-revenue-${forecast.id}`}
                  type="number"
                  defaultValue={forecast.revenue}
                  className={editInputClasses}
                />
                <input
                  id={`forecast-growth-${forecast.id}`}
                  type="number"
                  defaultValue={forecast.growth}
                  className={editInputClasses}
                />
                <select
                  id={`forecast-confidence-${forecast.id}`}
                  defaultValue={forecast.confidence}
                  className={editInputClasses}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <input
                  id={`forecast-notes-${forecast.id}`}
                  type="text"
                  defaultValue={forecast.notes}
                  className={editInputClasses}
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="font-medium text-black">{forecast.quarter}</div>
                <div className="text-sm text-black">
                  Revenue: ${forecast.revenue.toLocaleString()} | Growth:{" "}
                  {forecast.growth}%
                </div>
                <div className="text-sm text-black">
                  Confidence: {forecast.confidence}
                </div>
                <div className="text-sm text-black">
                  Notes: {forecast.notes}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === forecast.id ? (
                <button
                  onClick={() => handleSave(forecast.id)}
                  className="text-[#7FE37F] hover:text-[#5AD35A]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(forecast)}
                  className="text-[#7FE37F] hover:text-[#5AD35A]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(forecast.id)}
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

function ExpenseForecastBox() {
  const [forecasts, setForecasts] = useState([
    {
      id: 1,
      category: "Operating Expenses",
      quarter: "Q1 2024",
      amount: 180000,
      trend: "Stable",
      notes: "Regular operational costs",
    },
    {
      id: 2,
      category: "Marketing",
      quarter: "Q1 2024",
      amount: 45000,
      trend: "Increasing",
      notes: "New campaign planned",
    },
    {
      id: 3,
      category: "R&D",
      quarter: "Q1 2024",
      amount: 75000,
      trend: "Increasing",
      notes: "Product innovation investment",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [newForecast, setNewForecast] = useState({
    category: "",
    quarter: "",
    amount: "",
    trend: "Stable",
    notes: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newForecast.category || !newForecast.quarter || !newForecast.amount)
      return;

    const forecast = {
      id: Date.now(),
      ...newForecast,
    };

    setForecasts([...forecasts, forecast]);
    setNewForecast({
      category: "",
      quarter: "",
      amount: "",
      trend: "Stable",
      notes: "",
    });
  };

  const handleEdit = (forecast) => {
    setEditingId(forecast.id);
  };

  const handleSave = (id) => {
    setForecasts(
      forecasts.map((f) =>
        f.id === id
          ? {
              ...f,
              category: document.getElementById(`expense-category-${id}`).value,
              quarter: document.getElementById(`expense-quarter-${id}`).value,
              amount: Number(
                document.getElementById(`expense-amount-${id}`).value
              ),
              trend: document.getElementById(`expense-trend-${id}`).value,
              notes: document.getElementById(`expense-notes-${id}`).value,
            }
          : f
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setForecasts(forecasts.filter((f) => f.id !== id));
  };

  return (
    <div className="bg-gradient-to-br from-[#E6E6FF] to-[#F0F0FF] p-6 rounded-lg shadow-md border border-[#B8B8F3] mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Expense Forecasts
      </h3>
      <form onSubmit={handleAdd} className="mb-4 space-y-2">
        <input
          type="text"
          value={newForecast.category}
          onChange={(e) =>
            setNewForecast({ ...newForecast, category: e.target.value })
          }
          placeholder="Expense Category"
          className="w-full p-2 rounded border border-[#B8B8F3] focus:outline-none focus:border-[#7F7FE3]"
        />
        <input
          type="text"
          value={newForecast.quarter}
          onChange={(e) =>
            setNewForecast({ ...newForecast, quarter: e.target.value })
          }
          placeholder="Quarter (e.g., Q1 2024)"
          className="w-full p-2 rounded border border-[#B8B8F3] focus:outline-none focus:border-[#7F7FE3]"
        />
        <input
          type="number"
          value={newForecast.amount}
          onChange={(e) =>
            setNewForecast({ ...newForecast, amount: e.target.value })
          }
          placeholder="Amount"
          className="w-full p-2 rounded border border-[#B8B8F3] focus:outline-none focus:border-[#7F7FE3]"
        />
        <select
          value={newForecast.trend}
          onChange={(e) =>
            setNewForecast({ ...newForecast, trend: e.target.value })
          }
          className="w-full p-2 rounded border border-[#B8B8F3] focus:outline-none focus:border-[#7F7FE3]"
        >
          <option>Increasing</option>
          <option>Stable</option>
          <option>Decreasing</option>
        </select>
        <input
          type="text"
          value={newForecast.notes}
          onChange={(e) =>
            setNewForecast({ ...newForecast, notes: e.target.value })
          }
          placeholder="Notes"
          className="w-full p-2 rounded border border-[#B8B8F3] focus:outline-none focus:border-[#7F7FE3]"
        />
        <button
          type="submit"
          className="w-full bg-[#7F7FE3] text-white p-2 rounded hover:bg-[#5A5AD3] transition-colors"
        >
          Add Forecast
        </button>
      </form>
      <div className="space-y-3">
        {forecasts.map((forecast) => (
          <div
            key={forecast.id}
            className="flex items-center justify-between bg-white/60 p-3 rounded border border-[#B8B8F3]"
          >
            {editingId === forecast.id ? (
              <div className="flex-1 space-y-2">
                <input
                  id={`expense-category-${forecast.id}`}
                  type="text"
                  defaultValue={forecast.category}
                  className="w-full p-1 rounded border border-[#B8B8F3]"
                />
                <input
                  id={`expense-quarter-${forecast.id}`}
                  type="text"
                  defaultValue={forecast.quarter}
                  className="w-full p-1 rounded border border-[#B8B8F3]"
                />
                <input
                  id={`expense-amount-${forecast.id}`}
                  type="number"
                  defaultValue={forecast.amount}
                  className="w-full p-1 rounded border border-[#B8B8F3]"
                />
                <select
                  id={`expense-trend-${forecast.id}`}
                  defaultValue={forecast.trend}
                  className="w-full p-1 rounded border border-[#B8B8F3]"
                >
                  <option>Increasing</option>
                  <option>Stable</option>
                  <option>Decreasing</option>
                </select>
                <input
                  id={`expense-notes-${forecast.id}`}
                  type="text"
                  defaultValue={forecast.notes}
                  className="w-full p-1 rounded border border-[#B8B8F3]"
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  {forecast.category}
                </div>
                <div className="text-sm text-gray-600">
                  Quarter: {forecast.quarter} | Amount: $
                  {forecast.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Trend: {forecast.trend}
                </div>
                <div className="text-sm text-gray-600">
                  Notes: {forecast.notes}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === forecast.id ? (
                <button
                  onClick={() => handleSave(forecast.id)}
                  className="text-[#7F7FE3] hover:text-[#5A5AD3]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(forecast)}
                  className="text-[#7F7FE3] hover:text-[#5A5AD3]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(forecast.id)}
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

function ExpenseBudgetBox() {
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      category: "Marketing",
      allocated: 45000,
      spent: 38000,
      remaining: 7000,
      status: "On Track",
      notes: "Q1 digital marketing campaigns",
    },
    {
      id: 2,
      category: "Operations",
      allocated: 75000,
      spent: 65000,
      remaining: 10000,
      status: "Under Budget",
      notes: "Office maintenance and supplies",
    },
    {
      id: 3,
      category: "R&D",
      allocated: 120000,
      spent: 125000,
      remaining: -5000,
      status: "Over Budget",
      notes: "New product development phase",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newBudget, setNewBudget] = useState({
    category: "",
    allocated: "",
    spent: "",
    remaining: "",
    status: "On Track",
    notes: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newBudget.category || !newBudget.allocated) return;

    const budget = {
      id: Date.now(),
      ...newBudget,
      remaining: Number(newBudget.allocated) - Number(newBudget.spent || 0),
    };

    setBudgets([...budgets, budget]);
    setNewBudget({
      category: "",
      allocated: "",
      spent: "",
      remaining: "",
      status: "On Track",
      notes: "",
    });
  };

  const handleEdit = (budget) => {
    setEditingId(budget.id);
  };

  const handleSave = (id) => {
    setBudgets(
      budgets.map((b) =>
        b.id === id
          ? {
              ...b,
              category: document.getElementById(`budget-category-${id}`).value,
              allocated: Number(
                document.getElementById(`budget-allocated-${id}`).value
              ),
              spent: Number(
                document.getElementById(`budget-spent-${id}`).value
              ),
              remaining:
                Number(
                  document.getElementById(`budget-allocated-${id}`).value
                ) - Number(document.getElementById(`budget-spent-${id}`).value),
              status: document.getElementById(`budget-status-${id}`).value,
              notes: document.getElementById(`budget-notes-${id}`).value,
            }
          : b
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setBudgets(budgets.filter((b) => b.id !== id));
  };

  const inputClasses =
    "w-full p-2 rounded border border-[#B8B8F3] focus:outline-none focus:border-[#7F7FE3] text-black placeholder-gray-500";
  const editInputClasses =
    "w-full p-1 rounded border border-[#B8B8F3] text-black";

  return (
    <div className="bg-gradient-to-br from-[#E6E6FF] to-[#F0F0FF] p-6 rounded-lg shadow-md border border-[#B8B8F3]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Expense Budgets
      </h3>
      <form onSubmit={handleAdd} className="mb-4 space-y-2">
        <input
          type="text"
          value={newBudget.category}
          onChange={(e) =>
            setNewBudget({ ...newBudget, category: e.target.value })
          }
          placeholder="Budget Category"
          className={inputClasses}
        />
        <input
          type="number"
          value={newBudget.allocated}
          onChange={(e) =>
            setNewBudget({ ...newBudget, allocated: e.target.value })
          }
          placeholder="Allocated Budget"
          className={inputClasses}
        />
        <input
          type="number"
          value={newBudget.spent}
          onChange={(e) =>
            setNewBudget({ ...newBudget, spent: e.target.value })
          }
          placeholder="Amount Spent"
          className={inputClasses}
        />
        <select
          value={newBudget.status}
          onChange={(e) =>
            setNewBudget({ ...newBudget, status: e.target.value })
          }
          className={inputClasses}
        >
          <option>On Track</option>
          <option>Under Budget</option>
          <option>Over Budget</option>
        </select>
        <input
          type="text"
          value={newBudget.notes}
          onChange={(e) =>
            setNewBudget({ ...newBudget, notes: e.target.value })
          }
          placeholder="Notes"
          className={inputClasses}
        />
        <button
          type="submit"
          className="w-full bg-[#7F7FE3] text-white p-2 rounded hover:bg-[#5A5AD3] transition-colors"
        >
          Add Budget
        </button>
      </form>
      <div className="space-y-3">
        {budgets.map((budget) => (
          <div
            key={budget.id}
            className="flex items-center justify-between bg-white/60 p-3 rounded border border-[#B8B8F3]"
          >
            {editingId === budget.id ? (
              <div className="flex-1 space-y-2">
                <input
                  id={`budget-category-${budget.id}`}
                  type="text"
                  defaultValue={budget.category}
                  className={editInputClasses}
                />
                <input
                  id={`budget-allocated-${budget.id}`}
                  type="number"
                  defaultValue={budget.allocated}
                  className={editInputClasses}
                />
                <input
                  id={`budget-spent-${budget.id}`}
                  type="number"
                  defaultValue={budget.spent}
                  className={editInputClasses}
                />
                <select
                  id={`budget-status-${budget.id}`}
                  defaultValue={budget.status}
                  className={editInputClasses}
                >
                  <option>On Track</option>
                  <option>Under Budget</option>
                  <option>Over Budget</option>
                </select>
                <input
                  id={`budget-notes-${budget.id}`}
                  type="text"
                  defaultValue={budget.notes}
                  className={editInputClasses}
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="font-medium text-black">{budget.category}</div>
                <div className="text-sm text-black">
                  Allocated: ${budget.allocated.toLocaleString()} | Spent: $
                  {budget.spent.toLocaleString()}
                </div>
                <div className="text-sm text-black">
                  Remaining: ${budget.remaining.toLocaleString()} | Status:{" "}
                  {budget.status}
                </div>
                <div className="text-sm text-black">Notes: {budget.notes}</div>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === budget.id ? (
                <button
                  onClick={() => handleSave(budget.id)}
                  className="text-[#7F7FE3] hover:text-[#5A5AD3]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(budget)}
                  className="text-[#7F7FE3] hover:text-[#5A5AD3]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(budget.id)}
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

function FinancialReportBox() {
  const [reports, setReports] = useState([
    {
      id: 1,
      period: "January 2024",
      revenue: 320000,
      expenses: 280000,
      profit: 40000,
      margin: 12.5,
      highlights: "Strong SaaS revenue growth",
    },
    {
      id: 2,
      period: "February 2024",
      revenue: 350000,
      expenses: 295000,
      profit: 55000,
      margin: 15.7,
      highlights: "Cost optimization initiatives successful",
    },
    {
      id: 3,
      period: "March 2024",
      revenue: 380000,
      expenses: 310000,
      profit: 70000,
      margin: 18.4,
      highlights: "New market expansion impact",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newReport, setNewReport] = useState({
    period: "",
    revenue: "",
    expenses: "",
    profit: "",
    margin: "",
    highlights: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newReport.period || !newReport.revenue || !newReport.expenses) return;

    const profit = Number(newReport.revenue) - Number(newReport.expenses);
    const margin = (profit / Number(newReport.revenue)) * 100;

    const report = {
      id: Date.now(),
      ...newReport,
      profit,
      margin: Number(margin.toFixed(1)),
    };

    setReports([...reports, report]);
    setNewReport({
      period: "",
      revenue: "",
      expenses: "",
      profit: "",
      margin: "",
      highlights: "",
    });
  };

  const handleEdit = (report) => {
    setEditingId(report.id);
  };

  const handleSave = (id) => {
    setReports(
      reports.map((r) => {
        if (r.id === id) {
          const revenue = Number(
            document.getElementById(`report-revenue-${id}`).value
          );
          const expenses = Number(
            document.getElementById(`report-expenses-${id}`).value
          );
          const profit = revenue - expenses;
          const margin = (profit / revenue) * 100;

          return {
            ...r,
            period: document.getElementById(`report-period-${id}`).value,
            revenue,
            expenses,
            profit,
            margin: Number(margin.toFixed(1)),
            highlights: document.getElementById(`report-highlights-${id}`)
              .value,
          };
        }
        return r;
      })
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const inputClasses =
    "w-full p-2 rounded border border-[#F3B8F3] focus:outline-none focus:border-[#E37FE3] text-black placeholder-gray-500";
  const editInputClasses =
    "w-full p-1 rounded border border-[#F3B8F3] text-black";

  return (
    <div className="bg-gradient-to-br from-[#FFE6FF] to-[#FFF0FF] p-6 rounded-lg shadow-md border border-[#F3B8F3]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Financial Reports
      </h3>
      <form onSubmit={handleAdd} className="mb-4 space-y-2">
        <input
          type="text"
          value={newReport.period}
          onChange={(e) =>
            setNewReport({ ...newReport, period: e.target.value })
          }
          placeholder="Period (e.g., January 2024)"
          className={inputClasses}
        />
        <input
          type="number"
          value={newReport.revenue}
          onChange={(e) =>
            setNewReport({ ...newReport, revenue: e.target.value })
          }
          placeholder="Total Revenue"
          className={inputClasses}
        />
        <input
          type="number"
          value={newReport.expenses}
          onChange={(e) =>
            setNewReport({ ...newReport, expenses: e.target.value })
          }
          placeholder="Total Expenses"
          className={inputClasses}
        />
        <input
          type="text"
          value={newReport.highlights}
          onChange={(e) =>
            setNewReport({ ...newReport, highlights: e.target.value })
          }
          placeholder="Key Highlights"
          className={inputClasses}
        />
        <button
          type="submit"
          className="w-full bg-[#E37FE3] text-white p-2 rounded hover:bg-[#D35AD3] transition-colors"
        >
          Add Report
        </button>
      </form>
      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between bg-white/60 p-3 rounded border border-[#F3B8F3]"
          >
            {editingId === report.id ? (
              <div className="flex-1 space-y-2">
                <input
                  id={`report-period-${report.id}`}
                  type="text"
                  defaultValue={report.period}
                  className={editInputClasses}
                />
                <input
                  id={`report-revenue-${report.id}`}
                  type="number"
                  defaultValue={report.revenue}
                  className={editInputClasses}
                />
                <input
                  id={`report-expenses-${report.id}`}
                  type="number"
                  defaultValue={report.expenses}
                  className={editInputClasses}
                />
                <input
                  id={`report-highlights-${report.id}`}
                  type="text"
                  defaultValue={report.highlights}
                  className={editInputClasses}
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="font-medium text-black">{report.period}</div>
                <div className="text-sm text-black">
                  Revenue: ${report.revenue.toLocaleString()} | Expenses: $
                  {report.expenses.toLocaleString()}
                </div>
                <div className="text-sm text-black">
                  Profit: ${report.profit.toLocaleString()} | Margin:{" "}
                  {report.margin}%
                </div>
                <div className="text-sm text-black">
                  Highlights: {report.highlights}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === report.id ? (
                <button
                  onClick={() => handleSave(report.id)}
                  className="text-[#E37FE3] hover:text-[#D35AD3]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(report)}
                  className="text-[#E37FE3] hover:text-[#D35AD3]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(report.id)}
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

function TeamManagementBox() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Frontend Team",
      members: 5,
      lead: "Sarah Johnson",
      projects: 3,
      status: "Active",
      notes: "Working on UI/UX improvements",
    },
    {
      id: 2,
      name: "Backend Team",
      members: 4,
      lead: "Michael Chen",
      projects: 2,
      status: "Active",
      notes: "API development and optimization",
    },
    {
      id: 3,
      name: "QA Team",
      members: 3,
      lead: "Emily Rodriguez",
      projects: 4,
      status: "Active",
      notes: "Testing new features",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: "",
    members: "",
    lead: "",
    projects: "",
    status: "Active",
    notes: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.lead) return;

    const team = {
      id: Date.now(),
      ...newTeam,
    };

    setTeams([...teams, team]);
    setNewTeam({
      name: "",
      members: "",
      lead: "",
      projects: "",
      status: "Active",
      notes: "",
    });
  };

  const handleEdit = (team) => {
    setEditingId(team.id);
  };

  const handleSave = (id) => {
    setTeams(
      teams.map((t) =>
        t.id === id
          ? {
              ...t,
              name: document.getElementById(`team-name-${id}`).value,
              members: Number(
                document.getElementById(`team-members-${id}`).value
              ),
              lead: document.getElementById(`team-lead-${id}`).value,
              projects: Number(
                document.getElementById(`team-projects-${id}`).value
              ),
              status: document.getElementById(`team-status-${id}`).value,
              notes: document.getElementById(`team-notes-${id}`).value,
            }
          : t
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setTeams(teams.filter((t) => t.id !== id));
  };

  const inputClasses =
    "w-full p-2 rounded border border-[#B8E3F3] focus:outline-none focus:border-[#7FCAE3] text-black placeholder-gray-500";
  const editInputClasses =
    "w-full p-1 rounded border border-[#B8E3F3] text-black";

  return (
    <div className="bg-gradient-to-br from-[#E6F5FF] to-[#F0FAFF] p-6 rounded-lg shadow-md border border-[#B8E3F3]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Team Management
      </h3>
      <form onSubmit={handleAdd} className="mb-4 space-y-2">
        <input
          type="text"
          value={newTeam.name}
          onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
          placeholder="Team Name"
          className={inputClasses}
        />
        <input
          type="number"
          value={newTeam.members}
          onChange={(e) => setNewTeam({ ...newTeam, members: e.target.value })}
          placeholder="Number of Members"
          className={inputClasses}
        />
        <input
          type="text"
          value={newTeam.lead}
          onChange={(e) => setNewTeam({ ...newTeam, lead: e.target.value })}
          placeholder="Team Lead"
          className={inputClasses}
        />
        <input
          type="number"
          value={newTeam.projects}
          onChange={(e) => setNewTeam({ ...newTeam, projects: e.target.value })}
          placeholder="Number of Projects"
          className={inputClasses}
        />
        <select
          value={newTeam.status}
          onChange={(e) => setNewTeam({ ...newTeam, status: e.target.value })}
          className={inputClasses}
        >
          <option>Active</option>
          <option>On Hold</option>
          <option>Completed</option>
        </select>
        <input
          type="text"
          value={newTeam.notes}
          onChange={(e) => setNewTeam({ ...newTeam, notes: e.target.value })}
          placeholder="Notes"
          className={inputClasses}
        />
        <button
          type="submit"
          className="w-full bg-[#7FCAE3] text-white p-2 rounded hover:bg-[#5AB7D3] transition-colors"
        >
          Add Team
        </button>
      </form>
      <div className="space-y-3">
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-between bg-white/60 p-3 rounded border border-[#B8E3F3]"
          >
            {editingId === team.id ? (
              <div className="flex-1 space-y-2">
                <input
                  id={`team-name-${team.id}`}
                  type="text"
                  defaultValue={team.name}
                  className={editInputClasses}
                />
                <input
                  id={`team-members-${team.id}`}
                  type="number"
                  defaultValue={team.members}
                  className={editInputClasses}
                />
                <input
                  id={`team-lead-${team.id}`}
                  type="text"
                  defaultValue={team.lead}
                  className={editInputClasses}
                />
                <input
                  id={`team-projects-${team.id}`}
                  type="number"
                  defaultValue={team.projects}
                  className={editInputClasses}
                />
                <select
                  id={`team-status-${team.id}`}
                  defaultValue={team.status}
                  className={editInputClasses}
                >
                  <option>Active</option>
                  <option>On Hold</option>
                  <option>Completed</option>
                </select>
                <input
                  id={`team-notes-${team.id}`}
                  type="text"
                  defaultValue={team.notes}
                  className={editInputClasses}
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="font-medium text-black">{team.name}</div>
                <div className="text-sm text-black">
                  Members: {team.members} | Lead: {team.lead}
                </div>
                <div className="text-sm text-black">
                  Projects: {team.projects} | Status: {team.status}
                </div>
                <div className="text-sm text-black">Notes: {team.notes}</div>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === team.id ? (
                <button
                  onClick={() => handleSave(team.id)}
                  className="text-[#7FCAE3] hover:text-[#5AB7D3]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(team)}
                  className="text-[#7FCAE3] hover:text-[#5AB7D3]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(team.id)}
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

function ProjectTimelineBox() {
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      phase: "Planning",
      startDate: "2024-03-01",
      endDate: "2024-03-15",
      progress: 100,
      status: "Completed",
      deliverables: "Project scope and requirements",
    },
    {
      id: 2,
      phase: "Design",
      startDate: "2024-03-16",
      endDate: "2024-03-31",
      progress: 75,
      status: "In Progress",
      deliverables: "UI/UX mockups and prototypes",
    },
    {
      id: 3,
      phase: "Development",
      startDate: "2024-04-01",
      endDate: "2024-04-30",
      progress: 25,
      status: "In Progress",
      deliverables: "Core functionality implementation",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newMilestone, setNewMilestone] = useState({
    phase: "",
    startDate: "",
    endDate: "",
    progress: "",
    status: "Not Started",
    deliverables: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newMilestone.phase || !newMilestone.startDate || !newMilestone.endDate)
      return;

    const milestone = {
      id: Date.now(),
      ...newMilestone,
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({
      phase: "",
      startDate: "",
      endDate: "",
      progress: "",
      status: "Not Started",
      deliverables: "",
    });
  };

  const handleEdit = (milestone) => {
    setEditingId(milestone.id);
  };

  const handleSave = (id) => {
    setMilestones(
      milestones.map((m) =>
        m.id === id
          ? {
              ...m,
              phase: document.getElementById(`milestone-phase-${id}`).value,
              startDate: document.getElementById(`milestone-startDate-${id}`)
                .value,
              endDate: document.getElementById(`milestone-endDate-${id}`).value,
              progress: Number(
                document.getElementById(`milestone-progress-${id}`).value
              ),
              status: document.getElementById(`milestone-status-${id}`).value,
              deliverables: document.getElementById(
                `milestone-deliverables-${id}`
              ).value,
            }
          : m
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const inputClasses =
    "w-full p-2 rounded border border-[#F3B8B8] focus:outline-none focus:border-[#E37F7F] text-black placeholder-gray-500";
  const editInputClasses =
    "w-full p-1 rounded border border-[#F3B8B8] text-black";

  return (
    <div className="bg-gradient-to-br from-[#FFE6E6] to-[#FFF0F0] p-6 rounded-lg shadow-md border border-[#F3B8B8]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Project Timeline
      </h3>
      <form onSubmit={handleAdd} className="mb-4 space-y-2">
        <input
          type="text"
          value={newMilestone.phase}
          onChange={(e) =>
            setNewMilestone({ ...newMilestone, phase: e.target.value })
          }
          placeholder="Phase Name"
          className={inputClasses}
        />
        <input
          type="date"
          value={newMilestone.startDate}
          onChange={(e) =>
            setNewMilestone({ ...newMilestone, startDate: e.target.value })
          }
          className={inputClasses}
        />
        <input
          type="date"
          value={newMilestone.endDate}
          onChange={(e) =>
            setNewMilestone({ ...newMilestone, endDate: e.target.value })
          }
          className={inputClasses}
        />
        <input
          type="number"
          value={newMilestone.progress}
          onChange={(e) =>
            setNewMilestone({ ...newMilestone, progress: e.target.value })
          }
          placeholder="Progress (%)"
          min="0"
          max="100"
          className={inputClasses}
        />
        <select
          value={newMilestone.status}
          onChange={(e) =>
            setNewMilestone({ ...newMilestone, status: e.target.value })
          }
          className={inputClasses}
        >
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Delayed</option>
        </select>
        <input
          type="text"
          value={newMilestone.deliverables}
          onChange={(e) =>
            setNewMilestone({ ...newMilestone, deliverables: e.target.value })
          }
          placeholder="Deliverables"
          className={inputClasses}
        />
        <button
          type="submit"
          className="w-full bg-[#E37F7F] text-white p-2 rounded hover:bg-[#D35A5A] transition-colors"
        >
          Add Milestone
        </button>
      </form>
      <div className="space-y-3">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="flex items-center justify-between bg-white/60 p-3 rounded border border-[#F3B8B8]"
          >
            {editingId === milestone.id ? (
              <div className="flex-1 space-y-2">
                <input
                  id={`milestone-phase-${milestone.id}`}
                  type="text"
                  defaultValue={milestone.phase}
                  className={editInputClasses}
                />
                <input
                  id={`milestone-startDate-${milestone.id}`}
                  type="date"
                  defaultValue={milestone.startDate}
                  className={editInputClasses}
                />
                <input
                  id={`milestone-endDate-${milestone.id}`}
                  type="date"
                  defaultValue={milestone.endDate}
                  className={editInputClasses}
                />
                <input
                  id={`milestone-progress-${milestone.id}`}
                  type="number"
                  defaultValue={milestone.progress}
                  min="0"
                  max="100"
                  className={editInputClasses}
                />
                <select
                  id={`milestone-status-${milestone.id}`}
                  defaultValue={milestone.status}
                  className={editInputClasses}
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Delayed</option>
                </select>
                <input
                  id={`milestone-deliverables-${milestone.id}`}
                  type="text"
                  defaultValue={milestone.deliverables}
                  className={editInputClasses}
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="font-medium text-black">{milestone.phase}</div>
                <div className="text-sm text-black">
                  Duration: {milestone.startDate} to {milestone.endDate}
                </div>
                <div className="text-sm text-black">
                  Progress: {milestone.progress}% | Status: {milestone.status}
                </div>
                <div className="text-sm text-black">
                  Deliverables: {milestone.deliverables}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === milestone.id ? (
                <button
                  onClick={() => handleSave(milestone.id)}
                  className="text-[#E37F7F] hover:text-[#D35A5A]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(milestone)}
                  className="text-[#E37F7F] hover:text-[#D35A5A]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(milestone.id)}
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

function ProjectReportsBox() {
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Sprint Review Report",
      date: "2024-03-15",
      type: "Progress",
      status: "Completed",
      metrics: "Velocity: 85, Bugs: 12, Features: 8",
      summary: "Successfully completed all planned features",
    },
    {
      id: 2,
      title: "Resource Allocation Report",
      date: "2024-03-20",
      type: "Resource",
      status: "In Progress",
      metrics: "Utilization: 78%, Cost: $45K",
      summary: "Team capacity optimization needed",
    },
    {
      id: 3,
      title: "Quality Metrics Report",
      date: "2024-03-25",
      type: "Quality",
      status: "Pending",
      metrics: "Coverage: 92%, Issues: 15",
      summary: "Code quality improvements required",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newReport, setNewReport] = useState({
    title: "",
    date: "",
    type: "Progress",
    status: "Pending",
    metrics: "",
    summary: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newReport.title || !newReport.date) return;

    const report = {
      id: Date.now(),
      ...newReport,
    };

    setReports([...reports, report]);
    setNewReport({
      title: "",
      date: "",
      type: "Progress",
      status: "Pending",
      metrics: "",
      summary: "",
    });
  };

  const handleEdit = (report) => {
    setEditingId(report.id);
  };

  const handleSave = (id) => {
    setReports(
      reports.map((r) =>
        r.id === id
          ? {
              ...r,
              title: document.getElementById(`report-title-${id}`).value,
              date: document.getElementById(`report-date-${id}`).value,
              type: document.getElementById(`report-type-${id}`).value,
              status: document.getElementById(`report-status-${id}`).value,
              metrics: document.getElementById(`report-metrics-${id}`).value,
              summary: document.getElementById(`report-summary-${id}`).value,
            }
          : r
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const inputClasses =
    "w-full p-2 rounded border border-[#F3B8F3] focus:outline-none focus:border-[#E37FE3] text-black placeholder-gray-500";
  const editInputClasses =
    "w-full p-1 rounded border border-[#F3B8F3] text-black";

  return (
    <div className="bg-gradient-to-br from-[#FFE6FF] to-[#FFF0FF] p-6 rounded-lg shadow-md border border-[#F3B8F3]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Project Reports
      </h3>
      <form onSubmit={handleAdd} className="mb-4 space-y-2">
        <input
          type="text"
          value={newReport.title}
          onChange={(e) =>
            setNewReport({ ...newReport, title: e.target.value })
          }
          placeholder="Report Title"
          className={inputClasses}
        />
        <input
          type="date"
          value={newReport.date}
          onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
          className={inputClasses}
        />
        <select
          value={newReport.type}
          onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
          className={inputClasses}
        >
          <option>Progress</option>
          <option>Resource</option>
          <option>Quality</option>
          <option>Financial</option>
          <option>Risk</option>
        </select>
        <select
          value={newReport.status}
          onChange={(e) =>
            setNewReport({ ...newReport, status: e.target.value })
          }
          className={inputClasses}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Reviewed</option>
        </select>
        <input
          type="text"
          value={newReport.metrics}
          onChange={(e) =>
            setNewReport({ ...newReport, metrics: e.target.value })
          }
          placeholder="Key Metrics"
          className={inputClasses}
        />
        <textarea
          value={newReport.summary}
          onChange={(e) =>
            setNewReport({ ...newReport, summary: e.target.value })
          }
          placeholder="Report Summary"
          className={`${inputClasses} h-20 resize-none`}
        />
        <button
          type="submit"
          className="w-full bg-[#E37FE3] text-white p-2 rounded hover:bg-[#D35AD3] transition-colors"
        >
          Add Report
        </button>
      </form>
      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between bg-white/60 p-3 rounded border border-[#F3B8F3]"
          >
            {editingId === report.id ? (
              <div className="flex-1 space-y-2">
                <input
                  id={`report-title-${report.id}`}
                  type="text"
                  defaultValue={report.title}
                  className={editInputClasses}
                />
                <input
                  id={`report-date-${report.id}`}
                  type="date"
                  defaultValue={report.date}
                  className={editInputClasses}
                />
                <select
                  id={`report-type-${report.id}`}
                  defaultValue={report.type}
                  className={editInputClasses}
                >
                  <option>Progress</option>
                  <option>Resource</option>
                  <option>Quality</option>
                  <option>Financial</option>
                  <option>Risk</option>
                </select>
                <select
                  id={`report-status-${report.id}`}
                  defaultValue={report.status}
                  className={editInputClasses}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Reviewed</option>
                </select>
                <input
                  id={`report-metrics-${report.id}`}
                  type="text"
                  defaultValue={report.metrics}
                  className={editInputClasses}
                />
                <textarea
                  id={`report-summary-${report.id}`}
                  defaultValue={report.summary}
                  className={`${editInputClasses} h-20 resize-none`}
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="font-medium text-black">{report.title}</div>
                <div className="text-sm text-black">
                  Date: {report.date} | Type: {report.type}
                </div>
                <div className="text-sm text-black">
                  Status: {report.status}
                </div>
                <div className="text-sm text-black">
                  Metrics: {report.metrics}
                </div>
                <div className="text-sm text-black">
                  Summary: {report.summary}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === report.id ? (
                <button
                  onClick={() => handleSave(report.id)}
                  className="text-[#E37FE3] hover:text-[#D35AD3]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(report)}
                  className="text-[#E37FE3] hover:text-[#D35AD3]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(report.id)}
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

function ResourceManagementBox() {
  const [resources, setResources] = useState([
    {
      id: 1,
      name: "Development Team",
      allocated: 120,
      available: 160,
      utilization: 75,
      type: "Human",
      notes: "Frontend and backend developers",
    },
    {
      id: 2,
      name: "Cloud Infrastructure",
      allocated: 80,
      available: 100,
      utilization: 80,
      type: "Technical",
      notes: "AWS resources and services",
    },
    {
      id: 3,
      name: "Testing Equipment",
      allocated: 40,
      available: 50,
      utilization: 80,
      type: "Equipment",
      notes: "QA testing devices and tools",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newResource, setNewResource] = useState({
    name: "",
    allocated: "",
    available: "",
    utilization: "",
    type: "Human",
    notes: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newResource.name || !newResource.available) return;

    const utilization =
      (Number(newResource.allocated) / Number(newResource.available)) * 100;

    const resource = {
      id: Date.now(),
      ...newResource,
      utilization: Number(utilization.toFixed(1)),
    };

    setResources([...resources, resource]);
    setNewResource({
      name: "",
      allocated: "",
      available: "",
      utilization: "",
      type: "Human",
      notes: "",
    });
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
  };

  const handleSave = (id) => {
    setResources(
      resources.map((r) => {
        if (r.id === id) {
          const allocated = Number(
            document.getElementById(`resource-allocated-${id}`).value
          );
          const available = Number(
            document.getElementById(`resource-available-${id}`).value
          );
          const utilization = (allocated / available) * 100;

          return {
            ...r,
            name: document.getElementById(`resource-name-${id}`).value,
            allocated,
            available,
            utilization: Number(utilization.toFixed(1)),
            type: document.getElementById(`resource-type-${id}`).value,
            notes: document.getElementById(`resource-notes-${id}`).value,
          };
        }
        return r;
      })
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const inputClasses =
    "w-full p-2 rounded border border-[#B8F3B8] focus:outline-none focus:border-[#7FE37F] text-black placeholder-gray-500";
  const editInputClasses =
    "w-full p-1 rounded border border-[#B8F3B8] text-black";

  return (
    <div className="bg-gradient-to-br from-[#E6FFE6] to-[#F0FFF0] p-6 rounded-lg shadow-md border border-[#B8F3B8]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Resource Management
      </h3>
      <form onSubmit={handleAdd} className="mb-4 space-y-2">
        <input
          type="text"
          value={newResource.name}
          onChange={(e) =>
            setNewResource({ ...newResource, name: e.target.value })
          }
          placeholder="Resource Name"
          className={inputClasses}
        />
        <input
          type="number"
          value={newResource.allocated}
          onChange={(e) =>
            setNewResource({ ...newResource, allocated: e.target.value })
          }
          placeholder="Allocated Hours/Units"
          className={inputClasses}
        />
        <input
          type="number"
          value={newResource.available}
          onChange={(e) =>
            setNewResource({ ...newResource, available: e.target.value })
          }
          placeholder="Available Hours/Units"
          className={inputClasses}
        />
        <select
          value={newResource.type}
          onChange={(e) =>
            setNewResource({ ...newResource, type: e.target.value })
          }
          className={inputClasses}
        >
          <option>Human</option>
          <option>Technical</option>
          <option>Equipment</option>
          <option>Financial</option>
        </select>
        <input
          type="text"
          value={newResource.notes}
          onChange={(e) =>
            setNewResource({ ...newResource, notes: e.target.value })
          }
          placeholder="Notes"
          className={inputClasses}
        />
        <button
          type="submit"
          className="w-full bg-[#7FE37F] text-white p-2 rounded hover:bg-[#5AD35A] transition-colors"
        >
          Add Resource
        </button>
      </form>
      <div className="space-y-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center justify-between bg-white/60 p-3 rounded border border-[#B8F3B8]"
          >
            {editingId === resource.id ? (
              <div className="flex-1 space-y-2">
                <input
                  id={`resource-name-${resource.id}`}
                  type="text"
                  defaultValue={resource.name}
                  className={editInputClasses}
                />
                <input
                  id={`resource-allocated-${resource.id}`}
                  type="number"
                  defaultValue={resource.allocated}
                  className={editInputClasses}
                />
                <input
                  id={`resource-available-${resource.id}`}
                  type="number"
                  defaultValue={resource.available}
                  className={editInputClasses}
                />
                <select
                  id={`resource-type-${resource.id}`}
                  defaultValue={resource.type}
                  className={editInputClasses}
                >
                  <option>Human</option>
                  <option>Technical</option>
                  <option>Equipment</option>
                  <option>Financial</option>
                </select>
                <input
                  id={`resource-notes-${resource.id}`}
                  type="text"
                  defaultValue={resource.notes}
                  className={editInputClasses}
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="font-medium text-black">{resource.name}</div>
                <div className="text-sm text-black">
                  Allocated: {resource.allocated} | Available:{" "}
                  {resource.available}
                </div>
                <div className="text-sm text-black">
                  Utilization: {resource.utilization}% | Type: {resource.type}
                </div>
                <div className="text-sm text-black">
                  Notes: {resource.notes}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === resource.id ? (
                <button
                  onClick={() => handleSave(resource.id)}
                  className="text-[#7FE37F] hover:text-[#5AD35A]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(resource)}
                  className="text-[#7FE37F] hover:text-[#5AD35A]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(resource.id)}
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

// ResearchToolsBox has been moved to its own file at components/ResearchToolsBox.js

// DraftArticlesBox has been moved to its own file

// Add this new component at the bottom of the file:
function EditableSEOInfoBox() {
  const [items, setItems] = useState([
    {
      id: 1,
      traffic: 12000,
      backlinks: 350,
      domainAuthority: 42,
      topKeyword: "productivity app",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    traffic: "",
    backlinks: "",
    domainAuthority: "",
    topKeyword: "",
  });
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setForm({
      traffic: "",
      backlinks: "",
      domainAuthority: "",
      topKeyword: "",
    });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setItems([...items, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({
      traffic: "",
      backlinks: "",
      domainAuthority: "",
      topKeyword: "",
    });
  };
  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">SEO Info (Editable)</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add New
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Traffic</label>
              <input
                type="number"
                value={form.traffic}
                onChange={(e) => setForm({ ...form, traffic: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Backlinks</label>
              <input
                type="number"
                value={form.backlinks}
                onChange={(e) =>
                  setForm({ ...form, backlinks: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Domain Authority
              </label>
              <input
                type="number"
                value={form.domainAuthority}
                onChange={(e) =>
                  setForm({ ...form, domainAuthority: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Top Keyword</label>
              <input
                type="text"
                value={form.topKeyword}
                onChange={(e) =>
                  setForm({ ...form, topKeyword: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Traffic:</span> {item.traffic}
            </div>
            <div>
              <span className="font-medium">Backlinks:</span> {item.backlinks}
            </div>
            <div>
              <span className="font-medium">Domain Authority:</span>{" "}
              {item.domainAuthority}
            </div>
            <div>
              <span className="font-medium">Top Keyword:</span>{" "}
              {item.topKeyword}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-cyan-500 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableSEOKeywordsBox() {
  const [items, setItems] = useState([
    {
      id: 1,
      keyword: "productivity app",
      searchVolume: 5400,
      competition: "Medium",
      trend: "+12%",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    keyword: "",
    searchVolume: "",
    competition: "",
    trend: "",
  });
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setForm({ keyword: "", searchVolume: "", competition: "", trend: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setItems([...items, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ keyword: "", searchVolume: "", competition: "", trend: "" });
  };
  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Keyword Info (Editable)</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Add New
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Keyword</label>
              <input
                type="text"
                value={form.keyword}
                onChange={(e) => setForm({ ...form, keyword: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Search Volume</label>
              <input
                type="number"
                value={form.searchVolume}
                onChange={(e) =>
                  setForm({ ...form, searchVolume: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Competition</label>
              <input
                type="text"
                value={form.competition}
                onChange={(e) =>
                  setForm({ ...form, competition: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Trend</label>
              <input
                type="text"
                value={form.trend}
                onChange={(e) => setForm({ ...form, trend: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Keyword:</span> {item.keyword}
            </div>
            <div>
              <span className="font-medium">Search Volume:</span>{" "}
              {item.searchVolume}
            </div>
            <div>
              <span className="font-medium">Competition:</span>{" "}
              {item.competition}
            </div>
            <div>
              <span className="font-medium">Trend:</span> {item.trend}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-yellow-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableSEORankingsBox() {
  const [items, setItems] = useState([
    {
      id: 1,
      keyword: "productivity app",
      currentRank: 3,
      bestRank: 2,
      url: "https://yourapp.com/productivity",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    keyword: "",
    currentRank: "",
    bestRank: "",
    url: "",
  });
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setForm({ keyword: "", currentRank: "", bestRank: "", url: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setItems([...items, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ keyword: "", currentRank: "", bestRank: "", url: "" });
  };
  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Ranking Info (Editable)</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Add New
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Keyword</label>
              <input
                type="text"
                value={form.keyword}
                onChange={(e) => setForm({ ...form, keyword: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Current Rank</label>
              <input
                type="number"
                value={form.currentRank}
                onChange={(e) =>
                  setForm({ ...form, currentRank: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Best Rank</label>
              <input
                type="number"
                value={form.bestRank}
                onChange={(e) => setForm({ ...form, bestRank: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">URL</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Keyword:</span> {item.keyword}
            </div>
            <div>
              <span className="font-medium">Current Rank:</span>{" "}
              {item.currentRank}
            </div>
            <div>
              <span className="font-medium">Best Rank:</span> {item.bestRank}
            </div>
            <div>
              <span className="font-medium">URL:</span> {item.url}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-green-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableSEOContentBox() {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "10 Productivity Tips",
      wordCount: 1200,
      status: "Published",
      lastUpdated: "2024-06-01",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    wordCount: "",
    status: "",
    lastUpdated: "",
  });
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setForm({ title: "", wordCount: "", status: "", lastUpdated: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setItems([...items, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ title: "", wordCount: "", status: "", lastUpdated: "" });
  };
  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 text-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Content Info (Editable)</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-pink-500 text-white px-4 py-2 rounded"
      >
        Add New
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Word Count</label>
              <input
                type="number"
                value={form.wordCount}
                onChange={(e) =>
                  setForm({ ...form, wordCount: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <input
                type="text"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Updated</label>
              <input
                type="date"
                value={form.lastUpdated}
                onChange={(e) =>
                  setForm({ ...form, lastUpdated: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-pink-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Title:</span> {item.title}
            </div>
            <div>
              <span className="font-medium">Word Count:</span> {item.wordCount}
            </div>
            <div>
              <span className="font-medium">Status:</span> {item.status}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {item.lastUpdated}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-pink-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add these new components at the bottom of the file:
function EditableTeamInfoBox() {
  const [items, setItems] = useState([
    { id: 1, name: "Frontend Team", members: 5, lead: "Alice" },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", members: "", lead: "" });
  const [adding, setAdding] = useState(false);
  const handleAdd = () => {
    setForm({ name: "", members: "", lead: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setItems([...items, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ name: "", members: "", lead: "" });
  };
  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Team Info (Editable)</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add New
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Team Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Number of Members
              </label>
              <input
                type="number"
                value={form.members}
                onChange={(e) => setForm({ ...form, members: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Team Lead</label>
              <input
                type="text"
                value={form.lead}
                onChange={(e) => setForm({ ...form, lead: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Team Name:</span> {item.name}
            </div>
            <div>
              <span className="font-medium">Number of Members:</span>{" "}
              {item.members}
            </div>
            <div>
              <span className="font-medium">Team Lead:</span> {item.lead}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-blue-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableTimelineInfoBox() {
  const [items, setItems] = useState([
    {
      id: 1,
      milestone: "Design Complete",
      due: "2024-06-10",
      status: "On Track",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ milestone: "", due: "", status: "" });
  const [adding, setAdding] = useState(false);
  const handleAdd = () => {
    setForm({ milestone: "", due: "", status: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setItems([...items, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ milestone: "", due: "", status: "" });
  };
  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 text-gray-900 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Timeline Info (Editable)</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-purple-500 text-white px-4 py-2 rounded"
      >
        Add New
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Milestone</label>
              <input
                type="text"
                value={form.milestone}
                onChange={(e) =>
                  setForm({ ...form, milestone: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Due Date</label>
              <input
                type="date"
                value={form.due}
                onChange={(e) => setForm({ ...form, due: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <input
                type="text"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-purple-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Milestone:</span> {item.milestone}
            </div>
            <div>
              <span className="font-medium">Due Date:</span> {item.due}
            </div>
            <div>
              <span className="font-medium">Status:</span> {item.status}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-purple-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableDeveloperNotesBox() {
  const [notes, setNotes] = React.useState([
    {
      id: 1,
      title: "Setup Instructions",
      content: "Clone the repo and run npm install.",
    },
    { id: 2, title: "API Docs", content: "See /docs for API documentation." },
  ]);
  const [editingId, setEditingId] = React.useState(null);
  const [form, setForm] = React.useState({ title: "", content: "" });
  const [adding, setAdding] = React.useState(false);

  const handleAdd = () => {
    setForm({ title: "", content: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setNotes([...notes, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setNotes(notes.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ title: "", content: "" });
  };
  const handleDelete = (id) => {
    setNotes(notes.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-yellow-100 to-green-100 text-gray-900 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Developer Notes (Editable)</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-yellow-400 text-white px-4 py-2 rounded"
      >
        Add Note
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {notes.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Title:</span> {item.title}
            </div>
            <div>
              <span className="font-medium">Content:</span> {item.content}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-yellow-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
// EditableResourceInfoBox: Editable CRUD box for project resources
function EditableResourceInfoBox() {
  const [items, setItems] = React.useState([
    { id: 1, name: "Laptop", type: "Hardware", status: "Available" },
    { id: 2, name: "Adobe License", type: "Software", status: "Assigned" },
  ]);
  const [editingId, setEditingId] = React.useState(null);
  const [form, setForm] = React.useState({ name: "", type: "", status: "" });
  const [adding, setAdding] = React.useState(false);

  const handleAdd = () => {
    setForm({ name: "", type: "", status: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setItems([...items, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ name: "", type: "", status: "" });
  };
  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 text-gray-900 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Resource Info (Editable)</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Add New
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Resource Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Type</label>
              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <input
                type="text"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Resource Name:</span> {item.name}
            </div>
            <div>
              <span className="font-medium">Type:</span> {item.type}
            </div>
            <div>
              <span className="font-medium">Status:</span> {item.status}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-green-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// EditableReportInfoBox: Editable CRUD box for project reports
function EditableReportInfoBox() {
  const [items, setItems] = React.useState([
    { id: 1, name: "Weekly Report", summary: "Progress and blockers" },
    { id: 2, name: "Monthly Report", summary: "Milestones achieved" },
  ]);
  const [editingId, setEditingId] = React.useState(null);
  const [form, setForm] = React.useState({ name: "", summary: "" });
  const [adding, setAdding] = React.useState(false);

  const handleAdd = () => {
    setForm({ name: "", summary: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setItems([...items, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ name: "", summary: "" });
  };
  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 text-gray-900 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Report Info (Editable)</h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-pink-500 text-white px-4 py-2 rounded"
      >
        Add New
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Report Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Summary</label>
              <input
                type="text"
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-pink-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Report Name:</span> {item.name}
            </div>
            <div>
              <span className="font-medium">Summary:</span> {item.summary}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-pink-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// EditableDevToolsBox: Editable CRUD box for developer tools
function EditableDevToolsBox() {
  const [tools, setTools] = React.useState([
    { id: 1, name: "VS Code", description: "Primary code editor" },
    { id: 2, name: "Postman", description: "API testing tool" },
    { id: 3, name: "GitHub Desktop", description: "Git GUI client" },
  ]);
  const [editingId, setEditingId] = React.useState(null);
  const [form, setForm] = React.useState({ name: "", description: "" });
  const [adding, setAdding] = React.useState(false);

  const handleAdd = () => {
    setForm({ name: "", description: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setTools([...tools, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setTools(tools.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ name: "", description: "" });
  };
  const handleDelete = (id) => {
    setTools(tools.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-cyan-700">
        Dev Tools (Editable)
      </h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-cyan-500 text-white px-4 py-2 rounded"
      >
        Add Tool
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Tool Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-cyan-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {tools.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Tool Name:</span> {item.name}
            </div>
            <div>
              <span className="font-medium">Description:</span>{" "}
              {item.description}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-cyan-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// EditableDevDocsBox: Editable CRUD box for developer documentation info
function EditableDevDocsBox() {
  const [docs, setDocs] = React.useState([
    {
      id: 1,
      title: "API Reference",
      content: "See /docs/api for all endpoints.",
    },
    {
      id: 2,
      title: "Setup Guide",
      content: "Clone the repo and run npm install.",
    },
  ]);
  const [editingId, setEditingId] = React.useState(null);
  const [form, setForm] = React.useState({ title: "", content: "" });
  const [adding, setAdding] = React.useState(false);

  const handleAdd = () => {
    setForm({ title: "", content: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setDocs([...docs, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setDocs(docs.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ title: "", content: "" });
  };
  const handleDelete = (id) => {
    setDocs(docs.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-yellow-700">
        Documentation Info (Editable)
      </h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Add Info
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {docs.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Title:</span> {item.title}
            </div>
            <div>
              <span className="font-medium">Content:</span> {item.content}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-yellow-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Place this at the top-level, after imports and before any usage in JSX
function EditableDeploymentInfoBox() {
  const [deployments, setDeployments] = React.useState([
    { id: 1, name: "Production", status: "Success", date: "2024-06-01" },
    { id: 2, name: "Staging", status: "Failed", date: "2024-05-28" },
  ]);
  const [editingId, setEditingId] = React.useState(null);
  const [form, setForm] = React.useState({ name: "", status: "", date: "" });
  const [adding, setAdding] = React.useState(false);

  const handleAdd = () => {
    setForm({ name: "", status: "", date: "" });
    setAdding(true);
    setEditingId(null);
  };
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setAdding(false);
  };
  const handleSave = () => {
    if (adding) {
      setDeployments([...deployments, { ...form, id: Date.now() }]);
      setAdding(false);
    } else {
      setDeployments(deployments.map((i) => (i.id === editingId ? form : i)));
      setEditingId(null);
    }
    setForm({ name: "", status: "", date: "" });
  };
  const handleDelete = (id) => {
    setDeployments(deployments.filter((i) => i.id !== id));
    setEditingId(null);
    setAdding(false);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-yellow-50 to-green-50 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-yellow-700">
        Deployment Info (Editable)
      </h2>
      <button
        onClick={handleAdd}
        className="mb-4 bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Add Deployment
      </button>
      <div className="space-y-4">
        {(adding || editingId) && (
          <div className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-2 py-1 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <input
                type="text"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded px-2 py-1 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border rounded px-2 py-1 text-black"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setEditingId(null);
              }}
              className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        {deployments.map((item) => (
          <div key={item.id} className="space-y-2 border-b pb-4">
            <div>
              <span className="font-medium">Name:</span> {item.name}
            </div>
            <div>
              <span className="font-medium">Status:</span> {item.status}
            </div>
            <div>
              <span className="font-medium">Date:</span> {item.date}
            </div>
            <button
              onClick={() => handleEdit(item)}
              className="bg-yellow-400 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
