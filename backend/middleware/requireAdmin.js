const crypto = require("crypto");

const TOKEN_LIFETIME_SECONDS = 8 * 60 * 60;

const sessionSecret = () => process.env.ADMIN_SESSION_SECRET || "";

const createAdminToken = (email) => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      sub: email,
      role: "admin",
      iat: issuedAt,
      exp: issuedAt + TOKEN_LIFETIME_SECONDS,
    })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
};

const requireAdmin = (req, res, next) => {
  if (sessionSecret().length < 32) {
    return res.status(503).json({
      success: false,
      message: "Admin session verification is not configured.",
    });
  }

  const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
  const [payload, suppliedSignature, extra] = (token || "").split(".");
  if (!payload || !suppliedSignature || extra) {
    return res.status(401).json({
      success: false,
      message: "Admin sign-in is required.",
    });
  }

  const expectedSignature = crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest();
  let actualSignature;
  try {
    actualSignature = Buffer.from(suppliedSignature, "base64url");
  } catch {
    actualSignature = Buffer.alloc(0);
  }

  if (
    actualSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(actualSignature, expectedSignature)
  ) {
    return res.status(401).json({
      success: false,
      message: "Admin session is invalid. Please sign in again.",
    });
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      claims.role !== "admin" ||
      typeof claims.sub !== "string" ||
      !Number.isFinite(claims.exp) ||
      claims.exp <= Math.floor(Date.now() / 1000)
    ) {
      return res.status(401).json({
        success: false,
        message: "Admin session has expired. Please sign in again.",
      });
    }
    req.admin = { email: claims.sub };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Admin session is invalid. Please sign in again.",
    });
  }
};

module.exports = { createAdminToken, requireAdmin };
