"use client";

import { useState } from "react";

export default function ContentCalendarBox() {
  const [calendarItems, setCalendarItems] = useState([
    {
      id: 1,
      title: "AI in Healthcare",
      publishDate: "2024-04-01",
      author: "John Doe",
      status: "Scheduled",
      platform: "Blog",
      category: "Technology",
    },
    {
      id: 2,
      title: "Future of Remote Work",
      publishDate: "2024-04-05",
      author: "Jane Smith",
      status: "Draft",
      platform: "Medium",
      category: "Business",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    title: "",
    publishDate: "",
    author: "",
    status: "Draft",
    platform: "",
    category: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const item = {
      ...newItem,
      id: Date.now(),
    };
    setCalendarItems([...calendarItems, item]);
    setNewItem({
      title: "",
      publishDate: "",
      author: "",
      status: "Draft",
      platform: "",
      category: "",
    });
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem(item);
    setShowForm(true);
  };

  const handleSave = (id) => {
    setCalendarItems(
      calendarItems.map((item) => (item.id === id ? { ...newItem, id } : item))
    );
    setEditingItem(null);
    setNewItem({
      title: "",
      publishDate: "",
      author: "",
      status: "Draft",
      platform: "",
      category: "",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setCalendarItems(calendarItems.filter((item) => item.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Content Calendar
        </h3>
        <button
          onClick={() => {
            setEditingItem(null);
            setNewItem({
              title: "",
              publishDate: "",
              author: "",
              status: "Draft",
              platform: "",
              category: "",
            });
            setShowForm(true);
          }}
          className="bg-[#6B46C1] text-white px-4 py-2 rounded-lg hover:bg-[#805AD5] transition-colors"
        >
          Add Content
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={editingItem ? () => handleSave(editingItem.id) : handleAdd}
          className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
        >
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={newItem.title}
              onChange={(e) =>
                setNewItem({ ...newItem, title: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
            <input
              type="date"
              value={newItem.publishDate}
              onChange={(e) =>
                setNewItem({ ...newItem, publishDate: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={newItem.author}
              onChange={(e) =>
                setNewItem({ ...newItem, author: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
            <select
              value={newItem.status}
              onChange={(e) =>
                setNewItem({ ...newItem, status: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            >
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Published">Published</option>
            </select>
            <input
              type="text"
              placeholder="Platform"
              value={newItem.platform}
              onChange={(e) =>
                setNewItem({ ...newItem, platform: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#6B46C1] text-white px-4 py-2 rounded hover:bg-[#805AD5] transition-colors"
              >
                {editingItem ? "Save Changes" : "Add Content"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {calendarItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Publish Date: {item.publishDate}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Author: {item.author}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Platform: {item.platform}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Category: {item.category}
              </span>
              <span
                className={`px-2 py-1 rounded ${getStatusColor(item.status)}`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
