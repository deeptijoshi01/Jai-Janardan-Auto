
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Truck } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Buy Vehicles", path: "/vehicles" },
  { name: "Sell Your Vehicle", path: "/sell-your-vehicle" },
  { name: "Finance", path: "/finance" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-white">
            <Truck size={25} strokeWidth={2.2} />
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-extrabold tracking-tight text-blue-950">
              JAI JANARDAN
            </h1>
            <p className="mt-1 text-[10px] font-semibold tracking-[0.25em] text-orange-600">
              AUTO
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-orange-600"
                    : "text-slate-700 hover:text-orange-600"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          to="/sell-your-vehicle"
          className="hidden items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700 xl:flex"
        >
          List Your Vehicle
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-blue-950 hover:bg-slate-100 xl:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-5 py-4 shadow-lg xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/sell-your-vehicle"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-lg bg-orange-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-orange-700"
            >
              List Your Vehicle
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
