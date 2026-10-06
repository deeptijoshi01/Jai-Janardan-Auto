import type { ReactNode } from "react";
import {
  BadgeCheck,
  Handshake,
  Headset,
  IndianRupee,
  ArrowRight,
  Search,
  ClipboardCheck,
  PhoneCall,
  KeyRound,
  SlidersHorizontal,
  Zap,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

// File location: src/components/home/WhyChooseAndHowItWorks.tsx
// Images:        src/assets/why_to_choose/sell.png, finance.png
import sellImage from "../../assets/why_to_choose/sell.png";
import financeImage from "../../assets/why_to_choose/finance.png";

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type PerkItem = {
  label: string;
  icon: LucideIcon;
};

const whyChooseItems: FeatureItem[] = [
  {
    title: "Verified Vehicles",
    description: "Carefully inspected vehicles for confident buying.",
    icon: BadgeCheck,
  },
  {
    title: "Transparent Pricing",
    description: "Clear and competitive vehicle pricing.",
    icon: IndianRupee,
  },
  {
    title: "Expert Guidance",
    description: "Professional assistance from selection to purchase.",
    icon: Headset,
  },
  {
    title: "Trusted Dealership",
    description: "Reliable support for buying and selling vehicles.",
    icon: Handshake,
  },
];

const buyingSteps: FeatureItem[] = [
  {
    title: "Explore",
    description: "Find the right vehicle for your business.",
    icon: Search,
  },
  {
    title: "Inspect",
    description: "Review details, specifications and images.",
    icon: ClipboardCheck,
  },
  {
    title: "Connect",
    description: "Speak with our team and get the information you need.",
    icon: PhoneCall,
  },
  {
    title: "Drive Away",
    description: "Complete the deal with confidence.",
    icon: KeyRound,
  },
];

const financePerks: PerkItem[] = [
  { label: "Flexible Options", icon: SlidersHorizontal },
  { label: "Quick Processing", icon: Zap },
  { label: "Expert Assistance", icon: UserCheck },
];

/* ---------- Reusable section heading ---------- */
type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  children?: ReactNode;
};

