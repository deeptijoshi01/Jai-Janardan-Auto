import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardList,
  Clock,
  FileText,
  Headphones,
  ImagePlus,
  Lightbulb,
  Loader2,
  MapPin,
  Megaphone,
  Phone,
  Search,
  ShieldCheck,
  Star,
  UploadCloud,
  User,
  Users,
  X,
} from "lucide-react";
import { fetchBrands, fetchCategories } from "../services/categoryBrandApi";
import type { Brand, Category } from "../types/categoryBrand";

/* Vehicle images (src/assets/VehicleTypes) */
import miniTrucksImg from "../assets/VehicleTypes/Mini Trucks.png";
import pickupTrucksImg from "../assets/VehicleTypes/Pickup Trucks.png";
import tippersImg from "../assets/VehicleTypes/Tippers.png";
import innovaImg from "../assets/VehicleTypes/Toyota Innova Crysta Studio Showcase.png";
import trailersImg from "../assets/VehicleTypes/Trailers.png";
import transitMixersImg from "../assets/VehicleTypes/Transit Mixers.png";
import truckImg from "../assets/VehicleTypes/Truck.png";

const API_BASE_URL = "http://localhost:5000/api";
const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

interface SelectedImage {
  file: File;
  preview: string;
}

interface UploadedImage {
  url: string;
  publicId: string;
}

