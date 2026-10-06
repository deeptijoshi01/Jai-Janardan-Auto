const express = require("express");
const Category = require("../models/Category");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ type: -1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load categories.",
    });
  }
});

module.exports = router;
