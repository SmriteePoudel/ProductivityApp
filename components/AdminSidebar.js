import React from "react";

export default function AdminSidebar({ onLogout, user, onSectionChange }) {
  return (
    <aside className="flex flex-col h-screen w-64 border-r shadow-xl bg-white/90 border-gray-200 dark:bg-[#181c2a] dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800 justify-between transition-colors duration-300">
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-wide">
          Admin Panel
        </span>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <a
              href="/admin-dashboard"
              className="block px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              🏠 Dashboard
            </a>
          </li>
          <li>
            <a
              href="#task-allocation"
              className="block px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              🗂️ Task Allocation
            </a>
          </li>
          <li>
            <a
              href="#assigned-tasks"
              className="block px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              ✅ Assigned Tasks
            </a>
          </li>
          <li>
            <a
              href="#create-user"
              className="block px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              ➕ Create User
            </a>
          </li>
          <li>
            <a
              href="#user-data"
              className="block px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              📄 User Data
            </a>
          </li>
        </ul>
        <div className="mt-6">
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 pl-4">
            User Management
          </div>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => onSectionChange && onSectionChange("roles")}
                className="w-full text-left block px-4 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <span className="mr-2">🧑‍🤝‍🧑</span> Roles
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() =>
                  onSectionChange && onSectionChange("permissions")
                }
                className="w-full text-left block px-4 py-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900"
              >
                <span className="mr-2">🔑</span> Permissions
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 bg-pastel-pink text-gray-900 rounded-lg hover:bg-pastel-blue transition-all duration-200 shadow-md hover:shadow-lg font-bold"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
