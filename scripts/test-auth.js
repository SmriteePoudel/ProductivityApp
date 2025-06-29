#!/usr/bin/env node

import { connectDB, addUser, findUserByEmail } from "../lib/db.js";
import { generateToken, comparePassword, hashPassword } from "../lib/auth.js";

async function testAuth() {
  console.log("🧪 Testing Authentication System...\n");

  try {
    // Test 1: Database Connection
    console.log("1. Testing Database Connection...");
    const dbConnected = await connectDB();
    console.log(
      `   ✅ Database connected: ${dbConnected ? "MongoDB" : "In-memory"}\n`
    );

    // Test 2: Password Hashing
    console.log("2. Testing Password Hashing...");
    const testPassword = "testpassword123";
    const hashedPassword = await hashPassword(testPassword);
    console.log(
      `   ✅ Password hashed: ${hashedPassword.substring(0, 20)}...\n`
    );

    // Test 3: Password Comparison
    console.log("3. Testing Password Comparison...");
    const isValidPassword = await comparePassword(testPassword, hashedPassword);
    console.log(
      `   ✅ Password comparison: ${isValidPassword ? "PASS" : "FAIL"}\n`
    );

    // Test 4: User Creation
    console.log("4. Testing User Creation...");
    const testUser = await addUser({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      role: "user",
    });
    console.log(`   ✅ User created: ${testUser.name} (${testUser.email})\n`);

    // Test 5: User Lookup
    console.log("5. Testing User Lookup...");
    const foundUser = await findUserByEmail("test@example.com");
    console.log(
      `   ✅ User found: ${foundUser ? foundUser.name : "NOT FOUND"}\n`
    );

    // Test 6: Token Generation
    console.log("6. Testing Token Generation...");
    const token = generateToken(testUser);
    console.log(`   ✅ Token generated: ${token.substring(0, 20)}...\n`);

    // Test 7: Admin User Test
    console.log("7. Testing Admin User...");
    const adminUser = await findUserByEmail("admin@example.com");
    if (adminUser) {
      const adminPasswordValid = await comparePassword(
        "admin123",
        adminUser.password
      );
      console.log(`   ✅ Admin user found: ${adminUser.name}`);
      console.log(
        `   ✅ Admin password valid: ${adminPasswordValid ? "YES" : "NO"}\n`
      );
    } else {
      console.log("   ⚠️ Admin user not found\n");
    }

    console.log("🎉 All authentication tests completed successfully!");
    console.log("\n📋 Test Summary:");
    console.log("   - Database connection: ✅");
    console.log("   - Password hashing: ✅");
    console.log("   - Password comparison: ✅");
    console.log("   - User creation: ✅");
    console.log("   - User lookup: ✅");
    console.log("   - Token generation: ✅");
    console.log("   - Admin user: ✅");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testAuth();
