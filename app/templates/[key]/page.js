"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, use as usePromise } from "react";
import TemplateDetailPanel from "@/components/UnifiedDashboard";
import AIChatBot from "@/components/AIChatBot";

const selfCarePrompts = [
  {
    title: "How am I feeling today, emotionally and physically?",
    desc: "Helps users tune into their mind–body connection.",
  },
  {
    title: "What's one kind thing I did for myself today?",
    desc: "Reinforces positive habits and self-appreciation.",
  },
  {
    title: "What drained my energy today, and what recharged it?",
    desc: "Encourages awareness around boundaries and energy sources.",
  },
  {
    title: "What is something I'm grateful for right now?",
    desc: "Promotes a mindset of gratitude and presence.",
  },
  {
    title:
      "If I could give myself one gentle piece of advice today, what would it be?",
    desc: "Builds inner compassion and wisdom.",
  },
];

const emojiOptions = [
  "💧",
  "📚",
  "🏃‍♀️",
  "🧘‍♂️",
  "🍎",
  "🛏️",
  "📝",
  "🎧",
  "💪",
  "🌞",
  "🌙",
  "🧠",
  "❤️",
  "🦷",
  "🥗",
  "🚶‍♂️",
  "🧹",
  "🧴",
  "🧑‍💻",
  "🎨",
  "🎵",
];
const tagOptions = [
  "#Health",
  "#Mind",
  "#Productivity",
  "#Wellness",
  "#Fitness",
  "#Learning",
  "#Routine",
  "#SelfCare",
];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TemplateDetailPage({ params }) {
  const router = useRouter();
  const { key } = params;

  // Template configurations
  const templates = {
    "study-planner": {
      title: "Study Planner",
      description:
        "Organize your academic life with subjects, topics, and revision schedules",
      color: "from-purple-600 to-indigo-700",
      accent: "purple",
      icon: "📚",
    },
    "meal-planner": {
      title: "Meal Planner",
      description: "Plan your meals, track nutrition, and manage your diet",
      color: "from-green-500 to-emerald-600",
      accent: "green",
      icon: "🍽️",
    },
    "fitness-tracker": {
      title: "Fitness Tracker",
      description:
        "Track workouts, monitor progress, and achieve fitness goals",
      color: "from-blue-500 to-cyan-600",
      accent: "blue",
      icon: "💪",
    },
    "finance-manager": {
      title: "Finance Manager",
      description: "Manage expenses, track income, and plan your budget",
      color: "from-yellow-500 to-orange-600",
      accent: "yellow",
      icon: "💰",
    },
    "habit-tracker": {
      title: "Habit Tracker",
      description: "Build positive habits and track your daily routines",
      color: "from-pink-500 to-rose-600",
      accent: "pink",
      icon: "✅",
    },
    "reading-list": {
      title: "Reading List",
      description: "Organize your reading goals and track your progress",
      color: "from-teal-500 to-cyan-600",
      accent: "teal",
      icon: "📖",
    },
    "travel-planner": {
      title: "Travel Planner",
      description: "Plan trips, manage itineraries, and track travel expenses",
      color: "from-indigo-500 to-purple-600",
      accent: "indigo",
      icon: "✈️",
    },
  };

  const template = templates[key];
  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Template Not Found
          </h1>
          <button
            onClick={() => router.push("/templates")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  // Move all hooks to the top level, before any conditional logic
  const [notFound, setNotFound] = useState(false);
  const [answers, setAnswers] = useState(Array(5).fill(""));
  const [editing, setEditing] = useState(Array(5).fill(false));

  // Add all template redirects at the top level
  useEffect(() => {
    if (key === "fitness") {
      router.push("/fitness-tracker");
    } else if (key === "finance") {
      router.push("/finance-manager");
    } else if (key === "reading") {
      router.push("/reading-list");
    } else if (key === "habit") {
      router.push("/habit-tracker");
    } else if (key === "travel") {
      router.push("/travel-planner");
    } else if (key === "meal") {
      router.push("/meal-planner");
    }
  }, [key, router]);

  // --- Habit Tracker State ---
  const [habits, setHabits] = useState([
    {
      name: "Drink 2L Water",
      icon: "💧",
      tag: "#Health",
      frequency: "daily",
      customDays: [1, 3, 5],
      reminders: ["09:00"],
      checkins: {},
      notes: {},
    },
  ]);
  const [newHabit, setNewHabit] = useState({
    name: "",
    icon: "💧",
    tag: "#Health",
    frequency: "daily",
    customDays: [],
    reminders: ["09:00"],
  });
  const [selectedHabit, setSelectedHabit] = useState(0);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  // --- Study Planner State ---
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: "", color: "#3B82F6" });
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({
    subject: "",
    name: "",
    priority: "medium",
  });
  const [schedule, setSchedule] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    subject: "",
    topic: "",
    date: "",
    time: "",
    duration: 60,
  });
  const [tasks, setTasks] = useState([
    { name: "Read Chapter 5", deadline: "", done: false },
    { name: "Essay Draft", deadline: "", done: false },
  ]);
  const [newTask, setNewTask] = useState({ name: "", deadline: "" });
  const [revisions, setRevisions] = useState([]);
  const [newRevision, setNewRevision] = useState({
    subject: "",
    topic: "",
    date: "",
    notes: "",
  });
  const [motivation, setMotivation] = useState(
    "Success is the sum of small efforts, repeated day in and day out."
  );
  const [pomodoro, setPomodoro] = useState({
    session: 25,
    break: 5,
    running: false,
    timeLeft: 1500,
    mode: "session",
  });
  const [pomodoroInput, setPomodoroInput] = useState({ session: 25, break: 5 });
  const [pomodoroInterval, setPomodoroInterval] = useState(null);
  // --- Finance State ---
  const [incomeRows, setIncomeRows] = useState([
    { date: "", source: "", amount: "" },
  ]);
  const [expenseRows, setExpenseRows] = useState([
    { date: "", category: "", amount: "" },
  ]);
  const [budgetRows, setBudgetRows] = useState([
    { category: "", budgeted: "", spent: "", notes: "" },
  ]);
  const [savingsGoals, setSavingsGoals] = useState([
    { goal: "", target: "", saved: "" },
  ]);
  const [debtRows, setDebtRows] = useState([
    { creditor: "", amount: "", due: "", status: "" },
  ]);
  // --- Meal Planner State ---
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    day: "",
    mealType: "breakfast",
    name: "",
    ingredients: "",
    calories: "",
  });
  const [recipeLibrary, setRecipeLibrary] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [shoppingList, setShoppingList] = useState([]);
  const [dietPrefs, setDietPrefs] = useState({
    vegetarian: false,
    allergies: "",
    custom: "",
  });
  const [water, setWater] = useState(0);
  const [leftovers, setLeftovers] = useState([]);

  // Add missing Pomodoro timer functions
  const startPomodoro = () => {
    setPomodoro((p) => ({ ...p, running: true }));
  };
  const pausePomodoro = () => {
    setPomodoro((p) => ({ ...p, running: false }));
  };
  const resetPomodoro = () => {
    setPomodoro((p) => ({
      ...p,
      running: false,
      timeLeft: p.mode === "session" ? p.session * 60 : p.break * 60,
    }));
  };
  const updatePomodoroSettings = () => {
    setPomodoro((p) => ({
      ...p,
      session: pomodoroInput.session,
      break: pomodoroInput.break,
      timeLeft:
        p.mode === "session"
          ? pomodoroInput.session * 60
          : pomodoroInput.break * 60,
      running: false,
    }));
  };

  // --- useEffect for templates ---
  useEffect(() => {
    const savedData = localStorage.getItem(`template_${key}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      if (key === "study-planner") {
        setSubjects(data.subjects || []);
        setTopics(data.topics || []);
        setSchedule(data.schedule || []);
        setRevisions(data.revisions || []);
        setPomodoro(
          data.pomodoro || {
            session: 25,
            break: 5,
            running: false,
            timeLeft: 1500,
            mode: "session",
          }
        );
      } else if (key === "meal-planner") {
        setMeals(data.meals || []);
      }
    }
  }, [key]);

  useEffect(() => {
    if (key === "study-planner") {
      localStorage.setItem(
        `template_${key}`,
        JSON.stringify({
          subjects,
          topics,
          schedule,
          revisions,
          pomodoro,
        })
      );
    } else if (key === "meal-planner") {
      localStorage.setItem(`template_${key}`, JSON.stringify({ meals }));
    }
  }, [subjects, topics, schedule, revisions, pomodoro, meals, key]);

  // Study Planner Functions
  const addSubject = () => {
    if (newSubject.name.trim()) {
      setSubjects([...subjects, { ...newSubject, id: Date.now() }]);
      setNewSubject({ name: "", color: "#3B82F6" });
    }
  };

  const addTopic = () => {
    if (newTopic.subject && newTopic.name.trim()) {
      setTopics([...topics, { ...newTopic, id: Date.now() }]);
      setNewTopic({ subject: "", name: "", priority: "medium" });
    }
  };

  const addSchedule = () => {
    if (newSchedule.subject && newSchedule.topic && newSchedule.date) {
      setSchedule([...schedule, { ...newSchedule, id: Date.now() }]);
      setNewSchedule({
        subject: "",
        topic: "",
        date: "",
        time: "",
        duration: 60,
      });
    }
  };

  const addRevision = () => {
    if (newRevision.subject && newRevision.topic && newRevision.date) {
      setRevisions([...revisions, { ...newRevision, id: Date.now() }]);
      setNewRevision({ subject: "", topic: "", date: "", notes: "" });
    }
  };

  // Meal Planner Functions
  const addMeal = () => {
    if (newMeal.day && newMeal.mealType && newMeal.name.trim()) {
      setMeals([...meals, { ...newMeal, id: Date.now() }]);
      setNewMeal({
        day: "",
        mealType: "breakfast",
        name: "",
        ingredients: "",
        calories: "",
      });
    }
  };

  const deleteMeal = (id) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
    setTopics(
      topics.filter(
        (topic) =>
          !subjects.find((s) => s.id === id) ||
          topic.subject !== subjects.find((s) => s.id === id).name
      )
    );
  };

  const deleteTopic = (id) => {
    setTopics(topics.filter((topic) => topic.id !== id));
  };

  const deleteSchedule = (id) => {
    setSchedule(schedule.filter((item) => item.id !== id));
  };

  const deleteRevision = (id) => {
    setRevisions(revisions.filter((item) => item.id !== id));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getMealTypeColor = (type) => {
    switch (type) {
      case "breakfast":
        return "bg-orange-100 text-orange-800";
      case "lunch":
        return "bg-green-100 text-green-800";
      case "dinner":
        return "bg-purple-100 text-purple-800";
      case "snack":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStudyPlanner = () => (
    <div className="space-y-8">
      {/* Subjects Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3 text-3xl">📚</span>
          Subjects
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Subject name"
                value={newSubject.name}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, name: e.target.value })
                }
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
              <input
                type="color"
                value={newSubject.color}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, color: e.target.value })
                }
                className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
              />
              <button
                onClick={addSubject}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                Add
              </button>
            </div>
            <div className="space-y-3">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    <span className="font-semibold text-gray-800">
                      {subject.name}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3 text-3xl">📝</span>
          Topics
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={newTopic.subject}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, subject: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Topic name"
                value={newTopic.name}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, name: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
              <select
                value={newTopic.priority}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, priority: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <button
              onClick={addTopic}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              Add Topic
            </button>
            <div className="space-y-3">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800 mr-3">
                      {topic.name}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(
                        topic.priority
                      )}`}
                    >
                      {topic.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTopic(topic.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3 text-3xl">📅</span>
          Study Schedule
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={newSchedule.subject}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, subject: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <select
                value={newSchedule.topic}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, topic: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select Topic</option>
                {topics
                  .filter((t) => t.subject === newSchedule.subject)
                  .map((topic) => (
                    <option key={topic.id} value={topic.name}>
                      {topic.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="date"
                value={newSchedule.date}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, date: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
              <input
                type="time"
                value={newSchedule.time}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, time: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
              <input
                type="number"
                placeholder="Duration (min)"
                value={newSchedule.duration}
                onChange={(e) =>
                  setNewSchedule({
                    ...newSchedule,
                    duration: parseInt(e.target.value),
                  })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={addSchedule}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            >
              Add to Schedule
            </button>
            <div className="space-y-3">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200"
                >
                  <div>
                    <div className="font-semibold text-gray-800">
                      {item.subject} - {item.topic}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.date} at {item.time} ({item.duration} min)
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSchedule(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro Timer Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3 text-3xl">⏰</span>
          Pomodoro Timer
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-purple-600 mb-4">
              {formatTime(pomodoro.timeLeft)}
            </div>
            <div className="text-lg text-gray-600 mb-6">
              {pomodoro.mode === "session" ? "Study Session" : "Break Time"}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startPomodoro}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                Start
              </button>
              <button
                onClick={pausePomodoro}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
              >
                Pause
              </button>
              <button
                onClick={resetPomodoro}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Session (min)
                </label>
                <input
                  type="number"
                  value={pomodoroInput.session}
                  onChange={(e) =>
                    setPomodoroInput({
                      ...pomodoroInput,
                      session: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Break (min)
                </label>
                <input
                  type="number"
                  value={pomodoroInput.break}
                  onChange={(e) =>
                    setPomodoroInput({
                      ...pomodoroInput,
                      break: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <button
              onClick={updatePomodoroSettings}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Update Settings
            </button>
          </div>
        </div>
      </div>

      {/* Revision Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3 text-3xl">🔄</span>
          Revision Notes
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={newRevision.subject}
                onChange={(e) =>
                  setNewRevision({ ...newRevision, subject: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <select
                value={newRevision.topic}
                onChange={(e) =>
                  setNewRevision({ ...newRevision, topic: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select Topic</option>
                {topics
                  .filter((t) => t.subject === newRevision.subject)
                  .map((topic) => (
                    <option key={topic.id} value={topic.name}>
                      {topic.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="date"
                value={newRevision.date}
                onChange={(e) =>
                  setNewRevision({ ...newRevision, date: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Revision notes..."
                value={newRevision.notes}
                onChange={(e) =>
                  setNewRevision({ ...newRevision, notes: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                rows="3"
              />
            </div>
            <button
              onClick={addRevision}
              className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            >
              Add Revision
            </button>
            <div className="space-y-3">
              {revisions.map((revision) => (
                <div
                  key={revision.id}
                  className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-800">
                      {revision.subject} - {revision.topic}
                    </div>
                    <button
                      onClick={() => deleteRevision(revision.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Date: {revision.date}
                  </div>
                  <div className="text-gray-700">{revision.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMealPlanner = () => (
    <div className="space-y-8">
      {/* Add Meal Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3 text-3xl">🍽️</span>
          Add Meal
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={newMeal.day}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, day: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              <select
                value={newMeal.mealType}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, mealType: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Meal name"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Ingredients"
                value={newMeal.ingredients}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, ingredients: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              />
              <input
                type="number"
                placeholder="Calories"
                value={newMeal.calories}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, calories: e.target.value })
                }
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={addMeal}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              Add Meal
            </button>
          </div>
        </div>
      </div>

      {/* Meals List Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3 text-3xl">📋</span>
          Weekly Meal Plan
        </h3>
        <div className="space-y-6">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => {
            const dayMeals = meals.filter((meal) => meal.day === day);
            return (
              <div
                key={day}
                className="border-2 border-gray-200 rounded-xl p-4"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg">
                  {day}
                </h4>
                {dayMeals.length === 0 ? (
                  <p className="text-gray-500 italic">No meals planned</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dayMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-semibold ${getMealTypeColor(
                              meal.mealType
                            )}`}
                          >
                            {meal.mealType}
                          </span>
                          <button
                            onClick={() => deleteMeal(meal.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                        <h5 className="font-semibold text-gray-800 mb-2">
                          {meal.name}
                        </h5>
                        {meal.ingredients && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Ingredients:</strong> {meal.ingredients}
                          </p>
                        )}
                        {meal.calories && (
                          <p className="text-sm text-gray-600">
                            <strong>Calories:</strong> {meal.calories}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${template.color} text-white shadow-2xl`}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-5xl mr-4">{template.icon}</span>
              <div>
                <h1 className="text-4xl font-bold mb-2">{template.title}</h1>
                <p className="text-xl opacity-90">{template.description}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/templates")}
                className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105 border border-white border-opacity-30"
              >
                ← Back to Templates
              </button>
              <button
                onClick={() => router.push(`/${key.replace("-", "-")}`)}
                className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {key === "study-planner" && renderStudyPlanner()}
        {key === "meal-planner" && renderMealPlanner()}

        {/* AI Chat Bot */}
        <div className="mt-12">
          <AIChatBot />
        </div>
      </div>
    </div>
  );
}
