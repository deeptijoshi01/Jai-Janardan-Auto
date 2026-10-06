import { ArrowUp, Compass, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import logo from "../../assets/logo.png";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Buy Vehicles", to: "/vehicles" },
  { label: "Sell Your Vehicle", to: "/sell-your-vehicle" },
];

const vehicleCategories = [
  { label: "Commercial Vehicles", category: "commercial" },
  { label: "Cars", category: "cars" },
  { label: "Tippers", category: "commercial" },
  { label: "Trailers", category: "commercial" },
  { label: "LCV / HCV", category: "commercial" },
];

const supportLinks = [{ label: "How It Works", to: "/#how-it-works" }];

// Contact actions are intentionally disabled until real details are configured.
// When ready, replace each <button disabled> with <a href="tel:..."> / wa.me / maps link.
const contactActions = [
  {
    label: "Contact Us",
    icon: Phone,
    title: "Contact details have not been configured yet.",
  },
  {
    label: "WhatsApp Us",
    icon: MessageCircle,
    title: "WhatsApp details have not been configured yet.",
  },
  {
    label: "Get Directions",
    icon: Compass,
    title: "Business directions have not been configured yet.",
  },
];

const linkClass =
  "group inline-flex min-h-9 items-center gap-2 text-[14px] text-[#f5efe0]/65 transition hover:text-[#f0d28a] focus:outline-none focus-visible:text-[#f0d28a] focus-visible:underline";

const disabledActionClass =
  "inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-[#f5efe0]/50 md:w-auto";

export default function Footer() {
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden bg-[#071326] text-[#f5efe0]">
      {/* ambient glow + top gold line */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c9a24b]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#1d3a6b]/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a24b] to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* ============ CTA PANEL ============ */}
        <div className="-mb-px pt-10 sm:pt-12 lg:pt-14">
          <div className="relative overflow-hidden rounded-3xl border border-[#c9a24b]/25 bg-gradient-to-br from-[#0f2347] via-[#0b1c3a] to-[#081529] p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] sm:p-8 lg:p-10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c9a24b]/15 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between md:gap-10">
              <div className="max-w-md">
                <span className="mb-3 block h-[3px] w-10 rounded-full bg-gradient-to-r from-[#e3be6a] to-[#a27e3d]" />
                <p className="font-serif text-[1.65rem] font-semibold leading-tight text-[#fbf7ed] sm:text-3xl">
                  Looking for the Right Vehicle?
                </p>
                <p className="mt-2.5 text-sm leading-6 text-[#f5efe0]/65 sm:text-base">
                  Talk to the Jai Janardan Auto team today.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:flex md:flex-wrap md:justify-end">
                {contactActions.map(({ label, icon: Icon, title }) => (
                  <button
                    key={label}
                    type="button"
                    disabled
                    title={title}
                    className={disabledActionClass}
                  >
                    <Icon
                      size={17}
                      className="text-[#c9a24b]/70"
                      aria-hidden="true"
                    />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============ MAIN GRID ============ */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:py-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-x-12 lg:py-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              aria-label="Jai Janardan Auto home"
              className="inline-flex rounded-xl bg-white p-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-[#c9a24b]/40 transition hover:ring-[#c9a24b]"
            >
              <img
                src={logo}
                alt="Jai Janardan Auto"
                className="h-12 w-auto max-w-[156px] object-contain"
              />
            </Link>

            <h2 className="mt-5 font-serif text-2xl font-semibold text-[#fbf7ed]">
              Jai Janardan Auto
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#f5efe0]/60">
              Your trusted partner for commercial vehicles. Buy, Sell and
              Finance with confidence.
            </p>
          </div>

          <FooterLinkColumn title="Quick Links">
            {quickLinks.map(({ label, to }) => (
              <Link key={to} to={to} className={linkClass}>
                <LinkDash />
                {label}
              </Link>
            ))}
          </FooterLinkColumn>

          <FooterLinkColumn title="Support">
            {supportLinks.map(({ label, to }) => (
              <Link key={to} to={to} className={linkClass}>
                <LinkDash />
                {label}
              </Link>
            ))}
          </FooterLinkColumn>

          <div className="col-span-2 lg:col-span-1">
            <FooterLinkColumn title="Vehicle Categories">
              {vehicleCategories.map(({ label, category }) => (
                <Link
                  key={label}
                  to={`/vehicles?category=${category}`}
                  className={linkClass}
                >
                  <LinkDash />
                  {label}
                </Link>
              ))}
            </FooterLinkColumn>
          </div>
        </div>

        {/* ============ BOTTOM BAR ============ */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-[#f5efe0]/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Jai Janardan Auto. All rights reserved.</p>

          <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
            <p className="flex items-center gap-2 tracking-wide">
              Vehicles <span className="text-[#c9a24b]">•</span> People
              <span className="text-[#c9a24b]">•</span> Progress
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c9a24b]/40 bg-white/[0.04] text-[#e3be6a] transition hover:bg-[#c9a24b] hover:text-[#0b1a33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24b]"
            >
              <ArrowUp size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* small gold dash that grows on hover */
function LinkDash() {
  return (
    <span
      className="h-px w-3 bg-[#c9a24b]/50 transition-all duration-300 group-hover:w-5 group-hover:bg-[#e3be6a]"
      aria-hidden="true"
    />
  );
}

function FooterLinkColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-[#fbf7ed]">{title}</h3>
      <span
        className="mt-2 block h-[2px] w-8 rounded-full bg-gradient-to-r from-[#e3be6a] to-transparent"
        aria-hidden="true"
      />
      <div className="mt-4 flex flex-col items-start gap-0.5">{children}</div>
    </div>
  );
}