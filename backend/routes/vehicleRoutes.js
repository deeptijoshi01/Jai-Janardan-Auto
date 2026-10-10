const express = require("express");
const Brand = require("../models/Brand");
const Vehicle = require("../models/Vehicle");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();
const legacyCommercialCategories = [
  "Truck",
  "Trailer",
  "Mini Truck",
  "Pickup Truck",
  "Tipper",
  "Transit Mixer",
];

const normalizeCategoryType = (categoryType) =>
  categoryType === "cars" ? "car" : categoryType;

const inferCategoryType = (category) => {
  if (category === "commercial") return category;
  if (category === "cars" || category === "car") return "car";
  if (legacyCommercialCategories.includes(category)) return "commercial";
  if (category === "Car" || category === "Cars") return "car";
  return undefined;
};

const categoryFilter = (categoryType) =>
  categoryType === "commercial"
    ? {
        $or: [
          { categoryType: "commercial" },
          { category: "commercial" },
          { category: { $in: legacyCommercialCategories } },
        ],
      }
    : {
        $or: [
          { categoryType: { $in: ["car", "cars"] } },
          { category: { $in: ["car", "cars"] } },
          { category: { $in: ["Car", "Cars"] } },
        ],
      };

const toVehicleResponse = (vehicle) => {
  const data = vehicle.toObject ? vehicle.toObject() : vehicle;
  return {
    ...data,
    categoryType:
      data.categoryType || inferCategoryType(data.category),
  };
};

const validateVehicleBrand = async (categoryType, name) => {
  const normalizedCategoryType = normalizeCategoryType(categoryType);
  if (!["commercial", "car"].includes(normalizedCategoryType)) {
    return "Choose a valid vehicle category.";
  }
  if (typeof name !== "string" || !name.trim()) {
    return "Choose a brand.";
  }
  const brand = await Brand.findOne({
    categoryType: normalizedCategoryType,
    name: name.trim(),
    isActive: true,
  });
  return brand ? null : "Choose an active brand from the selected category.";
};

/*
  GET ALL VEHICLES
  GET /api/vehicles
*/
router.get("/", async (req, res) => {
  try {
    const { bestSeller, category, brand } = req.query;
    const filter = {};

    if (bestSeller === "true" || bestSeller === "1") {
      filter.isBestSeller = true;
    }

    if (category) {
      if (!["commercial", "cars", "car"].includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Choose a valid vehicle category.",
        });
      }
      Object.assign(filter, categoryFilter(normalizeCategoryType(category)));
    }
    if (brand) {
      if (typeof brand !== "string" || !brand.trim()) {
        return res.status(400).json({
          success: false,
          message: "Choose a valid brand.",
        });
      }
      filter.brand = brand.trim();
    }

    const vehicles = await Vehicle.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: vehicles.length,
      vehicles: vehicles.map((vehicle) => ({
        ...vehicle,
        categoryType: vehicle.categoryType || inferCategoryType(vehicle.category),
      })),
    });
  } catch (error) {
    console.error("Get vehicles error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
});


/*
  GET SINGLE VEHICLE
  GET /api/vehicles/:id
*/
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      vehicle: toVehicleResponse(vehicle),
    });
  } catch (error) {
    console.error("Get vehicle error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
    });
  }
});


/*
  ADD VEHICLE
  POST /api/vehicles
*/
router.post("/", requireAdmin, async (req, res) => {
  try {
    const categoryType = normalizeCategoryType(
      req.body.categoryType || req.body.category
    );
    const brandError = await validateVehicleBrand(categoryType, req.body.brand);
    if (brandError) {
      return res.status(400).json({ success: false, message: brandError });
    }

    const vehicle = await Vehicle.create({
      ...req.body,
      category: categoryType,
      categoryType,
      brand: req.body.brand.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle: toVehicleResponse(vehicle),
    });
  } catch (error) {
    console.error("Add vehicle error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


/*
  UPDATE VEHICLE
  PUT /api/vehicles/:id
*/
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const existingVehicle = await Vehicle.findById(req.params.id);
    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const categoryType = normalizeCategoryType(
      req.body.categoryType || req.body.category
    );
    if (["commercial", "car"].includes(categoryType)) {
      const brandError = await validateVehicleBrand(categoryType, req.body.brand);
      const isUnchangedLegacyBrand =
        existingVehicle.brand === req.body.brand &&
        inferCategoryType(existingVehicle.categoryType || existingVehicle.category) ===
          normalizeCategoryType(categoryType);
      if (brandError && !isUnchangedLegacyBrand) {
        return res.status(400).json({ success: false, message: brandError });
      }
      req.body.category = categoryType;
      req.body.categoryType = categoryType;
      req.body.brand = req.body.brand.trim();
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle: toVehicleResponse(vehicle),
    });
  } catch (error) {
    console.error("Update vehicle error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


/*
  TOGGLE BEST SELLER
  PATCH /api/vehicles/:id/best-seller
*/
router.patch("/:id/best-seller", requireAdmin, async (req, res) => {
  try {
    const { isBestSeller } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { isBestSeller: Boolean(isBestSeller) },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Best seller status updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Update best seller error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


/*
  DELETE VEHICLE
  DELETE /api/vehicles/:id
*/
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
});


module.exports = router;