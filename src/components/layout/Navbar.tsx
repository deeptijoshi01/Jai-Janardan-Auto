import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";

/* Palette: navy #0b1a33, ink #060d1a, gold #c9a24b, gold light #e6c97a, ivory #f5efe0 */

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Buy Vehicles", path: "/vehicles" },
  { name: "Sell Your Vehicle", path: "/sell-your-vehicle" },
  { name: "Finance", path: "/finance" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const assurances = ["Verified Documents", "Finance Support", "Expert Guidance"];

const fontCss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap');
.nav-sans{font-family:'Manrope',system-ui,sans-serif}
.nav-serif{font-family:'Playfair Display',Georgia,serif}
`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6c97a]";

const isActivePath = (path: string, pathname: string) =>
  path === "/" ? pathname === "/" : pathname.startsWith(path);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  // Scroll progress line along the bottom edge of the header
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    restDelta: 0.001,
  });
  const progress = reduceMotion ? scrollYProgress : smoothProgress;

  // Header compacts slightly once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock page scroll, close on Escape, close when resized to desktop
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const activeLink = navLinks.find((l) => isActivePath(l.path, pathname))?.path;
  const indicator = hovered ?? activeLink ?? null;

  return (
    <header
      className={`nav-sans fixed inset-x-0 top-0 z-50 w-full border-b border-white/10 bg-[#0b1a33]/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled || menuOpen
          ? "shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)]"
          : "shadow-none"
      }`}
    >
      <style>{fontCss}</style>

      {/* Fine gold rule along the very top edge */}
      <div
        aria-hidden="true"
        className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#c9a24b] to-transparent"
      />

      <nav
        className={`mx-auto flex max-w-[1320px] items-center justify-between px-5 transition-[height] duration-300 sm:px-8 lg:px-10 ${
          scrolled ? "h-14 lg:h-[68px]" : "h-16 lg:h-[78px]"
        }`}
        aria-label="Main"
      >
        {/* Logo */}
        <Link
          to="/"
          className={`flex shrink-0 items-center rounded-md ${focusRing}`}
          aria-label="Jai Janardan Auto home"
        >
          <span className="rounded-md bg-white p-1 ring-1 ring-[#c9a24b]/60 ring-offset-2 ring-offset-[#0b1a33]">
            <img
              src={logo}
              alt="Jai Janardan Auto"
              className={`w-auto max-w-[120px] object-contain transition-[height] duration-300 lg:max-w-[150px] ${
                scrolled ? "h-8 sm:h-9 lg:h-10" : "h-9 sm:h-10 lg:h-11"
              }`}
            />
          </span>
        </Link>

        {/* Desktop navigation with a sliding gold indicator */}
        <ul
          className="hidden flex-1 items-center justify-center lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {navLinks.map((link) => {
            const active = isActivePath(link.path, pathname);
            return (
              <li key={link.path} className="relative">
                <NavLink
                  to={link.path}
                  end={link.path === "/"}
                  onMouseEnter={() => setHovered(link.path)}
                  onFocus={() => setHovered(link.path)}
                  onBlur={() => setHovered(null)}
                  className={`relative block whitespace-nowrap px-3 py-3 text-[13.5px] font-semibold tracking-[0.02em] transition-colors duration-200 xl:px-4 xl:text-sm ${focusRing} ${
                    active || hovered === link.path
                      ? "text-[#f5efe0]"
                      : "text-[#f5efe0]/65"
                  } ${active ? "!text-[#e6c97a]" : ""}`}
                >
                  {link.name}
                </NavLink>
                {indicator === link.path && (
                  <motion.span
                    layoutId="nav-indicator"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-3 -bottom-px h-[2px] bg-[#c9a24b] xl:inset-x-4"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 520, damping: 42 }
                    }
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <Link
          to="/sell-your-vehicle"
          className={`group hidden h-11 shrink-0 items-center gap-2 rounded-md bg-[#e6c97a] px-5 text-sm font-bold text-[#0b1a33] transition-colors hover:bg-[#f2d98f] lg:inline-flex ${focusRing}`}
        >
          List your vehicle
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`flex h-11 w-11 items-center justify-center rounded-md border border-[#c9a24b]/50 text-[#e6c97a] transition-colors hover:bg-[#c9a24b]/10 lg:hidden ${focusRing}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-[#c9a24b] to-[#e6c97a]"
      />

      {/* Mobile menu: full-height panel under the bar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 top-[66px] overflow-y-auto overscroll-contain bg-[#0b1a33] lg:hidden"
          >
            <div className="mx-auto flex min-h-full max-w-[1320px] flex-col px-5 pb-8 pt-2 sm:px-8">
              <ul className="border-t border-white/10">
                {navLinks.map((link, i) => {
                  const active = isActivePath(link.path, pathname);
                  return (
                    <motion.li
                      key={link.path}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.28,
                        delay: reduceMotion ? 0 : 0.04 + i * 0.045,
                        ease: "easeOut",
                      }}
                      className="border-b border-white/10"
                    >
                      <NavLink
                        to={link.path}
                        end={link.path === "/"}
                        className={`group flex min-h-[60px] items-center gap-4 py-3 ${focusRing} ${
                          active ? "text-[#e6c97a]" : "text-[#f5efe0]"
                        }`}
                      >
                        <span className="w-6 text-xs font-bold tracking-widest text-[#c9a24b]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="nav-serif flex-1 text-[1.5rem] font-medium leading-tight">
                          {link.name}
                        </span>
                        <ArrowRight
                          size={18}
                          className={`transition-all duration-200 ${
                            active
                              ? "translate-x-0 text-[#e6c97a] opacity-100"
                              : "-translate-x-1 text-[#c9a24b] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        />
                      </NavLink>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Bottom block: CTA + assurances */}
              <div className="mt-auto pt-8">
                <div className="rounded-md border border-[#c9a24b]/30 bg-white/[0.03] p-5">
                  <p className="nav-serif text-xl font-medium text-[#f5efe0]">
                    Have a vehicle to sell?
                  </p>
                  <p className="mt-1 text-sm text-[#f5efe0]/60">
                    List it with Jai Janardan Auto.
                  </p>
                  <Link
                    to="/sell-your-vehicle"
                    className={`mt-4 flex h-12 items-center justify-center gap-2 rounded-md bg-[#e6c97a] text-sm font-bold text-[#0b1a33] transition-colors hover:bg-[#f2d98f] ${focusRing}`}
                  >
                    List your vehicle
                    <ArrowUpRight size={16} />
                  </Link>
                </div>

                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {assurances.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2 text-xs font-medium text-[#f5efe0]/60"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rotate-45 bg-[#c9a24b]"
                      />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}