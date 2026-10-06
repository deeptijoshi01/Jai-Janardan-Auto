import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ClipboardList,
  Eye,
  Loader2,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Tag,
  X,
} from "lucide-react";
import { adminFetch } from "../services/adminAuth";
import { fetchBrands } from "../services/categoryBrandApi";

const API_URL = "http://localhost:5000/api/sell-requests";
const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
type RequestStatus = "pending" | "under_review" | "approved_manual" | "listing" | "listed" | "rejected";

interface SellImage {
  url: string;
  publicId: string;
}

interface SellRequest {
  _id: string;
  ownerName: string;
  phone: string;
  email: string;
  ownerLocation: string;
  additionalMessage: string;
  category: "commercial" | "car";
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  fuelType: string;
  transmission: string;
  expectedPrice: number;
  location: string;
  description: string;
  images: SellImage[];
  status: RequestStatus;
  vehicleId?: string | null;
  rejectionReason?: string;
  createdAt: string;
}

interface SellRequestResponse {
  success: boolean;
  message?: string;
  requests?: SellRequest[];
  request?: SellRequest;
}

interface EditableImage extends SellImage {
  file?: File;
  preview?: string;
}

const card =
  "rounded-2xl border border-[#efeae0] bg-white shadow-[0_1px_2px_rgba(20,16,8,0.04),0_14px_34px_-22px_rgba(20,16,8,0.18)]";

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const statusLabel: Record<RequestStatus, string> = {
  pending: "Pending",
  under_review: "Under review",
  approved_manual: "Approved / Ready to list",
  listing: "Listing in progress",
  listed: "Listed",
  rejected: "Rejected",
};

