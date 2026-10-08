import { motion, useReducedMotion } from "framer-motion";

import miniTruckImg from "../../assets/VehicleTypes/Mini Trucks.png";
import pickupTruckImg from "../../assets/VehicleTypes/Pickup Trucks.png";
import tipperImg from "../../assets/VehicleTypes/Tippers.png";
import carImg from "../../assets/VehicleTypes/Toyota Innova Crysta Studio Showcase.png";
import trailerImg from "../../assets/VehicleTypes/Trailers.png";
import transitMixerImg from "../../assets/VehicleTypes/Transit Mixers.png";
import truckImg from "../../assets/VehicleTypes/Truck.png";

const fontCss = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700;800&display=swap');

.vt-sans {
  font-family: 'Manrope', system-ui, sans-serif;
}

.vt-serif {
  font-family: 'DM Serif Display', Georgia, serif;
}
`;

type VehicleCategory = {
  id: string;
  name: string;
  image: string;
};

const vehicleCategories: VehicleCategory[] = [
  {
    id: "mini-trucks",
    name: "Mini Trucks",
    image: miniTruckImg,
  },
  {
    id: "pickup-trucks",
    name: "Pickup Trucks",
    image: pickupTruckImg,
  },
  {
    id: "tippers",
    name: "Tippers",
    image: tipperImg,
  },
  {
    id: "cars",
    name: "Cars",
    image: carImg,
  },
  {
    id: "trailers",
    name: "Trailers",
    image: trailerImg,
  },
  {
    id: "transit-mixers",
    name: "Transit Mixers",
    image: transitMixerImg,
  },
  {
    id: "trucks",
    name: "Trucks",
    image: truckImg,
  },
];

export default function VehicleTypes() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="vt-sans relative overflow-hidden bg-[#f7f5ef] py-8 sm:py-10 lg:py-12">
      <style>{fontCss}</style>

      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-10">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="mb-5 flex items-end justify-between sm:mb-6">

          <div>
            {/* Small eyebrow */}
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-[1.5px] w-7 bg-[#d99a20]" />

              <span
                className="
                  text-[8px]
                  font-extrabold
                  uppercase
                  tracking-[0.28em]
                  text-[#7d6b4b]
                  sm:text-[9px]
                "
              >
                Explore Our Range
              </span>
            </div>

            {/* Main heading */}
            <h2
              className="
                vt-serif
                text-[25px]
                leading-[1.05]
                tracking-[-0.02em]
                text-[#14243d]
                sm:text-[30px]
                lg:text-[34px]
              "
            >
              Vehicle Categories
            </h2>
          </div>

          {/* Decorative navigation controls
              Visual only — no functionality changed */}
          <div className="hidden items-center gap-2 sm:flex">
            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                border
                border-[#ddd8cc]
                bg-white/70
                text-sm
                text-[#26364c]
              "
            >
              ←
            </span>

            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-[#d89b25]
                text-sm
                font-semibold
                text-white
                shadow-sm
              "
            >
              →
            </span>
          </div>
        </div>

        {/* =========================================================
            CATEGORY CARDS
        ========================================================= */}
        <div
          className="
            flex
            gap-1.5
            overflow-x-auto
            pb-2
            scrollbar-hide
            sm:gap-2
            lg:grid
            lg:grid-cols-7
            lg:overflow-visible
            lg:pb-0
          "
        >
          {vehicleCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 12,
                    }
              }
              whileInView={
                reduceMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.35,
                delay: reduceMotion ? 0 : index * 0.04,
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -3,
                    }
              }
              className="
                group
                relative
                flex
                min-w-[126px]
                flex-1
                flex-col
                overflow-hidden
                rounded-[11px]
                border
                border-[#ded9ce]
                bg-[#fdfcf9]
                shadow-[0_2px_8px_rgba(30,41,59,0.035)]
                transition-all
                duration-300
                hover:border-[#d8b56a]
                hover:bg-white
                hover:shadow-[0_8px_22px_rgba(30,41,59,0.10)]
                sm:min-w-[140px]
                lg:min-w-0
              "
            >

              {/* =====================================================
                  IMAGE
              ===================================================== */}
              <div
                className="
                  relative
                  h-[78px]
                  w-full
                  overflow-hidden
                  bg-[#eeeae1]
                  sm:h-[88px]
                  lg:h-[92px]
                "
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                    object-center
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-[1.045]
                  "
                />

                {/* Soft image overlay */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/[0.08]
                    via-transparent
                    to-white/[0.04]
                  "
                />

                {/* Tiny premium accent */}
                <span
                  className="
                    absolute
                    left-2
                    top-2
                    h-[3px]
                    w-5
                    rounded-full
                    bg-[#dca329]
                    transition-all
                    duration-300
                    group-hover:w-7
                  "
                />
              </div>

              {/* =====================================================
                  CATEGORY FOOTER
              ===================================================== */}
              <div
                className="
                  relative
                  flex
                  min-h-[43px]
                  items-center
                  justify-between
                  gap-1
                  border-t
                  border-[#e8e3d9]
                  bg-[#fdfcf9]
                  px-2
                  py-2
                  sm:min-h-[45px]
                  sm:px-2.5
                "
              >
                <span
                  className="
                    min-w-0
                    truncate
                    text-[8px]
                    font-bold
                    leading-tight
                    text-[#27364b]
                    transition-colors
                    duration-300
                    group-hover:text-[#b77a0b]
                    sm:text-[9px]
                    lg:text-[9px]
                  "
                >
                  {category.name}
                </span>

                {/* Circular arrow — visual only */}
                <span
                  className="
                    flex
                    h-[20px]
                    w-[20px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#d8d3c9]
                    bg-white
                    text-[11px]
                    font-medium
                    text-[#4b5563]
                    transition-all
                    duration-300
                    group-hover:border-[#d6a12e]
                    group-hover:bg-[#d6a12e]
                    group-hover:text-white
                  "
                >
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* =========================================================
            BOTTOM ACCENT
        ========================================================= */}
        <div className="mt-5 flex items-center justify-center sm:mt-6">
          <span className="h-px w-9 bg-[#ded9ce]" />
          <span className="mx-2 h-[4px] w-[4px] rounded-full bg-[#dba126]" />
          <span className="h-px w-9 bg-[#ded9ce]" />
        </div>

      </div>
    </section>
  );
}