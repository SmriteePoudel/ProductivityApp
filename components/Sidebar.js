"use client";

import { useState, useEffect } from "react";

export default function Sidebar({ onLogout }) {
  const [openProjects, setOpenProjects] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [isDark, setIsDark] = useState(false);

  // Sync theme on mount and when toggled
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("appearance");
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (stored === "dark" || (!stored && systemDark)) {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      } else {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const currentlyDark = document.documentElement.classList.contains("dark");
      if (currentlyDark) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("appearance", "light");
        setIsDark(false);
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("appearance", "dark");
        setIsDark(true);
      }
    }
  };

  return (
    <aside className="flex flex-col h-screen w-64 border-r shadow-xl bg-white/90 border-gray-200 dark:bg-[#181c2a] dark:border-gray-800 transition-colors duration-300">
      {/* Logo/Header */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800 justify-between transition-colors duration-300">
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-wide">
          Dashboard
        </span>
        <button
          onClick={toggleTheme}
          className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-yellow-500 dark:text-yellow-300"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <span role="img" aria-label="Light mode">
              🌞
            </span>
          ) : (
            <span role="img" aria-label="Dark mode">
              🌙
            </span>
          )}
        </button>
      </div>
      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <button
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                active === "dashboard"
                  ? "bg-accent/20 text-accent"
                  : "text-gray-700 dark:text-gray-200 hover:bg-accent/10 hover:text-accent"
              }`}
              onClick={() => setActive("dashboard")}
            >
              <span className="text-lg">🏠</span>
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                openProjects
                  ? "bg-accent/20 text-accent"
                  : "text-gray-700 dark:text-gray-200 hover:bg-accent/10 hover:text-accent"
              }`}
              onClick={() => setOpenProjects((v) => !v)}
            >
              <span className="text-lg">📁</span>
              <span>Projects</span>
              <span className="ml-auto text-xs">
                {openProjects ? "▲" : "▼"}
              </span>
            </button>
            {openProjects && (
              <ul className="ml-4 mt-1 border-l border-accent pl-2 space-y-1">
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                      active === "project-categories"
                        ? "bg-accent/20 text-accent"
                        : "text-gray-700 dark:text-gray-200 hover:bg-accent/10 hover:text-accent"
                    }`}
                    onClick={() => setActive("project-categories")}
                  >
                    <span className="text-lg">🏷️</span>
                    <span>Project Categories</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                      active === "projects"
                        ? "bg-accent/20 text-accent"
                        : "text-gray-700 dark:text-gray-200 hover:bg-accent/10 hover:text-accent"
                    }`}
                    onClick={() => setActive("projects")}
                  >
                    <span className="text-lg">📋</span>
                    <span>Projects</span>
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                active === "templates"
                  ? "bg-accent/20 text-accent"
                  : "text-gray-700 dark:text-gray-200 hover:bg-accent/10 hover:text-accent"
              }`}
              onClick={() => setActive("templates")}
            >
              <span className="text-lg">🗂️</span>
              <span>Templates</span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                active === "settings"
                  ? "bg-accent/20 text-accent"
                  : "text-gray-700 dark:text-gray-200 hover:bg-accent/10 hover:text-accent"
              }`}
              onClick={() => setActive("settings")}
            >
              <span className="text-lg">⚙️</span>
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <button
          className="w-full flex items-center gap-2 px-4 py-2 bg-pastel-pink text-gray-900 rounded-lg hover:bg-pastel-blue transition-all duration-200 shadow-md hover:shadow-lg font-bold"
          onClick={onLogout}
        >
          <span className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            N
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}