const statusStyle: Record<RequestStatus, string> = {
  pending: "bg-amber-50 text-amber-800",
  under_review: "bg-sky-50 text-sky-800",
  approved_manual: "bg-violet-50 text-violet-800",
  listing: "bg-sky-50 text-sky-800",
  listed: "bg-emerald-50 text-emerald-800",
  rejected: "bg-red-50 text-red-700",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function AdminSellRequests() {
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<SellRequest | null>(null);
  const [listingRequest, setListingRequest] = useState<SellRequest | null>(null);
  const deletingRequestIds = useRef(new Set<string>());

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminFetch(API_URL);
      const data = (await response.json().catch(() => null)) as SellRequestResponse | null;
      if (!response.ok || !data?.success || !Array.isArray(data.requests)) {
        throw new Error(data?.message || "Unable to load sell requests.");
      }
      setRequests(data.requests);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load sell requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadRequests);
  }, [loadRequests]);

  const counts = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter((item) => ["pending", "under_review", "listing"].includes(item.status)).length,
      approved_manual: requests.filter((item) => item.status === "approved_manual").length,
      listed: requests.filter((item) => item.status === "listed").length,
      rejected: requests.filter((item) => item.status === "rejected").length,
    }),
    [requests]
  );

  const visibleRequests = useMemo(() => {
    if (filter === "all") return requests;
    if (filter === "pending") {
      return requests.filter((item) => ["pending", "under_review", "listing"].includes(item.status));
    }
    return requests.filter((item) => item.status === filter);
  }, [filter, requests]);

  const openDetails = async (item: SellRequest) => {
    setError("");
    try {
      const response = await adminFetch(`${API_URL}/${item._id}`);
      const data = (await response.json().catch(() => null)) as SellRequestResponse | null;
      if (!response.ok || !data?.success || !data.request) {
        throw new Error(data?.message || "Unable to load request details.");
      }
      setSelected(data.request);
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Unable to load request details.");
    }
  };

  const deleteRequest = async (request: SellRequest) => {
    if (deletingRequestIds.current.has(request._id)) return;
    if (!window.confirm("Delete this sell request permanently? This cannot be undone.")) {
      return;
    }

    deletingRequestIds.current.add(request._id);
    setDeletingId(request._id);
    setError("");
    setNotice("");

    try {
      const response = await adminFetch(`${API_URL}/${request._id}`, {
        method: "DELETE",
      });
      const data = (await response.json().catch(() => null)) as SellRequestResponse | null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to delete this sell request.");
      }

      setRequests((current) => current.filter((item) => item._id !== request._id));
      setSelected((current) => (current?._id === request._id ? null : current));
      setNotice(data.message || "Sell request deleted successfully.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Unable to delete this sell request."
      );
    } finally {
      deletingRequestIds.current.delete(request._id);
      setDeletingId((current) => (current === request._id ? null : current));
    }
  };

  const action = async (
    request: SellRequest,
    path: string,
    body: Record<string, unknown>,
    fallback: string,
    confirmation?: string
  ) => {
    if (confirmation && !window.confirm(confirmation)) return;
    setBusy(request._id);
    setError("");
    setNotice("");
    try {
      const response = await adminFetch(`${API_URL}/${request._id}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => null)) as SellRequestResponse | null;
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || fallback);
      }
      setNotice(data.message || fallback);
      setSelected(null);
      await loadRequests();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : fallback);
    } finally {
      setBusy("");
    }
  };

  const reject = (request: SellRequest) => {
    if (!window.confirm("Reject this sell request? It will not be listed publicly.")) return;
    const reason = window.prompt("Optional rejection reason:", "") || "";
    void action(request, "reject", { reason }, "Sell request rejected.");
  };

  const tabs = [
    ["all", "All"],
    ["pending", "Pending"],
    ["approved_manual", "Approved / Ready to List"],
    ["listed", "Listed"],
    ["rejected", "Rejected"],
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#9a7424]">Owner submissions</p>
          <h1 className="mt-1 font-serif text-3xl text-[#14110a] sm:text-4xl">Sell Requests</h1>
          <p className="mt-2 text-sm text-[#6b665c]">Review owner submissions before creating public vehicle listings.</p>
        </div>
        <button type="button" onClick={() => void loadRequests()} disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-[#e6e1d6] bg-white px-4 text-sm font-semibold text-[#39352d] hover:border-[#c9a050] disabled:opacity-60 sm:self-auto">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </header>

      {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={19} className="mt-0.5 shrink-0" />{error}</div>}
      {notice && <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={19} className="mt-0.5 shrink-0" />{notice}</div>}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(([value, label]) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${filter === value ? "bg-[#14110a] text-white" : "border border-[#e6e1d6] bg-white text-[#625d53] hover:border-[#c9a050]"}`}>
            {label} <span className="ml-1 opacity-70">{counts[value as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      <section className={`${card} overflow-hidden`}>
        {loading ? (
          <div className="space-y-3 p-5">{[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl bg-[#f6f3ea]" />)}</div>
        ) : visibleRequests.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <ClipboardList size={32} className="text-[#b98a32]" />
            <h2 className="mt-4 font-serif text-2xl">No requests here</h2>
            <p className="mt-2 text-sm text-[#777166]">New owner submissions will appear in this list.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#f1ede2]">
            {visibleRequests.map((request) => (
              <li key={request._id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#f3f0e8] sm:block">
                    {request.images[0] && <img src={request.images[0].url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-semibold text-[#14110a]">{request.year} {request.brand} {request.model}</h2>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[request.status]}`}>{statusLabel[request.status]}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#6b665c]">{request.category === "commercial" ? "Commercial Vehicles" : "Cars"} · {request.kilometers.toLocaleString("en-IN")} km · {money(request.expectedPrice)}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#898376]"><span className="inline-flex items-center gap-1"><MapPin size={13} />{request.location}</span><span>{request.ownerName}</span><span>{request.phone}</span><span>{formatDate(request.createdAt)}</span></p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" onClick={() => void openDetails(request)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6e1d6] bg-white px-3.5 text-sm font-semibold text-[#39352d] hover:border-[#c9a050]"><Eye size={16} /> View Details</button>
                  <button type="button" disabled={deletingId === request._id || busy === request._id} onClick={() => void deleteRequest(request)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 text-sm font-semibold text-red-700 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-60">
                    {deletingId === request._id ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
                    Delete
                  </button>
                  {request.status === "approved_manual" && <button type="button" onClick={() => setListingRequest(request)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#14110a] px-3.5 text-sm font-semibold text-white hover:bg-[#2a251a]"><Tag size={15} /> List Vehicle</button>}
                  {["pending", "under_review"].includes(request.status) && busy !== request._id && (
                    <button type="button" onClick={() => void action(request, "approve-and-list", {}, "Vehicle approved and listed successfully.", "Approve and immediately list this vehicle?")} className="hidden h-10 items-center gap-2 rounded-lg bg-emerald-700 px-3.5 text-sm font-semibold text-white hover:bg-emerald-800 lg:inline-flex"><Check size={15} /> Approve & List</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selected && (
        <RequestDetails
          request={selected}
          busy={busy === selected._id}
          deleting={deletingId === selected._id}
          onClose={() => setSelected(null)}
          onDelete={() => void deleteRequest(selected)}
          onDirect={() => void action(selected, "approve-and-list", {}, "Vehicle approved and listed successfully.", "Are you sure you want to approve and immediately list this vehicle?")}
          onManual={() => void action(selected, "approve-manual", {}, "Vehicle approved and ready for manual listing.")}
          onReject={() => reject(selected)}
          onList={() => setListingRequest(selected)}
        />
      )}
      {listingRequest && (
        <ListingDialog
          request={listingRequest}
          onClose={() => setListingRequest(null)}
          onPublished={async (message) => {
            setListingRequest(null);
            setNotice(message);
            await loadRequests();
          }}
        />
      )}
    </div>
  );
}

function RequestDetails({
  request,
  busy,
  deleting,
  onClose,
  onDelete,
  onDirect,
  onManual,
  onReject,
  onList,
}: {
  request: SellRequest;
  busy: boolean;
  deleting: boolean;
  onClose: () => void;
  onDelete: () => void;
  onDirect: () => void;
  onManual: () => void;
  onReject: () => void;
  onList: () => void;
}) {
  return (
    <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <section role="dialog" aria-modal="true" aria-labelledby="sell-request-title" className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-[#fbfaf7] p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-sm font-semibold text-[#9a7424]">Sell request review</p><h2 id="sell-request-title" className="mt-1 font-serif text-2xl">{request.year} {request.brand} {request.model}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close details" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6e1d6] bg-white"><X size={19} /></button>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle[request.status]}`}>{statusLabel[request.status]}</span><span className="text-sm text-[#777166]">Submitted {formatDate(request.createdAt)}</span></div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ["Category", request.category === "commercial" ? "Commercial Vehicles" : "Cars"],
            ["Brand / model", `${request.brand} ${request.model}`],
            ["Year", String(request.year)],
            ["Kilometers", `${request.kilometers.toLocaleString("en-IN")} km`],
            ["Fuel / transmission", `${request.fuelType} · ${request.transmission}`],
            ["Expected price", money(request.expectedPrice)],
            ["Location", request.location],
          ].map(([label, value]) => <div key={label} className="rounded-xl border border-[#efeae0] bg-white p-3"><p className="text-xs text-[#898376]">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>)}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#efeae0] bg-white p-4"><h3 className="font-semibold">Owner</h3><p className="mt-2 text-sm">{request.ownerName}</p><a href={`tel:${request.phone}`} className="mt-1 inline-flex items-center gap-2 text-sm text-[#72551f]"><Phone size={14} />{request.phone}</a>{request.email && <p className="mt-1 text-sm">{request.email}</p>}{request.ownerLocation && <p className="mt-1 text-sm text-[#777166]">{request.ownerLocation}</p>}</div>
          <div className="rounded-xl border border-[#efeae0] bg-white p-4"><h3 className="font-semibold">Description</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#625d53]">{request.description || "No description provided."}</p>{request.additionalMessage && <p className="mt-3 border-t border-[#f1ede2] pt-3 text-sm italic text-[#625d53]">“{request.additionalMessage}”</p>}</div>
        </div>
        <div className="mt-4 rounded-xl border border-[#efeae0] bg-white p-4">
          <h3 className="font-semibold">Vehicle images ({request.images.length})</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{request.images.map((image) => <a key={image.publicId} href={image.url} target="_blank" rel="noreferrer"><img src={image.url} alt={`${request.brand} ${request.model}`} className="aspect-[4/3] w-full rounded-lg object-cover" /></a>)}</div>
        </div>
        {request.rejectionReason && <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">Rejection reason: {request.rejectionReason}</p>}
        {request.status === "listed" && request.vehicleId && <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">Published vehicle ID: {request.vehicleId}</p>}
        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#e9e3d7] pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="h-11 rounded-xl border border-[#e6e1d6] bg-white px-4 text-sm font-semibold">Close</button>
          <button type="button" disabled={busy || deleting} onClick={onDelete} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60">
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
            Delete request
          </button>
          {request.status === "approved_manual" && <button type="button" onClick={onList} className="h-11 rounded-xl bg-[#14110a] px-4 text-sm font-semibold text-white">List Vehicle</button>}
          {["pending", "under_review"].includes(request.status) && <>
            <button type="button" disabled={busy} onClick={onReject} className="h-11 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 disabled:opacity-60">Reject</button>
            <button type="button" disabled={busy} onClick={onManual} className="h-11 rounded-xl border border-[#d9c89e] bg-[#fffaf0] px-4 text-sm font-semibold text-[#76591f] disabled:opacity-60">Approve — List Manually</button>
            <button type="button" disabled={busy} onClick={onDirect} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white disabled:opacity-60">{busy ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}Approve & List Directly</button>
          </>}
        </div>
      </section>
    </div>
  );
}

function ListingDialog({
  request,
  onClose,
  onPublished,
}: {
  request: SellRequest;
  onClose: () => void;
  onPublished: (message: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(`${request.year} ${request.brand} ${request.model}`);
  const [brand, setBrand] = useState(request.brand);
  const [model, setModel] = useState(request.model);
  const [year, setYear] = useState(String(request.year));
  const [kilometers, setKilometers] = useState(String(request.kilometers));
  const [price, setPrice] = useState(String(request.expectedPrice));
  const [location, setLocation] = useState(request.location);
  const [description, setDescription] = useState(request.description);
  const [fuelType, setFuelType] = useState(request.fuelType);
  const [transmission, setTransmission] = useState(request.transmission);
  const [status, setStatus] = useState("Available");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [images, setImages] = useState<EditableImage[]>(request.images);
  const imagesRef = useRef(images);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchBrands(request.category)
      .then((items) => {
        if (active) setBrands(items.filter((item) => item.isActive).map((item) => item.name));
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load brands.");
      });
    return () => { active = false; };
  }, [request.category]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => () => {
    imagesRef.current.forEach((image) => {
      if (image.preview) URL.revokeObjectURL(image.preview);
    });
  }, []);

  const addImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (images.length + files.length > MAX_IMAGES) {
      setError(`A listing can contain up to ${MAX_IMAGES} images.`);
      return;
    }
    if (files.some((file) => !file.type.startsWith("image/") || file.size > MAX_IMAGE_SIZE)) {
      setError("Choose image files up to 10 MB each.");
      return;
    }
    setError("");
    setImages((current) => [
      ...current,
      ...files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        url: "",
        publicId: "",
      })),
    ]);
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  };

  const publish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!model.trim() || !location.trim() || !Number.isFinite(Number(year)) || !Number.isFinite(Number(kilometers)) || Number(kilometers) < 0 || !Number.isFinite(Number(price)) || Number(price) <= 0 || images.length === 0) {
      setError("Check required listing details and retain at least one image.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const addedFiles = images.filter((image) => image.file);
      let uploaded: SellImage[] = [];
      if (addedFiles.length) {
        const formData = new FormData();
        addedFiles.forEach((image) => formData.append("images", image.file as File));
        const uploadResponse = await fetch("http://localhost:5000/api/upload-multiple", { method: "POST", body: formData });
        const uploadData = (await uploadResponse.json().catch(() => null)) as { success?: boolean; message?: string; images?: SellImage[] } | null;
        if (!uploadResponse.ok || !uploadData?.success || !Array.isArray(uploadData.images) || uploadData.images.length !== addedFiles.length) {
          throw new Error(uploadData?.message || "Unable to upload listing images.");
        }
        uploaded = uploadData.images;
      }
      let uploadedIndex = 0;
      const finalImages = images.map((image) => image.file ? uploaded[uploadedIndex++] : { url: image.url, publicId: image.publicId });
      const response = await adminFetch(`${API_URL}/${request._id}/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing: {
            title: title.trim(),
            brand,
            model: model.trim(),
            year: Number(year),
            kilometers: Number(kilometers),
            price: Number(price),
            location: location.trim(),
            description: description.trim(),
            fuelType,
            transmission,
            images: finalImages,
            status,
            isBestSeller,
          },
        }),
      });
      const data = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
      if (!response.ok || !data?.success) throw new Error(data?.message || "Unable to publish vehicle.");
      await onPublished(data.message || "Vehicle listed successfully.");
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Unable to publish vehicle.");
    } finally {
      setSaving(false);
    }
  };

  const input = "mt-1 h-11 w-full rounded-xl border border-[#e6e1d6] bg-white px-3 text-sm outline-none focus:border-[#c9a050] focus:ring-4 focus:ring-[#c9a050]/15";

  return (
    <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }} className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <form onSubmit={publish} className="max-h-[94dvh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-[#fbfaf7] p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-[#9a7424]">Approved / Ready to List</p><h2 className="mt-1 font-serif text-2xl">Review listing details</h2><p className="mt-1 text-sm text-[#777166]">All request details are pre-filled; make any final edits before publishing.</p></div><button type="button" disabled={saving} onClick={onClose} aria-label="Close listing form" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6e1d6] bg-white"><X size={19} /></button></div>
        {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm font-semibold">Listing title<input className={input} value={title} onChange={(event) => setTitle(event.target.value)} required /></label>
          <label className="text-sm font-semibold">Brand<select className={input} value={brand} onChange={(event) => setBrand(event.target.value)}>{brands.map((name) => <option key={name}>{name}</option>)}</select></label>
          <label className="text-sm font-semibold">Model<input className={input} value={model} onChange={(event) => setModel(event.target.value)} required /></label>
          <label className="text-sm font-semibold">Year<input className={input} type="number" min="1950" max={new Date().getFullYear() + 1} value={year} onChange={(event) => setYear(event.target.value)} required /></label>
          <label className="text-sm font-semibold">Kilometers<input className={input} type="number" min="0" value={kilometers} onChange={(event) => setKilometers(event.target.value)} required /></label>
          <label className="text-sm font-semibold">Price (₹)<input className={input} type="number" min="1" value={price} onChange={(event) => setPrice(event.target.value)} required /></label>
          <label className="text-sm font-semibold">Fuel<select className={input} value={fuelType} onChange={(event) => setFuelType(event.target.value)}>{["Diesel", "Petrol", "CNG", "Electric", "Other"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm font-semibold">Transmission<select className={input} value={transmission} onChange={(event) => setTransmission(event.target.value)}>{["Manual", "Automatic", "Other"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm font-semibold">Vehicle status<select className={input} value={status} onChange={(event) => setStatus(event.target.value)}>{["Available", "Reserved", "Sold"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm font-semibold sm:col-span-2 lg:col-span-3">Location<input className={input} value={location} onChange={(event) => setLocation(event.target.value)} required /></label>
          <label className="text-sm font-semibold sm:col-span-2 lg:col-span-3">Description<textarea rows={3} className="mt-1 w-full rounded-xl border border-[#e6e1d6] bg-white px-3 py-3 text-sm outline-none focus:border-[#c9a050] focus:ring-4 focus:ring-[#c9a050]/15" value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        </div>
        <div className="mt-5 rounded-2xl border border-[#efeae0] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">Listing images</h3><p className="text-xs text-[#777166]">{images.length} of {MAX_IMAGES}; uploaded source images are reused.</p></div><label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#d8c89f] bg-[#fffaf0] px-3 text-sm font-semibold text-[#76591f]"><Plus size={16} /> Add images<input type="file" accept="image/*" multiple onChange={addImages} className="sr-only" /></label></div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{images.map((image, index) => <div key={`${image.publicId || image.file?.name}-${index}`} className="relative"><img src={image.preview || image.url} alt={`Listing vehicle ${index + 1}`} className="aspect-[4/3] w-full rounded-lg object-cover" /><button type="button" onClick={() => removeImage(index)} aria-label={`Remove image ${index + 1}`} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600"><X size={15} /></button></div>)}</div>
        </div>
        <label className="mt-4 flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={isBestSeller} onChange={(event) => setIsBestSeller(event.target.checked)} className="h-4 w-4 accent-[#c9a050]" /> Mark as Best Seller</label>
        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#e9e3d7] pt-5 sm:flex-row sm:justify-end">
          <button type="button" disabled={saving} onClick={onClose} className="h-11 rounded-xl border border-[#e6e1d6] bg-white px-5 text-sm font-semibold disabled:opacity-60">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#14110a] px-5 text-sm font-semibold text-white disabled:opacity-60">{saving ? <Loader2 size={17} className="animate-spin" /> : <Check size={17} />}Publish Vehicle</button>
        </div>
      </form>
    </div>
  );
}
