import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronRight, Truck } from "lucide-react";
import logo from "../../assets/logo.png";

/* Royal palette: ink #060d1a, navy #0b1a33, gold #c9a24b, gold light #e6c97a, ivory #f5efe0 */

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Buy Vehicles", path: "/vehicles" },
  { name: "Sell Your Vehicle", path: "/sell-your-vehicle" },
  { name: "Finance", path: "/finance" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const fontCss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap');
.nav-sans{font-family:'Manrope',system-ui,sans-serif}
.nav-serif{font-family:'Playfair Display',Georgia,serif}
`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6c97a]";

const goldBtn =
  "bg-gradient-to-b from-[#e6c97a] to-[#b8903a] text-[#1a1305] shadow-lg shadow-[#c9a24b]/20 hover:brightness-110";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transparent over the hero, solid navy once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`nav-sans fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        solid
          ? "border-b border-[#c9a24b]/25 bg-[#060d1a]/90 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-[#060d1a]/80 via-[#060d1a]/30 to-transparent"
      }`}
    >
      <style>{fontCss}</style>

      <nav className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:h-[80px] sm:px-7 lg:px-12">
        {/* Logo: original colours, untouched. Plate keeps the dark text readable on navy. */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className={`flex shrink-0 items-center rounded-xl ${focusRing}`}
          aria-label="Jai Janardan Auto home"
        >
          <span className="rounded-xl bg-white p-1 shadow-md shadow-black/30 ring-1 ring-[#e9b949]/50">
            <img
              src={logo}
              alt="Jai Janardan Auto"
              className="h-10 w-auto max-w-[120px] object-contain sm:h-12 sm:max-w-[150px]"
            />
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group relative whitespace-nowrap px-3.5 py-3 text-sm font-medium outline-none transition-colors duration-300 focus-visible:text-[#e6c97a] ${
                  isActive
                    ? "text-[#e6c97a]"
                    : "text-[#f5efe0]/75 hover:text-[#e6c97a]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.name}</span>
                  <span
                    className={`absolute bottom-1 left-3.5 right-3.5 h-px origin-center bg-[#c9a24b] transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          to="/sell-your-vehicle"
          className={`group hidden shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${goldBtn} ${focusRing} xl:flex`}
        >
          List Your Vehicle
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>

        {/* Mobile CTA + menu button */}
        <div className="flex items-center gap-2 xl:hidden">
          <Link
            to="/sell-your-vehicle"
            onClick={() => setMenuOpen(false)}
            className={`flex h-11 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold transition active:scale-95 ${goldBtn} ${focusRing}`}
          >
            Sell Vehicle
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#c9a24b]/40 bg-[#f5efe0]/[0.06] text-[#e6c97a] transition active:scale-95 hover:bg-[#c9a24b]/15 ${focusRing}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -70 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 70 }}
                transition={{ duration: 0.16 }}
                className="flex"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Gold hairline (only when solid) */}
      <div
        className={`h-px bg-gradient-to-r from-transparent via-[#c9a24b] to-transparent transition-opacity duration-300 ${
          solid ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        hidden={!menuOpen}
        className="max-h-[calc(100svh-68px)] overflow-y-auto bg-[#060d1a] xl:hidden"
      >
            <div className="px-4 pb-6 pt-3 sm:px-7">
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `group flex min-h-[52px] items-center justify-between border-b border-[#f5efe0]/10 px-2 text-base font-medium transition-colors ${focusRing} ${
                        isActive ? "text-[#e6c97a]" : "text-[#f5efe0]/85"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-3">
                          {isActive && (
                            <span className="h-1.5 w-1.5 rotate-45 bg-[#c9a24b]" />
                          )}
                          {link.name}
                        </span>
                        <ChevronRight
                          size={18}
                          className="text-[#c9a24b]/60 transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Sell card */}
              <div className="mt-5 rounded-2xl border border-[#c9a24b]/35 bg-[#0b1a33] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c9a24b]/40 bg-[#c9a24b]/10">
                    <Truck size={21} className="text-[#e6c97a]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="nav-serif text-lg font-semibold leading-tight text-[#f5efe0]">
                      Have a vehicle to sell?
                    </p>
                    <p className="mt-0.5 text-sm text-[#f5efe0]/65">
                      List it with Jai Janardan Auto
                    </p>
                  </div>
                </div>

                <Link
                  to="/sell-your-vehicle"
                  onClick={() => setMenuOpen(false)}
                  className={`mt-4 flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition active:scale-[0.98] ${goldBtn} ${focusRing}`}
                >
                  List Your Vehicle
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
      </div>
    </header>
  );
}