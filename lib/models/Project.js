import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Project name is required"],
    trim: true,
    maxlength: [100, "Project name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  color: {
    type: String,
    default: "#3b82f6",
    validate: {
      validator: function (v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: "Color must be a valid hex color",
    },
  },
  icon: {
    type: String,
    default: "📁",
  },
  status: {
    type: String,
    enum: ["active", "completed", "on-hold", "cancelled"],
    default: "active",
  },
  files: [
    {
      name: String,
      type: String,
      size: Number,
      url: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
projectSchema.index({ user: 1, status: 1 });
projectSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
