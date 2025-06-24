import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    maxlength: [30, "Category name cannot be more than 30 characters"],
  },
  color: {
    type: String,
    default: "#3B82F6",
    validate: {
      validator: function (v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: "Color must be a valid hex color",
    },
  },
  icon: {
    type: String,
    default: "📋",
  },
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

categorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
