import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  Truck,
  X,
} from "lucide-react";

import { useSearchParams } from "react-router-dom";

import { fallbackVehicles } from "../data/vehicleFallback";
import heroImage from "../assets/admindashboard/bg1.png";

import PublicVehicleCard from "../components/vehicles/PublicVehicleCard";

import {
  fetchBrands,
  fetchCategories,
} from "../services/categoryBrandApi";

import type {
  Brand,
  Category,
  VehicleCategoryType,
} from "../types/categoryBrand";

import {
  getVehicleCategoryType,
  type Vehicle,
} from "../types/vehicle";

const API_URL = "http://localhost:5000/api/vehicles";

/* ================================================================ */
/* PRICE RANGES                                                     */
/* ================================================================ */

const priceRanges = [
  {
    value: "",
    label: "Any price",
  },
  {
    value: "0-1000000",
    label: "Under ₹10 lakh",
  },
  {
    value: "1000000-2500000",
    label: "₹10–25 lakh",
  },
  {
    value: "2500000-5000000",
    label: "₹25–50 lakh",
  },
  {
    value: "5000000-",
    label: "Over ₹50 lakh",
  },
];

/* ================================================================ */
/* SORT OPTIONS                                                      */
/* ================================================================ */

const sortOptions = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "year-newest",
    label: "Year: Newest",
  },
  {
    value: "kilometers-low",
    label: "Kilometers: Low to High",
  },
] as const;

type SortOption =
  (typeof sortOptions)[number]["value"];

/* ================================================================ */
/* API RESPONSE                                                      */
/* ================================================================ */

interface VehiclesResponse {
  success: boolean;
  message?: string;
  vehicles: Vehicle[];
}

/* ================================================================ */
/* FILTER CHIP                                                       */
/* ================================================================ */

interface Chip {
  key: string;
  label: string;
  clear: () => void;
}

/* ================================================================ */
/* FONTS + ANIMATIONS                                                */
/* ================================================================ */

const fontCss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

.market-sans {
  font-family: 'Manrope', system-ui, sans-serif;
}

.market-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

@keyframes market-rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes market-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.market-rise {
  animation: market-rise 0.7s cubic-bezier(.2,.7,.2,1) both;
}

.market-fade {
  animation: market-fade 0.5s ease both;
}

