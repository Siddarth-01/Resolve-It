const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // Check if we have Firebase credentials
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      console.log("🔥 Initializing Firebase with service account...");
      // Use service account key from environment variable
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
      });
      console.log(
        `✅ Firebase initialized successfully for project: ${serviceAccount.project_id}`
      );
    } catch (error) {
      console.error("❌ Failed to initialize Firebase:", error.message);
      console.log("🔄 Falling back to mock Firebase mode");
    }
  } else {
    // Use default credentials (for development)
    console.log(
      "⚠️  Using default Firebase credentials. Add FIREBASE_SERVICE_ACCOUNT_KEY to .env for production."
    );

    // For now, we'll create a mock implementation
    // In production, you need to add your Firebase service account credentials
  }
}

/**
 * Get user email from Firebase Auth using UID
 * @param {string} uid - Firebase user UID
 * @returns {Promise<string|null>} - User email or null if not found
 */
const getUserEmailFromFirebase = async (uid) => {
  try {
    if (!admin.apps.length) {
      console.log("⚠️  Firebase not initialized. Using fallback email.");

      // Development fallback - you can customize this mapping
      const devEmailMap = {
        "test-user-123": "test1@example.com",
        "firebase-test-user-456": "test2@example.com",
        "frontend-test-user-789": "test3@example.com",
      };

      const fallbackEmail = devEmailMap[uid] || "user@example.com";
      console.log(`🔄 Using mapped email for ${uid}: ${fallbackEmail}`);
      return fallbackEmail;
    }

    // Get user record from Firebase Auth
    const userRecord = await admin.auth().getUser(uid);

    if (!userRecord.email) {
      console.log(`⚠️  No email found for user ${uid}`);
      return null;
    }

    console.log(`✅ Retrieved email for user ${uid}: ${userRecord.email}`);
    return userRecord.email;
  } catch (error) {
    console.error("❌ Error getting user email from Firebase:", {
      uid,
      error: error.message,
      code: error.code,
    });

    // Return null if user not found or other error
    return null;
  }
};

/**
 * Get user profile from Firebase Auth using UID
 * @param {string} uid - Firebase user UID
 * @returns {Promise<Object|null>} - User profile or null if not found
 */
const getUserProfileFromFirebase = async (uid) => {
  try {
    console.log(`🔍 Fetching user profile for UID: ${uid}`);

    if (!admin.apps.length) {
      console.log(
        "⚠️  Firebase not initialized. Cannot fetch real user profile."
      );

      // Do not return fabricated user data. Return null so callers
      // can clearly show 'Unknown user' in the admin UI instead of fake data.
      return null;
    }

    // Fetch real user data from Firebase Auth
    console.log(
      `🔥 Firebase is initialized. Fetching real user data for ${uid}`
    );
    const userRecord = await admin.auth().getUser(uid);

    const profile = {
      uid: userRecord.uid,
      email: userRecord.email || "No email provided",
      displayName:
        userRecord.displayName || userRecord.email?.split("@")[0] || "User",
      emailVerified: userRecord.emailVerified,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
    };

    console.log(`✅ Successfully fetched real user profile for ${uid}:`, {
      email: profile.email,
      displayName: profile.displayName,
    });

    return profile;
  } catch (error) {
    console.error("❌ Error getting user profile from Firebase:", {
      uid,
      error: error.message,
      code: error.code,
    });

    // If user is not found in Firebase Auth, return null so the admin UI
    // can present a clear 'user not found' state for that issue.
    if (error.code === "auth/user-not-found") {
      console.log(`� User ${uid} not found in Firebase Auth`);
      return null;
    }

    // For other errors (connectivity, permissions), return null as a safe
    // default. Callers may retry or surface an error to the admin.
    return null;
  }
};

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object|null>} - Decoded token or null if invalid
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    if (!admin.apps.length) {
      console.log("⚠️  Firebase not initialized. Token verification disabled.");
      return null;
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("❌ Error verifying Firebase token:", error.message);
    return null;
  }
};

module.exports = {
  getUserEmailFromFirebase,
  getUserProfileFromFirebase,
  verifyFirebaseToken,
  admin,
};
