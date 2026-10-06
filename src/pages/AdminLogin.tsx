import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Truck,
  BadgeCheck,
  BarChart3,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";

import heroBg from "../assets/heo-bg.png";
import logo from "../assets/logo.png";
import { storeAdminSession } from "../services/adminAuth";

/* Tokens: ink #0f0e0c · gold #c9a050 · light gold #e0b866 */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,400&family=Manrope:wght@400;500;600;700&display=swap');

.jj-sans  { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
.jj-serif { font-family: 'Fraunces', Georgia, serif; }

@keyframes jj-rise  { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:none } }
@keyframes jj-kb    { 0% { transform:scale(1.04) } 50% { transform:scale(1.12) translate(-1%,-1%) } 100% { transform:scale(1.04) } }
@keyframes jj-ember { 0% { transform:translateY(0); opacity:0 } 15% { opacity:.7 } 100% { transform:translateY(-105vh) translateX(24px); opacity:0 } }
@keyframes jj-sheen { from { transform:translateX(-120%) skewX(-20deg) } to { transform:translateX(450%) skewX(-20deg) } }
@keyframes jj-shake { 0%,100% { transform:translateX(0) } 25% { transform:translateX(-7px) } 50% { transform:translateX(6px) } 75% { transform:translateX(-3px) } }
@keyframes jj-pop   { 0% { transform:scale(.4); opacity:0 } 70% { transform:scale(1.2) } 100% { transform:scale(1); opacity:1 } }
@keyframes jj-draw  { from { width:0 } to { width:3rem } }

.jj-rise  { animation: jj-rise .9s cubic-bezier(.2,.7,.2,1) both }
.jj-kb    { animation: jj-kb 30s ease-in-out infinite }
.jj-ember { animation: jj-ember linear infinite }
.jj-shake { animation: jj-shake .45s ease }
.jj-pop   { animation: jj-pop .5s cubic-bezier(.2,.9,.3,1.3) both }
.jj-line  { animation: jj-draw 1.1s .5s cubic-bezier(.2,.7,.2,1) both }
.jj-btn:hover .jj-sheen { animation: jj-sheen .9s ease }

/* glass inputs: keep browser autofill from painting a solid colour */
.jj-input:-webkit-autofill {
  -webkit-text-fill-color: #fff;
  caret-color: #fff;
  transition: background-color 99999s ease-in-out 0s;
}

