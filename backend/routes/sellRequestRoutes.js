const express = require("express");
const mongoose = require("mongoose");
const Brand = require("../models/Brand");
const SellRequest = require("../models/SellRequest");
const Vehicle = require("../models/Vehicle");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();
const validFuelTypes = ["Diesel", "Petrol", "CNG", "Electric", "Other"];
const validTransmissions = ["Manual", "Automatic", "Other"];
const maximumImages = 8;

const validEmail = (value) =>
  !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateImages = (images) =>
  Array.isArray(images) &&
  images.length > 0 &&
  images.length <= maximumImages &&
  images.every((image) => {
    if (!image || typeof image.url !== "string" || typeof image.publicId !== "string") {
      return false;
    }
    try {
      const url = new URL(image.url);
      return url.protocol === "https:" && url.hostname === "res.cloudinary.com" && image.publicId.trim();
    } catch {
      return false;
    }
  });

const validateSubmission = async (body) => {
  const requiredText = ["ownerName", "phone", "location", "brand", "model"];
  if (requiredText.some((key) => typeof body[key] !== "string" || !body[key].trim())) {
    return "Please provide all required owner and vehicle details.";
  }
  if (!/^\+?[0-9][0-9\s()-]{7,18}$/.test(body.phone.trim())) {
    return "Enter a valid mobile number.";
  }
  if (!validEmail(typeof body.email === "string" ? body.email.trim() : "")) {
    return "Enter a valid email address.";
  }
  const category = body.categoryType || body.category;
  if (!["commercial", "cars", "car"].includes(category)) {
    return "Choose a valid vehicle category.";
  }
  const categoryType = category === "commercial" ? "commercial" : "car";
  const brand = await Brand.findOne({
    categoryType,
    name: body.brand.trim(),
    isActive: true,
  }).lean();
  if (!brand) return "Choose an active brand from the selected category.";

  const year = Number(body.year);
  const kilometers = Number(body.kilometers);
  const expectedPrice = Number(body.expectedPrice);
  if (!Number.isInteger(year) || year < 1950 || year > new Date().getFullYear() + 1) {
    return "Enter a valid manufacturing year.";
  }
  if (!Number.isFinite(kilometers) || kilometers < 0) {
    return "Kilometers must be zero or greater.";
  }
  if (!Number.isFinite(expectedPrice) || expectedPrice <= 0) {
    return "Expected selling price must be greater than zero.";
  }
  if (body.fuelType && !validFuelTypes.includes(body.fuelType)) {
    return "Choose a valid fuel type.";
  }
  if (body.transmission && !validTransmissions.includes(body.transmission)) {
    return "Choose a valid transmission.";
  }
  if (!validateImages(body.images)) {
    return `Upload between 1 and ${maximumImages} valid vehicle images before submitting.`;
  }
  return null;
};

router.post("/", async (req, res) => {
  try {
    const validationError = await validateSubmission(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }
    const category = req.body.categoryType || req.body.category;
    const request = await SellRequest.create({
      ownerName: req.body.ownerName.trim(),
      phone: req.body.phone.trim(),
      email: (req.body.email || "").trim(),
      ownerLocation: (req.body.ownerLocation || "").trim(),
      location: req.body.location.trim(),
      additionalMessage: (req.body.additionalMessage || "").trim(),
      category: category === "commercial" ? "commercial" : "car",
      brand: req.body.brand.trim(),
      model: req.body.model.trim(),
      year: Number(req.body.year),
      kilometers: Number(req.body.kilometers),
      fuelType: req.body.fuelType || "Diesel",
      transmission: req.body.transmission || "Manual",
      expectedPrice: Number(req.body.expectedPrice),
      description: (req.body.description || "").trim(),
      images: req.body.images,
    });
    return res.status(201).json({
      success: true,
      message: "Vehicle submitted successfully for review.",
      requestId: request._id,
    });
  } catch (error) {
    console.error("Create sell request error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to submit your vehicle request.",
    });
  }
});

router.use(requireAdmin);

router.get("/", async (req, res) => {
  try {
    const staleListings = await SellRequest.find({
      status: "listing",
      listingStartedAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) },
    })
      .select("_id listingStartedAt listingPreviousStatus")
      .lean();
    await Promise.all(
      staleListings.map((item) =>
        SellRequest.updateOne(
          { _id: item._id, status: "listing", listingStartedAt: item.listingStartedAt },
          {
            $set: {
              status: item.listingPreviousStatus || "pending",
              listingStartedAt: null,
              listingPreviousStatus: null,
            },
          }
        )
      )
    );
    const filter = {};
    if (req.query.status && req.query.status !== "all") {
      if (!["pending", "under_review", "approved_manual", "listed", "rejected"].includes(req.query.status)) {
        return res.status(400).json({ success: false, message: "Choose a valid request status." });
      }
      filter.status = req.query.status;
    }
    const requests = await SellRequest.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    console.error("Get sell requests error:", error);
    return res.status(500).json({ success: false, message: "Unable to load sell requests." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid request id." });
    }
    const request = await SellRequest.findById(req.params.id).lean();
    if (!request) return res.status(404).json({ success: false, message: "Sell request not found." });
    return res.json({ success: true, request });
  } catch (error) {
    console.error("Get sell request error:", error);
    return res.status(500).json({ success: false, message: "Unable to load this sell request." });
  }
});

