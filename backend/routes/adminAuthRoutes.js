const crypto = require("crypto");
const express = require("express");
const { compareAdminPassword, hashAdminPassword } = require("../utils/adminPassword");
const nodemailer = require("nodemailer");
const { rateLimit } = require("express-rate-limit");
const AdminUser = require("../models/AdminUser");
const {
  clearAdminCookie,
  isTrustedOrigin,
  requireAdmin,
  setAdminCookie,
} = require("../middleware/requireAdmin");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resetExpiryMs = 15 * 60 * 1000;
const dummyPasswordPromise = hashAdminPassword(
  crypto.randomBytes(32).toString("hex"),
  12
);

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many sign-in attempts. Try again later.",
  },
});

router.use((req, res, next) => {
  if (!isTrustedOrigin(req)) {
    return res.status(403).json({
      success: false,
      message: "This request origin is not allowed.",
    });
  }
  return next();
});

const forgotPasswordLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset requests. Try again later.",
  },
});

const resetPasswordLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many reset attempts. Try again later.",
  },
});

function validEmail(value) {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    emailPattern.test(value)
  );
}

function requestBody(req) {
  return req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : {};
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage || "",
  };
}

function emailConfiguration() {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "MAIL_FROM",
    "FRONTEND_URL",
  ];
  const missing = required.filter((name) => !process.env[name]?.trim());
  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    if (!missing.includes("SMTP_PORT")) missing.push("SMTP_PORT (valid port required)");
  }
  if (missing.length) {
    return {
      error: `Password reset email is not configured. Set ${missing.join(", ")} in backend/.env.`,
    };
  }

  const configuredSender = process.env.MAIL_FROM.trim();
  const senderAddress =
    configuredSender.match(/<([^<>]+)>/)?.[1] || configuredSender;
  if (
    senderAddress.trim().toLowerCase() !==
    process.env.SMTP_USER.trim().toLowerCase()
  ) {
    return {
      error: "MAIL_FROM must use the authenticated SMTP_USER address.",
    };
  }

  let frontendUrl;
  try {
    frontendUrl = new URL(process.env.FRONTEND_URL);
  } catch {
    return { error: "FRONTEND_URL must be a valid absolute URL in backend/.env." };
  }
  if (!["http:", "https:"].includes(frontendUrl.protocol)) {
    return { error: "FRONTEND_URL must use HTTP or HTTPS." };
  }
  if (
    process.env.NODE_ENV === "production" &&
    frontendUrl.protocol !== "https:"
  ) {
    return { error: "FRONTEND_URL must use HTTPS in production." };
  }
  return { port, frontendUrl: frontendUrl.origin };
}

function logSmtpFailure(error) {
  const code =
    typeof error?.code === "string" && /^[A-Z][A-Z0-9_]{0,31}$/i.test(error.code)
      ? error.code
      : undefined;
  const knownCommands = new Set([
    "AUTH",
    "AUTH LOGIN",
    "AUTH PLAIN",
    "AUTH XOAUTH2",
    "CONNECT",
    "DATA",
    "EHLO",
    "HELO",
    "MAIL FROM",
    "QUIT",
    "RCPT TO",
    "STARTTLS",
  ]);
  const command =
    typeof error?.command === "string" &&
    knownCommands.has(error.command.toUpperCase())
      ? error.command.toUpperCase()
      : undefined;
  console.error("Password reset SMTP operation failed.", {
    code,
    responseCode: Number.isInteger(error?.responseCode)
      ? error.responseCode
      : undefined,
    command,
  });
}

function developmentSmtpFailureMessage(error) {
  const details = [];
  if (
    typeof error?.code === "string" &&
    /^[A-Z][A-Z0-9_]{0,31}$/i.test(error.code)
  ) {
    details.push(error.code);
  }
  if (Number.isInteger(error?.responseCode)) {
    details.push(`SMTP ${error.responseCode}`);
  }
  const knownCommands = new Set([
    "AUTH",
    "AUTH LOGIN",
    "AUTH PLAIN",
    "AUTH XOAUTH2",
    "CONNECT",
    "DATA",
    "EHLO",
    "HELO",
    "MAIL FROM",
    "QUIT",
    "RCPT TO",
    "STARTTLS",
  ]);
  if (
    typeof error?.command === "string" &&
    knownCommands.has(error.command.toUpperCase())
  ) {
    details.push(error.command.toUpperCase());
  }
  return `Password reset email delivery failed${details.length ? ` (${details.join(", ")})` : ""}. Check the backend SMTP logs and settings.`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function passwordError(password) {
  if (typeof password !== "string" || password.length < 6) {
    return "Use a password with at least 6 characters.";
  }
  if (password.length > 128) {
    return "Password must be 128 characters or fewer.";
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Include at least one letter and one number in the password.";
  }
  return "";
}

router.post("/login", loginLimit, async (req, res) => {
  const body = requestBody(req);
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const remember = body.remember === true;

  if (!validEmail(email) || !password || password.length > 128) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email address and password.",
    });
  }

  try {
    const user = await AdminUser.findOne({ email }).select("+passwordHash");
    const dummyPasswordHash = await dummyPasswordPromise;
    const passwordMatches = await compareAdminPassword(
      password,
      user?.passwordHash || dummyPasswordHash
    );
    if (!user || !passwordMatches || !["admin", "staff"].includes(user.role)) {
      return res.status(401).json({
        success: false,
        message: "That email and password don't match. Try again.",
      });
    }
    if ((process.env.ADMIN_SESSION_SECRET || "").length < 32) {
      return res.status(503).json({
        success: false,
        message: "Admin session verification is not configured.",
      });
    }

    setAdminCookie(res, user, remember);
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error("Admin login failed because authentication storage is unavailable.");
    return res.status(503).json({
      success: false,
      message: "Admin authentication is temporarily unavailable.",
    });
  }
});

