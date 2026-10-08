import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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
  const [cardImageIndex, setCardImageIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const placeholder = categoryImage(vehicle.category);
  const galleryImages = vehicle.images?.filter((image) => image.url) ?? [];
  const imageUrls =
    galleryImages.length > 0
      ? galleryImages.map((image) => image.url)
      : [placeholder];
  const imageUrl = imageUrls[cardImageIndex] ?? imageUrls[0];
  const hasMultipleImages = imageUrls.length > 1;

  useEffect(() => {
    if (activeImageIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImageIndex(null);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveImageIndex((index) =>
          index === null ? null : (index - 1 + imageUrls.length) % imageUrls.length
        );
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveImageIndex((index) =>
          index === null ? null : (index + 1) % imageUrls.length
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeImageIndex, imageUrls.length]);

  const showPreviousImage = () =>
    setActiveImageIndex((index) =>
      index === null ? null : (index - 1 + imageUrls.length) % imageUrls.length
    );

  const showNextImage = () =>
    setActiveImageIndex((index) =>
      index === null ? null : (index + 1) % imageUrls.length
    );

  const handleGallerySwipeEnd = (clientX: number) => {
    if (swipeStartX.current === null) return;
    const distance = clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(distance) < 45) return;
    if (distance > 0) showPreviousImage();
    else showNextImage();
  };

  const statusKey: VehicleStatus =
    vehicle.status in statusDots ? vehicle.status : "Available";

  // Tagline slot: description if present, otherwise year + brand/model.
  const tagline =
    vehicle.description?.trim() ||
    [vehicle.year, `${vehicle.brand} ${vehicle.model}`.trim()]
      .filter(Boolean)
      .join(" • ");

  return (
    <article
      className={`group relative flex h-full min-w-0 flex-col overflow-hidden transition ${
        compact
          ? "duration-200 rounded-[18px] border border-[#e9e6df] bg-[#fffefa] shadow-[0_3px_14px_rgba(11,26,51,0.045)] hover:-translate-y-0.5 hover:border-[#d8c9aa] hover:shadow-[0_8px_20px_rgba(11,26,51,0.075)]"
          : "duration-300 rounded-2xl border border-[#eee8da] bg-[#fdfcf9] shadow-[0_8px_26px_-14px_rgba(11,26,51,0.22)] hover:-translate-y-1 hover:border-[#d9c48c] hover:shadow-[0_26px_50px_-24px_rgba(11,26,51,0.38)]"
      }`}
    >
      {/* ---------- Media ---------- */}
      <div
        className="relative aspect-[16/9] overflow-hidden bg-[#f1f0ec]"
      >
        <button
          type="button"
          onClick={() => setActiveImageIndex(cardImageIndex)}
          aria-label={`View vehicle image gallery for ${vehicle.title}`}
          className="absolute inset-0 flex h-full w-full items-center justify-center p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#c9a24b] sm:p-3"
        >
          <img
            src={imageUrl}
            alt={`${vehicle.title} image ${cardImageIndex + 1}`}
            loading="lazy"
            className={`h-full w-full object-contain ${
              galleryImages.length > 0 ? "" : "p-5"
            }`}
            onError={(event) => {
              if (!event.currentTarget.dataset.fallbackApplied) {
                event.currentTarget.dataset.fallbackApplied = "true";
                event.currentTarget.src = placeholder;
                event.currentTarget.className = "h-full w-full object-contain p-5";
              }
            }}
          />
        </button>

        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label="Previous vehicle image"
              onClick={(event) => {
                event.stopPropagation();
                setCardImageIndex((index) => (index - 1 + imageUrls.length) % imageUrls.length);
              }}
              className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-[#fffefa]/90 text-[#25354b] shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a24b] sm:left-3 sm:h-9 sm:w-9"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next vehicle image"
              onClick={(event) => {
                event.stopPropagation();
                setCardImageIndex((index) => (index + 1) % imageUrls.length);
              }}
              className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-[#fffefa]/90 text-[#25354b] shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a24b] sm:right-3 sm:h-9 sm:w-9"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <span className="pointer-events-none absolute bottom-2 right-2 z-10 rounded-full bg-[#0b1a33]/75 px-2.5 py-1 text-[10px] font-medium tabular-nums text-white backdrop-blur-sm sm:bottom-3 sm:right-3">
              {cardImageIndex + 1} / {imageUrls.length}
            </span>
          </>
        )}

        {showBestSellerBadge && (
          <span
            className={`absolute inline-flex items-center gap-1.5 uppercase ${
              compact
                ? "left-2.5 top-2.5 rounded-full border border-white/80 bg-[#fffefa]/95 px-2 py-1 text-[9px] font-semibold tracking-[0.12em] text-[#79633d] shadow-sm backdrop-blur-sm"
                : "left-3 top-3 rounded-md bg-gradient-to-r from-[#e8c46f] to-[#c9a24b] px-2.5 py-1.5 text-[11px] font-extrabold tracking-[0.08em] text-[#0b1a33] shadow-md"
            }`}
          >
            <Star
              size={compact ? 10 : 12}
              className={compact ? "text-[#a77f39]" : "fill-[#0b1a33]"}
              aria-hidden="true"
            />
            Best Seller
          </span>
        )}

        <span
          className={`absolute inline-flex items-center gap-1.5 rounded-full font-medium ${
            compact
              ? "right-2.5 top-2.5 border border-white/80 bg-[#fffefa]/95 px-2 py-1 text-[10px] text-[#46505d] shadow-sm backdrop-blur-sm"
              : "right-3 top-3 bg-black/35 px-2.5 py-1 text-xs text-white backdrop-blur-sm"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${statusDots[statusKey]}`}
          />
          {vehicle.status}
        </span>
      </div>

      {activeImageIndex !== null &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${vehicle.title} image gallery`}
            onClick={() => setActiveImageIndex(null)}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080d16]/95 p-3 backdrop-blur-sm sm:p-6"
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveImageIndex(null);
              }}
              aria-label="Close image preview"
              className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:right-6 sm:top-5"
            >
              <X size={26} />
            </button>
            <span className="absolute right-16 top-5 z-20 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium tabular-nums text-white sm:right-20">
              {activeImageIndex + 1} / {imageUrls.length}
            </span>
            <div
              className="relative flex min-h-0 w-full max-w-7xl flex-1 items-center justify-center"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => {
                swipeStartX.current = event.clientX;
              }}
              onPointerUp={(event) => handleGallerySwipeEnd(event.clientX)}
              onPointerCancel={() => {
                swipeStartX.current = null;
              }}
            >
              {hasMultipleImages && (
                <button
                  type="button"
                  aria-label="Previous vehicle image"
                  onClick={showPreviousImage}
                  className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:-left-4 sm:h-12 sm:w-12"
                >
                  <ChevronLeft size={26} aria-hidden="true" />
                </button>
              )}
            <img
              src={imageUrls[activeImageIndex]}
              alt={vehicle.title}
              onError={(event) => {
                if (!event.currentTarget.dataset.fallbackApplied) {
                  event.currentTarget.dataset.fallbackApplied = "true";
                  event.currentTarget.src = placeholder;
                }
              }}
              className="max-h-full max-w-[calc(100%-5.5rem)] select-none object-contain sm:max-w-[calc(100%-8rem)]"
              draggable={false}
            />
              {hasMultipleImages && (
                <button
                  type="button"
                  aria-label="Next vehicle image"
                  onClick={showNextImage}
                  className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:-right-4 sm:h-12 sm:w-12"
                >
                  <ChevronRight size={26} aria-hidden="true" />
                </button>
              )}
            </div>
            {hasMultipleImages && (
              <div
                className="mt-3 flex max-w-full gap-2 overflow-x-auto px-1 pb-1 sm:mt-4 sm:gap-3"
                onClick={(event) => event.stopPropagation()}
                aria-label="Vehicle image thumbnails"
              >
                {imageUrls.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    aria-label={`Show image ${index + 1}`}
                    aria-current={activeImageIndex === index ? "true" : undefined}
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border bg-[#171b22] transition sm:h-16 sm:w-24 ${
                      activeImageIndex === index
                        ? "border-[#d6b66b] ring-2 ring-[#d6b66b]/50"
                        : "border-white/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-contain p-1"
                      onError={(event) => {
                        if (!event.currentTarget.dataset.fallbackApplied) {
                          event.currentTarget.dataset.fallbackApplied = "true";
                          event.currentTarget.src = placeholder;
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body
        )}

      {/* ---------- Body ---------- */}
      <div className={`flex flex-1 flex-col ${compact ? "p-4 sm:p-[18px]" : "p-5"}`}>
        <div className="flex items-center gap-3">
          <p
            className={`truncate uppercase ${
              compact
                ? "text-[9px] font-semibold tracking-[0.17em] text-[#8a7654]"
                : "text-[11px] font-bold tracking-[0.2em] text-[#8a6f3a]"
            }`}
          >
            {getVehicleCategoryLabel(vehicle)}
          </p>
          <span
            className={`h-px shrink-0 bg-[#c9a24b] ${
              compact ? "w-5" : "w-6"
            }`}
            aria-hidden="true"
          />
        </div>

        <h3
          className={`line-clamp-1 font-serif ${
            compact
              ? "mt-1.5 text-[1.05rem] font-semibold leading-snug text-[#14243b]"
              : "mt-2 text-[1.35rem] font-bold text-[#0b1a33]"
          }`}
        >
          {vehicle.title}
        </h3>
        <p
          className={`mt-1 line-clamp-1 ${
            compact
              ? "min-h-[1.1rem] text-xs text-[#737d89]"
              : "min-h-[1.25rem] text-sm text-[#7a8493]"
          }`}
        >
          {tagline}
        </p>

        {/* Specs: two columns with a vertical divider */}
        <div
          className={`grid grid-cols-2 border-y ${
            compact
              ? "mt-3 border-[#eeece6] py-2.5"
              : "mt-4 border-[#ece6d6] py-3.5"
          }`}
        >
          <ul className={`min-w-0 ${compact ? "space-y-2" : "space-y-3"} pr-3`}>
            <Spec
              icon={Gauge}
              value={formatKilometers(vehicle.kilometers)}
              compact={compact}
            />
            <Spec
              icon={Settings2}
              value={vehicle.transmission}
              compact={compact}
            />
          </ul>
          <ul
            className={`min-w-0 border-l ${
              compact
                ? "space-y-2 border-[#eeece6] pl-3"
                : "space-y-3 border-[#ece6d6] pl-4"
            }`}
          >
            <Spec icon={Fuel} value={vehicle.fuelType} compact={compact} />
            <Spec icon={MapPin} value={vehicle.location} compact={compact} />
          </ul>
        </div>

        {/* Price + CTA pinned to the bottom so every card aligns */}
        <div
          className={`mt-auto flex items-end justify-between gap-2 ${
            compact ? "pt-3" : "flex-wrap gap-x-3 gap-y-3 pt-4"
          }`}
        >
          <div className="shrink-0">
            <p
              className={`whitespace-nowrap uppercase ${
                compact
                  ? "text-[9px] font-semibold tracking-[0.15em] text-[#8b8375]"
                  : "text-[10px] font-bold tracking-[0.18em] text-[#8f8672]"
              }`}
            >
              Asking price
            </p>
            <p
              title={formatFullPrice(vehicle.price)}
              className={`mt-1 whitespace-nowrap font-serif leading-none tracking-tight ${
                compact
                  ? "text-lg font-semibold text-[#a77f39] sm:text-xl"
                  : "text-2xl font-bold text-[#b8903f]"
              }`}
            >
              {formatPrice(vehicle.price)}
            </p>
          </div>

          <Link
            to={`/vehicles/${vehicle._id}`}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b] active:scale-[0.98] ${
              compact
                ? "h-9 gap-1.5 border border-[#e8e3d9] bg-white px-2.5 text-[11px] font-semibold text-[#23334b] hover:border-[#c9b98f] hover:bg-[#fcfaf5]"
                : "h-11 grow basis-[9rem] rounded-lg bg-[#0b1a33] px-4 text-sm font-bold text-[#fffdf7] shadow-[0_10px_20px_-10px_rgba(11,26,51,0.8)] hover:bg-[#13294d]"
            }`}
          >
            View Details
            <ArrowRight
              size={compact ? 13 : 15}
              className={`transition group-hover:translate-x-0.5 ${
                compact ? "text-[#a77f39]" : "text-[#e3be6a]"
              }`}
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
  compact = false,
}: {
  icon: LucideIcon;
  value: string;
  compact?: boolean;
}) => (
  <li
    className={`flex min-w-0 items-center ${
      compact
        ? "gap-2 text-[11px] text-[#505b69]"
        : "gap-3 text-sm text-[#3f4a5c]"
    }`}
  >
    <Icon
      size={compact ? 14 : 17}
      strokeWidth={1.7}
      className={`shrink-0 ${
        compact ? "text-[#9a8259]" : "text-[#a27e3d]"
      }`}
      aria-hidden="true"
    />
    <span className="truncate">{value}</span>
  </li>
);

export default PublicVehicleCard;