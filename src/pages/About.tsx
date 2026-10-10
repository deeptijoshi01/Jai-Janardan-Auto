import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { Link } from "react-router-dom";

/* ----------------------------- DATA ----------------------------- */

const quickLinks = [
  { label: "Buy", text: "Browse available vehicles", to: "/vehicles" },
  { label: "Sell", text: "List your commercial vehicle", to: "/sell-your-vehicle" },
  { label: "Finance", text: "Explore options and estimate EMI", to: "/finance" },
];

const stats = [
  { value: "7+", label: "Vehicle types" },
  { value: "14+", label: "Finance partners" },
];

const pillars = [
  {
    title: "Trusted process",
    text: "Clear vehicle details and transparent pricing at every stage.",
  },
  {
    title: "Wide range",
    text: "Options for different business requirements, in one place.",
  },
];

const offers = [
  {
    title: "Quality vehicle options",
    description:
      "Carefully presented pre-owned vehicles for different business requirements.",
  },
  {
    title: "Transparent deals",
    description:
      "Clear vehicle information and pricing to help customers make informed decisions.",
  },
  {
    title: "Expert guidance",
    description:
      "Support in choosing a vehicle based on your business, usage and budget.",
  },
  {
    title: "End-to-end support",
    description: "Assistance throughout the buying and selling journey.",
  },
];

const vehicleCategories = [
  { name: "Mini Trucks", description: "Compact vehicles for last-mile delivery and city operations." },
  { name: "Pickup Trucks", description: "Versatile transport vehicles for everyday business needs." },
  { name: "Trucks", description: "Reliable options for larger commercial loads." },
  { name: "Tippers", description: "Built for construction, sand, aggregate and site operations." },
  { name: "Trailers", description: "Practical solutions for long-haul and freight movement." },
  { name: "Transit Mixers", description: "Specialised vehicles for construction and concrete operations." },
  { name: "Cars & SUVs", description: "Passenger vehicles for business and family requirements." },
];

const advantages = [
  {
    title: "Reliable vehicle options",
    description:
      "Explore practical commercial vehicle choices for different kinds of work.",
  },
  {
    title: "Straightforward process",
    description:
      "Find vehicle information, compare options and take the next step with clarity.",
  },
  {
    title: "Business-focused guidance",
    description:
      "Consider vehicle use, budget and business requirements as you choose.",
  },
  {
    title: "Customer-first service",
    description: "Get helpful support throughout the buying or selling journey.",
  },
];

const steps = [
  { title: "Explore", description: "Browse vehicles by category, brand and requirement." },
  { title: "Inspect", description: "Review vehicle details, condition and available information." },
  { title: "Discuss", description: "Understand pricing and suitable finance options." },
  { title: "Drive forward", description: "Complete the process and get your vehicle ready for business." },
];

/* ----------------------------- STYLES ----------------------------- */

const eyebrow =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a2b]";

const h2 =
  "mt-3 font-serif text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-[#0b1a33] sm:text-4xl lg:text-[2.5rem]";

const body = "text-[15px] leading-[1.7] text-[#5c6574]";

const container = "mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10";

const pad = "py-14 sm:py-20 lg:py-24";

const pad2 = (n: number) => String(n + 1).padStart(2, "0");

/* ----------------------------- PAGE ----------------------------- */

