// Admin authentication middleware
const ADMIN_EMAILS = [
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
  try {
    // Get email from request body or query parameters
    const email =
      req.body.email || req.query.email || req.headers["x-user-email"];

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
    console.error("Error in admin authentication middleware:", error);
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