router.post("/forgot-password", forgotPasswordLimit, async (req, res) => {
  if (process.env.NODE_ENV !== "production") {
    console.info("[forgot-password] Route reached.");
  }
  const body = requestBody(req);
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!validEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email address.",
    });
  }

  const configuration = emailConfiguration();
  if (configuration.error) {
    return res.status(503).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Password reset is temporarily unavailable. Please contact the administrator."
          : configuration.error,
    });
  }

  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: configuration.port,
      secure: configuration.port === 465,
      requireTLS: configuration.port !== 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.verify();
    if (process.env.NODE_ENV !== "production") {
      console.info("[forgot-password] SMTP verification succeeded.");
    }
  } catch (error) {
    logSmtpFailure(error);
    if (process.env.NODE_ENV !== "production") {
      console.error("[forgot-password] SMTP verification failed.");
    }
    return res.status(502).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Password reset is temporarily unavailable. Please try again later."
          : developmentSmtpFailureMessage(error),
    });
  }

  try {
    const user = await AdminUser.findOne({ email });
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[forgot-password] Admin record ${user ? "found" : "not found"}.`
      );
    }
    if (!user) {
      return res.status(202).json({
        success: true,
        message:
          "If an account matches, reset instructions will be sent when email delivery is available.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    user.resetTokenExpires = new Date(Date.now() + resetExpiryMs);
    await user.save();

    const resetUrl = new URL("/admin/reset-password", configuration.frontendUrl);
    resetUrl.searchParams.set("token", token);
    try {
      if (process.env.NODE_ENV !== "production") {
        console.info("[forgot-password] sendMail started.");
      }
      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: user.email,
        subject: "Reset your Jai Janardan Auto admin password",
        text: `Hello ${user.name},\n\nUse this link within 15 minutes to reset your password:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>Hello ${escapeHtml(user.name)},</p><p>Use this link within 15 minutes to reset your password:</p><p><a href="${escapeHtml(resetUrl.toString())}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
      });
      if (process.env.NODE_ENV !== "production") {
        console.info("[forgot-password] sendMail succeeded.");
      }
    } catch (error) {
      await AdminUser.updateOne(
        { _id: user._id, resetTokenHash: user.resetTokenHash },
        { $unset: { resetTokenHash: 1, resetTokenExpires: 1 } }
      );
      logSmtpFailure(error);
      if (process.env.NODE_ENV !== "production") {
        console.error("[forgot-password] sendMail failed.");
      }
      return res.status(502).json({
        success: false,
        message:
          process.env.NODE_ENV === "production"
            ? "We could not send reset instructions right now. Please try again later."
            : developmentSmtpFailureMessage(error),
      });
    }

    return res.status(202).json({
      success: true,
      message:
        "If an account matches, reset instructions will be sent when email delivery is available.",
    });
  } catch (error) {
    console.error("Password reset request could not be completed.", {
      name: error instanceof Error ? error.name : "UnknownError",
      code: typeof error?.code === "string" ? error.code : undefined,
    });
    return res.status(503).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Password reset is temporarily unavailable. Please try again later."
          : "Password reset is temporarily unavailable. Check the backend logs and try again.",
    });
  }
});

router.post("/reset-password", resetPasswordLimit, async (req, res) => {
  const body = requestBody(req);
  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword =
    typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return res.status(400).json({
      success: false,
      message: "This password-reset link is invalid or has expired.",
    });
  }
  const validationError = passwordError(password);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "The passwords do not match.",
    });
  }

  try {
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const passwordHash = await hashAdminPassword(password, 12);
    const user = await AdminUser.findOneAndUpdate(
      {
        resetTokenHash,
        resetTokenExpires: { $gt: new Date() },
      },
      {
        $set: { passwordHash },
        $unset: { resetTokenHash: 1, resetTokenExpires: 1 },
        $inc: { sessionVersion: 1 },
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This password-reset link is invalid or has expired.",
      });
    }
    return res.json({
      success: true,
      message: "Your password has been changed. Sign in with your new password.",
    });
  } catch {
    console.error("Password reset could not be completed.");
    return res.status(503).json({
      success: false,
      message: "Password reset is temporarily unavailable.",
    });
  }
});

router.get("/me", requireAdmin, (req, res) => {
  return res.json({ success: true, user: publicUser(req.admin) });
});

router.get("/session", requireAdmin, (req, res) => {
  return res.json({ success: true, user: publicUser(req.admin) });
});

router.post("/logout", (req, res) => {
  clearAdminCookie(res);
  return res.json({ success: true });
});

module.exports = router;
