"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AIChatBot from "@/components/AIChatBot";

export default function FitnessTrackerPage() {
  const router = useRouter();

  // Fitness tracker state
  const [workoutLogs, setWorkoutLogs] = useState([
    {
      id: 1,
      date: "2024-01-15",
      type: "Strength Training",
      exercises: [
        {
          name: "Squats",
          sets: 3,
          reps: 12,
          weight: "80kg",
          notes: "Felt strong today",
        },
        {
          name: "Bench Press",
          sets: 3,
          reps: 8,
          weight: "60kg",
          notes: "Good form",
        },
        {
          name: "Deadlifts",
          sets: 3,
          reps: 10,
          weight: "100kg",
          notes: "Focus on form",
        },
      ],
      duration: 60,
      calories: 450,
    },
    {
      id: 2,
      date: "2024-01-13",
      type: "Cardio",
      exercises: [
        {
          name: "Running",
          sets: 1,
          reps: "",
          weight: "",
          notes: "5km in 25 minutes",
        },
      ],
      duration: 25,
      calories: 300,
    },
  ]);

  const [fitnessGoals, setFitnessGoals] = useState([
    {
      id: 1,
      goal: "Run 5km in under 25 minutes",
      target: "25:00",
      current: "25:30",
      category: "Cardio",
    },
    {
      id: 2,
      goal: "Bench Press 80kg",
      target: "80kg",
      current: "60kg",
      category: "Strength",
    },
    {
      id: 3,
      goal: "Exercise 4 times per week",
      target: "4",
      current: "3",
      category: "Frequency",
    },
  ]);

  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "Strength Training",
    exercises: [{ name: "", sets: "", reps: "", weight: "", notes: "" }],
    duration: "",
    calories: "",
  });

  const [newGoal, setNewGoal] = useState({
    goal: "",
    target: "",
    current: "",
    category: "Strength",
  });

  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem("fitnessWorkouts");
    const savedGoals = localStorage.getItem("fitnessGoals");

    if (savedWorkouts) {
      setWorkoutLogs(JSON.parse(savedWorkouts));
    }
    if (savedGoals) {
      setFitnessGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fitnessWorkouts", JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem("fitnessGoals", JSON.stringify(fitnessGoals));
  }, [fitnessGoals]);

  const addWorkout = () => {
    if (newWorkout.exercises[0].name.trim()) {
      const workout = {
        ...newWorkout,
        id: Date.now(),
        exercises: newWorkout.exercises.filter((ex) => ex.name.trim()),
      };
      setWorkoutLogs([workout, ...workoutLogs]);
      setNewWorkout({
        date: new Date().toISOString().slice(0, 10),
        type: "Strength Training",
        exercises: [{ name: "", sets: "", reps: "", weight: "", notes: "" }],
        duration: "",
        calories: "",
      });
      setShowAddWorkout(false);
    }
  };

  const deleteWorkout = (id) => {
    setWorkoutLogs(workoutLogs.filter((w) => w.id !== id));
  };

  const updateWorkout = (id, data) => {
    setWorkoutLogs(
      workoutLogs.map((w) => (w.id === id ? { ...w, ...data } : w))
    );
    setEditingWorkout(null);
  };

  const addExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [
        ...newWorkout.exercises,
        { name: "", sets: "", reps: "", weight: "", notes: "" },
      ],
    });
  };

  const removeExercise = (index) => {
    setNewWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises.filter((_, i) => i !== index),
    });
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = newWorkout.exercises.map((ex, i) =>
      i === index ? { ...ex, [field]: value } : ex
    );
    setNewWorkout({ ...newWorkout, exercises: updatedExercises });
  };

  const addGoal = () => {
    if (newGoal.goal.trim() && newGoal.target.trim()) {
      const goal = { ...newGoal, id: Date.now() };
      setFitnessGoals([...fitnessGoals, goal]);
      setNewGoal({
        goal: "",
        target: "",
        current: "",
        category: "Strength",
      });
      setShowAddGoal(false);
    }
  };

  const deleteGoal = (id) => {
    setFitnessGoals(fitnessGoals.filter((g) => g.id !== id));
  };

  const updateGoal = (id, data) => {
    setFitnessGoals(
      fitnessGoals.map((g) => (g.id === id ? { ...g, ...data } : g))
    );
    setEditingGoal(null);
  };

  // Calculate stats
  const totalWorkouts = workoutLogs.length;
  const totalCalories = workoutLogs.reduce(
    (sum, w) => sum + (w.calories || 0),
    0
  );
  const totalDuration = workoutLogs.reduce(
    (sum, w) => sum + (w.duration || 0),
    0
  );
  const thisWeekWorkouts = workoutLogs.filter((w) => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-blue-200 to-purple-300 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center justify-center gap-3">
            🏋️‍♂️ Fitness Tracker
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Track your workouts, set goals, and monitor your progress
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
            <div className="font-bold text-lg gradient-text mb-1">
              Total Workouts
            </div>
            <div className="text-3xl font-bold text-green-600">
              {totalWorkouts}
            </div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
            <div className="font-bold text-lg gradient-text mb-1">
              This Week
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {thisWeekWorkouts}
            </div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
            <div className="font-bold text-lg gradient-text mb-1">
              Total Calories
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {totalCalories}
            </div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
            <div className="font-bold text-lg gradient-text mb-1">
              Total Hours
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(totalDuration / 60)}
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 border-2 border-accent rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold gradient-text">
              🏆 Fitness Goals
            </h2>
            <button
              onClick={() => setShowAddGoal(true)}
              className="px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
            >
              + Add Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fitnessGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white/80 rounded-xl p-4 shadow border border-accent"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {goal.category}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingGoal(goal.id)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {editingGoal === goal.id ? (
                  <div className="space-y-2">
                    <input
                      className="w-full bg-white/70 border border-accent rounded px-2 py-1"
                      value={goal.goal}
                      onChange={(e) =>
                        updateGoal(goal.id, { goal: e.target.value })
                      }
                      placeholder="Goal description"
                    />
                    <div className="flex gap-2">
                      <input
                        className="flex-1 bg-white/70 border border-accent rounded px-2 py-1"
                        value={goal.target}
                        onChange={(e) =>
                          updateGoal(goal.id, { target: e.target.value })
                        }
                        placeholder="Target"
                      />
                      <input
                        className="flex-1 bg-white/70 border border-accent rounded px-2 py-1"
                        value={goal.current}
                        onChange={(e) =>
                          updateGoal(goal.id, { current: e.target.value })
                        }
                        placeholder="Current"
                      />
                    </div>
                    <select
                      className="w-full bg-white/70 border border-accent rounded px-2 py-1"
                      value={goal.category}
                      onChange={(e) =>
                        updateGoal(goal.id, { category: e.target.value })
                      }
                    >
                      <option value="Strength">Strength</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Flexibility">Flexibility</option>
                      <option value="Frequency">Frequency</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingGoal(null)}
                        className="flex-1 px-2 py-1 rounded bg-green-500 text-white text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingGoal(null)}
                        className="flex-1 px-2 py-1 rounded bg-gray-500 text-white text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {goal.goal}
                    </h3>
                    <div className="text-sm text-gray-600">
                      <div>Target: {goal.target}</div>
                      <div>Current: {goal.current}</div>
                      <div className="mt-2">
                        {goal.category === "Frequency" ? (
                          <div className="text-xs">
                            Progress: {goal.current}/{goal.target} times per
                            week
                          </div>
                        ) : (
                          <div className="text-xs">
                            Keep pushing towards your target!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Workout Logs Section */}
        <div className="bg-gradient-to-br from-green-200 via-yellow-200 to-orange-200 border-2 border-accent rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold gradient-text">
              📊 Workout Logs
            </h2>
            <button
              onClick={() => setShowAddWorkout(true)}
              className="px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
            >
              + Log Workout
            </button>
          </div>

          {/* Add Workout Form */}
          {showAddWorkout && (
            <div className="bg-white/80 rounded-xl p-6 mb-6 shadow border border-accent">
              <h3 className="text-xl font-bold mb-4">Add New Workout</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="date"
                  className="bg-white/70 border border-accent rounded px-3 py-2"
                  value={newWorkout.date}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, date: e.target.value })
                  }
                />
                <select
                  className="bg-white/70 border border-accent rounded px-3 py-2"
                  value={newWorkout.type}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, type: e.target.value })
                  }
                >
                  <option value="Strength Training">Strength Training</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  className="bg-white/70 border border-accent rounded px-3 py-2"
                  value={newWorkout.duration}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, duration: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Exercises</h4>
                {newWorkout.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2"
                  >
                    <input
                      placeholder="Exercise name"
                      className="bg-white/70 border border-accent rounded px-2 py-1"
                      value={exercise.name}
                      onChange={(e) =>
                        updateExercise(index, "name", e.target.value)
                      }
                    />
                    <input
                      placeholder="Sets"
                      className="bg-white/70 border border-accent rounded px-2 py-1"
                      value={exercise.sets}
                      onChange={(e) =>
                        updateExercise(index, "sets", e.target.value)
                      }
                    />
                    <input
                      placeholder="Reps"
                      className="bg-white/70 border border-accent rounded px-2 py-1"
                      value={exercise.reps}
                      onChange={(e) =>
                        updateExercise(index, "reps", e.target.value)
                      }
                    />
                    <input
                      placeholder="Weight"
                      className="bg-white/70 border border-accent rounded px-2 py-1"
                      value={exercise.weight}
                      onChange={(e) =>
                        updateExercise(index, "weight", e.target.value)
                      }
                    />
                    <div className="flex gap-1">
                      <input
                        placeholder="Notes"
                        className="flex-1 bg-white/70 border border-accent rounded px-2 py-1"
                        value={exercise.notes}
                        onChange={(e) =>
                          updateExercise(index, "notes", e.target.value)
                        }
                      />
                      {newWorkout.exercises.length > 1 && (
                        <button
                          onClick={() => removeExercise(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExercise}
                  className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
                >
                  + Add Exercise
                </button>
              </div>

              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Calories burned"
                  className="bg-white/70 border border-accent rounded px-3 py-2"
                  value={newWorkout.calories}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, calories: e.target.value })
                  }
                />
                <button
                  onClick={addWorkout}
                  className="px-4 py-2 rounded bg-green-500 text-white font-semibold"
                >
                  Save Workout
                </button>
                <button
                  onClick={() => setShowAddWorkout(false)}
                  className="px-4 py-2 rounded bg-gray-500 text-white font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Workout Logs List */}
          <div className="space-y-4">
            {workoutLogs.map((workout) => (
              <div
                key={workout.id}
                className="bg-white/80 rounded-xl p-4 shadow border border-accent"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{workout.type}</h3>
                    <p className="text-sm text-gray-600">{workout.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {workout.duration}min
                    </span>
                    {workout.calories && (
                      <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {workout.calories} cal
                      </span>
                    )}
                    <button
                      onClick={() => deleteWorkout(workout.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="bg-gray-50 rounded p-2">
                      <div className="font-semibold">{exercise.name}</div>
                      <div className="text-sm text-gray-600">
                        {exercise.sets && `Sets: ${exercise.sets}`}
                        {exercise.reps && ` | Reps: ${exercise.reps}`}
                        {exercise.weight && ` | Weight: ${exercise.weight}`}
                      </div>
                      {exercise.notes && (
                        <div className="text-sm text-gray-500 italic">
                          "{exercise.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Add New Goal</h3>
            <div className="space-y-3">
              <input
                placeholder="Goal description"
                className="w-full bg-white/70 border border-accent rounded px-3 py-2"
                value={newGoal.goal}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, goal: e.target.value })
                }
              />
              <div className="flex gap-2">
                <input
                  placeholder="Target"
                  className="flex-1 bg-white/70 border border-accent rounded px-3 py-2"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, target: e.target.value })
                  }
                />
                <input
                  placeholder="Current"
                  className="flex-1 bg-white/70 border border-accent rounded px-3 py-2"
                  value={newGoal.current}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, current: e.target.value })
                  }
                />
              </div>
              <select
                className="w-full bg-white/70 border border-accent rounded px-3 py-2"
                value={newGoal.category}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, category: e.target.value })
                }
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibility">Flexibility</option>
                <option value="Frequency">Frequency</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={addGoal}
                  className="flex-1 px-4 py-2 rounded bg-green-500 text-white font-semibold"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 px-4 py-2 rounded bg-gray-500 text-white font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => router.push("/")}
        className="mt-8 px-6 py-2 rounded-lg font-semibold bg-accent text-[#22223b] hover:opacity-90 transition-all shadow-lg"
      >
        ← Back to Dashboard
      </button>

      <AIChatBot />
    </div>
  );
}
