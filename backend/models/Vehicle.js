const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    categoryType: {
      type: String,
      enum: ["commercial", "car"],
    },

    kilometers: {
      type: Number,
      default: 0,
    },

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

    location: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    status: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    sourceSellRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellRequest",
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);