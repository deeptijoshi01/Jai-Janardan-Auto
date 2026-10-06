import { useEffect, useState } from "react";
import { Menu, Bell, User } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { clearAdminSession, verifyAdminSession } from "../services/adminAuth";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
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

            {/* Admin Profile */}
            <Link
              to="/admin/settings"
              aria-label="Open admin settings"
              className="flex items-center gap-3 border-l border-gray-200 pl-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <User size={18} />
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  Admin
                </p>

                <p className="text-xs text-gray-500">
                  Administrator
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)] min-w-0 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;