import { useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, ArrowLeft, Info, Loader2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../services/adminAuth";

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (import.meta.env.DEV) {
      console.info("Forgot password form submitted.");
    }
    event.preventDefault();
    setError("");
    setMessage("");
    if (loading) return;
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    const requestUrl = `${API_BASE_URL}/auth/forgot-password`;
    if (import.meta.env.DEV) {
      console.info("Starting forgot password request.", {
        method: "POST",
        url: requestUrl,
      });
    }
    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;
      if (import.meta.env.DEV) {
        console.info("Forgot password request completed.", {
          status: response.status,
          success: data?.success === true,
        });
      }
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to request a password reset.");
      }
      setMessage(data.message || "If an account matches, password-reset instructions will be sent shortly.");
    } catch (requestError) {
      if (import.meta.env.DEV) {
        console.error("Forgot password request failed.", {
          type:
            requestError instanceof Error
              ? requestError.name
              : "UnknownError",
          source: requestError instanceof TypeError ? "network" : "request",
          message:
            requestError instanceof Error
              ? requestError.message
              : "Unable to request a password reset.",
        });
      }
      setError(
        requestError instanceof TypeError
          ? "Unable to reach the password-reset service. Check that the backend is running and try again."
          : requestError instanceof Error
            ? requestError.message
            : "Unable to request a password reset."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1a33] px-4 py-10 text-[#14110a]">
      <section className="w-full max-w-md rounded-3xl border border-[#e8dfcc] bg-[#fbfaf7] p-6 shadow-2xl sm:p-9">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9a050]/15 text-[#9a742d]">
          <Mail size={22} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a77f39]">Admin account</p>
        <h1 className="mt-2 font-serif text-3xl text-[#0b1a33]">Forgot password?</h1>
        <p className="mt-3 text-sm leading-6 text-[#667080]">
          Enter the email address registered to your admin account. If it matches, reset instructions will be sent when email delivery is available. Links expire after 15 minutes.
        </p>

        {error && (
          <div role="alert" className="mt-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div role="status" className="mt-5 flex gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <Info size={18} className="mt-0.5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-[#3f4650]">Email address</label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-[#d8d2c5] bg-white px-4 text-sm outline-none transition focus:border-[#c9a050] focus:ring-4 focus:ring-[#c9a050]/15"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c9a050] px-4 text-sm font-semibold text-[#14110a] transition hover:bg-[#dfb968] disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Sending request…" : "Send reset link"}
          </button>
        </form>

        <Link to="/admin/login" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0b1a33] hover:text-[#a77f39]">
          <ArrowLeft size={16} /> Back to admin login
        </Link>
      </section>
    </main>
  );
};

export default AdminForgotPassword;
