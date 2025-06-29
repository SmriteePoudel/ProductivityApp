import { useState, useRef, useEffect } from "react";

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((msgs) => [...msgs, { from: "bot", text: data.reply }]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: data.error || "Sorry, I couldn't get a response.",
          },
        ]);
      }
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, there was a network error." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-8 z-[100] bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full shadow-lg p-4 text-2xl hover:scale-110 transition-all duration-200 focus:outline-none"
        title="Chat with AI Assistant"
        style={{ boxShadow: "0 4px 24px 0 rgba(236, 72, 153, 0.2)" }}
      >
        💬
      </button>
      {/* Chat Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          {/* Chat Window */}
          <div
            className="absolute bottom-24 right-8 w-full max-w-xs sm:max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-pink-200 dark:border-purple-700 flex flex-col overflow-hidden animate-fadeInUp pointer-events-auto"
            style={{ minWidth: 320 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-gray-800 dark:to-purple-900 border-b border-pink-100 dark:border-purple-700">
              <span className="font-bold text-pink-600 dark:text-pink-200 text-lg flex items-center gap-2">
                <span>🤖</span> AI Assistant
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-pink-500 text-xl"
                title="Close"
              >
                ×
              </button>
            </div>
            {/* Messages */}
            <div
              className="flex-1 p-4 space-y-2 overflow-y-auto bg-pastel-pink/10 dark:bg-gray-900/60"
              style={{ minHeight: 240, maxHeight: 320 }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl shadow text-sm max-w-[80%] ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-pink-300 to-purple-300 text-gray-900"
                        : "bg-white dark:bg-gray-800 text-pink-700 dark:text-pink-200 border border-pink-100 dark:border-purple-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-2xl shadow text-sm bg-white dark:bg-gray-800 text-pink-700 dark:text-pink-200 border border-pink-100 dark:border-purple-700 opacity-70">
                    ...
                  </div>
                </div>
              )}
              {error && (
                <div className="text-xs text-red-500 text-center mt-2">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="flex items-center gap-2 p-3 border-t border-pink-100 dark:border-purple-700 bg-pastel-pink/30 dark:bg-gray-800"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 rounded-lg border border-pink-200 dark:border-purple-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-200"
                autoFocus
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-lg font-bold shadow hover:scale-105 transition-all"
                disabled={loading}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
