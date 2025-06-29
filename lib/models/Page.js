import mongoose from "mongoose";

const boxSchema = new mongoose.Schema({
  type: { type: String, enum: ["text", "image", "document"], required: true },
  content: { type: String, default: "" }, // for text
  file: { type: String, default: "" }, // base64 or URL for image/doc
  fileName: { type: String, default: "" },
});

const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Page name is required"],
    trim: true,
    maxlength: [100, "Page name cannot be more than 100 characters"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  boxes: [boxSchema],
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

pageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Page || mongoose.model("Page", pageSchema);
