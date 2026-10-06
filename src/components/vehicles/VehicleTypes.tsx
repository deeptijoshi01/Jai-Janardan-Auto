import { motion, useReducedMotion } from "framer-motion";

import miniTruckImg from "../../assets/VehicleTypes/Mini Trucks.png";
import pickupTruckImg from "../../assets/VehicleTypes/Pickup Trucks.png";
import tipperImg from "../../assets/VehicleTypes/Tippers.png";
import carImg from "../../assets/VehicleTypes/Toyota Innova Crysta Studio Showcase.png";
import trailerImg from "../../assets/VehicleTypes/Trailers.png";
import transitMixerImg from "../../assets/VehicleTypes/Transit Mixers.png";
import truckImg from "../../assets/VehicleTypes/Truck.png";

const fontCss = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.vt-sans {
  font-family: 'Manrope', system-ui, sans-serif;
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
    <section className="vt-sans relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <style>{fontCss}</style>

      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">

        {/* ================= HEADER ================= */}
        <div className="mb-8 sm:mb-10">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-[2px] w-7 bg-amber-500" />

            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-amber-600 sm:text-xs">
              Our Collection
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Explore Vehicle{" "}
            <span className="text-amber-500">Categories</span>
          </h2>

          <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
            Explore the range of vehicles available at Jai Janardan Auto.
          </p>
        </div>

        {/* ================= CATEGORY SHOWCASE ================= */}
        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            sm:gap-4
            lg:grid-cols-7
            lg:gap-4
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
                      y: 18,
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
                duration: 0.4,
                delay: reduceMotion ? 0 : index * 0.05,
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -5,
                    }
              }
              className="
                group
                relative
                min-w-0
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-[0_3px_14px_rgba(15,23,42,0.045)]
                transition-all
                duration-300
                hover:border-amber-300
                hover:shadow-[0_12px_28px_rgba(15,23,42,0.10)]
              "
            >

              {/* ================= IMAGE ================= */}
              <div
                className="
                  relative
                  flex
                  h-28
                  items-center
                  justify-center
                  overflow-hidden
                  bg-gradient-to-br
                  from-slate-50
                  to-white
                  sm:h-32
                  lg:h-32
                  xl:h-36
                "
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-contain
                    p-2
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-110
                    sm:p-3
                  "
                />

                {/* Small Premium Accent */}
                <span
                  className="
                    absolute
                    left-2
                    top-2
                    h-1
                    w-5
                    rounded-full
                    bg-amber-400
                    transition-all
                    duration-300
                    group-hover:w-8
                  "
                />
              </div>

              {/* ================= CATEGORY NAME ================= */}
              <div
                className="
                  flex
                  min-h-[52px]
                  items-center
                  justify-center
                  border-t
                  border-slate-100
                  px-2
                  py-3
                  text-center
                "
              >
                <span
                  className="
                    text-[10px]
                    font-bold
                    leading-tight
                    text-slate-800
                    transition-colors
                    duration-300
                    group-hover:text-amber-700
                    sm:text-xs
                  "
                >
                  {category.name}
                </span>
              </div>

            </motion.div>
          ))}
        </div>

        {/* ================= BOTTOM ACCENT ================= */}
        <div className="mt-8 flex items-center justify-center gap-2 sm:mt-10">
          <span className="h-px w-10 bg-slate-200" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="h-px w-10 bg-slate-200" />
        </div>

      </div>
    </section>
  );
}