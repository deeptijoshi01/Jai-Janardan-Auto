import type {
  Brand,
  BrandCategoryType,
  Category,
  VehicleCategoryType,
} from "../types/categoryBrand";

const API_BASE_URL = "http://localhost:5000/api";

interface CategoriesResponse {
  success: boolean;
  message?: string;
  categories?: Category[];
}

interface BrandsResponse {
  success: boolean;
  message?: string;
  brands?: Brand[];
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const data = (await response.json().catch(() => null)) as CategoriesResponse | null;
  if (!response.ok || !data?.success || !Array.isArray(data.categories)) {
    throw new Error(data?.message || "Unable to load categories.");
  }
  return data.categories;
}

export async function fetchBrands(
  category?: VehicleCategoryType | BrandCategoryType,
  includeInactive = false
): Promise<Brand[]> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (includeInactive) params.set("includeInactive", "true");
  const query = params.toString();
  const response = await fetch(`${API_BASE_URL}/brands${query ? `?${query}` : ""}`);
  const data = (await response.json().catch(() => null)) as BrandsResponse | null;
  if (!response.ok || !data?.success || !Array.isArray(data.brands)) {
    throw new Error(data?.message || "Unable to load brands.");
  }
  return data.brands;
}