@media (prefers-reduced-motion: reduce) {
  .jj-rise,.jj-kb,.jj-ember,.jj-shake,.jj-pop,.jj-line,.jj-btn:hover .jj-sheen { animation:none !important }
}
`;

const features = [
  { icon: BadgeCheck, title: "Verified", sub: "Vehicles" },
  { icon: Truck, title: "Wide", sub: "Inventory" },
  { icon: BarChart3, title: "Smart", sub: "Management" },
];

const labelCls =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/55 transition-all duration-200 peer-focus:top-3.5 peer-focus:text-xs peer-focus:text-[#e0b866] peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-xs";

const inputCls =
  "jj-input peer h-14 w-full rounded-2xl border border-white/20 bg-white/[0.07] px-4 pt-5 text-base text-white outline-none transition placeholder-transparent focus:border-[#e0b866]/70 focus:bg-white/[0.12] focus:ring-4 focus:ring-[#e0b866]/10";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fail = (msg: string) => {
    setError(msg);
    setErrorKey((k) => k + 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || success) return;
    setError("");

    if (!email.trim() || !password.trim()) {
      fail("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        token?: string;
      } | null;
      if (!response.ok || !data?.success || !data.token) {
        throw new Error(data?.message || "Unable to sign in.");
      }
      storeAdminSession(data.token, rememberMe);
      setSuccess(true);
      setTimeout(() => navigate("/admin"), 500);
    } catch (loginError) {
      fail(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jj-sans relative min-h-[100dvh] overflow-hidden bg-[#0f0e0c] text-white">
      <style>{styles}</style>

      {/* ============ FULL-SCREEN BACKGROUND ============ */}
      <div className="fixed inset-0">
        <img
          src={heroBg}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
        {/* readable but still shows the whole photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/80" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-black/65 via-black/20 to-black/75 lg:block" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(15,14,12,0.55),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_100%,rgba(201,160,80,0.18),transparent_55%)]" />
      </div>

      {/* ============ CONTENT ============ */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1400px] flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-12 lg:py-10">
        {/* Brand + message */}
        <div className="flex flex-col lg:min-h-[calc(100dvh-5rem)] lg:flex-1 lg:justify-between">
          <div className="jj-rise flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-white/40 sm:h-14 sm:w-14">
              <img src={logo} alt="Jai Janardan Auto logo" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <p className="jj-serif text-xl sm:text-2xl">
                Jai <span className="text-[#e0b866]">Janardan</span> Auto
              </p>
              <p className="text-[11px] text-white/60 sm:text-xs">Commercial vehicle dealership</p>
            </div>
          </div>

          <div className="mt-8 max-w-xl lg:mt-0">
            <h1
              className="jj-serif jj-rise text-[2rem] leading-[1.08] sm:text-5xl lg:text-[3.8rem]"
              style={{ animationDelay: ".2s" }}
            >
              Vehicles that
              <br />
              <em className="text-[#e0b866]">move business forward.</em>
            </h1>
            <div className="jj-line mt-5 h-[2px] w-12 rounded bg-gradient-to-r from-[#e0b866] to-transparent" />
            <p
              className="jj-rise mt-5 hidden max-w-md text-base leading-7 text-white/70 lg:block"
              style={{ animationDelay: ".45s" }}
            >
              Reliable commercial vehicles, trusted service and a smarter way to manage your inventory.
            </p>

            <div className="mt-9 hidden max-w-lg grid-cols-3 gap-3 lg:grid">
              {features.map(({ icon: Icon, title, sub }, i) => (
                <div
                  key={title}
                  className="jj-rise rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-md"
                  style={{ animationDelay: `${0.6 + i * 0.1}s` }}
                >
                  <Icon size={20} className="text-[#e0b866]" />
                  <p className="mt-3 text-sm font-semibold">{title}</p>
                  <p className="text-xs text-white/55">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="hidden text-xs text-white/40 lg:block">Vehicles · People · Progress</p>
        </div>

        {/* ============ GLASS LOGIN CARD ============ */}
        <div
          className="jj-rise mt-10 w-full max-w-[420px] self-center lg:mt-0 lg:shrink-0 lg:mr-6"
          style={{ animationDelay: ".3s" }}
        >
          <p className="text-sm font-semibold text-[#e0b866]">Admin portal</p>
          <h2 className="jj-serif mt-1.5 text-[1.75rem] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-3xl">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Manage vehicles, enquiries and day-to-day business from one place.
          </p>

          {error && (
            <div
              key={errorKey}
              role="alert"
              className="jj-shake mt-5 flex items-start gap-2.5 rounded-2xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div className="relative">
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className={inputCls}
              />
              <label htmlFor="email" className={labelCls}>Email address</label>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className={`${inputCls} pr-14`}
              />
              <label htmlFor="password" className={labelCls}>Password</label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-white/55 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e0b866]"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-[18px] w-[18px] rounded accent-[#c9a050]"
                />
                <span className="text-sm text-white/75">Remember me</span>
              </label>
              <button
                type="button"
                className="min-h-[44px] text-sm font-semibold text-[#e0b866] transition hover:text-[#f3d794]"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className={`jj-btn group relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl text-[15px] font-semibold shadow-[0_14px_30px_-12px_rgba(201,160,80,0.6)] transition active:scale-[0.99] disabled:cursor-default ${
                success
                  ? "bg-[#2f7a46] text-white"
                  : "bg-gradient-to-b from-[#e8c477] to-[#c9a050] text-[#14110a]"
              }`}
            >
              <span className="jj-sheen pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              {success ? (
                <>
                  <Check size={20} className="jj-pop" />
                  <span>Welcome back</span>
                </>
              ) : loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={19} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e0b866]/15 text-[#e0b866]">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs leading-5 text-white/55">
              <span className="block text-sm font-semibold text-white">Authorised staff only</span>
              Your business data stays protected.
            </p>
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center text-sm font-medium text-white/60 transition hover:text-[#e0b866]"
            >
              ← Back to website
            </Link>
            <p className="text-xs text-white/35">© {new Date().getFullYear()} Jai Janardan Auto</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;