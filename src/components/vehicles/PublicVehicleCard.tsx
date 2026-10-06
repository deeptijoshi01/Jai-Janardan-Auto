import { useEffect, useState } from "react";
import {
  ArrowRight,
  Fuel,
  Gauge,
  MapPin,
  Settings2,
  Star,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import carImage from "../../assets/VehicleTypes/Toyota Innova Crysta Studio Showcase.png";
import miniTruckImage from "../../assets/VehicleTypes/Mini Trucks.png";
import pickupImage from "../../assets/VehicleTypes/Pickup Trucks.png";
import tipperImage from "../../assets/VehicleTypes/Tippers.png";
import trailerImage from "../../assets/VehicleTypes/Trailers.png";
import mixerImage from "../../assets/VehicleTypes/Transit Mixers.png";
import truckImage from "../../assets/VehicleTypes/Truck.png";
import {
  getVehicleCategoryLabel,
  type Vehicle,
  type VehicleStatus,
} from "../../types/vehicle";

const categoryImages: Record<string, string> = {
  truck: truckImage,
  trailer: trailerImage,
  minitruck: miniTruckImage,
  pickuptruck: pickupImage,
  pickup: pickupImage,
  tipper: tipperImage,
  transitmixer: mixerImage,
  car: carImage,
  other: truckImage,
};

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/s$/, "");

const categoryImage = (category: string) =>
  categoryImages[normalize(category)] ?? truckImage;

const formatFullPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

/** ₹8.50 Lakh / ₹1.20 Cr for readability; small amounts stay as full ₹ figures. */
const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`;
  return formatFullPrice(price);
};

const formatKilometers = (kilometers: number) =>
  `${kilometers.toLocaleString("en-IN")} km`;

const statusDots: Record<VehicleStatus, string> = {
  Available: "bg-emerald-400",
  Reserved: "bg-sky-400",
  Sold: "bg-slate-300",
};

interface PublicVehicleCardProps {
  vehicle: Vehicle;
  showBestSellerBadge?: boolean;
  compact?: boolean;
}

const PublicVehicleCard = ({
  vehicle,
  showBestSellerBadge = false,
  compact = false,
}: PublicVehicleCardProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const placeholder = categoryImage(vehicle.category);
  const imageUrl = vehicle.images?.[0]?.url || placeholder;
  const hasImage = Boolean(vehicle.images?.[0]?.url);

  useEffect(() => {
    if (!previewImage) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewImage(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [previewImage]);

  const statusKey: VehicleStatus =
    vehicle.status in statusDots ? vehicle.status : "Available";

  // Tagline slot: description if present, otherwise year + brand/model.
  const tagline =
    vehicle.description?.trim() ||
    [vehicle.year, `${vehicle.brand} ${vehicle.model}`.trim()]
      .filter(Boolean)
      .join(" • ");

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#eee8da] bg-[#fdfcf9] shadow-[0_8px_26px_-14px_rgba(11,26,51,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[#d9c48c] hover:shadow-[0_26px_50px_-24px_rgba(11,26,51,0.38)]">
      {/* ---------- Media ---------- */}
      <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-b from-[#f7f4ec] to-[#efe9db]">
        <button
          type="button"
          onClick={() => setPreviewImage(imageUrl)}
          aria-label={`View full image of ${vehicle.title}`}
          className="absolute inset-0 flex h-full w-full items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#c9a24b]"
        >
          <img
            src={imageUrl}
            alt={vehicle.title}
            loading="lazy"
            className={`h-full w-full ${
              hasImage ? "object-contain p-2 sm:p-3" : "object-contain p-6"
            }`}
            onError={(event) => {
              if (!event.currentTarget.dataset.fallbackApplied) {
                event.currentTarget.dataset.fallbackApplied = "true";
                event.currentTarget.src = placeholder;
                event.currentTarget.className = "h-full w-full object-contain p-6";
              }
            }}
          />
        </button>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent"
          aria-hidden="true"
        />

        {showBestSellerBadge && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[#e8c46f] to-[#c9a24b] px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0b1a33] shadow-md">
            <Star size={12} className="fill-[#0b1a33]" aria-hidden="true" />
            Best Seller
          </span>
        )}

        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <span className={`h-2 w-2 rounded-full ${statusDots[statusKey]}`} />
          {vehicle.status}
        </span>
      </div>

      {previewImage &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${vehicle.title} image preview`}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-3 sm:p-6"
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              aria-label="Close image preview"
              className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:right-5 sm:top-5"
            >
              <X size={26} />
            </button>
            <img
              src={previewImage}
              alt={vehicle.title}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[90vh] max-w-[95vw] object-contain"
            />
          </div>,
          document.body
        )}

      {/* ---------- Body ---------- */}
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="flex items-center gap-3">
          <p className="truncate text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a6f3a]">
            {getVehicleCategoryLabel(vehicle)}
          </p>
          <span
            className="h-px w-6 shrink-0 bg-[#c9a24b]"
            aria-hidden="true"
          />
        </div>

        <h3
          className={`mt-2 line-clamp-1 font-serif font-bold text-[#0b1a33] ${
            compact ? "text-xl" : "text-[1.35rem]"
          }`}
        >
          {vehicle.title}
        </h3>
        <p className="mt-1 line-clamp-1 min-h-[1.25rem] text-sm text-[#7a8493]">
          {tagline}
        </p>

        {/* Specs: two columns with a vertical divider */}
        <div className="mt-4 grid grid-cols-2 border-y border-[#ece6d6] py-3.5">
          <ul className="min-w-0 space-y-3 pr-3">
            <Spec icon={Gauge} value={formatKilometers(vehicle.kilometers)} />
            <Spec icon={Settings2} value={vehicle.transmission} />
          </ul>
          <ul className="min-w-0 space-y-3 border-l border-[#ece6d6] pl-4">
            <Spec icon={Fuel} value={vehicle.fuelType} />
            <Spec icon={MapPin} value={vehicle.location} />
          </ul>
        </div>

        {/* Price + CTA pinned to the bottom so every card aligns */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-3 pt-4">
          <div className="shrink-0">
            <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f8672]">
              Asking price
            </p>
            <p
              title={formatFullPrice(vehicle.price)}
              className={`mt-1 whitespace-nowrap font-serif font-bold leading-none tracking-tight text-[#b8903f] ${
                compact ? "text-xl" : "text-2xl"
              }`}
            >
              {formatPrice(vehicle.price)}
            </p>
          </div>

          <Link
            to={`/vehicles/${vehicle._id}`}
            className="inline-flex h-11 grow basis-[9rem] items-center justify-center gap-1.5 rounded-lg bg-[#0b1a33] px-4 text-sm font-bold text-[#fffdf7] shadow-[0_10px_20px_-10px_rgba(11,26,51,0.8)] transition hover:bg-[#13294d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b] active:scale-[0.98]"
          >
            View Details
            <ArrowRight
              size={15}
              className="text-[#e3be6a] transition group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

const Spec = ({
  icon: Icon,
  value,
}: {
  icon: LucideIcon;
  value: string;
}) => (
  <li className="flex min-w-0 items-center gap-3 text-sm text-[#3f4a5c]">
    <Icon
      size={17}
      strokeWidth={1.7}
      className="shrink-0 text-[#a27e3d]"
      aria-hidden="true"
    />
    <span className="truncate">{value}</span>
  </li>
);

export default PublicVehicleCard;