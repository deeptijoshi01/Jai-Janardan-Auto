const crypto = require("crypto");
const AdminUser = require("../models/AdminUser");

const COOKIE_NAME = "jj_admin_session";
const SESSION_SECONDS = 12 * 60 * 60;
const REMEMBERED_SESSION_SECONDS = 30 * 24 * 60 * 60;
const LOCAL_DEVELOPMENT_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
]);

const sessionSecret = () => process.env.ADMIN_SESSION_SECRET || "";
const isLocalDevelopmentOrigin = (origin) =>
  process.env.NODE_ENV !== "production" &&
  LOCAL_DEVELOPMENT_ORIGINS.has(origin);
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/api",
});

function isTrustedOrigin(req) {
  const origin = req.get("origin");
  if (!origin) return true;
  let configuredOrigin = "";
  try {
    configuredOrigin = process.env.FRONTEND_URL
      ? new URL(process.env.FRONTEND_URL).origin
      : "";
  } catch {
    return false;
  }
  if (origin === configuredOrigin) return true;
  return isLocalDevelopmentOrigin(origin);
}

function setAdminCookie(res, user, remember) {
  const lifetime = remember ? REMEMBERED_SESSION_SECONDS : SESSION_SECONDS;
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      sub: user._id.toString(),
      ver: user.sessionVersion,
      iat: issuedAt,
      exp: issuedAt + lifetime,
    })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
  const options = cookieOptions();
  if (remember) options.maxAge = lifetime * 1000;
  res.cookie(COOKIE_NAME, `${payload}.${signature}`, options);
}

function clearAdminCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

function readCookie(req, name) {
  const prefix = `${name}=`;
  const value = (req.headers.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  if (!value) return "";
  try {
    return decodeURIComponent(value.slice(prefix.length));
  } catch {
    return "";
  }
}

async function requireAdmin(req, res, next) {
  if (!isTrustedOrigin(req)) {
    return res.status(403).json({
      success: false,
      message: "This request origin is not allowed.",
    });
  }
  const secret = sessionSecret();
  if (secret.length < 32) {
    return res.status(503).json({
      success: false,
      message: "Admin session verification is not configured.",
    });
  }
  if (AdminUser.db.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Admin authentication is temporarily unavailable.",
    });
  }

  const token = readCookie(req, COOKIE_NAME);
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra) {
    return res.status(401).json({
      success: false,
      message: "Admin sign-in is required.",
    });
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest();
  const actualSignature = Buffer.from(suppliedSignature, "base64url");
  if (
    actualSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(actualSignature, expectedSignature)
  ) {
    return res.status(401).json({
      success: false,
      message: "Admin session is invalid. Please sign in again.",
    });
  }

  let claims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return res.status(401).json({
      success: false,
      message: "Admin session is invalid. Please sign in again.",
    });
  }
  if (
    typeof claims.sub !== "string" ||
    !Number.isInteger(claims.ver) ||
    !Number.isFinite(claims.exp) ||
    claims.exp <= Math.floor(Date.now() / 1000)
  ) {
    return res.status(401).json({
      success: false,
      message: "Admin session has expired. Please sign in again.",
    });
  }

  try {
    const user = await AdminUser.findById(claims.sub).select(
      "name email role profileImage sessionVersion"
    );
    if (
      !user ||
      !["admin", "staff"].includes(user.role) ||
      user.sessionVersion !== claims.ver
    ) {
      return res.status(401).json({
        success: false,
        message: "Admin session is no longer valid. Please sign in again.",
      });
    }
    req.admin = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  COOKIE_NAME,
  clearAdminCookie,
  cookieOptions,
  isLocalDevelopmentOrigin,
  isTrustedOrigin,
  requireAdmin,
  setAdminCookie,
};
