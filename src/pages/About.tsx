import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  ClipboardCheck,
  Handshake,
  Headset,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import miniTruckImage from "../assets/VehicleTypes/Mini Trucks.png";
import pickupImage from "../assets/VehicleTypes/Pickup Trucks.png";
import truckImage from "../assets/VehicleTypes/Truck.png";
import tipperImage from "../assets/VehicleTypes/Tippers.png";
import trailerImage from "../assets/VehicleTypes/Trailers.png";
import mixerImage from "../assets/VehicleTypes/Transit Mixers.png";
import carImage from "../assets/VehicleTypes/Toyota Innova Crysta Studio Showcase.png";
import businessImage from "../assets/why_to_choose/finance.png";
import vehicleYardImage from "../assets/heo-bg1.png";

const offers = [
  {
    number: "01",
    title: "Quality Vehicle Options",
    description:
      "Carefully presented pre-owned vehicles for different business requirements.",
    icon: BadgeCheck,
  },
  {
    number: "02",
    title: "Transparent Deals",
    description:
      "Clear vehicle information and pricing to help customers make informed decisions.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Expert Guidance",
    description:
      "Support in choosing a vehicle based on your business, usage and budget.",
    icon: Headset,
  },
  {
    number: "04",
    title: "End-to-End Support",
    description:
      "Assistance throughout the buying and selling journey.",
    icon: Handshake,
  },
];

const vehicleCategories = [
  {
    name: "Mini Trucks",
    description: "Compact vehicles for last-mile delivery and city operations.",
    image: miniTruckImage,
  },
  {
    name: "Pickup Trucks",
    description: "Versatile transport vehicles for everyday business needs.",
    image: pickupImage,
  },
  {
    name: "Trucks",
    description: "Reliable options for larger commercial loads.",
    image: truckImage,
  },
  {
    name: "Tippers",
    description: "Built for construction, sand, aggregate and site operations.",
    image: tipperImage,
  },
  {
    name: "Trailers",
    description: "Practical solutions for long-haul and freight movement.",
    image: trailerImage,
  },
  {
    name: "Transit Mixers",
    description: "Specialized vehicles for construction and concrete operations.",
    image: mixerImage,
  },
  {
    name: "Cars & SUVs",
    description: "Passenger vehicles for business and family requirements.",
    image: carImage,
  },
];

const advantages = [
  {
    number: "01",
    title: "Reliable Vehicle Options",
    description:
      "Explore practical commercial vehicle choices for different kinds of work.",
  },
  {
    number: "02",
    title: "Straightforward Process",
    description:
      "Find vehicle information, compare options and take the next step with clarity.",
  },
  {
    number: "03",
    title: "Business-Focused Guidance",
    description:
      "Consider vehicle use, budget and business requirements as you choose.",
  },
  {
    number: "04",
    title: "Customer-First Service",
    description:
      "Get helpful support throughout the buying or selling journey.",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore",
    description: "Browse vehicles based on category, brand and requirement.",
    icon: Search,
  },
  {
    number: "02",
    title: "Inspect",
    description: "Review vehicle details, condition and available information.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Discuss",
    description: "Understand pricing and suitable finance options.",
    icon: Handshake,
  },
  {
    number: "04",
    title: "Drive Forward",
    description: "Complete the process and get your vehicle ready for business.",
    icon: Truck,
  },
];

const sectionEyebrow =
  "text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a47d32] sm:text-[11px]";

const sectionTitle =
  "mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#0b1a33] sm:text-3xl lg:text-[2.55rem]";

const bodyText =
  "text-sm leading-6 text-[#687181] sm:text-[15px] sm:leading-7";

