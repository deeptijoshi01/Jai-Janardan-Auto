import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Mail,
  MessageSquare,
  Phone,
  Search,
} from "lucide-react";
import { adminFetch, API_BASE_URL } from "../services/adminAuth";

type EnquiryStatus = "New" | "Contacted" | "Qualified" | "Closed";

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  vehicleDetails: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}

const statuses: EnquiryStatus[] = ["New", "Contacted", "Qualified", "Closed"];
const statusStyles: Record<EnquiryStatus, string> = {
  New: "bg-amber-50 text-amber-800 ring-amber-200",
  Contacted: "bg-sky-50 text-sky-800 ring-sky-200",
  Qualified: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Closed: "bg-stone-100 text-stone-700 ring-stone-200",
};

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminFetch(`${API_BASE_URL}/enquiries`, {
        cache: "no-store",
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        enquiries?: Enquiry[];
      } | null;
      if (!response.ok || !data?.success || !Array.isArray(data.enquiries)) {
        throw new Error(data?.message || "Unable to load enquiries.");
      }
      setEnquiries(data.enquiries);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load enquiries."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadEnquiries);
  }, [loadEnquiries]);

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      if (statusFilter !== "All" && enquiry.status !== statusFilter) return false;
      if (!query) return true;
      return [
        enquiry.name,
        enquiry.phone,
        enquiry.email,
        enquiry.interest,
        enquiry.vehicleDetails,
        enquiry.message,
      ].some((value) => value?.toLowerCase().includes(query));
    });
  }, [enquiries, search, statusFilter]);

  const updateStatus = async (enquiry: Enquiry, status: EnquiryStatus) => {
    setUpdatingId(enquiry._id);
    setError("");
    try {
      const response = await adminFetch(
        `${API_BASE_URL}/enquiries/${enquiry._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        enquiry?: Enquiry;
      } | null;
      if (!response.ok || !data?.success || !data.enquiry) {
        throw new Error(data?.message || "Unable to update enquiry status.");
      }
      setEnquiries((current) =>
        current.map((item) =>
          item._id === data.enquiry?._id ? data.enquiry : item
        )
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update enquiry status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <header className="rounded-3xl border border-[#eee8db] bg-[#fbfaf6] p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a77f39]">
          Customer messages
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#0b1a33] sm:text-4xl">
          Enquiries
        </h1>
        <p className="mt-2 text-sm text-[#6b665c]">
          Review Contact Form messages, follow up, and update their status.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-[#eee8db] bg-white p-4 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search enquiries</span>
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8478]"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, phone, email or message"
            className="h-11 w-full rounded-xl border border-[#e5dfd2] pl-10 pr-3 text-sm outline-none focus:border-[#c9a050] focus:ring-4 focus:ring-[#c9a050]/15"
          />
        </label>
        <label className="sm:w-48">
          <span className="sr-only">Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#e5dfd2] bg-white px-3 text-sm outline-none focus:border-[#c9a050] focus:ring-4 focus:ring-[#c9a050]/15"
          >
            <option>All</option>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div
          aria-label="Loading enquiries"
          className="h-36 animate-pulse rounded-2xl bg-[#efeae0]"
        />
      ) : filteredEnquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d9d1c1] bg-white p-10 text-center">
          <MessageSquare className="mx-auto text-[#b98f3f]" size={28} />
          <p className="mt-3 font-semibold text-[#0b1a33]">
            {enquiries.length ? "No matching enquiries" : "No enquiries yet"}
          </p>
          <p className="mt-1 text-sm text-[#6b665c]">
            {enquiries.length
              ? "Try a different search or status filter."
              : "New Contact Form submissions will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEnquiries.map((enquiry) => (
            <article
              key={enquiry._id}
              className="rounded-2xl border border-[#eee8db] bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-[#0b1a33]">
                      {enquiry.name}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[enquiry.status]}`}
                    >
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#817b70]">
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(enquiry.createdAt))}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs font-medium text-[#625d54]">
                  Status
                  <select
                    value={enquiry.status}
                    disabled={updatingId === enquiry._id}
                    onChange={(event) =>
                      void updateStatus(
                        enquiry,
                        event.target.value as EnquiryStatus
                      )
                    }
                    className="h-10 rounded-lg border border-[#e5dfd2] bg-white px-2 text-sm text-[#0b1a33] disabled:opacity-60"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`tel:${enquiry.phone}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#f6f3ea] px-3 text-sm font-medium text-[#0b1a33] hover:bg-[#eee8db]"
                >
                  <Phone size={15} />
                  Call
                </a>
                {enquiry.email && (
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#f6f3ea] px-3 text-sm font-medium text-[#0b1a33] hover:bg-[#eee8db]"
                  >
                    <Mail size={15} />
                    Email
                  </a>
                )}
                <a
                  href={`https://wa.me/${enquiry.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}?text=${encodeURIComponent(`Hello ${enquiry.name}, thank you for contacting Jai Janardan Auto. We are following up on your enquiry.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
                >
                  WhatsApp
                </a>
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-[#f0ece4] pt-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[#898274]">
                    Interested in
                  </dt>
                  <dd className="mt-1 text-[#252c36]">{enquiry.interest}</dd>
                </div>
                {enquiry.vehicleDetails && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-[#898274]">
                      Vehicle
                    </dt>
                    <dd className="mt-1 text-[#252c36]">
                      {enquiry.vehicleDetails}
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-[#898274]">
                    Message
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-[#252c36]">
                    {enquiry.message}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Enquiries;
