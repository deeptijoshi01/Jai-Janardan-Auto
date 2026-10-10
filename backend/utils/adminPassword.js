const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const bcryptInput = (password) =>
  // bcrypt accepts at most 72 input bytes, so pre-hash to avoid truncating long passwords.
  crypto.createHash("sha256").update(password, "utf8").digest("hex");

const hashAdminPassword = (password, rounds = 12) =>
  bcrypt.hash(bcryptInput(password), rounds);

const compareAdminPassword = (password, hash) =>
  bcrypt.compare(bcryptInput(password), hash);

module.exports = { compareAdminPassword, hashAdminPassword };
