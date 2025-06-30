import bcrypt from "bcryptjs";

// Fix in-memory database passwords
const fixPasswords = async () => {
  console.log("🔧 Fixing in-memory database passwords...");

  const userPasswords = [
    { email: "admin@example.com", password: "admin123" },
    { email: "hr@example.com", password: "hr123" },
    { email: "marketing@example.com", password: "marketing123" },
    { email: "finance@example.com", password: "finance123" },
    { email: "blog@example.com", password: "blog123" },
    { email: "seo@example.com", password: "seo123" },
    { email: "pm@example.com", password: "pm123" },
    { email: "dev@example.com", password: "dev123" },
    { email: "design@example.com", password: "design123" },
  ];

  console.log("\n📋 Password hashes for in-memory database:");
  console.log("==========================================");

  for (const user of userPasswords) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    console.log(`${user.email}: "${hashedPassword}"`);
  }

  console.log("\n✅ Copy these hashes to replace the ones in lib/db.js");
  console.log("Replace the password field for each user in the users array.");
};

fixPasswords();
