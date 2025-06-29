"use client";

export default function TrashModal({
  isOpen,
  onClose,
  trashPages,
  onRestore,
  onPermanentDelete,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-pink-100 dark:border-purple-600 p-6 w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            🗑️ Trashed Pages
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-2">
          {trashPages.length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
              Your trash is empty! ✨
            </div>
          )}
          {trashPages.map((page) => (
            <div
              key={page.id}
              className="flex items-center group bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg"
            >
              <span className="flex-1 text-gray-600 dark:text-gray-300 italic truncate">
                {page.name}
              </span>
              <button
                onClick={() => onRestore(page.id)}
                className="ml-2 text-lg text-green-500 hover:text-green-700 transition"
                title="Restore"
              >
                ♻️
              </button>
              <button
                onClick={() => onPermanentDelete(page.id)}
                className="ml-2 text-lg text-red-400 hover:text-red-600 transition"
                title="Delete Forever"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
