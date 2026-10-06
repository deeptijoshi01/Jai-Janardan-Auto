const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    categoryType: {
      type: String,
      required: true,
      enum: ["commercial", "car"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

brandSchema.index({ categoryType: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("Brand", brandSchema);
