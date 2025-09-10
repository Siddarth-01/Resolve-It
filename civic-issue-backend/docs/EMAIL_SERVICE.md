# Email Service Documentation

## Overview

The email service provides functionality to send emails using nodemailer with Gmail or custom SMTP configuration.

## Setup

### 1. Install Dependencies

```bash
npm install nodemailer
```

### 2. Environment Configuration

Add the following variables to your `.env` file:

#### For Gmail (Recommended)

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM_NAME=Civic Issue Reporter
```

#### For Custom SMTP

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your_username
EMAIL_PASS=your_password
EMAIL_FROM_NAME=Your App Name
```

### 3. Gmail App Password Setup

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. At the bottom, click "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in `EMAIL_PASS` (not your regular password)

## Usage

### Basic Import

```javascript
const { sendEmail } = require("./utils/emailService");
```

### Function Signature

```javascript
sendEmail(to, subject, text, html);
```

**Parameters:**

- `to` (string): Recipient email address
- `subject` (string): Email subject line
- `text` (string): Plain text email content
- `html` (string, optional): HTML email content

**Returns:** Promise<Object>

- `success` (boolean): Whether email was sent successfully
- `messageId` (string): Unique message identifier (on success)
- `response` (string): SMTP server response (on success)
- `error` (string): Error message (on failure)

### Examples

#### Simple Text Email

```javascript
const result = await sendEmail(
  "user@example.com",
  "Welcome to Civic Reporter",
  "Thank you for joining our community!"
);

if (result.success) {
  console.log("Email sent:", result.messageId);
} else {
  console.error("Email failed:", result.error);
}
```

#### HTML Email

```javascript
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .header { background-color: #3b82f6; color: white; padding: 20px; }
    .content { padding: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Issue Submitted Successfully</h1>
  </div>
  <div class="content">
    <p>Your issue has been submitted and is under review.</p>
  </div>
</body>
</html>
`;

await sendEmail(
  "user@example.com",
  "Issue Submitted Successfully",
  "Your issue has been submitted and is under review.",
  htmlContent
);
```

#### Integration in Routes

```javascript
// In your route handler
router.post("/submit-issue", async (req, res) => {
  try {
    // Create issue logic here
    const newIssue = await Issue.create(req.body);

    // Send notification email
    const emailResult = await sendEmail(
      "admin@yoursite.com",
      `New Issue: ${newIssue.title}`,
      `A new issue has been submitted: ${newIssue.description}`,
      `<p>New issue: <strong>${newIssue.title}</strong></p>`
    );

    res.json({
      issue: newIssue,
      emailSent: emailResult.success,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Testing

### Manual Test

```bash
node test-email.js
```

### Programmatic Test

```javascript
const { sendEmail } = require("./utils/emailService");

async function testEmail() {
  const result = await sendEmail(
    "test@example.com",
    "Test Subject",
    "Test message content"
  );

  console.log("Result:", result);
}

testEmail();
```

## Email Templates

### Issue Submission Confirmation

```javascript
const issueSubmissionEmail = (userEmail, issueTitle, issueId) => ({
  to: userEmail,
  subject: "Issue Submitted Successfully - Civic Reporter",
  text: `
Dear User,

Your civic issue "${issueTitle}" has been submitted successfully.

Issue ID: ${issueId}
Status: Under Review

We will notify you when there are updates.

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
    .issue-id { background-color: #f0f9ff; padding: 10px; border-radius: 5px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Issue Submitted Successfully</h1>
  </div>
  <div class="content">
    <p>Dear User,</p>
    <p>Your civic issue "<strong>${issueTitle}</strong>" has been submitted successfully.</p>
    <p>Issue ID: <span class="issue-id">${issueId}</span></p>
    <p>Status: <strong>Under Review</strong></p>
    <p>We will notify you when there are updates.</p>
    <p>Best regards,<br>Civic Issue Reporter Team</p>
  </div>
</body>
</html>
  `.trim(),
});
```

### Status Update Notification

```javascript
const statusUpdateEmail = (userEmail, issueTitle, newStatus, notes) => ({
  to: userEmail,
  subject: `Issue Update: ${issueTitle} - ${newStatus}`,
  text: `
Your issue "${issueTitle}" has been updated.

New Status: ${newStatus}
${notes ? `Notes: ${notes}` : ""}

Thank you for using Civic Issue Reporter.
  `.trim(),
  html: `
<!DOCTYPE html>
<html>
<body>
  <h2>Issue Status Update</h2>
  <p>Your issue "<strong>${issueTitle}</strong>" has been updated.</p>
  <p>New Status: <strong style="color: #3b82f6;">${newStatus}</strong></p>
  ${notes ? `<p>Notes: ${notes}</p>` : ""}
  <p>Thank you for using Civic Issue Reporter.</p>
</body>
</html>
  `.trim(),
});
```

## Error Handling

The email service includes comprehensive error handling:

```javascript
try {
  const result = await sendEmail(to, subject, text, html);

  if (result.success) {
    console.log("✅ Email sent successfully");
  } else {
    console.log("❌ Email failed:", result.error);
    // Handle gracefully - maybe queue for retry
  }
} catch (error) {
  console.error("💥 Email service error:", error);
  // Don't let email failures break your main application flow
}
```

## Best Practices

1. **Don't fail main operations due to email failures**

   ```javascript
   // ✅ Good
   try {
     const issue = await createIssue(data);
     sendEmail(...).catch(err => console.log('Email failed:', err));
     return res.json(issue);
   } catch (error) {
     return res.status(500).json({ error });
   }
   ```

2. **Use environment variables for configuration**
3. **Include both text and HTML versions**
4. **Log email results for debugging**
5. **Consider using email queues for high-volume applications**

## Troubleshooting

### Common Issues

1. **"Invalid login" error with Gmail**

   - Use App Password, not regular password
   - Enable 2-Step Verification first

2. **"Connection refused" error**

   - Check SMTP host and port
   - Verify firewall settings

3. **"Authentication failed"**
   - Verify EMAIL_USER and EMAIL_PASS
   - Check account settings

### Debug Mode

Add detailed logging by setting `NODE_ENV=development` in your `.env` file.

## Security Notes

- Never commit `.env` file to version control
- Use App Passwords for Gmail, not regular passwords
- Regularly rotate email credentials
- Consider using dedicated email service accounts
