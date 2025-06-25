"use client";

import { useState, useEffect } from "react";

export default function EditableContent() {
  const [content, setContent] = useState({
    tips: [],
    motivation: [],
    goals: [],
  });
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");

  // Auto-generated content
  const autoTips = [
    "Take breaks every 25 minutes using the Pomodoro technique",
    "Start your day with the most important task",
    "Use the 2-minute rule: if it takes less than 2 minutes, do it now",
    "Keep your workspace clean and organized",
    "Set specific, measurable goals for better focus",
    "Practice gratitude to boost your mood and productivity",
    "Stay hydrated throughout the day",
    "Use the Eisenhower Matrix to prioritize tasks",
  ];

  const autoMotivation = [
    "Every expert was once a beginner. Keep going! ✨",
    "Your future self is watching you right now through memories",
    "Small progress is still progress. Celebrate every step! 🌸",
    "You are capable of amazing things. Believe in yourself! 💫",
    "Today's efforts are tomorrow's achievements",
    "The only bad workout is the one that didn't happen",
    "You have the power to create the life you want",
    "Every day is a new opportunity to be better",
  ];

  const autoGoals = [
    "Complete 3 important tasks today",
    "Read for 30 minutes",
    "Exercise for at least 20 minutes",
    "Practice a new skill for 15 minutes",
    "Connect with a friend or family member",
    "Learn something new today",
    "Help someone else achieve their goal",
    "Reflect on your progress and celebrate wins",
  ];

  useEffect(() => {
    // Load saved content or use auto-generated content
    const savedContent = localStorage.getItem("editableContent");
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    } else {
      // Use auto-generated content for first time
      setContent({
        tips: autoTips.slice(0, 3),
        motivation: autoMotivation.slice(0, 3),
        goals: autoGoals.slice(0, 3),
      });
    }
  }, []);

  const saveContent = (newContent) => {
    setContent(newContent);
    localStorage.setItem("editableContent", JSON.stringify(newContent));
  };

  const startEditing = (type, index, text) => {
    setEditing({ type, index });
    setEditText(text);
  };

  const saveEdit = () => {
    if (editing && editText.trim()) {
      const newContent = { ...content };
      newContent[editing.type][editing.index] = editText.trim();
      saveContent(newContent);
    }
    setEditing(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditText("");
  };

  const addNewItem = (type) => {
    const newContent = { ...content };
    const defaultTexts = {
      tips: "Add your productivity tip here...",
      motivation: "Add your motivation quote here...",
      goals: "Add your goal here...",
    };
    newContent[type].push(defaultTexts[type]);
    saveContent(newContent);
    startEditing(type, newContent[type].length - 1, defaultTexts[type]);
  };

  const deleteItem = (type, index) => {
    const newContent = { ...content };
    newContent[type].splice(index, 1);
    saveContent(newContent);
  };

  const generateNewContent = (type) => {
    const generators = {
      tips: autoTips,
      motivation: autoMotivation,
      goals: autoGoals,
    };

    const available = generators[type].filter(
      (item) => !content[type].includes(item)
    );

    if (available.length > 0) {
      const randomItem =
        available[Math.floor(Math.random() * available.length)];
      const newContent = { ...content };
      newContent[type].push(randomItem);
      saveContent(newContent);
    }
  };

  const renderContentSection = (type, title, icon) => (
    <div className="bg-white/60 dark:bg-gray-700/60 rounded-lg p-3 border border-pink-100 dark:border-purple-600">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
          {icon} {title}
        </h4>
        <div className="flex gap-1">
          <button
            onClick={() => generateNewContent(type)}
            className="text-xs bg-pink-100 dark:bg-purple-900/30 text-pink-600 dark:text-purple-400 px-2 py-1 rounded hover:bg-pink-200 dark:hover:bg-purple-900/50 transition-colors"
            title="Generate new content"
          >
            ✨
          </button>
          <button
            onClick={() => addNewItem(type)}
            className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            title="Add new item"
          >
            ➕
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {content[type].map((item, index) => (
          <div key={index} className="relative group">
            {editing?.type === type && editing?.index === index ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-pink-200 dark:border-purple-500 rounded px-2 py-1 resize-none"
                  rows="2"
                  autoFocus
                />
                <div className="flex gap-1">
                  <button
                    onClick={saveEdit}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between group">
                <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 pr-2">
                  {item}
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => startEditing(type, index, item)}
                    className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteItem(type, index)}
                    className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderContentSection("tips", "Productivity Tips", "💡")}
      {renderContentSection("motivation", "Daily Motivation", "🌟")}
      {renderContentSection("goals", "Today's Goals", "🎯")}
    </div>
  );
}
