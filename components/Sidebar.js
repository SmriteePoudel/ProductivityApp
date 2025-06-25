"use client";

import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import Clock from "./Clock";
import Timer from "./Timer";
import Pomodoro from "./Pomodoro";
import Reminders from "./Reminders";
import EditableContent from "./EditableContent";

export default function Sidebar({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("calendar");

  const tabs = [
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "clock", label: "Clock", icon: "🕐" },
    { id: "timer", label: "Timer", icon: "⏱️" },
    { id: "pomodoro", label: "Pomodoro", icon: "🍅" },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-yellow dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 backdrop-blur-md border-r border-accent shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-accent bg-gradient-to-r from-pastel-pink to-pastel-blue">
          <h2 className="text-xl font-bold gradient-text">Tools ✨</h2>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-accent transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-accent bg-gradient-to-r from-pastel-yellow to-pastel-blue">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium transition-colors rounded-t-lg ${
                activeTab === tab.id
                  ? "bg-pastel-blue text-accent border-b-2 border-accent shadow"
                  : "text-gray-600 dark:text-gray-400 hover:bg-pastel-pink hover:text-accent"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tools Content Area - Fixed Height with Scroll */}
        <div className="flex-1 flex flex-col">
          {/* Tools Display Area */}
          <div className="flex-1 p-4">
            <div className={`${activeTab === "calendar" ? "block" : "hidden"}`}>
              <Calendar />
            </div>
            <div className={`${activeTab === "clock" ? "block" : "hidden"}`}>
              <Clock />
            </div>
            <div className={`${activeTab === "timer" ? "block" : "hidden"}`}>
              <Timer />
            </div>
            <div className={`${activeTab === "pomodoro" ? "block" : "hidden"}`}>
              <Pomodoro />
            </div>
          </div>

          {/* Scrollable Content Area Below Tools */}
          <div className="border-t border-accent bg-pastel-yellow/60">
            <div className="p-3 bg-pastel-pink border-b border-accent">
              <h3 className="text-sm font-medium text-accent mb-2">
                📋 Personal Content
              </h3>
            </div>
            <div className="h-64 overflow-y-auto sidebar-scrollbar">
              <div className="p-4">
                <EditableContent />
              </div>
            </div>
          </div>
        </div>

        {/* Reminders Section - Bottom of Sidebar */}
        <div className="border-t border-accent p-4 bg-pastel-blue/40">
          <Reminders />
        </div>
      </div>
    </>
  );
}
