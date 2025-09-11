// Admin authentication middleware
const ADMIN_EMAILS = [
  "24071a6747@vnrvjiet.in",
  "24071a6760@vnrvjiet.in",
  "24071a6743@vnrvjiet.in",
  "24071a6741@vnrvjiet.in",
  "24071a6237@vnrvjiet.in",
  "24071a6201@vnrvjiet.in",
  // Keep some example emails for testing
  "admin@example.com",
  "siddharth@example.com",
  "municipaladmin@example.com",
];

/**
 * Check if an email is in the admin emails list
 * @param {string} email - The email to check
 * @returns {boolean} - True if email is an admin email
 */
const isAdminEmail = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * Middleware to verify admin access
 * Checks for email in request body or query parameters
 */
const verifyAdminAccess = (req, res, next) => {
  console.log("🚀 MIDDLEWARE CALLED - verifyAdminAccess");
  try {
    // Safely get email from different sources
    let email = null;

    // Check query parameters
    if (req.query && typeof req.query === "object" && req.query.email) {
      email = req.query.email;
    }

    // Check body (only if no email found yet)
    if (!email && req.body && typeof req.body === "object" && req.body.email) {
      email = req.body.email;
    }

    // Check headers (only if no email found yet)
    if (!email && req.headers && req.headers["x-user-email"]) {
      email = req.headers["x-user-email"];
    }

    if (!email) {
      return res.status(401).json({
        message: "Access denied. Email required for admin operations.",
        error: "MISSING_EMAIL",
      });
    }

    if (!isAdminEmail(email)) {
      console.log(`🚫 Unauthorized admin access attempt from: ${email}`);
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
        error: "INSUFFICIENT_PRIVILEGES",
      });
    }

    // Log successful admin access
    console.log(`👑 Admin access granted to: ${email}`);

    // Add admin email to request object for use in route handlers
    req.adminEmail = email;

    next();
  } catch (error) {
    console.error("❌ Error in admin authentication middleware:", error);
    res.status(500).json({
      message: "Internal server error during authentication",
      error: error.message,
    });
  }
};

module.exports = {
  isAdminEmail,
  verifyAdminAccess,
  ADMIN_EMAILS,
};