router.patch("/:id/status", async (req, res) => {
  if (req.body.status !== "under_review") {
    return res.status(400).json({ success: false, message: "Use the matching review action for this status." });
  }
  const request = await SellRequest.findOneAndUpdate(
    { _id: req.params.id, status: "pending", vehicleId: null },
    { status: "under_review" },
    { returnDocument: "after", runValidators: true }
  );
  if (!request) return res.status(409).json({ success: false, message: "This request is no longer pending." });
  return res.json({ success: true, request });
});

router.post("/:id/approve-manual", async (req, res) => {
  try {
    const request = await SellRequest.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ["pending", "under_review"] }, vehicleId: null },
      { status: "approved_manual", listingMode: "manual" },
      { returnDocument: "after", runValidators: true }
    );
    if (!request) {
      const current = await SellRequest.findById(req.params.id);
      if (!current) return res.status(404).json({ success: false, message: "Sell request not found." });
      if (current.status === "approved_manual") return res.json({ success: true, request: current });
      return res.status(409).json({ success: false, message: "This request can no longer be approved manually." });
    }
    return res.json({ success: true, message: "Vehicle approved and ready for manual listing.", request });
  } catch (error) {
    console.error("Approve sell request manually error:", error);
    return res.status(500).json({ success: false, message: "Unable to approve this request." });
  }
});

router.post("/:id/approve-and-list", async (req, res) => {
  return publishRequest(req, res, false);
});

router.post("/:id/list", async (req, res) => {
  return publishRequest(req, res, true);
});

