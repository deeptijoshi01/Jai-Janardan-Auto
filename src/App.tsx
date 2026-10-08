import { lazy, Suspense, useCallback, useEffect, useState } from "react";

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Hero from "./components/common/Hero";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import WhyChooseAndHowItWorks from "./components/home/WhyChooseAndHowItWorks";
import PublicVehicleCard from "./components/vehicles/PublicVehicleCard";
import VehicleTypes from "./components/vehicles/VehicleTypes";

import { fallbackVehicles } from "./data/vehicleFallback";

import type { Vehicle } from "./types/vehicle";

/* ================================================================ */
/* ADMIN IMPORTS                                                     */
/* ================================================================ */

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AddVehicle from "./pages/AddVehicle";
import AllVehicles from "./pages/AllVehicles";
import AdminCategories from "./pages/Categories";
import AdminEnquiries from "./pages/Enquiries";
import AdminCustomers from "./pages/Customers";
import AdminSales from "./pages/Sales";
import AdminReports from "./pages/Reports";
import AdminSettings from "./pages/Settings";
import VehicleDetails from "./pages/VehicleDetails";

/* ================================================================ */
/* LAZY PUBLIC / ADMIN PAGES                                        */
/* ================================================================ */

const PublicVehicles = lazy(
  () => import("./pages/PublicVehicles")
);

const PublicVehicleDetails = lazy(
  () => import("./pages/PublicVehicleDetails")
);

const Finance = lazy(
  () => import("./pages/Finance")
);

const About = lazy(
  () => import("./pages/About")
);

const Contact = lazy(
  () => import("./pages/Contact")
);

const SellYourVehicle = lazy(
  () => import("./pages/SellYourVehicle")
);

const AdminSellRequests = lazy(
  () => import("./pages/AdminSellRequests")
);

/* ================================================================ */
/* API                                                               */
/* ================================================================ */

const VEHICLES_API_URL =
  "http://localhost:5000/api/vehicles";

/* ================================================================ */
/* PUBLIC PAGE LOADING                                               */
/* ================================================================ */

