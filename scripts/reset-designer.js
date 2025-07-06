import { connectDB } from "../lib/db.js";
import User from "../lib/models/User.js";
import { hashPassword } from "../lib/auth.js";

async function resetDesignerPassword() {
  try {
    console.log("🔧 Resetting designer password...");
    await connectDB();

    const designer = await User.findOne({ email: "design@example.com" });

    if (!designer) {
      console.log("❌ Designer user not found, creating new one...");

      const hashedPassword = await hashPassword("design123");
      const newDesigner = new User({
        name: "Designer",
        email: "design@example.com",
        password: hashedPassword,
        role: "designer",
        bio: "UI/UX designer creating beautiful and functional user interfaces.",
      });

      await newDesigner.save();
      console.log("✅ Designer user created with password: design123");
    } else {
      console.log("✅ Designer user found, resetting password...");

      const hashedPassword = await hashPassword("design123");
      designer.password = hashedPassword;
      await designer.save();

      console.log("✅ Designer password reset to: design123");
    }

    const verifyUser = await User.findOne({ email: "design@example.com" });
    if (verifyUser) {
      console.log("✅ Verification successful:");
      console.log(`   Name: ${verifyUser.name}`);
      console.log(`   Email: ${verifyUser.email}`);
      console.log(`   Role: ${verifyUser.role}`);
      console.log(
        `   Password hash: ${verifyUser.password.substring(0, 20)}...`
      );
    }
  } catch (error) {
    console.error("❌ Error resetting designer password:", error);
  }
}

resetDesignerPassword().then(() => process.exit(0));
