import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  PlusCircle,
  Tags,
  MessageSquare,
  Users,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  X,
  ClipboardList,
} from "lucide-react";

// Adjust these two paths if this file lives in a different folder.
import logo from "../assets/logo.png";
import bg2 from "../assets/admindashboard/bg2.png";
import { clearAdminSession } from "../services/adminAuth";

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "All Vehicles", path: "/admin/vehicles", icon: Truck },
  { name: "Add Vehicle", path: "/admin/vehicles/add", icon: PlusCircle },
  { name: "Sell Requests", path: "/admin/sell-requests", icon: ClipboardList },
  { name: "Categories", path: "/admin/categories", icon: Tags },
  { name: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Sales", path: "/admin/sales", icon: Receipt },
  { name: "Reports", path: "/admin/reports", icon: BarChart3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
.jj-serif { font-family: 'Fraunces', Georgia, serif; }
`;

const AdminSidebar = ({ mobileOpen, setMobileOpen }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    clearAdminSession();
    setMobileOpen(false);
    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      <style>{styles}</style>

      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-72 max-w-[85vw] flex-col overflow-hidden border-r border-[#eee8da] bg-gradient-to-b from-[#fbf9f4] to-white shadow-2xl transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 pb-4 pt-5">
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm ring-1 ring-[#eadfc6]">
              <img
                src={logo}
                alt="Jai Janardan Auto"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <h1 className="jj-serif text-[1.25rem] text-[#14110a]">
                Jai <span className="text-[#b98a32]">Janardan</span>
              </h1>
              <p className="mt-0.5 text-[10px] font-semibold tracking-[0.22em] text-[#8a8478]">
                AUTO • ADMIN
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6b665c] transition hover:bg-[#f3efe4] hover:text-[#14110a] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin" || item.path === "/admin/vehicles/add"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => {
                  const active =
                    isActive &&
                    !(
                      item.path === "/admin/vehicles" &&
                      pathname.startsWith("/admin/vehicles/add")
                    );
                  return `group flex min-h-[46px] items-center gap-3 rounded-xl px-4 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a050] ${
                    active
                      ? "bg-[#14110a] text-white shadow-[0_10px_24px_-12px_rgba(20,17,10,0.7)]"
                      : "text-[#4d493f] hover:bg-[#f3efe4] hover:text-[#14110a]"
                  }`;
                }}
              >
                {({ isActive }) => {
                  const active =
                    isActive &&
                    !(
                      item.path === "/admin/vehicles" &&
                      pathname.startsWith("/admin/vehicles/add")
                    );
                  return (
                    <>
                    <Icon
                      size={19}
                      strokeWidth={1.9}
                      className={
                        active
                          ? "text-[#e0b866]"
                          : "text-[#8a8478] transition-colors group-hover:text-[#b98a32]"
                      }
                    />
                    <span>{item.name}</span>
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>

        {/* Brand image (only on taller screens) */}
        <div className="relative hidden h-52 shrink-0 [@media(min-height:800px)]:block">
          <img
            src={bg2}
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fbf9f4] via-[#fbf9f4]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <p className="jj-serif absolute bottom-4 left-5 text-lg leading-[1.15] text-white">
            Driving
            <br />
            Businesses
            <br />
            Forward
          </p>
        </div>

        {/* Logout */}
        <div className="shrink-0 border-t border-[#eee8da] bg-white/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[46px] w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#4d493f] transition hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-300"
          >
            <LogOut size={19} strokeWidth={1.9} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;