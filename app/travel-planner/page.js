"use client";

import { useState, useEffect } from "react";
import AIChatBot from "../../components/AIChatBot";

export default function TravelPlanner() {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: 0,
    status: "planning",
    description: "",
    color: "#3B82F6",
  });
  const [editingTrip, setEditingTrip] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Load trips from localStorage on component mount
  useEffect(() => {
    const savedTrips = localStorage.getItem("travelTrips");
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    } else {
      // Initialize with dummy data
      const dummyTrips = [
        {
          id: 1,
          name: "Paris Adventure",
          destination: "Paris, France",
          startDate: "2024-06-15",
          endDate: "2024-06-22",
          budget: 2500,
          status: "planned",
          description: "Week-long trip to explore the City of Light",
          color: "#10B981",
          expenses: [
            {
              id: 1,
              category: "accommodation",
              name: "Hotel Booking",
              amount: 800,
              date: "2024-06-15",
            },
            {
              id: 2,
              category: "transportation",
              name: "Flight Tickets",
              amount: 600,
              date: "2024-06-15",
            },
            {
              id: 3,
              category: "food",
              name: "Restaurant Reservations",
              amount: 300,
              date: "2024-06-16",
            },
          ],
          itinerary: [
            {
              id: 1,
              day: 1,
              activity: "Eiffel Tower Visit",
              time: "09:00",
              location: "Eiffel Tower",
              notes: "Book tickets in advance",
            },
            {
              id: 2,
              day: 1,
              activity: "Louvre Museum",
              time: "14:00",
              location: "Louvre",
              notes: "Free on first Sunday",
            },
            {
              id: 3,
              day: 2,
              activity: "Notre-Dame Cathedral",
              time: "10:00",
              location: "Notre-Dame",
              notes: "Check restoration status",
            },
            {
              id: 4,
              day: 2,
              activity: "Seine River Cruise",
              time: "16:00",
              location: "Seine River",
              notes: "Sunset cruise recommended",
            },
          ],
          packingList: [
            {
              id: 1,
              category: "clothing",
              item: "Comfortable walking shoes",
              packed: true,
            },
            {
              id: 2,
              category: "clothing",
              item: "Light jacket",
              packed: false,
            },
            { id: 3, category: "electronics", item: "Camera", packed: true },
            { id: 4, category: "documents", item: "Passport", packed: true },
            {
              id: 5,
              category: "documents",
              item: "Travel Insurance",
              packed: false,
            },
          ],
        },
        {
          id: 2,
          name: "Tokyo Exploration",
          destination: "Tokyo, Japan",
          startDate: "2024-08-10",
          endDate: "2024-08-17",
          budget: 3000,
          status: "planning",
          description: "Discover the blend of tradition and technology",
          color: "#8B5CF6",
          expenses: [
            {
              id: 1,
              category: "accommodation",
              name: "Ryokan Stay",
              amount: 1000,
              date: "2024-08-10",
            },
            {
              id: 2,
              category: "transportation",
              name: "JR Pass",
              amount: 400,
              date: "2024-08-10",
            },
          ],
          itinerary: [
            {
              id: 1,
              day: 1,
              activity: "Senso-ji Temple",
              time: "08:00",
              location: "Asakusa",
              notes: "Visit early to avoid crowds",
            },
            {
              id: 2,
              day: 1,
              activity: "Shibuya Crossing",
              time: "15:00",
              location: "Shibuya",
              notes: "Iconic pedestrian crossing",
            },
            {
              id: 3,
              day: 2,
              activity: "Tsukiji Fish Market",
              time: "06:00",
              location: "Tsukiji",
              notes: "Early morning visit for fresh sushi",
            },
          ],
          packingList: [
            {
              id: 1,
              category: "clothing",
              item: "Modest clothing for temples",
              packed: false,
            },
            {
              id: 2,
              category: "electronics",
              item: "Portable WiFi",
              packed: false,
            },
            { id: 3, category: "documents", item: "JR Pass", packed: false },
          ],
        },
        {
          id: 3,
          name: "New York City Weekend",
          destination: "New York, USA",
          startDate: "2024-07-20",
          endDate: "2024-07-22",
          budget: 1200,
          status: "completed",
          description: "Quick weekend getaway to the Big Apple",
          color: "#F59E0B",
          expenses: [
            {
              id: 1,
              category: "accommodation",
              name: "Times Square Hotel",
              amount: 400,
              date: "2024-07-20",
            },
            {
              id: 2,
              category: "transportation",
              name: "Subway Pass",
              amount: 50,
              date: "2024-07-20",
            },
            {
              id: 3,
              category: "entertainment",
              name: "Broadway Show",
              amount: 150,
              date: "2024-07-21",
            },
          ],
          itinerary: [
            {
              id: 1,
              day: 1,
              activity: "Central Park Walk",
              time: "09:00",
              location: "Central Park",
              notes: "Start at Bethesda Fountain",
            },
            {
              id: 2,
              day: 1,
              activity: "Empire State Building",
              time: "14:00",
              location: "Midtown",
              notes: "Book tickets online",
            },
            {
              id: 3,
              day: 2,
              activity: "Broadway Show",
              time: "20:00",
              location: "Theater District",
              notes: "Dress code: smart casual",
            },
          ],
          packingList: [
            {
              id: 1,
              category: "clothing",
              item: "Comfortable shoes",
              packed: true,
            },
            {
              id: 2,
              category: "clothing",
              item: "Dress for Broadway",
              packed: true,
            },
            {
              id: 3,
              category: "documents",
              item: "Show tickets",
              packed: true,
            },
          ],
        },
      ];
      setTrips(dummyTrips);
      localStorage.setItem("travelTrips", JSON.stringify(dummyTrips));
    }
  }, []);

  // Save trips to localStorage whenever trips change
  useEffect(() => {
    localStorage.setItem("travelTrips", JSON.stringify(trips));
  }, [trips]);

  const addTrip = (e) => {
    e.preventDefault();
    if (!newTrip.name.trim() || !newTrip.destination.trim()) return;

    const trip = {
      id: Date.now(),
      ...newTrip,
      expenses: [],
      itinerary: [],
      packingList: [],
    };

    setTrips([...trips, trip]);
    setNewTrip({
      name: "",
      destination: "",
      startDate: "",
      endDate: "",
      budget: 0,
      status: "planning",
      description: "",
      color: "#3B82F6",
    });
    setShowForm(false);
  };

  const updateTrip = (e) => {
    e.preventDefault();
    if (!editingTrip.name.trim() || !editingTrip.destination.trim()) return;

    setTrips(
      trips.map((trip) => (trip.id === editingTrip.id ? editingTrip : trip))
    );
    setEditingTrip(null);
  };

  const deleteTrip = (id) => {
    setTrips(trips.filter((trip) => trip.id !== id));
    if (selectedTrip?.id === id) {
      setSelectedTrip(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: "bg-yellow-500",
      planned: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusText = (status) => {
    const texts = {
      planning: "Planning",
      planned: "Planned",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return texts[status] || status;
  };

  const getTotalExpenses = (trip) => {
    return trip.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getPackedItems = (trip) => {
    return trip.packingList.filter((item) => item.packed).length;
  };

  const getStats = () => {
    const totalTrips = trips.length;
    const plannedTrips = trips.filter(
      (trip) => trip.status === "planned"
    ).length;
    const completedTrips = trips.filter(
      (trip) => trip.status === "completed"
    ).length;
    const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);

    return { totalTrips, plannedTrips, completedTrips, totalBudget };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <span>🏠</span> Go to Dashboard
            </button>
            <div className="flex-1"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            ✈️ Travel Planner
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Plan your adventures, track expenses, and create unforgettable
            memories
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalTrips}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Trips
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.plannedTrips}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Planned Trips
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.completedTrips}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completed Trips
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              ${stats.totalBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Budget
            </div>
          </div>
        </div>

        {/* Add Trip Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <span>➕</span> Add New Trip
          </button>
        </div>

        {/* Add Trip Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Add New Trip
            </h3>
            <form onSubmit={addTrip} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Trip name"
                  value={newTrip.name}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, name: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Destination"
                  value={newTrip.destination}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, destination: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="date"
                  placeholder="Start date"
                  value={newTrip.startDate}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, startDate: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="date"
                  placeholder="End date"
                  value={newTrip.endDate}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, endDate: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Budget"
                  value={newTrip.budget}
                  onChange={(e) =>
                    setNewTrip({
                      ...newTrip,
                      budget: parseInt(e.target.value) || 0,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0"
                />
              </div>
              <textarea
                placeholder="Description"
                value={newTrip.description}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={newTrip.status}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, status: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="planning">Planning</option>
                  <option value="planned">Planned</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input
                  type="color"
                  value={newTrip.color}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, color: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Trip
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Trip Form */}
        {editingTrip && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Edit Trip
            </h3>
            <form onSubmit={updateTrip} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Trip name"
                  value={editingTrip.name}
                  onChange={(e) =>
                    setEditingTrip({ ...editingTrip, name: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Destination"
                  value={editingTrip.destination}
                  onChange={(e) =>
                    setEditingTrip({
                      ...editingTrip,
                      destination: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="date"
                  placeholder="Start date"
                  value={editingTrip.startDate}
                  onChange={(e) =>
                    setEditingTrip({
                      ...editingTrip,
                      startDate: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="date"
                  placeholder="End date"
                  value={editingTrip.endDate}
                  onChange={(e) =>
                    setEditingTrip({ ...editingTrip, endDate: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Budget"
                  value={editingTrip.budget}
                  onChange={(e) =>
                    setEditingTrip({
                      ...editingTrip,
                      budget: parseInt(e.target.value) || 0,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0"
                />
              </div>
              <textarea
                placeholder="Description"
                value={editingTrip.description}
                onChange={(e) =>
                  setEditingTrip({
                    ...editingTrip,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={editingTrip.status}
                  onChange={(e) =>
                    setEditingTrip({ ...editingTrip, status: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="planning">Planning</option>
                  <option value="planned">Planned</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input
                  type="color"
                  value={editingTrip.color}
                  onChange={(e) =>
                    setEditingTrip({ ...editingTrip, color: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Trip
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTrip(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Trips List */}
        <div className="space-y-4">
          {trips.map((trip) => {
            const totalExpenses = getTotalExpenses(trip);
            const packedItems = getPackedItems(trip);

            return (
              <div
                key={trip.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4"
                style={{ borderLeftColor: trip.color }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">✈️</span>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {trip.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(
                          trip.status
                        )}`}
                      >
                        {getStatusText(trip.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      📍 {trip.destination}
                    </p>
                    {trip.description && (
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {trip.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        📅 {trip.startDate} - {trip.endDate}
                      </span>
                      <span>💰 Budget: ${trip.budget.toLocaleString()}</span>
                      <span>💸 Spent: ${totalExpenses.toLocaleString()}</span>
                      <span>
                        📦 Packed: {packedItems}/{trip.packingList.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setSelectedTrip(
                          selectedTrip?.id === trip.id ? null : trip
                        )
                      }
                      className="text-blue-500 hover:text-blue-700 text-lg"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => setEditingTrip(trip)}
                      className="text-blue-500 hover:text-blue-700 text-lg"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="text-red-500 hover:text-red-700 text-lg"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>
                      Budget Usage: ${totalExpenses.toLocaleString()}/$
                      {trip.budget.toLocaleString()}
                    </span>
                    <span>
                      {Math.round((totalExpenses / trip.budget) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (totalExpenses / trip.budget) * 100,
                          100
                        )}%`,
                        backgroundColor:
                          totalExpenses > trip.budget ? "#EF4444" : trip.color,
                      }}
                    />
                  </div>
                </div>

                {/* Trip Details (Expandable) */}
                {selectedTrip?.id === trip.id && (
                  <div className="mt-4 space-y-4">
                    {/* Itinerary */}
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        📅 Itinerary
                      </h4>
                      <div className="space-y-2">
                        {trip.itinerary.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-medium text-gray-800 dark:text-white">
                                  Day {item.day}: {item.activity}
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.time} at {item.location}
                                </p>
                                {item.notes && (
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    💡 {item.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expenses */}
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        💰 Expenses
                      </h4>
                      <div className="space-y-2">
                        {trip.expenses.map((expense) => (
                          <div
                            key={expense.id}
                            className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                          >
                            <div>
                              <span className="font-medium text-gray-800 dark:text-white">
                                {expense.name}
                              </span>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {expense.category} • {expense.date}
                              </p>
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-white">
                              ${expense.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Packing List */}
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        📦 Packing List
                      </h4>
                      <div className="space-y-2">
                        {trip.packingList.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                          >
                            <span
                              className={
                                item.packed ? "text-green-500" : "text-gray-400"
                              }
                            >
                              {item.packed ? "✅" : "⭕"}
                            </span>
                            <span
                              className={`text-gray-800 dark:text-white ${
                                item.packed ? "line-through" : ""
                              }`}
                            >
                              {item.item}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              ({item.category})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {trips.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No trips planned yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start planning your next adventure by adding your first trip!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Plan Your First Trip
            </button>
          </div>
        )}
      </div>

      {/* AI Chat Bot */}
      <AIChatBot />
    </div>
  );
}
