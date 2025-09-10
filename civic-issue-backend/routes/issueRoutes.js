const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Issue = require("../models/Issue");
const { sendEmail } = require("../utils/emailService");
const {
  getUserEmailFromFirebase,
  getUserProfileFromFirebase,
} = require("../utils/firebaseService");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// GET /api/issues - Get all issues
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    // If userId is provided, filter issues by userId
    const filter = userId ? { userId } : {};

    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching issues", error: error.message });
  }
});

// GET /api/issues/stats/:userId - Get issue statistics for a specific user
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Count total issues for the user
    const total = await Issue.countDocuments({ userId });

    // Count issues by status
    const pending = await Issue.countDocuments({ userId, status: "Pending" });
    const inProgress = await Issue.countDocuments({
      userId,
      status: "In Progress",
    });
    const resolved = await Issue.countDocuments({ userId, status: "Resolved" });

    res.json({
      total,
      pending,
      inProgress,
      resolved,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching issue statistics",
      error: error.message,
    });
  }
});

// GET /api/issues/:id - Get a single issue by ID
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching issue", error: error.message });
  }
});

// POST /api/issues - Create a new issue
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, userId, location, category } = req.body;

    // Validate required fields
    if (!title || !description || !userId) {
      return res.status(400).json({
        message:
          "Missing required fields: title, description, and userId are required",
      });
    }

    // Parse location if it's a string
    let parsedLocation = {};
    if (location) {
      if (typeof location === "string") {
        try {
          parsedLocation = JSON.parse(location);
        } catch (e) {
          console.log("Error parsing location:", e);
        }
      } else {
        parsedLocation = location;
      }
    }

    // Get image URL if file was uploaded
    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Create new issue with explicit field mapping
    const issueData = {
      title: title.trim(),
      description: description.trim(),
      userId: userId.trim(),
      imageUrl: imageUrl,
      location: parsedLocation,
      category: category || "",
    };

    const issue = new Issue(issueData);
    const savedIssue = await issue.save();

    // Optional: Send email notification when issue is created
    // Uncomment and configure email settings in .env file to enable
    /*
    try {
      const emailResult = await sendEmail(
        'admin@civicreporter.com', // Replace with admin email or use userId to get user email
        `New Issue Submitted: ${savedIssue.title}`,
        `
A new civic issue has been submitted:

Title: ${savedIssue.title}
Description: ${savedIssue.description}
Issue ID: ${savedIssue._id}
Submitted by: ${savedIssue.userId}
Location: ${parsedLocation.lat ? `${parsedLocation.lat}, ${parsedLocation.lng}` : 'Not specified'}
Date: ${new Date(savedIssue.createdAt).toLocaleString()}

Please review and take appropriate action.
        `.trim(),
        `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .issue-card { background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 15px 0; }
    .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚨 New Issue Submitted</h1>
  </div>
  <div class="content">
    <p>A new civic issue has been submitted and requires review:</p>
    
    <div class="issue-card">
      <h3>${savedIssue.title}</h3>
      <p><strong>Description:</strong> ${savedIssue.description}</p>
      <p><strong>Issue ID:</strong> ${savedIssue._id}</p>
      <p><strong>Submitted by:</strong> ${savedIssue.userId}</p>
      <p><strong>Location:</strong> ${parsedLocation.lat ? `${parsedLocation.lat}, ${parsedLocation.lng}` : 'Not specified'}</p>
      <p><strong>Date:</strong> ${new Date(savedIssue.createdAt).toLocaleString()}</p>
    </div>
    
    <p>Please review and take appropriate action.</p>
  </div>
  <div class="footer">
    <p>This email was sent from the Civic Issue Reporter system.</p>
  </div>
</body>
</html>
        `.trim()
      );
      
      if (emailResult.success) {
        console.log('📧 Admin notification email sent successfully');
      } else {
        console.log('📧 Failed to send admin notification email:', emailResult.error);
      }
    } catch (emailError) {
      console.log('📧 Email notification error:', emailError.message);
      // Don't fail the issue creation if email fails
    }
    */

    res.status(201).json(savedIssue);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }
    res
      .status(500)
      .json({ message: "Error creating issue", error: error.message });
  }
});

