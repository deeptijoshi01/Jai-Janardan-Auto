const express = require("express");
const Brand = require("../models/Brand");
const Category = require("../models/Category");
const Vehicle = require("../models/Vehicle");
const { slugify } = require("../utils/categoryBrandSeed");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();
const validCategoryTypes = ["commercial", "cars", "car"];
const normalizeCategoryType = (categoryType) =>
  categoryType === "cars" ? "car" : categoryType;

const legacyCommercialCategories = [
  "Truck",
  "Trailer",
  "Mini Truck",
  "Pickup Truck",
  "Tipper",
  "Transit Mixer",
];

router.get("/", (req, res, next) => {
  if (req.query.includeInactive === "true") {
    return requireAdmin(req, res, next);
  }
  return next();
}, async (req, res) => {
  try {
    const requestedCategory = req.query.category;
    if (requestedCategory && !validCategoryTypes.includes(requestedCategory)) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid vehicle category.",
      });
    }
    const categoryType = requestedCategory
      ? normalizeCategoryType(requestedCategory)
      : undefined;

    const filter =
      req.query.includeInactive === "true" ? {} : { isActive: true };
    if (categoryType) filter.categoryType = categoryType;

    const brands = await Brand.find(filter).sort({ name: 1 });
    return res.json({ success: true, count: brands.length, brands });
  } catch (error) {
    console.error("Get brands error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load brands.",
    });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const requestedCategory = String(
      req.body.categoryType || req.body.category || ""
    );
    const categoryType = normalizeCategoryType(requestedCategory);
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const slug = slugify(name);

    if (!validCategoryTypes.includes(requestedCategory)) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid vehicle category.",
      });
    }
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required.",
      });
    }

    const category = await Category.findOne({
      type: categoryType === "car" ? "cars" : categoryType,
      isActive: true,
    });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "The selected category is unavailable.",
      });
    }

    const existingBrand = await Brand.findOne({ categoryType, slug });
    if (existingBrand) {
      return res.status(409).json({
        success: false,
        message: "Brand already exists in this category.",
      });
    }

    const brand = await Brand.create({
      name,
      slug,
      categoryType,
      isActive: true,
    });
    return res.status(201).json({
      success: true,
      message: "Brand added successfully.",
      brand,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Brand already exists in this category.",
      });
    }
    console.error("Add brand error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to add brand.",
    });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    if (req.body.name !== undefined) {
      const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
      const slug = slugify(name);
      if (!name || !slug) {
        return res.status(400).json({
          success: false,
          message: "Brand name is required.",
        });
      }
      const duplicate = await Brand.findOne({
        _id: { $ne: brand._id },
        categoryType: brand.categoryType,
        slug,
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Brand already exists in this category.",
        });
      }
      await Vehicle.updateMany(
        {
          brand: brand.name,
          $or:
            brand.categoryType === "commercial"
              ? [
                  { categoryType: "commercial" },
                  { category: "commercial" },
                  { category: { $in: legacyCommercialCategories } },
                ]
              : [
                  { categoryType: { $in: ["car", "cars"] } },
                  { category: { $in: ["car", "cars"] } },
                  { category: { $in: ["Car", "Cars"] } },
                ],
        },
        { $set: { brand: name } }
      );
      brand.name = name;
      brand.slug = slug;
    }

    if (req.body.isActive !== undefined) {
      if (typeof req.body.isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Brand status must be active or inactive.",
        });
      }
      brand.isActive = req.body.isActive;
    }

    await brand.save();
    return res.json({
      success: true,
      message: "Brand updated successfully.",
      brand,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Brand already exists in this category.",
      });
    }
    console.error("Update brand error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update brand.",
    });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    const categoryFilter =
      brand.categoryType === "commercial"
        ? [{ categoryType: "commercial" }, { category: "commercial" }, { category: { $in: legacyCommercialCategories } }]
        : [
            { categoryType: { $in: ["car", "cars"] } },
            { category: { $in: ["car", "cars"] } },
            { category: { $in: ["Car", "Cars"] } },
          ];
    const vehiclesUseBrand = await Vehicle.exists({
      brand: brand.name,
      $or: categoryFilter,
    });

    if (vehiclesUseBrand) {
      return res.status(409).json({
        success: false,
        message: "Brand cannot be deleted because vehicles are using it. Deactivate it instead.",
      });
    }

    await brand.deleteOne();
    return res.json({ success: true, message: "Brand deleted successfully." });
  } catch (error) {
    console.error("Delete brand error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete brand.",
    });
  }
});

module.exports = router;
