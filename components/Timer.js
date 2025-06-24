"use client";

import { useState, useEffect, useRef } from "react";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState("");
  const intervalRef = useRef(null);

  const presetTimes = [
    { label: "5 min", minutes: 5 },
    { label: "10 min", minutes: 10 },
    { label: "15 min", minutes: 15 },
    { label: "25 min", minutes: 25 },
    { label: "30 min", minutes: 30 },
    { label: "60 min", minutes: 60 },
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play notification sound or show alert
            if (typeof window !== "undefined" && "Notification" in window) {
              new Notification("Timer Complete! ⏰", {
                body: "Your timer has finished!",
                icon: "/favicon.ico",
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const startTimer = (minutes) => {
    setTimeLeft(minutes * 60);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setInputMinutes("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    if (!inputMinutes && !timeLeft) return 0;
    const totalSeconds = inputMinutes ? parseInt(inputMinutes) * 60 : 0;
    const remaining = timeLeft;
    return totalSeconds > 0
      ? ((totalSeconds - remaining) / totalSeconds) * 100
      : 0;
  };

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-4">
          {/* Progress Circle */}
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="4"
              className="dark:stroke-gray-700"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${
                2 * Math.PI * 54 * (1 - getProgressPercentage() / 100)
              }`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isRunning ? "Running" : timeLeft > 0 ? "Paused" : "Ready"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-2">
        {!isRunning ? (
          <button
            onClick={() => inputMinutes && startTimer(parseInt(inputMinutes))}
            disabled={!inputMinutes || parseInt(inputMinutes) <= 0}
            className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Start ▶️
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Pause ⏸️
          </button>
        )}
        <button
          onClick={resetTimer}
          className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Reset 🔄
        </button>
      </div>

      {/* Custom Time Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Custom Time (minutes)
        </label>
        <input
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          placeholder="Enter minutes..."
          className="w-full px-3 py-2 border border-pink-200 dark:border-purple-600/30 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          min="1"
          max="1440"
        />
      </div>

      {/* Preset Times */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Quick Start ⚡
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presetTimes.map((preset) => (
            <button
              key={preset.minutes}
              onClick={() => {
                setInputMinutes(preset.minutes.toString());
                startTimer(preset.minutes);
              }}
              className="px-3 py-2 text-sm bg-gradient-to-r from-pink-50 to-purple-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-pink-200 dark:border-purple-600/30 rounded-lg hover:from-pink-100 hover:to-purple-100 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      {timeLeft > 0 && (
        <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-pink-200 dark:border-purple-600/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRunning ? "⏰ Timer is running..." : "⏸️ Timer is paused"}
          </p>
        </div>
      )}
    </div>
  );
}
