import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  MessageCircle,
  MessageSquareText,
  PhoneCall,
  Send,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import heroImage from "../assets/heo-bg.png";

const quickLinks = [
  {
    label: "Browse Vehicles",
    to: "/vehicles",
    description: "Explore available commercial vehicles.",
  },
  {
    label: "Sell Your Vehicle",
    to: "/sell-your-vehicle",
    description: "List your vehicle with our team.",
  },
  {
    label: "Explore Finance",
    to: "/finance",
    description: "Estimate your EMI and explore finance options.",
  },
];

const reasons = [
  {
    id: "01",
    title: "Vehicle Guidance",
    description: "Get help choosing a vehicle based on your business requirements.",
    icon: Truck,
  },
  {
    id: "02",
    title: "Finance Support",
    description: "Understand available finance options and estimate your EMI.",
    icon: ShieldCheck,
  },
  {
    id: "03",
    title: "Selling Assistance",
    description: "Get guidance through the process of listing and selling your vehicle.",
    icon: UserRound,
  },
];

const faqs = [
  {
    question: "Can I enquire about a vehicle before visiting?",
    answer:
      "Yes. Share your requirements and we can help shortlist suitable vehicles before you visit.",
  },
  {
    question: "How can I sell my commercial vehicle?",
    answer:
      "You can send a vehicle enquiry through this page or use the Sell Your Vehicle section on the website. Our team can guide you through the next steps.",
  },
  {
    question: "Can I get finance assistance for a used vehicle?",
    answer:
      "Yes. We can discuss finance support options for used commercial vehicles and help you understand the likely process and requirements.",
  },
  {
    question: "What information should I provide in an enquiry?",
    answer:
      "A few details such as your preferred vehicle type, usage needs, budget, and contact information help us respond with the right guidance.",
  },
  {
    question: "Do you help with different types of commercial vehicles?",
    answer:
      "We support a range of commercial and business-use vehicles, and can help narrow the options based on your requirement.",
  },
];

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  interest: "Buying a Vehicle",
  message: "",
};

const inputClass =
  "mt-2 block w-full rounded-xl border border-[#e5ddce] bg-[#fffdfb] px-4 py-3 text-sm text-[#171b22] shadow-sm outline-none transition placeholder:text-[#8a8478] focus:border-[#c9a24b] focus:ring-4 focus:ring-[#c9a24b]/15";

const labelClass = "block text-sm font-semibold text-[#0e1d31]";

