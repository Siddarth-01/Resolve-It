const nodemailer = require("nodemailer");

/**
 * Send email using nodemailer with Gmail/SMTP
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 * @param {string} html - HTML content (optional)
 * @returns {Promise<Object>} - Result of email sending
 */
const sendEmail = async (to, subject, text, html = null) => {
  try {
    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true" || false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Gmail address or SMTP username
        pass: process.env.EMAIL_PASS, // Gmail app password or SMTP password
      },
      // Additional options for Gmail
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("Email transporter is ready to send messages");

    // Email options
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || "Civic Issue Reporter",
        address: process.env.EMAIL_USER,
      },
      to: to,
      subject: subject,
      text: text,
      ...(html && { html: html }), // Only include html if provided
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", {
      messageId: result.messageId,
      to: to,
      subject: subject,
      response: result.response,
    });

    return {
      success: true,
      messageId: result.messageId,
      response: result.response,
    };
  } catch (error) {
    console.error("❌ Failed to send email:", {
      error: error.message,
      to: to,
      subject: subject,
      stack: error.stack,
    });

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { sendEmail };
