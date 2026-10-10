const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "admin",
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    sessionVersion: {
      type: Number,
      default: 0,
    },
    resetTokenHash: {
      type: String,
      select: false,
    },
    resetTokenExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

adminUserSchema.index({ resetTokenHash: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("AdminUser", adminUserSchema);
