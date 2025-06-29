"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AIChatBot from "@/components/AIChatBot";

export default function ReadingListPage() {
  const router = useRouter();

  // Dummy/example data
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "",
      category: "Self-help",
      status: "reading",
      pages: 320,
      pagesRead: 120,
      notes: ["Great on habit stacking"],
      highlights: [
        "You do not rise to the level of your goals. You fall to the level of your systems.",
      ],
    },
    {
      id: 2,
      title: "Deep Work",
      author: "Cal Newport",
      cover: "",
      category: "Productivity",
      status: "to read",
      pages: 304,
      pagesRead: 0,
      notes: [],
      highlights: [],
    },
    {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      cover: "",
      category: "Classic",
      status: "finished",
      pages: 180,
      pagesRead: 180,
      notes: ["Loved the writing style"],
      highlights: ["So we beat on, boats against the current..."],
    },
  ]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    cover: "",
    category: "",
    status: "to read",
    pages: "",
    pagesRead: "",
  });
  const [noteInput, setNoteInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [readingGoal, setReadingGoal] = useState({
    booksPerMonth: 2,
    pagesPerWeek: 100,
  });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const statuses = ["to read", "reading", "finished"];

  // LocalStorage persistence
  useEffect(() => {
    const b = localStorage.getItem("readingBooks");
    const g = localStorage.getItem("readingGoal");
    if (b) setBooks(JSON.parse(b));
    if (g) setReadingGoal(JSON.parse(g));
  }, []);
  useEffect(() => {
    localStorage.setItem("readingBooks", JSON.stringify(books));
  }, [books]);
  useEffect(() => {
    localStorage.setItem("readingGoal", JSON.stringify(readingGoal));
  }, [readingGoal]);

  // Add, edit, delete handlers
  const addBook = () => {
    if (!newBook.title.trim()) return;
    setBooks([
      { ...newBook, id: Date.now(), notes: [], highlights: [] },
      ...books,
    ]);
    setNewBook({
      title: "",
      author: "",
      cover: "",
      category: "",
      status: "to read",
      pages: "",
      pagesRead: "",
    });
  };
  const deleteBook = (id) => setBooks(books.filter((b) => b.id !== id));
  const updateBook = (id, data) =>
    setBooks(books.map((b) => (b.id === id ? { ...b, ...data } : b)));

  // Notes & Highlights
  const addNote = (id) => {
    if (!noteInput.trim()) return;
    setBooks(
      books.map((b) =>
        b.id === id ? { ...b, notes: [...(b.notes || []), noteInput] } : b
      )
    );
    setNoteInput("");
  };
  const deleteNote = (id, nidx) =>
    setBooks(
      books.map((b) =>
        b.id === id ? { ...b, notes: b.notes.filter((_, j) => j !== nidx) } : b
      )
    );
  const addHighlight = (id) => {
    if (!highlightInput.trim()) return;
    setBooks(
      books.map((b) =>
        b.id === id
          ? { ...b, highlights: [...(b.highlights || []), highlightInput] }
          : b
      )
    );
    setHighlightInput("");
  };
  const deleteHighlight = (id, hidx) =>
    setBooks(
      books.map((b) =>
        b.id === id
          ? { ...b, highlights: b.highlights.filter((_, j) => j !== hidx) }
          : b
      )
    );

  // Progress
  const updateProgress = (id, pagesRead) =>
    setBooks(books.map((b) => (b.id === id ? { ...b, pagesRead } : b)));

  // Filtering
  const categories = Array.from(
    new Set(books.map((b) => b.category).filter(Boolean))
  );
  const filteredBooks = books.filter(
    (b) =>
      (!categoryFilter || b.category === categoryFilter) &&
      (!statusFilter || b.status === statusFilter)
  );

  // Reading streak (days with progress)
  const readingStreak = books.filter((b) => Number(b.pagesRead) > 0).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-yellow dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 gap-8">
        {/* Reading Goals */}
        <div className="bg-white/90 rounded-xl p-4 shadow-2xl border-2 border-accent mb-4">
          <div className="font-bold text-lg gradient-text mb-1">
            Reading Goals
          </div>
          <div className="flex flex-wrap gap-4 items-center mb-2">
            <label className="flex items-center gap-2 text-[#22223b]">
              Books per month:
              <input
                type="number"
                min="1"
                className="w-16 bg-white/70 border border-accent rounded px-2 py-1"
                value={readingGoal.booksPerMonth}
                onChange={(e) =>
                  setReadingGoal((g) => ({
                    ...g,
                    booksPerMonth: Number(e.target.value),
                  }))
                }
              />
            </label>
            <label className="flex items-center gap-2 text-[#22223b]">
              Pages per week:
              <input
                type="number"
                min="1"
                className="w-16 bg-white/70 border border-accent rounded px-2 py-1"
                value={readingGoal.pagesPerWeek}
                onChange={(e) =>
                  setReadingGoal((g) => ({
                    ...g,
                    pagesPerWeek: Number(e.target.value),
                  }))
                }
              />
            </label>
            <div className="text-xs text-[#22223b]">
              Current streak: {readingStreak} books in progress
            </div>
          </div>
        </div>
        {/* Categories & Filters */}
        <div className="bg-gradient-to-br from-pastel-blue via-pastel-yellow to-pastel-purple border-2 border-accent rounded-2xl shadow-2xl p-6 mb-4">
          <div className="font-bold text-lg gradient-text mb-2">
            Categories & Filters
          </div>
          <div className="flex flex-wrap gap-4 mb-4 items-end">
            <select
              className="bg-white/70 border border-accent rounded px-2 py-1"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              className="bg-white/70 border border-accent rounded px-2 py-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Add Book */}
        <div className="bg-white/90 rounded-xl p-4 shadow-2xl border-2 border-accent mb-4">
          <div className="font-bold text-lg gradient-text mb-2">Add Book</div>
          <div className="flex flex-wrap gap-2 mb-2">
            <input
              className="bg-white/70 border border-accent rounded px-2 py-1"
              value={newBook.title}
              onChange={(e) =>
                setNewBook((b) => ({ ...b, title: e.target.value }))
              }
              placeholder="Title"
            />
            <input
              className="bg-white/70 border border-accent rounded px-2 py-1"
              value={newBook.author}
              onChange={(e) =>
                setNewBook((b) => ({ ...b, author: e.target.value }))
              }
              placeholder="Author"
            />
            <input
              className="bg-white/70 border border-accent rounded px-2 py-1"
              value={newBook.cover}
              onChange={(e) =>
                setNewBook((b) => ({ ...b, cover: e.target.value }))
              }
              placeholder="Cover URL (optional)"
            />
            <input
              className="bg-white/70 border border-accent rounded px-2 py-1"
              value={newBook.category}
              onChange={(e) =>
                setNewBook((b) => ({ ...b, category: e.target.value }))
              }
              placeholder="Category"
            />
            <select
              className="bg-white/70 border border-accent rounded px-2 py-1"
              value={newBook.status}
              onChange={(e) =>
                setNewBook((b) => ({ ...b, status: e.target.value }))
              }
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              className="bg-white/70 border border-accent rounded px-2 py-1 w-20"
              type="number"
              min="1"
              value={newBook.pages}
              onChange={(e) =>
                setNewBook((b) => ({ ...b, pages: e.target.value }))
              }
              placeholder="Pages"
            />
            <button
              className="px-3 py-1 rounded bg-accent text-[#22223b] text-xs font-semibold shadow"
              onClick={addBook}
            >
              Add
            </button>
          </div>
        </div>
        {/* Book List & Progress Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBooks.map((b) => (
            <div
              key={b.id}
              className="bg-white/90 rounded-2xl shadow-xl border-2 border-accent p-6 flex flex-col gap-3"
            >
              <div className="flex gap-4 items-center">
                {b.cover && (
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="w-16 h-24 object-cover rounded-lg border border-accent"
                  />
                )}
                <div className="flex-1">
                  <div className="font-bold text-lg text-[#22223b]">
                    {b.title}
                  </div>
                  <div className="text-xs text-[#22223b]">by {b.author}</div>
                  <div className="text-xs text-[#22223b]">
                    Category: {b.category}
                  </div>
                  <div className="text-xs text-[#22223b]">
                    Status: {b.status}
                  </div>
                </div>
                <button
                  className="text-red-400 hover:text-red-600 ml-2"
                  onClick={() => deleteBook(b.id)}
                >
                  ✕
                </button>
              </div>
              {/* Progress Tracker */}
              <div className="flex items-center gap-2">
                <input
                  className="w-16 bg-white/70 border border-accent rounded px-2 py-1"
                  type="number"
                  min="0"
                  max={b.pages}
                  value={b.pagesRead || ""}
                  onChange={(e) => updateProgress(b.id, e.target.value)}
                  placeholder="Pages read"
                />
                <span className="text-xs text-[#22223b]">
                  / {b.pages} pages
                </span>
                <span className="text-xs text-[#22223b]">
                  (
                  {b.pages && b.pagesRead
                    ? Math.round((Number(b.pagesRead) / Number(b.pages)) * 100)
                    : 0}
                  %)
                </span>
              </div>
              {/* Notes & Highlights */}
              <div>
                <div className="font-semibold text-[#22223b] mb-1">Notes</div>
                <ul className="space-y-1 mb-2">
                  {(b.notes || []).map((n, nidx) => (
                    <li
                      key={nidx}
                      className="flex items-center gap-2 text-xs text-[#22223b] bg-pastel-yellow/60 rounded px-2 py-1"
                    >
                      <span>{n}</span>
                      <button
                        className="text-red-400 hover:text-red-600"
                        onClick={() => deleteNote(b.id, nidx)}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mb-2">
                  <input
                    className="flex-1 bg-white/70 border border-accent rounded px-2 py-1 text-xs"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add note"
                  />
                  <button
                    className="px-2 py-1 rounded bg-accent text-[#22223b] text-xs font-semibold shadow"
                    onClick={() => addNote(b.id)}
                  >
                    Add
                  </button>
                </div>
                <div className="font-semibold text-[#22223b] mb-1">
                  Highlights
                </div>
                <ul className="space-y-1 mb-2">
                  {(b.highlights || []).map((h, hidx) => (
                    <li
                      key={hidx}
                      className="flex items-center gap-2 text-xs text-[#22223b] bg-pastel-purple/60 rounded px-2 py-1"
                    >
                      <span>{h}</span>
                      <button
                        className="text-red-400 hover:text-red-600"
                        onClick={() => deleteHighlight(b.id, hidx)}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-white/70 border border-accent rounded px-2 py-1 text-xs"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="Add highlight"
                  />
                  <button
                    className="px-2 py-1 rounded bg-accent text-[#22223b] text-xs font-semibold shadow"
                    onClick={() => addHighlight(b.id)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
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
