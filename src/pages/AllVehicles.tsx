import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import bg2 from "../assets/admindashboard/bg2.png";
import { getVehicleCategoryLabel, type Vehicle } from "../types/vehicle";

interface VehiclesResponse {
  success: boolean;
  message?: string;
  vehicles: Vehicle[];
}

const API_URL = "http://localhost:5000/api/vehicles";
const card =
  "rounded-2xl border border-[#efeae0] bg-white shadow-[0_1px_2px_rgba(20,16,8,0.04),0_14px_34px_-22px_rgba(20,16,8,0.18)]";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const statusClasses: Record<Vehicle["status"], string> = {
  Available: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Sold: "bg-rose-50 text-rose-600 ring-rose-100",
  Reserved: "bg-sky-50 text-sky-700 ring-sky-100",
};

const AllVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadVehicles = useCallback(async () => {
    try {
      const response = await fetch(API_URL, { cache: "no-store" });
      const data = (await response.json()) as VehiclesResponse;
      if (!response.ok || !data.success || !Array.isArray(data.vehicles)) {
        throw new Error(data.message || "Unable to load vehicle inventory.");
      }
      setVehicles(data.vehicles);
      setError("");
    } catch (loadError) {
      console.error("Inventory API error:", loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load vehicle inventory."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadVehicles);
  }, [loadVehicles]);

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return vehicles;
    return vehicles.filter((vehicle) =>
      [
        vehicle.title,
        vehicle.brand,
        vehicle.model,
        vehicle.category,
        vehicle.location,
        vehicle.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [search, vehicles]);

  const deleteVehicle = async (vehicle: Vehicle) => {
    if (!window.confirm(`Delete "${vehicle.title}"? This can't be undone.`)) {
      return;
    }

    setDeletingId(vehicle._id);
    setError("");
    try {
      const response = await fetch(`${API_URL}/${vehicle._id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete this vehicle.");
      }
      setVehicles((current) =>
        current.filter((item) => item._id !== vehicle._id)
      );
    } catch (deleteError) {
      console.error("Delete vehicle error:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this vehicle."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            to="/admin"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e6e1d6] bg-white px-4 text-sm font-medium text-[#4d493f] shadow-sm transition hover:border-[#e0b866] hover:text-[#14110a]"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <p className="mt-5 text-sm font-semibold text-[#9a7424]">
            Inventory management
          </p>
          <h1 className="jj-serif mt-1 text-3xl text-[#14110a] sm:text-4xl">
            All vehicles
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#6b665c]">
            Manage the commercial vehicles currently listed in your inventory.
          </p>
        </div>
        <Link
          to="/admin/vehicles/add"
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#14110a] px-5 text-sm font-semibold text-white shadow-[0_12px_26px_-10px_rgba(20,17,10,0.7)] ring-1 ring-[#c9a050]/40 transition hover:bg-[#2a251a] sm:self-auto"
        >
          <Plus size={17} className="text-[#e0b866]" />
          Add Vehicle
        </Link>
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

      <section className={`${card} overflow-hidden`}>
        <div className="flex flex-col gap-3 border-b border-[#f1ede2] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="jj-serif text-xl text-[#14110a]">Vehicle inventory</h2>
            <p className="mt-1 text-sm text-[#8a8478]">
              {loading
                ? "Loading vehicles..."
                : `${filteredVehicles.length} ${
                    filteredVehicles.length === 1 ? "vehicle" : "vehicles"
                  }`}
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a39d90]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search inventory"
              aria-label="Search vehicles"
              className="h-11 w-full rounded-xl border border-[#e6e1d6] bg-[#fdfcf9] pl-10 pr-4 text-sm text-[#14110a] outline-none transition placeholder:text-[#a39d90] focus:border-[#c9a050] focus:bg-white focus:ring-4 focus:ring-[#c9a050]/15"
            />
          </label>
        </div>

        {loading ? (
          <div className="space-y-3 p-4 sm:p-6" aria-label="Loading vehicles">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-[#f6f3ea]"
              />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6f3ea] text-[#b98a32]">
              <Truck size={28} />
            </div>
            <h3 className="mt-5 text-base font-semibold text-[#14110a]">
              {vehicles.length === 0 ? "No vehicles yet" : "No vehicles found"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-[#8a8478]">
              {vehicles.length === 0
                ? "Add your first commercial vehicle to start building your inventory."
                : "Try another search term to find a vehicle."}
            </p>
            {vehicles.length === 0 && (
              <Link
                to="/admin/vehicles/add"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#14110a] px-5 text-sm font-semibold text-white transition hover:bg-[#2a251a]"
              >
                <Plus size={17} className="text-[#e0b866]" />
                Add first vehicle
              </Link>
            )}
          </div>
        ) : (
          <>
            <ul className="space-y-3 p-4 md:hidden">
              {filteredVehicles.map((vehicle) => (
                <li
                  key={vehicle._id}
                  className="rounded-2xl border border-[#efeae0] bg-[#fdfcf9] p-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={vehicle.images?.[0]?.url || bg2}
                      alt={vehicle.title}
                      className="h-20 w-24 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#14110a]">
                        {vehicle.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b665c]">
                        {vehicle.brand} {vehicle.model} · {vehicle.year}
                      </p>
                      <p className="mt-1 text-base font-bold text-[#14110a]">
                        {formatPrice(vehicle.price)}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
                            statusClasses[vehicle.status] ??
                            "bg-gray-50 text-gray-700 ring-gray-100"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                        {vehicle.isBestSeller && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
                            ⭐ Best Seller
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#6b665c]">
                    <span>{getVehicleCategoryLabel(vehicle)}</span>
                    <span>{vehicle.kilometers.toLocaleString("en-IN")} km</span>
                    <span>{vehicle.fuelType}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} />
                      {vehicle.location}
                    </span>
                  </div>
                  <VehicleActions
                    vehicle={vehicle}
                    onDelete={deleteVehicle}
                    isDeleting={deletingId === vehicle._id}
                    className="mt-3 justify-end border-t border-[#efeae0] pt-3"
                  />
                </li>
              ))}
            </ul>

            <div className="hidden overflow-x-auto p-4 md:block sm:p-6">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="bg-[#faf8f3] text-xs font-semibold text-[#6b665c]">
                    <th className="rounded-l-xl px-3 py-3">Vehicle</th>
                    <th className="px-3 py-3">Specifications</th>
                    <th className="px-3 py-3">Price</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Location</th>
                    <th className="rounded-r-xl px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr
                      key={vehicle._id}
                      className="border-b border-[#f1ede2] last:border-0"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={vehicle.images?.[0]?.url || bg2}
                            alt={vehicle.title}
                            className="h-12 w-16 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <p className="max-w-52 truncate text-sm font-bold text-[#14110a]">
                              {vehicle.title}
                            </p>
                            <p className="mt-0.5 text-xs text-[#8a8478]">
                              {vehicle.brand} {vehicle.model} · {vehicle.year}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs leading-5 text-[#6b665c]">
                        <p>{getVehicleCategoryLabel(vehicle)} · {vehicle.fuelType}</p>
                        <p>{vehicle.kilometers.toLocaleString("en-IN")} km</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm font-bold text-[#14110a]">
                        {formatPrice(vehicle.price)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${
                              statusClasses[vehicle.status] ??
                              "bg-gray-50 text-gray-700 ring-gray-100"
                            }`}
                          >
                            {vehicle.status}
                          </span>
                          {vehicle.isBestSeller && (
                            <span className="whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
                              ⭐ Best Seller
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-[#6b665c]">
                        {vehicle.location}
                      </td>
                      <td className="px-3 py-3">
                        <VehicleActions
                          vehicle={vehicle}
                          onDelete={deleteVehicle}
                          isDeleting={deletingId === vehicle._id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

interface VehicleActionsProps {
  vehicle: Vehicle;
  onDelete: (vehicle: Vehicle) => void;
  isDeleting: boolean;
  className?: string;
}

const VehicleActions = ({
  vehicle,
  onDelete,
  isDeleting,
  className = "",
}: VehicleActionsProps) => (
  <div className={`flex items-center gap-1.5 ${className}`}>
    <Link
      to={`/admin/vehicles/${vehicle._id}`}
      aria-label={`View ${vehicle.title}`}
      title="View vehicle"
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f3ea] text-[#4d493f] transition hover:bg-[#ece6d6]"
    >
      <Eye size={16} />
    </Link>
    <Link
      to={`/admin/vehicles/edit/${vehicle._id}`}
      aria-label={`Edit ${vehicle.title}`}
      title="Edit vehicle"
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f3ea] text-[#4d493f] transition hover:bg-[#ece6d6]"
    >
      <Pencil size={16} />
    </Link>
    <button
      type="button"
      onClick={() => onDelete(vehicle)}
      disabled={isDeleting}
      aria-label={`Delete ${vehicle.title}`}
      title="Delete vehicle"
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

export default AllVehicles;
