
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Search,
  ArrowRight,
  Truck,
  CarFront,
  Tag,
  ShieldCheck,
  BadgeIndianRupee,
  Headset,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "../../assets/heo-bg.png";
import { fetchCategories } from "../../services/categoryBrandApi";
import type { Category } from "../../types/categoryBrand";

/* Palette: ink #060d1a, navy #0b1a33, gold #e9b949, ivory #f5efe0 */

const TRUST = [
  {
    Icon: ShieldCheck,
    title: "Verified Documents",
    sub: "Safe & Secure Deals",
  },
  {
    Icon: BadgeIndianRupee,
    title: "Finance Support",
    sub: "Easy Loan Assistance",
  },
  {
    Icon: Headset,
    title: "Expert Guidance",
    sub: "From Selection to Sale",
  },
];

const fontCss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap');
.hero-serif { font-family: 'Playfair Display', Georgia, serif; }
.hero-sans { font-family: 'Manrope', system-ui, sans-serif; }
`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3d27a]";

const goldBtn =
  "bg-gradient-to-b from-[#f3d27a] to-[#e0a92f] text-[#1a1305] shadow-lg shadow-[#e9b949]/25 hover:brightness-110";

export default function Hero() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchCategories()
      .then((result) => {
        if (isMounted) setCategories(result);
      })
      .catch((error: unknown) => {
        console.error("Hero category API error:", error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("search", keyword.trim());
    }

    if (category) {
      params.set("category", category);
    }

    navigate(`/vehicles?${params.toString()}`);
  };

  // Explicit Variants typing fixes the Framer Motion TypeScript error.
  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="hero-sans relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#060d1a] md:items-center">
      <style>{fontCss}</style>

      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-[62%_center] md:bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Background overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#060d1a] via-[#060d1a]/65 to-transparent md:bg-gradient-to-r md:from-[#060d1a]/90 md:via-[#060d1a]/45 md:to-transparent" />

      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[#060d1a]/80 to-transparent" />

      {/* Main content */}
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-28 sm:px-8 md:pb-12 md:pt-32 lg:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <motion.div
            variants={item}
            className="mb-5 flex items-center gap-3 text-[#f5efe0]/85"
          >
            <span className="h-px w-8 bg-[#e9b949]" />

            <span className="text-[12px] font-medium uppercase tracking-[0.12em] sm:text-[13px]">
              Your Trusted Commercial Vehicle Partner
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={item}
            className="hero-serif text-[2.4rem] font-semibold leading-[1.1] tracking-tight text-[#f5efe0] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] sm:text-5xl lg:text-[3.75rem]"
          >
            Find the Right
            <span className="block text-[#e9b949]">
              Commercial Vehicle
            </span>
            for Your Business
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={item}
            className="mt-4 max-w-lg text-[15px] leading-7 text-[#f5efe0]/85 sm:text-base"
          >
            Explore quality used trucks, tippers and commercial vehicles. Buy,
            sell or find the right vehicle for your next journey.
          </motion.p>

          {/* Search card */}
          <motion.div
            variants={item}
            className="mt-7 max-w-[760px] rounded-2xl border border-[#f5efe0]/20 bg-[#0b1a33]/45 p-3.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-4"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search by vehicle name, brand or model
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#f5efe0]/20 bg-[#f5efe0]/[0.06] px-4 focus-within:border-[#e9b949]/80">
              <Search
                size={20}
                className="shrink-0 text-[#e9b949]"
                aria-hidden
              />

              <input
                id="hero-search"
                type="text"
                inputMode="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Search by vehicle name, brand or model..."
                className="h-12 w-full bg-transparent text-base text-[#f5efe0] outline-none placeholder:text-[#f5efe0]/45"
              />
            </div>

            {/* Category selection and search button */}
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div
                role="group"
                aria-label="Vehicle category"
                className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:px-0 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {categories.map((item) => {
                  const active = category === item.type;
                  const Icon = item.type === "cars" ? CarFront : Truck;

                  return (
                    <button
                      key={item._id}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setCategory(active ? "" : item.type)
                      }
                      className={`flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${focusRing} ${
                        active
                          ? "border-transparent bg-gradient-to-b from-[#f3d27a] to-[#e0a92f] text-[#1a1305]"
                          : "border-[#f5efe0]/20 text-[#f5efe0]/85 hover:border-[#e9b949]/70"
                      }`}
                    >
                      <Icon size={18} aria-hidden />
                      {item.name}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className={`flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-7 font-semibold transition active:scale-[0.98] md:w-auto ${goldBtn} ${focusRing}`}
              >
                Search Vehicles
                <ArrowRight size={18} aria-hidden />
              </button>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            variants={item}
            className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:gap-4"
          >
            <button
              type="button"
              onClick={() => navigate("/vehicles")}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition sm:px-7 sm:text-base ${goldBtn} ${focusRing}`}
            >
              <Truck size={18} aria-hidden />
              Explore Vehicles
            </button>

            <button
              type="button"
              onClick={() => navigate("/sell-your-vehicle")}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border border-[#e9b949]/70 bg-[#060d1a]/40 px-4 text-sm font-semibold text-[#f5efe0] backdrop-blur-sm transition hover:bg-[#e9b949]/10 sm:px-7 sm:text-base ${focusRing}`}
            >
              <Tag
                size={18}
                className="text-[#e9b949]"
                aria-hidden
              />
              Sell Your Vehicle
            </button>
          </motion.div>

          {/* Trust highlights */}
          <motion.ul
            variants={item}
            className="mt-7 grid grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:gap-x-8"
          >
            {TRUST.map(({ Icon, title, sub }) => (
              <li key={title} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e9b949]/60 bg-[#060d1a]/40">
                  <Icon
                    size={18}
                    className="text-[#e9b949]"
                    aria-hidden
                  />
                </span>

                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-[#f5efe0]">
                    {title}
                  </span>

                  <span className="block text-xs text-[#f5efe0]/65">
                    {sub}
                  </span>
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
