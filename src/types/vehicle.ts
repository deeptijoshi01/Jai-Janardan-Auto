import type { VehicleCategoryType } from "./categoryBrand";

export interface VehicleImage {
  url: string;
  publicId: string;
}

export type VehicleStatus = "Available" | "Sold" | "Reserved";

export interface Vehicle {
  _id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: string;
  categoryType?: VehicleCategoryType | "car";
  kilometers: number;
  fuelType: string;
  transmission: string;
  location: string;
  description?: string;
  status: VehicleStatus;
  isBestSeller?: boolean;
  images?: VehicleImage[];
  createdAt: string;
  updatedAt: string;
}

const legacyCommercialCategories = new Set([
  "truck",
  "trailer",
  "mini truck",
  "pickup truck",
  "tipper",
  "transit mixer",
]);

export function getVehicleCategoryType(
  vehicle: Pick<Vehicle, "category" | "categoryType">
): VehicleCategoryType | undefined {
  if (vehicle.categoryType === "car") return "cars";
  if (vehicle.categoryType) return vehicle.categoryType;
  const category = vehicle.category.trim().toLowerCase();
  if (category === "commercial" || legacyCommercialCategories.has(category)) {
    return "commercial";
  }
  if (category === "cars" || category === "car") return "cars";
  return undefined;
}

export function getVehicleCategoryLabel(
  vehicle: Pick<Vehicle, "category" | "categoryType">
): string {
  const type = getVehicleCategoryType(vehicle);
  if (vehicle.category.toLowerCase() === "commercial" && type === "commercial") {
    return "Commercial Vehicles";
  }
  if (vehicle.category.toLowerCase() === "cars" && type === "cars") {
    return "Cars";
  }
  return vehicle.category;
}
