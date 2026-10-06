import { useCallback, useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Fuel,
  Gauge,
  MapPin,
  Settings2,
  ShieldCheck,
  Truck,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { fallbackVehicles } from "../data/vehicleFallback";

import {
  getVehicleCategoryLabel,
  type Vehicle,
  type VehicleStatus,
} from "../types/vehicle";

interface VehicleResponse {
  success: boolean;
  message?: string;
  vehicle: Vehicle;
}

const API_URL = "http://localhost:5000/api/vehicles";

const marketFont = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

.public-detail-sans {
  font-family: 'Manrope', system-ui, sans-serif;
}

.public-detail-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

.public-detail-noscroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.public-detail-noscroll::-webkit-scrollbar {
  display: none;
}
`;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const cardShadow =
  "shadow-[0_14px_44px_-30px_rgba(9,19,36,0.38)]";

const statusStyles: Record<VehicleStatus, string> = {
  Available:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  Reserved:
    "border-sky-200 bg-sky-50 text-sky-700",
  Sold:
    "border-slate-200 bg-slate-100 text-slate-600",
};

const statusDots: Record<VehicleStatus, string> = {
  Available: "bg-emerald-500",
  Reserved: "bg-sky-500",
  Sold: "bg-slate-400",
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const PublicVehicleDetails = () => {
  const { vehicleId } = useParams();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState("");

  const loadVehicle = useCallback(async () => {
    if (!vehicleId) {
      setError("The vehicle could not be identified.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${vehicleId}`, {
        cache: "no-store",
      });

      const data = (await response.json()) as VehicleResponse;

      if (!response.ok || !data.success || !data.vehicle) {
        throw new Error(
          data.message || "Unable to load vehicle details."
        );
      }

      setVehicle(data.vehicle);
      setUsingFallback(false);
      setError("");
    } catch (loadError) {
      const fallbackVehicle = fallbackVehicles.find(
        (item) => item._id === vehicleId
      );

      if (fallbackVehicle) {
        setVehicle(fallbackVehicle);
        setUsingFallback(true);
        setError("");
      } else {
        console.error(
          "Public vehicle details API error:",
          loadError
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load vehicle details."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    void Promise.resolve().then(loadVehicle);
  }, [loadVehicle]);

  const statusKey: VehicleStatus =
    vehicle && vehicle.status in statusStyles
      ? vehicle.status
      : "Available";

  return (
    <main className="public-detail-sans min-h-screen overflow-x-hidden bg-[#fbfaf7] pb-16 pt-24 text-[#101827] sm:pt-28">
      <style>{marketFont}</style>

      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">

        {/* ========================================================== */}
        {/* BACK TO INVENTORY                                           */}
        {/* ========================================================== */}

        <div className="pt-2">
          <Link
            to="/vehicles"
            className="
              inline-flex
              min-h-10
              items-center
              gap-2
              rounded-full
              border
              border-[#e5dfd3]
              bg-white
              px-4
              text-sm
              font-semibold
              text-[#394455]
              shadow-sm
              transition
              hover:border-[#c9a24b]
              hover:text-[#8b6722]
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#c9a24b]
            "
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to inventory
          </Link>
        </div>

        {/* ========================================================== */}
        {/* FALLBACK NOTICE                                             */}
        {/* ========================================================== */}

        {usingFallback && !loading && vehicle && (
          <div
            role="status"
            className="
              mt-4
              flex
              items-start
              gap-2.5
              rounded-xl
              border
              border-[#eadfbe]
              bg-[#fbf6e9]
              px-4
              py-3
              text-sm
              text-[#71571f]
            "
          >
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />

            <p>
              Showing a sample vehicle while live inventory is
              unavailable.
            </p>
          </div>
        )}

        {/* ========================================================== */}
        {/* LOADING                                                     */}
        {/* ========================================================== */}

        {loading ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-4">
              <div className="aspect-[4/3] animate-pulse rounded-3xl bg-[#eee9dd]" />

              <div className="flex gap-3">
                <div className="h-20 w-24 animate-pulse rounded-xl bg-[#eee9dd]" />
                <div className="h-20 w-24 animate-pulse rounded-xl bg-[#eee9dd]" />
              </div>

              <div className="h-6 w-40 animate-pulse rounded-lg bg-[#eee9dd]" />

              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-[#eee9dd]" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-[#eee9dd]" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-[#eee9dd]" />
              </div>
            </div>

            <div className="h-[620px] animate-pulse rounded-3xl bg-[#eee9dd]" />
          </div>
        ) : error || !vehicle ? (

          /* ======================================================== */
          /* ERROR                                                    */
          /* ======================================================== */

          <section
            className={`
              mx-auto
              mt-8
              max-w-2xl
              rounded-3xl
              border
              border-[#ece6d8]
              bg-white
              px-6
              py-14
              text-center
              ${cardShadow}
            `}
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fbf0eb] text-[#b44a32]">
              <AlertCircle size={26} aria-hidden="true" />
            </span>

            <h1 className="public-detail-serif mt-5 text-2xl font-semibold text-[#101827]">
              Vehicle details unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#77808b]">
              {error || "This vehicle may no longer be listed."}
            </p>

            <Link
              to="/vehicles"
              className="
                mt-6
                inline-flex
                h-12
                items-center
                justify-center
                rounded-xl
                bg-[#0b1a33]
                px-6
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#152847]
              "
            >
              Browse vehicles
            </Link>
          </section>

        ) : (

          /* ======================================================== */
          /* VEHICLE DETAILS                                          */
          /* ======================================================== */

          <div className="mt-5 grid items-start gap-6 sm:mt-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-7">

            {/* ====================================================== */}
            {/* LEFT COLUMN                                             */}
            {/* ====================================================== */}

            <div className="min-w-0">

              {/* ---------------- GALLERY ---------------- */}

              <Gallery
                key={vehicle._id}
                title={vehicle.title}
                images={vehicle.images ?? []}
                status={vehicle.status}
                statusKey={statusKey}
                isBestSeller={Boolean(vehicle.isBestSeller)}
                year={vehicle.year}
              />

              {/* ---------------- OVERVIEW ---------------- */}

              {vehicle.description && (
                <section className="mt-7 sm:mt-8">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-[2px] w-7 bg-[#c9a24b]" />

                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a27b30]">
                      Vehicle Overview
                    </span>
                  </div>

                  <h2 className="public-detail-serif text-2xl font-semibold text-[#0b1a33] sm:text-3xl">
                    Overview
                  </h2>

                  <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#66717f] sm:text-[15px]">
                    {vehicle.description}
                  </p>
                </section>
              )}

              {/* ---------------- TRUST STRIP ---------------- */}

              <div
                className="
                  mt-7
                  grid
                  grid-cols-1
                  gap-3
                  sm:mt-8
                  sm:grid-cols-3
                "
              >
                <TrustItem
                  icon={ShieldCheck}
                  title="Verified Listing"
                  text="Vehicle details checked"
                />

                <TrustItem
                  icon={CheckCircle2}
                  title="Transparent Details"
                  text="Clear vehicle information"
                />

                <TrustItem
                  icon={Truck}
                  title="Ready to Discuss"
                  text="Connect with our team"
                />
              </div>
            </div>

            {/* ====================================================== */}
            {/* RIGHT COLUMN                                            */}
            {/* ====================================================== */}

            <section
              className={`
                min-w-0
                rounded-3xl
                border
                border-[#e6e0d6]
                bg-white
                p-5
                sm:p-7
                lg:sticky
                lg:top-28
                ${cardShadow}
              `}
            >

              {/* Category + Best Seller */}

              <div className="flex flex-wrap items-center gap-2">
                <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#a27b30] sm:text-[11px]">
                  <span className="h-px w-5 bg-[#c9a24b]" />
                  {vehicle.brand}
                </p>

                <span className="text-[#c9c1b3]">•</span>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7d8792] sm:text-[11px]">
                  {getVehicleCategoryLabel(vehicle)}
                </p>

                {vehicle.isBestSeller && (
                  <>
                    <span className="text-[#c9c1b3]">•</span>

                    <span className="rounded-full bg-[#d94d0b] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white">
                      Best Seller
                    </span>
                  </>
                )}
              </div>

              {/* Title */}

              <h1 className="public-detail-serif mt-3 text-[2rem] font-bold leading-[1.08] text-[#0b1a33] sm:text-[2.45rem]">
                {vehicle.title}
              </h1>

              <p className="mt-2 text-sm font-medium text-[#727b87] sm:text-base">
                {vehicle.brand}
                <span className="mx-1.5 text-[#c9a24b]">•</span>
                {vehicle.model}
              </p>

              {/* Location + Status */}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#717b88]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin
                    size={14}
                    className="text-[#c84b0a]"
                    aria-hidden="true"
                  />
                  {vehicle.location}
                </span>

                <span className="h-1 w-1 rounded-full bg-[#c9c1b3]" />

                <span
                  className={`
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    px-2.5
                    py-1
                    font-bold
                    ${statusStyles[statusKey]}
                  `}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusDots[statusKey]}`}
                  />

                  {vehicle.status}
                </span>
              </div>

              {/* ==================================================== */}
              {/* PRICE                                                 */}
              {/* ==================================================== */}

              <div className="mt-6 border-b border-[#eee9df] pb-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8b939d]">
                  Asking Price
                </p>

                <div className="mt-1 flex flex-wrap items-end gap-2">
                  <p className="public-detail-serif text-[2rem] font-bold leading-none text-[#c84b0a] sm:text-[2.35rem]">
                    {formatPrice(vehicle.price)}
                  </p>

                  <span className="pb-0.5 text-xs font-medium text-[#7d8792]">
                    on-road
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#7a8490]">
                  Final price and transfer details can be discussed
                  with our team.
                </p>
              </div>

              {/* ==================================================== */}
              {/* SPECS                                                  */}
              {/* ==================================================== */}

              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-[#172235]">
                    Vehicle Details
                  </h2>

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a8354]">
                    Key Specs
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <Detail
                    icon={CalendarDays}
                    label="Year"
                    value={String(vehicle.year)}
                  />

                  <Detail
                    icon={Gauge}
                    label="Kilometers"
                    value={`${vehicle.kilometers.toLocaleString(
                      "en-IN"
                    )} km`}
                  />

                  <Detail
                    icon={Fuel}
                    label="Fuel Type"
                    value={vehicle.fuelType}
                  />

                  <Detail
                    icon={Settings2}
                    label="Transmission"
                    value={vehicle.transmission}
                  />

                  <Detail
                    icon={MapPin}
                    label="Location"
                    value={vehicle.location}
                  />

                  <Detail
                    icon={CheckCircle2}
                    label="Availability"
                    value={vehicle.status}
                  />
                </div>
              </div>

              {/* ==================================================== */}
              {/* ABOUT                                                   */}
              {/* ==================================================== */}

              {vehicle.description && (
                <div className="mt-6 border-t border-[#eeeae2] pt-5">
                  <h2 className="text-sm font-extrabold text-[#172235]">
                    About this vehicle
                  </h2>

                  <p className="mt-2 line-clamp-4 whitespace-pre-line text-sm leading-6 text-[#6f7884]">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* ==================================================== */}
              {/* TRUST MESSAGE                                           */}
              {/* ==================================================== */}

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#efe4c6] bg-[#fbf6e9] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#a47b2c] shadow-sm ring-1 ring-[#eadfbe]">
                  <ShieldCheck
                    size={18}
                    aria-hidden="true"
                  />
                </span>

                <p className="pt-0.5 text-xs leading-5 text-[#69717b]">
                  Our team can help you with vehicle details,
                  pricing and the next steps for your purchase.
                </p>
              </div>

              {/* ==================================================== */}
              {/* EXISTING ACTION                                        */}
              {/* ==================================================== */}

              <Link
                to="/vehicles"
                className="
                  mt-5
                  flex
                  h-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#0b1a33]
                  px-5
                  text-sm
                  font-bold
                  text-[#fffdf7]
                  shadow-[0_10px_22px_-12px_rgba(11,26,51,0.8)]
                  ring-1
                  ring-[#c9a24b]/40
                  transition
                  hover:bg-[#152847]
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#c9a24b]
                  focus-visible:ring-offset-2
                "
              >
                Browse other vehicles
              </Link>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

/* ------------------------------------------------------------------ */
/* Gallery                                                            */
/* ------------------------------------------------------------------ */

interface GalleryProps {
  title: string;
  images: { url: string; publicId?: string }[];
  status: string;
  statusKey: VehicleStatus;
  isBestSeller?: boolean;
  year?: number;
}

const Gallery = ({
  title,
  images,
  status,
  statusKey,
  isBestSeller,
  year,
}: GalleryProps) => {
  const [active, setActive] = useState(0);

  const current = images[active]?.url;

  return (
    <section
      className={`
        overflow-hidden
        rounded-3xl
        border
        border-[#e6e0d6]
        bg-white
        ${cardShadow}
      `}
    >
      {/* ============================================================ */}
      {/* MAIN IMAGE                                                   */}
      {/* ============================================================ */}

      <div className="relative aspect-[4/3] overflow-hidden bg-[#f1eee7] sm:aspect-[16/10] lg:aspect-[4/3]">
        {current ? (
          <img
            src={current}
            alt={
              active === 0
                ? title
                : `${title} photo ${active + 1}`
            }
            className="
              h-full
              w-full
              object-cover
              transition-opacity
              duration-300
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#ba984f]">
            <Truck
              size={60}
              strokeWidth={1.3}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Image Overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-28
            bg-gradient-to-b
            from-black/35
            via-black/10
            to-transparent
          "
          aria-hidden="true"
        />

        {/* ========================================================== */}
        {/* TOP BADGES                                                 */}
        {/* ========================================================== */}

        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          {isBestSeller && (
            <span className="rounded-full bg-[#d94d0b] px-3 py-1.5 text-[10px] font-extrabold text-white shadow-sm">
              Best Seller
            </span>
          )}

          {year && (
            <span className="rounded-full border border-white/20 bg-[#0b1a33]/80 px-3 py-1.5 text-[10px] font-extrabold text-white backdrop-blur-sm">
              {year}
            </span>
          )}
        </div>

        {/* Status */}

        <span
          className={`
            absolute
            right-4
            top-4
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            px-3
            py-1.5
            text-[10px]
            font-bold
            shadow-sm
            backdrop-blur-sm
            ${statusStyles[statusKey]}
          `}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${statusDots[statusKey]}`}
          />

          {status}
        </span>

        {/* Image Counter */}

        {images.length > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-[#0b1a33]/85 px-3 py-1.5 text-[10px] font-bold text-[#f0d28a] backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>
        )}
      </div>

      {/* ============================================================ */}
      {/* THUMBNAILS                                                   */}
      {/* ============================================================ */}

      {images.length > 1 && (
        <div className="public-detail-noscroll flex snap-x gap-3 overflow-x-auto p-3 sm:p-4">
          {images.map((image, index) => (
            <button
              key={`${image.publicId ?? "image"}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === active}
              className={`
                relative
                aspect-[4/3]
                w-20
                shrink-0
                snap-start
                overflow-hidden
                rounded-xl
                bg-[#f3f1eb]
                transition
                sm:w-24
                ${
                  index === active
                    ? "ring-2 ring-[#c9a24b] ring-offset-2"
                    : "opacity-70 ring-1 ring-[#e9e4da] hover:opacity-100"
                }
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#c9a24b]
              `}
            >
              <img
                src={image.url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Spec tile                                                          */
/* ------------------------------------------------------------------ */

interface DetailProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const Detail = ({
  icon: Icon,
  label,
  value,
}: DetailProps) => (
  <div
    className="
      flex
      min-w-0
      items-center
      gap-2.5
      rounded-2xl
      border
      border-[#eee8dc]
      bg-[#fdfbf6]
      p-3
      transition
      hover:border-[#dfcda4]
      hover:bg-[#fffdf8]
    "
  >
    <span
      className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-[#f8ecc9]
        text-[#0b1a33]
        sm:h-10
        sm:w-10
      "
    >
      <Icon
        size={17}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </span>

    <span className="min-w-0">
      <span className="block text-[10px] font-medium text-[#90959d] sm:text-[11px]">
        {label}
      </span>

      <span className="block truncate text-xs font-bold text-[#283346] sm:text-sm">
        {value}
      </span>
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/* Trust item                                                         */
/* ------------------------------------------------------------------ */

interface TrustItemProps {
  icon: LucideIcon;
  title: string;
  text: string;
}

const TrustItem = ({
  icon: Icon,
  title,
  text,
}: TrustItemProps) => (
  <div
    className="
      flex
      items-center
      gap-3
      rounded-2xl
      border
      border-[#e9e3d8]
      bg-white
      px-4
      py-3.5
      shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)]
    "
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f8ecc9] text-[#9a752e]">
      <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
    </span>

    <span className="min-w-0">
      <span className="block text-xs font-extrabold text-[#172235]">
        {title}
      </span>

      <span className="mt-0.5 block text-[10px] leading-4 text-[#7d8792]">
        {text}
      </span>
    </span>
  </div>
);

export default PublicVehicleDetails;