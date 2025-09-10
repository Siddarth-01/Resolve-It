/**
 * Email template utilities for Civic Issue Reporter
 */

/**
 * Generate email for issue submission confirmation
 * @param {Object} issue - Issue object with title, _id, etc.
 * @param {string} userEmail - User's email address
 * @returns {Object} Email object with to, subject, text, html
 */
function generateIssueSubmissionEmail(issue, userEmail) {
  return {
    to: userEmail,
    subject: "Issue Submitted Successfully - Civic Reporter",
    text: `
Dear User,

Your civic issue has been submitted successfully.

Issue Title: ${issue.title}
Issue ID: ${issue._id}
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
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background-color: #ffffff; }
    .issue-card { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .issue-id { background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 14px; }
    .status { background-color: #fbbf24; color: #92400e; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
    .logo { font-size: 24px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🏛️</div>
    <h1>Issue Submitted Successfully</h1>
  </div>
  <div class="content">
    <p>Dear User,</p>
    <p>Your civic issue has been submitted successfully and is now under review.</p>
    
    <div class="issue-card">
      <h3 style="margin-top: 0; color: #059669;">Issue Details</h3>
      <p><strong>Title:</strong> ${issue.title}</p>
      <p><strong>Issue ID:</strong> <span class="issue-id">${
        issue._id
      }</span></p>
      <p><strong>Status:</strong> <span class="status">Under Review</span></p>
      <p><strong>Submitted:</strong> ${new Date(
        issue.createdAt
      ).toLocaleDateString()}</p>
    </div>
    
    <p>We will notify you via email when there are updates on your issue.</p>
    <p>Thank you for helping improve our community! 🌟</p>
    
    <p>Best regards,<br><strong>Civic Issue Reporter Team</strong></p>
  </div>
  <div class="footer">
    <p>This is an automated email from the Civic Issue Reporter application.</p>
    <p>Please do not reply to this email.</p>
  </div>
</body>
</html>
    `.trim(),
  };
}

/**
 * Generate email for issue status update
 * @param {Object} issue - Issue object
 * @param {string} newStatus - New status (e.g., 'In Progress', 'Resolved')
 * @param {string} userEmail - User's email address
 * @param {string} notes - Optional update notes
 * @returns {Object} Email object
 */
function generateStatusUpdateEmail(issue, newStatus, userEmail, notes = "") {
  const statusColors = {
    Pending: "#fbbf24",
    "In Progress": "#3b82f6",
    Resolved: "#10b981",
    Closed: "#6b7280",
  };

  const statusColor = statusColors[newStatus] || "#6b7280";

  return {
    to: userEmail,
    subject: `Issue Update: ${issue.title} - ${newStatus}`,
    text: `
Dear User,

Your civic issue has been updated.

Issue Title: ${issue.title}
Issue ID: ${issue._id}
New Status: ${newStatus}
${notes ? `Update Notes: ${notes}` : ""}

Thank you for using Civic Issue Reporter.

Best regards,
Civic Issue Reporter Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background-color: ${statusColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background-color: #ffffff; }
    .issue-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .status { background-color: ${statusColor}; color: white; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: bold; }
    .notes { background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📢 Issue Status Update</h1>
  </div>
  <div class="content">
    <p>Dear User,</p>
    <p>Your civic issue has been updated with a new status.</p>
    
    <div class="issue-card">
      <h3 style="margin-top: 0;">Issue Details</h3>
      <p><strong>Title:</strong> ${issue.title}</p>
      <p><strong>Issue ID:</strong> ${issue._id}</p>
      <p><strong>New Status:</strong> <span class="status">${newStatus}</span></p>
      <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
    </div>
    
    ${
      notes
        ? `
    <div class="notes">
      <h4 style="margin-top: 0;">Update Notes:</h4>
      <p>${notes}</p>
    </div>
    `
        : ""
    }
    
    <p>Thank you for using Civic Issue Reporter to improve our community! 🏛️</p>
    
    <p>Best regards,<br><strong>Civic Issue Reporter Team</strong></p>
  </div>
  <div class="footer">
    <p>This is an automated email from the Civic Issue Reporter application.</p>
  </div>
</body>
</html>
    `.trim(),
  };
}

/**
 * Generate email for admin notification of new issue
 * @param {Object} issue - Issue object
 * @param {string} adminEmail - Admin email address
 * @returns {Object} Email object
 */
function generateAdminNotificationEmail(issue, adminEmail) {
  return {
    to: adminEmail,
    subject: `🚨 New Issue Requires Review: ${issue.title}`,
    text: `
A new civic issue has been submitted and requires review:

Title: ${issue.title}
Description: ${issue.description}
Issue ID: ${issue._id}
Submitted by: ${issue.userId}
Location: ${
      issue.location?.lat
        ? `${issue.location.lat}, ${issue.location.lng}`
        : "Not specified"
    }
Category: ${issue.category || "Not specified"}
Submitted: ${new Date(issue.createdAt).toLocaleString()}

Please review and take appropriate action.

---
Civic Issue Reporter Admin System
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background-color: #ffffff; }
    .issue-card { background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .urgent { background-color: #fbbf24; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .description { background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚨 New Issue Submitted</h1>
    <span class="urgent">REQUIRES REVIEW</span>
  </div>
  <div class="content">
    <p>A new civic issue has been submitted and requires administrative review:</p>
    
    <div class="issue-card">
      <h3 style="margin-top: 0; color: #dc2626;">${issue.title}</h3>
      
      <div class="description">
        <h4 style="margin-top: 0;">Description:</h4>
        <p>${issue.description}</p>
      </div>
      
      <p><strong>Issue ID:</strong> ${issue._id}</p>
      <p><strong>Submitted by:</strong> ${issue.userId}</p>
      <p><strong>Category:</strong> ${issue.category || "Not specified"}</p>
      <p><strong>Location:</strong> ${
        issue.location?.lat
          ? `${issue.location.lat}, ${issue.location.lng}`
          : "Not specified"
      }</p>
      <p><strong>Submitted:</strong> ${new Date(
        issue.createdAt
      ).toLocaleString()}</p>
      ${issue.imageUrl ? `<p><strong>Image:</strong> Attached</p>` : ""}
    </div>
    
    <p><strong>Please review and take appropriate action.</strong></p>
  </div>
  <div class="footer">
    <p>This email was sent from the Civic Issue Reporter Admin System.</p>
  </div>
</body>
</html>
    `.trim(),
  };
}

module.exports = {
  generateIssueSubmissionEmail,
  generateStatusUpdateEmail,
  generateAdminNotificationEmail,
};