export default function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialForm, string>>>({});
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const contactDetails = useMemo(
    () => [
      {
        title: "CALL US",
        icon: PhoneCall,
        description: "Reach out to our team for vehicle guidance and support.",
        secondary: "Contact our team for a callback.",
        href: "#contact-form",
        actionLabel: "Call Now",
        type: "link" as const,
      },
      {
        title: "WHATSAPP",
        icon: MessageCircle,
        description: "Chat with us for quick answers about vehicles, selling, and finance.",
        secondary: "Chat with our team for a quick conversation.",
        href: "#contact-form",
        actionLabel: "Chat on WhatsApp",
        type: "link" as const,
      },
      {
        title: "VISIT US",
        icon: MapPin,
        description: "Visit our location",
        secondary: "Contact our team for location details.",
        href: "#location",
        actionLabel: "Find Us",
        type: "link" as const,
      },
      {
        title: "BUSINESS HOURS",
        icon: Clock3,
        description: "Monday – Saturday",
        secondary: "Business hours available on request.",
        href: "#",
        actionLabel: "Hours",
        type: "button" as const,
      },
    ],
    []
  );

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof typeof initialForm, string>> = {};
    const fullName = formData.fullName.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!fullName) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!phone) {
      nextErrors.phone = "Phone number is required.";
    } else if (!/^\+?[0-9][0-9\s()-]{7,18}$/.test(phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.interest.trim()) {
      nextErrors.interest = "Please choose an enquiry type.";
    }

    if (!message) {
      nextErrors.message = "Please tell us how we can help.";
    } else if (message.length < 12) {
      nextErrors.message = "Message should be at least 12 characters long.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      setSubmitState("idle");
      setStatusMessage("Please review the form and try again.");
      return;
    }

    setSubmitState("loading");
    setStatusMessage("");

    window.setTimeout(() => {
      setSubmitState("success");
      setStatusMessage("Thank you. Your enquiry has been received. Our team will contact you shortly.");
      setFormData(initialForm);
    }, 700);
  };

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-[#111827]">
      <section className="relative isolate overflow-hidden bg-[#071326]">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Commercial vehicles at a dealership"
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[#071326]/80" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-10 lg:pb-24 lg:pt-36">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="max-w-xl"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#e3be6a]">
                GET IN TOUCH
              </p>
              <h1 className="font-serif text-4xl leading-[0.96] text-[#f7f3ea] sm:text-5xl lg:text-[4rem]">
                Let&apos;s Talk About Your
                <span className="block text-[#e3be6a]">Next Vehicle.</span>
              </h1>
              <div className="mt-5 h-px w-20 bg-[#e3be6a]" />
              <p className="mt-6 max-w-lg text-base leading-7 text-[#e7e0d2]/82 sm:text-lg">
                Looking for the right commercial vehicle, planning to sell your vehicle, or need help with finance? Our team is here to help you make the right decision.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/vehicles"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e3be6a] px-5 py-3.5 text-sm font-semibold text-[#0d1724] transition hover:-translate-y-0.5 hover:bg-[#efdba0]"
                >
                  Browse Vehicles
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/sell-your-vehicle"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e3be6a]/50 bg-white/5 px-5 py-3.5 text-sm font-semibold text-[#f7f3ea] backdrop-blur-sm transition hover:border-[#e3be6a] hover:bg-[#e3be6a]/10"
                >
                  Sell Your Vehicle
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
              className="rounded-[28px] border border-[#d8cda7]/30 bg-[#f8f2e9]/95 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a5d20]">
                    Business Support
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-[#0d1724]">We help move your business forward.</h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5e6ba] text-[#6d4d12]">
                  <Building2 size={20} />
                </span>
              </div>

              <div className="mt-7 space-y-4">
                <div className="rounded-2xl border border-[#e7dfd0] bg-[#fbf8f3] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d6a45]">Buying & Selling</p>
                  <p className="mt-2 text-sm leading-6 text-[#4d4d4d]">
                    From commercial vehicle sourcing to listing and valuation, we guide every step with practical advice.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e7dfd0] bg-[#fbf8f3] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d6a45]">Finance</p>
                  <p className="mt-2 text-sm leading-6 text-[#4d4d4d]">
                    Understand likely options, EMI expectations, and the purchasing process for your business fleet needs.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7424]">WE&apos;RE HERE TO HELP</p>
          <h2 className="mt-4 font-serif text-3xl text-[#0d1724] sm:text-4xl">Whether you are buying, selling or exploring finance options, we&apos;re ready to help.</h2>
          <p className="mt-4 text-base leading-7 text-[#5f6670]">
            Reach out to us and our team will guide you through the next steps with clarity and practical advice.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contactDetails.map(({ title, icon: Icon, description, secondary, href, actionLabel, type }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
              className="rounded-[26px] border border-[#e5ddce] bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.04)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e9d1] text-[#6d4d12]">
                <Icon size={22} />
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#9a7424]">{title}</p>
              <h3 className="mt-3 text-xl font-semibold text-[#142033]">{description}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5f6670]">{secondary}</p>

              {type === "link" ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0d1724] transition hover:text-[#9a7424]"
                >
                  {actionLabel} <ArrowRight size={16} />
                </a>
              ) : (
                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0d1724] transition hover:text-[#9a7424]"
                >
                  {actionLabel} <ArrowRight size={16} />
                </button>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      <section id="contact-form" className="bg-[#f3efe8] py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="rounded-[28px] border border-[#e5ddce] bg-white p-5 shadow-[0_18px_38px_rgba(15,23,42,0.04)] sm:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4e7c4] text-[#6d4d12]">
                <MessageSquareText size={22} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7424]">ENQUIRY</p>
                <h2 className="mt-1 font-serif text-2xl text-[#0d1724]">Send Us an Enquiry</h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#5f6670]">
              Tell us what you are looking for and our team will get back to you.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-[#e5ddce] bg-[#f9f5ee] p-4">
                <p className="text-sm font-semibold text-[#0d1724]">Fast support</p>
                <p className="mt-2 text-sm leading-6 text-[#5f6670]">
                  We typically respond with practical guidance on vehicle selection, finance options, and selling support.
                </p>
              </div>
              <div className="rounded-2xl border border-[#e5ddce] bg-[#f9f5ee] p-4">
                <p className="text-sm font-semibold text-[#0d1724]">Business-focused advice</p>
                <p className="mt-2 text-sm leading-6 text-[#5f6670]">
                  Share your requirement, preferred vehicle category, and timeline to help our team understand your needs.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[28px] border border-[#e5ddce] bg-white p-5 shadow-[0_18px_38px_rgba(15,23,42,0.04)] sm:p-7"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Full Name <span className="text-[#c6403c]">*</span>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  className={inputClass}
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.fullName)}
                />
                {errors.fullName && <span className="mt-1.5 block text-xs font-medium text-[#c6403c]">{errors.fullName}</span>}
              </label>

              <label className={labelClass}>
                Phone Number <span className="text-[#c6403c]">*</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className={inputClass}
                  placeholder="Your mobile number"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <span className="mt-1.5 block text-xs font-medium text-[#c6403c]">{errors.phone}</span>}
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                Email Address
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <span className="mt-1.5 block text-xs font-medium text-[#c6403c]">{errors.email}</span>}
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                I&apos;m Interested In <span className="text-[#c6403c]">*</span>
                <select
                  value={formData.interest}
                  onChange={(event) => updateField("interest", event.target.value)}
                  className={inputClass}
                  aria-invalid={Boolean(errors.interest)}
                >
                  <option>Buying a Vehicle</option>
                  <option>Selling My Vehicle</option>
                  <option>Vehicle Finance</option>
                  <option>General Enquiry</option>
                </select>
                {errors.interest && <span className="mt-1.5 block text-xs font-medium text-[#c6403c]">{errors.interest}</span>}
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                Message <span className="text-[#c6403c]">*</span>
                <textarea
                  value={formData.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  className={`${inputClass} min-h-[150px] resize-y`}
                  placeholder="Tell us how we can help..."
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && <span className="mt-1.5 block text-xs font-medium text-[#c6403c]">{errors.message}</span>}
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={submitState === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d1724] px-5 py-3.5 text-sm font-semibold text-[#f8f3eb] transition hover:bg-[#172b42] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitState === "loading" ? "Sending..." : "Send Enquiry"}
                {!submitState || submitState !== "loading" ? <Send size={16} /> : null}
              </button>

              {statusMessage && (
                <div
                  aria-live="polite"
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                    submitState === "success"
                      ? "border-[#cfe8d7] bg-[#ebf9ee] text-[#1d5a35]"
                      : "border-[#f0d7d4] bg-[#fff2f1] text-[#a03b3b]"
                  }`}
                >
                  {submitState === "success" ? <CheckCircle2 size={16} /> : <MessageSquareText size={16} />}
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          </motion.form>
        </div>
      </section>

      <section id="location" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="rounded-[32px] border border-[#e5ddce] bg-[#f8f3ed] p-5 shadow-[0_18px_38px_rgba(15,23,42,0.04)] sm:p-7 lg:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9a7424]">FIND US</p>
              <h2 className="mt-4 font-serif text-3xl text-[#0d1724] sm:text-4xl">Visit Our Location</h2>
              <div className="mt-6 rounded-[24px] border border-[#e5ddce] bg-white p-5">
                <div className="flex items-center gap-3 text-[#0d1724]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4e7c4] text-[#6d4d12]">
                    <MapPin size={20} />
                  </span>
                  <span className="text-lg font-semibold">Visit us or contact our team for location details.</span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-[#e5ddce] bg-[#0d1724] p-4 sm:p-5">
              <div className="flex h-[350px] items-center justify-center rounded-[20px] bg-[radial-gradient(circle_at_center,_rgba(196,157,90,0.28),_rgba(13,23,36,0.96)_52%,_rgba(8,14,22,1))] p-6 text-center text-[#f8f3eb]">
                <div className="max-w-sm">
                  <MapPin size={34} className="mx-auto text-[#e3be6a]" />
                  <p className="mt-4 text-lg font-semibold">Our location details are available on request.</p>
                  <p className="mt-3 text-sm leading-6 text-[#dfe6ea]">
                    Reach out for the exact address and directions before your visit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf5] py-16 sm:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7424]">WHY SPEAK WITH US</p>
            <h2 className="mt-4 font-serif text-3xl text-[#0d1724] sm:text-4xl">Guidance Beyond the Vehicle</h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {reasons.map(({ id, title, description, icon: Icon }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-[26px] border border-[#ebe3d9] bg-white p-5 shadow-[0_16px_28px_rgba(15,23,42,0.03)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7424]">{id}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e9d1] text-[#6d4d12]">
                    <Icon size={20} />
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[#142033]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5f6670]">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071326] py-16 sm:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="rounded-[32px] border border-[#c9a24b]/25 bg-[#0d1724] p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e3be6a]">WHAT CAN WE HELP YOU WITH?</p>
                <h2 className="mt-4 font-serif text-3xl text-[#f7f3ea] sm:text-4xl">What Can We Help You With?</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {quickLinks.map(({ label, to, description }, index) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="rounded-[24px] border border-[#d7b770]/30 bg-white/5 p-5"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#e3be6a]">{label}</p>
                  <p className="mt-4 text-sm leading-6 text-[#dde3ea]">{description}</p>
                  <Link
                    to={to}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f7f3ea] transition hover:text-[#e3be6a]"
                  >
                    {label} <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7424]">QUICK ANSWERS</p>
          <h2 className="mt-4 font-serif text-3xl text-[#0d1724] sm:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map(({ question, answer }, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={question} className="overflow-hidden rounded-[20px] border border-[#e5ddce] bg-white shadow-[0_10px_20px_rgba(15,23,42,0.02)]">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-[#0d1724]">{question}</span>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#f5e7bf] text-[#6d4d12] transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                    <ChevronDown size={16} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-6 text-[#5f6670]">{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#f7f3ec] pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div className="rounded-[32px] border border-[#e5ddce] bg-white p-6 shadow-[0_18px_38px_rgba(15,23,42,0.04)] sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="font-serif text-3xl text-[#0d1724] sm:text-4xl">Have a Vehicle Requirement?</h2>
                <p className="mt-4 text-base leading-7 text-[#5f6670]">
                  Tell us what you need and let us help you find the right vehicle for your business.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/vehicles"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e3be6a] px-5 py-3.5 text-sm font-semibold text-[#0d1724] transition hover:-translate-y-0.5 hover:bg-[#efdba0]"
                >
                  Browse Vehicles <ArrowRight size={16} />
                </Link>
                <a
                  href="#contact-form"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d7b770] bg-[#fffaf1] px-5 py-3.5 text-sm font-semibold text-[#0d1724] transition hover:border-[#c9a24b] hover:bg-[#fff5de]"
                >
                  Contact Our Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
