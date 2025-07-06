"use client";

import { useState, useEffect } from "react";
import UserManager from "./UserManager";
import TaskAllocation from "./TaskAllocation";
import AssignedTasks from "./AssignedTasks";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);
  const [showTaskAllocation, setShowTaskAllocation] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assignedTasksRefreshKey, setAssignedTasksRefreshKey] = useState(0);
  const [recentAssignedTasks, setRecentAssignedTasks] = useState([]);
  const [userManagementOpen, setUserManagementOpen] = useState(false);

  const ROLE_DEFINITIONS = {
    admin: {
      name: "Administrator",
      icon: "👑",
      description:
        "Full system access with complete control over all features, users, and data.",
      color: "from-pink-400 to-purple-400",
      permissions: [
        "All permissions",
        "User management",
        "Role management",
        "System configuration",
      ],
      level: 5,
      sampleUsers: [
        {
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com",
          department: "IT",
          lastActive: "2 hours ago",
        },
        {
          name: "Michael Chen",
          email: "michael.chen@company.com",
          department: "Operations",
          lastActive: "1 day ago",
        },
      ],
    },
    hr: {
      name: "HR Manager",
      icon: "🧑‍💼",
      description:
        "Human resources management with employee oversight capabilities.",
      color: "from-blue-400 to-cyan-400",
      permissions: [
        "Employee management",
        "Performance reviews",
        "Recruitment",
        "HR analytics",
      ],
      level: 4,
      sampleUsers: [
        {
          name: "Emily Rodriguez",
          email: "emily.rodriguez@company.com",
          department: "Human Resources",
          lastActive: "30 minutes ago",
        },
        {
          name: "David Thompson",
          email: "david.thompson@company.com",
          department: "HR",
          lastActive: "3 hours ago",
        },
      ],
    },
    marketing: {
      name: "Marketing Specialist",
      icon: "📢",
      description: "Marketing campaign management and content creation.",
      color: "from-green-400 to-emerald-400",
      permissions: [
        "Campaign management",
        "Content creation",
        "Analytics",
        "Social media",
      ],
      level: 3,
      sampleUsers: [
        {
          name: "Jessica Lee",
          email: "jessica.lee@company.com",
          department: "Marketing",
          lastActive: "1 hour ago",
        },
        {
          name: "Alex Martinez",
          email: "alex.martinez@company.com",
          department: "Digital Marketing",
          lastActive: "4 hours ago",
        },
      ],
    },
    finance: {
      name: "Finance Manager",
      icon: "💰",
      description: "Financial data management and reporting capabilities.",
      color: "from-yellow-400 to-orange-400",
      permissions: [
        "Financial reporting",
        "Budget management",
        "Expense tracking",
        "Data export",
      ],
      level: 4,
      sampleUsers: [
        {
          name: "Robert Wilson",
          email: "robert.wilson@company.com",
          department: "Finance",
          lastActive: "2 hours ago",
        },
        {
          name: "Lisa Anderson",
          email: "lisa.anderson@company.com",
          department: "Accounting",
          lastActive: "1 day ago",
        },
      ],
    },
    blog_writer: {
      name: "Blog Writer",
      icon: "📝",
      description: "Content creation and blog management.",
      color: "from-purple-400 to-pink-400",
      permissions: [
        "Content creation",
        "Blog management",
        "SEO optimization",
        "Publishing",
      ],
      level: 2,
      sampleUsers: [
        {
          name: "Maria Garcia",
          email: "maria.garcia@company.com",
          department: "Content",
          lastActive: "45 minutes ago",
        },
        {
          name: "James Brown",
          email: "james.brown@company.com",
          department: "Editorial",
          lastActive: "6 hours ago",
        },
      ],
    },
    seo_manager: {
      name: "SEO Manager",
      icon: "🔍",
      description:
        "Search engine optimization and digital marketing analytics.",
      color: "from-indigo-400 to-blue-400",
      permissions: [
        "SEO analysis",
        "Keyword research",
        "Performance tracking",
        "Content optimization",
      ],
      level: 3,
      sampleUsers: [
        {
          name: "Amanda Taylor",
          email: "amanda.taylor@company.com",
          department: "SEO",
          lastActive: "1 hour ago",
        },
        {
          name: "Kevin Davis",
          email: "kevin.davis@company.com",
          department: "Digital Marketing",
          lastActive: "2 hours ago",
        },
      ],
    },
    project_manager: {
      name: "Project Manager",
      icon: "📁",
      description: "Project planning, execution, and team coordination.",
      color: "from-teal-400 to-cyan-400",
      permissions: [
        "Project planning",
        "Team coordination",
        "Progress tracking",
        "Resource allocation",
      ],
      level: 4,
      sampleUsers: [
        {
          name: "Rachel Green",
          email: "rachel.green@company.com",
          department: "Project Management",
          lastActive: "30 minutes ago",
        },
        {
          name: "Thomas White",
          email: "thomas.white@company.com",
          department: "Operations",
          lastActive: "1 hour ago",
        },
      ],
    },
    developer: {
      name: "Developer",
      icon: "💻",
      description: "Software development and technical implementation.",
      color: "from-gray-400 to-slate-400",
      permissions: [
        "Code development",
        "Technical documentation",
        "Bug tracking",
        "Version control",
      ],
      level: 3,
      sampleUsers: [
        {
          name: "Daniel Kim",
          email: "daniel.kim@company.com",
          department: "Engineering",
          lastActive: "15 minutes ago",
        },
        {
          name: "Sophie Turner",
          email: "sophie.turner@company.com",
          department: "Development",
          lastActive: "2 hours ago",
        },
      ],
    },
    designer: {
      name: "Designer",
      icon: "🎨",
      description: "UI/UX design and creative asset creation.",
      color: "from-pink-400 to-rose-400",
      permissions: [
        "Design creation",
        "Asset management",
        "Prototyping",
        "Design reviews",
      ],
      level: 2,
      sampleUsers: [
        {
          name: "Olivia Parker",
          email: "olivia.parker@company.com",
          department: "Design",
          lastActive: "1 hour ago",
        },
        {
          name: "Ethan Moore",
          email: "ethan.moore@company.com",
          department: "Creative",
          lastActive: "3 hours ago",
        },
      ],
    },
    user: {
      name: "Standard User",
      icon: "👤",
      description: "Basic user access with limited permissions.",
      color: "from-blue-400 to-green-400",
      permissions: [
        "Basic CRUD operations",
        "Content viewing",
        "Personal data management",
      ],
      level: 1,
      sampleUsers: [
        {
          name: "John Smith",
          email: "john.smith@company.com",
          department: "Sales",
          lastActive: "2 hours ago",
        },
        {
          name: "Emma Wilson",
          email: "emma.wilson@company.com",
          department: "Customer Support",
          lastActive: "1 day ago",
        },
      ],
    },
    moderator: {
      name: "Moderator",
      icon: "🛡️",
      description: "Content moderation and user management capabilities.",
      color: "from-orange-400 to-red-400",
      permissions: [
        "Content moderation",
        "User management",
        "Community guidelines",
        "Reporting",
      ],
      level: 3,
      sampleUsers: [
        {
          name: "Chris Johnson",
          email: "chris.johnson@company.com",
          department: "Community",
          lastActive: "45 minutes ago",
        },
        {
          name: "Nina Patel",
          email: "nina.patel@company.com",
          department: "Support",
          lastActive: "1 hour ago",
        },
      ],
    },
    editor: {
      name: "Editor",
      icon: "✏️",
      description: "Content editing and review capabilities.",
      color: "from-emerald-400 to-teal-400",
      permissions: [
        "Content editing",
        "Review process",
        "Quality assurance",
        "Publishing approval",
      ],
      level: 2,
      sampleUsers: [
        {
          name: "Mark Davis",
          email: "mark.davis@company.com",
          department: "Editorial",
          lastActive: "1 hour ago",
        },
        {
          name: "Laura Chen",
          email: "laura.chen@company.com",
          department: "Content",
          lastActive: "2 hours ago",
        },
      ],
    },
    viewer: {
      name: "Viewer",
      icon: "👁️",
      description: "Read-only access for stakeholders and external parties.",
      color: "from-gray-400 to-slate-400",
      permissions: ["Content viewing", "Report access", "Limited data access"],
      level: 0,
      sampleUsers: [
        {
          name: "Peter Brown",
          email: "peter.brown@company.com",
          department: "External",
          lastActive: "1 week ago",
        },
        {
          name: "Anna Lee",
          email: "anna.lee@company.com",
          department: "Consultant",
          lastActive: "3 days ago",
        },
      ],
    },
  };

  // Dummy data for demonstration
  const DUMMY_USERS = [
    {
      _id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      roles: ["admin"],
      role: "admin",
      taskCount: 15,
      department: "IT",
      lastActive: "2 hours ago",
      status: "active",
      joinDate: "2023-01-15",
    },
    {
      _id: "2",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      roles: ["hr"],
      role: "hr",
      taskCount: 8,
      department: "Human Resources",
      lastActive: "30 minutes ago",
      status: "active",
      joinDate: "2023-03-20",
    },
    {
      _id: "3",
      name: "Jessica Lee",
      email: "jessica.lee@company.com",
      roles: ["marketing"],
      role: "marketing",
      taskCount: 12,
      department: "Marketing",
      lastActive: "1 hour ago",
      status: "active",
      joinDate: "2023-02-10",
    },
    {
      _id: "4",
      name: "Robert Wilson",
      email: "robert.wilson@company.com",
      roles: ["finance"],
      role: "finance",
      taskCount: 6,
      department: "Finance",
      lastActive: "2 hours ago",
      status: "active",
      joinDate: "2023-01-25",
    },
    {
      _id: "5",
      name: "Maria Garcia",
      email: "maria.garcia@company.com",
      roles: ["blog_writer"],
      role: "blog_writer",
      taskCount: 9,
      department: "Content",
      lastActive: "45 minutes ago",
      status: "active",
      joinDate: "2023-04-05",
    },
    {
      _id: "6",
      name: "Amanda Taylor",
      email: "amanda.taylor@company.com",
      roles: ["seo_manager"],
      role: "seo_manager",
      taskCount: 11,
      department: "SEO",
      lastActive: "1 hour ago",
      status: "active",
      joinDate: "2023-03-15",
    },
    {
      _id: "7",
      name: "Rachel Green",
      email: "rachel.green@company.com",
      roles: ["project_manager"],
      role: "project_manager",
      taskCount: 18,
      department: "Project Management",
      lastActive: "30 minutes ago",
      status: "active",
      joinDate: "2023-02-28",
    },
    {
      _id: "8",
      name: "Daniel Kim",
      email: "daniel.kim@company.com",
      roles: ["developer"],
      role: "developer",
      taskCount: 14,
      department: "Engineering",
      lastActive: "15 minutes ago",
      status: "active",
      joinDate: "2023-01-10",
    },
    {
      _id: "9",
      name: "Olivia Parker",
      email: "olivia.parker@company.com",
      roles: ["designer"],
      role: "designer",
      taskCount: 7,
      department: "Design",
      lastActive: "1 hour ago",
      status: "active",
      joinDate: "2023-03-01",
    },
    {
      _id: "10",
      name: "John Smith",
      email: "john.smith@company.com",
      roles: ["user"],
      role: "user",
      taskCount: 3,
      department: "Sales",
      lastActive: "2 hours ago",
      status: "active",
      joinDate: "2023-05-12",
    },
  ];

  useEffect(() => {
    fetchAdminStats();
    fetchRecentAssignedTasks();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAssignedTasks = async () => {
    try {
      const response = await fetch("/api/tasks?assignedBy=admin&limit=5");
      if (response.ok) {
        const data = await response.json();
        setRecentAssignedTasks(data.tasks || []);
      }
    } catch (error) {
      console.error("Error fetching recent assigned tasks:", error);
    }
  };

  const handleResetAll = async () => {
    if (
      !confirm(
        "Are you sure you want to reset ALL data? This action cannot be undone!"
      )
    ) {
      return;
    }

    setResetLoading(true);
    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
      });

      if (response.ok) {
        alert("All data has been reset successfully!");
        fetchAdminStats();
      } else {
        alert("Failed to reset data");
      }
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Error resetting data");
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserManager(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserManager(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAdminStats();
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  const handleUserUpdate = () => {
    fetchAdminStats();
    setShowUserManager(false);
    setEditingUser(null);
  };

  const handleTaskCreated = () => {
    fetchAdminStats();
    setAssignedTasksRefreshKey((k) => k + 1);
    fetchRecentAssignedTasks();
  };

  // User Management Dropdown Section
  const userManagementDropdown = (
    <div className="mt-8">
      <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
        User Management
      </div>
      <ul className="space-y-1 px-4">
        <li>
          <button
            className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
              ["roles", "permissions"].includes(activeTab)
                ? "bg-purple-100 text-purple-700"
                : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
            }`}
            onClick={() => setUserManagementOpen((prev) => !prev)}
          >
            <span className="text-lg">👥</span>
            <span>User Management</span>
            <span className="ml-auto text-xs">
              {userManagementOpen ? "▲" : "▼"}
            </span>
          </button>
          {userManagementOpen && (
            <div className="ml-4 mt-1 border-l border-purple-500 pl-2">
              <ul className="space-y-1">
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                      activeTab === "roles"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                    onClick={() => setActiveTab("roles")}
                  >
                    <span className="text-lg">🛡️</span>
                    <span>Roles</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                      activeTab === "permissions"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                    onClick={() => setActiveTab("permissions")}
                  >
                    <span className="text-lg">🔑</span>
                    <span>Permissions</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </li>
      </ul>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-50 to-purple-50 relative">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 w-72 bg-white/90 backdrop-blur-md border-r border-pink-200 shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-pink-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full">
              <span className="text-xl">👑</span>
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-wide">
              Admin Panel
            </span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-pink-600"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="text-xs uppercase text-gray-500 px-4 mb-2">
            Admin Navigation
          </div>
          <ul className="space-y-1 px-4">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                  activeTab === "dashboard"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                <span className="text-lg">📊</span>
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("task-allocation")}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                  activeTab === "task-allocation"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                <span className="text-lg">📋</span>
                <span>Task Allocation</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("assigned-tasks")}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium ${
                  activeTab === "assigned-tasks"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                <span className="text-lg">📝</span>
                <span>Assigned Tasks</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleCreateUser}
                className="flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-700"
              >
                <span className="text-lg">👤</span>
                <span>Create User</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleResetAll}
                disabled={resetLoading}
                className="flex items-center w-full px-4 py-2 rounded-lg transition-colors text-left gap-3 font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
              >
                <span className="text-lg">🗑️</span>
                <span>{resetLoading ? "Resetting..." : "Reset Data"}</span>
              </button>
            </li>
          </ul>

          {/* User Management Dropdown Section */}
          {userManagementDropdown}
        </nav>

        <div className="p-4 border-t border-pink-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg hover:from-red-500 hover:to-pink-500 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {!sidebarOpen && (
        <button
          className="fixed z-50 top-4 left-4 lg:hidden p-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto relative">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-pink-100 p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {activeTab === "dashboard" && "Admin Dashboard"}
                  {activeTab === "task-allocation" && "Task Allocation"}
                  {activeTab === "assigned-tasks" && "Assigned Tasks"}
                </h1>
                <p className="text-gray-600">
                  {activeTab === "dashboard" &&
                    "System overview and user management"}
                  {activeTab === "task-allocation" &&
                    "Assign tasks to team members"}
                  {activeTab === "assigned-tasks" &&
                    "Monitor task progress and status"}
                </p>
              </div>
            </div>
            {activeTab === "task-allocation" && (
              <button
                onClick={() => setShowTaskAllocation(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-xl font-medium hover:from-green-500 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>📋</span>
                Assign New Task
              </button>
            )}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-pink-600">
                      {stats?.totalUsers || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-pink-100 rounded-full">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats?.activeUserCount || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <span className="text-2xl">🟢</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Tasks
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats?.totalTasks || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats?.completedTasks || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Assigned Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span>
                Recently Assigned Tasks
              </h2>
              {recentAssignedTasks.length === 0 ? (
                <div className="text-gray-500 flex items-center gap-2">
                  <span className="text-2xl">🗒️</span> No tasks have been
                  assigned yet.
                </div>
              ) : (
                <ul className="divide-y divide-pink-50">
                  {recentAssignedTasks.map((task) => (
                    <li key={task._id} className="py-3 flex items-center gap-4">
                      <span className="text-2xl">
                        {task.category === "work"
                          ? "💼"
                          : task.category === "personal"
                          ? "👤"
                          : task.category === "urgent"
                          ? "🚨"
                          : task.category === "meeting"
                          ? "🤝"
                          : task.category === "project"
                          ? "📁"
                          : "📌"}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          Assigned to: {task.assignedToName || "Unknown User"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {task.dueDate
                            ? `Due: ${new Date(
                                task.dueDate
                              ).toLocaleDateString()}`
                            : null}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === "urgent"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "high"
                            ? "bg-orange-100 text-orange-700"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Admin Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚙️</span>
                Admin Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab("task-allocation")}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-xl font-medium hover:from-green-500 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span>📋</span>
                  Assign Tasks
                </button>
                <button
                  onClick={handleCreateUser}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span>👤</span>
                  Create New User
                </button>
                <button
                  onClick={handleResetAll}
                  disabled={resetLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl font-medium hover:from-red-500 hover:to-pink-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? (
                    <span className="animate-spin">🔄</span>
                  ) : (
                    <span>🗑️</span>
                  )}
                  {resetLoading ? "Resetting..." : "Reset All Data"}
                </button>
              </div>
            </div>

            {/* Enhanced User Management with Dummy Data */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  User Management 👥
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {DUMMY_USERS.length} users registered
                  </span>
                  <button
                    onClick={handleCreateUser}
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg hover:from-green-500 hover:to-blue-500 transition-all duration-200 text-sm"
                  >
                    + Add User
                  </button>
                </div>
              </div>

              {/* Role Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {Object.entries(ROLE_DEFINITIONS)
                  .slice(0, 6)
                  .map(([key, role]) => (
                    <div
                      key={key}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{role.icon}</span>
                        <span className="text-xs font-medium text-gray-700">
                          {role.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Level {role.level} • {role.permissions.length}{" "}
                        permissions
                      </div>
                    </div>
                  ))}
              </div>

              {/* Enhanced Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Department
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Role & Permissions
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Activity
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUMMY_USERS.map((user) => {
                      const primaryRole =
                        user.roles?.[0] || user.role || "user";
                      const roleDef = ROLE_DEFINITIONS[primaryRole];

                      return (
                        <tr
                          key={user._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium bg-gradient-to-r ${
                                  roleDef?.color || "from-blue-400 to-green-400"
                                }`}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Joined {user.joinDate}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-700">
                              {user.department}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.taskCount} tasks assigned
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {(user.roles && user.roles.length > 0
                                  ? user.roles
                                  : [user.role || "user"]
                                ).map((roleKey) => {
                                  const roleObj = ROLE_DEFINITIONS[roleKey];
                                  return (
                                    <span
                                      key={roleKey}
                                      className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                                        roleObj?.color ||
                                        "from-blue-400 to-green-400"
                                      } text-white flex items-center gap-1`}
                                    >
                                      <span>{roleObj?.icon || "👤"}</span>
                                      {roleObj?.name || roleKey}
                                    </span>
                                  );
                                })}
                              </div>
                              <div className="text-xs text-gray-500 max-w-xs">
                                {roleDef?.description}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    user.status === "active"
                                      ? "bg-green-400"
                                      : "bg-gray-400"
                                  }`}
                                ></div>
                                <span className="text-sm text-gray-700 capitalize">
                                  {user.status}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Last active: {user.lastActive}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm"
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors text-sm"
                                title="View permissions"
                              >
                                Permissions
                              </button>
                              {user.role !== "admin" && (
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Role Information Panel */}
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📋</span>
                  Role Information & Permissions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => (
                    <div
                      key={key}
                      className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{role.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {role.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Level {role.level}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {role.description}
                      </p>
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-700">
                          Key Permissions:
                        </div>
                        {role.permissions.slice(0, 3).map((permission, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-gray-600 flex items-center gap-1"
                          >
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            {permission}
                          </div>
                        ))}
                        {role.permissions.length > 3 && (
                          <div className="text-xs text-purple-600">
                            +{role.permissions.length - 3} more permissions
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "task-allocation" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-center py-12">
              <span className="text-6xl mb-6 block">📋</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Task Allocation Center
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Assign tasks to team members, set priorities, and track
                progress. Keep your team organized and productive.
              </p>
              <button
                onClick={() => setShowTaskAllocation(true)}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
              >
                <span>📋</span>
                Assign New Task
              </button>
            </div>
          </div>
        )}

        {activeTab === "assigned-tasks" && (
          <AssignedTasks refreshKey={assignedTasksRefreshKey} />
        )}

        {activeTab === "roles" && (
          <div className="space-y-6">
            {/* Role Management Header */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span>🛡️</span>
                    Role Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage user roles and their permissions
                  </p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-200">
                  + Create New Role
                </button>
              </div>

              {/* Role Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👥</span>
                    <span className="text-sm font-medium text-gray-700">
                      Total Roles
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(ROLE_DEFINITIONS).length}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🔑</span>
                    <span className="text-sm font-medium text-gray-700">
                      Active Users
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {DUMMY_USERS.length}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📊</span>
                    <span className="text-sm font-medium text-gray-700">
                      Avg Permissions
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(
                      Object.values(ROLE_DEFINITIONS).reduce(
                        (acc, role) => acc + role.permissions.length,
                        0
                      ) / Object.keys(ROLE_DEFINITIONS).length
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-sm font-medium text-gray-700">
                      High Level
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      Object.values(ROLE_DEFINITIONS).filter(
                        (role) => role.level >= 4
                      ).length
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Role Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => (
                <div
                  key={key}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl bg-gradient-to-r ${role.color}`}
                      >
                        {role.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {role.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Level {role.level}</span>
                          <span>•</span>
                          <span>{role.permissions.length} permissions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors text-sm">
                        Permissions
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{role.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Key Permissions:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 4).map((permission, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 4 && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                            +{role.permissions.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Sample Users:
                      </h4>
                      <div className="space-y-1">
                        {role.sampleUsers.map((user, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-gray-600">{user.name}</span>
                            <span className="text-gray-400">
                              {user.lastActive}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Access Level: {role.level}/5</span>
                        <span>Created: 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="space-y-6">
            {/* Permission Management Header */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span>🔑</span>
                    Permission Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Configure and manage role-based permissions
                  </p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg hover:from-green-500 hover:to-blue-500 transition-all duration-200">
                  + Add Permission
                </button>
              </div>

              {/* Permission Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👑</span>
                    <span className="text-sm font-medium text-gray-700">
                      Admin
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">All</div>
                  <div className="text-xs text-gray-500">
                    Full system access
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🛡️</span>
                    <span className="text-sm font-medium text-gray-700">
                      Security
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-xs text-gray-500">
                    User & role management
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📝</span>
                    <span className="text-sm font-medium text-gray-700">
                      Content
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <div className="text-xs text-gray-500">
                    Content management
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📊</span>
                    <span className="text-sm font-medium text-gray-700">
                      Analytics
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-xs text-gray-500">Data & reporting</div>
                </div>
              </div>
            </div>

            {/* Permission Matrix */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span>
                Permission Matrix by Role
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Permission
                      </th>
                      {Object.keys(ROLE_DEFINITIONS)
                        .slice(0, 8)
                        .map((roleKey) => (
                          <th
                            key={roleKey}
                            className="text-center py-3 px-2 font-medium text-gray-600"
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-lg">
                                {ROLE_DEFINITIONS[roleKey].icon}
                              </span>
                              <span className="text-xs">
                                {ROLE_DEFINITIONS[roleKey].name}
                              </span>
                            </div>
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "User Management",
                      "Role Management",
                      "Content Creation",
                      "Content Editing",
                      "Content Deletion",
                      "Analytics Access",
                      "Data Export",
                      "System Configuration",
                    ].map((permission, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm font-medium text-gray-700">
                          {permission}
                        </td>
                        {Object.keys(ROLE_DEFINITIONS)
                          .slice(0, 8)
                          .map((roleKey) => {
                            const role = ROLE_DEFINITIONS[roleKey];
                            const hasPermission = role.permissions.some((p) =>
                              p
                                .toLowerCase()
                                .includes(
                                  permission.toLowerCase().split(" ")[0]
                                )
                            );
                            return (
                              <td
                                key={roleKey}
                                className="text-center py-3 px-2"
                              >
                                <div
                                  className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${
                                    hasPermission
                                      ? "bg-green-100 text-green-600"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {hasPermission ? "✓" : "✗"}
                                </div>
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Permission Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(ROLE_DEFINITIONS)
                .slice(0, 6)
                .map(([key, role]) => (
                  <div
                    key={key}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${role.color}`}
                      >
                        {role.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {role.name}
                        </h3>
                        <div className="text-sm text-gray-500">
                          Level {role.level} • {role.permissions.length}{" "}
                          permissions
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          All Permissions:
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {role.permissions.map((permission, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs"
                            >
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-gray-600">
                                {permission}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Access Level: {role.level}/5</span>
                          <span>Users: {role.sampleUsers.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* User Manager Modal */}
      {showUserManager && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-pink-100">
            <UserManager
              user={editingUser}
              onClose={() => {
                setShowUserManager(false);
                setEditingUser(null);
              }}
              onUserUpdate={handleUserUpdate}
            />
          </div>
        </div>
      )}

      {/* Task Allocation Modal */}
      {showTaskAllocation && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <TaskAllocation
            onClose={() => setShowTaskAllocation(false)}
            onTaskCreated={handleTaskCreated}
          />
        </div>
      )}
    </div>
  );
}
