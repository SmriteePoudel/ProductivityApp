"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, use as usePromise } from "react";
import TemplateDetailPanel from "@/components/UnifiedDashboard";

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
  const { key } = usePromise(params);
  const [template, setTemplate] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(5).fill(""));
  const [editing, setEditing] = useState(Array(5).fill(false));

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
  const [subjects, setSubjects] = useState([
    { name: "Math", topics: ["Algebra", "Geometry"] },
    { name: "History", topics: ["WWII", "Renaissance"] },
  ]);
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState({ subjectIdx: 0, name: "" });
  const [schedule, setSchedule] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    day: "Mon",
    time: "09:00",
    subject: "",
    topic: "",
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

  // --- Finance State (unchanged) ---
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
  const [mealSchedule, setMealSchedule] = useState([
    // { day: 'Mon', time: 'Breakfast', meal: '', notes: '', feedback: '', adherence: false }
  ]);
  const [newMeal, setNewMeal] = useState({
    day: "Mon",
    time: "Breakfast",
    meal: "",
    notes: "",
  });
  const [recipeLibrary, setRecipeLibrary] = useState([
    // { name: 'Oatmeal', ingredients: '', instructions: '', calories: '', protein: '', carbs: '', fats: '' }
  ]);
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
  const [leftovers, setLeftovers] = useState([
    // { name: 'Chili', date: '2024-06-01', notes: '' }
  ]);

  // --- Habit Tracker Handlers ---
  const getStreak = (habit) => {
    const days = Object.keys(habit.checkins || {}).sort();
    let streak = 0,
      maxStreak = 0,
      last = null;
    days.forEach((d) => {
      if (habit.checkins[d]) {
        if (!last || new Date(d) - new Date(last) === 86400000) streak++;
        else streak = 1;
        if (streak > maxStreak) maxStreak = streak;
        last = d;
      } else {
        streak = 0;
      }
    });
    return { current: streak, longest: maxStreak };
  };
  const getSuccessRate = (habit) => {
    const total = Object.keys(habit.checkins || {}).length;
    const done = Object.values(habit.checkins || {}).filter(Boolean).length;
    return total ? Math.round((done / total) * 100) : 0;
  };
  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    setHabits([...habits, { ...newHabit, checkins: {}, notes: {} }]);
    setNewHabit({
      name: "",
      icon: "💧",
      tag: "#Health",
      frequency: "daily",
      customDays: [],
      reminders: ["09:00"],
    });
  };
  const deleteHabit = (idx) => {
    setHabits(habits.filter((_, i) => i !== idx));
    if (selectedHabit === idx) setSelectedHabit(0);
  };
  const updateHabit = (idx, data) => {
    setHabits(habits.map((h, i) => (i === idx ? { ...h, ...data } : h)));
  };
  const toggleCheckin = (idx, d) => {
    setHabits(
      habits.map((h, i) =>
        i === idx
          ? { ...h, checkins: { ...h.checkins, [d]: !h.checkins?.[d] } }
          : h
      )
    );
  };
  const setNote = (idx, d, note) => {
    setHabits(
      habits.map((h, i) =>
        i === idx ? { ...h, notes: { ...h.notes, [d]: note } } : h
      )
    );
  };

  // --- Study Planner Handlers ---
  const addSubject = () => {
    if (!newSubject.trim()) return;
    setSubjects([...subjects, { name: newSubject.trim(), topics: [] }]);
    setNewSubject("");
  };
  const deleteSubject = (idx) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };
  const addTopic = () => {
    if (!newTopic.name.trim()) return;
    setSubjects(
      subjects.map((s, i) =>
        i === newTopic.subjectIdx
          ? { ...s, topics: [...s.topics, newTopic.name.trim()] }
          : s
      )
    );
    setNewTopic({ subjectIdx: 0, name: "" });
  };
  const deleteTopic = (subjectIdx, topicIdx) => {
    setSubjects(
      subjects.map((s, i) =>
        i === subjectIdx
          ? { ...s, topics: s.topics.filter((_, j) => j !== topicIdx) }
          : s
      )
    );
  };
  const addSchedule = () => {
    if (!newSchedule.subject || !newSchedule.topic) return;
    setSchedule([...schedule, { ...newSchedule }]);
    setNewSchedule({ day: "Mon", time: "09:00", subject: "", topic: "" });
  };
  const deleteSchedule = (idx) => {
    setSchedule(schedule.filter((_, i) => i !== idx));
  };
  const addTask = () => {
    if (!newTask.name.trim()) return;
    setTasks([...tasks, { ...newTask, done: false }]);
    setNewTask({ name: "", deadline: "" });
  };
  const toggleTask = (idx) => {
    setTasks(tasks.map((t, i) => (i === idx ? { ...t, done: !t.done } : t)));
  };
  const deleteTask = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };
  const addRevision = () => {
    if (!newRevision.subject || !newRevision.topic || !newRevision.date) return;
    setRevisions([...revisions, { ...newRevision }]);
    setNewRevision({ subject: "", topic: "", date: "", notes: "" });
  };
  const deleteRevision = (idx) => {
    setRevisions(revisions.filter((_, i) => i !== idx));
  };
  const startPomodoro = () => setPomodoro((p) => ({ ...p, running: true }));
  const pausePomodoro = () => {
    setPomodoro((p) => ({ ...p, running: false }));
    if (pomodoroInterval) clearInterval(pomodoroInterval);
  };
  const resetPomodoro = () => {
    setPomodoro((p) => ({
      ...p,
      running: false,
      timeLeft: p.session * 60,
      mode: "session",
    }));
    if (pomodoroInterval) clearInterval(pomodoroInterval);
  };
  const updatePomodoroSettings = () => {
    setPomodoro((p) => ({
      ...p,
      session: pomodoroInput.session,
      break: pomodoroInput.break,
      timeLeft: pomodoroInput.session * 60,
      mode: "session",
      running: false,
    }));
  };

  // --- Finance State (unchanged) ---
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);

  // --- Meal Planner Handlers ---
  const addMeal = () => {
    if (!newMeal.meal.trim()) return;
    setMealSchedule([
      ...mealSchedule,
      { ...newMeal, feedback: "", adherence: false },
    ]);
    setNewMeal({ day: "Mon", time: "Breakfast", meal: "", notes: "" });
  };
  const deleteMeal = (idx) =>
    setMealSchedule(mealSchedule.filter((_, i) => i !== idx));
  const updateMeal = (idx, data) =>
    setMealSchedule(
      mealSchedule.map((m, i) => (i === idx ? { ...m, ...data } : m))
    );
  const addRecipe = () => {
    if (!newRecipe.name.trim()) return;
    setRecipeLibrary([...recipeLibrary, { ...newRecipe }]);
    setNewRecipe({
      name: "",
      ingredients: "",
      instructions: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
    });
  };
  const deleteRecipe = (idx) =>
    setRecipeLibrary(recipeLibrary.filter((_, i) => i !== idx));
  const addToShoppingList = (ingredients) => {
    setShoppingList([
      ...shoppingList,
      ...ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
    ]);
  };
  const removeShoppingItem = (idx) =>
    setShoppingList(shoppingList.filter((_, i) => i !== idx));
  const updateDietPrefs = (field, value) =>
    setDietPrefs((p) => ({ ...p, [field]: value }));
  const addLeftover = (name, date, notes) =>
    setLeftovers([...leftovers, { name, date, notes }]);
  const deleteLeftover = (idx) =>
    setLeftovers(leftovers.filter((_, i) => i !== idx));
  const updateLeftover = (idx, data) =>
    setLeftovers(leftovers.map((l, i) => (i === idx ? { ...l, ...data } : l)));
  const incrementWater = () => setWater((w) => w + 1);
  const decrementWater = () => setWater((w) => (w > 0 ? w - 1 : 0));

  // --- useEffect for templates ---
  useEffect(() => {
    let templates = [];
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("templates");
      if (saved) templates = JSON.parse(saved);
    }
    if (!templates.length) {
      templates = [
        {
          key: "fitness",
          name: "Fitness Tracker",
          icon: "🏋️‍♂️",
          description:
            "Track workouts, set fitness goals, and monitor progress.",
        },
        {
          key: "finance",
          name: "Finance Manager",
          icon: "💰",
          description: "Manage budgets, expenses, and savings with ease.",
        },
        {
          key: "study",
          name: "Study Planner",
          icon: "📚",
          description: "Organize study sessions, assignments, and deadlines.",
        },
        {
          key: "habit",
          name: "Habit Tracker",
          icon: "✅",
          description: "Build and track daily habits for personal growth.",
        },
        {
          key: "meal",
          name: "Meal Planner",
          icon: "🍽️",
          description: "Plan meals, grocery lists, and track nutrition.",
        },
        {
          key: "project",
          name: "Project Roadmap",
          icon: "🗺️",
          description: "Visualize project milestones and timelines.",
        },
        {
          key: "reading",
          name: "Reading List",
          icon: "📖",
          description: "Keep track of books and articles you want to read.",
        },
        {
          key: "travel",
          name: "Travel Planner",
          icon: "✈️",
          description: "Organize trips, itineraries, and packing lists.",
        },
        {
          key: "selfcare",
          name: "Self-Care Journal",
          icon: "🧘‍♀️",
          description: "Reflect on your well-being and self-care routines.",
        },
      ];
    }
    const found = templates.find((t) => t.key === key);
    if (found) setTemplate(found);
    else setNotFound(true);
  }, [key]);

  // --- useEffect for Pomodoro (study) ---
  useEffect(() => {
    if (key !== "study") return;
    if (pomodoro.running && pomodoro.timeLeft > 0) {
      const interval = setInterval(() => {
        setPomodoro((p) => ({ ...p, timeLeft: p.timeLeft - 1 }));
      }, 1000);
      setPomodoroInterval(interval);
      return () => clearInterval(interval);
    } else if (pomodoro.timeLeft === 0) {
      setPomodoro((p) => {
        if (p.mode === "session") {
          return { ...p, mode: "break", timeLeft: p.break * 60 };
        } else {
          return { ...p, mode: "session", timeLeft: p.session * 60 };
        }
      });
    }
    return () => {};
  }, [pomodoro.running, pomodoro.timeLeft, key]);

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto mt-20 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 border border-accent text-center">
        <h2 className="text-2xl font-bold gradient-text mb-4">
          Template Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Sorry, we couldn't find that template.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }
  if (!template) return null;

  if (key === "habit") {
    // Stats dashboard
    const stats = habits.map((h) => ({
      name: h.name,
      streak: getStreak(h),
      rate: getSuccessRate(h),
      tag: h.tag,
      icon: h.icon,
    }));
    const mostConsistent = stats.reduce(
      (a, b) => (a.rate > b.rate ? a : b),
      stats[0] || {}
    );
    const longestStreak = stats.reduce(
      (a, b) => (a.streak.longest > b.streak.longest ? a : b),
      stats[0] || {}
    );
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-400 via-yellow-200 via-green-200 to-blue-300 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4">
        <div className="max-w-5xl w-full grid grid-cols-1 gap-8">
          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
              <div className="font-bold text-lg gradient-text mb-1">
                Most Consistent Habit
              </div>
              <div className="text-2xl">
                {mostConsistent?.icon} {mostConsistent?.name || "-"}
              </div>
              <div className="text-xs text-gray-500">
                Success Rate: {mostConsistent?.rate || 0}%
              </div>
            </div>
            <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
              <div className="font-bold text-lg gradient-text mb-1">
                Longest Streak
              </div>
              <div className="text-2xl">
                {longestStreak?.icon} {longestStreak?.name || "-"}
              </div>
              <div className="text-xs text-gray-500">
                Longest: {longestStreak?.streak?.longest || 0} days
              </div>
            </div>
            <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
              <div className="font-bold text-lg gradient-text mb-1">
                Most Productive Day
              </div>
              <div className="text-2xl">{weekDays[new Date().getDay()]}</div>
              <div className="text-xs text-gray-500">
                (Feature: analyze check-ins by day)
              </div>
            </div>
          </div>
          {/* Habit List & Add Habit */}
          <div className="bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 border-2 border-accent rounded-2xl shadow-xl p-6">
            <div className="font-bold text-lg gradient-text mb-2">
              Habit List
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              {habits.map((h, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 shadow bg-white/80 border-2 border-accent flex flex-col items-center min-w-[180px] relative ${
                    selectedHabit === idx ? "ring-4 ring-accent" : ""
                  }`}
                >
                  <button
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                    onClick={() => deleteHabit(idx)}
                  >
                    ✕
                  </button>
                  <div className="text-3xl mb-1">{h.icon}</div>
                  <div className="font-semibold mb-1">{h.name}</div>
                  <div className="text-xs mb-1">{h.tag}</div>
                  <div className="text-xs mb-1">
                    {h.frequency === "custom"
                      ? h.customDays.map((d) => weekDays[d]).join(", ")
                      : h.frequency.charAt(0).toUpperCase() +
                        h.frequency.slice(1)}
                  </div>
                  <button
                    className="mt-2 px-3 py-1 rounded bg-pastel-pink text-accent text-xs font-semibold"
                    onClick={() => setSelectedHabit(idx)}
                  >
                    View
                  </button>
                </div>
              ))}
              {/* Add Habit Card */}
              <div className="rounded-xl p-4 shadow bg-white/80 border-2 border-accent flex flex-col items-center min-w-[180px]">
                <div className="text-3xl mb-1">
                  <select
                    value={newHabit.icon}
                    onChange={(e) =>
                      setNewHabit((h) => ({ ...h, icon: e.target.value }))
                    }
                    className="bg-transparent"
                  >
                    {emojiOptions.map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <input
                  className="font-semibold mb-1 text-center bg-transparent border-b border-accent"
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit((h) => ({ ...h, name: e.target.value }))
                  }
                  placeholder="Habit name"
                />
                <select
                  className="text-xs mb-1 bg-transparent border-b border-accent"
                  value={newHabit.tag}
                  onChange={(e) =>
                    setNewHabit((h) => ({ ...h, tag: e.target.value }))
                  }
                >
                  {tagOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <select
                  className="text-xs mb-1 bg-transparent border-b border-accent"
                  value={newHabit.frequency}
                  onChange={(e) =>
                    setNewHabit((h) => ({ ...h, frequency: e.target.value }))
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
                {newHabit.frequency === "custom" && (
                  <div className="flex gap-1 mb-1">
                    {weekDays.map((d, i) => (
                      <button
                        key={d}
                        className={`px-2 py-1 rounded ${
                          newHabit.customDays.includes(i)
                            ? "bg-accent text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() =>
                          setNewHabit((h) => ({
                            ...h,
                            customDays: h.customDays.includes(i)
                              ? h.customDays.filter((x) => x !== i)
                              : [...h.customDays, i],
                          }))
                        }
                      >
                        {d[0]}
                      </button>
                    ))}
                  </div>
                )}
                <input
                  className="text-xs mb-1 text-center bg-transparent border-b border-accent"
                  value={newHabit.reminders[0]}
                  onChange={(e) =>
                    setNewHabit((h) => ({ ...h, reminders: [e.target.value] }))
                  }
                  placeholder="Reminder (e.g. 09:00)"
                />
                <button
                  className="mt-2 px-3 py-1 rounded bg-accent text-white text-xs font-semibold"
                  onClick={addHabit}
                >
                  Add Habit
                </button>
              </div>
            </div>
          </div>
          {/* Habit Details & Check-in Grid */}
          {habits[selectedHabit] && (
            <div className="bg-gradient-to-br from-blue-200 via-pink-200 to-yellow-200 border-2 border-accent rounded-2xl shadow-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{habits[selectedHabit].icon}</span>
                  <span className="font-bold text-lg gradient-text">
                    {habits[selectedHabit].name}
                  </span>
                  <span className="text-xs ml-2">
                    {habits[selectedHabit].tag}
                  </span>
                </div>
                <div className="flex gap-4 mt-2 md:mt-0">
                  <div className="text-xs">
                    Current Streak:{" "}
                    <span className="font-bold text-accent">
                      {getStreak(habits[selectedHabit]).current}
                    </span>
                  </div>
                  <div className="text-xs">
                    Longest:{" "}
                    <span className="font-bold text-accent">
                      {getStreak(habits[selectedHabit]).longest}
                    </span>
                  </div>
                  <div className="text-xs">
                    Success Rate:{" "}
                    <span className="font-bold text-accent">
                      {getSuccessRate(habits[selectedHabit])}%
                    </span>
                  </div>
                </div>
              </div>
              {/* Check-in Calendar/Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse mb-2">
                  <thead>
                    <tr>
                      {Array.from({ length: 14 }).map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - 13 + i);
                        return (
                          <th key={i}>
                            {weekDays[d.getDay()]}
                            <br />
                            {d.toISOString().slice(5, 10)}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {Array.from({ length: 14 }).map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - 13 + i);
                        const ds = d.toISOString().slice(0, 10);
                        const checked = habits[selectedHabit].checkins?.[ds];
                        return (
                          <td key={i} className="text-center">
                            <button
                              className={`w-7 h-7 rounded-full ${
                                checked ? "bg-accent text-white" : "bg-gray-200"
                              }`}
                              onClick={() => toggleCheckin(selectedHabit, ds)}
                            >
                              {checked ? "✔️" : ""}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Notes/Reflection */}
              <div className="mt-4">
                <div className="font-semibold mb-1">Notes / Reflection</div>
                <textarea
                  className="w-full min-h-[40px] rounded-lg border border-accent bg-white/70 p-2 text-gray-900 focus:ring-2 ring-accent outline-none"
                  value={habits[selectedHabit].notes?.[date] || ""}
                  onChange={(e) => setNote(selectedHabit, date, e.target.value)}
                  placeholder="How did you feel doing this habit?"
                />
              </div>
              {/* Reminders */}
              <div className="mt-4">
                <div className="font-semibold mb-1">Reminders</div>
                <input
                  className="w-32 bg-white/60 rounded px-2 border border-accent"
                  value={habits[selectedHabit].reminders[0]}
                  onChange={(e) =>
                    updateHabit(selectedHabit, { reminders: [e.target.value] })
                  }
                  placeholder="e.g. 09:00"
                />
                <span className="ml-2 text-xs text-gray-500">
                  (No notifications, just a reminder field)
                </span>
              </div>
            </div>
          )}
          {/* Export Data */}
          <div className="flex justify-end">
            <button
              className="px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
              onClick={() => {
                const csv = [
                  "Habit,Date,Checked,Note",
                  ...habits.flatMap((h) =>
                    Object.keys(h.checkins || {}).map(
                      (d) =>
                        `${h.name},${d},${h.checkins[d] ? "Yes" : "No"},"${
                          (h.notes || {})[d] || ""
                        }"`
                    )
                  ),
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "habit-tracker.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export Data (CSV)
            </button>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
        >
          ← Back to Templates
        </button>
      </div>
    );
  }

  if (key === "selfcare") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-yellow dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl w-full grid grid-cols-1 gap-6">
          {selfCarePrompts.map((prompt, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-pastel-blue via-pastel-pink to-pastel-yellow border-2 border-accent rounded-2xl shadow-xl p-6 flex flex-col gap-2"
            >
              <div className="font-bold text-lg gradient-text mb-1">
                {prompt.title}
              </div>
              <div className="text-xs text-gray-600 mb-2">{prompt.desc}</div>
              {editing[idx] ? (
                <>
                  <textarea
                    className="w-full min-h-[60px] rounded-lg border border-accent bg-white/70 p-2 text-gray-900 focus:ring-2 ring-accent outline-none"
                    value={answers[idx]}
                    onChange={(e) =>
                      setAnswers((a) =>
                        a.map((v, i) => (i === idx ? e.target.value : v))
                      )
                    }
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-4 py-1 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
                      onClick={() =>
                        setEditing((e) =>
                          e.map((v, i) => (i === idx ? false : v))
                        )
                      }
                    >
                      Save
                    </button>
                    <button
                      className="px-4 py-1 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                      onClick={() =>
                        setEditing((e) =>
                          e.map((v, i) => (i === idx ? false : v))
                        )
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="min-h-[40px] text-gray-800 bg-white/60 rounded p-2">
                    {answers[idx] || (
                      <span className="italic text-gray-400">
                        (No answer yet)
                      </span>
                    )}
                  </div>
                  <button
                    className="self-end px-3 py-1 rounded-lg font-semibold bg-pastel-pink text-accent hover:bg-pastel-blue hover:text-pastel-pink transition-all text-xs"
                    onClick={() =>
                      setEditing((e) => e.map((v, i) => (i === idx ? true : v)))
                    }
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
        >
          ← Back to Templates
        </button>
      </div>
    );
  }

  if (key === "finance") {
    // Reports & Analytics
    const totalIncome = incomeRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );
    const totalExpense = expenseRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );
    const totalBudgeted = budgetRows.reduce(
      (sum, row) => sum + Number(row.budgeted || 0),
      0
    );
    const totalSpent = budgetRows.reduce(
      (sum, row) => sum + Number(row.spent || 0),
      0
    );
    const totalSaved = savingsGoals.reduce(
      (sum, row) => sum + Number(row.saved || 0),
      0
    );
    const totalDebt = debtRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-yellow dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl w-full grid grid-cols-1 gap-6">
          {/* Income & Expense Tracker */}
          <div className="bg-gradient-to-br from-pastel-blue via-pastel-pink to-pastel-yellow border-2 border-accent rounded-2xl shadow-xl p-6">
            <div className="font-bold text-lg gradient-text mb-2">
              Income & Expense Tracker
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Income Table */}
              <div>
                <div className="font-semibold mb-1">Income</div>
                <table className="w-full text-xs border-collapse mb-2">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Source</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomeRows.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            className="w-full bg-white/60 rounded px-1"
                            value={row.date}
                            onChange={(e) =>
                              setIncomeRows((r) =>
                                r.map((v, i) =>
                                  i === idx ? { ...v, date: e.target.value } : v
                                )
                              )
                            }
                            placeholder="YYYY-MM-DD"
                          />
                        </td>
                        <td>
                          <input
                            className="w-full bg-white/60 rounded px-1"
                            value={row.source}
                            onChange={(e) =>
                              setIncomeRows((r) =>
                                r.map((v, i) =>
                                  i === idx
                                    ? { ...v, source: e.target.value }
                                    : v
                                )
                              )
                            }
                            placeholder="Source"
                          />
                        </td>
                        <td>
                          <input
                            className="w-full bg-white/60 rounded px-1"
                            value={row.amount}
                            onChange={(e) =>
                              setIncomeRows((r) =>
                                r.map((v, i) =>
                                  i === idx
                                    ? { ...v, amount: e.target.value }
                                    : v
                                )
                              )
                            }
                            placeholder="$"
                          />
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              setIncomeRows((r) =>
                                r.filter((_, i) => i !== idx)
                              )
                            }
                            className="text-red-500"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  className="px-2 py-1 rounded bg-pastel-pink text-accent text-xs font-semibold"
                  onClick={() =>
                    setIncomeRows((r) => [
                      ...r,
                      { date: "", source: "", amount: "" },
                    ])
                  }
                >
                  Add Income
                </button>
              </div>
              {/* Expense Table */}
              <div>
                <div className="font-semibold mb-1">Expenses</div>
                <table className="w-full text-xs border-collapse mb-2">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseRows.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            className="w-full bg-white/60 rounded px-1"
                            value={row.date}
                            onChange={(e) =>
                              setExpenseRows((r) =>
                                r.map((v, i) =>
                                  i === idx ? { ...v, date: e.target.value } : v
                                )
                              )
                            }
                            placeholder="YYYY-MM-DD"
                          />
                        </td>
                        <td>
                          <input
                            className="w-full bg-white/60 rounded px-1"
                            value={row.category}
                            onChange={(e) =>
                              setExpenseRows((r) =>
                                r.map((v, i) =>
                                  i === idx
                                    ? { ...v, category: e.target.value }
                                    : v
                                )
                              )
                            }
                            placeholder="Category"
                          />
                        </td>
                        <td>
                          <input
                            className="w-full bg-white/60 rounded px-1"
                            value={row.amount}
                            onChange={(e) =>
                              setExpenseRows((r) =>
                                r.map((v, i) =>
                                  i === idx
                                    ? { ...v, amount: e.target.value }
                                    : v
                                )
                              )
                            }
                            placeholder="$"
                          />
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              setExpenseRows((r) =>
                                r.filter((_, i) => i !== idx)
                              )
                            }
                            className="text-red-500"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  className="px-2 py-1 rounded bg-pastel-pink text-accent text-xs font-semibold"
                  onClick={() =>
                    setExpenseRows((r) => [
                      ...r,
                      { date: "", category: "", amount: "" },
                    ])
                  }
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
          {/* Budget Planner */}
          <div className="bg-gradient-to-br from-pastel-yellow via-pastel-blue to-pastel-pink border-2 border-accent rounded-2xl shadow-xl p-6">
            <div className="font-bold text-lg gradient-text mb-2">
              Budget Planner
            </div>
            <table className="w-full text-xs border-collapse mb-2">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budgeted</th>
                  <th>Spent</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {budgetRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.category}
                        onChange={(e) =>
                          setBudgetRows((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, category: e.target.value } : v
                            )
                          )
                        }
                        placeholder="Category"
                      />
                    </td>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.budgeted}
                        onChange={(e) =>
                          setBudgetRows((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, budgeted: e.target.value } : v
                            )
                          )
                        }
                        placeholder="$"
                      />
                    </td>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.spent}
                        onChange={(e) =>
                          setBudgetRows((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, spent: e.target.value } : v
                            )
                          )
                        }
                        placeholder="$"
                      />
                    </td>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.notes}
                        onChange={(e) =>
                          setBudgetRows((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, notes: e.target.value } : v
                            )
                          )
                        }
                        placeholder="Notes"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          setBudgetRows((r) => r.filter((_, i) => i !== idx))
                        }
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="px-2 py-1 rounded bg-pastel-pink text-accent text-xs font-semibold"
              onClick={() =>
                setBudgetRows((r) => [
                  ...r,
                  { category: "", budgeted: "", spent: "", notes: "" },
                ])
              }
            >
              Add Row
            </button>
          </div>
          {/* Savings Goals */}
          <div className="bg-gradient-to-br from-pastel-mint via-pastel-yellow to-pastel-blue border-2 border-accent rounded-2xl shadow-xl p-6">
            <div className="font-bold text-lg gradient-text mb-2">
              Savings Goals
            </div>
            <table className="w-full text-xs border-collapse mb-2">
              <thead>
                <tr>
                  <th>Goal</th>
                  <th>Target</th>
                  <th>Saved</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {savingsGoals.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.goal}
                        onChange={(e) =>
                          setSavingsGoals((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, goal: e.target.value } : v
                            )
                          )
                        }
                        placeholder="Goal"
                      />
                    </td>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.target}
                        onChange={(e) =>
                          setSavingsGoals((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, target: e.target.value } : v
                            )
                          )
                        }
                        placeholder="$"
                      />
                    </td>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.saved}
                        onChange={(e) =>
                          setSavingsGoals((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, saved: e.target.value } : v
                            )
                          )
                        }
                        placeholder="$"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          setSavingsGoals((r) => r.filter((_, i) => i !== idx))
                        }
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="px-2 py-1 rounded bg-pastel-pink text-accent text-xs font-semibold"
              onClick={() =>
                setSavingsGoals((r) => [
                  ...r,
                  { goal: "", target: "", saved: "" },
                ])
              }
            >
              Add Goal
            </button>
          </div>
          {/* Debt Tracker */}
          <div className="bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-yellow border-2 border-accent rounded-2xl shadow-xl p-6">
            <div className="font-bold text-lg gradient-text mb-2">
              Debt Tracker
            </div>
            <table className="w-full text-xs border-collapse mb-2">
              <thead>
                <tr>
                  <th>Creditor</th>
                  <th>Amount</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {debtRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.creditor}
                        onChange={(e) =>
                          setDebtRows((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, creditor: e.target.value } : v
                            )
                          )
                        }
                        placeholder="Creditor"
                      />
                    </td>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.amount}
                        onChange={(e) =>
                          setDebtRows((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, amount: e.target.value } : v
                            )
                          )
                        }
                        placeholder="$"
                      />
                    </td>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.due}
                        onChange={(e) =>
                          setDebtRows((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, due: e.target.value } : v
                            )
                          )
                        }
                        placeholder="YYYY-MM-DD"
                      />
                    </td>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={row.status}
                        onChange={(e) =>
                          setDebtRows((r) =>
                            r.map((v, i) =>
                              i === idx ? { ...v, status: e.target.value } : v
                            )
                          )
                        }
                        placeholder="Status"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          setDebtRows((r) => r.filter((_, i) => i !== idx))
                        }
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="px-2 py-1 rounded bg-pastel-pink text-accent text-xs font-semibold"
              onClick={() =>
                setDebtRows((r) => [
                  ...r,
                  { creditor: "", amount: "", due: "", status: "" },
                ])
              }
            >
              Add Debt
            </button>
          </div>
          {/* Reports & Analytics */}
          <div className="bg-gradient-to-br from-pastel-yellow via-pastel-mint to-pastel-blue border-2 border-accent rounded-2xl shadow-xl p-6">
            <div className="font-bold text-lg gradient-text mb-2">
              Reports & Analytics
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white/60 rounded p-3">
                <div className="font-semibold">Total Income</div>
                <div className="text-green-600 font-bold">${totalIncome}</div>
              </div>
              <div className="bg-white/60 rounded p-3">
                <div className="font-semibold">Total Expenses</div>
                <div className="text-red-500 font-bold">${totalExpense}</div>
              </div>
              <div className="bg-white/60 rounded p-3">
                <div className="font-semibold">Total Budgeted</div>
                <div className="text-blue-600 font-bold">${totalBudgeted}</div>
              </div>
              <div className="bg-white/60 rounded p-3">
                <div className="font-semibold">Total Spent</div>
                <div className="text-yellow-600 font-bold">${totalSpent}</div>
              </div>
              <div className="bg-white/60 rounded p-3">
                <div className="font-semibold">Total Saved</div>
                <div className="text-green-700 font-bold">${totalSaved}</div>
              </div>
              <div className="bg-white/60 rounded p-3">
                <div className="font-semibold">Total Debt</div>
                <div className="text-red-700 font-bold">${totalDebt}</div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
        >
          ← Back to Templates
        </button>
      </div>
    );
  }

  if (key === "study") {
    // Stats
    const completedTasks = tasks.filter((t) => t.done).length;
    const totalTasks = tasks.length;
    const revisionStreak = (() => {
      // Count consecutive days with at least one revision
      const dates = revisions.map((r) => r.date).sort();
      let streak = 0,
        last = null;
      dates.forEach((d) => {
        if (!last || new Date(d) - new Date(last) === 86400000) streak++;
        else streak = 1;
        last = d;
      });
      return streak;
    })();

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-yellow dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4">
        <div className="max-w-5xl w-full grid grid-cols-1 gap-8">
          {/* Motivation & Insights */}
          <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent mb-4">
            <div className="font-bold text-lg gradient-text mb-1">
              Motivation & Insights
            </div>
            <textarea
              className="w-full min-h-[40px] rounded-lg border border-accent bg-white/70 p-2 text-gray-900 focus:ring-2 ring-accent outline-none mb-2"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />
            <div className="text-xs text-gray-500">
              Completed Tasks: {completedTasks}/{totalTasks} | Revision Streak:{" "}
              {revisionStreak} days
            </div>
          </div>
          {/* Subject & Topic Management */}
          <div className="bg-gradient-to-br from-pastel-blue via-pastel-yellow to-pastel-pink border-2 border-accent rounded-2xl shadow-xl p-6 mb-4">
            <div className="font-bold text-lg gradient-text mb-2">
              Subjects & Topics
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              {subjects.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4 shadow bg-white/80 border-2 border-accent flex flex-col min-w-[180px] relative"
                >
                  <button
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                    onClick={() => deleteSubject(idx)}
                  >
                    ✕
                  </button>
                  <div className="font-semibold mb-1">{s.name}</div>
                  <ul className="text-xs mb-2">
                    {s.topics.map((t, tidx) => (
                      <li key={tidx} className="flex items-center gap-1">
                        <span>{t}</span>
                        <button
                          className="text-red-400 hover:text-red-600"
                          onClick={() => deleteTopic(idx, tidx)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  <input
                    className="text-xs mb-1 text-center bg-transparent border-b border-accent"
                    value={idx === newTopic.subjectIdx ? newTopic.name : ""}
                    onChange={(e) =>
                      setNewTopic({ subjectIdx: idx, name: e.target.value })
                    }
                    placeholder="Add topic"
                  />
                  <button
                    className="mt-1 px-2 py-1 rounded bg-pastel-pink text-accent text-xs font-semibold"
                    onClick={addTopic}
                  >
                    Add Topic
                  </button>
                </div>
              ))}
              {/* Add Subject Card */}
              <div className="rounded-xl p-4 shadow bg-white/80 border-2 border-accent flex flex-col min-w-[180px]">
                <input
                  className="font-semibold mb-1 text-center bg-transparent border-b border-accent"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Subject name"
                />
                <button
                  className="mt-2 px-3 py-1 rounded bg-accent text-white text-xs font-semibold"
                  onClick={addSubject}
                >
                  Add Subject
                </button>
              </div>
            </div>
          </div>
          {/* Daily/Weekly Study Schedule */}
          <div className="bg-gradient-to-br from-pastel-yellow via-pastel-blue to-pastel-pink border-2 border-accent rounded-2xl shadow-xl p-6 mb-4">
            <div className="font-bold text-lg gradient-text mb-2">
              Study Schedule
            </div>
            <div className="flex flex-wrap gap-4 mb-4 items-end">
              <select
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newSchedule.day}
                onChange={(e) =>
                  setNewSchedule((s) => ({ ...s, day: e.target.value }))
                }
              >
                {weekDays.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                type="time"
                value={newSchedule.time}
                onChange={(e) =>
                  setNewSchedule((s) => ({ ...s, time: e.target.value }))
                }
              />
              <select
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newSchedule.subject}
                onChange={(e) =>
                  setNewSchedule((s) => ({
                    ...s,
                    subject: e.target.value,
                    topic: "",
                  }))
                }
              >
                <option value="">Subject</option>
                {subjects.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>
              <select
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newSchedule.topic}
                onChange={(e) =>
                  setNewSchedule((s) => ({ ...s, topic: e.target.value }))
                }
              >
                <option value="">Topic</option>
                {subjects
                  .find((s) => s.name === newSchedule.subject)
                  ?.topics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
              </select>
              <button
                className="px-3 py-1 rounded bg-accent text-white text-xs font-semibold"
                onClick={addSchedule}
              >
                Add
              </button>
            </div>
            <table className="w-full text-xs border-collapse mb-2">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Topic</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.day}</td>
                    <td>{row.time}</td>
                    <td>{row.subject}</td>
                    <td>{row.topic}</td>
                    <td>
                      <button
                        className="text-red-400 hover:text-red-600"
                        onClick={() => deleteSchedule(idx)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Task & Deadline Tracker */}
          <div className="bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-yellow border-2 border-accent rounded-2xl shadow-xl p-6 mb-4">
            <div className="font-bold text-lg gradient-text mb-2">
              Task & Deadline Tracker
            </div>
            <div className="flex flex-wrap gap-4 mb-4 items-end">
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask((t) => ({ ...t, name: e.target.value }))
                }
                placeholder="Task name"
              />
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                type="date"
                value={newTask.deadline}
                onChange={(e) =>
                  setNewTask((t) => ({ ...t, deadline: e.target.value }))
                }
              />
              <button
                className="px-3 py-1 rounded bg-accent text-white text-xs font-semibold"
                onClick={addTask}
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {tasks.map((t, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 bg-white/60 rounded px-2 py-1 border border-accent"
                >
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(idx)}
                  />
                  <span className={t.done ? "line-through text-gray-400" : ""}>
                    {t.name}
                  </span>
                  {t.deadline && (
                    <span className="text-xs text-gray-500">
                      ({t.deadline})
                    </span>
                  )}
                  <button
                    className="text-red-400 hover:text-red-600"
                    onClick={() => deleteTask(idx)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Revision Tracker */}
          <div className="bg-gradient-to-br from-pastel-blue via-pastel-yellow to-pastel-pink border-2 border-accent rounded-2xl shadow-xl p-6 mb-4">
            <div className="font-bold text-lg gradient-text mb-2">
              Revision Tracker
            </div>
            <div className="flex flex-wrap gap-4 mb-4 items-end">
              <select
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newRevision.subject}
                onChange={(e) =>
                  setNewRevision((r) => ({
                    ...r,
                    subject: e.target.value,
                    topic: "",
                  }))
                }
              >
                <option value="">Subject</option>
                {subjects.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>
              <select
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newRevision.topic}
                onChange={(e) =>
                  setNewRevision((r) => ({ ...r, topic: e.target.value }))
                }
              >
                <option value="">Topic</option>
                {subjects
                  .find((s) => s.name === newRevision.subject)
                  ?.topics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
              </select>
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                type="date"
                value={newRevision.date}
                onChange={(e) =>
                  setNewRevision((r) => ({ ...r, date: e.target.value }))
                }
              />
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newRevision.notes}
                onChange={(e) =>
                  setNewRevision((r) => ({ ...r, notes: e.target.value }))
                }
                placeholder="Notes"
              />
              <button
                className="px-3 py-1 rounded bg-accent text-white text-xs font-semibold"
                onClick={addRevision}
              >
                Add
              </button>
            </div>
            <table className="w-full text-xs border-collapse mb-2">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Topic</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {revisions.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.date}</td>
                    <td>{r.subject}</td>
                    <td>{r.topic}</td>
                    <td>{r.notes}</td>
                    <td>
                      <button
                        className="text-red-400 hover:text-red-600"
                        onClick={() => deleteRevision(idx)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Study Mode Timer (Pomodoro) */}
          <div className="bg-gradient-to-br from-pastel-yellow via-pastel-blue to-pastel-pink border-2 border-accent rounded-2xl shadow-xl p-6 mb-4 flex flex-col items-center">
            <div className="font-bold text-lg gradient-text mb-2">
              Study Mode Timer (Pomodoro)
            </div>
            <div className="flex gap-4 items-center mb-2">
              <div className="text-4xl font-bold">
                {Math.floor(pomodoro.timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(pomodoro.timeLeft % 60).toString().padStart(2, "0")}
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="px-3 py-1 rounded bg-accent text-white text-xs font-semibold"
                  onClick={pomodoro.running ? pausePomodoro : startPomodoro}
                >
                  {pomodoro.running ? "Pause" : "Start"}
                </button>
                <button
                  className="px-3 py-1 rounded bg-pastel-pink text-accent text-xs font-semibold"
                  onClick={resetPomodoro}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="text-xs mb-2">
              Mode:{" "}
              <span className="font-semibold">
                {pomodoro.mode === "session" ? "Study" : "Break"}
              </span>
            </div>
            <div className="flex gap-2 items-center mb-2">
              <input
                className="w-12 bg-white/70 border border-accent rounded px-2 py-1 text-center"
                type="number"
                min="1"
                value={pomodoroInput.session}
                onChange={(e) =>
                  setPomodoroInput((i) => ({
                    ...i,
                    session: Number(e.target.value),
                  }))
                }
              />
              <span className="text-xs">min study</span>
              <input
                className="w-12 bg-white/70 border border-accent rounded px-2 py-1 text-center"
                type="number"
                min="1"
                value={pomodoroInput.break}
                onChange={(e) =>
                  setPomodoroInput((i) => ({
                    ...i,
                    break: Number(e.target.value),
                  }))
                }
              />
              <span className="text-xs">min break</span>
              <button
                className="px-2 py-1 rounded bg-accent text-white text-xs font-semibold"
                onClick={updatePomodoroSettings}
              >
                Set
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
        >
          ← Back to Templates
        </button>
      </div>
    );
  }

  if (key === "meal") {
    // Calculate nutrition totals
    const nutritionTotals = mealSchedule.reduce(
      (totals, m) => {
        const recipe = recipeLibrary.find((r) => r.name === m.meal);
        if (recipe) {
          totals.calories += Number(recipe.calories || 0);
          totals.protein += Number(recipe.protein || 0);
          totals.carbs += Number(recipe.carbs || 0);
          totals.fats += Number(recipe.fats || 0);
        }
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
    const mealTimes = ["Breakfast", "Lunch", "Dinner", "Snacks"];
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pastel-blue via-pastel-mint via-pastel-lavender via-pastel-peach via-pastel-pink to-pastel-yellow dark:from-gray-900 dark:via-blue-900 dark:to-gray-800 p-4">
        <div className="max-w-5xl w-full grid grid-cols-1 gap-8">
          {/* Diet & Preferences */}
          <div className="bg-white/90 rounded-xl p-4 shadow-2xl border-2 border-accent mb-4 backdrop-blur-md">
            <div className="font-bold text-lg gradient-text mb-1">
              Diet & Preferences
            </div>
            <div className="flex flex-wrap gap-4 items-center mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dietPrefs.vegetarian}
                  onChange={(e) =>
                    updateDietPrefs("vegetarian", e.target.checked)
                  }
                />{" "}
                Vegetarian
              </label>
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={dietPrefs.allergies}
                onChange={(e) => updateDietPrefs("allergies", e.target.value)}
                placeholder="Allergies (comma separated)"
              />
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={dietPrefs.custom}
                onChange={(e) => updateDietPrefs("custom", e.target.value)}
                placeholder="Other preferences"
              />
            </div>
          </div>
          {/* Weekly Meal Schedule */}
          <div className="bg-gradient-to-br from-pastel-mint via-pastel-blue to-pastel-peach border-2 border-accent rounded-2xl shadow-2xl p-6 mb-4">
            <div className="font-bold text-lg gradient-text mb-2">
              Weekly Meal Schedule
            </div>
            <div className="flex flex-wrap gap-4 mb-4 items-end">
              <select
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newMeal.day}
                onChange={(e) =>
                  setNewMeal((m) => ({ ...m, day: e.target.value }))
                }
              >
                {weekDays.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <select
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newMeal.time}
                onChange={(e) =>
                  setNewMeal((m) => ({ ...m, time: e.target.value }))
                }
              >
                {mealTimes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newMeal.meal}
                onChange={(e) =>
                  setNewMeal((m) => ({ ...m, meal: e.target.value }))
                }
                placeholder="Meal name"
              />
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newMeal.notes}
                onChange={(e) =>
                  setNewMeal((m) => ({ ...m, notes: e.target.value }))
                }
                placeholder="Prep notes"
              />
              <button
                className="px-3 py-1 rounded bg-accent text-white text-xs font-semibold shadow-md"
                onClick={addMeal}
              >
                Add
              </button>
            </div>
            <table className="w-full text-xs border-collapse mb-2">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Meal</th>
                  <th>Prep Notes</th>
                  <th>Feedback</th>
                  <th>Adherence</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mealSchedule.map((m, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-pastel-yellow/40 transition"
                  >
                    <td>{m.day}</td>
                    <td>{m.time}</td>
                    <td>{m.meal}</td>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={m.notes}
                        onChange={(e) =>
                          updateMeal(idx, { notes: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="w-full bg-white/60 rounded px-1"
                        value={m.feedback}
                        onChange={(e) =>
                          updateMeal(idx, { feedback: e.target.value })
                        }
                        placeholder="Feedback"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={m.adherence}
                        onChange={(e) =>
                          updateMeal(idx, { adherence: e.target.checked })
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="text-red-400 hover:text-red-600"
                        onClick={() => deleteMeal(idx)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Recipe/Meal Library */}
          <div className="bg-gradient-to-br from-pastel-peach via-pastel-blue to-pastel-lavender border-2 border-accent rounded-2xl shadow-2xl p-6 mb-4">
            <div className="font-bold text-lg gradient-text mb-2">
              Recipe/Meal Library
            </div>
            <div className="flex flex-wrap gap-4 mb-4 items-end">
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newRecipe.name}
                onChange={(e) =>
                  setNewRecipe((r) => ({ ...r, name: e.target.value }))
                }
                placeholder="Recipe name"
              />
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newRecipe.ingredients}
                onChange={(e) =>
                  setNewRecipe((r) => ({ ...r, ingredients: e.target.value }))
                }
                placeholder="Ingredients (comma separated)"
              />
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                value={newRecipe.instructions}
                onChange={(e) =>
                  setNewRecipe((r) => ({ ...r, instructions: e.target.value }))
                }
                placeholder="Instructions"
              />
              <input
                className="w-16 bg-white/70 border border-accent rounded px-2 py-1"
                value={newRecipe.calories}
                onChange={(e) =>
                  setNewRecipe((r) => ({ ...r, calories: e.target.value }))
                }
                placeholder="kcal"
              />
              <input
                className="w-16 bg-white/70 border border-accent rounded px-2 py-1"
                value={newRecipe.protein}
                onChange={(e) =>
                  setNewRecipe((r) => ({ ...r, protein: e.target.value }))
                }
                placeholder="g protein"
              />
              <input
                className="w-16 bg-white/70 border border-accent rounded px-2 py-1"
                value={newRecipe.carbs}
                onChange={(e) =>
                  setNewRecipe((r) => ({ ...r, carbs: e.target.value }))
                }
                placeholder="g carbs"
              />
              <input
                className="w-16 bg-white/70 border border-accent rounded px-2 py-1"
                value={newRecipe.fats}
                onChange={(e) =>
                  setNewRecipe((r) => ({ ...r, fats: e.target.value }))
                }
                placeholder="g fats"
              />
              <button
                className="px-3 py-1 rounded bg-accent text-white text-xs font-semibold shadow-md"
                onClick={addRecipe}
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {recipeLibrary.map((r, idx) => (
                <li
                  key={idx}
                  className="flex flex-col gap-1 bg-white/60 rounded px-2 py-1 border border-accent shadow-md"
                >
                  <div className="font-semibold text-pastel-blue drop-shadow">
                    {r.name}
                  </div>
                  <div className="text-xs">Ingredients: {r.ingredients}</div>
                  <div className="text-xs">Instructions: {r.instructions}</div>
                  <div className="text-xs">
                    Nutrition: {r.calories} kcal, {r.protein}g protein,{" "}
                    {r.carbs}g carbs, {r.fats}g fats
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      className="px-2 py-1 rounded bg-pastel-mint text-accent text-xs font-semibold shadow"
                      onClick={() => addToShoppingList(r.ingredients)}
                    >
                      Add Ingredients to Shopping List
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-pastel-pink text-accent text-xs font-semibold shadow"
                      onClick={() => deleteRecipe(idx)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Shopping List Generator */}
          <div className="bg-gradient-to-br from-pastel-lavender via-pastel-blue to-pastel-mint border-2 border-accent rounded-2xl shadow-2xl p-6 mb-4">
            <div className="font-bold text-lg gradient-text mb-2">
              Shopping List
            </div>
            <ul className="flex flex-wrap gap-2 mb-2">
              {shoppingList.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-white/60 rounded px-2 py-1 border border-accent flex items-center gap-2 shadow"
                >
                  <span>{item}</span>
                  <button
                    className="text-red-400 hover:text-red-600"
                    onClick={() => removeShoppingItem(idx)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Water Tracker & Progress */}
          <div className="bg-gradient-to-br from-pastel-blue via-pastel-mint to-pastel-lavender border-2 border-accent rounded-2xl shadow-2xl p-6 mb-4 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="font-bold text-lg gradient-text mb-2">
                Water Tracker
              </div>
              <div className="flex items-center gap-2 mb-2">
                <button
                  className="px-3 py-1 rounded bg-accent text-white text-xs font-semibold shadow"
                  onClick={decrementWater}
                >
                  -
                </button>
                <span className="text-2xl font-bold text-pastel-blue drop-shadow">
                  {water}
                </span>
                <button
                  className="px-3 py-1 rounded bg-accent text-white text-xs font-semibold shadow"
                  onClick={incrementWater}
                >
                  +
                </button>
                <span className="text-xs">glasses</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg gradient-text mb-2">
                Nutrition Totals
              </div>
              <div className="text-xs">
                Calories:{" "}
                <span className="font-semibold text-pastel-peach">
                  {nutritionTotals.calories}
                </span>{" "}
                kcal
              </div>
              <div className="text-xs">
                Protein:{" "}
                <span className="font-semibold text-pastel-mint">
                  {nutritionTotals.protein}
                </span>{" "}
                g
              </div>
              <div className="text-xs">
                Carbs:{" "}
                <span className="font-semibold text-pastel-blue">
                  {nutritionTotals.carbs}
                </span>{" "}
                g
              </div>
              <div className="text-xs">
                Fats:{" "}
                <span className="font-semibold text-pastel-pink">
                  {nutritionTotals.fats}
                </span>{" "}
                g
              </div>
            </div>
          </div>
          {/* Leftover Management */}
          <div className="bg-gradient-to-br from-pastel-mint via-pastel-blue to-pastel-lavender border-2 border-accent rounded-2xl shadow-2xl p-6 mb-4">
            <div className="font-bold text-lg gradient-text mb-2">
              Leftover Management
            </div>
            <div className="flex flex-wrap gap-4 mb-4 items-end">
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                placeholder="Leftover name"
                id="leftover-name"
              />
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                type="date"
                id="leftover-date"
              />
              <input
                className="bg-white/70 border border-accent rounded px-2 py-1"
                placeholder="Notes"
                id="leftover-notes"
              />
              <button
                className="px-3 py-1 rounded bg-accent text-white text-xs font-semibold shadow"
                onClick={() => {
                  const name = document.getElementById("leftover-name").value;
                  const date = document.getElementById("leftover-date").value;
                  const notes = document.getElementById("leftover-notes").value;
                  if (name) {
                    addLeftover(name, date, notes);
                    document.getElementById("leftover-name").value = "";
                    document.getElementById("leftover-date").value = "";
                    document.getElementById("leftover-notes").value = "";
                  }
                }}
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {leftovers.map((l, idx) => (
                <li
                  key={idx}
                  className="flex flex-col gap-1 bg-white/60 rounded px-2 py-1 border border-accent shadow"
                >
                  <div className="font-semibold text-pastel-mint drop-shadow">
                    {l.name}
                  </div>
                  <div className="text-xs">Date: {l.date}</div>
                  <div className="text-xs">Notes: {l.notes}</div>
                  <div className="flex gap-2 mt-1">
                    <button
                      className="px-2 py-1 rounded bg-pastel-pink text-accent text-xs font-semibold shadow"
                      onClick={() => deleteLeftover(idx)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all shadow-lg"
        >
          ← Back to Templates
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-yellow dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4">
      <TemplateDetailPanel
        template={template}
        onBack={() => router.push("/")}
      />
    </div>
  );
}
