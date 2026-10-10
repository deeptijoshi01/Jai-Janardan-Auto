import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../services/adminAuth";

const passwordRule = /^(?=.*[A-Za-z])(?=.*\d).{6,128}$/;

const AdminResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    /^[a-f0-9]{64}$/i.test(token)
      ? ""
      : "This password-reset link is invalid or has expired."
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timeout = window.setTimeout(
      () => navigate("/admin/login", { replace: true }),
      2500
    );
    return () => window.clearTimeout(timeout);
  }, [navigate, success]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (loading || success) return;
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      setError("This password-reset link is invalid or has expired.");
      return;
    }
    if (!passwordRule.test(password)) {
      setError("Use at least 6 characters, including a letter and a number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to reset the password.");
      }
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (resetError) {
      setError(
        resetError instanceof TypeError
          ? "Unable to reach the password-reset service. Check that the backend is running and try again."
          : resetError instanceof Error
            ? resetError.message
            : "Unable to reset the password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1a33] px-4 py-10 text-[#14110a]">
      <section className="w-full max-w-md rounded-3xl border border-[#e8dfcc] bg-[#fbfaf7] p-6 shadow-2xl sm:p-9">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9a050]/15 text-[#9a742d]">
          <KeyRound size={22} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a77f39]">Secure password reset</p>
        <h1 className="mt-2 font-serif text-3xl text-[#0b1a33]">Create a new password</h1>
        <p className="mt-3 text-sm leading-6 text-[#667080]">
          Choose at least 6 characters, including a letter and a number.
        </p>

        {error && (
          <div role="alert" className="mt-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            <p className="font-semibold">Your password has been changed.</p>
            <p className="mt-1">Redirecting you to sign in with your new password…</p>
            <Link to="/admin/login" className="mt-4 inline-flex min-h-10 items-center font-semibold text-[#0b1a33] underline underline-offset-4 hover:text-[#a77f39]">
              Return to admin login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <PasswordField
              id="new-password"
              label="New password"
              value={password}
              onChange={setPassword}
              visible={showPassword}
              onToggle={() => setShowPassword((visible) => !visible)}
              autoComplete="new-password"
            />
            <PasswordField
              id="confirm-password"
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((visible) => !visible)}
              autoComplete="new-password"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c9a050] px-4 text-sm font-semibold text-[#14110a] transition hover:bg-[#dfb968] disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? "Updating password…" : "Update password"}
            </button>
          </form>
        )}
        {!success && (
          <Link
            to="/admin/login"
            className="mt-5 inline-flex min-h-11 items-center font-semibold text-[#0b1a33] underline underline-offset-4 hover:text-[#a77f39]"
          >
            Back to admin login
          </Link>
        )}
      </section>
    </main>
  );
};

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete: string;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#3f4650]">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={6}
          maxLength={128}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-xl border border-[#d8d2c5] bg-white px-4 pr-12 text-sm outline-none transition focus:border-[#c9a050] focus:ring-4 focus:ring-[#c9a050]/15"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-1 flex w-10 items-center justify-center text-[#667080] hover:text-[#0b1a33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a050]"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default AdminResetPassword;
