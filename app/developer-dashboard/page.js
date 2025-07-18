"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UnifiedDashboard from "@/components/UnifiedDashboard";

export default function DeveloperDashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();

        // Check if user has developer role
        if (userData.user.role !== "developer") {
          router.push("/");
          return;
        }

        setUser(userData.user);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Logout failed:", response.status);
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading Developer Dashboard... 💻
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <UnifiedDashboard user={user} onLogout={handleLogout} />
    </div>
  );
}
