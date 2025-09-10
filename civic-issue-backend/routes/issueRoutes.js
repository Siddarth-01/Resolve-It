const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Issue = require("../models/Issue");

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
    res
      .status(500)
      .json({
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
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
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
