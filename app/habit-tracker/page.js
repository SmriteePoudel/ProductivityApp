"use client";

import { useState, useEffect } from "react";
import AIChatBot from "../../components/AIChatBot";

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    frequency: "daily",
    goal: 1,
    category: "health",
    color: "#3B82F6",
  });
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showForm, setShowForm] = useState(false);

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Initialize with dummy data
      const dummyHabits = [
        {
          id: 1,
          name: "Morning Exercise",
          description: "30 minutes of cardio or strength training",
          frequency: "daily",
          goal: 1,
          category: "health",
          color: "#10B981",
          streak: 5,
          totalCompletions: 25,
          createdAt: "2024-01-01",
          completions: {
            "2024-01-15": 1,
            "2024-01-16": 1,
            "2024-01-17": 1,
            "2024-01-18": 1,
            "2024-01-19": 1,
          },
        },
        {
          id: 2,
          name: "Read Books",
          description: "Read at least 20 pages",
          frequency: "daily",
          goal: 1,
          category: "learning",
          color: "#8B5CF6",
          streak: 3,
          totalCompletions: 18,
          createdAt: "2024-01-01",
          completions: {
            "2024-01-17": 1,
            "2024-01-18": 1,
            "2024-01-19": 1,
          },
        },
        {
          id: 3,
          name: "Drink Water",
          description: "Drink 8 glasses of water",
          frequency: "daily",
          goal: 8,
          category: "health",
          color: "#06B6D4",
          streak: 7,
          totalCompletions: 42,
          createdAt: "2024-01-01",
          completions: {
            "2024-01-13": 8,
            "2024-01-14": 8,
            "2024-01-15": 8,
            "2024-01-16": 8,
            "2024-01-17": 8,
            "2024-01-18": 8,
            "2024-01-19": 8,
          },
        },
        {
          id: 4,
          name: "Meditation",
          description: "10 minutes of mindfulness",
          frequency: "daily",
          goal: 1,
          category: "wellness",
          color: "#F59E0B",
          streak: 2,
          totalCompletions: 12,
          createdAt: "2024-01-01",
          completions: {
            "2024-01-18": 1,
            "2024-01-19": 1,
          },
        },
      ];
      setHabits(dummyHabits);
      localStorage.setItem("habits", JSON.stringify(dummyHabits));
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;

    const habit = {
      id: Date.now(),
      ...newHabit,
      streak: 0,
      totalCompletions: 0,
      createdAt: new Date().toISOString().split("T")[0],
      completions: {},
    };

    setHabits([...habits, habit]);
    setNewHabit({
      name: "",
      description: "",
      frequency: "daily",
      goal: 1,
      category: "health",
      color: "#3B82F6",
    });
    setShowForm(false);
  };

  const updateHabit = (e) => {
    e.preventDefault();
    if (!editingHabit.name.trim()) return;

    setHabits(
      habits.map((habit) =>
        habit.id === editingHabit.id ? editingHabit : habit
      )
    );
    setEditingHabit(null);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const toggleHabitCompletion = (habitId) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const currentCompletions = habit.completions[selectedDate] || 0;
          const newCompletions = currentCompletions > 0 ? 0 : habit.goal;

          const updatedCompletions = {
            ...habit.completions,
            [selectedDate]: newCompletions,
          };

          // Calculate new streak and total completions
          const totalCompletions = Object.values(updatedCompletions).reduce(
            (sum, val) => sum + val,
            0
          );

          // Simple streak calculation (can be improved)
          let streak = 0;
          const dates = Object.keys(updatedCompletions).sort();
          for (let i = dates.length - 1; i >= 0; i--) {
            if (updatedCompletions[dates[i]] > 0) {
              streak++;
            } else {
              break;
            }
          }

          return {
            ...habit,
            completions: updatedCompletions,
            streak,
            totalCompletions,
          };
        }
        return habit;
      })
    );
  };

  const getCompletionStatus = (habit) => {
    const completions = habit.completions[selectedDate] || 0;
    const goal = habit.goal;

    if (completions === 0) return "not-started";
    if (completions >= goal) return "completed";
    return "partial";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      health: "💪",
      learning: "📚",
      wellness: "🧘",
      productivity: "⚡",
      social: "👥",
      creative: "🎨",
    };
    return icons[category] || "📋";
  };

  const getFrequencyText = (frequency) => {
    const texts = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
    };
    return texts[frequency] || frequency;
  };

  const getStats = () => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(
      (habit) => (habit.completions[selectedDate] || 0) >= habit.goal
    ).length;
    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const totalCompletions = habits.reduce(
      (sum, habit) => sum + habit.totalCompletions,
      0
    );

    return { totalHabits, completedToday, totalStreak, totalCompletions };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <span>🏠</span> Go to Dashboard
            </button>
            <div className="flex-1"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🎯 Habit Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Build better habits, track your progress, and achieve your goals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalHabits}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Habits
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completedToday}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completed Today
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.totalStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Streak
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.totalCompletions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Completions
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Track Progress
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Add Habit Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <span>➕</span> Add New Habit
          </button>
        </div>

        {/* Add Habit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Add New Habit
            </h3>
            <form onSubmit={addHabit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Habit name"
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <select
                  value={newHabit.category}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, category: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="health">Health</option>
                  <option value="learning">Learning</option>
                  <option value="wellness">Wellness</option>
                  <option value="productivity">Productivity</option>
                  <option value="social">Social</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              <textarea
                placeholder="Description"
                value={newHabit.description}
                onChange={(e) =>
                  setNewHabit({ ...newHabit, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newHabit.frequency}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, frequency: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <input
                  type="number"
                  placeholder="Goal"
                  value={newHabit.goal}
                  onChange={(e) =>
                    setNewHabit({
                      ...newHabit,
                      goal: parseInt(e.target.value) || 1,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="1"
                />
                <input
                  type="color"
                  value={newHabit.color}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, color: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Habit
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Habit Form */}
        {editingHabit && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Edit Habit
            </h3>
            <form onSubmit={updateHabit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Habit name"
                  value={editingHabit.name}
                  onChange={(e) =>
                    setEditingHabit({ ...editingHabit, name: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <select
                  value={editingHabit.category}
                  onChange={(e) =>
                    setEditingHabit({
                      ...editingHabit,
                      category: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="health">Health</option>
                  <option value="learning">Learning</option>
                  <option value="wellness">Wellness</option>
                  <option value="productivity">Productivity</option>
                  <option value="social">Social</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              <textarea
                placeholder="Description"
                value={editingHabit.description}
                onChange={(e) =>
                  setEditingHabit({
                    ...editingHabit,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={editingHabit.frequency}
                  onChange={(e) =>
                    setEditingHabit({
                      ...editingHabit,
                      frequency: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <input
                  type="number"
                  placeholder="Goal"
                  value={editingHabit.goal}
                  onChange={(e) =>
                    setEditingHabit({
                      ...editingHabit,
                      goal: parseInt(e.target.value) || 1,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="1"
                />
                <input
                  type="color"
                  value={editingHabit.color}
                  onChange={(e) =>
                    setEditingHabit({ ...editingHabit, color: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Habit
                </button>
                <button
                  type="button"
                  onClick={() => setEditingHabit(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Habits List */}
        <div className="space-y-4">
          {habits.map((habit) => {
            const status = getCompletionStatus(habit);
            const completions = habit.completions[selectedDate] || 0;

            return (
              <div
                key={habit.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4"
                style={{ borderLeftColor: habit.color }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {getCategoryIcon(habit.category)}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {habit.name}
                      </h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {getFrequencyText(habit.frequency)}
                      </span>
                    </div>
                    {habit.description && (
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {habit.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>🔥 {habit.streak} day streak</span>
                      <span>📊 {habit.totalCompletions} total completions</span>
                      <span>🎯 Goal: {habit.goal}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingHabit(habit)}
                      className="text-blue-500 hover:text-blue-700 text-lg"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-500 hover:text-red-700 text-lg"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>
                      Progress: {completions}/{habit.goal}
                    </span>
                    <span>{Math.round((completions / habit.goal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (completions / habit.goal) * 100,
                          100
                        )}%`,
                        backgroundColor: habit.color,
                      }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => toggleHabitCompletion(habit.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    status === "completed"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : status === "partial"
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {status === "completed"
                    ? "✅ Completed"
                    : status === "partial"
                    ? "🔄 Partially Done"
                    : "⭕ Mark as Done"}
                </button>
              </div>
            );
          })}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No habits yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start building better habits by adding your first one!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Add Your First Habit
            </button>
          </div>
        )}
      </div>

      {/* AI Chat Bot */}
      <AIChatBot />
    </div>
  );
}
