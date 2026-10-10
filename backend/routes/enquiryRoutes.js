const express = require("express");
const { rateLimit } = require("express-rate-limit");
const Enquiry = require("../models/Enquiry");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validStatuses = ["New", "Contacted", "Qualified", "Closed"];

const createLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many enquiries were submitted. Please try again later.",
  },
});

function bodyObject(body) {
  return body && typeof body === "object" && !Array.isArray(body) ? body : {};
}

function readText(value, maxLength) {
  return typeof value === "string" && value.trim().length <= maxLength
    ? value.trim()
    : null;
}

router.post("/", createLimit, async (req, res) => {
  const body = bodyObject(req.body);
  const submissionId = readText(body.submissionId, 64);
  const name = readText(body.name, 120);
  const phone = readText(body.phone, 24);
  const email = readText(body.email || "", 254);
  const interest = readText(body.interest, 80);
  const vehicleDetails = readText(body.vehicleDetails || "", 240);
  const message = readText(body.message, 3000);

  if (
    !submissionId ||
    !/^[A-Za-z0-9-]{16,64}$/.test(submissionId) ||
    !name ||
    !phone ||
    !/^\+?[0-9][0-9\s()-]{7,23}$/.test(phone) ||
    email === null ||
    (email && !emailPattern.test(email)) ||
    !interest ||
    vehicleDetails === null ||
    !message ||
    message.length < 8
  ) {
    return res.status(400).json({
      success: false,
      message: "Check the enquiry details and try again.",
    });
  }

  try {
    const enquiry = await Enquiry.findOneAndUpdate(
      { submissionId },
      {
        $setOnInsert: {
          submissionId,
          name,
          phone,
          email,
          interest,
          vehicleDetails,
          message,
          status: "New",
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json({
      success: true,
      enquiry: { id: enquiry._id.toString(), status: enquiry.status },
    });
  } catch (error) {
    if (error?.code === 11000) {
      try {
        const existing = await Enquiry.findOne({ submissionId });
        if (existing) {
          return res.status(200).json({
            success: true,
            enquiry: { id: existing._id.toString(), status: existing.status },
          });
        }
      } catch (lookupError) {
        console.error("Duplicate enquiry lookup failed.", {
          name:
            lookupError instanceof Error
              ? lookupError.name
              : "UnknownError",
          code:
            typeof lookupError?.code === "string"
              ? lookupError.code
              : undefined,
        });
      }
    }
    console.error("Enquiry could not be saved.", {
      name: error instanceof Error ? error.name : "UnknownError",
      code: typeof error?.code === "string" ? error.code : undefined,
    });
    return res.status(503).json({
      success: false,
      message: "We could not save your enquiry. Please try again.",
    });
  }
});

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, enquiries });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  const { status } = bodyObject(req.body);
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Choose a valid enquiry status.",
    });
  }

  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }
    return res.json({ success: true, enquiry });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }
    return next(error);
  }
});

module.exports = router;
