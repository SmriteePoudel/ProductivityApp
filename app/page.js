"use client";

import { useState, useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import UnifiedDashboard from "@/components/UnifiedDashboard";
import { useRouter } from "next/navigation";

export default function Home() {
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
        setUser(userData.user);

        // Redirect to role-specific dashboard
        redirectToRoleDashboard(userData.user.role);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const redirectToRoleDashboard = (role) => {
    const roleRoutes = {
      admin: "/admin-dashboard",
      hr: "/hr-dashboard",
      marketing: "/marketing-dashboard",
      finance: "/finance-dashboard",
      blog_writer: "/blog-dashboard",
      seo_manager: "/seo-dashboard",
      project_manager: "/project-dashboard",
      developer: "/developer-dashboard",
      designer: "/designer-dashboard",
    };

    const route = roleRoutes[role];
    if (route && route !== window.location.pathname) {
      router.push(route);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        setUser(null);
        router.push("/");
      } else {
        console.error("Logout failed:", response.status);
        // Fallback: clear cookie manually and redirect
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setUser(null);
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear cookie manually and redirect
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your productivity space... ✨
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex items-center justify-center p-4">
        <AuthForm
          onAuthSuccess={(userData) => {
            setUser(userData.user);
            redirectToRoleDashboard(userData.user.role);
          }}
        />
      </div>
    );
  }

  // Use the new unified dashboard for all logged-in users
  return <UnifiedDashboard user={user} onLogout={handleLogout} />;
}
