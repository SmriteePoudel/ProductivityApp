"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestLogoutPage() {
  const [status, setStatus] = useState("");
  const router = useRouter();

  const testLogout = async () => {
    try {
      setStatus("Testing logout...");

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        setStatus("✅ Logout successful!");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setStatus(`❌ Logout failed: ${response.status}`);
      }
    } catch (error) {
      setStatus(`❌ Logout error: ${error.message}`);
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Logout Test</h1>
        <button
          onClick={testLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
        >
          Test Logout
        </button>
        {status && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="text-sm">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
