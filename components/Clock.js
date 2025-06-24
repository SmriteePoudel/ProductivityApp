"use client";

import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSecondsDegrees = () => {
    return (time.getSeconds() / 60) * 360;
  };

  const getMinutesDegrees = () => {
    return ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  };

  const getHoursDegrees = () => {
    return (((time.getHours() % 12) + time.getMinutes() / 60) / 12) * 360;
  };

  return (
    <div className="space-y-6">
      {/* Digital Clock */}
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(time)}
        </div>
      </div>

      {/* Analog Clock */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          {/* Clock Face */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-50 to-purple-50 dark:from-purple-900/20 dark:to-pink-900/20 border-4 border-pink-200 dark:border-purple-600/30 shadow-lg">
            {/* Hour Markers */}
            {[...Array(12)].map((_, i) => {
              const angle = i * 30 * (Math.PI / 180);
              const x = 50 + 40 * Math.sin(angle);
              const y = 50 - 40 * Math.cos(angle);
              return (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-pink-400 dark:bg-pink-300 rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              );
            })}

            {/* Hour Hand */}
            <div
              className="absolute top-1/2 left-1/2 w-1 h-12 bg-pink-500 dark:bg-pink-400 rounded-full origin-bottom shadow-md"
              style={{
                transform: `translate(-50%, -100%) rotate(${getHoursDegrees()}deg)`,
              }}
            />

            {/* Minute Hand */}
            <div
              className="absolute top-1/2 left-1/2 w-1 h-16 bg-purple-500 dark:bg-purple-400 rounded-full origin-bottom shadow-md"
              style={{
                transform: `translate(-50%, -100%) rotate(${getMinutesDegrees()}deg)`,
              }}
            />

            {/* Second Hand */}
            <div
              className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-yellow-400 dark:bg-yellow-300 rounded-full origin-bottom shadow-md"
              style={{
                transform: `translate(-50%, -100%) rotate(${getSecondsDegrees()}deg)`,
              }}
            />

            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg" />
          </div>
        </div>
      </div>

      {/* Time Zones */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          World Clock 🌍
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between items-center p-2 bg-pink-50 dark:bg-purple-900/20 rounded">
            <span className="text-gray-600 dark:text-gray-400">New York</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {time.toLocaleTimeString("en-US", {
                timeZone: "America/New_York",
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-pink-900/20 rounded">
            <span className="text-gray-600 dark:text-gray-400">London</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {time.toLocaleTimeString("en-US", {
                timeZone: "Europe/London",
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <span className="text-gray-600 dark:text-gray-400">Tokyo</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {time.toLocaleTimeString("en-US", {
                timeZone: "Asia/Tokyo",
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
