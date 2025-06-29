#!/usr/bin/env node

import {
  seedDatabase,
  seedUsers,
  seedCategories,
  resetDatabase,
} from "../lib/seeder.js";

const command = process.argv[2];

switch (command) {
  case "seed":
    console.log("🌱 Starting full database seeding...");
    await seedDatabase();
    break;
  case "users":
    console.log("👥 Seeding users only...");
    await seedUsers();
    break;
  case "categories":
    console.log("📂 Seeding categories only...");
    await seedCategories();
    break;
  case "reset":
    console.log("🗑️ Resetting database...");
    await resetDatabase();
    break;
  default:
    console.log("Usage: npm run seed [seed|users|categories|reset]");
    console.log("");
    console.log("Commands:");
    console.log(
      "  seed      - Seed all data (users, categories, tasks, projects, pages)"
    );
    console.log("  users     - Seed users only");
    console.log("  categories - Seed categories only");
    console.log("  reset     - Reset all data");
    console.log("");
    console.log("Examples:");
    console.log("  npm run seed seed");
    console.log("  npm run seed users");
    console.log("  npm run seed reset");
    process.exit(1);
}
