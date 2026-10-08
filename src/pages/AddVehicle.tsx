import { useEffect, useId, useMemo, useRef, useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
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
  RotateCcw,
  ShieldCheck,
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
  originalFile: File;
  originalPreview: string;
  hideNumberPlate: boolean;
  selection: SelectionRect | null;
  blurApplied: boolean;
}

interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SelectionGesture {
  imageIndex: number;
  action: "draw" | "move" | "resize";
  startX: number;
  startY: number;
  initial: SelectionRect | null;
  edges: { left: boolean; right: boolean; top: boolean; bottom: boolean };
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

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const selectionIsValid = (
  selection: SelectionRect | null,
  imageWidth: number,
  imageHeight: number
) =>
  Boolean(
    selection &&
      selection.width * imageWidth >= 16 &&
      selection.height * imageHeight >= 16
  );

const createBlurredImage = async (
  file: File,
  selection: SelectionRect
): Promise<File> => {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const blurredCanvas = document.createElement("canvas");
  canvas.width = blurredCanvas.width = bitmap.width;
  canvas.height = blurredCanvas.height = bitmap.height;

  const context = canvas.getContext("2d");
  const blurredContext = blurredCanvas.getContext("2d");
  if (!context || !blurredContext) {
    bitmap.close();
    throw new Error("Your browser could not prepare this image for blurring.");
  }

  context.drawImage(bitmap, 0, 0);
  const blurRadius = clamp(Math.round(Math.min(bitmap.width, bitmap.height) * 0.018), 12, 36);
  blurredContext.filter = `blur(${blurRadius}px)`;
  blurredContext.drawImage(bitmap, 0, 0);

  context.save();
  context.beginPath();
  context.rect(
    selection.x * bitmap.width,
    selection.y * bitmap.height,
    selection.width * bitmap.width,
    selection.height * bitmap.height
  );
  context.clip();
  context.drawImage(blurredCanvas, 0, 0);
  context.restore();
  bitmap.close();

  const mimeType = file.type === "image/png" || file.type === "image/webp"
    ? file.type
    : "image/jpeg";
  const quality = mimeType === "image/jpeg" || mimeType === "image/webp" ? 0.98 : undefined;
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("The edited image could not be created."));
      },
      mimeType,
      quality
    );
  });

  if (blob.size > 10 * 1024 * 1024) {
    throw new Error("The blurred image exceeds the 10 MB upload limit. Try a smaller image.");
  }

  const extension = mimeType === "image/png" ? ".png" : mimeType === "image/webp" ? ".webp" : ".jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}${extension}`, {
    type: mimeType,
    lastModified: Date.now(),
  });
};

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
  const imagesRef = useRef(images);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  const [editorImageSize, setEditorImageSize] = useState({ width: 0, height: 0 });
  const [editorDisplaySize, setEditorDisplaySize] = useState({ width: 0, height: 0 });
  const [isApplyingBlur, setIsApplyingBlur] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const alertRef = useRef<HTMLDivElement>(null);
  const editorViewportRef = useRef<HTMLDivElement>(null);
  const editorImageRef = useRef<HTMLImageElement>(null);
  const selectionGesture = useRef<SelectionGesture | null>(null);
  const brandRequestSequence = useRef(0);
  const locationId = useId();
  const descriptionId = useId();

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

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

  useEffect(
    () => () => {
      imagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.preview);
        if (image.originalPreview !== image.preview) {
          URL.revokeObjectURL(image.originalPreview);
        }
      });
    },
    []
  );

  useEffect(() => {
    if (editingImageIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isApplyingBlur) {
        setEditingImageIndex(null);
        selectionGesture.current = null;
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [editingImageIndex, isApplyingBlur]);

  useEffect(() => {
    if (editingImageIndex === null) return;

    const viewport = editorViewportRef.current;
    const image = editorImageRef.current;
    if (!viewport || !image) return;

    const fitImage = () => {
      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;
      const availableWidth = viewport.clientWidth;
      const availableHeight = viewport.clientHeight;
      if (!naturalWidth || !naturalHeight || !availableWidth || !availableHeight) return;

      const scale = Math.min(
        availableWidth / naturalWidth,
        availableHeight / naturalHeight
      );
      const nextSize = {
        width: naturalWidth * scale,
        height: naturalHeight * scale,
      };

      setEditorDisplaySize((current) =>
        current.width === nextSize.width && current.height === nextSize.height
          ? current
          : nextSize
      );
    };

    fitImage();
    const observer = new ResizeObserver(fitImage);
    observer.observe(viewport);
    window.addEventListener("resize", fitImage);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fitImage);
    };
  }, [editingImageIndex, editorImageSize.width, editorImageSize.height]);

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
      originalFile: file,
      originalPreview: "",
      hideNumberPlate: false,
      selection: null,
      blurApplied: false,
    }));
    newImages.forEach((image) => {
      image.originalPreview = image.preview;
    });

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
        if (imageToRemove.originalPreview !== imageToRemove.preview) {
          URL.revokeObjectURL(imageToRemove.originalPreview);
        }
      }

      return previous.filter((_, imageIndex) => imageIndex !== index);
    });
    setEditingImageIndex(null);
    selectionGesture.current = null;

    // Uploaded images are cleared because they no longer
    // match the currently selected files.
    setUploadedImages([]);
  };

  const toggleNumberPlatePrivacy = (index: number, hideNumberPlate: boolean) => {
    const image = images[index];
    if (!image) return;

    if (hideNumberPlate) {
      if (!image.hideNumberPlate) {
        setImages((previous) =>
          previous.map((item, imageIndex) =>
            imageIndex === index
              ? {
                  ...item,
                  file: item.originalFile,
                  preview: item.originalPreview,
                  hideNumberPlate: true,
                  selection: null,
                  blurApplied: false,
                }
              : item
          )
        );
        if (image.preview !== image.originalPreview) {
          URL.revokeObjectURL(image.preview);
        }
        setUploadedImages([]);
      }
      setEditingImageIndex(index);
      setEditorImageSize({ width: 0, height: 0 });
      selectionGesture.current = null;
      return;
    }

    if (image.preview !== image.originalPreview) {
      URL.revokeObjectURL(image.preview);
    }
    setImages((previous) =>
      previous.map((item, imageIndex) =>
        imageIndex === index
          ? {
              ...item,
              file: item.originalFile,
              preview: item.originalPreview,
              hideNumberPlate,
              selection: null,
              blurApplied: false,
            }
          : item
      )
    );
    setUploadedImages([]);
    setEditingImageIndex(null);
    selectionGesture.current = null;
  };

  const resetNumberPlateBlur = (index: number) => {
    const image = images[index];
    if (!image) return;

    if (image.preview !== image.originalPreview) {
      URL.revokeObjectURL(image.preview);
    }
    setImages((previous) =>
      previous.map((item, imageIndex) =>
        imageIndex === index
          ? {
              ...item,
              file: item.originalFile,
              preview: item.originalPreview,
              selection: null,
              blurApplied: false,
            }
          : item
      )
    );
    setUploadedImages([]);
    setEditorImageSize({ width: 0, height: 0 });
    selectionGesture.current = null;
  };

  const resetNumberPlateSelection = (index: number) => {
    setImages((previous) =>
      previous.map((item, imageIndex) =>
        imageIndex === index ? { ...item, selection: null } : item
      )
    );
    selectionGesture.current = null;
  };

  const handleEditorPointerDown = (
    index: number,
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const imageElement = editorImageRef.current;
    const image = images[index];
    if (!imageElement || !image) return;

    const bounds = imageElement.getBoundingClientRect();
    const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    const target = event.target;
    const resizeHandle =
      target instanceof Element ? target.closest<HTMLElement>("[data-resize]") : null;
    const edges = resizeHandle?.dataset.resize ?? "";
    const current = image.selection;
    const insideSelection =
      current &&
      x >= current.x &&
      x <= current.x + current.width &&
      y >= current.y &&
      y <= current.y + current.height;

    const action: SelectionGesture["action"] = resizeHandle
      ? "resize"
      : insideSelection
        ? "move"
        : "draw";

    selectionGesture.current = {
      imageIndex: index,
      action,
      startX: x,
      startY: y,
      initial: action === "draw" ? null : current,
      edges: {
        left: edges.includes("w"),
        right: edges.includes("e"),
        top: edges.includes("n"),
        bottom: edges.includes("s"),
      },
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();

    if (action === "draw") {
      setImages((previous) =>
        previous.map((item, imageIndex) =>
          imageIndex === index
            ? { ...item, selection: { x, y, width: 0, height: 0 } }
            : item
        )
      );
    }
  };

  const handleEditorPointerMove = (
    index: number,
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const gesture = selectionGesture.current;
    const imageElement = editorImageRef.current;
    if (!gesture || gesture.imageIndex !== index || !imageElement) return;

    const bounds = imageElement.getBoundingClientRect();
    const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    let selection: SelectionRect;

    if (gesture.action === "draw") {
      selection = {
        x: Math.min(gesture.startX, x),
        y: Math.min(gesture.startY, y),
        width: Math.abs(x - gesture.startX),
        height: Math.abs(y - gesture.startY),
      };
    } else if (gesture.initial && gesture.action === "move") {
      selection = {
        ...gesture.initial,
        x: clamp(gesture.initial.x + x - gesture.startX, 0, 1 - gesture.initial.width),
        y: clamp(gesture.initial.y + y - gesture.startY, 0, 1 - gesture.initial.height),
      };
    } else if (gesture.initial) {
      const initial = gesture.initial;
      const minWidth = Math.min(1, 16 / imageElement.naturalWidth);
      const minHeight = Math.min(1, 16 / imageElement.naturalHeight);
      let left = initial.x;
      let right = initial.x + initial.width;
      let top = initial.y;
      let bottom = initial.y + initial.height;

      if (gesture.edges.left) left = clamp(x, 0, right - minWidth);
      if (gesture.edges.right) right = clamp(x, left + minWidth, 1);
      if (gesture.edges.top) top = clamp(y, 0, bottom - minHeight);
      if (gesture.edges.bottom) bottom = clamp(y, top + minHeight, 1);
      selection = { x: left, y: top, width: right - left, height: bottom - top };
    } else {
      return;
    }

    setImages((previous) =>
      previous.map((item, imageIndex) =>
        imageIndex === index ? { ...item, selection } : item
      )
    );
  };

  const finishEditorPointer = (index: number) => {
    if (selectionGesture.current?.imageIndex === index) {
      selectionGesture.current = null;
    }
  };

  const applyNumberPlateBlur = async (index: number) => {
    const image = images[index];
    const imageElement = editorImageRef.current;
    if (
      !image ||
      !image.selection ||
      !imageElement ||
      !selectionIsValid(
        image.selection,
        imageElement.naturalWidth,
        imageElement.naturalHeight
      )
    ) {
      setError("Select a larger number plate area before applying blur.");
      return;
    }

    setIsApplyingBlur(true);
    setError("");
    try {
      const processedFile = await createBlurredImage(image.originalFile, image.selection);
      const processedPreview = URL.createObjectURL(processedFile);
      if (image.preview !== image.originalPreview) {
        URL.revokeObjectURL(image.preview);
      }
      setImages((previous) =>
        previous.map((item, imageIndex) =>
          imageIndex === index
            ? { ...item, file: processedFile, preview: processedPreview, blurApplied: true }
            : item
        )
      );
      setUploadedImages([]);
      setEditingImageIndex(null);
      selectionGesture.current = null;
    } catch (blurError) {
      console.error("Number plate blur error:", blurError);
      setError(
        blurError instanceof Error
          ? blurError.message
          : "Unable to blur the selected number plate area."
      );
    } finally {
      setIsApplyingBlur(false);
    }
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

    if (images.some((image) => image.hideNumberPlate && !image.blurApplied)) {
      setError(
        "Apply the number plate blur to every image marked Yes before adding the vehicle."
      );
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

  const activeEditorImage =
    editingImageIndex === null ? null : images[editingImageIndex] ?? null;
  const activeEditorHasValidSelection = selectionIsValid(
    activeEditorImage?.selection ?? null,
    editorImageSize.width,
    editorImageSize.height
  );
  const resizeHandles = [
    ["nw", "left-0 top-0 -translate-x-1/2 -translate-y-1/2"],
    ["n", "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"],
    ["ne", "right-0 top-0 translate-x-1/2 -translate-y-1/2"],
    ["e", "right-0 top-1/2 translate-x-1/2 -translate-y-1/2"],
    ["se", "right-0 bottom-0 translate-x-1/2 translate-y-1/2"],
    ["s", "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2"],
    ["sw", "left-0 bottom-0 -translate-x-1/2 translate-y-1/2"],
    ["w", "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"],
  ];

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
            {images.map((image, index) => {
              return (
                <div
                  key={`${image.originalFile.name}-${index}`}
                  className="min-w-0 overflow-hidden rounded-2xl border border-[#efeae0] bg-white shadow-sm"
                >
                  <div className="group relative aspect-[4/3] overflow-hidden bg-[#f1ede2]">
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

                    {image.blurApplied && (
                      <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-emerald-700/90 px-2 py-1 text-[10px] font-semibold text-white">
                        <ShieldCheck size={12} />
                        Plate hidden
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={isApplyingBlur}
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X size={16} />
                    </button>

                    <p className="absolute inset-x-0 bottom-0 truncate p-2.5 text-xs font-medium text-white">
                      {image.originalFile.name}
                    </p>
                  </div>

                  <div className="space-y-3 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#4d493f]">
                        Hide Number Plate?
                      </span>
                      <div
                        role="group"
                        aria-label={`Hide number plate in image ${index + 1}`}
                        className="inline-flex rounded-lg border border-[#e6e1d6] bg-[#f8f6f1] p-0.5"
                      >
                        {[false, true].map((hide) => (
                          <button
                            key={String(hide)}
                            type="button"
                            aria-pressed={image.hideNumberPlate === hide}
                            disabled={isSaving || isUploading || isApplyingBlur}
                            onClick={() => toggleNumberPlatePrivacy(index, hide)}
                            className={`min-w-12 rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              image.hideNumberPlate === hide
                                ? "bg-white text-[#14110a] shadow-sm ring-1 ring-[#e6e1d6]"
                                : "text-[#797368] hover:text-[#14110a]"
                            }`}
                          >
                            {hide ? "Yes" : "No"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {image.hideNumberPlate && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          disabled={isSaving || isUploading || isApplyingBlur}
                          onClick={() => {
                            setEditingImageIndex(index);
                            setEditorImageSize({ width: 0, height: 0 });
                          }}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-[#e6e1d6] bg-white px-3 text-xs font-semibold text-[#4d493f] transition hover:border-[#c9a050] hover:bg-[#fdfaf2] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {image.blurApplied ? "Adjust Number Plate Blur" : "Select Number Plate"}
                        </button>
                        {image.blurApplied && (
                          <p className="text-[11px] font-medium text-emerald-700">
                            The blurred image will be uploaded.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
      {editingImageIndex !== null && activeEditorImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="number-plate-editor-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080d16]/90 p-2 backdrop-blur-sm sm:p-5"
        >
          <div className="flex h-[calc(100dvh-1rem)] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#f8f7f3] shadow-2xl sm:h-[calc(100dvh-2.5rem)] sm:rounded-3xl">
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#e9e4d9] px-3 py-3 sm:px-6 sm:py-4">
              <button
                type="button"
                onClick={() => {
                  setEditingImageIndex(null);
                  selectionGesture.current = null;
                }}
                disabled={isApplyingBlur}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-2.5 text-sm font-semibold text-[#4d493f] transition hover:bg-[#efede6] disabled:cursor-not-allowed disabled:opacity-60 sm:px-3"
              >
                <X size={17} />
                <span className="hidden sm:inline">Close</span>
                <span className="sm:hidden">Cancel</span>
              </button>
              <div className="min-w-0 text-center">
                <h2
                  id="number-plate-editor-title"
                  className="jj-serif truncate text-lg text-[#14110a] sm:text-2xl"
                >
                  Number Plate Privacy
                </h2>
                <p className="mt-0.5 hidden text-xs text-[#797368] sm:block">
                  Image {editingImageIndex + 1} of {images.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => resetNumberPlateBlur(editingImageIndex)}
                disabled={isApplyingBlur || isSaving || isUploading}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold text-[#75602f] transition hover:bg-[#efede6] disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-sm"
              >
                <RotateCcw size={15} />
                Reset
              </button>
            </header>

            <main className="flex min-h-0 flex-1 flex-col px-2 py-2 sm:px-5 sm:py-4">
              <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-[#171b22] sm:rounded-2xl">
                <div
                  ref={editorViewportRef}
                  className="absolute inset-2 flex items-center justify-center sm:inset-4"
                >
                  <div
                    className="relative shrink-0 touch-none select-none"
                    style={{
                      width: editorDisplaySize.width || undefined,
                      height: editorDisplaySize.height || undefined,
                    }}
                    onPointerDown={(event) =>
                      handleEditorPointerDown(editingImageIndex, event)
                    }
                    onPointerMove={(event) =>
                      handleEditorPointerMove(editingImageIndex, event)
                    }
                    onPointerUp={() => finishEditorPointer(editingImageIndex)}
                    onPointerCancel={() => finishEditorPointer(editingImageIndex)}
                  >
                    <img
                      ref={editorImageRef}
                      src={activeEditorImage.originalPreview}
                      alt={`Select the number plate area in image ${editingImageIndex + 1}`}
                      draggable={false}
                      onLoad={(event) => {
                        setEditorImageSize({
                          width: event.currentTarget.naturalWidth,
                          height: event.currentTarget.naturalHeight,
                        });
                      }}
                      className="block h-full w-full max-h-full max-w-full touch-none select-none object-contain"
                    />
                    {activeEditorImage.selection && (
                      <div
                        className="pointer-events-none absolute border-2 border-[#f0c96b] bg-[#e0b866]/20 shadow-[0_0_0_9999px_rgba(5,8,13,0.42)]"
                        style={{
                          left: `${activeEditorImage.selection.x * 100}%`,
                          top: `${activeEditorImage.selection.y * 100}%`,
                          width: `${activeEditorImage.selection.width * 100}%`,
                          height: `${activeEditorImage.selection.height * 100}%`,
                        }}
                      >
                        {resizeHandles.map(([edge, position]) => (
                          <span
                            key={edge}
                            data-resize={edge}
                            className={`pointer-events-auto absolute h-5 w-5 rounded-full border-2 border-[#75602f] bg-[#fffdf7] shadow-md sm:h-4 sm:w-4 ${position}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-3 px-1 pt-3 sm:flex-row sm:items-center sm:justify-between sm:px-1 sm:pt-4">
                <p className="text-center text-xs leading-5 text-[#70695d] sm:text-left">
                  Drag to select the plate. Move the box or use its handles to adjust it.
                  {activeEditorImage.selection && !activeEditorHasValidSelection && (
                    <span className="block text-[#8a6252]">
                      Select an area at least 16 × 16 image pixels.
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:flex sm:shrink-0 sm:items-center">
                  <button
                    type="button"
                    onClick={() => resetNumberPlateSelection(editingImageIndex)}
                    disabled={!activeEditorImage.selection || isApplyingBlur}
                    className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-[#e3ded2] bg-white px-2 text-[11px] font-semibold text-[#5b554a] transition hover:bg-[#f3f0e9] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-xs"
                  >
                    <RotateCcw size={13} />
                    Reset Selection
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingImageIndex(null);
                      selectionGesture.current = null;
                    }}
                    disabled={isApplyingBlur}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e3ded2] bg-white px-3 text-xs font-semibold text-[#4d493f] transition hover:bg-[#f3f0e9] disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void applyNumberPlateBlur(editingImageIndex)}
                    disabled={
                      !activeEditorHasValidSelection ||
                      isApplyingBlur ||
                      isSaving ||
                      isUploading
                    }
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#75602f] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#5f4d26] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
                  >
                    {isApplyingBlur ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <ShieldCheck size={15} />
                    )}
                    Apply Blur
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
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