const Category = require("../models/Category");
const Brand = require("../models/Brand");

const categories = [
  { name: "Commercial Vehicles", slug: "commercial", type: "commercial" },
  { name: "Cars", slug: "cars", type: "cars" },
];

const brands = [
  { name: "Tata", categoryType: "commercial" },
  { name: "Mahindra", categoryType: "commercial" },
  { name: "Ashok Leyland", categoryType: "commercial" },
  { name: "Eicher", categoryType: "commercial" },
  { name: "Toyota", categoryType: "car" },
  { name: "Tata", categoryType: "car" },
  { name: "Maruti Suzuki", categoryType: "car" },
  { name: "Hyundai", categoryType: "car" },
];

const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function ensureCategoryBrandSeed() {
  await Promise.all(
    categories.map(({ name, slug, type }) =>
      Category.updateOne(
        { type },
        { $setOnInsert: { name, slug, type, isActive: true } },
        { upsert: true }
      )
    )
  );

  await Brand.updateMany(
    { categoryType: "cars" },
    { $set: { categoryType: "car" } }
  );

  await Promise.all(
    brands.map(({ name, categoryType }) =>
      Brand.updateOne(
        { categoryType, slug: slugify(name) },
        {
          $setOnInsert: {
            name,
            slug: slugify(name),
            categoryType,
            isActive: true,
          },
        },
        { upsert: true }
      )
    )
  );
}

module.exports = { ensureCategoryBrandSeed, slugify };
