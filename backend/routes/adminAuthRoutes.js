const crypto = require("crypto");
const express = require("express");
const { createAdminToken, requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

const secureValueMatches = (provided, expected) => {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  );
};

router.post("/login", (req, res) => {
  const configuredEmail = process.env.ADMIN_EMAIL || "";
  const configuredPassword = process.env.ADMIN_PASSWORD || "";
  const configuredSecret = process.env.ADMIN_SESSION_SECRET || "";

  if (
    !configuredEmail ||
    !configuredPassword ||
    configuredSecret.length < 32
  ) {
    return res.status(503).json({
      success: false,
      message:
        "Admin sign-in is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and a 32-character ADMIN_SESSION_SECRET in backend/.env.",
    });
  }

  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (
    !secureValueMatches(email, configuredEmail.trim().toLowerCase()) ||
    !secureValueMatches(password, configuredPassword)
  ) {
    return res.status(401).json({
      success: false,
      message: "That email and password don't match. Try again.",
    });
  }

  return res.json({
    success: true,
    token: createAdminToken(email),
    expiresIn: 8 * 60 * 60,
  });
});

router.get("/session", requireAdmin, (req, res) => {
  res.json({ success: true, email: req.admin.email });
});

module.exports = router;