async function publishRequest(req, res, manual) {
  let reservedRequest;
  let originalStatus;
  try {
    const body = req.body || {};
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid request id." });
    }
    const existingRequest = await SellRequest.findById(req.params.id);
    if (!existingRequest) return res.status(404).json({ success: false, message: "Sell request not found." });
    const linkedVehicle =
      (existingRequest.vehicleId && await Vehicle.findById(existingRequest.vehicleId)) ||
      await Vehicle.findOne({ sourceSellRequestId: existingRequest._id });
    if (linkedVehicle) {
      if (existingRequest.status !== "listed" || !existingRequest.vehicleId) {
        existingRequest.status = "listed";
        existingRequest.vehicleId = linkedVehicle._id;
        existingRequest.listingStartedAt = null;
        existingRequest.listingPreviousStatus = null;
        await existingRequest.save();
      }
      return res.json({ success: true, message: "This request has already been listed.", vehicle: linkedVehicle, request: existingRequest });
    }
    if (
      existingRequest.status === "listing" &&
      existingRequest.listingStartedAt &&
      Date.now() - existingRequest.listingStartedAt.getTime() > 5 * 60 * 1000
    ) {
      await SellRequest.updateOne(
        { _id: existingRequest._id, status: "listing", vehicleId: null },
        {
          $set: {
            status: existingRequest.listingPreviousStatus || (manual ? "approved_manual" : "pending"),
            listingStartedAt: null,
            listingPreviousStatus: null,
          },
        }
      );
      existingRequest.status =
        existingRequest.listingPreviousStatus || (manual ? "approved_manual" : "pending");
      existingRequest.listingPreviousStatus = null;
    }

    originalStatus = manual
      ? "approved_manual"
      : existingRequest.status === "listing"
        ? "pending"
        : existingRequest.status;
    const allowedStatuses = manual ? ["approved_manual"] : ["pending", "under_review"];
    reservedRequest = await SellRequest.findOneAndUpdate(
      {
        _id: req.params.id,
        status: { $in: allowedStatuses },
        vehicleId: null,
      },
      {
        status: "listing",
        listingMode: manual ? "manual" : "direct",
        listingPreviousStatus: originalStatus,
        listingStartedAt: new Date(),
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!reservedRequest) {
      const latest = await SellRequest.findById(req.params.id);
      if (latest?.vehicleId) {
        const existingVehicle = await Vehicle.findById(latest.vehicleId);
        if (existingVehicle) return res.json({ success: true, message: "This request has already been listed.", vehicle: existingVehicle, request: latest });
      }
      return res.status(409).json({ success: false, message: latest?.status === "listing" ? "This request is currently being listed. Refresh in a moment." : "This request is not eligible for this listing action." });
    }

    const categoryType = reservedRequest.category;
    const listing = body.listing && typeof body.listing === "object" ? body.listing : {};
    const requestedBrand = listing.brand || body.brand;
    const brandName = typeof requestedBrand === "string" ? requestedBrand.trim() : reservedRequest.brand;
    const brand = await Brand.findOne({ categoryType, name: brandName, isActive: true }).lean();
    if (!brand) throw Object.assign(new Error("Choose an active brand from the selected category."), { statusCode: 400 });

    const model = String(listing.model ?? reservedRequest.model).trim();
    const year = Number(listing.year ?? reservedRequest.year);
    const kilometers = Number(listing.kilometers ?? reservedRequest.kilometers);
    const price = Number(listing.price ?? reservedRequest.expectedPrice);
    const location = String(listing.location ?? reservedRequest.location).trim();
    const fuelType = listing.fuelType ?? reservedRequest.fuelType;
    const transmission = listing.transmission ?? reservedRequest.transmission;
    const images = listing.images ?? reservedRequest.images;
    const status = listing.status || "Available";
    if (!model || !location || !Number.isInteger(year) || year < 1950 || year > new Date().getFullYear() + 1 || !Number.isFinite(kilometers) || kilometers < 0 || !Number.isFinite(price) || price <= 0 || !validFuelTypes.includes(fuelType) || !validTransmissions.includes(transmission) || !["Available", "Sold", "Reserved"].includes(status) || !validateImages(images)) {
      throw Object.assign(new Error("The vehicle listing details are invalid."), { statusCode: 400 });
    }

    const vehicle = await Vehicle.create({
      title: String(listing.title || `${year} ${brandName} ${model}`).trim(),
      brand: brandName,
      model,
      year,
      price,
      category: categoryType,
      categoryType,
      kilometers,
      fuelType,
      transmission,
      location,
      description: String(listing.description ?? reservedRequest.description).trim(),
      images,
      status,
      isBestSeller: listing.isBestSeller === true,
      sourceSellRequestId: reservedRequest._id,
    });

    reservedRequest.status = "listed";
    reservedRequest.vehicleId = vehicle._id;
    reservedRequest.listingStartedAt = null;
    reservedRequest.listingPreviousStatus = null;
    await reservedRequest.save();
    return res.status(201).json({
      success: true,
      message: manual ? "Vehicle listed successfully." : "Vehicle approved and listed successfully.",
      vehicle,
      request: reservedRequest,
    });
  } catch (error) {
    if (error.code === 11000 && req.params.id) {
      const existingVehicle = await Vehicle.findOne({ sourceSellRequestId: req.params.id });
      const latest = await SellRequest.findById(req.params.id);
      if (existingVehicle && latest) {
        latest.status = "listed";
        latest.vehicleId = existingVehicle._id;
        latest.listingStartedAt = null;
        await latest.save();
        return res.json({ success: true, message: "This request has already been listed.", vehicle: existingVehicle, request: latest });
      }
    }
    if (reservedRequest && originalStatus) {
      await SellRequest.updateOne(
        { _id: reservedRequest._id, status: "listing", vehicleId: null },
        {
          $set: {
            status: originalStatus,
            listingStartedAt: null,
            listingPreviousStatus: null,
            listingMode: originalStatus === "approved_manual" ? "manual" : null,
          },
        }
      );
    }
    console.error("Publish sell request error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Unable to publish this vehicle.",
    });
  }
}

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid request id." });
    }

    const deletedRequest = await SellRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ success: false, message: "Sell request not found." });
    }

    return res.json({
      success: true,
      message: "Sell request deleted successfully.",
    });
  } catch (error) {
    console.error("Delete sell request error:", error);
    return res.status(500).json({ success: false, message: "Unable to delete this request." });
  }
});

router.post("/:id/reject", async (req, res) => {
  try {
    const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
    const request = await SellRequest.findOneAndUpdate(
      {
        _id: req.params.id,
        status: { $in: ["pending", "under_review", "approved_manual"] },
        vehicleId: null,
      },
      { status: "rejected", rejectionReason: reason },
      { returnDocument: "after", runValidators: true }
    );
    if (!request) {
      const current = await SellRequest.findById(req.params.id);
      if (!current) return res.status(404).json({ success: false, message: "Sell request not found." });
      if (current.status === "rejected") return res.json({ success: true, request: current });
      return res.status(409).json({ success: false, message: "This request can no longer be rejected." });
    }
    return res.json({ success: true, message: "Sell request rejected.", request });
  } catch (error) {
    console.error("Reject sell request error:", error);
    return res.status(500).json({ success: false, message: "Unable to reject this request." });
  }
});

module.exports = router;