function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  children,
}: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="flex gap-4">
        <span
          className="mt-1 hidden h-[72px] w-[3px] shrink-0 rounded-full bg-gradient-to-b from-[#e3be6a] to-[#a27e3d] sm:block"
          aria-hidden="true"
        />
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#c9a24b]" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#b08a43]">
              {eyebrow}
            </span>
          </div>
          <h2 className="mt-2 font-serif text-[1.75rem] font-semibold leading-tight tracking-tight text-[#0b1a33] sm:text-4xl">
            {title} <span className="text-[#b8903f]">{highlight}</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b7686] sm:text-[15px]">
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function WhyChooseAndHowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf7] py-12 sm:py-16 lg:py-20">
      {/* soft background glow */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#c9a24b]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl space-y-14 px-4 sm:space-y-20 sm:px-6 lg:space-y-24 lg:px-10">
        {/* ================= WHY CHOOSE ================= */}
        <div>
          <SectionHeading
            eyebrow="Our advantage"
            title="Why Choose"
            highlight="Jai Janardan Auto?"
            subtitle="More than just a marketplace — we are your long-term business partner."
          >
            <div className="hidden shrink-0 text-right sm:block">
              <p className="font-serif text-5xl font-semibold leading-none text-[#c9a24b]">
                10+
              </p>
              <p className="mt-1 text-xs text-[#8a7340]">Years of Trust</p>
              <span className="mt-2 block h-px w-full bg-gradient-to-r from-transparent to-[#c9a24b]/70" />
            </div>
          </SectionHeading>

          <div className="mt-8 grid grid-cols-1 gap-3.5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {whyChooseItems.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="group relative flex items-start gap-4 rounded-2xl border border-[#ece5d6] bg-white p-5 shadow-[0_6px_24px_rgba(11,26,51,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#c9a24b]/60 hover:shadow-[0_18px_40px_rgba(11,26,51,0.10)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f6e7bd] to-[#dcb867] text-[#0b1a33] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)] transition group-hover:scale-105">
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 pr-5">
                  <h3 className="text-[15px] font-bold text-[#0b1a33]">
                    {title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-5 text-[#707986]">
                    {description}
                  </p>
                </div>
                <ArrowRight
                  size={15}
                  className="absolute bottom-4 right-4 text-[#c9a24b] transition group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </article>
            ))}
          </div>
        </div>

        {/* ================= HOW IT WORKS ================= */}
        <div id="how-it-works">
          <SectionHeading
            eyebrow="How it works"
            title="Buying a Vehicle"
            highlight="Made Simple"
            subtitle="A hassle-free process from search to ownership."
          />

          <ol className="relative mt-9 space-y-6 before:absolute before:bottom-8 before:left-[27px] before:top-8 before:w-px before:bg-gradient-to-b before:from-[#c9a24b]/70 before:to-[#c9a24b]/10 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:space-y-0 sm:before:hidden lg:grid-cols-4 lg:gap-x-4">
            {buyingSteps.map(({ title, description, icon: Icon }, index) => (
              <li
                key={title}
                className="relative flex items-start gap-4 lg:pr-8"
              >
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#e2cf9f] bg-[#fdf6e3] text-[#0b1a33] shadow-[0_0_0_5px_#fbfaf7,0_8px_20px_rgba(201,162,75,0.25)]">
                  <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0b1a33] text-[10px] font-bold text-[#e3be6a]">
                    {index + 1}
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-bold text-[#0b1a33]">
                    {title}
                  </h3>
                  <p className="mt-1 max-w-[15rem] text-[13px] leading-5 text-[#707986]">
                    {description}
                  </p>
                </div>
                {index !== buyingSteps.length - 1 && (
                  <ArrowRight
                    size={16}
                    className="absolute right-2 top-5 hidden text-[#c9a24b] lg:block"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* ================= CTA BANNERS ================= */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          {/* ---- Sell ---- */}
          <article
            id="sell"
            className="group relative isolate flex min-h-[320px] overflow-hidden rounded-3xl bg-[#0b1a33] shadow-[0_20px_50px_rgba(11,26,51,0.25)] ring-1 ring-[#c9a24b]/25 sm:min-h-[300px]"
          >
            <img
              src={sellImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center] transition duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b1a33] via-[#0b1a33]/70 to-[#0b1a33]/10 sm:bg-gradient-to-r sm:from-[#0b1a33] sm:via-[#0b1a33]/75 sm:to-transparent"
              aria-hidden="true"
            />
            <div className="mt-auto flex max-w-sm flex-col items-start p-6 sm:my-auto sm:p-8 lg:p-10">
              <h3 className="font-serif text-3xl font-semibold leading-tight text-white sm:text-[2rem]">
                Have a Vehicle
                <br />
                to Sell?
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-white/75">
                Get your vehicle in front of serious buyers through Jai
                Janardan Auto.
              </p>
              <a
                href="#sell-your-vehicle"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#e3be6a] to-[#c9a24b] px-5 py-3 text-sm font-bold text-[#0b1a33] shadow-[0_10px_24px_rgba(201,162,75,0.35)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1a33]"
              >
                Sell Your Vehicle
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </article>

          {/* ---- Finance ---- */}
          <article
            id="finance"
            className="group relative isolate flex min-h-[340px] overflow-hidden rounded-3xl bg-[#0b1a33] shadow-[0_20px_50px_rgba(11,26,51,0.25)] ring-1 ring-[#c9a24b]/25 sm:min-h-[300px]"
          >
            <img
              src={financeImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center] transition duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b1a33] via-[#0b1a33]/75 to-[#0b1a33]/10 sm:bg-gradient-to-r sm:from-[#0b1a33] sm:via-[#0b1a33]/75 sm:to-transparent"
              aria-hidden="true"
            />
            <div className="mt-auto flex w-full flex-col items-start p-6 sm:my-auto sm:max-w-md sm:p-8 lg:p-10">
              <h3 className="font-serif text-3xl font-semibold leading-tight text-white sm:text-[2rem]">
                Need Finance
                <br />
                for Your Vehicle?
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-white/75">
                Easy financing support to help you move forward.
              </p>
              <a
                href="#finance-enquiry"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#e3be6a] to-[#c9a24b] px-5 py-3 text-sm font-bold text-[#0b1a33] shadow-[0_10px_24px_rgba(201,162,75,0.35)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1a33]"
              >
                Explore Finance
                <ArrowRight size={16} aria-hidden="true" />
              </a>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4">
                {financePerks.map(({ label, icon: Icon }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-xs text-white/80"
                  >
                    <Icon
                      size={14}
                      className="text-[#e3be6a]"
                      aria-hidden="true"
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}