// Test Firebase integration
require("dotenv").config();
const {
  getUserEmailFromFirebase,
  getUserProfileFromFirebase,
} = require("./utils/firebaseService");

async function testFirebaseIntegration() {
  console.log("🔥 Testing Firebase Integration...\n");

  // Test user ID - replace with an actual Firebase UID from your database
  const testUserId = "hRKohnlbkJZpgxEOr3Gk7hkYU6Y2"; // Example from your issues

  console.log("📋 Configuration Check:");
  console.log(
    "FIREBASE_PROJECT_ID:",
    process.env.FIREBASE_PROJECT_ID || "Not set"
  );
  console.log(
    "FIREBASE_SERVICE_ACCOUNT_KEY:",
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? "Set ✅" : "Not set ❌"
  );
  console.log("");

  try {
    console.log(`🧪 Testing user lookup for ID: ${testUserId}`);

    // Test email retrieval
    console.log("1. Getting user email...");
    const email = await getUserEmailFromFirebase(testUserId);
    console.log(`   Result: ${email}`);

    // Test profile retrieval
    console.log("2. Getting user profile...");
    const profile = await getUserProfileFromFirebase(testUserId);
    console.log("   Result:", profile);

    if (email && email !== "user@example.com") {
      console.log("\n🎉 Firebase integration is working! ✅");
      console.log(`   User email: ${email}`);
    } else {
      console.log("\n⚠️  Firebase integration using fallback mode");
      console.log("   To use real Firebase data:");
      console.log("   1. Add your Firebase service account key to .env");
      console.log("   2. Restart the server");
      console.log("   3. Test again");
    }
  } catch (error) {
    console.error("❌ Firebase test failed:", error.message);
  }
}

// Test individual user IDs from your database
async function testMultipleUsers() {
  const userIds = [
    "hRKohnlbkJZpgxEOr3Gk7hkYU6Y2",
    "test-user-123",
    "firebase-test-user-456",
    "frontend-test-user-789",
  ];

  console.log("\n🔍 Testing multiple user IDs from your database:");

  for (const userId of userIds) {
    console.log(`\n👤 User ID: ${userId}`);
    try {
      const email = await getUserEmailFromFirebase(userId);
      const profile = await getUserProfileFromFirebase(userId);
      console.log(`   Email: ${email || "Not found"}`);
      console.log(`   Name: ${profile?.displayName || "Not found"}`);
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
}

// Run tests
if (require.main === module) {
  console.log("🚀 Firebase Integration Test\n");
  testFirebaseIntegration()
    .then(() => testMultipleUsers())
    .catch(console.error);
}

module.exports = { testFirebaseIntegration, testMultipleUsers };
