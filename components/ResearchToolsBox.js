"use client";

import { useState } from "react";

export default function ResearchToolsBox() {
  const [researchItems, setResearchItems] = useState([
    {
      id: 1,
      topic: "AI in Healthcare",
      status: "In Progress",
      sources: 12,
      keyFindings: "Machine learning applications in diagnosis",
      priority: "High",
      deadline: "2024-04-15",
    },
    {
      id: 2,
      topic: "Sustainable Energy",
      status: "Planned",
      sources: 8,
      keyFindings: "Solar power efficiency improvements",
      priority: "Medium",
      deadline: "2024-04-20",
    },
    {
      id: 3,
      topic: "Remote Work Trends",
      status: "Completed",
      sources: 15,
      keyFindings: "Hybrid work model effectiveness",
      priority: "Low",
      deadline: "2024-04-10",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newItem, setNewItem] = useState({
    topic: "",
    status: "Planned",
    sources: "",
    keyFindings: "",
    priority: "Medium",
    deadline: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.topic || !newItem.deadline) return;

    const item = {
      id: Date.now(),
      ...newItem,
    };

    setResearchItems([...researchItems, item]);
    setNewItem({
      topic: "",
      status: "Planned",
      sources: "",
      keyFindings: "",
      priority: "Medium",
      deadline: "",
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
  };

  const handleSave = (id) => {
    const updatedTopic = document.getElementById(`topic-${id}`).value;
    const updatedStatus = document.getElementById(`status-${id}`).value;
    const updatedSources = document.getElementById(`sources-${id}`).value;
    const updatedFindings = document.getElementById(`findings-${id}`).value;
    const updatedPriority = document.getElementById(`priority-${id}`).value;
    const updatedDeadline = document.getElementById(`deadline-${id}`).value;

    setResearchItems(
      researchItems.map((item) =>
        item.id === id
          ? {
              ...item,
              topic: updatedTopic,
              status: updatedStatus,
              sources: updatedSources,
              keyFindings: updatedFindings,
              priority: updatedPriority,
              deadline: updatedDeadline,
            }
          : item
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setResearchItems(researchItems.filter((item) => item.id !== id));
  };

  const inputClasses =
    "w-full bg-white/60 border border-blue-200 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400";
  const editInputClasses =
    "w-full bg-white/80 border border-blue-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:border-blue-400 mb-1";

  return (
    <div className="bg-gradient-to-br from-[#E6F5FF] to-[#F0FAFF] p-6 rounded-lg shadow-md border border-blue-200">
      <h3 className="text-xl font-semibold mb-4 text-[#4A90E2]">
        Research Topics
      </h3>

      <form
        onSubmit={handleAdd}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          value={newItem.topic}
          onChange={(e) => setNewItem({ ...newItem, topic: e.target.value })}
          placeholder="Research Topic"
          className={inputClasses}
        />
        <select
          value={newItem.status}
          onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
          className={inputClasses}
        >
          <option>Planned</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <input
          type="number"
          value={newItem.sources}
          onChange={(e) => setNewItem({ ...newItem, sources: e.target.value })}
          placeholder="Number of Sources"
          className={inputClasses}
        />
        <input
          type="text"
          value={newItem.keyFindings}
          onChange={(e) =>
            setNewItem({ ...newItem, keyFindings: e.target.value })
          }
          placeholder="Key Findings"
          className={inputClasses}
        />
        <select
          value={newItem.priority}
          onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
          className={inputClasses}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <input
          type="date"
          value={newItem.deadline}
          onChange={(e) => setNewItem({ ...newItem, deadline: e.target.value })}
          className={inputClasses}
        />
        <button
          type="submit"
          className="md:col-span-2 bg-blue-400 text-white p-2 rounded hover:bg-blue-500 transition-colors"
        >
          Add Research Topic
        </button>
      </form>

      <div className="space-y-4">
        {researchItems.map((item) => (
          <div
            key={item.id}
            className="bg-white/60 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
          >
            {editingId === item.id ? (
              <div className="space-y-2">
                <input
                  id={`topic-${item.id}`}
                  type="text"
                  defaultValue={item.topic}
                  className={editInputClasses}
                />
                <select
                  id={`status-${item.id}`}
                  defaultValue={item.status}
                  className={editInputClasses}
                >
                  <option>Planned</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <input
                  id={`sources-${item.id}`}
                  type="number"
                  defaultValue={item.sources}
                  className={editInputClasses}
                />
                <input
                  id={`findings-${item.id}`}
                  type="text"
                  defaultValue={item.keyFindings}
                  className={editInputClasses}
                />
                <select
                  id={`priority-${item.id}`}
                  defaultValue={item.priority}
                  className={editInputClasses}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <input
                  id={`deadline-${item.id}`}
                  type="date"
                  defaultValue={item.deadline}
                  className={editInputClasses}
                />
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{item.topic}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      item.priority === "High"
                        ? "bg-red-100 text-red-600"
                        : item.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Status: {item.status}</div>
                  <div>Sources: {item.sources}</div>
                  <div>Deadline: {item.deadline}</div>
                  <div>Findings: {item.keyFindings}</div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-3">
              {editingId === item.id ? (
                <button
                  onClick={() => handleSave(item.id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-400 hover:text-blue-500"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(item.id)}
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
