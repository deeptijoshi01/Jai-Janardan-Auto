import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  Loader2,
  MapPin,
  Save,
  UploadCloud,
  X,
  AlertCircle,
  Truck,
  Settings2,
  Tag,
  FileText,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchBrands, fetchCategories } from "../services/categoryBrandApi";
import {
  brandCategoryTypeFor,
  type Brand,
  type Category,
  type VehicleCategoryType,
} from "../types/categoryBrand";

interface ImagePreview {
  file: File;
  preview: string;
}

interface UploadedImage {
  url: string;
  publicId: string;
}

type VehicleStatus = "Available" | "Sold" | "Reserved";

const API_BASE_URL = "http://localhost:5000";

const fuelTypes = ["Diesel", "Petrol", "CNG", "Electric", "Other"];

const transmissions = ["Manual", "Automatic", "Other"];

const statusOptions: { value: VehicleStatus; dot: string }[] = [
  { value: "Available", dot: "bg-emerald-500" },
  { value: "Reserved", dot: "bg-sky-500" },
  { value: "Sold", dot: "bg-rose-500" },
];

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
.jj-serif { font-family: 'Fraunces', Georgia, serif; }

@keyframes jj-rise { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
@keyframes jj-pop  { 0% { transform:scale(.5); opacity:0 } 70% { transform:scale(1.15) } 100% { transform:scale(1); opacity:1 } }
.jj-rise { animation: jj-rise .7s cubic-bezier(.2,.7,.2,1) both }
.jj-pop  { animation: jj-pop .45s cubic-bezier(.2,.9,.3,1.3) both }

@media (prefers-reduced-motion: reduce) {
  .jj-rise, .jj-pop { animation: none !important }
}
`;

const card =
  "rounded-3xl border border-[#efeae0] bg-white shadow-[0_1px_2px_rgba(20,16,8,0.04),0_14px_34px_-22px_rgba(20,16,8,0.18)]";

const fieldBase =
  "w-full rounded-xl border border-[#e6e1d6] bg-[#fdfcf9] text-base text-[#14110a] outline-none transition placeholder:text-[#a39d90] focus:border-[#c9a050] focus:bg-white focus:ring-4 focus:ring-[#c9a050]/15 sm:text-sm";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const AddVehicle = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [fuelType, setFuelType] = useState("Diesel");
  const [transmission, setTransmission] = useState("Manual");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<VehicleStatus>("Available");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableBrands, setAvailableBrands] = useState<Brand[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [categoryBrandError, setCategoryBrandError] = useState("");
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [brandModalError, setBrandModalError] = useState("");
  const [brandNotice, setBrandNotice] = useState("");

  const [images, setImages] = useState<ImagePreview[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const alertRef = useRef<HTMLDivElement>(null);
  const brandRequestSequence = useRef(0);
  const locationId = useId();
  const descriptionId = useId();

  useEffect(() => {
    let isMounted = true;
    fetchCategories()
      .then((result) => {
        if (isMounted) setAvailableCategories(result);
      })
      .catch((loadError: unknown) => {
        console.error("Vehicle categories API error:", loadError);
        if (isMounted) {
          setCategoryBrandError(
            loadError instanceof Error ? loadError.message : "Unable to load categories."
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingCategories(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryChange = (value: string) => {
    const requestSequence = ++brandRequestSequence.current;
    setCategory(value);
    setBrand("");
    setAvailableBrands([]);
    setCategoryBrandError("");
    setBrandNotice("");
    setIsLoadingBrands(Boolean(value));
    if (!value) return;

    fetchBrands(value as VehicleCategoryType)
      .then((result) => {
        if (requestSequence === brandRequestSequence.current) {
          setAvailableBrands(result);
        }
      })
      .catch((loadError: unknown) => {
        console.error("Vehicle brands API error:", loadError);
        if (requestSequence === brandRequestSequence.current) {
          setCategoryBrandError(
            loadError instanceof Error ? loadError.message : "Unable to load brands."
          );
        }
      })
      .finally(() => {
        if (requestSequence === brandRequestSequence.current) {
          setIsLoadingBrands(false);
        }
      });
  };

  const handleAddBrand = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!category || isSavingBrand) return;

    const selectedCategory = category as VehicleCategoryType;
    const categoryType = brandCategoryTypeFor(selectedCategory);
    setIsSavingBrand(true);
    setBrandModalError("");
    setCategoryBrandError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/brands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBrandName.trim(),
          categoryType,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        brand?: Brand;
      } | null;
      if (!response.ok || !data?.success || !data.brand) {
        throw new Error(data?.message || `Unable to add brand (${response.status}).`);
      }

      const refreshedBrands = await fetchBrands(categoryType);
      setAvailableBrands(refreshedBrands);
      setBrand(data.brand.name);
      setBrandNotice(`${data.brand.name} added to ${selectedCategory === "commercial" ? "Commercial Vehicles" : "Cars"}.`);
      setNewBrandName("");
      setIsBrandModalOpen(false);
    } catch (saveError) {
      console.error("Add vehicle brand creation error:", saveError);
      setBrandModalError(
        saveError instanceof Error ? saveError.message : "Unable to add brand."
      );
    } finally {
      setIsSavingBrand(false);
    }
  };

  const imageCountText = useMemo(() => {
    if (images.length === 0) return "No images selected";
    if (images.length === 1) return "1 image selected";
    return `${images.length} images selected`;
  }, [images.length]);

  const pricePreview = useMemo(() => {
    const n = Number(price);
    if (!price || !Number.isFinite(n) || n <= 0) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  }, [price]);

  // Bring the message into view (the form is long on phones)
  useEffect(() => {
    if (error || success) {
      alertRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error, success]);

  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setError("");

    const remainingSlots = 8 - images.length;

    if (remainingSlots <= 0) {
      setError("You can upload a maximum of 8 images.");
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setError("Only image files are allowed.");
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (oversizedFile) {
      setError(`"${oversizedFile.name}" is larger than 10 MB.`);
      return;
    }

    const newImages = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((previous) => [...previous, ...newImages]);

    // Allow selecting same file again
    event.target.value = "";
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = (index: number) => {
    setImages((previous) => {
      const imageToRemove = previous[index];

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return previous.filter((_, imageIndex) => imageIndex !== index);
    });

    // Uploaded images are cleared because they no longer
    // match the currently selected files.
    setUploadedImages([]);
  };

  // =====================================================
  // UPLOAD IMAGES TO CLOUDINARY
  // =====================================================

  const uploadImages = async (): Promise<UploadedImage[]> => {
    if (images.length === 0) {
      return [];
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();

      images.forEach((image) => {
        formData.append("images", image.file);
      });

      const response = await fetch(`${API_BASE_URL}/api/upload-multiple`, {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            count?: number;
            images?: UploadedImage[];
          }
        | null;

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || `Image upload failed (${response.status})`
        );
      }

      if (!Array.isArray(data.images) || data.images.length !== images.length) {
        throw new Error("The server returned an incomplete image upload result.");
      }

      const result = data.images;

      setUploadedImages(result);

      return result;
    } catch (uploadError) {
      console.error("Image upload error:", uploadError);

      throw new Error(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload images.",
        { cause: uploadError }
      );
    } finally {
      setIsUploading(false);
    }
  };

  // =====================================================
  // SAVE VEHICLE
  // =====================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (
      !title.trim() ||
      !brand.trim() ||
      !model.trim() ||
      !year.trim() ||
      !price.trim() ||
      !category.trim() ||
      !location.trim()
    ) {
      setError("Please fill all required vehicle information.");
      return;
    }

    const numericYear = Number(year);
    const numericPrice = Number(price);
    const numericKilometers = Number(kilometers || 0);

    if (
      !Number.isFinite(numericYear) ||
      numericYear < 1900 ||
      numericYear > new Date().getFullYear() + 1
    ) {
      setError("Please enter a valid vehicle year.");
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid vehicle price.");
      return;
    }

    if (!Number.isFinite(numericKilometers) || numericKilometers < 0) {
      setError("Please enter valid kilometers.");
      return;
    }

    setIsSaving(true);

    try {
      // -----------------------------------------------
      // Upload images first
      // -----------------------------------------------

      let finalImages = uploadedImages;

      if (images.length > 0 && uploadedImages.length !== images.length) {
        finalImages = await uploadImages();
      }

      // -----------------------------------------------
      // Vehicle payload
      // -----------------------------------------------

      const vehicleData = {
        title: title.trim(),
        brand: brand.trim(),
        model: model.trim(),
        year: numericYear,
        price: numericPrice,
        category,
        kilometers: numericKilometers,
        fuelType,
        transmission,
        location: location.trim(),
        description: description.trim(),
        status,
        isBestSeller,
        categoryType: category,
        images: finalImages,
      };

      // -----------------------------------------------
      // Save to MongoDB
      // -----------------------------------------------

      const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add vehicle.");
      }

      setSuccess("Vehicle added successfully.");
      window.dispatchEvent(new CustomEvent("best-seller-updated"));

      // Small delay so user can see success message
      setTimeout(() => {
        navigate("/admin/vehicles");
      }, 1000);
    } catch (submitError) {
      console.error("Add vehicle error:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while adding the vehicle."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl pb-4">
      <style>{styles}</style>

      {/* ================= HEADER ================= */}
      <header className="jj-rise mb-6 sm:mb-8">
        <Link
          to="/admin"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e6e1d6] bg-white px-4 text-sm font-medium text-[#4d493f] shadow-sm transition hover:border-[#e0b866] hover:text-[#14110a]"
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#9a7424]">
              Inventory management
            </p>

            <h1 className="jj-serif mt-1 text-[2rem] leading-tight text-[#14110a] sm:text-4xl">
              Add vehicle
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b665c]">
              Add a commercial vehicle to your inventory with complete
              specifications and photos.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-[#efeae0] bg-white px-4 py-3 text-xs font-medium text-[#6b665c] shadow-sm sm:flex">
            <CheckCircle2 size={16} className="text-emerald-600" />
            All changes are saved securely
          </div>
        </div>
      </header>

      {/* ================= ALERTS ================= */}
      <div ref={alertRef} className="scroll-mt-24">
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 sm:px-5"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Unable to add vehicle
              </p>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 sm:px-5"
          >
            <CheckCircle2 size={20} className="jj-pop text-emerald-600" />
            <p className="text-sm font-semibold text-emerald-700">{success}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* ================= IMAGES ================= */}
        <Section
          icon={<ImagePlus size={20} />}
          title="Vehicle images"
          subtitle="Up to 8 images, 10 MB each. The first one is the main image."
          badge={imageCountText}
          delay=".08s"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {/* Upload box */}
            {images.length < 8 && (
              <label className="group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#dcd3bd] bg-[#fdfaf2] p-4 text-center transition hover:border-[#c9a050] hover:bg-[#fbf5e6] focus-within:border-[#c9a050]">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="sr-only"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#9a7424] shadow-sm ring-1 ring-[#eadfc6] transition group-hover:scale-105">
                  <UploadCloud size={23} />
                </div>

                <p className="mt-3 text-sm font-semibold text-[#14110a]">
                  Upload images
                </p>
                <p className="mt-0.5 text-[11px] text-[#8a8478]">
                  PNG, JPG, WEBP
                </p>
                <p className="mt-2 text-[11px] font-medium text-[#9a7424]">
                  Tap to browse
                </p>
              </label>
            )}

            {/* Previews */}
            {images.map((image, index) => (
              <div
                key={`${image.file.name}-${index}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f1ede2] ring-1 ring-[#efeae0]"
              >
                <img
                  src={image.preview}
                  alt={`Vehicle ${index + 1}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

                {index === 0 && (
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#14110a] shadow-sm">
                    Main image
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X size={16} />
                </button>

                <p className="absolute inset-x-0 bottom-0 truncate p-2.5 text-xs font-medium text-white">
                  {image.file.name}
                </p>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <p className="mt-4 flex items-center gap-2 text-xs text-[#8a8478]">
              <ImagePlus size={15} />
              Clear, well-lit photos help vehicles sell faster.
            </p>
          )}
        </Section>

        {/* ================= DETAILS ================= */}
        <Section
          icon={<Truck size={20} />}
          title="Vehicle information"
          subtitle="The basic details buyers look for first."
          delay=".14s"
        >
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            <InputField
              label="Vehicle title"
              required
              value={title}
              onChange={setTitle}
              placeholder="e.g. Tata 1613 Truck"
              className="md:col-span-2"
            />

            <div className="flex min-w-0 items-end gap-2">
              <div className="min-w-0 flex-1">
                <SelectField
                  label="Brand"
                  required
                  value={brand}
                  onChange={setBrand}
                  placeholder={
                    !category
                      ? "Select category first"
                      : isLoadingBrands
                        ? "Loading brands..."
                        : "Select brand"
                  }
                  options={availableBrands.map((item) => item.name)}
                  disabled={!category || isLoadingBrands || availableBrands.length === 0}
                />
              </div>
              {category && (
                <button
                  type="button"
                  onClick={() => {
                    setBrandModalError("");
                    setNewBrandName("");
                    setIsBrandModalOpen(true);
                  }}
                  disabled={isSavingBrand || isSaving}
                  className="mb-0.5 inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#d9c89e] bg-white px-3 text-xs font-semibold text-[#71571f] transition hover:bg-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
                >
                  <Plus size={15} />
                  {category === "commercial"
                    ? "Add Commercial Brand"
                    : "Add Car Brand"}
                </button>
              )}
            </div>

            <InputField
              label="Model"
              required
              value={model}
              onChange={setModel}
              placeholder="e.g. 1613"
            />

            <InputField
              label="Manufacturing year"
              required
              type="number"
              inputMode="numeric"
              value={year}
              onChange={setYear}
              placeholder="e.g. 2022"
              min="1900"
              max={String(new Date().getFullYear() + 1)}
            />

            <SelectField
              label="Category"
              required
              value={category}
              onChange={handleCategoryChange}
              placeholder={isLoadingCategories ? "Loading categories..." : "Select category"}
              options={availableCategories.map((item) => ({
                value: item.type,
                label: item.name,
              }))}
            />
          </div>
          {categoryBrandError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {categoryBrandError}
            </p>
          )}
          {brandNotice && (
            <p role="status" className="mt-3 text-sm font-medium text-emerald-700">
              {brandNotice}
            </p>
          )}
        </Section>

        {/* ================= SPECS ================= */}
        <Section
          icon={<Settings2 size={20} />}
          title="Specifications"
          subtitle="Usage and drivetrain."
          delay=".2s"
        >
          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            <InputField
              label="Kilometers"
              type="number"
              inputMode="numeric"
              value={kilometers}
              onChange={setKilometers}
              placeholder="e.g. 45000"
              min="0"
              suffix="km"
            />

            <SelectField
              label="Fuel type"
              value={fuelType}
              onChange={setFuelType}
              options={fuelTypes}
            />

            <SelectField
              label="Transmission"
              value={transmission}
              onChange={setTransmission}
              options={transmissions}
            />
          </div>
        </Section>

        {/* ================= LISTING ================= */}
        <Section
          icon={<Tag size={20} />}
          title="Listing"
          subtitle="Price, location and availability."
          delay=".26s"
        >
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            <InputField
              label="Price"
              required
              type="number"
              inputMode="numeric"
              value={price}
              onChange={setPrice}
              placeholder="e.g. 1850000"
              min="0"
              prefix="₹"
              hint={pricePreview}
            />

            <div>
              <label
                htmlFor={locationId}
                className="mb-2 block text-sm font-semibold text-[#14110a]"
              >
                Location
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a39d90]"
                />
                <input
                  id={locationId}
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Nashik"
                  className={`${fieldBase} h-12 pl-11 pr-4`}
                />
              </div>
            </div>

            {/* Status – segmented */}
            <div className="md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-[#14110a]">
                Status
              </span>

              <div
                role="radiogroup"
                aria-label="Vehicle status"
                className="grid grid-cols-3 gap-2 rounded-2xl bg-[#f6f3ea] p-1.5"
              >
                {statusOptions.map((option) => {
                  const active = status === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setStatus(option.value)}
                      className={`flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a050] ${
                        active
                          ? "bg-white text-[#14110a] shadow-[0_6px_16px_-8px_rgba(20,16,8,0.35)] ring-1 ring-[#e6e1d6]"
                          : "text-[#6b665c] hover:text-[#14110a]"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${option.dot}`} />
                      {option.value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#efeae0] bg-[#fbfaf6] p-3.5 text-sm font-semibold text-[#14110a] shadow-sm sm:justify-start">
                <span className="flex flex-col gap-1 sm:flex-row sm:items-center">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-lg" aria-hidden="true">⭐</span>
                    Best Seller
                  </span>
                  <span className="text-xs font-medium text-[#8a8478] sm:ml-1">
                    Show this vehicle in the Best Selling Vehicles section on Home.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(event) => setIsBestSeller(event.target.checked)}
                  className="h-5 w-5 accent-[#c9a050]"
                />
              </label>
            </div>
          </div>
        </Section>

        {/* ================= DESCRIPTION ================= */}
        <Section
          icon={<FileText size={20} />}
          title="Description"
          subtitle="Condition, features and service history."
          delay=".32s"
        >
          <label htmlFor={descriptionId} className="sr-only">
            Description
          </label>
          <textarea
            id={descriptionId}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe the vehicle condition, features, service history, etc."
            className={`${fieldBase} resize-none px-4 py-3 leading-6`}
          />

          <p className="mt-2 text-right text-xs text-[#a39d90]">
            {description.length} characters
          </p>
        </Section>

        {/* ================= ACTIONS ================= */}
        <div className="sticky bottom-3 z-20 flex gap-3 rounded-2xl border border-[#e6e1d6] bg-white/90 p-3 shadow-[0_18px_40px_-16px_rgba(20,16,8,0.35)] backdrop-blur-md sm:static sm:justify-end sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
          <Link
            to="/admin"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-[#e6e1d6] bg-white px-6 text-sm font-semibold text-[#4d493f] transition hover:bg-[#faf8f3] sm:flex-none"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-[#14110a] px-7 text-sm font-semibold text-white shadow-[0_12px_26px_-10px_rgba(20,17,10,0.7)] ring-1 ring-[#c9a050]/40 transition hover:bg-[#2a251a] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading images...
              </>
            ) : isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving vehicle...
              </>
            ) : (
              <>
                <Save size={18} className="text-[#e0b866]" />
                Add vehicle
              </>
            )}
          </button>
        </div>
      </form>
      {isBrandModalOpen && category && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#14110a]/45 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSavingBrand) {
              setIsBrandModalOpen(false);
            }
          }}
        >
          <form
            onSubmit={handleAddBrand}
            className="w-full max-w-md rounded-3xl border border-[#efeae0] bg-white p-6 shadow-2xl sm:p-8"
            aria-labelledby="add-vehicle-brand-title"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a7424]">
              Brand management
            </p>
            <h2
              id="add-vehicle-brand-title"
              className="jj-serif mt-1 text-2xl text-[#14110a]"
            >
              {category === "commercial"
                ? "Add Commercial Vehicle Brand"
                : "Add Car Brand"}
            </h2>
            <label className="mt-6 block text-sm font-semibold text-[#14110a]">
              Brand Name
              <input
                autoFocus
                required
                maxLength={60}
                value={newBrandName}
                onChange={(event) => setNewBrandName(event.target.value)}
                placeholder="Enter brand name"
                className={`${fieldBase} mt-2 h-12 px-4`}
              />
            </label>
            {brandModalError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {brandModalError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsBrandModalOpen(false)}
                disabled={isSavingBrand}
                className="h-11 rounded-xl border border-[#e6e1d6] px-4 text-sm font-semibold text-[#4d493f] transition hover:bg-[#faf8f3] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingBrand || !newBrandName.trim()}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#14110a] px-5 text-sm font-semibold text-white transition hover:bg-[#2a251a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingBrand && <Loader2 size={16} className="animate-spin" />}
                Add Brand
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// =======================================================
// SECTION CARD
// =======================================================

interface SectionProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  delay?: string;
  children: ReactNode;
}

const Section = ({
  icon,
  title,
  subtitle,
  badge,
  delay = "0s",
  children,
}: SectionProps) => (
  <section className={`jj-rise ${card} overflow-hidden`} style={{ animationDelay: delay }}>
    <div className="flex items-start justify-between gap-3 border-b border-[#f1ede2] px-4 py-4 sm:px-8 sm:py-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fbf1dc] text-[#9a7424]">
          {icon}
        </span>
        <div>
          <h2 className="jj-serif text-lg leading-tight text-[#14110a] sm:text-xl">
            {title}
          </h2>
          <p className="mt-0.5 text-xs leading-5 text-[#8a8478] sm:text-sm">
            {subtitle}
          </p>
        </div>
      </div>

      {badge && (
        <span className="hidden shrink-0 rounded-full bg-[#f6f3ea] px-3 py-1.5 text-xs font-semibold text-[#6b665c] sm:inline-block">
          {badge}
        </span>
      )}
    </div>

    <div className="p-4 sm:p-8">
      {badge && (
        <p className="mb-3 text-xs font-medium text-[#8a8478] sm:hidden">
          {badge}
        </p>
      )}
      {children}
    </div>
  </section>
);

// =======================================================
// REUSABLE INPUT
// =======================================================

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "decimal" | "text";
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
}

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  required = false,
  min,
  max,
  className = "",
  prefix,
  suffix,
  hint,
}: InputFieldProps) => {
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#14110a]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#9a7424]">
            {prefix}
          </span>
        )}

        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          className={`${fieldBase} h-12 ${prefix ? "pl-9" : "pl-4"} ${suffix ? "pr-12" : "pr-4"}`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#a39d90]">
            {suffix}
          </span>
        )}
      </div>

      {hint && <p className="mt-1.5 text-xs font-medium text-[#9a7424]">{hint}</p>}
    </div>
  );
};

// =======================================================
// REUSABLE SELECT
// =======================================================

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[] | { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
}: SelectFieldProps) => {
  const id = useId();
  const normalizedOptions = options.map((option) =>
    typeof option === "string"
      ? { value: option, label: option }
      : option
  );

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#14110a]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${fieldBase} h-12 appearance-none pl-4 pr-11 disabled:cursor-not-allowed disabled:opacity-60 ${
            value === "" ? "text-[#a39d90]" : ""
          }`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value} className="text-[#14110a]">
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8478]"
        />
      </div>
    </div>
  );
};

export default AddVehicle;