const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    submissionId: {
      type: String,
      required: true,
      unique: true,
      maxlength: 64,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 24 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254, default: "" },
    interest: { type: String, required: true, trim: true, maxlength: 80 },
    vehicleDetails: { type: String, trim: true, maxlength: 240, default: "" },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Closed"],
      default: "New",
      index: true,
    },
  },
  { timestamps: true }
);

enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Enquiry", enquirySchema);
