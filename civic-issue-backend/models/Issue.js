const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  userId: {
    type: String,
    required: [true, "User ID is required"],
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  location: {
    lat: {
      type: Number,
      min: [-90, "Latitude must be between -90 and 90"],
      max: [90, "Latitude must be between -90 and 90"],
    },
    lng: {
      type: Number,
      min: [-180, "Longitude must be between -180 and 180"],
      max: [180, "Longitude must be between -180 and 180"],
    },
  },
  category: {
    type: String,
    trim: true,
  },
  predictedCategory: {
    type: String,
    trim: true,
  },
  categoryConfidence: {
    type: Number,
    min: 0,
    max: 1,
  },
  categoryMethod: {
    type: String,
    enum: [
      "ai-classification",
      "keyword-based",
      "keyword-fallback",
      "default",
      "manual",
    ],
    default: "manual",
  },
  status: {
    type: String,
    enum: {
      values: ["Pending", "In Progress", "Resolved"],
      message: "Status must be either Pending, In Progress, or Resolved",
    },
    default: "Pending",
  },
  adminNote: {
    type: String,
    trim: true,
    maxlength: [500, "Admin note cannot be more than 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
issueSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
issueSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