const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-[#e6e1d6] bg-[#fdfcf9] px-4 text-sm text-[#14110a] outline-none transition placeholder:text-[#a39d90] focus:border-[#c9a050] focus:bg-white focus:ring-4 focus:ring-[#c9a050]/15 disabled:cursor-not-allowed disabled:opacity-60";
const textareaClass =
  "mt-2 w-full rounded-xl border border-[#e6e1d6] bg-[#fdfcf9] px-4 py-3 text-sm text-[#14110a] outline-none transition placeholder:text-[#a39d90] focus:border-[#c9a050] focus:bg-white focus:ring-4 focus:ring-[#c9a050]/15";
const labelClass = "block text-sm font-semibold text-[#39352d]";
const cardClass =
  "rounded-3xl border border-[#efeae0] bg-white p-5 shadow-[0_10px_40px_-18px_rgba(60,40,0,0.25)] sm:p-7";

const trustPoints = [
  { icon: ShieldCheck, title: "Quick evaluation", text: "Fast review by our team" },
  { icon: Users, title: "Verified buyers", text: "Trusted network across India" },
  { icon: ClipboardList, title: "Hassle-free process", text: "Simple and transparent selling" },
];

const vehicleStrip = [
  { name: "Mini Trucks", src: miniTrucksImg },
  { name: "Pickup Trucks", src: pickupTrucksImg },
  { name: "Tippers", src: tippersImg },
  { name: "Trailers", src: trailersImg },
  { name: "Transit Mixers", src: transitMixersImg },
  { name: "Cars & SUVs", src: innovaImg },
];

const tips = [
  "Provide accurate and complete details",
  "Upload clear and high-quality photos",
  "Mention the actual condition of the vehicle",
  "Our team will contact you after review",
];

const whyUs = [
  { icon: ShieldCheck, title: "Trusted platform", text: "Years of experience in the automobile industry" },
  { icon: Users, title: "Wide network", text: "Access to genuine buyers across India" },
  { icon: BadgeCheck, title: "Best value", text: "Get the right price for your vehicle" },
];

function Field({
  label,
  required,
  className = "",
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className={`${labelClass} ${className}`}>
      {label}
      {required && <span className="text-red-500"> *</span>}
      {children}
      {hint && <span className="mt-1.5 block text-xs font-normal text-[#8a8478]">{hint}</span>}
    </label>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof MapPin;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f6e7c4] to-[#ecd4a0] text-[#76591f]">
        <Icon size={22} />
      </span>
      <div>
        <h2 className="font-serif text-xl font-semibold leading-tight sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-[#6b665c]">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function SellYourVehicle() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [fuelType, setFuelType] = useState("Diesel");
  const [transmission, setTransmission] = useState("Manual");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ownerLocation, setOwnerLocation] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const uploadInput = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<SelectedImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((result) => {
        if (active) setCategories(result);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setCategoryError(
            loadError instanceof Error ? loadError.message : "Unable to load vehicle categories."
          );
        }
      })
      .finally(() => {
        if (active) setLoadingCategories(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(
    () => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview)),
    []
  );

  const activeBrands = useMemo(
    () => brands.filter((item) => item.isActive),
    [brands]
  );

  const activeCategories = useMemo(
    () => categories.filter((item) => item.isActive),
    [categories]
  );

  /* Progress indicator only (visual) — does not affect validation or submit */
  const stepDone = useMemo(() => {
    const vehicle = Boolean(category && brand && model.trim() && year && kilometers && expectedPrice && location.trim());
    const photos = images.length > 0;
    const contact = Boolean(ownerName.trim() && phone.trim());
    return [vehicle, photos, contact, vehicle && photos && contact];
  }, [category, brand, model, year, kilometers, expectedPrice, location, images.length, ownerName, phone]);
  const currentStep = stepDone.findIndex((done) => !done);

  const changeCategory = async (value: string) => {
    setCategory(value);
    setBrand("");
    setBrands([]);
    setCategoryError("");
    if (!value) return;
    setLoadingBrands(true);
    try {
      setBrands(await fetchBrands(value as "commercial" | "cars"));
    } catch (loadError) {
      setCategoryError(
        loadError instanceof Error ? loadError.message : "Unable to load brands."
      );
    } finally {
      setLoadingBrands(false);
    }
  };

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (selected.length + images.length > MAX_IMAGES) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }
    const invalidType = selected.find((file) => !file.type.startsWith("image/"));
    if (invalidType) {
      setError("Choose image files only.");
      return;
    }
    const oversized = selected.find((file) => file.size > MAX_IMAGE_SIZE);
    if (oversized) {
      setError("Each image must be 10 MB or smaller.");
      return;
    }
    setError("");
    setUploadedImages([]);
    setImages((current) => [
      ...current,
      ...selected.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
    setUploadedImages([]);
  };

  const validateForm = () => {
    if (!category || !brand || !model.trim() || !year || !location.trim() || !ownerName.trim() || !phone.trim()) {
      return "Complete all required vehicle and owner details.";
    }
    const numericYear = Number(year);
    if (!Number.isInteger(numericYear) || numericYear < 1950 || numericYear > new Date().getFullYear()) {
      return "Enter a valid manufacturing year.";
    }
    if (!Number.isFinite(Number(kilometers)) || Number(kilometers) < 0) {
      return "Kilometers must be zero or greater.";
    }
    if (!Number.isFinite(Number(expectedPrice)) || Number(expectedPrice) <= 0) {
      return "Expected selling price must be greater than zero.";
    }
    if (!/^\+?[0-9][0-9\s()-]{7,18}$/.test(phone.trim())) {
      return "Enter a valid mobile number.";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Enter a valid email address.";
    }
    if (images.length === 0) return "Add at least one vehicle image.";
    return "";
  };

  const uploadSelectedImages = async (): Promise<UploadedImage[]> => {
    const formData = new FormData();
    images.forEach(({ file }) => formData.append("images", file));
    const response = await fetch(`${API_BASE_URL}/upload-multiple`, {
      method: "POST",
      body: formData,
    });
    const data = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
      images?: UploadedImage[];
    } | null;
    if (!response.ok || !data?.success || !Array.isArray(data.images) || data.images.length !== images.length) {
      throw new Error(data?.message || `Image upload failed (${response.status}).`);
    }
    return data.images;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const finalImages =
        uploadedImages.length === images.length
          ? uploadedImages
          : await uploadSelectedImages();
      setUploadedImages(finalImages);

      const response = await fetch(`${API_BASE_URL}/sell-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: ownerName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          ownerLocation: ownerLocation.trim(),
          additionalMessage: additionalMessage.trim(),
          category,
          brand,
          model: model.trim(),
          year: Number(year),
          kilometers: Number(kilometers),
          fuelType,
          transmission,
          expectedPrice: Number(expectedPrice),
          location: location.trim(),
          description: description.trim(),
          images: finalImages,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || `Unable to submit request (${response.status}).`);
      }
      setSubmitted(true);
    } catch (submitError) {
      console.error("Sell vehicle submission error:", submitError);
      setError(submitError instanceof Error ? submitError.message : "Unable to submit your vehicle.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const nextSteps = [
      { icon: Check, title: "Request received", text: "Your vehicle details have been submitted." },
      { icon: FileText, title: "Team review", text: "Our experts will review your vehicle information." },
      { icon: User, title: "Owner verification", text: "Our team may contact you for verification." },
      { icon: Megaphone, title: "Vehicle listing", text: "Once verified, your vehicle will be listed on our platform." },
    ];
    const assurances = [
      { icon: Headphones, title: "Need assistance?", text: "Our team is here to help you." },
      { icon: Clock, title: "Quick response", text: "We usually contact within 24 hours." },
      { icon: BadgeCheck, title: "Trusted platform", text: "1000+ happy customers across India." },
    ];

    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f9f0d9] via-[#fbf8ef] to-[#fbfaf7] px-3 pb-14 pt-24 sm:px-6 sm:pt-28">
        {/* soft gold lines, desktop only */}
        <span aria-hidden className="pointer-events-none absolute -left-24 top-40 hidden h-px w-[28rem] rotate-[28deg] bg-gradient-to-r from-transparent via-[#d9b765] to-transparent lg:block" />
        <span aria-hidden className="pointer-events-none absolute -right-24 top-32 hidden h-px w-[28rem] -rotate-[28deg] bg-gradient-to-r from-transparent via-[#d9b765] to-transparent lg:block" />

        <section className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-[#ecdcb4] bg-white/95 shadow-[0_30px_80px_-30px_rgba(120,85,20,0.35)]">
          {/* Top: message + visual */}
          <div className="grid items-center lg:grid-cols-[1fr_1.1fr]">
            <div className="px-5 pb-2 pt-9 text-center sm:px-10 sm:pt-12">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <span aria-hidden className="absolute inset-0 rounded-full bg-[#f6e7c4]/70" />
                <span aria-hidden className="absolute -inset-2 rounded-full border border-dashed border-[#e3c982]" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a050] to-[#8a6218] text-white shadow-lg">
                  <Check size={34} strokeWidth={3} />
                </span>
              </div>
              <h1 className="mt-5 font-serif text-3xl font-bold leading-[1.1] text-[#14110a] sm:text-5xl">
                Vehicle Submission <span className="text-[#9a7424]">Received</span>
              </h1>
              <p className="mt-5 text-base font-medium text-[#39352d]">Thank you for choosing Jai Janardan Auto.</p>
              <p className="mx-auto mt-2 max-w-sm leading-7 text-[#6b665c]">
                Your vehicle details have been submitted successfully. Our team will review the information and
                contact you shortly.
              </p>
            </div>

            <div className="relative mx-auto mt-2 w-full max-w-lg px-4 pb-2 lg:mt-0 lg:max-w-none lg:px-0 lg:pb-0">
              <span aria-hidden className="absolute left-1/2 top-3 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#f1dba8] to-[#faf1da] sm:h-56 sm:w-56 lg:top-0 lg:h-72 lg:w-72" />
              <div className="relative flex items-end justify-center pt-8 lg:pt-12">
                <img src={miniTrucksImg} alt="" className="relative z-10 -mr-[10%] w-[34%] object-contain mix-blend-multiply drop-shadow-lg" />
                <img src={tippersImg} alt="Commercial trucks" className="relative z-20 w-[58%] object-contain mix-blend-multiply drop-shadow-xl" />
                <img src={truckImg} alt="" className="relative z-10 -ml-[12%] hidden w-[36%] object-contain mix-blend-multiply drop-shadow-lg sm:block" />
              </div>
            </div>
          </div>

          <div className="space-y-4 px-3 pb-8 pt-4 sm:px-8">
            {/* What happens next */}
            <section className="rounded-2xl border border-[#efeae0] bg-[#fdfbf5] p-5 sm:p-6">
              <h2 className="font-serif text-xl font-bold sm:text-2xl">What happens next?</h2>
              <p className="mt-1 text-sm text-[#6b665c]">Here&apos;s what you can expect after your submission.</p>

              <ol className="mt-6 grid gap-y-7 sm:grid-cols-4 sm:gap-x-4">
                {nextSteps.map(({ icon: Icon, title, text }, index) => (
                  <li key={title} className="relative flex gap-4 sm:block">
                    {index < nextSteps.length - 1 && (
                      <span
                        aria-hidden
                        className={`absolute bottom-[-1.75rem] left-6 top-12 w-0.5 -translate-x-1/2 sm:bottom-auto sm:left-[3.75rem] sm:right-2 sm:top-6 sm:h-0.5 sm:w-auto sm:translate-x-0 sm:-translate-y-1/2 ${
                          index === 0 ? "bg-[#c9a050]" : "bg-[#e0dbd0]"
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                        index === 0
                          ? "bg-gradient-to-br from-[#c9a050] to-[#8a6218] text-white shadow-md"
                          : "border border-[#e0dbd0] bg-white text-[#4d493f]"
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    <span className="block sm:mt-3">
                      <span className="block text-sm font-bold text-[#14110a]">0{index + 1}</span>
                      <span className="mt-0.5 block font-serif text-base font-bold leading-tight">{title}</span>
                      <span className="mt-1 block text-sm leading-snug text-[#6b665c]">{text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Privacy */}
            <div className="flex items-center gap-4 rounded-2xl bg-[#eef5ea] p-4 sm:px-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
                <ShieldCheck size={22} />
              </span>
              <p className="text-sm">
                <span className="block font-semibold leading-snug text-emerald-900">
                  Your contact details are kept private and will only be used to review your vehicle submission.
                </span>
                <span className="mt-0.5 block text-xs text-[#6b665c]">
                  You will receive a call or message from our team shortly.
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#14110a] bg-white px-8 text-base font-semibold text-[#14110a] transition hover:bg-[#f6f3ec] sm:min-w-56"
              >
                <ArrowLeft size={18} /> Back to Home
              </Link>
              <Link
                to="/buy-vehicles"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#e3b94f] to-[#c9972c] px-8 text-base font-semibold text-[#14110a] shadow-lg transition hover:brightness-105 sm:min-w-56"
              >
                <Search size={18} /> Browse Vehicles <ArrowRight size={18} />
              </Link>
            </div>

            {/* Assurances */}
            <ul className="grid gap-4 pt-4 sm:grid-cols-3 sm:gap-0">
              {assurances.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-center gap-3 sm:px-4 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-[#e6e1d6]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fbf1d9] text-[#8a6218]">
                    <Icon size={22} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{title}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-[#777166]">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    );
  }

  const stepLabels = [
    { title: "Vehicle details", sub: "Tell us about your vehicle", target: "vehicle-details" },
    { title: "Photos", sub: "Upload clear photos", target: "vehicle-photos" },
    { title: "Your details", sub: "Contact information", target: "contact-details" },
    { title: "Review & submit", sub: "Check and confirm", target: "submit-request" },
  ];

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fbfaf7] pb-16 pt-20 text-[#14110a] sm:pt-24">
      {/* ───────── Hero ───────── */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-7 lg:px-10">
          <Link
            to="/"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e6e1d6] bg-white px-4 text-sm font-medium text-[#4d493f] shadow-sm transition hover:border-[#c9a050]"
          >
            <ArrowLeft size={16} /> Home
          </Link>

          <div className="mt-6 grid items-center gap-2 lg:grid-cols-[1fr_1.15fr] lg:gap-6">
            <header>
              <p className="text-sm font-semibold text-[#9a7424]">Sell with Jai Janardan Auto</p>
              <h1 className="mt-1.5 font-serif text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
                Sell Your <span className="text-[#9a7424]">Vehicle</span>
              </h1>
              <p className="mt-4 max-w-md leading-7 text-[#6b665c]">
                Get the right value for your vehicle with a trusted platform. Share your details and our team will
                review your request before any listing goes live.
              </p>

              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                {trustPoints.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f6e7c4] to-[#e8cd93] text-[#76591f] shadow-sm">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold leading-tight">{title}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-[#777166]">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </header>

            {/* Hero visual */}
            <div className="relative mx-auto mt-6 w-full max-w-xl lg:mt-0 lg:max-w-none">
              <div className="absolute left-1/2 top-2 h-44 w-44 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#f1dba8] to-[#f8eed4] sm:h-60 sm:w-60 lg:left-[46%] lg:top-0 lg:h-72 lg:w-72" />
              <div className="relative flex items-end justify-center pt-6 sm:pt-8">
                <img
                  src={tippersImg}
                  alt="Commercial tipper truck"
                  className="relative z-10 w-[64%] object-contain mix-blend-multiply drop-shadow-xl"
                />
                <img
                  src={innovaImg}
                  alt="Toyota Innova Crysta"
                  className="relative z-20 -ml-[14%] w-[52%] object-contain mix-blend-multiply drop-shadow-xl"
                />
              </div>
              <div className="relative z-30 mx-auto mt-3 w-fit rounded-2xl border border-[#ecdcb4] bg-gradient-to-br from-[#fbf1d9] to-[#f3e1b4] px-5 py-3 text-center shadow-md lg:absolute lg:-top-1 lg:right-0 lg:mt-0 lg:w-44 lg:text-left">
                <p className="font-serif text-lg font-semibold leading-tight">Turn your vehicle into value</p>
                <p className="mt-1 text-xs text-[#6b5a2f]">Safe. Simple. Reliable.</p>
              </div>
            </div>
          </div>

          {/* Vehicle types strip */}
          <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <ul className="flex w-max gap-3 sm:w-auto sm:flex-wrap sm:justify-center">
              {vehicleStrip.map((item) => (
                <li
                  key={item.name}
                  className="flex w-28 shrink-0 flex-col items-center rounded-2xl border border-[#efeae0] bg-white px-2 pb-2.5 pt-2 shadow-sm"
                >
                  <img src={item.src} alt="" className="h-14 w-full object-contain mix-blend-multiply" />
                  <span className="mt-1 text-center text-xs font-medium text-[#4d493f]">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── Progress ───────── */}
      <div className="sticky top-16 z-30 mt-6 sm:static sm:top-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-7 lg:px-10">
          <nav
            aria-label="Form progress"
            className="rounded-2xl border border-[#efeae0] bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-6 sm:py-4"
          >
            <ol className="flex items-center justify-between gap-1 sm:gap-3">
              {stepLabels.map((step, index) => {
                const done = stepDone[index];
                const active = index === (currentStep === -1 ? 3 : currentStep);
                return (
                  <li key={step.target} className="flex flex-1 items-center gap-2 last:flex-none sm:gap-3">
                    <a
                      href={`#${step.target}`}
                      className="flex items-center gap-2.5"
                      aria-current={active ? "step" : undefined}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm transition sm:h-10 sm:w-10 ${
                          done
                            ? "bg-emerald-600"
                            : active
                            ? "bg-gradient-to-br from-[#b98a2d] to-[#8a6218]"
                            : "bg-[#b9b5ab]"
                        }`}
                      >
                        {done ? <Check size={18} /> : index + 1}
                      </span>
                      <span className="hidden min-w-0 sm:block">
                        <span className={`block text-sm font-semibold ${active ? "text-[#9a7424]" : "text-[#14110a]"}`}>
                          {step.title}
                        </span>
                        <span className="block truncate text-xs text-[#777166]">{step.sub}</span>
                      </span>
                    </a>
                    {index < stepLabels.length - 1 && (
                      <span
                        className={`h-0.5 flex-1 rounded-full ${done ? "bg-[#c9a050]" : "bg-[#e6e1d6]"}`}
                        aria-hidden
                      />
                    )}
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 text-center text-xs font-medium text-[#9a7424] sm:hidden">
              {stepLabels[currentStep === -1 ? 3 : currentStep].title}
              <span className="text-[#777166]"> — {stepLabels[currentStep === -1 ? 3 : currentStep].sub}</span>
            </p>
          </nav>
        </div>
      </div>

      {/* ───────── Form + Sidebar ───────── */}
      <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-7 lg:px-10">
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
          <form onSubmit={handleSubmit} noValidate className="min-w-0 space-y-6">
            {/* Vehicle information */}
            <section id="vehicle-details" className={`${cardClass} scroll-mt-40`}>
              <SectionHeading
                icon={MapPin}
                title="Vehicle information"
                subtitle="Provide accurate details to help us evaluate your vehicle."
              />

              <div className="mt-6">
                <p className={labelClass}>
                  Category <span className="text-red-500">*</span>
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {loadingCategories &&
                    [0, 1].map((key) => (
                      <div key={key} className="h-24 animate-pulse rounded-2xl border border-[#efeae0] bg-[#f6f3ec]" />
                    ))}
                  {!loadingCategories &&
                    activeCategories.map((item) => {
                      const selected = category === item.type;
                      const isCar = item.type === "cars";
                      return (
                        <button
                          key={item._id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => void changeCategory(item.type)}
                          className={`relative flex items-center gap-4 rounded-2xl border-2 p-3 text-left transition ${
                            selected
                              ? "border-[#c9a050] bg-gradient-to-br from-[#fff9ea] to-[#fbefd0] shadow-md"
                              : "border-[#e6e1d6] bg-white hover:border-[#d8c89f]"
                          }`}
                        >
                          <span className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                            <img
                              src={isCar ? innovaImg : truckImg}
                              alt=""
                              className="h-full w-full object-contain mix-blend-multiply"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-base font-semibold leading-tight">{item.name}</span>
                            <span className="mt-1 block text-xs text-[#777166]">
                              {isCar ? "Cars • SUVs • Hatchbacks" : "Trucks • LCV • HCV • Buses"}
                            </span>
                          </span>
                          {selected && (
                            <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#9a7424] text-white">
                              <Check size={14} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
                {categoryError && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    {categoryError}
                  </p>
                )}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Brand" required>
                  <select
                    required
                    value={brand}
                    disabled={!category || loadingBrands}
                    onChange={(event) => setBrand(event.target.value)}
                    className={fieldClass}
                  >
                    <option value="">
                      {loadingBrands ? "Loading brands…" : !category ? "Select category first" : "Select brand"}
                    </option>
                    {activeBrands.map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Model" required>
                  <input
                    required
                    value={model}
                    placeholder="Enter model name"
                    onChange={(event) => setModel(event.target.value)}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Manufacturing year" required>
                  <input
                    required
                    type="number"
                    inputMode="numeric"
                    min="1950"
                    max={new Date().getFullYear()}
                    placeholder="e.g. 2020"
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Kilometers" required>
                  <input
                    required
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="e.g. 85000"
                    value={kilometers}
                    onChange={(event) => setKilometers(event.target.value)}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Fuel type">
                  <select value={fuelType} onChange={(event) => setFuelType(event.target.value)} className={fieldClass}>
                    {["Diesel", "Petrol", "CNG", "Electric", "Other"].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Transmission">
                  <select
                    value={transmission}
                    onChange={(event) => setTransmission(event.target.value)}
                    className={fieldClass}
                  >
                    {["Manual", "Automatic", "Other"].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Expected selling price (₹)"
                  required
                  hint="Our team may contact you to discuss the final valuation."
                >
                  <span className="relative block">
                    <span className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 border-r border-[#e6e1d6] pr-3 text-sm font-semibold text-[#76591f]">
                      ₹
                    </span>
                    <input
                      required
                      type="number"
                      inputMode="numeric"
                      min="1"
                      placeholder="Enter your expected price"
                      value={expectedPrice}
                      onChange={(event) => setExpectedPrice(event.target.value)}
                      className={`${fieldClass} pl-12`}
                    />
                  </span>
                </Field>
                <Field label="Vehicle location" required>
                  <span className="relative block">
                    <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-[#9a7424]" />
                    <input
                      required
                      value={location}
                      placeholder="Enter city / location"
                      onChange={(event) => setLocation(event.target.value)}
                      className={`${fieldClass} pl-10`}
                    />
                  </span>
                </Field>
                <Field label="Vehicle description" className="sm:col-span-2">
                  <textarea
                    rows={4}
                    maxLength={5000}
                    placeholder="Tell us about your vehicle's condition, features, and any additional details…"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className={textareaClass}
                  />
                  <span className="mt-1 block text-right text-xs font-normal text-[#8a8478]">
                    {description.length}/5000
                  </span>
                </Field>
              </div>
            </section>

            {/* Images */}
            <section id="vehicle-photos" className={`${cardClass} scroll-mt-40`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <SectionHeading
                  icon={ImagePlus}
                  title="Vehicle images *"
                  subtitle={`Up to ${MAX_IMAGES} images, 10 MB each.`}
                />
                <button
                  type="button"
                  onClick={() => uploadInput.current?.click()}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d8c89f] bg-[#fffaf0] px-4 text-sm font-semibold text-[#76591f] transition hover:bg-[#f8f0dd] sm:w-auto"
                >
                  <ImagePlus size={17} /> Add images
                </button>
                <input
                  ref={uploadInput}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={addFiles}
                  className="sr-only"
                />
              </div>
              {images.length === 0 ? (
                <button
                  type="button"
                  onClick={() => uploadInput.current?.click()}
                  className="mt-5 flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#ded8ca] bg-[#fdfcf9] px-4 text-center text-sm text-[#777166] transition hover:border-[#c9a050] hover:bg-[#fffdf7]"
                >
                  <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f6e7c4] text-[#8a6218]">
                    <UploadCloud size={24} />
                  </span>
                  <span className="font-medium text-[#39352d]">Choose clear photos of your vehicle</span>
                  <span className="mt-1 text-xs">Front, back, sides, interior and odometer work best</span>
                </button>
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {images.map((image, index) => (
                    <div
                      key={`${image.file.name}-${index}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#f2eee5] ring-1 ring-[#efeae0]"
                    >
                      <img src={image.preview} alt={`Vehicle ${index + 1}`} className="h-full w-full object-cover" />
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2.5 py-0.5 text-[11px] font-medium text-white">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Contact */}
            <section id="contact-details" className={`${cardClass} scroll-mt-40`}>
              <SectionHeading icon={Phone} title="Your contact details" subtitle="So our team can reach you." />
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" required>
                  <input
                    required
                    autoComplete="name"
                    value={ownerName}
                    onChange={(event) => setOwnerName(event.target.value)}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Mobile number" required>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Email address">
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Your city / location">
                  <input
                    value={ownerLocation}
                    onChange={(event) => setOwnerLocation(event.target.value)}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Additional message" className="sm:col-span-2">
                  <textarea
                    rows={3}
                    maxLength={1000}
                    placeholder="For example, please contact me after 6 PM."
                    value={additionalMessage}
                    onChange={(event) => setAdditionalMessage(event.target.value)}
                    className={textareaClass}
                  />
                </Field>
              </div>
            </section>

            {/* Submit */}
            <div id="submit-request" className="scroll-mt-40">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-[#e6e1d6] bg-white px-6 text-sm font-semibold text-[#4d493f] transition hover:border-[#c9a050]"
                >
                  <ArrowLeft size={17} /> Back
                </Link>
                <button
                  disabled={submitting}
                  type="submit"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#14110a] px-8 text-base font-semibold text-white shadow-lg transition hover:bg-[#2a251a] disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-72"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Vehicle for Review"
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="min-w-0 space-y-5 lg:sticky lg:top-28">
            <section className={cardClass}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6e7c4] text-[#8a6218]">
                  <Lightbulb size={19} />
                </span>
                <h2 className="font-serif text-lg font-semibold sm:text-xl">Tips for a better evaluation</h2>
              </div>
              <ul className="mt-4 space-y-3">
                {tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-3 text-sm text-[#4d493f]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a050] text-white">
                      <Check size={12} />
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </section>

            <section className={cardClass}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6e7c4] text-[#8a6218]">
                  <Phone size={18} />
                </span>
                <div>
                  <h2 className="font-serif text-lg font-semibold leading-tight sm:text-xl">Need help?</h2>
                  <p className="text-sm text-[#6b665c]">Our team is here to assist you.</p>
                </div>
              </div>
              <Link
                to="/contact"
                className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border-2 border-[#d8b45f] bg-[#fffaf0] text-sm font-semibold text-[#76591f] transition hover:bg-[#f8f0dd]"
              >
                Contact Us
              </Link>
            </section>

            <section className={cardClass}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6e7c4] text-[#8a6218]">
                  <Star size={18} />
                </span>
                <h2 className="font-serif text-lg font-semibold sm:text-xl">Why sell with us?</h2>
              </div>
              <ul className="mt-4 space-y-4">
                {whyUs.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fbf1d9] text-[#8a6218]">
                      <Icon size={19} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{title}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-[#777166]">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <p className="flex items-center gap-2 px-1 text-xs text-[#8a8478]">
              <FileText size={14} /> Your request is reviewed before any listing goes live.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}