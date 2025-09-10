// Admin email configuration
// Add email addresses of users who should have admin access

const ADMIN_EMAILS = [
  // Add admin email addresses here
  "24071a6747@vnrvjiet.in",
  "24071a6760@vnrvjiet.in",
  "24071a6743@vnrvjiet.in",
  "24071a6741@vnrvjiet.in",
  "24071a6237@vnrvjiet.in",
  "24071a6201@vnrvjiet.in",

  // Add more admin emails as needed
];

// Function to check if an email is an admin
export const isAdminEmail = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Function to get all admin emails (for backend validation)
export const getAdminEmails = () => {
  return [...ADMIN_EMAILS];
};

export default ADMIN_EMAILS;
