import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useRef, useState } from "react";
import type { FormEvent } from "react";

import heroImage from "../assets/heo-bg.png";
import { API_BASE_URL } from "../services/adminAuth";

/* -------------------------------------------------------------------------- */
/*  CONFIG                                                                    */
/* -------------------------------------------------------------------------- */

// Contact form submit zalyavar enquiry ya number var WhatsApp madhe janar.
const ENQUIRY_WHATSAPP = "7972643129";

// Google Maps share link (Get Directions button sathi).
const MAPS_URL = "https://maps.app.goo.gl/oU7sCXnYKYz47Guf9";

// Address
const ADDRESS_NAME = "Jai Janardan Auto";
const ADDRESS_LINES = [
  "Nilgiri Bag Rd, Nandurnaka,",
  "Nashik, Maharashtra 422006",
];
const ADDRESS_FULL =
  "Jai Janardan Auto, Nilgiri Bag Rd, Nandurnaka, Nashik, Maharashtra 422006";

// Embedded map (API key lagat nahi).
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  ADDRESS_FULL
)}&output=embed`;

const team = [
  {
    name: "Santosh Deshmukh",
    marathi: "श्री. संतोष देशमुख",
    phones: ["9881880312", "8975191999"],
    whatsapp: null as string | null,
  },
  {
    name: "Roshan Deshmukh",
    marathi: "श्री. रोशन देशमुख",
    phones: ["8378913269"],
    whatsapp: "8378913269",
  },
];

const interests = [
  "Buying a Vehicle",
  "Selling My Vehicle",
  "Vehicle Finance",
  "General Enquiry",
];

const telHref = (n: string) => `tel:+91${n}`;
const waHref = (n: string, text = "") =>
  `https://wa.me/91${n}${text ? `?text=${text}` : ""}`;
const prettyPhone = (n: string) => `${n.slice(0, 5)} ${n.slice(5)}`;
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  interest: string;
  vehicleDetails: string;
  message: string;
};

const initialForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  interest: interests[0],
  vehicleDetails: "",
  message: "",
};

/* -------------------------------------------------------------------------- */
/*  STYLES                                                                    */
/* -------------------------------------------------------------------------- */

const cardClass =
  "rounded-2xl border border-[#e8e1d3] bg-white shadow-[0_1px_2px_rgba(15,28,48,0.04),0_14px_34px_-18px_rgba(15,28,48,0.14)]";

const inputClass =
  "mt-2 block w-full rounded-xl border border-[#e3dccd] bg-[#fdfcf9] px-4 py-3.5 text-base text-[#0f1c30] outline-none transition placeholder:text-[#9b9484] focus:border-[#b98f3f] focus:bg-white focus:ring-4 focus:ring-[#c9a24b]/15 sm:text-sm";

const labelClass = "block text-[13px] font-semibold text-[#0f1c30]";

const errorClass = "mt-1.5 block text-xs font-medium text-[#c0392b]";

const rowLinkClass =
  "group/row flex min-h-12 items-center justify-between gap-2 rounded-xl border border-[#ece6d8] bg-[#faf8f3] px-3.5 text-sm font-medium text-[#0f1c30] transition-all duration-300 hover:border-[#c9a24b]/60 hover:bg-white active:scale-[0.98]";