// PUT /api/issues/:id - Update an issue
router.put("/:id", async (req, res) => {
  try {
    // Get the original issue to compare status changes
    const originalIssue = await Issue.findById(req.params.id);
    if (!originalIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Update the issue
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Check if status was updated and send email notification
    console.log("🔍 Status check:", {
      requestStatus: req.body.status,
      originalStatus: originalIssue.status,
      statusChanged:
        req.body.status && originalIssue.status !== req.body.status,
    });

    if (req.body.status && originalIssue.status !== req.body.status) {
      console.log("📧 Status changed! Sending email notification...");
      try {
        // Get user email from Firebase using userId
        console.log(`🔍 Getting email for user: ${updatedIssue.userId}`);
        const citizenEmail = await getUserEmailFromFirebase(
          updatedIssue.userId
        );

        if (!citizenEmail) {
          console.log(
            `⚠️  No email found for user ${updatedIssue.userId}. Skipping email notification.`
          );
        } else {
          console.log(`📧 Sending email to: ${citizenEmail}`);

          // Get user profile for personalized email
          const userProfile = await getUserProfileFromFirebase(
            updatedIssue.userId
          );
          const userName = userProfile?.displayName || "Citizen";

          const emailResult = await sendEmail(
            citizenEmail,
            "Update on your issue report",
            `
Dear ${userName},

Your issue '${updatedIssue.title}' is now ${updatedIssue.status}.

Issue Details:
- Title: ${updatedIssue.title}
- Issue ID: ${updatedIssue._id}
- Previous Status: ${originalIssue.status}
- Current Status: ${updatedIssue.status}
- Updated: ${new Date().toLocaleString()}

Thank you for using Civic Issue Reporter.

Best regards,
Civic Issue Reporter Team
          `.trim(),
            `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background-color: #ffffff; }
    .status-update { background-color: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .status-badge { background-color: #10b981; color: white; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: bold; }
    .issue-details { background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📢 Issue Status Update</h1>
  </div>
  <div class="content">
    <p>Dear Citizen,</p>
    <p>We have an update on your issue report:</p>
    
    <div class="status-update">
      <h3 style="margin-top: 0; color: #1e40af;">Your issue '${
        updatedIssue.title
      }' is now <span class="status-badge">${updatedIssue.status}</span></h3>
    </div>
    
    <div class="issue-details">
      <h4 style="margin-top: 0;">Issue Details:</h4>
      <p><strong>Title:</strong> ${updatedIssue.title}</p>
      <p><strong>Issue ID:</strong> ${updatedIssue._id}</p>
      <p><strong>Previous Status:</strong> ${originalIssue.status}</p>
      <p><strong>Current Status:</strong> ${updatedIssue.status}</p>
      <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <p>Thank you for using Civic Issue Reporter to improve our community! 🏛️</p>
    
    <p>Best regards,<br><strong>Civic Issue Reporter Team</strong></p>
  </div>
  <div class="footer">
    <p>This is an automated email from the Civic Issue Reporter application.</p>
    <p>Please do not reply to this email.</p>
  </div>
</body>
</html>
          `.trim()
          );

          if (emailResult.success) {
            console.log(
              `📧 Status update email sent successfully to ${citizenEmail} for issue ${updatedIssue._id}`
            );
          } else {
            console.log(
              `📧 Failed to send status update email: ${emailResult.error}`
            );
          }
        }
      } catch (emailError) {
        console.log(
          `📧 Email notification error for issue ${updatedIssue._id}:`,
          emailError.message
        );
        // Don't fail the issue update if email fails
      }
    }
    res.json(updatedIssue);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }
    res
      .status(500)
      .json({ message: "Error updating issue", error: error.message });
  }
});

// DELETE /api/issues/:id - Delete an issue
router.delete("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting issue", error: error.message });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB." });
    }
  }
  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({ message: "Only image files are allowed!" });
  }
  next(error);
});

module.exports = router;
