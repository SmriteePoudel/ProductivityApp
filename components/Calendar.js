"use client";

import { useState } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-pink-100 dark:hover:bg-purple-600/20 transition-colors"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-pink-100 dark:hover:bg-purple-600/20 transition-colors"
        >
          →
        </button>
      </div>

      {/* Selected Date Display */}
      <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-pink-200 dark:border-purple-600/30">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selected Date
        </p>
        <p className="font-medium text-gray-800 dark:text-gray-200">
          {formatDate(selectedDate)}
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && setSelectedDate(day)}
              disabled={!day}
              className={`
                aspect-square text-sm font-medium rounded-lg transition-all duration-200
                ${!day ? "invisible" : ""}
                ${
                  isToday(day)
                    ? "bg-gradient-to-br from-yellow-300 to-yellow-400 text-white shadow-md"
                    : isSelected(day)
                    ? "bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-md"
                    : "hover:bg-pink-100 dark:hover:bg-purple-600/20 text-gray-700 dark:text-gray-300"
                }
              `}
            >
              {day ? day.getDate() : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <button
          onClick={() => setSelectedDate(new Date())}
          className="w-full py-2 px-3 text-sm bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Today 📅
        </button>
      </div>
    </div>
  );
}
