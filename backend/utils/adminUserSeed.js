const AdminUser = require("../models/AdminUser");
const { hashAdminPassword } = require("./adminPassword");

async function ensureConfiguredAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) return;
  if (password.length > 128) {
    throw new Error("ADMIN_PASSWORD must be 128 characters or fewer.");
  }

  const existing = await AdminUser.exists({ email });
  if (existing) return;

  const name =
    (process.env.ADMIN_NAME || "").trim() ||
    email.slice(0, email.indexOf("@")).replace(/[._-]+/g, " ");
  try {
    await AdminUser.create({
      name,
      email,
      passwordHash: await hashAdminPassword(password, 12),
      role: "admin",
    });
  } catch (error) {
    if (error.code === 11000) return;
    throw error;
  }
  console.log("Initial admin account created from backend environment configuration.");
}

module.exports = { ensureConfiguredAdmin };
