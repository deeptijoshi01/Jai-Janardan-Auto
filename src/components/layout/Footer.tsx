import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import {
  ArrowUp,
  ChevronRight,
  Compass,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

/* -------------------------------------------------------------------------- */
/*  DATA                                                                      */
/* -------------------------------------------------------------------------- */

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

// Signboard varun ghetlele contact details
const team = [
  {
    name: "Santosh Deshmukh",
    marathi: "श्री. संतोष देशमुख",
    phones: ["9881880312", "8975191999"],
    whatsapp: null as string | null,
  },
  {
    name: "Roshan Deshmukh",
    marathi: "श्री. रोशन देशमुख",
    phones: ["8378913269"],
    whatsapp: "8378913269",
  },
];

const PRIMARY_PHONE = "9881880312"; // Santosh Deshmukh
const WHATSAPP_PHONE = "8378913269"; // Roshan Deshmukh
const WHATSAPP_TEXT = encodeURIComponent(
  "Namaste, mala Jai Janardan Auto kadun vehicle baddal mahiti pahije."
);
// Exact location milale ki ha link Google Maps share link ne replace kara.
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Jai+Janardan+Auto";

const telHref = (n: string) => `tel:+91${n}`;
const waHref = (n: string, text = "") =>
  `https://wa.me/91${n}${text ? `?text=${text}` : ""}`;
const prettyPhone = (n: string) => `${n.slice(0, 5)} ${n.slice(5)}`;
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

/* -------------------------------------------------------------------------- */
/*  STYLES                                                                    */
/* -------------------------------------------------------------------------- */

const linkClass =
  "group inline-flex min-h-10 items-center gap-2 text-[14px] text-[#f5efe0]/65 transition-all duration-300 hover:translate-x-1 hover:text-[#f0d28a] focus:outline-none focus-visible:text-[#f0d28a] focus-visible:underline";

const actionBase =
  "group relative inline-flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-4 text-sm font-semibold transition-all duration-300 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e3be6a] md:w-auto";

const actionPrimary = `${actionBase} bg-gradient-to-r from-[#e3be6a] to-[#b98f3f] text-[#0b1a33] shadow-[0_10px_30px_-10px_rgba(201,162,75,0.7)] hover:shadow-[0_14px_36px_-8px_rgba(227,190,106,0.8)] hover:-translate-y-0.5`;

const actionGhost = `${actionBase} border border-[#c9a24b]/35 bg-white/[0.04] text-[#f5efe0] hover:-translate-y-0.5 hover:border-[#e3be6a] hover:bg-[#c9a24b]/10 hover:text-[#f0d28a]`;

const actionWhatsApp = `${actionBase} border border-emerald-400/30 bg-emerald-400/10 text-emerald-100 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-400/20`;

const keyframes = `
@keyframes jj-float {
  0%, 100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(0,-18px,0) scale(1.06); }
}
@keyframes jj-sweep {
  0% { transform: translateX(-120%) skewX(-18deg); }
  100% { transform: translateX(260%) skewX(-18deg); }
}
@keyframes jj-line {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes jj-ring {
  0% { transform: scale(0.9); opacity: .55; }
  80%, 100% { transform: scale(1.7); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .jj-anim { animation: none !important; }
}
`;

/* -------------------------------------------------------------------------- */
/*  SMALL HELPERS                                                             */
/* -------------------------------------------------------------------------- */

/** Fades + slides content up when it scrolls into view. */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Light sweep that glides across a button on hover. */
function Shine() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:[animation:jj-sweep_0.9s_ease-out]"
    />
  );
}

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
      <h3 className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#fbf7ed]">
        {title}
      </h3>
      <span
        className="mt-2.5 block h-[2px] w-9 rounded-full bg-gradient-to-r from-[#e3be6a] to-transparent"
        aria-hidden="true"
      />
      <div className="mt-4 flex flex-col items-start gap-0.5">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  FOOTER                                                                    */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Normal page link: same page var click kela tar smooth top, navhin page var instant top.
  const handleRouteClick = (to: string) => () => {
    const samePage = pathname === to.split("?")[0].split("#")[0];
    window.scrollTo({ top: 0, behavior: samePage ? "smooth" : "auto" });
  };

  // "/#how-it-works" sarkhe hash links: kontyahi page varun kaam karnar.
  const goToSection = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const scrollNow = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    if (pathname === "/") {
      if (!scrollNow()) window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", `/#${id}`);
      return;
    }

    navigate({ pathname: "/", hash: `#${id}` });
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (scrollNow() || tries > 15) window.clearInterval(timer);
    }, 120);
  };

  return (
    <footer className="relative overflow-hidden bg-[#071326] text-[#f5efe0]">
      <style>{keyframes}</style>

      {/* ambient glows + top gold line */}
      <div
        className="jj-anim pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c9a24b]/10 blur-3xl [animation:jj-float_10s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <div
        className="jj-anim pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#1d3a6b]/30 blur-3xl [animation:jj-float_13s_ease-in-out_infinite_reverse]"
        aria-hidden="true"
      />
      <div
        className="jj-anim pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#c9a24b,#f0d28a,#c9a24b,transparent)] bg-[length:200%_100%] [animation:jj-line_6s_linear_infinite]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* ============ CTA PANEL ============ */}
        <Reveal className="pt-10 sm:pt-12 lg:pt-14">
          <div className="relative overflow-hidden rounded-3xl border border-[#c9a24b]/25 bg-gradient-to-br from-[#0f2347] via-[#0b1c3a] to-[#081529] p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] sm:p-8 lg:p-10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c9a24b]/15 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              {/* headline */}
              <div className="max-w-md">
                <span className="mb-3 block h-[3px] w-10 rounded-full bg-gradient-to-r from-[#e3be6a] to-[#a27e3d]" />
                <p className="font-serif text-[1.65rem] font-semibold leading-tight text-[#fbf7ed] sm:text-3xl">
                  Looking for the Right Vehicle?
                </p>
                <p className="mt-2.5 text-sm leading-6 text-[#f5efe0]/65 sm:text-base">
                  Talk to the Jai Janardan Auto team today.
                </p>

                {/* main actions */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <a href={telHref(PRIMARY_PHONE)} className={actionPrimary}>
                    <Shine />
                    <Phone size={17} aria-hidden="true" />
                    Contact Us
                  </a>
                  <a
                    href={waHref(WHATSAPP_PHONE, WHATSAPP_TEXT)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={actionWhatsApp}
                  >
                    <Shine />
                    <span className="relative flex h-[17px] w-[17px] items-center justify-center">
                      <span
                        className="jj-anim absolute inset-0 rounded-full bg-emerald-400/60 [animation:jj-ring_2.2s_ease-out_infinite]"
                        aria-hidden="true"
                      />
                      <MessageCircle
                        size={17}
                        className="relative text-emerald-300"
                        aria-hidden="true"
                      />
                    </span>
                    WhatsApp Us
                  </a>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={actionGhost}
                  >
                    <Shine />
                    <Compass
                      size={17}
                      className="text-[#c9a24b] transition-transform duration-500 group-hover:rotate-[30deg]"
                      aria-hidden="true"
                    />
                    Get Directions
                  </a>
                </div>
              </div>

              {/* team cards */}
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-xl">
                {team.map((person, i) => (
                  <Reveal key={person.name} delay={150 + i * 120}>
                    <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24b]/50 hover:bg-white/[0.07]">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e3be6a] to-[#a27e3d] text-sm font-bold text-[#0b1a33] ring-2 ring-[#c9a24b]/30 transition-transform duration-500 group-hover:scale-110">
                          {initials(person.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-serif text-base font-semibold text-[#fbf7ed]">
                            {person.name}
                          </p>
                          <p className="truncate text-xs text-[#f5efe0]/50">
                            {person.marathi}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3.5 flex flex-col gap-2">
                        {person.phones.map((num) => (
                          <a
                            key={num}
                            href={telHref(num)}
                            className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#071326]/60 px-3 text-sm font-medium tracking-wide text-[#f5efe0]/90 transition-all duration-300 hover:border-[#e3be6a]/60 hover:text-[#f0d28a] active:scale-[0.98]"
                          >
                            <span className="flex items-center gap-2">
                              <Phone
                                size={14}
                                className="text-[#c9a24b]"
                                aria-hidden="true"
                              />
                              +91 {prettyPhone(num)}
                            </span>
                            <ChevronRight
                              size={15}
                              className="text-[#c9a24b]/60 transition-transform duration-300 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </a>
                        ))}

                        {person.whatsapp && (
                          <a
                            href={waHref(person.whatsapp, WHATSAPP_TEXT)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 text-sm font-medium text-emerald-100 transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-400/20 active:scale-[0.98]"
                          >
                            <span className="flex items-center gap-2">
                              <MessageCircle
                                size={14}
                                className="text-emerald-300"
                                aria-hidden="true"
                              />
                              Chat on WhatsApp
                            </span>
                            <ChevronRight
                              size={15}
                              className="text-emerald-300/70"
                              aria-hidden="true"
                            />
                          </a>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ============ MAIN GRID ============ */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:py-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-x-12 lg:py-16">
          {/* Brand */}
          <Reveal className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              onClick={handleRouteClick("/")}
              aria-label="Jai Janardan Auto home"
              className="inline-flex rounded-xl bg-white p-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-[#c9a24b]/40 transition-all duration-300 hover:-translate-y-0.5 hover:ring-[#c9a24b]"
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

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-2 text-sm text-[#f5efe0]/60 transition hover:text-[#f0d28a]"
            >
              <MapPin
                size={15}
                className="text-[#c9a24b] transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              View on Google Maps
            </a>
          </Reveal>

          <Reveal delay={100}>
            <FooterLinkColumn title="Quick Links">
              {quickLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={handleRouteClick(to)}
                  className={linkClass}
                >
                  <LinkDash />
                  {label}
                </Link>
              ))}
            </FooterLinkColumn>
          </Reveal>

          <Reveal delay={200}>
            <FooterLinkColumn title="Support">
              <a
                href="/#how-it-works"
                onClick={goToSection("how-it-works")}
                className={linkClass}
              >
                <LinkDash />
                How It Works
              </a>
              <a href={telHref(PRIMARY_PHONE)} className={linkClass}>
                <LinkDash />
                Call Us
              </a>
              <a
                href={waHref(WHATSAPP_PHONE, WHATSAPP_TEXT)}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <LinkDash />
                WhatsApp
              </a>
            </FooterLinkColumn>
          </Reveal>

          <Reveal delay={300} className="col-span-2 lg:col-span-1">
            <FooterLinkColumn title="Vehicle Categories">
              {vehicleCategories.map(({ label, category }) => (
                <Link
                  key={label}
                  to={`/vehicles?category=${category}`}
                  onClick={handleRouteClick("/vehicles")}
                  className={linkClass}
                >
                  <LinkDash />
                  {label}
                </Link>
              ))}
            </FooterLinkColumn>
          </Reveal>
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
              className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c9a24b]/40 bg-white/[0.04] text-[#e3be6a] transition-all duration-300 hover:-translate-y-1 hover:bg-[#c9a24b] hover:text-[#0b1a33] hover:shadow-[0_10px_24px_-8px_rgba(227,190,106,0.8)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24b]"
            >
              <ArrowUp
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}