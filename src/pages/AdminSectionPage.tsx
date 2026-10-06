import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminSectionPageProps {
  title: string;
  description: string;
  message: string;
  icon: LucideIcon;
}

const AdminSectionPage = ({
  title,
  description,
  message,
  icon: Icon,
}: AdminSectionPageProps) => (
  <div className="mx-auto max-w-5xl space-y-6">
    <header>
      <Link
        to="/admin"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e6e1d6] bg-white px-4 text-sm font-medium text-[#4d493f] shadow-sm transition hover:border-[#e0b866] hover:text-[#14110a]"
      >
        <ArrowLeft size={16} />
        Dashboard
      </Link>
      <p className="mt-5 text-sm font-semibold text-[#9a7424]">Administration</p>
      <h1 className="jj-serif mt-1 text-3xl text-[#14110a] sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b665c]">{description}</p>
    </header>

    <section className="rounded-3xl border border-[#efeae0] bg-white px-6 py-14 text-center shadow-[0_1px_2px_rgba(20,16,8,0.04),0_14px_34px_-22px_rgba(20,16,8,0.18)] sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6f3ea] text-[#b98a32]">
        <Icon size={28} strokeWidth={1.8} />
      </div>
      <h2 className="jj-serif mt-5 text-lg font-semibold text-[#14110a]">{message}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8a8478]">
        This section is ready for your business workflow. Your vehicle inventory remains available from the dashboard.
      </p>
      <Link
        to="/admin/vehicles"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#14110a] px-5 text-sm font-semibold text-white transition hover:bg-[#2a251a]"
      >
        View inventory
      </Link>
      <Construction size={15} className="mx-auto mt-8 text-[#c9a050]" aria-hidden />
    </section>
  </div>
);

export default AdminSectionPage;
