"use client";

import { useState } from "react";
import AIChatBot from "../../components/AIChatBot";

export default function MealPlanner() {
  const [mealSchedule, setMealSchedule] = useState([
    {
      day: "Mon",
      time: "Breakfast",
      meal: "Oatmeal",
      notes: "Add berries",
      feedback: "",
      adherence: false,
    },
    {
      day: "Mon",
      time: "Lunch",
      meal: "Grilled Chicken Salad",
      notes: "No dressing",
      feedback: "",
      adherence: true,
    },
    {
      day: "Mon",
      time: "Dinner",
      meal: "Salmon & Veggies",
      notes: "Steamed",
      feedback: "",
      adherence: true,
    },
    {
      day: "Tue",
      time: "Breakfast",
      meal: "Greek Yogurt",
      notes: "Add honey",
      feedback: "",
      adherence: false,
    },
  ]);
  const [newMeal, setNewMeal] = useState({
    day: "Mon",
    time: "Breakfast",
    meal: "",
    notes: "",
  });
  const [recipeLibrary, setRecipeLibrary] = useState([
    {
      name: "Oatmeal",
      ingredients: "Oats, Milk, Berries",
      instructions: "Cook oats, add milk, top with berries.",
      calories: 250,
      protein: 8,
      carbs: 40,
      fats: 5,
    },
    {
      name: "Grilled Chicken Salad",
      ingredients: "Chicken, Lettuce, Tomato",
      instructions: "Grill chicken, toss with veggies.",
      calories: 350,
      protein: 30,
      carbs: 10,
      fats: 12,
    },
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
  const [shoppingList, setShoppingList] = useState([
    "Oats",
    "Chicken",
    "Lettuce",
  ]);
  const [dietPrefs, setDietPrefs] = useState({
    vegetarian: false,
    allergies: "",
    custom: "",
  });
  const [water, setWater] = useState(5);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mealTimes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const addMeal = (e) => {
    e.preventDefault();
    if (!newMeal.meal.trim()) return;
    setMealSchedule([
      ...mealSchedule,
      { ...newMeal, feedback: "", adherence: false },
    ]);
    setNewMeal({ day: "Mon", time: "Breakfast", meal: "", notes: "" });
  };
  const deleteMeal = (idx) =>
    setMealSchedule(mealSchedule.filter((_, i) => i !== idx));
  const updateMeal = (idx, update) =>
    setMealSchedule(
      mealSchedule.map((m, i) => (i === idx ? { ...m, ...update } : m))
    );

  const addRecipe = (e) => {
    e.preventDefault();
    if (!newRecipe.name.trim()) return;
    setRecipeLibrary([...recipeLibrary, newRecipe]);
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
    const items = ingredients
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    setShoppingList([...new Set([...shoppingList, ...items])]);
  };
  const removeShoppingItem = (idx) =>
    setShoppingList(shoppingList.filter((_, i) => i !== idx));
  const incrementWater = () => setWater((w) => w + 1);
  const decrementWater = () => setWater((w) => (w > 0 ? w - 1 : 0));
  const updateDietPrefs = (field, value) =>
    setDietPrefs((p) => ({ ...p, [field]: value }));

  // Nutrition totals
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 via-lime-50 via-stone-100 to-amber-100 dark:from-stone-900 dark:via-orange-950 dark:to-lime-950 p-4">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <span>🏠</span> Go to Dashboard
            </button>
            <div className="flex-1"></div>
          </div>
          <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-200 mb-2">
            🍽️ Meal Planner
          </h1>
          <p className="text-amber-700 dark:text-amber-300">
            Plan your meals, track nutrition, and manage your shopping list
          </p>
        </div>
        {/* Diet & Preferences */}
        <div className="bg-white/90 dark:bg-stone-900 rounded-xl p-4 shadow-2xl border-2 border-amber-200 dark:border-amber-800 mb-4 backdrop-blur-md">
          <div className="font-bold text-lg text-amber-700 dark:text-amber-200 mb-1">
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
              className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={dietPrefs.allergies}
              onChange={(e) => updateDietPrefs("allergies", e.target.value)}
              placeholder="Allergies (comma separated)"
            />
            <input
              className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={dietPrefs.custom}
              onChange={(e) => updateDietPrefs("custom", e.target.value)}
              placeholder="Other preferences"
            />
          </div>
        </div>
        {/* Weekly Meal Schedule */}
        <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100 dark:from-stone-800 dark:via-orange-950 dark:to-stone-900 border-2 border-amber-200 dark:border-amber-800 rounded-2xl shadow-2xl p-6 mb-4">
          <div className="font-bold text-lg text-amber-700 dark:text-amber-200 mb-2">
            Weekly Meal Schedule
          </div>
          <form
            className="flex flex-wrap gap-4 mb-4 items-end"
            onSubmit={addMeal}
          >
            <select
              className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
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
              className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
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
              className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={newMeal.meal}
              onChange={(e) =>
                setNewMeal((m) => ({ ...m, meal: e.target.value }))
              }
              placeholder="Meal name"
            />
            <input
              className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={newMeal.notes}
              onChange={(e) =>
                setNewMeal((m) => ({ ...m, notes: e.target.value }))
              }
              placeholder="Prep notes"
            />
            <button
              className="px-3 py-1 rounded bg-amber-400 text-white text-xs font-semibold shadow-md"
              type="submit"
            >
              Add
            </button>
          </form>
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
                  className="hover:bg-amber-50 dark:hover:bg-stone-800 transition"
                >
                  <td>{m.day}</td>
                  <td>{m.time}</td>
                  <td>{m.meal}</td>
                  <td>
                    <input
                      className="w-full bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-1 text-gray-900 dark:text-white"
                      value={m.notes}
                      onChange={(e) =>
                        updateMeal(idx, { notes: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="w-full bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-1 text-gray-900 dark:text-white"
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
        <div className="bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50 dark:from-stone-900 dark:via-stone-800 dark:to-orange-950 border-2 border-amber-200 dark:border-amber-800 rounded-2xl shadow-2xl p-6 mb-4">
          <div className="font-bold text-lg text-amber-700 dark:text-amber-200 mb-2">
            Recipe/Meal Library
          </div>
          <form
            className="flex flex-wrap gap-4 mb-4 items-end"
            onSubmit={addRecipe}
          >
            <input
              className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={newRecipe.name}
              onChange={(e) =>
                setNewRecipe((r) => ({ ...r, name: e.target.value }))
              }
              placeholder="Recipe name"
            />
            <input
              className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={newRecipe.ingredients}
              onChange={(e) =>
                setNewRecipe((r) => ({ ...r, ingredients: e.target.value }))
              }
              placeholder="Ingredients (comma separated)"
            />
            <input
              className="bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={newRecipe.instructions}
              onChange={(e) =>
                setNewRecipe((r) => ({ ...r, instructions: e.target.value }))
              }
              placeholder="Instructions"
            />
            <input
              className="w-16 bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={newRecipe.calories}
              onChange={(e) =>
                setNewRecipe((r) => ({ ...r, calories: e.target.value }))
              }
              placeholder="kcal"
            />
            <input
              className="w-16 bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={newRecipe.protein}
              onChange={(e) =>
                setNewRecipe((r) => ({ ...r, protein: e.target.value }))
              }
              placeholder="g protein"
            />
            <input
              className="w-16 bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={newRecipe.carbs}
              onChange={(e) =>
                setNewRecipe((r) => ({ ...r, carbs: e.target.value }))
              }
              placeholder="g carbs"
            />
            <input
              className="w-16 bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1 text-gray-900 dark:text-white"
              value={newRecipe.fats}
              onChange={(e) =>
                setNewRecipe((r) => ({ ...r, fats: e.target.value }))
              }
              placeholder="g fats"
            />
            <button
              className="px-3 py-1 rounded bg-amber-400 text-white text-xs font-semibold shadow-md"
              type="submit"
            >
              Add
            </button>
          </form>
          <ul className="space-y-2">
            {recipeLibrary.map((r, idx) => (
              <li
                key={idx}
                className="flex flex-col gap-1 bg-amber-50 dark:bg-stone-800 rounded px-2 py-1 border border-amber-200 dark:border-amber-700 shadow-md"
              >
                <div className="font-semibold text-amber-700 dark:text-amber-200 drop-shadow">
                  {r.name}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-200">
                  Ingredients: {r.ingredients}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-200">
                  Instructions: {r.instructions}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-200">
                  Nutrition: {r.calories} kcal, {r.protein}g protein, {r.carbs}g
                  carbs, {r.fats}g fats
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    className="px-2 py-1 rounded bg-lime-200 dark:bg-lime-900 text-amber-900 dark:text-amber-200 text-xs font-semibold shadow"
                    onClick={() => addToShoppingList(r.ingredients)}
                  >
                    Add Ingredients to Shopping List
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-orange-200 dark:bg-orange-900 text-amber-900 dark:text-amber-200 text-xs font-semibold shadow"
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
        <div className="bg-gradient-to-br from-amber-50 via-stone-100 to-lime-50 dark:from-stone-900 dark:via-stone-800 dark:to-lime-900 border-2 border-amber-200 dark:border-amber-800 rounded-2xl shadow-2xl p-6 mb-4">
          <div className="font-bold text-lg text-amber-700 dark:text-amber-200 mb-2">
            Shopping List
          </div>
          <ul className="flex flex-wrap gap-2 mb-2">
            {shoppingList.map((item, idx) => (
              <li
                key={idx}
                className="bg-amber-50 dark:bg-stone-800 rounded px-2 py-1 border border-amber-200 dark:border-amber-700 flex items-center gap-2 shadow"
              >
                <span className="text-gray-900 dark:text-white">{item}</span>
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
        <div className="bg-gradient-to-br from-amber-100 via-lime-50 to-stone-100 dark:from-stone-800 dark:via-lime-900 dark:to-stone-900 border-2 border-amber-200 dark:border-amber-800 rounded-2xl shadow-2xl p-6 mb-4 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <div className="font-bold text-lg text-amber-700 dark:text-amber-200 mb-2">
              Water Tracker
            </div>
            <div className="flex items-center gap-2 mb-2">
              <button
                className="px-3 py-1 rounded bg-amber-400 text-white text-xs font-semibold shadow"
                onClick={decrementWater}
              >
                -
              </button>
              <span className="text-2xl font-bold text-amber-700 dark:text-amber-200 drop-shadow">
                {water}
              </span>
              <button
                className="px-3 py-1 rounded bg-amber-400 text-white text-xs font-semibold shadow"
                onClick={incrementWater}
              >
                +
              </button>
              <span className="text-xs text-gray-700 dark:text-gray-200">
                glasses
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg text-amber-700 dark:text-amber-200 mb-2">
              Nutrition Totals
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-200">
              Calories:{" "}
              <span className="font-semibold text-orange-700 dark:text-orange-200">
                {nutritionTotals.calories}
              </span>{" "}
              kcal
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-200">
              Protein:{" "}
              <span className="font-semibold text-lime-700 dark:text-lime-200">
                {nutritionTotals.protein}
              </span>{" "}
              g
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-200">
              Carbs:{" "}
              <span className="font-semibold text-amber-700 dark:text-amber-200">
                {nutritionTotals.carbs}
              </span>{" "}
              g
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-200">
              Fats:{" "}
              <span className="font-semibold text-orange-700 dark:text-orange-200">
                {nutritionTotals.fats}
              </span>{" "}
              g
            </div>
          </div>
        </div>
      </div>
      <AIChatBot />
    </div>
  );
}