export default function About() {
  const reduceMotion = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 16 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.45, delay: reduceMotion ? 0 : delay },
  });

  return (
    <main className="overflow-x-hidden bg-[#fbfaf7] text-[#172238]">
      <section className="px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-36 lg:px-10 lg:pb-20">
        <div className="mx-auto grid max-w-[1320px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <motion.div {...reveal()}>
            <p className={sectionEyebrow}>About Us</p>
            <span className="mt-4 block h-[2px] w-12 bg-[#c9a24b]" />
            <h1 className="mt-5 max-w-2xl font-serif text-[2.45rem] font-semibold leading-[1.08] tracking-tight text-[#0b1a33] sm:text-5xl lg:text-[3.65rem]">
              Moving Businesses Forward,
              <span className="mt-1 block text-[#9b7837]">
                One Vehicle at a Time.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#667080] sm:text-base sm:leading-7">
              We help businesses find reliable pre-owned commercial vehicles
              that match their work, budget and transportation needs.
            </p>
            <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
              <Link
                to="/vehicles"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0b1a33] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14294c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b]"
              >
                Browse Vehicles <ArrowRight size={16} />
              </Link>
              <Link
                to="/sell-your-vehicle"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#d8c99f] bg-[#fffdf8] px-5 py-3 text-sm font-semibold text-[#66501f] transition hover:bg-[#f5efdf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b]"
              >
                Sell Your Vehicle <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>

          <motion.div {...reveal(0.08)} className="relative min-w-0">
            <div className="absolute -bottom-3 -left-3 h-2/3 w-2/3 border-b border-l border-[#c9a24b]/65" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#e4ddcf] bg-[#eee9dd] shadow-[0_20px_48px_-32px_rgba(11,26,51,0.45)] sm:aspect-[16/10]">
              <img
                src={businessImage}
                alt="Commercial vehicle dealership and business team"
                className="h-full w-full object-cover object-center"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/35 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white drop-shadow sm:bottom-5 sm:left-5">
                Commercial mobility, made practical
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[#eee8dc] bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-[1240px] items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <motion.div {...reveal()} className="order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#e7e1d5] bg-[#efebe2] shadow-[0_18px_40px_-30px_rgba(11,26,51,0.35)]">
              <img
                src={vehicleYardImage}
                alt="Commercial vehicles together at a dealership"
                loading="lazy"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </motion.div>
          <motion.div {...reveal(0.06)} className="order-1 lg:order-2">
            <p className={sectionEyebrow}>Who We Are</p>
            <h2 className={sectionTitle}>
              A Trusted Partner for Commercial Mobility
            </h2>
            <span className="mt-5 block h-[2px] w-11 bg-[#c9a24b]" />
            <p className={`mt-5 ${bodyText}`}>
              We are focused on making the process of buying and selling
              commercial vehicles simple, transparent and convenient. From mini
              trucks and pickups to heavy trucks, tippers and other utility
              vehicles, we bring practical options together in one place.
            </p>
            <p className={`mt-4 ${bodyText}`}>
              Our goal is to make vehicle discovery easier for businesses while
              providing clear information, practical guidance and a
              straightforward buying and selling experience.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1320px]">
          <motion.div {...reveal()} className="max-w-2xl">
            <p className={sectionEyebrow}>What We Offer</p>
            <h2 className={sectionTitle}>
              Everything You Need to Move Your Business Forward
            </h2>
          </motion.div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
            {offers.map(({ number, title, description, icon: Icon }, index) => (
              <motion.article
                key={number}
                {...reveal(index * 0.04)}
                className="group min-w-0 border border-[#e7e1d5] bg-white p-5 shadow-[0_6px_20px_-18px_rgba(11,26,51,0.4)] transition duration-300 hover:-translate-y-1 hover:border-[#d7c28f] hover:shadow-[0_16px_28px_-22px_rgba(11,26,51,0.35)] sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6d7b2] bg-[#faf6eb] text-[#967333] transition group-hover:bg-[#f3ead4]">
                    <Icon size={19} strokeWidth={1.7} />
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.16em] text-[#a59d8c]">
                    {number}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-lg font-semibold text-[#0b1a33]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#737b88]">
                  {description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#eee8dc] bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1320px]">
          <motion.div {...reveal()} className="max-w-2xl">
            <p className={sectionEyebrow}>Our Vehicle Range</p>
            <h2 className={sectionTitle}>Vehicles Built for Every Business</h2>
            <p className={`mt-3 ${bodyText}`}>
              From everyday delivery vehicles to heavy-duty commercial
              transport, explore vehicle options designed for different
              business needs.
            </p>
          </motion.div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-10 lg:grid-cols-4">
            {vehicleCategories.map(({ name, description, image }, index) => (
              <motion.article
                key={name}
                {...reveal(index * 0.025)}
                className="group min-w-0 overflow-hidden border border-[#e7e1d5] bg-[#fbfaf7] transition duration-300 hover:-translate-y-1 hover:border-[#d7c28f] hover:shadow-[0_14px_28px_-22px_rgba(11,26,51,0.4)]"
              >
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f7f5ef] to-[#ece8dd] p-3 sm:p-5">
                  <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-serif text-base font-semibold text-[#0b1a33] sm:text-lg">
                    {name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#707887] sm:text-sm sm:leading-6">
                    {description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <motion.div {...reveal()}>
            <p className={sectionEyebrow}>Why Choose Us</p>
            <h2 className={sectionTitle}>Built Around Your Business Needs</h2>
            <p className={`mt-4 ${bodyText}`}>
              Choosing a commercial vehicle is a business decision. We focus on
              making that decision easier with practical vehicle options,
              clear information and customer-focused support.
            </p>
          </motion.div>
          <div className="border-t border-[#ded8cb]">
            {advantages.map(({ number, title, description }, index) => (
              <motion.div
                key={number}
                {...reveal(index * 0.035)}
                className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-[#ded8cb] py-5 sm:grid-cols-[3.5rem_1fr] sm:gap-5 sm:py-6"
              >
                <span className="pt-1 font-serif text-lg text-[#ae8b48] sm:text-xl">
                  {number}
                </span>
                <div className="sm:flex sm:items-start sm:justify-between sm:gap-6">
                  <h3 className="font-serif text-lg font-semibold text-[#0b1a33] sm:min-w-[13rem] sm:text-xl">
                    {title}
                  </h3>
                  <p className="mt-1.5 max-w-md text-sm leading-6 text-[#737b88] sm:mt-0">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#eee8dc] bg-[#f3f0e8] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1320px]">
          <motion.div {...reveal()}>
            <p className={sectionEyebrow}>How We Work</p>
            <h2 className={sectionTitle}>A Simple Way to Get Moving</h2>
          </motion.div>
          <div className="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <div className="absolute bottom-6 left-6 top-6 w-px bg-[#d6c69f] sm:hidden" />
            <div className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-[#d6c69f] lg:block" />
            {steps.map(({ number, title, description, icon: Icon }, index) => (
              <motion.article
                key={number}
                {...reveal(index * 0.04)}
                className="relative flex gap-4 sm:gap-5 lg:block"
              >
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d6c69f] bg-[#fbfaf7] text-[#92702e] lg:h-14 lg:w-14">
                  <Icon size={21} strokeWidth={1.7} />
                </span>
                <div className="pb-2 lg:mt-5">
                  <p className="text-[10px] font-extrabold tracking-[0.15em] text-[#a47d32]">
                    {number}
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-[#0b1a33]">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#707887]">
                    {description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#0b1a33] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-10 lg:py-18">
        <img
          src={truckImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#081326]/95 via-[#0b1a33]/90 to-[#0b1a33]/75" />
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div className="max-w-2xl">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e4c578]">
              Sell With Us
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
              Have a Vehicle to Sell?
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              Turn your commercial vehicle into an opportunity. Submit your
              vehicle details and let our team take the process forward.
            </p>
          </div>
          <Link
            to="/sell-your-vehicle"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#dfbd68] px-5 py-3 text-sm font-bold text-[#14203a] transition hover:bg-[#edcf7d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Sell Your Vehicle <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="border-b border-[#eee8dc] bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] items-center gap-5 lg:grid-cols-[1fr_0.55fr_auto] lg:gap-8">
          <div className="max-w-2xl">
            <p className={sectionEyebrow}>Finance Support</p>
            <h2 className={sectionTitle}>Need Finance for Your Vehicle?</h2>
            <p className={`mt-3 ${bodyText}`}>
              Explore finance options and estimate your monthly EMI before
              making your decision.
            </p>
          </div>
          <div className="flex h-36 items-center justify-center overflow-hidden bg-[#f7f4ec] px-4 sm:h-44 lg:h-36">
            <img
              src={truckImage}
              alt="Commercial truck"
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
          <Link
            to="/finance"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#d8c99f] bg-[#fbf7ed] px-5 py-3 text-sm font-bold text-[#705722] transition hover:bg-[#f2ead6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b]"
          >
            Explore Finance <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-5 border border-[#e7e1d5] bg-[#f5f1e7] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-7">
          <div className="max-w-2xl">
            <h2 className="font-serif text-xl font-semibold leading-tight text-[#0b1a33] sm:text-2xl">
              Let&apos;s Find the Right Vehicle for Your Business.
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#697181]">
              Explore our available vehicles or speak with us about your next
              commercial vehicle requirement.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[420px]:flex-row">
            <Link
              to="/vehicles"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b1a33] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14294c]"
            >
              Browse Vehicles <ArrowRight size={15} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d8c99f] bg-white px-4 py-2.5 text-sm font-semibold text-[#705722] transition hover:bg-[#fbf7ed]"
            >
              Contact Us <ChevronRight size={15} />
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-[1320px] text-xs leading-5 text-[#858174]">
          Finance availability and vehicle details are subject to individual
          eligibility and confirmation.
        </p>
      </section>
    </main>
  );
}
