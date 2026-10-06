import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  CheckCircle2,
  Tag,
  Clock3,
  Plus,
  ArrowRight,
  RefreshCw,
  MapPin,
  Gauge,
  CalendarDays,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  MessageSquare,
  BarChart3,
} from "lucide-react";

import bg1 from "../assets/admindashboard/bg1.png";
import bg2 from "../assets/admindashboard/bg2.png";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface VehicleImage {
  url?: string;
  publicId?: string;
}

interface Vehicle {
  _id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: string;
  kilometers: number;
  fuelType: string;
  transmission: string;
  location: string;
  description?: string;
  images?: VehicleImage[];
  status: "Available" | "Sold" | "Reserved";
  createdAt: string;
  updatedAt: string;
}

interface VehiclesResponse {
  success: boolean;
  count: number;
  vehicles: Vehicle[];
}

interface Enquiry {
  _id: string;
  name: string;
  vehicle?: string;
  status?: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Config – change routes / endpoints here                             */
/* ------------------------------------------------------------------ */

const API_URL = "http://localhost:5000/api/vehicles";
const ENQUIRIES_API = "http://localhost:5000/api/enquiries"; // optional

const ROUTES = {
  vehicles: "/admin/vehicles",
  add: "/admin/vehicles/add",
  view: (id: string) => `/admin/vehicles/${id}`,
  edit: (id: string) => `/admin/vehicles/edit/${id}`,
  enquiries: "/admin/enquiries",
  reports: "/admin/reports",
};

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
.jj-serif { font-family: 'Fraunces', Georgia, serif; }

@keyframes jj-rise  { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
@keyframes jj-line  { from { stroke-dashoffset:1 } to { stroke-dashoffset:0 } }
@keyframes jj-fade  { from { opacity:0 } to { opacity:1 } }
@keyframes jj-donut { from { opacity:0; transform:rotate(-70deg) scale(.92) } to { opacity:1; transform:none } }
@keyframes jj-wave  { 0%,60%,100% { transform:rotate(0) } 10%,30% { transform:rotate(16deg) } 20%,40% { transform:rotate(-8deg) } 50% { transform:rotate(10deg) } }

.jj-rise  { animation: jj-rise .7s cubic-bezier(.2,.7,.2,1) both }
.jj-draw  { stroke-dasharray:1; stroke-dashoffset:1; animation: jj-line 1.6s .3s cubic-bezier(.4,0,.2,1) forwards }
.jj-area  { animation: jj-fade 1.4s .8s both }
.jj-donut { transform-origin:center; animation: jj-donut 1.1s cubic-bezier(.2,.7,.2,1) both }
.jj-wave  { display:inline-block; transform-origin:70% 70%; animation: jj-wave 2.4s .8s ease-in-out 1 }

@media (prefers-reduced-motion: reduce) {
  .jj-rise,.jj-area,.jj-donut,.jj-wave { animation:none !important }
  .jj-draw { animation:none !important; stroke-dashoffset:0 }
}
`;

const card =
  "rounded-2xl border border-[#efeae0] bg-white shadow-[0_1px_2px_rgba(20,16,8,0.04),0_14px_34px_-22px_rgba(20,16,8,0.18)]";

const SERIES = [
  { key: "total", label: "Total", color: "#1c1a16" },
  { key: "available", label: "Available", color: "#c9a050" },
  { key: "sold", label: "Sold", color: "#22a55b" },
  { key: "reserved", label: "Reserved", color: "#3b82f6" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];
type Row = Record<SeriesKey, number> | null;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const timeAgo = (date: string) => {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const statusPill = (status: Vehicle["status"]) => {
  switch (status) {
    case "Available":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case "Sold":
      return "bg-rose-50 text-rose-600 ring-rose-100";
    case "Reserved":
      return "bg-sky-50 text-sky-700 ring-sky-100";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-100";
  }
};

const enquiryPill = (status?: string) => {
  switch (status) {
    case "New":
      return "bg-amber-50 text-amber-700";
    case "Contacted":
      return "bg-sky-50 text-sky-700";
    case "Interested":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  /* ---------------- data ---------------- */

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(ENQUIRIES_API);
      if (!res.ok) return;
      const data = await res.json();
      const list = data.enquiries ?? data.data ?? [];
      setEnquiries(Array.isArray(list) ? list.slice(0, 4) : []);
    } catch {
      /* enquiries are optional – keep the empty state */
    }
  };

  const fetchVehicles = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);

      const response = await fetch(API_URL, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch vehicles");

      const data: VehiclesResponse = await response.json();
      if (!data.success) throw new Error("Unable to load vehicle data");

      setVehicles(data.vehicles || []);
      setError("");
      fetchEnquiries();
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError(
        "Unable to load vehicle data. Please check whether the backend server is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchVehicles());
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (vehicle: Vehicle) => {
    if (!window.confirm(`Delete "${vehicle.title}"? This can't be undone.`)) return;

    try {
      setDeletingId(vehicle._id);
      const res = await fetch(`${API_URL}/${vehicle._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setVehicles((prev) => prev.filter((v) => v._id !== vehicle._id));
    } catch {
      setError("Couldn't delete the vehicle. Check the server and try again.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------------- derived ---------------- */

  const statistics = useMemo(() => {
    const count = (s: Vehicle["status"]) => vehicles.filter((v) => v.status === s).length;
    const monthAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

    return {
      total: vehicles.length,
      available: count("Available"),
      sold: count("Sold"),
      reserved: count("Reserved"),
      recent: vehicles.filter((v) => new Date(v.createdAt).getTime() >= monthAgo).length,
    };
  }, [vehicles, now]);

  const pct = (n: number) =>
    statistics.total ? Math.round((n / statistics.total) * 100) : 0;

  const recentVehicles = useMemo(
    () =>
      [...vehicles]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [vehicles]
  );

  /* cumulative inventory per month, this year */
  const chart = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();

    const rows: Row[] = MONTHS.map((_, m) => {
      if (m > today.getMonth()) return null;
      const end = new Date(year, m + 1, 1).getTime();
      const upto = vehicles.filter((v) => new Date(v.createdAt).getTime() < end);
      const c = (s: Vehicle["status"]) => upto.filter((v) => v.status === s).length;
      return {
        total: upto.length,
        available: c("Available"),
        sold: c("Sold"),
        reserved: c("Reserved"),
      };
    });

    const max = Math.max(4, ...rows.map((r) => r?.total ?? 0));
    return { rows, top: Math.ceil(max / 4) * 4 };
  }, [vehicles]);

  /* chart geometry */
  const W = 560,
    H = 240,
    PL = 32,
    PR = 10,
    PT = 10,
    PB = 26;
  const plotW = W - PL - PR;
  const plotH = H - PT - PB;
  const X = (i: number) => PL + (plotW * i) / 11;
  const Y = (v: number) => PT + plotH * (1 - v / chart.top);

  const pointsFor = (key: SeriesKey) => {
    const pts: { x: number; y: number }[] = [];
    chart.rows.forEach((r, i) => {
      if (r) pts.push({ x: X(i), y: Y(r[key]) });
    });
    return pts;
  };

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");

  const totalPts = pointsFor("total");
  const areaPath = totalPts.length
    ? `${toPath(totalPts)} L${totalPts[totalPts.length - 1].x} ${Y(0)} L${totalPts[0].x} ${Y(0)} Z`
    : "";

  /* donut */
  const R = 62;
  const C = 2 * Math.PI * R;
  const donutData = [
    { label: "Available", value: statistics.available, color: "#c9a050" },
    { label: "Sold", value: statistics.sold, color: "#22a55b" },
    { label: "Reserved", value: statistics.reserved, color: "#3b82f6" },
  ];
  let acc = 0;
  const segments = donutData.map((d) => {
    const len = statistics.total ? (d.value / statistics.total) * C : 0;
    const seg = { ...d, len, offset: -acc };
    acc += len;
    return seg;
  });

  const stats = [
    {
      title: "Total Vehicles",
      value: statistics.total,
      icon: Truck,
      tint: "bg-[#fbf1dc] text-[#b98a32]",
      badge: statistics.recent > 0 ? `+${statistics.recent}` : null,
      badgeTitle: "Added in the last 30 days",
      note: "In inventory",
    },
    {
      title: "Available",
      value: statistics.available,
      icon: CheckCircle2,
      tint: "bg-emerald-50 text-emerald-600",
      badge: `${pct(statistics.available)}%`,
      badgeTitle: "Share of inventory",
      note: "Ready for sale",
    },
    {
      title: "Sold",
      value: statistics.sold,
      icon: Tag,
      tint: "bg-rose-50 text-rose-500",
      badge: `${pct(statistics.sold)}%`,
      badgeTitle: "Share of inventory",
      note: "Vehicles sold",
    },
    {
      title: "Reserved",
      value: statistics.reserved,
      icon: Clock3,
      tint: "bg-sky-50 text-sky-600",
      badge: `${pct(statistics.reserved)}%`,
      badgeTitle: "Share of inventory",
      note: "Currently reserved",
    },
  ];

  const quickActions = [
    { title: "Add Vehicle", sub: "List a new vehicle", icon: Plus, to: ROUTES.add, tint: "bg-[#fbf1dc] text-[#b98a32]" },
    { title: "View Inventory", sub: "Manage vehicles", icon: Truck, to: ROUTES.vehicles, tint: "bg-emerald-50 text-emerald-600" },
    { title: "Enquiries", sub: "View all enquiries", icon: MessageSquare, to: ROUTES.enquiries, tint: "bg-sky-50 text-sky-600" },
    { title: "Sales Report", sub: "View analytics", icon: BarChart3, to: ROUTES.reports, tint: "bg-rose-50 text-rose-500" },
  ];

  const renderActions = (vehicle: Vehicle) => (
    <div className="flex items-center gap-1.5">
      <Link
        to={ROUTES.view(vehicle._id)}
        aria-label={`View ${vehicle.title}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f3ea] text-[#4d493f] transition hover:bg-[#ece6d6]"
      >
        <Eye size={16} />
      </Link>
      <Link
        to={ROUTES.edit(vehicle._id)}
        aria-label={`Edit ${vehicle.title}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f3ea] text-[#4d493f] transition hover:bg-[#ece6d6]"
      >
        <Pencil size={16} />
      </Link>
      <button
        type="button"
        onClick={() => handleDelete(vehicle)}
        disabled={deletingId === vehicle._id}
        aria-label={`Delete ${vehicle.title}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  /* ---------------- loading ---------------- */

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="h-[260px] animate-pulse rounded-[28px] bg-[#efeae0]" />
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-[#efeae0]" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-[#efeae0]" />
      </div>
    );
  }

  /* ---------------- page ---------------- */

  return (
    <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
      <style>{styles}</style>

      {/* ============ WELCOME ============ */}
      <section className="jj-rise relative overflow-hidden rounded-[28px] border border-[#efeae0] bg-[#fbfaf6]">
        {/* mountain + trucks */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:w-[64%]">
          <img src={bg1} alt="" aria-hidden className="h-full w-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fbfaf6] via-[#fbfaf6]/50 to-transparent sm:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/40 to-transparent sm:block" />
        </div>

        <div className="relative z-10 flex min-h-[300px] flex-col justify-between gap-6 p-5 sm:min-h-[220px] sm:flex-row sm:items-start sm:p-8">
          <div>
            <p className="text-sm text-[#6b665c]">Welcome back,</p>
            <h1 className="jj-serif mt-1 text-4xl leading-none text-[#14110a] sm:text-5xl">
              Admin <span className="jj-wave">👋</span>
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#6b665c] sm:max-w-sm">
              Here&apos;s what&apos;s happening with your vehicle business today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/70 bg-white/85 px-3.5 py-2 shadow-sm backdrop-blur-md">
              <CalendarDays size={17} className="text-[#b98a32]" />
              <div className="text-[11px] leading-tight">
                <p className="font-semibold text-[#14110a]">
                  {new Intl.DateTimeFormat("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(now)}
                </p>
                <p className="text-[#8a8478]">
                  {new Intl.DateTimeFormat("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(now)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchVehicles(true)}
              disabled={refreshing}
              aria-label="Refresh data"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/70 bg-white/85 text-[#4d493f] shadow-sm backdrop-blur-md transition hover:bg-white disabled:opacity-60"
            >
              <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            </button>

            <Link
              to={ROUTES.add}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#14110a] px-5 text-sm font-semibold text-white shadow-[0_12px_26px_-10px_rgba(20,17,10,0.7)] ring-1 ring-[#c9a050]/40 transition hover:bg-[#2a251a] active:scale-[0.98] sm:ml-2"
            >
              <Plus size={17} className="text-[#e0b866]" />
              Add Vehicle
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ERROR ============ */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-semibold text-red-700">Something went wrong</p>
            <p className="mt-1 text-xs leading-5 text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* ============ STATS ============ */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`jj-rise ${card} flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5`}
              style={{ animationDelay: `${0.08 + i * 0.07}s` }}
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${stat.tint}`}>
                <Icon size={22} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-[#4d493f] sm:text-sm">
                  {stat.title}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="jj-serif text-3xl leading-none text-[#14110a] sm:text-4xl">
                    {String(stat.value).padStart(2, "0")}
                  </p>
                  {stat.badge && (
                    <span
                      title={stat.badgeTitle}
                      className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600"
                    >
                      {stat.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-[#8a8478]">{stat.note}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* ============ CHART + STATUS ============ */}
      <section className="grid gap-4 sm:gap-6 lg:grid-cols-[1.9fr_1fr]">
        {/* Overview */}
        <div className={`jj-rise ${card} p-4 sm:p-6`} style={{ animationDelay: ".3s" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="jj-serif text-xl text-[#14110a]">Vehicle Overview</h2>
              <p className="mt-1 text-sm text-[#8a8478]">
                Total vehicles and inventory status over time.
              </p>
            </div>
            <span className="shrink-0 rounded-lg border border-[#e6e1d6] bg-[#faf8f3] px-3 py-1.5 text-xs font-medium text-[#4d493f]">
              This year
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {SERIES.map((s) => (
              <span key={s.key} className="flex items-center gap-2 text-xs text-[#4d493f]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>

          <div className="-mx-1 mt-3 overflow-x-auto px-1">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="h-auto w-full min-w-[520px]"
              role="img"
              aria-label="Line chart of vehicle inventory by month"
            >
              <defs>
                <linearGradient id="jjArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a050" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#c9a050" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3, 4].map((t) => {
                const v = (chart.top * t) / 4;
                return (
                  <g key={t}>
                    <line x1={PL} x2={W - PR} y1={Y(v)} y2={Y(v)} stroke="#eee8da" strokeDasharray="3 4" />
                    <text x={PL - 8} y={Y(v) + 4} textAnchor="end" fontSize="11" fill="#8a8478">
                      {v}
                    </text>
                  </g>
                );
              })}

              {MONTHS.map((m, i) => (
                <text key={m} x={X(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="#8a8478">
                  {m}
                </text>
              ))}

              {areaPath && <path d={areaPath} fill="url(#jjArea)" className="jj-area" />}

              {[...SERIES].reverse().map((s) => {
                const pts = pointsFor(s.key);
                return (
                  <g key={s.key}>
                    {pts.length > 1 && (
                      <path
                        d={toPath(pts)}
                        pathLength={1}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={s.key === "total" ? 2.4 : 2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="jj-draw"
                      />
                    )}
                    {pts.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r={3.2} fill="#fff" stroke={s.color} strokeWidth={2} />
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Status donut */}
        <div className={`jj-rise ${card} p-4 sm:p-6`} style={{ animationDelay: ".38s" }}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="jj-serif text-xl text-[#14110a]">Vehicle Status</h2>
            <span className="shrink-0 rounded-lg border border-[#e6e1d6] bg-[#faf8f3] px-3 py-1.5 text-xs font-medium text-[#4d493f]">
              Now
            </span>
          </div>

          <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:flex-col xl:flex-row">
            <div className="relative h-40 w-40 shrink-0">
              <svg viewBox="0 0 160 160" className="jj-donut h-full w-full" role="img" aria-label="Vehicle status breakdown">
                <circle cx="80" cy="80" r={R} fill="none" stroke="#f1ede2" strokeWidth="18" />
                {segments.map(
                  (s) =>
                    s.len > 0 && (
                      <circle
                        key={s.label}
                        cx="80"
                        cy="80"
                        r={R}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="18"
                        strokeDasharray={`${Math.max(s.len - 2, 0)} ${C}`}
                        strokeDashoffset={s.offset}
                        transform="rotate(-90 80 80)"
                      />
                    )
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="jj-serif text-3xl leading-none text-[#14110a]">{statistics.total}</span>
                <span className="mt-1 text-xs text-[#8a8478]">Total</span>
              </div>
            </div>

            <ul className="w-full max-w-[240px] space-y-3">
              {donutData.map((d) => (
                <li key={d.label} className="flex items-center gap-2.5 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-[#4d493f]">{d.label}</span>
                  <span className="ml-auto font-semibold text-[#14110a]">{d.value}</span>
                  <span className="w-10 text-right text-xs text-[#8a8478]">({pct(d.value)}%)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ VEHICLES + SIDE ============ */}
      <section className="grid gap-4 sm:gap-6 xl:grid-cols-[1.8fr_1fr]">
        {/* Recent vehicles */}
        <div className={`jj-rise ${card} overflow-hidden`} style={{ animationDelay: ".45s" }}>
          <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-5 sm:px-6">
            <div>
              <h2 className="jj-serif text-xl text-[#14110a]">Recent Vehicles</h2>
              <p className="mt-1 text-sm text-[#8a8478]">Recently added to your inventory.</p>
            </div>
            <Link
              to={ROUTES.vehicles}
              className="mt-1 flex shrink-0 items-center gap-1 text-sm font-semibold text-[#14110a] transition hover:text-[#b98a32]"
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {recentVehicles.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6f3ea] text-[#b98a32]">
                <Truck size={28} />
              </div>
              <h3 className="mt-5 text-base font-semibold text-[#14110a]">No vehicles yet</h3>
              <p className="mt-2 max-w-sm text-sm text-[#8a8478]">
                Add your first commercial vehicle to start building your inventory.
              </p>
              <Link
                to={ROUTES.add}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#14110a] px-5 text-sm font-semibold text-white transition hover:bg-[#2a251a]"
              >
                <Plus size={17} className="text-[#e0b866]" />
                Add first vehicle
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile: cards */}
              <ul className="space-y-3 px-4 pb-5 md:hidden">
                {recentVehicles.map((v) => (
                  <li key={v._id} className="rounded-2xl border border-[#efeae0] bg-[#fdfcf9] p-3">
                    <div className="flex gap-3">
                      <img
                        src={v.images?.[0]?.url || bg2}
                        alt={v.title}
                        className="h-20 w-24 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#14110a]">{v.title}</p>
                        <p className="mt-0.5 text-base font-bold text-[#14110a]">{formatPrice(v.price)}</p>
                        <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${statusPill(v.status)}`}>
                          {v.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#6b665c]">
                      <span className="flex items-center gap-1.5"><CalendarDays size={13} />{v.year}</span>
                      <span className="flex items-center gap-1.5"><Gauge size={13} />{v.kilometers.toLocaleString("en-IN")} km</span>
                      <span className="flex items-center gap-1.5"><MapPin size={13} />{v.location}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#efeae0] pt-3">
                      <span className="text-[11px] text-[#a39d90]">Added {formatDate(v.createdAt)}</span>
                      {renderActions(v)}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Desktop: table */}
              <div className="hidden overflow-x-auto px-3 pb-4 md:block sm:px-4">
                <table className="w-full min-w-[640px] text-left">
                  <thead>
                    <tr className="bg-[#faf8f3] text-xs font-semibold text-[#6b665c]">
                      <th className="rounded-l-xl px-3 py-3">Image</th>
                      <th className="px-3 py-3">Vehicle details</th>
                      <th className="px-3 py-3">Price</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Added on</th>
                      <th className="rounded-r-xl px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVehicles.map((v) => (
                      <tr key={v._id} className="border-b border-[#f1ede2] last:border-0">
                        <td className="px-3 py-3">
                          <img
                            src={v.images?.[0]?.url || bg2}
                            alt={v.title}
                            className="h-12 w-16 rounded-lg object-cover"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-sm font-bold text-[#14110a]">{v.title}</p>
                          <p className="mt-0.5 text-xs text-[#8a8478]">
                            {v.year} • {v.kilometers.toLocaleString("en-IN")} km • {v.location}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm font-bold text-[#14110a]">
                          {formatPrice(v.price)}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusPill(v.status)}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-[#6b665c]">
                          {formatDate(v.createdAt)}
                        </td>
                        <td className="px-3 py-3">{renderActions(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Enquiries + quick actions */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-1">
          <div className={`jj-rise ${card} p-4 sm:p-6`} style={{ animationDelay: ".5s" }}>
            <div className="flex items-center justify-between">
              <h2 className="jj-serif text-xl text-[#14110a]">Recent Enquiries</h2>
              <Link
                to={ROUTES.enquiries}
                className="flex items-center gap-1 text-xs font-semibold text-[#14110a] transition hover:text-[#b98a32]"
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>

            {enquiries.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f6f3ea] text-[#b98a32]">
                  <MessageSquare size={22} />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#14110a]">No enquiries yet</p>
                <p className="mt-1 max-w-[220px] text-xs text-[#8a8478]">
                  New customer enquiries will show up here.
                </p>
              </div>
            ) : (
              <ul className="mt-3 divide-y divide-[#f1ede2]">
                {enquiries.map((e) => (
                  <li key={e._id} className="flex items-center gap-3 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3efe4] text-xs font-bold text-[#4d493f]">
                      {initials(e.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#14110a]">{e.name}</p>
                      <p className="truncate text-xs text-[#8a8478]">
                        {e.vehicle ? `${e.vehicle} • ` : ""}
                        {timeAgo(e.createdAt)}
                      </p>
                    </div>
                    {e.status && (
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${enquiryPill(e.status)}`}>
                        {e.status}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`jj-rise ${card} p-4 sm:p-6`} style={{ animationDelay: ".55s" }}>
            <h2 className="jj-serif text-xl text-[#14110a]">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.title}
                    to={a.to}
                    className="group rounded-xl border border-[#efeae0] bg-[#fdfcf9] p-3 transition hover:border-[#e0b866] hover:bg-white hover:shadow-md"
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.tint}`}>
                      <Icon size={18} />
                    </span>
                    <p className="mt-3 text-[13px] font-semibold text-[#14110a]">{a.title}</p>
                    <p className="mt-0.5 text-[11px] text-[#8a8478]">{a.sub}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;