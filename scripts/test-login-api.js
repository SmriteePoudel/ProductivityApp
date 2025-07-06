const testLoginAPI = async () => {
  console.log("🧪 Testing Login API...");

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "admin123",
      }),
    });

    const data = await response.json();

    console.log(`Status: ${response.status}`);
    console.log("Response:", data);

    if (response.ok) {
      console.log("✅ Login API test PASSED!");
      console.log("You can now login with:");
      console.log("   Email: admin@example.com");
      console.log("   Password: admin123");
    } else {
      console.log("❌ Login API test FAILED!");
    }
  } catch (error) {
    console.error("❌ API test error:", error.message);
    console.log(
      "Make sure your Next.js server is running on http://localhost:3000"
    );
  }
};

if (typeof window !== "undefined") {
  testLoginAPI();
} else {
  console.log("This script needs to be run in a browser environment");
  console.log("Or you can test the login manually with:");
  console.log("   Email: admin@example.com");
  console.log("   Password: admin123");
}
