import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
    maxlength: [100, "Task title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "cancelled"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  dueDate: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  isImportant: {
    type: Boolean,
    default: false,
  },
  estimatedTime: {
    type: Number, // in minutes
    min: [0, "Estimated time cannot be negative"],
  },
  actualTime: {
    type: Number, // in minutes
    min: [0, "Actual time cannot be negative"],
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

taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Set completedAt when status changes to completed
  if (
    this.isModified("status") &&
    this.status === "completed" &&
    !this.completedAt
  ) {
    this.completedAt = Date.now();
  }

  // Clear completedAt when status changes from completed
  if (
    this.isModified("status") &&
    this.status !== "completed" &&
    this.completedAt
  ) {
    this.completedAt = null;
  }

  next();
});

// Index for better query performance
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, priority: 1 });

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
