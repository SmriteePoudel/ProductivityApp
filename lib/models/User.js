import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator", "editor", "viewer"],
    default: "user",
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    maxlength: [300, "Bio cannot be more than 300 characters"],
    default: "",
  },
  permissions: {
    canAdd: { type: Boolean, default: true },
    canEdit: { type: Boolean, default: true },
    canDelete: { type: Boolean, default: true },
    canReset: { type: Boolean, default: false },
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

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
