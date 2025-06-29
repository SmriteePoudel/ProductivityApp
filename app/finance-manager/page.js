"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AIChatBot from "@/components/AIChatBot";

export default function FinanceManagerPage() {
  const router = useRouter();

  // Dummy/example data
  const [incomeRows, setIncomeRows] = useState([
    { id: 1, date: "2024-06-01", source: "Salary", amount: 3000 },
    { id: 2, date: "2024-06-10", source: "Freelance", amount: 800 },
  ]);
  const [expenseRows, setExpenseRows] = useState([
    { id: 1, date: "2024-06-02", category: "Rent", amount: 1200 },
    { id: 2, date: "2024-06-05", category: "Groceries", amount: 250 },
    { id: 3, date: "2024-06-07", category: "Transport", amount: 60 },
  ]);
  const [budgetRows, setBudgetRows] = useState([
    { id: 1, category: "Rent", budgeted: 1200, spent: 1200, notes: "On track" },
    { id: 2, category: "Groceries", budgeted: 300, spent: 250, notes: "Good" },
    {
      id: 3,
      category: "Transport",
      budgeted: 100,
      spent: 60,
      notes: "Below budget",
    },
  ]);
  const [goals, setGoals] = useState([
    { id: 1, goal: "Save $5000 for vacation", target: 5000, saved: 1200 },
    { id: 2, goal: "Pay off credit card", target: 2000, saved: 800 },
  ]);

  // New entry states
  const [newIncome, setNewIncome] = useState({
    date: "",
    source: "",
    amount: "",
  });
  const [newExpense, setNewExpense] = useState({
    date: "",
    category: "",
    amount: "",
  });
  const [newBudget, setNewBudget] = useState({
    category: "",
    budgeted: "",
    spent: "",
    notes: "",
  });
  const [newGoal, setNewGoal] = useState({ goal: "", target: "", saved: "" });

  // LocalStorage persistence
  useEffect(() => {
    const i = localStorage.getItem("financeIncome");
    const e = localStorage.getItem("financeExpenses");
    const b = localStorage.getItem("financeBudgets");
    const g = localStorage.getItem("financeGoals");
    if (i) setIncomeRows(JSON.parse(i));
    if (e) setExpenseRows(JSON.parse(e));
    if (b) setBudgetRows(JSON.parse(b));
    if (g) setGoals(JSON.parse(g));
  }, []);
  useEffect(() => {
    localStorage.setItem("financeIncome", JSON.stringify(incomeRows));
  }, [incomeRows]);
  useEffect(() => {
    localStorage.setItem("financeExpenses", JSON.stringify(expenseRows));
  }, [expenseRows]);
  useEffect(() => {
    localStorage.setItem("financeBudgets", JSON.stringify(budgetRows));
  }, [budgetRows]);
  useEffect(() => {
    localStorage.setItem("financeGoals", JSON.stringify(goals));
  }, [goals]);

  // Add, edit, delete handlers
  const addIncome = () => {
    if (!newIncome.date || !newIncome.source || !newIncome.amount) return;
    setIncomeRows([{ ...newIncome, id: Date.now() }, ...incomeRows]);
    setNewIncome({ date: "", source: "", amount: "" });
  };
  const deleteIncome = (id) =>
    setIncomeRows(incomeRows.filter((i) => i.id !== id));

  const addExpense = () => {
    if (!newExpense.date || !newExpense.category || !newExpense.amount) return;
    setExpenseRows([{ ...newExpense, id: Date.now() }, ...expenseRows]);
    setNewExpense({ date: "", category: "", amount: "" });
  };
  const deleteExpense = (id) =>
    setExpenseRows(expenseRows.filter((e) => e.id !== id));

  const addBudget = () => {
    if (!newBudget.category || !newBudget.budgeted) return;
    setBudgetRows([{ ...newBudget, id: Date.now() }, ...budgetRows]);
    setNewBudget({ category: "", budgeted: "", spent: "", notes: "" });
  };
  const deleteBudget = (id) =>
    setBudgetRows(budgetRows.filter((b) => b.id !== id));

  const addGoal = () => {
    if (!newGoal.goal || !newGoal.target) return;
    setGoals([{ ...newGoal, id: Date.now() }, ...goals]);
    setNewGoal({ goal: "", target: "", saved: "" });
  };
  const deleteGoal = (id) => setGoals(goals.filter((g) => g.id !== id));

  // Stats
  const totalIncome = incomeRows.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );
  const totalExpenses = expenseRows.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.saved || 0), 0);
  const net = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 via-green-200 to-blue-200 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center justify-center gap-3">
            💰 Finance Manager
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Track your income, expenses, budgets, and financial goals
          </p>
        </div>
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
            <div className="font-bold text-lg gradient-text mb-1">
              Total Income
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${totalIncome}
            </div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
            <div className="font-bold text-lg gradient-text mb-1">
              Total Expenses
            </div>
            <div className="text-3xl font-bold text-red-600">
              ${totalExpenses}
            </div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
            <div className="font-bold text-lg gradient-text mb-1">Net</div>
            <div className="text-3xl font-bold text-blue-600">${net}</div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 shadow border-2 border-accent">
            <div className="font-bold text-lg gradient-text mb-1">
              Total Saved
            </div>
            <div className="text-3xl font-bold text-purple-600">
              ${totalSaved}
            </div>
          </div>
        </div>
        {/* Income Section */}
        <div className="bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100 border-2 border-accent rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold gradient-text">💵 Income</h2>
            <button
              onClick={addIncome}
              className="px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
            >
              + Add Income
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            <input
              type="date"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newIncome.date}
              onChange={(e) =>
                setNewIncome({ ...newIncome, date: e.target.value })
              }
            />
            <input
              placeholder="Source"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newIncome.source}
              onChange={(e) =>
                setNewIncome({ ...newIncome, source: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Amount"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newIncome.amount}
              onChange={(e) =>
                setNewIncome({ ...newIncome, amount: e.target.value })
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Date</th>
                  <th className="p-2">Source</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {incomeRows.map((i) => (
                  <tr key={i.id} className="border-t border-accent/30">
                    <td className="p-2">{i.date}</td>
                    <td className="p-2">{i.source}</td>
                    <td className="p-2">${i.amount}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deleteIncome(i.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Expense Section */}
        <div className="bg-gradient-to-br from-red-100 via-yellow-100 to-green-100 border-2 border-accent rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold gradient-text">💸 Expenses</h2>
            <button
              onClick={addExpense}
              className="px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
            >
              + Add Expense
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            <input
              type="date"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
            />
            <input
              placeholder="Category"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Amount"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Date</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {expenseRows.map((e) => (
                  <tr key={e.id} className="border-t border-accent/30">
                    <td className="p-2">{e.date}</td>
                    <td className="p-2">{e.category}</td>
                    <td className="p-2">${e.amount}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deleteExpense(e.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Budget Section */}
        <div className="bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 border-2 border-accent rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold gradient-text">📊 Budgets</h2>
            <button
              onClick={addBudget}
              className="px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
            >
              + Add Budget
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
            <input
              placeholder="Category"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newBudget.category}
              onChange={(e) =>
                setNewBudget({ ...newBudget, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Budgeted"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newBudget.budgeted}
              onChange={(e) =>
                setNewBudget({ ...newBudget, budgeted: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Spent"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newBudget.spent}
              onChange={(e) =>
                setNewBudget({ ...newBudget, spent: e.target.value })
              }
            />
            <input
              placeholder="Notes"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newBudget.notes}
              onChange={(e) =>
                setNewBudget({ ...newBudget, notes: e.target.value })
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Category</th>
                  <th className="p-2">Budgeted</th>
                  <th className="p-2">Spent</th>
                  <th className="p-2">Notes</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {budgetRows.map((b) => (
                  <tr key={b.id} className="border-t border-accent/30">
                    <td className="p-2">{b.category}</td>
                    <td className="p-2">${b.budgeted}</td>
                    <td className="p-2">${b.spent}</td>
                    <td className="p-2">{b.notes}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deleteBudget(b.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Goals Section */}
        <div className="bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 border-2 border-accent rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold gradient-text">
              🎯 Financial Goals
            </h2>
            <button
              onClick={addGoal}
              className="px-4 py-2 rounded-lg font-semibold bg-accent text-white hover:opacity-90 transition-all"
            >
              + Add Goal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            <input
              placeholder="Goal description"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newGoal.goal}
              onChange={(e) => setNewGoal({ ...newGoal, goal: e.target.value })}
            />
            <input
              type="number"
              placeholder="Target"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newGoal.target}
              onChange={(e) =>
                setNewGoal({ ...newGoal, target: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Saved"
              className="bg-white/70 border border-accent rounded px-3 py-2"
              value={newGoal.saved}
              onChange={(e) =>
                setNewGoal({ ...newGoal, saved: e.target.value })
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Goal</th>
                  <th className="p-2">Target</th>
                  <th className="p-2">Saved</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {goals.map((g) => (
                  <tr key={g.id} className="border-t border-accent/30">
                    <td className="p-2">{g.goal}</td>
                    <td className="p-2">${g.target}</td>
                    <td className="p-2">${g.saved}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deleteGoal(g.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
