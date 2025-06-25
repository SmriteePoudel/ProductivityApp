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
import { useRouter } from "next/navigation";

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
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Roles 🛡️</h2>
      <p className="text-gray-600">Role management coming soon.</p>
    </div>
  );
}
function PermissionsManager({ user }) {
  const [canAdd, setCanAdd] = useState(true);
  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(true);
  const [canReset, setCanReset] = useState(false);
  const [userCount, setUserCount] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load permissions from backend
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.permissions) {
          setCanAdd(!!data.user.permissions.canAdd);
          setCanEdit(!!data.user.permissions.canEdit);
          setCanDelete(!!data.user.permissions.canDelete);
          setCanReset(!!data.user.permissions.canReset);
        }
      });
    if (user.role === "admin") {
      fetch("/api/admin/stats")
        .then((res) => res.json())
        .then((data) => setUserCount(data?.users?.length || 0));
    }
  }, [user.role]);

  // Save permissions to backend
  const savePermissions = (newPerms) => {
    setSaving(true);
    fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions: newPerms }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1500);
      })
      .finally(() => setSaving(false));
  };

  const handleToggle = (perm, value) => {
    const newPerms = {
      canAdd,
      canEdit,
      canDelete,
      canReset,
      [perm]: value,
    };
    setCanAdd(newPerms.canAdd);
    setCanEdit(newPerms.canEdit);
    setCanDelete(newPerms.canDelete);
    setCanReset(newPerms.canReset);
    savePermissions(newPerms);
  };

  return (
    <div className="max-w-xl mx-auto bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-yellow dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 rounded-2xl shadow-lg p-8 border border-accent">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Permissions
      </h2>
      <div className="space-y-4">
        {user.role === "admin" && (
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300">
                Reset All Data
              </div>
              <div className="text-sm text-gray-500">
                Allow resetting all app data (dangerous!)
              </div>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={canReset}
                disabled={saving}
                onChange={(e) => handleToggle("canReset", e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:bg-red-400 dark:peer-checked:bg-red-500 transition-all"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {canReset ? "On" : "Off"}
              </span>
            </label>
          </div>
        )}
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Add Task
            </div>
            <div className="text-sm text-gray-500">Allow adding new tasks</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={canAdd}
              disabled={saving}
              onChange={(e) => handleToggle("canAdd", e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:bg-accent peer-checked:bg-accent/20 transition-all"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {canAdd ? "On" : "Off"}
            </span>
          </label>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Edit Task
            </div>
            <div className="text-sm text-gray-500">Allow editing tasks</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={canEdit}
              disabled={saving}
              onChange={(e) => handleToggle("canEdit", e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:bg-accent peer-checked:bg-accent/20 transition-all"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {canEdit ? "On" : "Off"}
            </span>
          </label>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Delete Task
            </div>
            <div className="text-sm text-gray-500">Allow deleting tasks</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={canDelete}
              disabled={saving}
              onChange={(e) => handleToggle("canDelete", e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer dark:bg-gray-700 peer-checked:bg-accent peer-checked:bg-accent/20 transition-all"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {canDelete ? "On" : "Off"}
            </span>
          </label>
        </div>
        {user.role === "admin" && (
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300">
                Users Logged In
              </div>
              <div className="text-sm text-gray-500">
                Number of users who have logged in yet
              </div>
            </div>
            <span className="text-lg font-bold text-accent dark:text-accent">
              {userCount !== null ? userCount : "..."}
            </span>
          </div>
        )}
        {success && (
          <div className="text-green-500 font-medium text-center">Saved!</div>
        )}
      </div>
    </div>
  );
}

// Add ProjectManager component
function ProjectManager() {
  const [projects, setProjects] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("projects");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    icon: "📁",
    files: [], // store file metadata
  });
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const colorOptions = [
    "#3b82f6",
    "#ec4899",
    "#a855f7",
    "#10b981",
    "#f59e42",
    "#fbbf24",
    "#ef4444",
    "#6366f1",
    "#14b8a6",
  ];
  const iconOptions = [
    "📁",
    "📝",
    "💼",
    "🎯",
    "⭐",
    "💡",
    "🎨",
    "🏠",
    "🚗",
    "🍕",
    "☕",
    "💻",
    "📱",
    "🎵",
    "🎬",
    "🏃‍♀️",
    "🧘‍♀️",
    "📖",
    "✏️",
    "🎓",
    "🛒",
    "🏥",
  ];

  // Handle file input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileObjs = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setForm((prev) => ({ ...prev, files: [...prev.files, ...fileObjs] }));
  };

  const handleRemoveFile = (idx) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== idx),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setIsSaving(true);
    const newProjects = [...projects, { ...form, id: Date.now() }];
    setProjects(newProjects);
    localStorage.setItem("projects", JSON.stringify(newProjects));
    setForm({
      name: "",
      description: "",
      color: "#3b82f6",
      icon: "📁",
      files: [],
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1200);
    setIsSaving(false);
  };

  // File icon by type
  const getFileIcon = (type, name) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("spreadsheet") || name.match(/\.(xls|xlsx|csv)$/i))
      return "📊";
    if (type.includes("word") || name.match(/\.(doc|docx)$/i)) return "📝";
    if (type.includes("image")) return "🖼️";
    if (type.includes("zip") || name.match(/\.(zip|rar|7z)$/i)) return "🗜️";
    return "📎";
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 space-y-8 border border-accent">
      <h2 className="text-2xl font-bold text-accent mb-6 flex items-center gap-2">
        {form.icon} Projects
      </h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-2 ring-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter project name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-2 ring-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Describe your project (optional)"
          />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color
            </label>
            <div className="flex gap-1">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    form.color === color
                      ? "border-accent scale-110"
                      : "border-gray-200 dark:border-gray-700 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setForm((f) => ({ ...f, color }))}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Icon
            </label>
            <div className="flex gap-1 flex-wrap max-w-xs">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`w-7 h-7 rounded-lg border-2 text-lg transition-all ${
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
              Attach Files
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.ppt,.pptx,.txt,image/*,application/zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent/90"
            />
            {form.files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {form.files.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm bg-white/60 dark:bg-gray-800/60 rounded px-2 py-1 border border-accent"
                  >
                    <span>{getFileIcon(file.type, file.name)}</span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-accent underline"
                      download={file.name}
                    >
                      {file.name}
                    </a>
                    <span className="text-xs text-gray-400">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isSaving || !form.name.trim()}
            className="px-6 py-2 rounded-lg font-semibold shadow bg-accent text-white transition-all duration-200 focus:outline-none focus:ring-2 ring-accent disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            {success ? "Saved!" : "Save Project"}
          </button>
        </div>
      </form>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-8">
          Your Projects ({projects.length})
        </h3>
        {projects.length === 0 ? (
          <div className="text-center py-8 bg-white/60 dark:bg-gray-700/60 rounded-xl border border-accent">
            <span className="text-4xl mb-4 block">📁</span>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No projects yet. Add your first project to get started!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {projects.map((proj) => (
              <li
                key={proj.id}
                className="flex flex-col gap-2 bg-white/70 dark:bg-gray-800/70 border border-accent rounded-lg px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" style={{ color: proj.color }}>
                    {proj.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {proj.name}
                    </div>
                    {proj.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        {proj.description}
                      </div>
                    )}
                  </div>
                </div>
                {proj.files && proj.files.length > 0 && (
                  <ul className="flex flex-wrap gap-2 mt-1">
                    {proj.files.map((file, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-1 text-xs bg-white/60 dark:bg-gray-800/60 rounded px-2 py-1 border border-accent"
                      >
                        <span>{getFileIcon(file.type, file.name)}</span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-accent underline"
                          download={file.name}
                        >
                          {file.name}
                        </a>
                        <span className="text-gray-400">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
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

  // Sidebar navigation items
  const nav = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    {
      key: "projects",
      label: "Projects",
      icon: "📁",
      children: [
        { key: "project-categories", label: "Project Categories", icon: "🏷️" },
        { key: "project-list", label: "Projects", icon: "📋" },
      ],
    },
    { key: "templates", label: "Templates", icon: "🗂️" },
    { key: "settings", label: "Settings", icon: "⚙️" },
    {
      key: "user-management",
      label: "User Management",
      icon: "👥",
      adminOnly: true,
      children: [
        { key: "users", label: "Users", icon: "👤" },
        { key: "roles", label: "Roles", icon: "🛡️" },
        { key: "permissions", label: "Permissions", icon: "🔑" },
      ],
    },
  ];

  // Helper to render sidebar items
  const renderNav = (items, parent = null) => (
    <ul className="space-y-1">
      {items.map((item) => {
        if (item.adminOnly && user.role !== "admin") return null;
        const isActive = activeSection === item.key;
        return (
          <li key={item.key}>
            <button
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                isActive
                  ? "bg-accent/20 text-accent"
                  : "text-gray-200 hover:bg-accent/10 hover:text-accent"
              }`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
            {item.children && (
              <div className="ml-4 mt-1 border-l border-accent pl-2">
                {renderNav(item.children, item.key)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 relative">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 w-72 bg-gray-900/90 border-r border-accent shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-accent">
          <span className="text-xl font-bold text-accent tracking-wide">
            Productivity
          </span>
          <button
            className="lg:hidden text-gray-400 hover:text-accent"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="text-xs uppercase text-gray-400 px-4 mb-2">
            Navigation
          </div>
          {renderNav(nav)}
        </nav>
        <div className="p-4 border-t border-accent">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>
      {/* Sidebar overlay for mobile */}
      {!sidebarOpen && (
        <button
          className="fixed z-50 top-4 left-4 lg:hidden p-2 rounded-lg bg-accent text-white shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}
      {/* Profile Button (top right) */}
      <button
        className="fixed top-6 right-28 z-50 flex items-center justify-center w-12 h-12 rounded-full border-2 border-accent bg-white shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none"
        onClick={() => setActiveSection("settings")}
        title="Profile & Settings"
      >
        <img
          src={profileAvatar || user.avatar || "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>
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
          <div className="flex-1 p-4 overflow-y-auto">
            {toolTabs.find((tab) => tab.key === activeTool)?.component}
          </div>
        </div>
      </main>
    </div>
  );
}
