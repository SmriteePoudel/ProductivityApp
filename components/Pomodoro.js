"use client";

import { useState, useEffect, useRef } from "react";

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work"); // 'work', 'shortBreak', 'longBreak'
  const [sessions, setSessions] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef(null);

  const pomodoroSettings = {
    work: 25 * 60, // 25 minutes
    shortBreak: 5 * 60, // 5 minutes
    longBreak: 15 * 60, // 15 minutes
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
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

  const handleTimerComplete = () => {
    setIsRunning(false);

    // Play notification
    if (typeof window !== "undefined" && "Notification" in window) {
      const message =
        mode === "work"
          ? "Work session complete! Time for a break! 🎉"
          : "Break complete! Ready to work? 💪";

      new Notification("Pomodoro Complete! 🍅", {
        body: message,
        icon: "/favicon.ico",
      });
    }

    // Update session count
    if (mode === "work") {
      setCompletedPomodoros((prev) => prev + 1);
      setSessions((prev) => prev + 1);

      // After 4 work sessions, take a long break
      if ((completedPomodoros + 1) % 4 === 0) {
        setMode("longBreak");
        setTimeLeft(pomodoroSettings.longBreak);
      } else {
        setMode("shortBreak");
        setTimeLeft(pomodoroSettings.shortBreak);
      }
    } else {
      // Break completed, start work session
      setMode("work");
      setTimeLeft(pomodoroSettings.work);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(pomodoroSettings[mode]);
  };

  const skipToNext = () => {
    setIsRunning(false);
    if (mode === "work") {
      setMode("shortBreak");
      setTimeLeft(pomodoroSettings.shortBreak);
    } else {
      setMode("work");
      setTimeLeft(pomodoroSettings.work);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    const totalTime = pomodoroSettings[mode];
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getModeColor = () => {
    switch (mode) {
      case "work":
        return "from-pink-400 to-purple-500";
      case "shortBreak":
        return "from-yellow-400 to-yellow-500";
      case "longBreak":
        return "from-blue-400 to-blue-500";
      default:
        return "from-pink-400 to-purple-500";
    }
  };

  const getModeEmoji = () => {
    switch (mode) {
      case "work":
        return "💼";
      case "shortBreak":
        return "☕";
      case "longBreak":
        return "🌴";
      default:
        return "🍅";
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case "work":
        return "Work Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return "Pomodoro";
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Display */}
      <div className="text-center">
        <div className="text-2xl mb-2">{getModeEmoji()}</div>
        <div
          className={`text-lg font-semibold bg-gradient-to-r ${getModeColor()} bg-clip-text text-transparent`}
        >
          {getModeLabel()}
        </div>
      </div>

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
              stroke={`url(#${mode}Gradient)`}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${
                2 * Math.PI * 54 * (1 - getProgressPercentage() / 100)
              }`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient
                id="workGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient
                id="shortBreakGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient
                id="longBreakGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${getModeColor()} bg-clip-text text-transparent`}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isRunning ? "Running" : "Ready"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-2">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className={`px-4 py-2 bg-gradient-to-r ${getModeColor()} text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg`}
          >
            Start ▶️
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg"
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
        <button
          onClick={skipToNext}
          className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Skip ⏭️
        </button>
      </div>

      {/* Session Stats */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
          Session Progress 📊
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-pink-200 dark:border-purple-600/30 text-center">
            <div className="text-lg font-bold text-pink-500 dark:text-pink-400">
              {completedPomodoros}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Completed 🍅
            </div>
          </div>
          <div className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-600/30 text-center">
            <div className="text-lg font-bold text-yellow-500 dark:text-yellow-400">
              {sessions}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Sessions 📝
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro Info */}
      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-600/30">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Pomodoro Technique ℹ️
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Work for 25 minutes</li>
          <li>• Take a 5-minute break</li>
          <li>• After 4 sessions, take a 15-minute break</li>
          <li>• Stay focused and avoid distractions</li>
        </ul>
      </div>
    </div>
  );
}
