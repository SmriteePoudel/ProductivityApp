"use client";

import { useState } from "react";

export default function DraftArticlesBox() {
  const [drafts, setDrafts] = useState([
    {
      id: 1,
      title: "The Rise of Quantum Computing",
      excerpt:
        "Exploring the potential impact of quantum computing on modern technology...",
      wordCount: 1200,
      lastEdited: "2024-03-20",
      category: "Technology",
      status: "In Progress",
      completionRate: 75,
    },
    {
      id: 2,
      title: "Sustainable Web Development Practices",
      excerpt:
        "Best practices for creating environmentally conscious web applications...",
      wordCount: 800,
      lastEdited: "2024-03-22",
      category: "Programming",
      status: "Just Started",
      completionRate: 30,
    },
    {
      id: 3,
      title: "Machine Learning in 2024",
      excerpt: "Latest trends and developments in machine learning and AI...",
      wordCount: 1500,
      lastEdited: "2024-03-23",
      category: "AI",
      status: "Final Review",
      completionRate: 95,
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newDraft, setNewDraft] = useState({
    title: "",
    excerpt: "",
    wordCount: "",
    category: "Technology",
    status: "Just Started",
    completionRate: 0,
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newDraft.title || !newDraft.excerpt) return;

    const draft = {
      id: Date.now(),
      ...newDraft,
      lastEdited: new Date().toISOString().split("T")[0],
    };

    setDrafts([...drafts, draft]);
    setNewDraft({
      title: "",
      excerpt: "",
      wordCount: "",
      category: "Technology",
      status: "Just Started",
      completionRate: 0,
    });
  };

  const handleEdit = (draft) => {
    setEditingId(draft.id);
  };

  const handleSave = (id) => {
    const updatedTitle = document.getElementById(`title-${id}`).value;
    const updatedExcerpt = document.getElementById(`excerpt-${id}`).value;
    const updatedWordCount = document.getElementById(`wordCount-${id}`).value;
    const updatedCategory = document.getElementById(`category-${id}`).value;
    const updatedStatus = document.getElementById(`status-${id}`).value;
    const updatedCompletionRate = document.getElementById(
      `completionRate-${id}`
    ).value;

    setDrafts(
      drafts.map((draft) =>
        draft.id === id
          ? {
              ...draft,
              title: updatedTitle,
              excerpt: updatedExcerpt,
              wordCount: updatedWordCount,
              category: updatedCategory,
              status: updatedStatus,
              completionRate: updatedCompletionRate,
              lastEdited: new Date().toISOString().split("T")[0],
            }
          : draft
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setDrafts(drafts.filter((draft) => draft.id !== id));
  };

  const inputClasses =
    "w-full bg-white/60 border border-green-200 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400";
  const editInputClasses =
    "w-full bg-white/80 border border-green-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:border-green-400 mb-1";

  return (
    <div className="bg-gradient-to-br from-[#E6FFE6] to-[#F0FFF0] p-6 rounded-lg shadow-md border border-green-200">
      <form
        onSubmit={handleAdd}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          value={newDraft.title}
          onChange={(e) => setNewDraft({ ...newDraft, title: e.target.value })}
          placeholder="Draft Title"
          className={inputClasses}
        />
        <input
          type="number"
          value={newDraft.wordCount}
          onChange={(e) =>
            setNewDraft({ ...newDraft, wordCount: e.target.value })
          }
          placeholder="Word Count"
          className={inputClasses}
        />
        <textarea
          value={newDraft.excerpt}
          onChange={(e) =>
            setNewDraft({ ...newDraft, excerpt: e.target.value })
          }
          placeholder="Brief Excerpt"
          className={`${inputClasses} md:col-span-2`}
          rows="3"
        />
        <select
          value={newDraft.category}
          onChange={(e) =>
            setNewDraft({ ...newDraft, category: e.target.value })
          }
          className={inputClasses}
        >
          <option>Technology</option>
          <option>Programming</option>
          <option>AI</option>
          <option>Web Development</option>
          <option>Data Science</option>
        </select>
        <select
          value={newDraft.status}
          onChange={(e) => setNewDraft({ ...newDraft, status: e.target.value })}
          className={inputClasses}
        >
          <option>Just Started</option>
          <option>In Progress</option>
          <option>Final Review</option>
          <option>Ready for Edit</option>
        </select>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Completion Rate: {newDraft.completionRate}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={newDraft.completionRate}
            onChange={(e) =>
              setNewDraft({ ...newDraft, completionRate: e.target.value })
            }
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="md:col-span-2 bg-green-400 text-white p-2 rounded hover:bg-green-500 transition-colors"
        >
          Add Draft
        </button>
      </form>

      <div className="space-y-4">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="bg-white/60 p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
          >
            {editingId === draft.id ? (
              <div className="space-y-2">
                <input
                  id={`title-${draft.id}`}
                  type="text"
                  defaultValue={draft.title}
                  className={editInputClasses}
                />
                <textarea
                  id={`excerpt-${draft.id}`}
                  defaultValue={draft.excerpt}
                  className={`${editInputClasses} resize-none`}
                  rows="3"
                />
                <input
                  id={`wordCount-${draft.id}`}
                  type="number"
                  defaultValue={draft.wordCount}
                  className={editInputClasses}
                />
                <select
                  id={`category-${draft.id}`}
                  defaultValue={draft.category}
                  className={editInputClasses}
                >
                  <option>Technology</option>
                  <option>Programming</option>
                  <option>AI</option>
                  <option>Web Development</option>
                  <option>Data Science</option>
                </select>
                <select
                  id={`status-${draft.id}`}
                  defaultValue={draft.status}
                  className={editInputClasses}
                >
                  <option>Just Started</option>
                  <option>In Progress</option>
                  <option>Final Review</option>
                  <option>Ready for Edit</option>
                </select>
                <input
                  id={`completionRate-${draft.id}`}
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={draft.completionRate}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(draft.id)}
                    className="text-green-500 hover:text-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{draft.title}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      draft.status === "Final Review"
                        ? "bg-purple-100 text-purple-600"
                        : draft.status === "In Progress"
                        ? "bg-blue-100 text-blue-600"
                        : draft.status === "Ready for Edit"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {draft.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{draft.excerpt}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Words: {draft.wordCount}</div>
                  <div>Category: {draft.category}</div>
                  <div>Last Edited: {draft.lastEdited}</div>
                  <div>Completion: {draft.completionRate}%</div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-400 h-2.5 rounded-full"
                    style={{ width: `${draft.completionRate}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-3">
              {editingId === draft.id ? (
                <button
                  onClick={() => handleSave(draft.id)}
                  className="text-green-500 hover:text-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(draft)}
                  className="text-green-400 hover:text-green-500"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(draft.id)}
                className="text-red-400 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
