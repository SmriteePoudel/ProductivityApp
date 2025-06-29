"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Define all available templates
    const allTemplates = [
      {
        key: "study-planner",
        title: "Study Planner",
        description:
          "Organize your academic life with subjects, topics, and revision schedules",
        color: "from-purple-600 to-indigo-700",
        accent: "purple",
        icon: "📚",
        features: [
          "Subject Management",
          "Topic Organization",
          "Study Schedule",
          "Pomodoro Timer",
          "Revision Tracking",
        ],
      },
      {
        key: "meal-planner",
        title: "Meal Planner",
        description: "Plan your meals, track nutrition, and manage your diet",
        color: "from-green-500 to-emerald-600",
        accent: "green",
        icon: "🍽️",
        features: [
          "Weekly Meal Planning",
          "Nutrition Tracking",
          "Recipe Management",
          "Shopping Lists",
          "Diet Preferences",
        ],
      },
      {
        key: "fitness-tracker",
        title: "Fitness Tracker",
        description:
          "Track workouts, monitor progress, and achieve fitness goals",
        color: "from-blue-500 to-cyan-600",
        accent: "blue",
        icon: "💪",
        features: [
          "Workout Logging",
          "Progress Tracking",
          "Goal Setting",
          "Exercise Library",
          "Performance Analytics",
        ],
      },
      {
        key: "finance-manager",
        title: "Finance Manager",
        description: "Manage expenses, track income, and plan your budget",
        color: "from-yellow-500 to-orange-600",
        accent: "yellow",
        icon: "💰",
        features: [
          "Expense Tracking",
          "Income Management",
          "Budget Planning",
          "Financial Goals",
          "Reports & Analytics",
        ],
      },
      {
        key: "habit-tracker",
        title: "Habit Tracker",
        description: "Build positive habits and track your daily routines",
        color: "from-pink-500 to-rose-600",
        accent: "pink",
        icon: "✅",
        features: [
          "Habit Streaks",
          "Daily Tracking",
          "Goal Setting",
          "Progress Visualization",
          "Reminders",
        ],
      },
      {
        key: "reading-list",
        title: "Reading List",
        description: "Organize your reading goals and track your progress",
        color: "from-teal-500 to-cyan-600",
        accent: "teal",
        icon: "📖",
        features: [
          "Book Management",
          "Reading Progress",
          "Notes & Reviews",
          "Reading Goals",
          "Recommendations",
        ],
      },
      {
        key: "travel-planner",
        title: "Travel Planner",
        description:
          "Plan trips, manage itineraries, and track travel expenses",
        color: "from-indigo-500 to-purple-600",
        accent: "indigo",
        icon: "✈️",
        features: [
          "Trip Planning",
          "Itinerary Management",
          "Packing Lists",
          "Expense Tracking",
          "Travel Notes",
        ],
      },
    ];

    setTemplates(allTemplates);
  }, []);

  const handleTemplateClick = (templateKey) => {
    router.push(`/templates/${templateKey}`);
  };

  const handleUseTemplate = (templateKey) => {
    router.push(`/${templateKey.replace("-", "-")}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-700 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              📋 Productivity Templates
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Choose from our collection of powerful templates designed to boost
              your productivity and organize your life
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div
              key={template.key}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Template Header */}
              <div
                className={`bg-gradient-to-r ${template.color} text-white p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{template.icon}</span>
                  <div className="text-right">
                    <h3 className="text-2xl font-bold">{template.title}</h3>
                  </div>
                </div>
                <p className="text-white opacity-90">{template.description}</p>
              </div>

              {/* Template Features */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Key Features:
                </h4>
                <ul className="space-y-2 mb-6">
                  {template.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleTemplateClick(template.key)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template.key)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Choose a template that fits your needs and start organizing your
              life today. All templates are fully customizable and designed to
              help you achieve your goals.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
