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
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

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
    description: "Assistance throughout the buying and selling journey.",
    icon: Handshake,
  },
];

const vehicleCategories = [
  { name: "Mini Trucks", description: "Compact vehicles for last-mile delivery and city operations." },
  { name: "Pickup Trucks", description: "Versatile transport vehicles for everyday business needs." },
  { name: "Trucks", description: "Reliable options for larger commercial loads." },
  { name: "Tippers", description: "Built for construction, sand, aggregate and site operations." },
  { name: "Trailers", description: "Practical solutions for long-haul and freight movement." },
  { name: "Transit Mixers", description: "Specialized vehicles for construction and concrete operations." },
  { name: "Cars & SUVs", description: "Passenger vehicles for business and family requirements." },
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
    description: "Get helpful support throughout the buying or selling journey.",
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
  "mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#0b1a33] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]";

const bodyText =
  "text-sm leading-6 text-[#687181] sm:text-[15px] sm:leading-7";

export default function About() {
  const reduceMotion = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 20 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <main className="overflow-x-hidden bg-[#fbfaf7] text-[#172238]">
      {/* HERO SECTION */}
      <section className="relative px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-36 lg:px-10 lg:pb-24">
        {/* Decorative background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(232,196,120,0.2)_0%,rgba(232,196,120,0)_70%)]"></div>
          <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(11,26,51,0.04)_0%,rgba(11,26,51,0)_70%)]"></div>
        </div>

        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div {...reveal()}>
            <p className={sectionEyebrow}>About Us</p>
            <span className="mt-4 block h-[2px] w-16 bg-[#c9a24b]" />
            <h1 className="mt-5 max-w-2xl font-serif text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-[#0b1a33] sm:text-5xl lg:text-[3.75rem]">
              Moving Businesses Forward,
              <span className="mt-1 block text-[#9b7837]">
                One Vehicle at a Time.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-6 text-[#667080] sm:text-base sm:leading-7">
              We help businesses find reliable pre-owned commercial vehicles
              that match their work, budget and transportation needs.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
              <Link
                to="/vehicles"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0b1a33] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#14294c] hover:shadow-[0_10px_25px_-10px_rgba(11,26,51,0.5)]"
              >
                Browse Vehicles 
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/sell-your-vehicle"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d8c99f] bg-[#fffdf8] px-6 py-3 text-sm font-semibold text-[#66501f] transition-all duration-300 hover:bg-[#f5efdf] hover:border-[#c9a24b]"
              >
                Sell Your Vehicle <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Abstract Premium Visual Block instead of Image */}
          <motion.div {...reveal(0.1)} className="relative hidden lg:block">
            <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-3xl border border-[#e4ddcf] bg-[#fffdf8]"></div>
            <div className="relative overflow-hidden rounded-3xl border border-[#e4ddcf] bg-[#0b1a33] p-10 shadow-[0_30px_80px_-40px_rgba(11,26,51,0.5)]">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(228,190,100,0.25)_0%,rgba(228,190,100,0)_70%)]"></div>
              <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(40,80,150,0.3)_0%,rgba(40,80,150,0)_70%)]"></div>
              
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center gap-4 text-[#e4c578]">
                  <Sparkles size={24} strokeWidth={1.5} />
                  <p className="text-xs font-bold uppercase tracking-[0.2em]">Commercial Mobility</p>
                </div>
                
                <div className="my-12">
                  <p className="font-serif text-4xl font-bold leading-tight text-white xl:text-5xl">
                    "Simplicity meets reliability in every transaction."
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 border-t border-white/15 pt-6">
                  <div>
                    <p className="font-serif text-3xl font-bold text-[#e4c578]">14+</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-white/60">Finance Partners</p>
                  </div>
                  <div>
                    <p className="font-serif text-3xl font-bold text-[#e4c578]">7+</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-white/60">Vehicle Types</p>
                  </div>
                  <div>
                    <p className="font-serif text-3xl font-bold text-[#e4c578]">100%</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-white/60">Transparency</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="border-y border-[#eee8dc] bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div {...reveal()} className="order-1 lg:order-1">
            <p className={sectionEyebrow}>Who We Are</p>
            <h2 className={sectionTitle}>
              A Trusted Partner for Commercial Mobility
            </h2>
            <span className="mt-5 block h-[2px] w-12 bg-[#c9a24b]" />
            <p className={`mt-6 ${bodyText}`}>
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
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#eee8dc] bg-[#fcfaf3] p-5 transition-shadow duration-300 hover:shadow-[0_10px_30px_-15px_rgba(11,26,51,0.1)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3ecdc] text-[#92702e]">
                  <ShieldCheck size={20} strokeWidth={1.5} />
                </div>
                <h4 className="mt-4 font-serif text-base font-bold text-[#0b1a33]">Trusted Process</h4>
                <p className="mt-1 text-xs text-[#687181]">Verified details and transparent pricing.</p>
              </div>
              <div className="rounded-2xl border border-[#eee8dc] bg-[#fcfaf3] p-5 transition-shadow duration-300 hover:shadow-[0_10px_30px_-15px_rgba(11,26,51,0.1)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3ecdc] text-[#92702e]">
                  <Truck size={20} strokeWidth={1.5} />
                </div>
                <h4 className="mt-4 font-serif text-base font-bold text-[#0b1a33]">Wide Range</h4>
                <p className="mt-1 text-xs text-[#687181]">Options for every business requirement.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div {...reveal(0.08)} className="relative order-2 lg:order-2">
            <div className="relative overflow-hidden rounded-[28px] border border-[#e7e1d5] bg-[#0b1a33] p-8 shadow-[0_25px_60px_-30px_rgba(11,26,51,0.4)] sm:p-12">
              <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(228,190,100,0.2)_0%,rgba(228,190,100,0)_70%)]"></div>
              
              <div className="relative z-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e4c578] text-[#0b1a33]">
                  <BadgeCheck size={24} strokeWidth={1.5} />
                </span>
                
                <blockquote className="mt-8 font-serif text-xl font-medium leading-relaxed text-white sm:text-2xl sm:leading-relaxed">
                  "Bringing practical options together in one place, making vehicle discovery easier for businesses."
                </blockquote>
                
                <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4c578]/40 text-[#e4c578]">
                    <Handshake size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Dedicated Support</p>
                    <p className="text-xs text-white/60">Assistance at every step</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <motion.div {...reveal()} className="max-w-2xl">
            <p className={sectionEyebrow}>What We Offer</p>
            <h2 className={sectionTitle}>
              Everything You Need to Move Your Business Forward
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {offers.map(({ number, title, description, icon: Icon }, index) => (
              <motion.article
                key={number}
                {...reveal(index * 0.05)}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-[#e7e1d5] bg-white p-6 shadow-[0_8px_30px_-20px_rgba(11,26,51,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d7c28f] hover:shadow-[0_20px_40px_-22px_rgba(11,26,51,0.35)] sm:p-7"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_62%,rgba(236,214,160,0.35)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e6d7b2] bg-[#faf6eb] text-[#967333] transition-colors duration-300 group-hover:bg-[#0b1a33] group-hover:text-[#e4c578] group-hover:border-[#0b1a33]">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <span className="font-serif text-3xl font-bold text-[#e9e3d6] transition-colors duration-300 group-hover:text-[#d7c28f]">
                    {number}
                  </span>
                </div>
                <h3 className="relative mt-6 font-serif text-lg font-semibold text-[#0b1a33] sm:text-xl">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-6 text-[#737b88]">
                  {description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* VEHICLE RANGE - No Images, Elegant Typography */}
      <section className="border-y border-[#eee8dc] bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <motion.div {...reveal()} className="max-w-2xl">
            <p className={sectionEyebrow}>Our Vehicle Range</p>
            <h2 className={sectionTitle}>Vehicles Built for Every Business</h2>
            <p className={`mt-4 ${bodyText}`}>
              From everyday delivery vehicles to heavy-duty commercial
              transport, explore vehicle options designed for different
              business needs.
            </p>
          </motion.div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-12 lg:grid-cols-4">
            {vehicleCategories.map(({ name, description }, index) => (
              <motion.article
                key={name}
                {...reveal(index * 0.03)}
                className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-[#e7e1d5] bg-[#fbfaf7] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d7c28f] hover:shadow-[0_20px_40px_-20px_rgba(11,26,51,0.25)] sm:p-6"
              >
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[#f3ecdc] transition-transform duration-500 group-hover:scale-150"></div>
                <div className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e6d7b2] bg-white text-[#967333] group-hover:bg-[#0b1a33] group-hover:text-[#e4c578] group-hover:border-[#0b1a33] transition-colors duration-300">
                    <Truck size={18} strokeWidth={1.7} />
                  </span>
                </div>
                <div className="relative mt-6">
                  <h3 className="font-serif text-base font-bold text-[#0b1a33] sm:text-lg">
                    {name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#707887] sm:text-[13px] sm:leading-6">
                    {description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <motion.div {...reveal()} className="lg:sticky lg:top-28 lg:self-start">
            <p className={sectionEyebrow}>Why Choose Us</p>
            <h2 className={sectionTitle}>Built Around Your Business Needs</h2>
            <p className={`mt-5 ${bodyText}`}>
              Choosing a commercial vehicle is a business decision. We focus on
              making that decision easier with practical vehicle options,
              clear information and customer-focused support.
            </p>
            <div className="mt-8 hidden lg:block">
               <div className="rounded-2xl border border-[#e7e1d5] bg-white p-6 shadow-[0_10px_30px_-20px_rgba(11,26,51,0.3)]">
                 <p className="font-serif text-lg font-semibold text-[#0b1a33]">Need help choosing?</p>
                 <p className="mt-1 text-sm text-[#687181]">Our experts are ready to assist you.</p>
                 <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#a47d32] hover:text-[#92702e]">
                   Talk to an expert <ArrowRight size={14} />
                 </Link>
               </div>
            </div>
          </motion.div>
          <div className="border-t border-[#ded8cb]">
            {advantages.map(({ number, title, description }, index) => (
              <motion.div
                key={number}
                {...reveal(index * 0.05)}
                className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-[#ded8cb] py-7 transition-colors duration-300 hover:bg-[#fffdf8] sm:grid-cols-[4rem_1fr] sm:gap-6 sm:py-8"
              >
                <span className="font-serif text-2xl text-[#ae8b48] transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
                  {number}
                </span>
                <div className="sm:flex sm:items-start sm:justify-between sm:gap-6">
                  <h3 className="font-serif text-lg font-semibold text-[#0b1a33] sm:min-w-[14rem] sm:text-xl">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#737b88] sm:mt-0">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="border-y border-[#eee8dc] bg-[#f5f1e7] px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <motion.div {...reveal()}>
            <p className={sectionEyebrow}>How We Work</p>
            <h2 className={sectionTitle}>A Simple Way to Get Moving</h2>
          </motion.div>
          <div className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-[#d6c69f] lg:block"></div>
            {steps.map(({ number, title, description, icon: Icon }, index) => (
              <motion.article
                key={number}
                {...reveal(index * 0.06)}
                className="relative flex gap-5 sm:gap-6 lg:block"
              >
                <span className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#d6c69f] bg-[#fbfaf7] text-[#92702e] transition-all duration-300 hover:bg-[#0b1a33] hover:text-[#e4c578] hover:border-[#0b1a33] lg:h-20 lg:w-20">
                  <Icon size={28} strokeWidth={1.5} />
                </span>
                <div className="pb-4 lg:mt-7">
                  <p className="text-[11px] font-extrabold tracking-[0.18em] text-[#a47d32]">
                    STEP {number}
                  </p>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-[#0b1a33] lg:text-2xl">
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

      {/* SELL WITH US CTA */}
      <section className="relative isolate overflow-hidden bg-[#0b1a33] px-5 py-16 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(228,190,100,0.2)_0%,rgba(228,190,100,0)_70%)]"></div>
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(40,80,150,0.3)_0%,rgba(40,80,150,0)_70%)]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 fill=%22none%22><circle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(255,255,255,0.03)%22/></svg>')]" />
        </div>
        
        <div className="mx-auto flex max-w-[1320px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-12">
          <div className="max-w-2xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#e4c578]">
              Sell With Us
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
              Have a Vehicle to Sell?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              Turn your commercial vehicle into an opportunity. Submit your
              vehicle details and let our team take the process forward.
            </p>
          </div>
          <Link
            to="/sell-your-vehicle"
            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#f3d588] to-[#d9b952] px-7 py-3 text-sm font-bold text-[#0b1a33] shadow-[0_10px_25px_-10px_rgba(189,151,73,0.5)] transition-all duration-300 hover:shadow-[0_15px_30px_-10px_rgba(189,151,73,0.6)] hover:brightness-105"
          >
            Sell Your Vehicle 
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* FINANCE SUPPORT */}
      <section className="border-b border-[#eee8dc] bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-[1240px]">
          <div className="relative overflow-hidden rounded-3xl border border-[#e7e1d5] bg-[#fbfaf7] p-8 sm:p-12 lg:p-16">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(232,196,120,0.25)_0%,rgba(232,196,120,0)_70%)]"></div>
            
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_0.55fr_auto] lg:gap-12">
              <div className="max-w-2xl">
                <p className={sectionEyebrow}>Finance Support</p>
                <h2 className={sectionTitle}>Need Finance for Your Vehicle?</h2>
                <p className={`mt-4 ${bodyText}`}>
                  Explore finance options and estimate your monthly EMI before
                  making your decision. We partner with leading lenders to
                  provide suitable financial solutions.
                </p>
              </div>
              
              <div className="hidden h-32 w-32 items-center justify-center rounded-full border border-[#e6d7b2] bg-[#faf6eb] text-[#967333] shadow-inner sm:flex lg:h-40 lg:w-40">
                <Sparkles size={48} strokeWidth={1.2} />
              </div>
              
              <Link
                to="/finance"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d8c99f] bg-[#fbf7ed] px-7 py-3 text-sm font-bold text-[#705722] transition-all duration-300 hover:bg-[#f2ead6] hover:border-[#c9a24b] lg:justify-self-end"
              >
                Explore Finance 
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 border border-[#e7e1d5] bg-[#f5f1e7] p-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-9">
          <div className="max-w-2xl">
            <h2 className="font-serif text-xl font-semibold leading-tight text-[#0b1a33] sm:text-2xl">
              Let&apos;s Find the Right Vehicle for Your Business.
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#697181]">
              Explore our available vehicles or speak with us about your next
              commercial vehicle requirement.
            </p>
          </div>
          <div className="flex flex-col gap-3 min-[420px]:flex-row">
            <Link
              to="/vehicles"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b1a33] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#14294c] hover:shadow-lg"
            >
              Browse Vehicles 
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d8c99f] bg-white px-5 py-2.5 text-sm font-semibold text-[#705722] transition-all duration-300 hover:bg-[#fbf7ed] hover:border-[#c9a24b]"
            >
              Contact Us <ChevronRight size={15} />
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-[1320px] text-xs leading-5 text-[#858174]">
          Finance availability and vehicle details are subject to individual
          eligibility and confirmation.
        </p>
      </section>
    </main>
  );
}