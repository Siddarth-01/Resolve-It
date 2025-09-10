const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const { verifyAdminAccess } = require("../middleware/adminAuth");

// GET /api/admin/issues - Get all issues (sorted by createdAt desc)
router.get("/issues", verifyAdminAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;

    // Build filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination metadata
    const total = await Issue.countDocuments(filter);

    // Fetch issues with pagination and sorting
    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      issues,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalIssues: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin issues:", error);
    res.status(500).json({
      message: "Error fetching issues",
      error: error.message,
    });
  }
});

// GET /api/admin/issues/:id - Get a single issue by ID
router.get("/issues/:id", verifyAdminAccess, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    res.json(issue);
  } catch (error) {
    console.error("Error fetching admin issue:", error);

    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid issue ID format",
      });
    }

    res.status(500).json({
      message: "Error fetching issue",
      error: error.message,
    });
  }
});

// PUT /api/admin/issues/:id - Update issue status (admin only)
router.put("/issues/:id", verifyAdminAccess, async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    // Validate status if provided
    const validStatuses = ["Pending", "In Progress", "Resolved"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    // Get the original issue to track changes
    const originalIssue = await Issue.findById(req.params.id);
    if (!originalIssue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    // Prepare update object
    const updateData = {};
    if (status) {
      updateData.status = status;
    }
    if (adminNote !== undefined) {
      updateData.adminNote = adminNote;
    }

    // Update the issue
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    // Log status change for audit purposes
    if (status && originalIssue.status !== status) {
      console.log(
        `📋 Admin status update: Issue ${req.params.id} changed from "${originalIssue.status}" to "${status}"`
      );
    }

    res.json({
      message: "Issue updated successfully",
      issue: updatedIssue,
      changes: {
        statusChanged: status && originalIssue.status !== status,
        previousStatus: originalIssue.status,
        newStatus: status || originalIssue.status,
      },
    });
  } catch (error) {
    console.error("Error updating admin issue:", error);

    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid issue ID format",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Error updating issue",
      error: error.message,
    });
  }
});

// GET /api/admin/stats - Get admin dashboard statistics
router.get("/stats", verifyAdminAccess, async (req, res) => {
  try {
    // Get overall statistics
    const totalIssues = await Issue.countDocuments();
    const pendingIssues = await Issue.countDocuments({ status: "Pending" });
    const inProgressIssues = await Issue.countDocuments({
      status: "In Progress",
    });
    const resolvedIssues = await Issue.countDocuments({ status: "Resolved" });

    // Get issues created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentIssues = await Issue.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get category breakdown
    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get daily issue creation for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.json({
      overview: {
        totalIssues,
        pendingIssues,
        inProgressIssues,
        resolvedIssues,
        recentIssues,
        resolutionRate:
          totalIssues > 0
            ? ((resolvedIssues / totalIssues) * 100).toFixed(1)
            : 0,
      },
      categoryBreakdown: categoryStats,
      dailyCreation: dailyStats,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      message: "Error fetching admin statistics",
      error: error.message,
    });
  }
});

// GET /api/admin/issues/search - Search issues with advanced filters
router.get("/issues/search", verifyAdminAccess, async (req, res) => {
  try {
    const {
      query,
      status,
      category,
      userId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
    } = req.query;

    // Build search filter
    const filter = {};

    // Text search in title and description
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // User ID filter
    if (userId) {
      filter.userId = userId;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const total = await Issue.countDocuments(filter);

    // Fetch issues
    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      issues,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalIssues: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit),
      },
      searchCriteria: {
        query,
        status,
        category,
        userId,
        dateFrom,
        dateTo,
      },
    });
  } catch (error) {
    console.error("Error searching admin issues:", error);
    res.status(500).json({
      message: "Error searching issues",
      error: error.message,
    });
  }
});

module.exports = router;
