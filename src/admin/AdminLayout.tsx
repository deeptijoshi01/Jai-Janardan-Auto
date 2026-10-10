import { useEffect, useState } from "react";
import { Menu, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import {
  clearAdminSession,
  logoutAdmin,
  verifyAdminSession,
} from "../services/adminAuth";
import type { AdminUser } from "../services/adminAuth";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [logoutError, setLogoutError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    verifyAdminSession()
      .then((valid) => {
        if (!active) return;
        if (!valid) {
          clearAdminSession();
          navigate("/admin/login", { replace: true });
          return;
        }
        setAdmin(valid);
        setCheckingSession(false);
      })
      .catch((error: unknown) => {
        console.error("Admin session verification error:", error);
        if (active) {
          clearAdminSession();
          navigate("/admin/login", { replace: true });
        }
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await logoutAdmin();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Unable to end the admin session."
      );
    }
  };

  const initials =
    admin?.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "A";

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbfaf7] text-sm text-[#6b665c]">
        Verifying admin session…
      </main>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="min-w-0 lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md md:px-8">
          
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Desktop Title */}
          <Link to="/admin" className="hidden lg:block">
            <p className="text-sm text-gray-500">
              Welcome back
            </p>

            <h2 className="text-lg font-semibold text-gray-900">
              Admin Dashboard
            </h2>
          </Link>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-3">
            
            {/* Notification */}
            <button
              type="button"
              className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100"
            >
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative border-l border-gray-200 pl-3">
              <button
                type="button"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-3 rounded-xl p-1.5 text-left transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a050]"
              >
                {admin?.profileImage ? (
                  <img
                    src={admin.profileImage}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1a33] text-sm font-semibold text-[#e0b866]">
                    {admin?.name ? initials : <User size={18} />}
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="max-w-40 truncate text-sm font-semibold text-gray-900">
                    {admin?.name || "Admin"}
                  </p>
                  <p className="text-xs capitalize text-gray-500">{admin?.role || "Admin"}</p>
                </div>
                <ChevronDown size={16} className="hidden text-gray-500 sm:block" />
              </button>
              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-[#e8e2d6] bg-white p-4 shadow-xl"
                >
                  <p className="truncate text-sm font-semibold text-[#0b1a33]">{admin?.name}</p>
                  <p className="mt-1 break-all text-xs text-gray-600">{admin?.email}</p>
                  <p className="mt-2 inline-flex rounded-full bg-[#f4efe4] px-2.5 py-1 text-xs font-medium capitalize text-[#70551f]">
                    {admin?.role}
                  </p>
                  <Link
                    to="/admin/settings"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="mt-3 block rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Account settings
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void handleLogout()}
                    className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {logoutError && (
          <div role="alert" className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 md:px-8">
            {logoutError}
          </div>
        )}

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)] min-w-0 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;