@media (prefers-reduced-motion: reduce) {
  .market-rise,
  .market-fade {
    animation: none !important;
  }
}
`;

/* ================================================================ */
/* CATEGORY FROM QUERY                                               */
/* ================================================================ */

const categoryFromQuery = (
  query: string | null
): VehicleCategoryType | "" => {
  if (!query) {
    return "";
  }

  return getVehicleCategoryType({
    category: query,
  }) || "";
};

/* ================================================================ */
/* PAGE                                                              */
/* ================================================================ */

const PublicVehicles = () => {
  const [searchParams] = useSearchParams();

  /* ============================================================ */
  /* STATE                                                         */
  /* ============================================================ */

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [brands, setBrands] =
    useState<Brand[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingBrands, setLoadingBrands] =
    useState(false);

  const [categoryBrandError, setCategoryBrandError] =
    useState("");

  const [usingFallback, setUsingFallback] =
    useState(false);

  const [search, setSearch] = useState(
    () => searchParams.get("search") ?? ""
  );

  const [category, setCategory] =
    useState<VehicleCategoryType | "">(
      () =>
        categoryFromQuery(
          searchParams.get("category")
        )
    );

  const [commercialBrand, setCommercialBrand] =
    useState("");

  const [carBrand, setCarBrand] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [fuelType, setFuelType] =
    useState("");

  const [transmission, setTransmission] =
    useState("");

  const [priceRange, setPriceRange] =
    useState("");

  const [sort, setSort] =
    useState<SortOption>("newest");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  /* ============================================================ */
  /* LOAD VEHICLES                                                  */
  /* ============================================================ */

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        const data =
          (await response.json()) as VehiclesResponse;

        if (
          !response.ok ||
          !data.success ||
          !Array.isArray(data.vehicles)
        ) {
          throw new Error(
            data.message ||
              "Unable to load vehicle inventory."
          );
        }

        setVehicles(data.vehicles);
        setUsingFallback(false);
      } catch (error) {
        console.error(
          "Public vehicle inventory API error:",
          error
        );

        setVehicles(fallbackVehicles);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    void Promise.resolve().then(loadVehicles);
  }, []);

  /* ============================================================ */
  /* LOAD CATEGORIES                                                */
  /* ============================================================ */

  useEffect(() => {
    let isMounted = true;

    fetchCategories()
      .then((result) => {
        if (isMounted) {
          setCategories(result);
        }
      })
      .catch((error: unknown) => {
        console.error(
          "Public categories API error:",
          error
        );

        if (isMounted) {
          setCategoryBrandError(
            error instanceof Error
              ? error.message
              : "Unable to load categories."
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /* ============================================================ */
  /* LOAD BRANDS                                                   */
  /* ============================================================ */

  const commercialBrandOptions = useMemo(
    () =>
      [
        ...new Set(
          brands
            .filter(
              (brandItem) =>
                brandItem.categoryType === "commercial"
            )
            .map((brandItem) => brandItem.name)
        ),
      ].sort((first, second) =>
        first.localeCompare(second)
      ),
    [brands]
  );

  const carBrandOptions = useMemo(
    () =>
      [
        ...new Set(
          brands
            .filter(
              (brandItem) =>
                brandItem.categoryType === "car" ||
                brandItem.categoryType === "cars"
            )
            .map((brandItem) => brandItem.name)
        ),
      ].sort((first, second) =>
        first.localeCompare(second)
      ),
    [brands]
  );

  useEffect(() => {
    let isMounted = true;

    void Promise.resolve().then(async () => {
      if (!isMounted) {
        return;
      }

      setLoadingBrands(true);

      try {
        const result = await fetchBrands();

        if (isMounted) {
          setBrands(result);
          setCategoryBrandError("");
        }
      } catch (error) {
        console.error(
          "Public brands API error:",
          error
        );

        if (isMounted) {
          setBrands([]);

          setCategoryBrandError(
            error instanceof Error
              ? error.message
              : "Unable to load brands."
          );
        }
      } finally {
        if (isMounted) {
          setLoadingBrands(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      commercialBrand &&
      !commercialBrandOptions.includes(commercialBrand)
    ) {
      setCommercialBrand("");
    }
  }, [commercialBrand, commercialBrandOptions]);

  useEffect(() => {
    if (carBrand && !carBrandOptions.includes(carBrand)) {
      setCarBrand("");
    }
  }, [carBrand, carBrandOptions]);

  useEffect(() => {
    if (category === "commercial") {
      setCarBrand("");
    }

    if (category === "cars") {
      setCommercialBrand("");
    }
  }, [category]);

  /* ============================================================ */
  /* LOCATIONS                                                      */
  /* ============================================================ */

  const locations = useMemo(
    () =>
      [
        ...new Set(
          vehicles
            .map(
              (vehicle) =>
                vehicle.location
            )
            .filter(Boolean)
        ),
      ].sort((first, second) =>
        first.localeCompare(second)
      ),
    [vehicles]
  );

  /* ============================================================ */
  /* FILTERED VEHICLES                                              */
  /* ============================================================ */

  const filteredVehicles = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    const [
      minimumPrice,
      maximumPrice,
    ] = priceRange
      ? priceRange
          .split("-")
          .map((value) =>
            value ? Number(value) : null
          )
      : [null, null];

    const result = vehicles.filter(
      (vehicle) => {
        const searchMatches =
          !query ||
          [
            vehicle.title,
            vehicle.brand,
            vehicle.model,
            vehicle.category,
            vehicle.location,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);

        const categoryMatches =
          !category ||
          getVehicleCategoryType(vehicle) ===
            category;

        return (
          searchMatches &&
          categoryMatches &&
          (!commercialBrand ||
            vehicle.brand === commercialBrand) &&
          (!carBrand ||
            vehicle.brand === carBrand) &&
          (!location ||
            vehicle.location === location) &&
          (!fuelType ||
            vehicle.fuelType === fuelType) &&
          (!transmission ||
            vehicle.transmission ===
              transmission) &&
          (minimumPrice === null ||
            vehicle.price >= minimumPrice) &&
          (maximumPrice === null ||
            vehicle.price <= maximumPrice)
        );
      }
    );

    return result.sort(
      (first, second) => {
        switch (sort) {
          case "price-low":
            return first.price - second.price;

          case "price-high":
            return second.price - first.price;

          case "year-newest":
            return second.year - first.year;

          case "kilometers-low":
            return (
              first.kilometers -
              second.kilometers
            );

          case "newest":
            return (
              new Date(
                second.createdAt
              ).getTime() -
              new Date(
                first.createdAt
              ).getTime()
            );

          default:
            return 0;
        }
      }
    );
  }, [
    carBrand,
    category,
    commercialBrand,
    fuelType,
    location,
    priceRange,
    search,
    sort,
    transmission,
    vehicles,
  ]);

  /* ============================================================ */
  /* CLEAR FILTERS                                                  */
  /* ============================================================ */

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setCommercialBrand("");
    setCarBrand("");
    setLocation("");
    setFuelType("");
    setTransmission("");
    setPriceRange("");
  };

  /* ============================================================ */
  /* HAS FILTERS                                                    */
  /* ============================================================ */

  const hasFilters = Boolean(
    search.trim() ||
      category ||
      commercialBrand ||
      carBrand ||
      location ||
      fuelType ||
      transmission ||
      priceRange
  );

  /* ============================================================ */
  /* FILTER COUNT                                                    */
  /* ============================================================ */

  const filterCount = [
    category,
    commercialBrand,
    carBrand,
    location,
    fuelType,
    transmission,
    priceRange,
  ].filter(Boolean).length;

  /* ============================================================ */
  /* ACTIVE CHIPS                                                    */
  /* ============================================================ */

  const chips: Chip[] = [
    search.trim()
      ? {
          key: "search",
          label: `“${search.trim()}”`,
          clear: () => setSearch(""),
        }
      : null,

    category
      ? {
          key: "category",
          label:
            categories.find(
              (item) =>
                item.type === category
            )?.name ?? category,
          clear: () => {
            setCategory("");
          },
        }
      : null,

    commercialBrand
      ? {
          key: "commercial-brand",
          label: `Commercial Vehicles: ${commercialBrand}`,
          clear: () => setCommercialBrand(""),
        }
      : null,

    carBrand
      ? {
          key: "car-brand",
          label: `Cars: ${carBrand}`,
          clear: () => setCarBrand(""),
        }
      : null,

    location
      ? {
          key: "location",
          label: location,
          clear: () =>
            setLocation(""),
        }
      : null,

    fuelType
      ? {
          key: "fuel",
          label: fuelType,
          clear: () =>
            setFuelType(""),
        }
      : null,

    transmission
      ? {
          key: "transmission",
          label: transmission,
          clear: () =>
            setTransmission(""),
        }
      : null,

    priceRange
      ? {
          key: "price",
          label:
            priceRanges.find(
              (item) =>
                item.value === priceRange
            )?.label ?? "Price",
          clear: () =>
            setPriceRange(""),
        }
      : null,
  ].filter(
    (chip): chip is Chip =>
      chip !== null
  );

  /* ============================================================ */
  /* RETURN                                                          */
  /* ============================================================ */

  return (
    <main className="market-sans min-h-screen overflow-x-hidden bg-[#fbfaf7] pb-16 text-[#101827]">
      <style>{fontCss}</style>

      {/* ======================================================== */}
      {/* HERO                                                     */}
      {/* ======================================================== */}

      <section className="relative isolate flex min-h-[320px] items-center overflow-hidden bg-[#071326] pt-20 sm:min-h-[360px]">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="
            absolute
            inset-y-0
            right-0
            -z-20
            h-full
            w-full
            object-cover
            object-center
            opacity-30
            sm:w-[72%]
            sm:opacity-45
          "
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071326] via-[#071326]/92 to-[#071326]/35" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071326] via-transparent to-transparent sm:hidden" />

        <div className="absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-[#060d1a]/70 to-transparent" />

        <div className="absolute -left-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-[#c9a24b]/15 blur-[110px]" />

        <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 lg:px-12">
          <div className="market-rise max-w-3xl">
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.14em] text-[#e4be69] sm:text-sm">
              <span className="h-px w-8 bg-[#c9a24b]" />

              Jai Janardan Auto marketplace
            </p>

            <h1 className="market-serif mt-4 text-[2rem] font-semibold leading-[1.12] text-[#fffdf7] sm:text-4xl lg:text-5xl">
              Find the Right Vehicle
              <br className="hidden sm:block" />{" "}
              <span className="italic text-[#e4be69]">
                for Your Business
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#f5efe0]/75 sm:text-base sm:leading-7">
              Explore quality used commercial
              vehicles from trusted sellers.
              Find the right vehicle for your
              next journey.
            </p>

            {!loading &&
              vehicles.length > 0 && (
                <div className="market-fade mt-6 flex flex-wrap gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md">
                    <Truck
                      size={14}
                      className="text-[#e4be69]"
                    />

                    {vehicles.length}{" "}
                    {vehicles.length === 1
                      ? "vehicle"
                      : "vehicles"}{" "}
                    listed
                  </span>

                  {locations.length > 0 && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md">
                      <MapPin
                        size={14}
                        className="text-[#e4be69]"
                      />

                      {locations.length}{" "}
                      {locations.length === 1
                        ? "location"
                        : "locations"}
                    </span>
                  )}
                </div>
              )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* MAIN CONTENT                                              */}
      {/* ======================================================== */}

      <div className="relative z-10 mx-auto -mt-10 w-full max-w-7xl px-4 sm:px-7 lg:px-10">

        {/* ====================================================== */}
        {/* FILTER PANEL                                            */}
        {/* ====================================================== */}

        <section
          className="
            market-rise
            rounded-3xl
            border
            border-[#ece6d8]
            bg-white
            p-4
            shadow-[0_24px_60px_-32px_rgba(9,19,36,0.4)]
            sm:p-6
            lg:p-7
          "
          style={{
            animationDelay: ".1s",
          }}
        >
          {/* Filter Header */}

          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f1e3] text-[#aa8031]">
                <SlidersHorizontal size={18} />
              </span>

              <div>
                <h2 className="text-base font-bold text-[#101827] sm:text-lg">
                  Find your vehicle
                </h2>

                <p className="hidden text-xs text-[#7c8490] sm:block">
                  Refine the inventory to match
                  your needs.
                </p>
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  inline-flex
                  min-h-10
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-lg
                  px-2.5
                  text-xs
                  font-semibold
                  text-[#8b6722]
                  transition
                  hover:bg-[#faf6eb]
                  sm:text-sm
                "
              >
                <X size={15} />
                Clear Filters
              </button>
            )}
          </div>

          {/* Search */}

          <div className="flex gap-2.5">
            <label className="relative block min-w-0 flex-1">
              <Search
                size={19}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#9b8353]
                "
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by vehicle name, brand or model..."
                aria-label="Search by vehicle name, brand or model"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#e6e1d6]
                  bg-[#fdfcf9]
                  pl-11
                  pr-4
                  text-base
                  text-[#101827]
                  outline-none
                  transition
                  placeholder:text-[#9a9da2]
                  focus:border-[#c9a24b]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#c9a24b]/10
                  sm:h-[54px]
                "
              />
            </label>

            {/* Mobile Filters */}

            <button
              type="button"
              onClick={() =>
                setFiltersOpen(
                  (open) => !open
                )
              }
              aria-expanded={filtersOpen}
              aria-controls="vehicle-filters"
              className={`
                relative
                inline-flex
                h-12
                shrink-0
                items-center
                gap-2
                rounded-xl
                border
                px-4
                text-sm
                font-semibold
                transition
                lg:hidden
                ${
                  filtersOpen
                    ? "border-[#0b1a33] bg-[#0b1a33] text-white"
                    : "border-[#e6e1d6] bg-white text-[#263143] hover:border-[#c9a24b]"
                }
              `}
            >
              <SlidersHorizontal size={17} />

              <span className="hidden min-[400px]:inline">
                Filters
              </span>

              {filterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c9a24b] px-1.5 text-[11px] font-bold text-[#101827]">
                  {filterCount}
                </span>
              )}
            </button>
          </div>

          {/* ==================================================== */}
          {/* FILTER DROPDOWNS                                      */}
          {/* ==================================================== */}

          <div
            id="vehicle-filters"
            className={`
              grid
              transition-[grid-template-rows]
              duration-300
              ease-out
              lg:grid-rows-[1fr]
              ${
                filtersOpen
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
              }
            `}
          >
            <div className="overflow-hidden">
              <div className="grid grid-cols-2 gap-2.5 pb-1 pt-3 sm:grid-cols-3 sm:gap-3 sm:pt-4 lg:grid-cols-7">

                {/* Category */}

                <FilterSelect
                  label="Category"
                  value={category}
                  onChange={(value) => {
                    const nextCategory =
                      value as
                        | VehicleCategoryType
                        | "";

                    setCategory(nextCategory);

                    if (
                      nextCategory === "commercial"
                    ) {
                      setCarBrand("");
                    }

                    if (
                      nextCategory === "cars"
                    ) {
                      setCommercialBrand("");
                    }
                  }}
                  options={[
                    {
                      value: "",
                      label: "All",
                    },

                    ...categories.map(
                      (item) => ({
                        value: item.type,
                        label: item.name,
                      })
                    ),
                  ]}
                />

                <FilterSelect
                  label="Commercial Vehicles"
                  value={commercialBrand}
                  onChange={setCommercialBrand}
                  disabled={loadingBrands}
                  options={[
                    {
                      value: "",
                      label: "All Commercial Vehicles",
                    },
                    ...commercialBrandOptions.map(
                      (item) => ({
                        value: item,
                        label: item,
                      })
                    ),
                  ]}
                />

                <FilterSelect
                  label="Cars"
                  value={carBrand}
                  onChange={setCarBrand}
                  disabled={loadingBrands}
                  options={[
                    {
                      value: "",
                      label: "All Cars",
                    },
                    ...carBrandOptions.map(
                      (item) => ({
                        value: item,
                        label: item,
                      })
                    ),
                  ]}
                />

                {/* Location */}

                <FilterSelect
                  label="Location"
                  value={location}
                  onChange={setLocation}
                  options={[
                    {
                      value: "",
                      label: "All locations",
                    },

                    ...locations.map(
                      (item) => ({
                        value: item,
                        label: item,
                      })
                    ),
                  ]}
                />

                {/* Fuel */}

                <FilterSelect
                  label="Fuel type"
                  value={fuelType}
                  onChange={setFuelType}
                  options={[
                    {
                      value: "",
                      label: "Any fuel",
                    },

                    ...uniqueValues(
                      vehicles.map(
                        (vehicle) =>
                          vehicle.fuelType
                      )
                    ),
                  ]}
                />

                {/* Transmission */}

                <FilterSelect
                  label="Transmission"
                  value={transmission}
                  onChange={setTransmission}
                  options={[
                    {
                      value: "",
                      label:
                        "Any transmission",
                    },

                    ...uniqueValues(
                      vehicles.map(
                        (vehicle) =>
                          vehicle.transmission
                      )
                    ),
                  ]}
                />

                {/* Price */}

                <FilterSelect
                  label="Price range"
                  value={priceRange}
                  onChange={setPriceRange}
                  options={priceRanges}
                />
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* ACTIVE FILTER CHIPS                                    */}
          {/* ==================================================== */}

          {chips.length > 0 && (
            <ul
              className="mt-3 flex flex-wrap gap-2"
              aria-label="Active filters"
            >
              {chips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={chip.clear}
                    aria-label={`Remove filter ${chip.label}`}
                    className="
                      group
                      inline-flex
                      min-h-9
                      max-w-[220px]
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-[#eadfbe]
                      bg-[#fbf6e9]
                      py-1.5
                      pl-3
                      pr-2
                      text-xs
                      font-semibold
                      text-[#71571f]
                      transition
                      hover:border-[#c9a24b]
                      hover:bg-[#f7edd0]
                    "
                  >
                    <span className="truncate">
                      {chip.label}
                    </span>

                    <X
                      size={14}
                      className="
                        shrink-0
                        rounded-full
                        text-[#9b7a2e]
                        transition
                        group-hover:text-[#101827]
                      "
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Category/Brand error */}

          {categoryBrandError && (
            <p
              role="alert"
              className="mt-3 text-xs font-medium text-red-600"
            >
              {categoryBrandError}
            </p>
          )}
        </section>

        {/* ====================================================== */}
        {/* FALLBACK NOTICE                                         */}
        {/* ====================================================== */}

        {usingFallback && (
          <div
            role="status"
            className="
              mt-5
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
            />

            <p>
              Live inventory is temporarily
              unavailable. Showing sample vehicles
              for development.
            </p>
          </div>
        )}

        {/* ====================================================== */}
        {/* RESULTS                                                 */}
        {/* ====================================================== */}

        <section className="mt-9 sm:mt-12">

          {/* Results Header */}

          <div
            className="
              mb-6
              flex
              flex-col
              gap-4
              border-b
              border-[#e9e4da]
              pb-5
              sm:flex-row
              sm:items-end
              sm:justify-between
              sm:gap-6
            "
          >
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h2 className="market-serif text-[1.65rem] font-semibold leading-tight text-[#101827] sm:text-3xl">
                  Available Vehicles
                </h2>

                <span className="rounded-full bg-[#f3efe5] px-3 py-1 text-xs font-semibold text-[#78633b]">
                  {loading
                    ? "Loading..."
                    : `${filteredVehicles.length} ${
                        filteredVehicles.length ===
                        1
                          ? "vehicle"
                          : "vehicles"
                      } found`}
                </span>
              </div>

              <p className="mt-1.5 text-sm text-[#7c8490]">
                Find a reliable vehicle that
                works as hard as you do.
              </p>
            </div>

            {/* Sort */}

            <label className="flex min-h-11 w-full items-center gap-2.5 text-sm sm:w-auto">
              <span className="shrink-0 font-medium text-[#6e7580]">
                Sort by
              </span>

              <span className="relative min-w-0 flex-1 sm:flex-none">
                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(
                      event.target
                        .value as SortOption
                    )
                  }
                  aria-label="Sort vehicles"
                  className="
                    h-11
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-[#e6e1d6]
                    bg-white
                    py-2
                    pl-3.5
                    pr-9
                    text-sm
                    font-semibold
                    text-[#263143]
                    outline-none
                    transition
                    focus:border-[#c9a24b]
                    focus:ring-4
                    focus:ring-[#c9a24b]/10
                    sm:w-[220px]
                  "
                >
                  {sortOptions.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#7c8490]
                  "
                />
              </span>
            </label>
          </div>

          {/* ==================================================== */}
          {/* LOADING                                               */}
          {/* ==================================================== */}

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#ece6d8]
                      bg-white
                    "
                  >
                    <div className="aspect-[4/3] animate-pulse bg-[#f1ede3]" />

                    <div className="space-y-4 p-4 sm:p-5">
                      <div className="h-3.5 w-1/2 animate-pulse rounded bg-[#f1ede3]" />

                      <div className="h-6 w-4/5 animate-pulse rounded bg-[#f1ede3]" />

                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map(
                          (tile) => (
                            <div
                              key={tile}
                              className="h-9 animate-pulse rounded-lg bg-[#f6f2e8]"
                            />
                          )
                        )}
                      </div>

                      <div className="flex items-end justify-between border-t border-dashed border-[#e9e2d0] pt-4">
                        <div className="h-8 w-24 animate-pulse rounded bg-[#f1ede3]" />

                        <div className="h-11 w-32 animate-pulse rounded-xl bg-[#f1ede3]" />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

          ) : filteredVehicles.length === 0 ? (

            /* ================================================== */
            /* NO RESULTS                                         */
            /* ================================================== */

            <div className="
              market-fade
              rounded-3xl
              border
              border-[#ece6d8]
              bg-white
              px-5
              py-14
              text-center
              shadow-[0_10px_35px_-30px_rgba(9,19,36,0.3)]
              sm:py-16
            ">
              <div className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[#f7f1e3]
                text-[#aa8031]
              ">
                <Truck
                  size={30}
                  strokeWidth={1.6}
                />
              </div>

              <h3 className="market-serif mt-5 text-2xl font-semibold text-[#101827]">
                No vehicles found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7c8490]">
                Try adjusting your search or
                filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    mt-6
                    inline-flex
                    h-11
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#0b1a33]
                    px-5
                    text-sm
                    font-semibold
                    text-[#fffdf7]
                    ring-1
                    ring-[#c9a24b]/40
                    transition
                    hover:bg-[#152847]
                  "
                >
                  <X
                    size={16}
                    className="text-[#e4be69]"
                  />

                  Clear Filters
                </button>
              )}
            </div>

          ) : (

            /* ================================================== */
            /* VEHICLE GRID                                       */
            /* ================================================== */

            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                sm:gap-5
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {filteredVehicles.map(
                (vehicle, index) => (
                  <div
                    key={vehicle._id}
                    className="market-rise h-full"
                    style={{
                      animationDelay: `${Math.min(
                        index,
                        7
                      ) * 60}ms`,
                    }}
                  >
                    <PublicVehicleCard
                      vehicle={vehicle}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

/* ================================================================ */
/* FILTER SELECT                                                     */
/* ================================================================ */

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  disabled?: boolean;
}

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: FilterSelectProps) => (
  <label className="min-w-0">
    <span className="mb-1.5 block text-xs font-semibold text-[#626c78]">
      {label}
    </span>

    <span className="relative block">
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`
          h-11
          w-full
          appearance-none
          truncate
          rounded-xl
          border
          bg-[#fdfcf9]
          py-2
          pl-3
          pr-8
          text-sm
          font-medium
          outline-none
          transition
          focus:border-[#c9a24b]
          focus:bg-white
          focus:ring-4
          focus:ring-[#c9a24b]/10
          disabled:cursor-wait
          disabled:opacity-60
          ${
            value
              ? "border-[#e2cf9c] text-[#101827]"
              : "border-[#e6e1d6] text-[#273346]"
          }
        `}
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value ||
                option.label
              }
              value={option.value}
            >
              {option.label}
            </option>
          )
        )}
      </select>

      <ChevronDown
        size={14}
        className="
          pointer-events-none
          absolute
          right-2.5
          top-1/2
          -translate-y-1/2
          text-[#818895]
        "
      />
    </span>
  </label>
);

/* ================================================================ */
/* UNIQUE VALUES                                                     */
/* ================================================================ */

const uniqueValues = (
  values: string[]
): FilterOption[] =>
  [
    ...new Set(
      values.filter(Boolean)
    ),
  ]
    .sort((first, second) =>
      first.localeCompare(second)
    )
    .map((value) => ({
      value,
      label: value,
    }));

export default PublicVehicles;