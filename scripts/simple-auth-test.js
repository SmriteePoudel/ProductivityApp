import { connectDB, findUserByEmail } from "../lib/db.js";
import { comparePassword } from "../lib/auth.js";

async function simpleAuthTest() {
  console.log("🧪 Simple Authentication Test...");

  try {
    await connectDB();

    const adminEmail = "admin@example.com";
    console.log(`\n🔍 Looking for user: ${adminEmail}`);

    const user = await findUserByEmail(adminEmail);
    if (!user) {
      console.log("❌ Admin user not found!");
      return;
    }

    console.log("✅ Admin user found:");
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Has password: ${!!user.password}`);

    const testPassword = "admin123";
    console.log(`\n🔐 Testing password: ${testPassword}`);

    const isValidPassword = await comparePassword(testPassword, user.password);
    console.log(`Password valid: ${isValidPassword ? "✅ YES" : "❌ NO"}`);

    if (isValidPassword) {
      console.log("\n🎉 Authentication test PASSED!");
      console.log("You should be able to login with:");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${testPassword}`);
    } else {
      console.log("\n❌ Authentication test FAILED!");
      console.log("Password verification failed.");
    }
  } catch (error) {
    console.error("❌ Test error:", error);
  }
}

simpleAuthTest();
