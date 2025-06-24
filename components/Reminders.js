"use client";

import { useState, useEffect } from "react";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    priority: "medium",
    category: "personal",
  });

  // Load reminders from localStorage on component mount
  useEffect(() => {
    const savedReminders = localStorage.getItem("reminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save reminders to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReminder = {
      id: editingId || Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      completed: false,
    };

    if (editingId) {
      setReminders(
        reminders.map((r) => (r.id === editingId ? newReminder : r))
      );
      setEditingId(null);
    } else {
      setReminders([...reminders, newReminder]);
    }

    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      priority: "medium",
      category: "personal",
    });
    setShowForm(false);
  };

  const handleEdit = (reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date,
      time: reminder.time,
      priority: reminder.priority,
      category: reminder.category,
    });
    setEditingId(reminder.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const handleToggleComplete = (id) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500 dark:text-red-400";
      case "medium":
        return "text-yellow-500 dark:text-yellow-400";
      case "low":
        return "text-green-500 dark:text-green-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "work":
        return "💼";
      case "personal":
        return "👤";
      case "health":
        return "🏥";
      case "shopping":
        return "🛒";
      case "bills":
        return "💰";
      case "appointments":
        return "📅";
      default:
        return "📝";
    }
  };

  const formatDateTime = (date, time) => {
    if (!date) return "No date set";
    const dateTime = new Date(`${date}T${time || "00:00"}`);
    return dateTime.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (date, time) => {
    if (!date) return false;
    const reminderTime = new Date(`${date}T${time || "00:00"}`);
    return (
      reminderTime < new Date() &&
      !reminders.find((r) => r.date === date && r.time === time)?.completed
    );
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    // Sort by completion status first
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    // Then by date/time
    const aTime = new Date(`${a.date}T${a.time || "00:00"}`);
    const bTime = new Date(`${b.date}T${b.time || "00:00"}`);
    return aTime - bTime;
  });

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Reminders 🔔
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="px-2 py-1 text-xs bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Add ➕
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-3 border border-pink-200 dark:border-purple-600/30">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-pink-200 dark:border-purple-600/30 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Reminder title"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 text-sm border border-pink-200 dark:border-purple-600/30 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-pink-200 dark:border-purple-600/30 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-pink-200 dark:border-purple-600/30 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-pink-200 dark:border-purple-600/30 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-pink-200 dark:border-purple-600/30 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="personal">👤 Personal</option>
                  <option value="work">💼 Work</option>
                  <option value="health">🏥 Health</option>
                  <option value="shopping">🛒 Shopping</option>
                  <option value="bills">💰 Bills</option>
                  <option value="appointments">📅 Appointments</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {editingId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    title: "",
                    description: "",
                    date: "",
                    time: "",
                    priority: "medium",
                    category: "personal",
                  });
                }}
                className="px-3 py-2 text-sm bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {sortedReminders.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <div className="text-lg mb-1">🔔</div>
            <p className="text-xs">No reminders</p>
          </div>
        ) : (
          sortedReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                reminder.completed
                  ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600"
                  : isOverdue(reminder.date, reminder.time)
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-600/30"
                  : "bg-white/80 dark:bg-gray-800/80 border-pink-200 dark:border-purple-600/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <button
                      onClick={() => handleToggleComplete(reminder.id)}
                      className={`text-sm ${
                        reminder.completed
                          ? "text-green-500"
                          : "text-gray-400 hover:text-green-500"
                      }`}
                    >
                      {reminder.completed ? "✅" : "⭕"}
                    </button>
                    <span
                      className={`text-sm font-medium truncate ${
                        reminder.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {reminder.title}
                    </span>
                    <span className={getPriorityColor(reminder.priority)}>
                      {getPriorityIcon(reminder.priority)}
                    </span>
                    <span className="text-gray-500">
                      {getCategoryIcon(reminder.category)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      📅 {formatDateTime(reminder.date, reminder.time)}
                    </span>
                    {isOverdue(reminder.date, reminder.time) &&
                      !reminder.completed && (
                        <span className="text-red-500 font-medium text-xs">
                          OVERDUE
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(reminder)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {reminders.length > 0 && (
        <div className="p-2 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-pink-200 dark:border-purple-600/30">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Total: {reminders.length}</span>
            <span>Done: {reminders.filter((r) => r.completed).length}</span>
            <span>Pending: {reminders.filter((r) => !r.completed).length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
