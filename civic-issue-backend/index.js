const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

// Load environment variables FIRST
dotenv.config();

// Import routes
const issueRoutes = require("./routes/issueRoutes");

// Initialize Firebase service (this will setup Firebase on startup)
require("./utils/firebaseService");

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/civic-issues";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API running");
});

// API Routes
app.use("/api/issues", issueRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
