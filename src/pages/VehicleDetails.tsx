import { useCallback, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Gauge,
  MapPin,
  Pencil,
  Truck,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  getVehicleCategoryLabel,
  getVehicleCategoryType,
  type Vehicle,
  type VehicleStatus,
} from "../types/vehicle";
import { fetchBrands, fetchCategories } from "../services/categoryBrandApi";
import type { Brand, Category, VehicleCategoryType } from "../types/categoryBrand";
import { adminFetch, API_BASE_URL } from "../services/adminAuth";

interface VehicleResponse {
  success: boolean;
  message?: string;
  vehicle: Vehicle;
}

interface VehicleDetailsProps {
  mode: "view" | "edit";
}

const API_URL = `${API_BASE_URL}/vehicles`;
const inputClass =
  "h-12 w-full rounded-xl border border-[#e6e1d6] bg-[#fdfcf9] px-4 text-sm text-[#14110a] outline-none transition focus:border-[#c9a050] focus:bg-white focus:ring-4 focus:ring-[#c9a050]/15";
const fuelTypes = ["Diesel", "Petrol", "CNG", "Electric", "Other"];
const transmissions = ["Manual", "Automatic", "Other"];
const statusOptions: Vehicle["status"][] = ["Available", "Reserved", "Sold"];

const VehicleDetails = ({ mode }: VehicleDetailsProps) => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bestSellerSaving, setBestSellerSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categoryOptionsError, setCategoryOptionsError] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchCategories()
      .then((result) => {
        if (isMounted) setCategories(result);
      })
      .catch((loadError: unknown) => {
        console.error("Vehicle edit categories API error:", loadError);
        if (isMounted) {
          setCategoryOptionsError(
            loadError instanceof Error ? loadError.message : "Unable to load categories."
          );
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const currentCategoryType = vehicle ? getVehicleCategoryType(vehicle) : undefined;

  useEffect(() => {
    let isMounted = true;
    void Promise.resolve().then(async () => {
      if (!currentCategoryType) {
        if (isMounted) setBrands([]);
        return;
      }
      try {
        const result = await fetchBrands(currentCategoryType, true);
        if (isMounted) setBrands(result);
      } catch (loadError: unknown) {
        console.error("Vehicle edit brands API error:", loadError);
        if (isMounted) {
          setCategoryOptionsError(
            loadError instanceof Error ? loadError.message : "Unable to load brands."
          );
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentCategoryType]);

  const loadVehicle = useCallback(async () => {
    if (!vehicleId) {
      setError("A vehicle ID is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${vehicleId}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as VehicleResponse;
      if (!response.ok || !data.success || !data.vehicle) {
        throw new Error(data.message || "Unable to load this vehicle.");
      }
      setVehicle(data.vehicle);
      setError("");
    } catch (loadError) {
      console.error("Vehicle details API error:", loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load this vehicle."
      );
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    void Promise.resolve().then(loadVehicle);
  }, [loadVehicle]);

  const updateVehicle = <K extends keyof Vehicle>(key: K, value: Vehicle[K]) => {
    setVehicle((current) => (current ? { ...current, [key]: value } : current));
  };

  const toggleBestSeller = async (isBestSeller: boolean) => {
    if (!vehicle?._id) return;

    setBestSellerSaving(true);
    setError("");

    try {
      const response = await adminFetch(`${API_URL}/${vehicle._id}/best-seller`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBestSeller }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        vehicle?: Vehicle;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update Best Seller status.");
      }

      const updatedBestSeller = Boolean(data.vehicle?.isBestSeller ?? isBestSeller);
      updateVehicle("isBestSeller", updatedBestSeller);
      window.dispatchEvent(new CustomEvent("best-seller-updated"));
    } catch (toggleError) {
      console.error("Toggle best seller error:", toggleError);
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Unable to update Best Seller status."
      );
    } finally {
      setBestSellerSaving(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vehicle) return;

    setSaving(true);
    setError("");
    try {
      const response = await adminFetch(`${API_URL}/${vehicle._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: vehicle.title.trim(),
          brand: vehicle.brand.trim(),
          model: vehicle.model.trim(),
          year: Number(vehicle.year),
          price: Number(vehicle.price),
          category: vehicle.category,
          categoryType: getVehicleCategoryType(vehicle),
          kilometers: Number(vehicle.kilometers),
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
          location: vehicle.location.trim(),
          description: vehicle.description?.trim() || "",
          status: vehicle.status,
          isBestSeller: Boolean(vehicle.isBestSeller),
          images: vehicle.images,
        }),
      });
      const data = (await response.json()) as {
        success: boolean;
        message?: string;
      };
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save vehicle changes.");
      }
      window.dispatchEvent(new CustomEvent("best-seller-updated"));
      navigate("/admin/vehicles");
    } catch (saveError) {
      console.error("Update vehicle error:", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save vehicle changes."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4" aria-label="Loading vehicle">
        <div className="h-12 w-40 animate-pulse rounded-xl bg-[#efeae0]" />
        <div className="h-72 animate-pulse rounded-3xl bg-[#efeae0]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
      <header>
        <Link
          to="/admin/vehicles"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e6e1d6] bg-white px-4 text-sm font-medium text-[#4d493f] shadow-sm transition hover:border-[#e0b866] hover:text-[#14110a]"
        >
          <ArrowLeft size={16} />
          All vehicles
        </Link>
        <p className="mt-5 text-sm font-semibold text-[#9a7424]">
          Inventory management
        </p>
        <h1 className="jj-serif mt-1 text-3xl text-[#14110a] sm:text-4xl">
          {mode === "edit" ? "Edit vehicle" : "Vehicle details"}
        </h1>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!vehicle ? (
        <section className="rounded-3xl border border-[#efeae0] bg-white px-6 py-12 text-center">
          <Truck size={28} className="mx-auto text-[#b98a32]" />
          <h2 className="mt-4 font-semibold text-[#14110a]">Vehicle unavailable</h2>
          <p className="mt-2 text-sm text-[#8a8478]">
            Return to inventory to choose another vehicle.
          </p>
        </section>
      ) : mode === "view" ? (
        <section className="overflow-hidden rounded-3xl border border-[#efeae0] bg-white shadow-[0_1px_2px_rgba(20,16,8,0.04),0_14px_34px_-22px_rgba(20,16,8,0.18)]">
          {vehicle.images?.[0]?.url ? (
            <img
              src={vehicle.images[0].url}
              alt={vehicle.title}
              className="h-64 w-full bg-[#f6f3ea] object-cover sm:h-80"
            />
          ) : (
            <div className="flex h-56 items-center justify-center bg-[#f6f3ea] text-[#b98a32] sm:h-64">
              <Truck size={42} strokeWidth={1.4} />
            </div>
          )}
          <div className="p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <span className="text-sm font-semibold text-[#9a7424]">
                  {getVehicleCategoryLabel(vehicle)}
                </span>
                <h2 className="jj-serif mt-1 text-3xl text-[#14110a]">
                  {vehicle.title}
                </h2>
                <p className="mt-2 text-sm text-[#6b665c]">
                  {vehicle.brand} {vehicle.model}
                </p>
              </div>
              <Link
                to={`/admin/vehicles/edit/${vehicle._id}`}
                className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#14110a] px-5 text-sm font-semibold text-white transition hover:bg-[#2a251a]"
              >
                <Pencil size={16} className="text-[#e0b866]" />
                Edit vehicle
              </Link>
            </div>
            <p className="jj-serif mt-5 text-3xl text-[#14110a]">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(vehicle.price)}
            </p>
            <div className="mt-6 grid gap-4 border-t border-[#f1ede2] pt-5 sm:grid-cols-2 lg:grid-cols-3">
              <Detail icon={CalendarDays} label="Year" value={String(vehicle.year)} />
              <Detail
                icon={Gauge}
                label="Kilometers"
                value={`${vehicle.kilometers.toLocaleString("en-IN")} km`}
              />
              <Detail icon={MapPin} label="Location" value={vehicle.location} />
              <Detail icon={Truck} label="Fuel type" value={vehicle.fuelType} />
              <Detail
                icon={Truck}
                label="Transmission"
                value={vehicle.transmission}
              />
              <Detail icon={CheckCircle2} label="Status" value={vehicle.status} />
            </div>
            {vehicle.description && (
              <div className="mt-6 border-t border-[#f1ede2] pt-5">
                <h3 className="text-sm font-semibold text-[#14110a]">Description</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6b665c]">
                  {vehicle.description}
                </p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-[#efeae0] bg-white p-5 shadow-[0_1px_2px_rgba(20,16,8,0.04),0_14px_34px_-22px_rgba(20,16,8,0.18)] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Vehicle title" required>
              <input
                required
                value={vehicle.title}
                onChange={(event) => updateVehicle("title", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Brand" required>
              <select
                required
                value={vehicle.brand}
                onChange={(event) => updateVehicle("brand", event.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Select an active brand
                </option>
                {!brands.some((brand) => brand.name === vehicle.brand) && (
                  vehicle.brand ? (
                    <option value={vehicle.brand}>{vehicle.brand} (existing)</option>
                  ) : null
                )}
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name} disabled={!brand.isActive}>
                    {brand.name}{brand.isActive ? "" : " (inactive)"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Model" required>
              <input
                required
                value={vehicle.model}
                onChange={(event) => updateVehicle("model", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Year" required>
              <input
                required
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={vehicle.year}
                onChange={(event) =>
                  updateVehicle("year", Number(event.target.value))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Price (₹)" required>
              <input
                required
                type="number"
                min="1"
                value={vehicle.price}
                onChange={(event) =>
                  updateVehicle("price", Number(event.target.value))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Category" required>
              <select
                required
                value={currentCategoryType || ""}
                onChange={(event) => {
                  const nextCategory = event.target.value as VehicleCategoryType;
                  updateVehicle("category", nextCategory);
                  updateVehicle("categoryType", nextCategory);
                  updateVehicle("brand", "");
                }}
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category.type}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Kilometers">
              <input
                type="number"
                min="0"
                value={vehicle.kilometers}
                onChange={(event) =>
                  updateVehicle("kilometers", Number(event.target.value))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Fuel type">
              <select
                value={vehicle.fuelType}
                onChange={(event) => updateVehicle("fuelType", event.target.value)}
                className={inputClass}
              >
                {[...new Set([...fuelTypes, vehicle.fuelType])].map((fuelType) => (
                  <option key={fuelType} value={fuelType}>
                    {fuelType}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Transmission">
              <select
                value={vehicle.transmission}
                onChange={(event) =>
                  updateVehicle("transmission", event.target.value)
                }
                className={inputClass}
              >
                {[...new Set([...transmissions, vehicle.transmission])].map(
                  (transmission) => (
                    <option key={transmission} value={transmission}>
                      {transmission}
                    </option>
                  )
                )}
              </select>
            </Field>
            <Field label="Location" required>
              <input
                required
                value={vehicle.location}
                onChange={(event) => updateVehicle("location", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Status">
              <select
                value={vehicle.status}
                onChange={(event) =>
                  updateVehicle("status", event.target.value as VehicleStatus)
                }
                className={inputClass}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Best Seller">
              <label className="flex h-12 items-center justify-between gap-3 rounded-xl border border-[#e6e1d6] bg-[#fdfcf9] px-4 text-sm font-medium text-[#14110a]">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">⭐</span>
                  Mark as Best Seller
                </span>
                <input
                  type="checkbox"
                  checked={Boolean(vehicle.isBestSeller)}
                  disabled={bestSellerSaving}
                  onChange={(event) => {
                    void toggleBestSeller(event.target.checked);
                  }}
                  className="h-5 w-5 accent-[#c9a050] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea
                rows={5}
                value={vehicle.description || ""}
                onChange={(event) =>
                  updateVehicle("description", event.target.value)
                }
                className={`${inputClass} h-auto resize-y py-3`}
              />
            </Field>
          </div>
          {categoryOptionsError && (
            <p role="alert" className="text-sm text-red-600">
              {categoryOptionsError}
            </p>
          )}
          <div className="flex flex-col-reverse gap-3 border-t border-[#f1ede2] pt-5 sm:flex-row sm:justify-end">
            <Link
              to={`/admin/vehicles/${vehicle._id}`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e6e1d6] bg-white px-5 text-sm font-semibold text-[#4d493f] transition hover:bg-[#faf8f3]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#14110a] px-5 text-sm font-semibold text-white transition hover:bg-[#2a251a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

interface FieldProps {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

const Field = ({ label, required, className = "", children }: FieldProps) => (
  <label className={`block ${className}`}>
    <span className="mb-2 block text-sm font-semibold text-[#14110a]">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </span>
    {children}
  </label>
);

interface DetailProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const Detail = ({ icon: Icon, label, value }: DetailProps) => (
  <div className="flex items-center gap-3">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6f3ea] text-[#b98a32]">
      <Icon size={18} />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-[#8a8478]">{label}</p>
      <p className="truncate text-sm font-semibold text-[#14110a]">{value}</p>
    </div>
  </div>
);

export default VehicleDetails;
