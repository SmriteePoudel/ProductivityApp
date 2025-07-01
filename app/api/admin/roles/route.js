import { NextResponse } from "next/server";

export async function GET() {
  // Static roles and descriptions (should match frontend mapping)
  const roles = [
    {
      role: "admin",
      description: "Full access to all system features and settings.",
      permissions: ["all"],
    },
    {
      role: "designer",
      description: "Can work on design tasks and manage design assets.",
      permissions: ["view_tasks", "edit_own_tasks", "design_assets"],
    },
    {
      role: "developer",
      description: "Can work on development tasks and commit code.",
      permissions: ["view_tasks", "edit_own_tasks", "commit_code"],
    },
    {
      role: "blog_writer",
      description: "Can write and manage blog articles.",
      permissions: ["write_articles", "view_tasks"],
    },
    {
      role: "user",
      description: "Can view and edit their own tasks.",
      permissions: ["view_tasks", "edit_own_tasks"],
    },
    {
      role: "hr",
      description: "Can manage employees and review performance.",
      permissions: ["manage_employees", "review_performance", "view_reports"],
    },
    {
      role: "marketing",
      description: "Can manage marketing campaigns and view reports.",
      permissions: ["manage_campaigns", "view_reports"],
    },
    {
      role: "finance",
      description: "Can manage budgets and view financial reports.",
      permissions: ["manage_budgets", "view_financials", "view_reports"],
    },
    {
      role: "seo_manager",
      description: "Can manage SEO and view SEO reports.",
      permissions: ["manage_seo", "view_reports"],
    },
    {
      role: "project_manager",
      description: "Can manage projects, assign tasks, and view reports.",
      permissions: ["manage_projects", "assign_tasks", "view_reports"],
    },
  ];
  return NextResponse.json({ roles });
}
