const { sendEmail } = require("./utils/emailService");
require("dotenv").config();

/**
 * Test the email service
 */
async function testEmailService() {
  console.log("🧪 Testing Email Service...\n");

  // Test email content
  const testEmail = {
    to: "siddharth05p@gmail.com", // Replace with your actual email to receive test
    subject: "Test Email from Civic Issue Reporter",
    text: `
Hello,

This is a test email from the Civic Issue Reporter application.

The email service is working correctly!

Best regards,
Civic Issue Reporter Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏛️ Civic Issue Reporter</h1>
  </div>
  <div class="content">
    <h2>Test Email</h2>
    <p>Hello,</p>
    <p>This is a test email from the <strong>Civic Issue Reporter</strong> application.</p>
    <p>The email service is working correctly! ✅</p>
    <p>Best regards,<br>Civic Issue Reporter Team</p>
  </div>
  <div class="footer">
    <p>This email was sent from the Civic Issue Reporter application.</p>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    console.log("📧 Attempting to send test email...");
    console.log("To:", testEmail.to);
    console.log("Subject:", testEmail.subject);
    console.log("");

    const result = await sendEmail(
      testEmail.to,
      testEmail.subject,
      testEmail.text,
      testEmail.html
    );

    if (result.success) {
      console.log("🎉 Email test completed successfully!");
      console.log("Message ID:", result.messageId);
    } else {
      console.log("❌ Email test failed!");
      console.log("Error:", result.error);
    }
  } catch (error) {
    console.error("💥 Email test crashed:", error.message);
  }
}

// Example usage functions
function exampleIssueSubmissionEmail() {
  return {
    to: "user@example.com",
    subject: "Issue Submitted Successfully - Civic Reporter",
    text: `
Dear User,

Your civic issue has been submitted successfully.

Issue Title: Broken Streetlight on Main Street
Issue ID: CIV-2025-001
Status: Under Review

We will notify you when there are updates on your issue.

Thank you for helping improve our community!

Best regards,
Civic Issue Reporter Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .issue-card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0; }
    .status { background-color: #fbbf24; color: #92400e; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Issue Submitted Successfully</h1>
  </div>
  <div class="content">
    <p>Dear User,</p>
    <p>Your civic issue has been submitted successfully.</p>
    
    <div class="issue-card">
      <h3>Issue Details</h3>
      <p><strong>Title:</strong> Broken Streetlight on Main Street</p>
      <p><strong>Issue ID:</strong> CIV-2025-001</p>
      <p><strong>Status:</strong> <span class="status">Under Review</span></p>
    </div>
    
    <p>We will notify you when there are updates on your issue.</p>
    <p>Thank you for helping improve our community! 🏛️</p>
    <p>Best regards,<br>Civic Issue Reporter Team</p>
  </div>
  <div class="footer">
    <p>This is an automated email from the Civic Issue Reporter application.</p>
  </div>
</body>
</html>
    `.trim(),
  };
}

// Run test if file is executed directly
if (require.main === module) {
  console.log(
    "⚠️  Note: Update EMAIL_USER and EMAIL_PASS in .env file before testing"
  );
  console.log("⚠️  For Gmail, use App Password instead of regular password");
  console.log("⚠️  Update testEmail.to with a real email address\n");

  // Uncomment to run test
  testEmailService();

  console.log("📋 Example usage:");
  console.log('const { sendEmail } = require("./utils/emailService");');
  console.log(
    'await sendEmail("user@example.com", "Subject", "Text content", "<html>...</html>");'
  );
}

module.exports = {
  testEmailService,
  exampleIssueSubmissionEmail,
};
