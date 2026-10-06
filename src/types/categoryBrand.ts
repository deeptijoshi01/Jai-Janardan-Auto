export type VehicleCategoryType = "commercial" | "cars";
export type BrandCategoryType = "commercial" | "car";

export const brandCategoryTypeFor = (
  categoryType: VehicleCategoryType
): BrandCategoryType => (categoryType === "cars" ? "car" : "commercial");

export interface Category {
  _id: string;
  name: string;
  slug: VehicleCategoryType;
  type: VehicleCategoryType;
  isActive: boolean;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  categoryType: BrandCategoryType | "cars";
  isActive: boolean;
}