export default function About() {
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) => {
    const transition: Transition = {
      duration: 0.45,
      delay: reduceMotion ? 0 : delay,
      ease: "easeOut",
    };
    return {
      initial: reduceMotion ? false : { opacity: 0, y: 12 },
      whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.15 },
      transition,
    };
  };

  return (
    <main className="overflow-x-hidden bg-[#faf9f6] text-[#172238] antialiased">
      {/* ============ HERO ============ */}
      <section className="border-b border-[#e8e3d8] pt-28 sm:pt-36">
        <div className={`${container} pb-12 sm:pb-16 lg:pb-20`}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div {...reveal()} className="lg:col-span-7">
              <p className={eyebrow}>About us</p>
              <h1 className="mt-4 font-serif text-[2.25rem] font-semibold leading-[1.1] tracking-tight text-[#0b1a33] sm:text-5xl lg:text-[3.5rem]">
                Moving businesses forward,{" "}
                <span className="text-[#8a6a2b]">one vehicle at a time.</span>
              </h1>
              <p className={`mt-5 max-w-xl ${body} sm:text-base`}>
                We help businesses find reliable pre-owned commercial vehicles
                that match their work, budget and transportation needs.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/vehicles"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#0b1a33] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#16294a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1a33] focus-visible:ring-offset-2"
                >
                  Browse vehicles
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/sell-your-vehicle"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#0b1a33]/25 px-6 text-sm font-semibold text-[#0b1a33] transition-colors hover:border-[#0b1a33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1a33] focus-visible:ring-offset-2"
                >
                  Sell your vehicle
                </Link>
              </div>

              <dl className="mt-10 grid max-w-sm grid-cols-2 border-t border-[#e0dacb] pt-6">
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={i > 0 ? "border-l border-[#e0dacb] pl-6" : ""}
                  >
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-serif text-3xl font-semibold text-[#0b1a33]">
                      {s.value}
                    </dd>
                    <p className="mt-1 text-xs text-[#6b7382]">{s.label}</p>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Quick links panel */}
            <motion.aside {...reveal(0.08)} className="lg:col-span-5">
              <div className="rounded-md bg-[#0b1a33] p-6 text-white sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d9bd7a]">
                  Get started
                </p>
                <ul className="mt-4 divide-y divide-white/10">
                  {quickLinks.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="group flex items-center justify-between gap-4 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bd7a]"
                      >
                        <span>
                          <span className="block font-serif text-xl font-semibold">
                            {l.label}
                          </span>
                          <span className="mt-0.5 block text-sm text-white/65">
                            {l.text}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={18}
                          className="shrink-0 text-[#d9bd7a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ============ WHO WE ARE ============ */}
      <section className={`bg-white ${pad} border-b border-[#e8e3d8]`}>
        <div className={`${container} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
          <motion.div {...reveal()} className="lg:col-span-5">
            <p className={eyebrow}>Who we are</p>
            <h2 className={h2}>A trusted partner for commercial mobility</h2>
          </motion.div>

          <motion.div {...reveal(0.06)} className="lg:col-span-7">
            <p className={body}>
              We are focused on making the process of buying and selling
              commercial vehicles simple, transparent and convenient. From mini
              trucks and pickups to heavy trucks, tippers and other utility
              vehicles, we bring practical options together in one place.
            </p>
            <p className={`mt-4 ${body}`}>
              Our goal is to make vehicle discovery easier for businesses while
              providing clear information, practical guidance and a
              straightforward buying and selling experience.
            </p>

            <dl className="mt-8 grid gap-6 border-t border-[#e8e3d8] pt-6 sm:grid-cols-2">
              {pillars.map((p) => (
                <div key={p.title}>
                  <dt className="font-serif text-lg font-semibold text-[#0b1a33]">
                    {p.title}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-[#5c6574]">{p.text}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      {/* ============ WHAT WE OFFER ============ */}
      <section className={pad}>
        <div className={container}>
          <motion.div {...reveal()} className="max-w-2xl">
            <p className={eyebrow}>What we offer</p>
            <h2 className={h2}>Everything you need to move your business forward</h2>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-[#e0dacb] bg-[#e0dacb] sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {offers.map((o, i) => (
              <motion.article
                key={o.title}
                {...reveal(i * 0.04)}
                className="bg-[#faf9f6] p-6 sm:p-7"
              >
                <span className="font-serif text-sm font-semibold text-[#8a6a2b]">
                  {pad2(i)}
                </span>
                <h3 className="mt-6 font-serif text-xl font-semibold text-[#0b1a33]">
                  {o.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5c6574]">
                  {o.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VEHICLE RANGE ============ */}
      <section className={`bg-white ${pad} border-y border-[#e8e3d8]`}>
        <div className={container}>
          <motion.div {...reveal()} className="max-w-2xl">
            <p className={eyebrow}>Our vehicle range</p>
            <h2 className={h2}>Vehicles built for every business</h2>
            <p className={`mt-4 ${body}`}>
              From everyday delivery vehicles to heavy-duty commercial
              transport, explore options designed for different business needs.
            </p>
          </motion.div>

          <ul className="mt-8 grid border-t border-[#e0dacb] lg:mt-12 lg:grid-cols-2 lg:gap-x-16">
            {vehicleCategories.map((v, i) => (
              <motion.li
                key={v.name}
                {...reveal(i * 0.03)}
                className="grid grid-cols-[2.25rem_1fr] gap-3 border-b border-[#e0dacb] py-5 sm:grid-cols-[3rem_1fr] sm:py-6"
              >
                <span className="pt-1 font-serif text-sm font-semibold text-[#8a6a2b]">
                  {pad2(i)}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#0b1a33] sm:text-xl">
                    {v.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#5c6574]">
                    {v.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <Link
            to="/vehicles"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0b1a33] underline decoration-[#c9a24b] decoration-2 underline-offset-[6px] hover:text-[#8a6a2b]"
          >
            View all vehicles <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className={pad}>
        <div className={`${container} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
          <motion.div
            {...reveal()}
            className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start"
          >
            <p className={eyebrow}>Why choose us</p>
            <h2 className={h2}>Built around your business needs</h2>
            <p className={`mt-4 ${body}`}>
              Choosing a commercial vehicle is a business decision. We focus on
              making that decision easier with practical vehicle options, clear
              information and customer-focused support.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0b1a33] underline decoration-[#c9a24b] decoration-2 underline-offset-[6px] hover:text-[#8a6a2b]"
            >
              Talk to our team <ArrowRight size={15} />
            </Link>
          </motion.div>

          <ol className="border-t border-[#e0dacb] lg:col-span-7">
            {advantages.map((a, i) => (
              <motion.li
                key={a.title}
                {...reveal(i * 0.04)}
                className="grid grid-cols-[2.25rem_1fr] gap-3 border-b border-[#e0dacb] py-6 sm:grid-cols-[3rem_1fr] sm:py-7"
              >
                <span className="pt-1 font-serif text-sm font-semibold text-[#8a6a2b]">
                  {pad2(i)}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#0b1a33] sm:text-xl">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#5c6574]">
                    {a.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ HOW WE WORK ============ */}
      <section className={`bg-[#f3efe4] ${pad} border-y border-[#e3dcc8]`}>
        <div className={container}>
          <motion.div {...reveal()} className="max-w-2xl">
            <p className={eyebrow}>How we work</p>
            <h2 className={h2}>A simple way to get moving</h2>
          </motion.div>

          {/* Mobile: vertical timeline · Desktop: 4 columns */}
          <ol className="mt-10 lg:mt-14 lg:grid lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                {...reveal(i * 0.05)}
                className="relative pb-8 pl-10 last:pb-0 lg:border-t lg:border-[#cfc4a3] lg:pb-0 lg:pl-0 lg:pt-6"
              >
                {/* timeline rail (mobile only) */}
                <span
                  aria-hidden="true"
                  className="absolute left-[11px] top-7 bottom-0 w-px bg-[#cfc4a3] last:hidden lg:hidden"
                />
                <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#8a6a2b] bg-[#f3efe4] text-[11px] font-semibold text-[#8a6a2b] lg:static lg:h-auto lg:w-auto lg:border-0 lg:bg-transparent lg:text-sm">
                  {pad2(i)}
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#0b1a33] lg:mt-3 lg:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-1.5 max-w-xs text-sm leading-6 text-[#5c6574]">
                  {s.description}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ SELL CTA ============ */}
      <section className={`bg-[#0b1a33] text-white ${pad}`}>
        <div className={`${container} flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16`}>
          <motion.div {...reveal()} className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d9bd7a]">
              Sell with us
            </p>
            <h2 className="mt-3 font-serif text-[1.75rem] font-semibold leading-[1.15] sm:text-4xl lg:text-[2.5rem]">
              Have a vehicle to sell?
            </h2>
            <p className="mt-4 text-[15px] leading-[1.7] text-white/70">
              Submit your vehicle details and let our team take the process
              forward.
            </p>
          </motion.div>
          <Link
            to="/sell-your-vehicle"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-[#d9bd7a] px-7 text-sm font-semibold text-[#0b1a33] transition-colors hover:bg-[#e6cc8f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bd7a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1a33]"
          >
            Sell your vehicle <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ============ FINANCE ============ */}
      <section className={`bg-white ${pad} border-b border-[#e8e3d8]`}>
        <div className={`${container} flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16`}>
          <motion.div {...reveal()} className="max-w-2xl">
            <p className={eyebrow}>Finance support</p>
            <h2 className={h2}>Need finance for your vehicle?</h2>
            <p className={`mt-4 ${body}`}>
              Explore finance options and estimate your monthly EMI before
              making your decision. We work with lending partners to help find
              suitable financial solutions.
            </p>
          </motion.div>
          <Link
            to="/finance"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md border border-[#0b1a33]/25 px-7 text-sm font-semibold text-[#0b1a33] transition-colors hover:border-[#0b1a33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1a33] focus-visible:ring-offset-2"
          >
            Explore finance <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-14 sm:py-16">
        <div className={container}>
          <div className="flex flex-col gap-6 border-y border-[#e0dacb] py-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="font-serif text-2xl font-semibold leading-tight text-[#0b1a33] sm:text-3xl">
                Let&apos;s find the right vehicle for your business.
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5c6574]">
                Explore our available vehicles or speak with us about your next
                commercial vehicle requirement.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/vehicles"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#0b1a33] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#16294a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1a33] focus-visible:ring-offset-2"
              >
                Browse vehicles <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#0b1a33]/25 px-6 text-sm font-semibold text-[#0b1a33] transition-colors hover:border-[#0b1a33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1a33] focus-visible:ring-offset-2"
              >
                Contact us
              </Link>
            </div>
          </div>
          <p className="mt-5 text-xs leading-5 text-[#857f70]">
            Finance availability and vehicle details are subject to individual
            eligibility and confirmation.
          </p>
        </div>
      </section>
    </main>
  );
}