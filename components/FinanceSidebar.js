import React from "react";

export default function FinanceSidebar({ onLogout, user }) {
  return (
    <aside className="flex flex-col h-screen w-64 border-r shadow-xl bg-white/90 border-gray-200 dark:bg-[#181c2a] dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800 justify-between transition-colors duration-300">
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-wide">
          Finance Panel
        </span>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <a
              href="/finance-dashboard"
              className="block px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              🏠 Dashboard
            </a>
          </li>
          <li>
            <a
              href="#budgets"
              className="block px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              💰 Budgets
            </a>
          </li>
          <li>
            <a
              href="#reports"
              className="block px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              📊 Reports
            </a>
          </li>
          <li>
            <a
              href="#invoices"
              className="block px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              🧾 Invoices
            </a>
          </li>
          <li>
            <a
              href="#settings"
              className="block px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              ⚙️ Settings
            </a>
          </li>
        </ul>
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