/* -------------------------------------------------------------------------- */
/*  COMPONENT                                                                 */
/* -------------------------------------------------------------------------- */

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [sent, setSent] = useState(false);
  const [lastLink, setLastLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submissionId = useRef(crypto.randomUUID());

  const fadeUp = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const update = (field: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
    if (sent) setSent(false);
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    const name = form.fullName.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name) next.fullName = "Please enter your name.";
    if (!phone) next.phone = "Phone number is required.";
    else if (!/^\+?[0-9][0-9\s()-]{7,18}$/.test(phone))
      next.phone = "Enter a valid phone number.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!message) next.message = "Please tell us how we can help.";
    else if (message.length < 8) next.message = "Please write a little more.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    setSubmitError("");
    const text = encodeURIComponent(
      [
        "*New Enquiry - Jai Janardan Auto*",
        "",
        `Name: ${form.fullName.trim()}`,
        `Phone: ${form.phone.trim()}`,
        ...(form.email.trim() ? [`Email: ${form.email.trim()}`] : []),
        `Interested in: ${form.interest}`,
        ...(form.vehicleDetails.trim()
          ? [`Vehicle: ${form.vehicleDetails.trim()}`]
          : []),
        "",
        `Message: ${form.message.trim()}`,
      ].join("\n")
    );
    const link = waHref(ENQUIRY_WHATSAPP, text);

    const whatsappWindow = window.open("about:blank", "_blank");
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submissionId.current,
          name: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          interest: form.interest,
          vehicleDetails: form.vehicleDetails.trim(),
          message: form.message.trim(),
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to save your enquiry.");
      }

      if (whatsappWindow) {
        whatsappWindow.opener = null;
        whatsappWindow.location.href = link;
      }
      setLastLink(link);
      setSent(true);
      setForm(initialForm);
      submissionId.current = crypto.randomUUID();
    } catch (error) {
      whatsappWindow?.close();
      setSubmitError(
        error instanceof TypeError
          ? "We could not reach the enquiry service. Your details have not been submitted; please try again."
          : error instanceof Error
            ? error.message
            : "We could not save your enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f4ee] text-[#0f1c30]">
      {/* ============================ HERO ============================ */}
      <section className="relative isolate overflow-hidden border-b border-[#e8e1d3]">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-[0.16]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f7f4ee]/70 via-[#f7f4ee]/90 to-[#f7f4ee]" />
          <motion.div
            aria-hidden="true"
            animate={reduceMotion ? undefined : { y: [0, -16, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-20 top-8 h-64 w-64 rounded-full bg-[#c9a24b]/15 blur-3xl"
          />
        </div>

        <div className="mx-auto max-w-6xl px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-36 lg:px-10">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9a7424]"
          >
            <span className="h-px w-8 bg-[#b98f3f]" />
            Get in touch
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-2xl text-[2.3rem] font-semibold leading-[1.12] tracking-tight text-[#0f1c30] sm:text-5xl lg:text-[3.4rem]"
          >
            Let&apos;s talk about your
            <span className="block text-[#9a7424]">next vehicle.</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-5 max-w-md text-base leading-7 text-[#5a6270] sm:text-lg"
          >
            Buying, selling or finance &mdash; call us, chat on WhatsApp or send
            an enquiry. We&apos;ll get back to you quickly.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <motion.a
              whileTap={{ scale: 0.97 }}
              href={telHref(team[0].phones[0])}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0f1c30] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(15,28,48,0.6)] transition hover:-translate-y-0.5 hover:bg-[#1a2d4a]"
            >
              <Phone size={16} aria-hidden="true" />
              Call Now
            </motion.a>
            <motion.a
              whileTap={{ scale: 0.97 }}
              href={waHref(ENQUIRY_WHATSAPP)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-600/25 bg-white px-6 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-600/50 hover:bg-emerald-50"
            >
              <MessageCircle size={16} aria-hidden="true" />
              WhatsApp Us
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ======================== CONTACT CARDS ======================== */}
      <section className="mx-auto max-w-6xl px-5 pt-12 sm:px-8 sm:pt-14 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {team.map((person, i) => (
            <motion.article
              key={person.name}
              {...fadeUp(i * 0.08)}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              className={`group p-5 transition-colors hover:border-[#c9a24b]/50 ${cardClass}`}
            >
              <div className="flex items-center gap-3.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4ead0] text-sm font-bold text-[#7a5a14] ring-1 ring-[#c9a24b]/30 transition-transform duration-500 group-hover:scale-105">
                  {initials(person.name)}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold tracking-tight text-[#0f1c30]">
                    {person.name}
                  </h3>
                  <p className="truncate text-xs text-[#7b8290]">
                    {person.marathi}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {person.phones.map((num) => (
                  <a key={num} href={telHref(num)} className={rowLinkClass}>
                    <span className="flex items-center gap-2.5 tracking-wide">
                      <Phone
                        size={15}
                        className="text-[#9a7424]"
                        aria-hidden="true"
                      />
                      +91 {prettyPhone(num)}
                    </span>
                    <ArrowRight
                      size={15}
                      className="text-[#9a7424]/60 transition-transform duration-300 group-hover/row:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                ))}

                {person.whatsapp && (
                  <a
                    href={waHref(person.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/row flex min-h-12 items-center justify-between gap-2 rounded-xl border border-emerald-600/20 bg-emerald-50/70 px-3.5 text-sm font-medium text-emerald-900 transition-all duration-300 hover:border-emerald-600/40 hover:bg-emerald-50 active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-2.5">
                      <MessageCircle
                        size={15}
                        className="text-emerald-700"
                        aria-hidden="true"
                      />
                      Chat on WhatsApp
                    </span>
                    <ArrowRight
                      size={15}
                      className="text-emerald-700/60 transition-transform duration-300 group-hover/row:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                )}
              </div>
            </motion.article>
          ))}

          {/* Location card */}
          <motion.article
            {...fadeUp(0.16)}
            whileHover={reduceMotion ? undefined : { y: -3 }}
            className={`flex flex-col p-5 transition-colors hover:border-[#c9a24b]/50 ${cardClass}`}
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4ead0] text-[#7a5a14] ring-1 ring-[#c9a24b]/30">
                <MapPin size={20} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[#0f1c30]">
                  Visit Us
                </h3>
                <p className="text-xs text-[#7b8290]">{ADDRESS_NAME}</p>
              </div>
            </div>

            <address className="mt-4 flex-1 text-sm not-italic leading-6 text-[#5a6270]">
              <span className="font-semibold text-[#0f1c30]">
                {ADDRESS_NAME}
              </span>
              {ADDRESS_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#d9cfb6] bg-[#faf8f3] px-4 text-sm font-semibold text-[#0f1c30] transition-all hover:border-[#b98f3f] hover:bg-white active:scale-[0.98]"
            >
              <Compass
                size={17}
                className="text-[#9a7424] transition-transform duration-500 group-hover/btn:rotate-[30deg]"
                aria-hidden="true"
              />
              Get Directions
            </a>
          </motion.article>
        </div>
      </section>

      {/* ============================ MAP ============================ */}
      <section className="mx-auto max-w-6xl px-5 pt-4 sm:px-8 lg:px-10">
        <motion.div
          {...fadeUp(0.1)}
          className={`overflow-hidden p-2 sm:p-3 ${cardClass}`}
        >
          <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-[#f0ebdf] sm:h-[400px]">
            <iframe
              title={`${ADDRESS_NAME} location map`}
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <div className="flex flex-col gap-3 px-2 pb-2 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-3">
            <p className="flex items-start gap-2.5 text-sm leading-6 text-[#5a6270]">
              <MapPin
                size={17}
                className="mt-1 shrink-0 text-[#9a7424]"
                aria-hidden="true"
              />
              <span>{ADDRESS_FULL}</span>
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0f1c30] px-5 text-sm font-semibold text-white transition hover:bg-[#1a2d4a] active:scale-[0.98]"
            >
              <Compass size={16} aria-hidden="true" />
              Open in Google Maps
            </a>
          </div>
        </motion.div>
      </section>

      {/* ========================= CONTACT FORM ========================= */}
      <section
        id="contact-form"
        className="mx-auto max-w-6xl scroll-mt-6 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <motion.div {...fadeUp()} className="lg:pt-4">
            <span className="block h-[3px] w-10 rounded-full bg-gradient-to-r from-[#c9a24b] to-[#a27e3d]" />
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9a7424]">
              Enquiry
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#0f1c30] sm:text-4xl">
              Send us a message.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#5a6270] sm:text-base">
              Submit your details to save your enquiry with our team. We&apos;ll
              also open WhatsApp with a ready-to-send message.
            </p>

            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-600/20 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Saved enquiry + WhatsApp
            </div>
          </motion.div>

          <motion.form
            {...fadeUp(0.08)}
            onSubmit={handleSubmit}
            noValidate
            className={`p-5 sm:p-8 ${cardClass}`}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Full Name <span className="text-[#b98f3f]">*</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className={inputClass}
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.fullName)}
                />
                {errors.fullName && (
                  <span className={errorClass}>{errors.fullName}</span>
                )}
              </label>

              <label className={labelClass}>
                Phone Number <span className="text-[#b98f3f]">*</span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  placeholder="Your mobile number"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && (
                  <span className={errorClass}>{errors.phone}</span>
                )}
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                Email Address <span className="font-normal text-[#7b8290]">(optional)</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                  maxLength={254}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <span className={errorClass}>{errors.email}</span>
                )}
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                I&apos;m Interested In
                <div className="relative">
                  <select
                    value={form.interest}
                    onChange={(e) => update("interest", e.target.value)}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    {interests.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-[#9a7424]"
                    aria-hidden="true"
                  />
                </div>
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                Vehicle Details <span className="font-normal text-[#7b8290]">(optional)</span>
                <input
                  type="text"
                  value={form.vehicleDetails}
                  onChange={(e) => update("vehicleDetails", e.target.value)}
                  className={inputClass}
                  placeholder="Vehicle make, model or listing"
                  maxLength={240}
                />
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                Message <span className="text-[#b98f3f]">*</span>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={`${inputClass} min-h-[140px] resize-y`}
                  placeholder="Tell us how we can help..."
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && (
                  <span className={errorClass}>{errors.message}</span>
                )}
              </label>
            </div>

            <div className="mt-6">
              {submitError && (
                <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {submitError}
                </p>
              )}
              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#0f1c30] px-7 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(15,28,48,0.7)] transition-colors hover:bg-[#1a2d4a] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[320%]"
                />
                <Send size={16} aria-hidden="true" />
                {submitting ? "Saving enquiry…" : "Save and continue to WhatsApp"}
              </motion.button>

              <AnimatePresence>
                {sent && (
                  <motion.div
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-600/20 bg-emerald-50 p-4 text-sm text-emerald-900">
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      <p className="leading-6">
                        Your enquiry is saved. Use the link below to open
                        WhatsApp with a prefilled message, then press Send to
                        notify our team.{" "}
                        <a
                          href={lastLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold underline underline-offset-2"
                        >
                          Didn&apos;t open? Tap here.
                        </a>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}