function PublicPageLoading() {
  return (
    <main
      aria-busy="true"
      className="
        min-h-[50vh]
        bg-[#fbfaf7]
        px-4
        pt-32
        text-center
        text-sm
        text-[#6e7580]
      "
    >
      Loading vehicles...
    </main>
  );
}

/* ================================================================ */
/* BEST SELLER SKELETON                                              */
/* ================================================================ */

function BestSellerSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="
        overflow-hidden
        rounded-[18px]
        border
        border-[#e9e6df]
        bg-[#fffefa]
        shadow-[0_3px_14px_rgba(11,26,51,0.04)]
      "
    >
      {/* Image */}

      <div
        className="
          aspect-[16/9]
          animate-pulse
          bg-[#f0eee8]
        "
      />

      {/* Content */}

      <div className="space-y-3 p-4 sm:p-[18px]">
        {/* Category */}

        <div className="h-2.5 w-24 animate-pulse rounded bg-[#eeeae2]" />

        {/* Title */}

        <div className="h-5 w-4/5 animate-pulse rounded bg-[#eeeae2]" />

        {/* Subtitle */}

        <div className="h-3.5 w-3/5 animate-pulse rounded bg-[#f1ede6]" />

        {/* Specs */}

        <div className="grid grid-cols-2 gap-2">
          <div className="h-7 animate-pulse rounded bg-[#f6f3ed]" />
          <div className="h-7 animate-pulse rounded bg-[#f6f3ed]" />
          <div className="h-7 animate-pulse rounded bg-[#f6f3ed]" />
          <div className="h-7 animate-pulse rounded bg-[#f6f3ed]" />
        </div>

        {/* Price */}

        <div className="border-t border-[#eee9df] pt-3">
          <div className="h-3 w-20 animate-pulse rounded bg-[#f1ede6]" />

          <div className="mt-2 h-6 w-28 animate-pulse rounded bg-[#eeeae2]" />
        </div>

        {/* Button */}

        <div className="h-9 animate-pulse rounded-lg bg-[#eeeae2]" />
      </div>
    </div>
  );
}

/* ================================================================ */
/* HOME                                                              */
/* ================================================================ */

function Home() {
  const [bestSellers, setBestSellers] =
    useState<Vehicle[]>([]);

  const [loadingBestSellers, setLoadingBestSellers] =
    useState(true);

  /* ============================================================ */
  /* LOAD BEST SELLERS                                             */
  /* ============================================================ */

  const loadBestSellers = useCallback(async () => {
    try {
      const response = await fetch(
        `${VEHICLES_API_URL}?bestSeller=true`,
        { cache: "no-store" }
      );

      const data =
        (await response.json()) as {
          success?: boolean;
          vehicles?: Vehicle[];
          message?: string;
        };

      const vehicles = Array.isArray(
        data.vehicles
      )
        ? data.vehicles
        : [];

      if (
        !response.ok ||
        !data.success ||
        vehicles.length === 0
      ) {
        setBestSellers(
          fallbackVehicles.slice(0, 6)
        );

        return;
      }

      setBestSellers(
        vehicles.slice(0, 6)
      );
    } catch (error) {
      console.error(
        "Best sellers fetch error:",
        error
      );

      setBestSellers(
        fallbackVehicles.slice(0, 6)
      );
    } finally {
      setLoadingBestSellers(false);
    }
  }, []);

  useEffect(() => {
    void loadBestSellers();
  }, [loadBestSellers]);

  useEffect(() => {
    const handleBestSellerUpdated = () => {
      setLoadingBestSellers(true);
      void loadBestSellers();
    };

    window.addEventListener(
      "best-seller-updated",
      handleBestSellerUpdated
    );

    return () => {
      window.removeEventListener(
        "best-seller-updated",
        handleBestSellerUpdated
      );
    };
  }, [loadBestSellers]);

  /* ============================================================ */
  /* VISIBLE BEST SELLERS                                          */
  /* ============================================================ */

  const visibleBestSellers =
    bestSellers.length > 0
      ? bestSellers
      : fallbackVehicles;

  /* ============================================================ */
  /* RETURN                                                         */
  /* ============================================================ */

  return (
    <>
      {/* ======================================================== */}
      {/* HERO                                                     */}
      {/* ======================================================== */}

      <Hero />

      {/* ======================================================== */}
      {/* VEHICLE TYPES                                             */}
      {/* ======================================================== */}

      <VehicleTypes />

      {/* ======================================================== */}
      {/* BEST SELLING VEHICLES                                     */}
      {/* ======================================================== */}

      {(loadingBestSellers ||
        visibleBestSellers.length > 0) && (
        <section
          aria-labelledby="best-selling-vehicles-heading"
          aria-busy={loadingBestSellers}
          className="relative overflow-hidden bg-[#faf9f6] py-14 sm:py-[4.5rem] lg:py-20"
        >
          {/* ==================================================== */}
          {/* CONTAINER                                             */}
          {/* ==================================================== */}

          <div
            className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10"
          >
            {/* ================================================== */}
            {/* SECTION HEADER                                      */}
            {/* ================================================== */}

            <div
              className="
                mb-7
                flex
                flex-col
                justify-between
                gap-4
                sm:mb-9
                sm:flex-row
                sm:items-center
              "
            >
              {/* Heading */}

              <div className="max-w-2xl">
                {/* Eyebrow */}

                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="
                      h-px
                      w-8
                      bg-[#c9a24b]
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.24em]
                      text-[#a77f39]
                      sm:text-[11px]
                    "
                  >
                    Our Best Sellers
                  </span>
                </div>

                {/* Heading */}

                <h2
                  id="best-selling-vehicles-heading"
                  className="
                    font-serif
                    text-[2rem]
                    font-bold
                    leading-[1.1]
                    tracking-[-0.03em]
                    text-[#0b1a33]
                    sm:text-[2.5rem]
                    lg:text-[2.75rem]
                  "
                >
                  Best Selling{" "}
                  <span className="text-[#b18a3d]">
                    Vehicles
                  </span>
                </h2>

                {/* Description */}

                <p
                  className="
                    mt-2
                    max-w-xl
                    text-sm
                    leading-[1.65]
                    text-[#667080]
                    sm:text-[15px]
                  "
                >
                  Top commercial vehicles selected
                  for businesses.
                </p>
              </div>

              {/* ================================================= */}
              {/* VIEW ALL BUTTON                                    */}
              {/* ================================================= */}

              {!loadingBestSellers && (
                <Link
                  to="/vehicles"
                  className="
                    group
                    inline-flex
                    h-10
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    self-start
                    rounded-full
                    border
                    border-[#d8c9aa]
                    bg-[#fffefa]
                    px-5
                    text-[13px]
                    font-semibold
                    text-[#0b1a33]
                    transition-colors
                    duration-200
                    hover:border-[#b18a3d]
                    hover:bg-white
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-[#c9a24b]
                    sm:self-auto
                  "
                >
                  View All Vehicles

                  <span
                    aria-hidden="true"
                    className="
                      text-[#a77f39]
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </Link>
              )}
            </div>

            {/* ================================================== */}
            {/* BEST SELLER GRID                                    */}
            {/* ================================================== */}

            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
            >
              {/* ================================================= */}
              {/* LOADING                                            */}
              {/* ================================================= */}

              {loadingBestSellers ? (
                Array.from(
                  { length: 4 },
                  (_, index) => (
                    <BestSellerSkeleton
                      key={index}
                    />
                  )
                )
              ) : (
                /* =============================================== */
                /* VEHICLES                                         */
                /* =============================================== */

                visibleBestSellers
                  .slice(0, 6)
                  .map((vehicle) => (
                    <PublicVehicleCard
                      key={vehicle._id}
                      vehicle={vehicle}
                      showBestSellerBadge
                      compact
                    />
                  ))
              )}
            </div>

            {/* ================================================== */}
            {/* MOBILE VIEW ALL                                     */}
            {/* ================================================== */}

            {!loadingBestSellers && (
              <div className="mt-7 flex justify-center sm:hidden">
                <Link
                  to="/vehicles"
                  className="
                    group
                    inline-flex
                    h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-[#d8c9aa]
                    bg-[#fffefa]
                    px-5
                    text-[13px]
                    font-semibold
                    text-[#0b1a33]
                    transition-colors
                    hover:border-[#b18a3d]
                    hover:bg-white
                  "
                >
                  View All Vehicles

                  <span
                    aria-hidden="true"
                    className="
                      text-[#a77f39]
                      transition-transform
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* WHY CHOOSE + HOW IT WORKS                                */}
      {/* ======================================================== */}

      <WhyChooseAndHowItWorks />
    </>
  );
}

/* ================================================================ */
/* PUBLIC LAYOUT                                                     */
/* ================================================================ */

function PublicLayout() {
  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
}

/* ================================================================ */
/* APP                                                               */
/* ================================================================ */

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ====================================================== */}
        {/* PUBLIC ROUTES                                          */}
        {/* ====================================================== */}

        <Route element={<PublicLayout />}>

          {/* Home */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* Inventory */}

          <Route
            path="/vehicles"
            element={
              <Suspense
                fallback={
                  <PublicPageLoading />
                }
              >
                <PublicVehicles />
              </Suspense>
            }
          />

          {/* Vehicle Details */}

          <Route
            path="/vehicles/:vehicleId"
            element={
              <Suspense
                fallback={
                  <PublicPageLoading />
                }
              >
                <PublicVehicleDetails />
              </Suspense>
            }
          />

          {/* Sell Vehicle */}

          <Route
            path="/sell-your-vehicle"
            element={
              <Suspense
                fallback={
                  <PublicPageLoading />
                }
              >
                <SellYourVehicle />
              </Suspense>
            }
          />

          {/* Finance */}

          <Route
            path="/finance"
            element={
              <Suspense
                fallback={
                  <PublicPageLoading />
                }
              >
                <Finance />
              </Suspense>
            }
          />

          {/* About */}

          <Route
            path="/about"
            element={
              <Suspense
                fallback={
                  <PublicPageLoading />
                }
              >
                <About />
              </Suspense>
            }
          />

          {/* Contact */}

          <Route
            path="/contact"
            element={
              <Suspense
                fallback={
                  <PublicPageLoading />
                }
              >
                <Contact />
              </Suspense>
            }
          />

          {/* Legacy Sell Route */}

          <Route
            path="/sell"
            element={
              <Navigate
                to="/sell-your-vehicle"
                replace
              />
            }
          />
        </Route>

        {/* ====================================================== */}
        {/* ADMIN LOGIN                                             */}
        {/* ====================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ====================================================== */}
        {/* ADMIN ROUTES                                            */}
        {/* ====================================================== */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          {/* Dashboard */}

          <Route
            index
            element={<AdminDashboard />}
          />

          {/* Vehicles */}

          <Route
            path="vehicles"
            element={<AllVehicles />}
          />

          <Route
            path="vehicles/add"
            element={<AddVehicle />}
          />

          {/* Sell Requests */}

          <Route
            path="sell-requests"
            element={
              <Suspense
                fallback={
                  <PublicPageLoading />
                }
              >
                <AdminSellRequests />
              </Suspense>
            }
          />

          {/* Vehicle Edit */}

          <Route
            path="vehicles/edit/:vehicleId"
            element={
              <VehicleDetails
                mode="edit"
              />
            }
          />

          {/* Vehicle View */}

          <Route
            path="vehicles/:vehicleId"
            element={
              <VehicleDetails
                mode="view"
              />
            }
          />

          {/* Categories */}

          <Route
            path="categories"
            element={<AdminCategories />}
          />

          {/* Enquiries */}

          <Route
            path="enquiries"
            element={<AdminEnquiries />}
          />

          {/* Customers */}

          <Route
            path="customers"
            element={<AdminCustomers />}
          />

          {/* Sales */}

          <Route
            path="sales"
            element={<AdminSales />}
          />

          {/* Reports */}

          <Route
            path="reports"
            element={<AdminReports />}
          />

          {/* Settings */}

          <Route
            path="settings"
            element={<AdminSettings />}
          />
        </Route>

        {/* ====================================================== */}
        {/* FALLBACK ROUTE                                          */}
        {/* ====================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;