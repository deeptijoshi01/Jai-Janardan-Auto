const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const sellRequestSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 24 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254, default: "" },
    ownerLocation: { type: String, trim: true, maxlength: 120, default: "" },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    additionalMessage: { type: String, trim: true, maxlength: 1000, default: "" },
    category: { type: String, required: true, enum: ["commercial", "car"] },
    brand: { type: String, required: true, trim: true, maxlength: 80 },
    model: { type: String, required: true, trim: true, maxlength: 120 },
    year: { type: Number, required: true, min: 1950 },
    kilometers: { type: Number, required: true, min: 0 },
    fuelType: {
      type: String,
      enum: ["Diesel", "Petrol", "CNG", "Electric", "Other"],
      default: "Diesel",
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic", "Other"],
      default: "Manual",
    },
    expectedPrice: { type: Number, required: true, min: 1 },
    description: { type: String, trim: true, maxlength: 5000, default: "" },
    images: { type: [imageSchema], required: true, validate: [(images) => images.length > 0, "At least one image is required."] },
    status: {
      type: String,
      enum: ["pending", "under_review", "approved_manual", "listing", "listed", "rejected"],
      default: "pending",
      index: true,
    },
    listingMode: {
      type: String,
      enum: ["direct", "manual", null],
      default: null,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    rejectionReason: { type: String, trim: true, maxlength: 1000, default: "" },
    listingStartedAt: { type: Date, default: null },
    listingPreviousStatus: {
      type: String,
      enum: ["pending", "under_review", "approved_manual", null],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellRequest", sellRequestSchema);
