require("dotenv").config();
console.log("🔍 Environment Check:");
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log(
  "FIREBASE_SERVICE_ACCOUNT_KEY exists:",
  !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY
);
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.log("Key length:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length);
  try {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log("✅ JSON is valid");
    console.log("Project ID from key:", parsed.project_id);
  } catch (error) {
    console.log("❌ JSON parsing failed:", error.message);
  }
} else {
  console.log("❌ FIREBASE_SERVICE_ACCOUNT_KEY not found in environment");
}
