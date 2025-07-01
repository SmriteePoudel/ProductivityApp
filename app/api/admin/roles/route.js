import User from "../../../lib/models/User";

// List of all roles
const roles = [
  "admin",
  "user",
  "developer",
  "designer",
  "hr",
  "marketing",
  "finance",
  "blog_writer",
  "seo_manager",
  "project_manager",
];
// Descriptions for each role
const descriptions = {
  admin: "Full access to all system features.",
  user: "Can view and edit their own tasks.",
  developer: "Can work on development tasks and commit code.",
  designer: "Can work on design tasks and manage design assets.",
  hr: "Can manage employees and review performance.",
  marketing: "Can manage marketing campaigns and view reports.",
  finance: "Can manage budgets and view financial reports.",
  blog_writer: "Can write and manage blog articles.",
  seo_manager: "Can manage SEO and view SEO reports.",
  project_manager: "Can manage projects, assign tasks, and view reports.",
};

export async function GET(req) {
  const result = roles.map((role) => ({
    role,
    permissions: Object.entries(User.getDefaultPermissions(role))
      .filter(([_, v]) => v)
      .map(([k]) => k),
    description: descriptions[role] || "",
  }));
  return Response.json(result);
}
