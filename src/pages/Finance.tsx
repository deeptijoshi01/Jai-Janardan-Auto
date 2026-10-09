import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Coins,
  FileCheck2,
  FileText,
  HandCoins,
  Handshake,
  Info,
  Percent,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
} from "lucide-react";

import financeBackground from "../assets/why_to_choose/finance.png";
import topBackground from "../assets/fiance/top-bg.png";

/* Finance partner logos (PNG: au, chola, hdb, shreram, tata_capital — rest are JPG) */
import auLogo from "../assets/fiance/finance_logo/au.png";
import blackBuckLogo from "../assets/fiance/finance_logo/black_buck.jpg";
import cholaLogo from "../assets/fiance/finance_logo/chola.png";
import dugarLogo from "../assets/fiance/finance_logo/dugar.jpg";
import equitasLogo from "../assets/fiance/finance_logo/equitas.jpg";
import hdbLogo from "../assets/fiance/finance_logo/hdb.png";
import idfcLogo from "../assets/fiance/finance_logo/idfc.jpg";
import kogtaLogo from "../assets/fiance/finance_logo/kogta.jpg";
import muthootLogo from "../assets/fiance/finance_logo/muthut_finance.jpg";
import shriramLogo from "../assets/fiance/finance_logo/shreram.png";
import skLogo from "../assets/fiance/finance_logo/sk.jpg";
import tataCapitalLogo from "../assets/fiance/finance_logo/tata_capital.png";
import tigerLogo from "../assets/fiance/finance_logo/tiger.jpg";
import vastuLogo from "../assets/fiance/finance_logo/vastu.jpg";

/* =========================================================
  FINANCE PROCESS
========================================================= */

const processSteps = [
  {
    number: "01",
    title: "Choose Your Vehicle",
    description: "Browse our available commercial vehicles and select the right one.",
    icon: Truck,
  },
  {
    number: "02",
    title: "Submit Finance Request",
    description: "Share basic personal and vehicle details.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Document Verification",
    description: "Our team helps coordinate the required documentation.",
    icon: FileCheck2,
  },
  {
    number: "04",
    title: "Approval & Purchase",
    description: "Once approved, complete the purchase and take delivery of your vehicle.",
    icon: CheckCircle2,
  },
];

/* =========================================================
  FINANCE OPTIONS
========================================================= */

const financeOptions = [
  {
    title: "Commercial Vehicle Finance",
    description: "Financing support for trucks, pickups, tippers and other commercial vehicles.",
    icon: Truck,
  },
  {
    title: "Used Vehicle Finance",
    description: "Financing assistance for eligible pre-owned commercial vehicles.",
    icon: HandCoins,
  },
  {
    title: "Flexible Repayment Options",
    description: "Choose a suitable loan amount and tenure based on your eligibility.",
    icon: Wallet,
  },
];

/* =========================================================
  FINANCE PARTNERS
========================================================= */

type FinancePartner = {
  name: string;
  type: string;
  logo: string;
};

const financePartners: FinancePartner[] = [
  { name: "Tata Capital", type: "Vehicle & Commercial Finance", logo: tataCapitalLogo },
  { name: "BlackBuck", type: "Commercial Vehicle Finance", logo: blackBuckLogo },
  { name: "Muthoot Finance", type: "Vehicle Finance", logo: muthootLogo },
  { name: "Kogta Finance", type: "Vehicle Finance", logo: kogtaLogo },
  { name: "Chola Finance", type: "Commercial Vehicle Finance", logo: cholaLogo },
  { name: "AU Finance", type: "Vehicle Finance", logo: auLogo },
  { name: "Tiger Finance", type: "Vehicle Finance", logo: tigerLogo },
  { name: "Vastu Finance", type: "Vehicle Finance", logo: vastuLogo },
  { name: "SK Finance", type: "Commercial Vehicle Finance", logo: skLogo },
  { name: "Shriram Finance", type: "Commercial Vehicle Finance", logo: shriramLogo },
  { name: "Dugar Finance", type: "Vehicle Finance", logo: dugarLogo },
  { name: "IDFC FIRST Bank", type: "Vehicle Finance", logo: idfcLogo },
  { name: "Equitas Small Finance Bank", type: "Vehicle Finance", logo: equitasLogo },
  { name: "HDB Financial Services", type: "Vehicle Finance", logo: hdbLogo },
];

const partnerCountLabel = `${financePartners.length}+`;

/* =========================================================
  EMI HIGHLIGHTS
========================================================= */

const emiHighlights = [
  { title: "Competitive Rates", description: "Financing options from leading partners", icon: ShieldCheck },
  { title: "Quick Approval", description: "Guided assistance throughout the process", icon: FileCheck2 },
  { title: "Multiple Lenders", description: `Choose from ${partnerCountLabel} trusted finance partners`, icon: Users },
  { title: "For All Commercial Vehicles", description: "Trucks, tippers, pickups and more", icon: Truck },
];

/* =========================================================
  ELIGIBILITY & DOCUMENTS
========================================================= */

const eligibilityItems = [
  "Valid identity proof",
  "Address proof",
  "Income / business details",
  "Vehicle details",
  "Credit assessment as applicable",
];

const documentItems = [
  "Aadhaar Card / PAN Card",
  "Address proof",
  "Bank statements",
  "Income / Business proof",
  "Vehicle documents",
];

/* =========================================================
  BENEFITS
========================================================= */

const financeBenefits = [
  { title: "Simple Process", description: "Less paperwork confusion with guided assistance.", icon: CheckCircle2 },
  { title: "Transparent Information", description: "Clear vehicle pricing and finance estimates.", icon: ShieldCheck },
  { title: "Vehicle-Focused Assistance", description: "Support specifically for commercial vehicle purchases.", icon: Truck },
  { title: "Faster Coordination", description: "One point of contact throughout the finance process.", icon: BriefcaseBusiness },
];

/* =========================================================
  FAQ
========================================================= */

const faqs = [
  {
    question: "Can I finance a used commercial vehicle?",
    answer: "Finance may be available for eligible pre-owned commercial vehicles. Vehicle age, condition, lender criteria and your applicant profile can affect eligibility.",
  },
  {
    question: "How much down payment is required?",
    answer: "The required down payment varies by vehicle, lender and applicant profile. Use the calculator above to explore an estimate with different down-payment amounts.",
  },
  {
    question: "What documents are required?",
    answer: "Common documents include identity and address proof, bank statements, income or business details, and vehicle documents. Exact requirements may vary.",
  },
  {
    question: "Can I calculate my EMI before selecting a vehicle?",
    answer: "Yes. The calculator provides an illustrative estimate using the vehicle price, down payment, annual interest rate and loan tenure you enter.",
  },
  {
    question: "How long does finance approval take?",
    answer: "Processing time depends on the lender, document verification and applicant profile. A specific timeline can only be confirmed once a request is reviewed.",
  },
  {
    question: "Is finance available for all vehicles?",
    answer: "Availability depends on the vehicle and the lender's criteria. Eligibility is assessed by the lender for each vehicle and applicant.",
  },
];

/* =========================================================
  MAIN COMPONENT
========================================================= */

export default function Finance() {
  const [vehiclePrice, setVehiclePrice] = useState<string>("");
  const [downPayment, setDownPayment] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [tenure, setTenure] = useState<string>("");
  const [tenureUnit, setTenureUnit] = useState<"months" | "years">("months");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const price = Number(vehiclePrice) || 0;
  const down = Number(downPayment) || 0;
  const rate = Number(interestRate) || 0;
  const months = Math.round((Number(tenure) || 0) * (tenureUnit === "years" ? 12 : 1));

  const principal = Math.max(0, price - down);
  const monthlyRate = rate / 100 / 12;

  const monthlyEmi =
    principal <= 0 || months <= 0
      ? 0
      : monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);

  const totalPayable = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayable - principal);

  const downPaymentInvalid = price > 0 && down >= price;
  const maxTenure = tenureUnit === "years" ? 7 : 84;

  const tenureLabel =
    months > 0
      ? `${months} months${months % 12 === 0 ? ` (${months / 12} ${months === 12 ? "year" : "years"})` : ""}`
      : "—";

  const currency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number.isFinite(amount) ? amount : 0);

  const updateVehiclePrice = (value: string) => {
    if (value === "") return setVehiclePrice("");
    if (!Number.isFinite(Number(value))) return;
    setVehiclePrice(value);
  };

  const updateDownPayment = (value: string) => {
    if (value === "") return setDownPayment("");
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    if (price > 0 && numericValue > price) return setDownPayment(vehiclePrice);
    setDownPayment(value);
  };

  const updateInterestRate = (value: string) => {
    if (value === "") return setInterestRate("");
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    if (numericValue > 30) return setInterestRate("30");
    setInterestRate(value);
  };

  const updateTenure = (value: string) => {
    if (value === "") return setTenure("");
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    if (numericValue > maxTenure) return setTenure(String(maxTenure));
    setTenure(value);
  };

  const switchTenureUnit = (unit: "months" | "years") => {
    if (unit === tenureUnit) return;
    if (tenure !== "") {
      const n = Number(tenure);
      if (Number.isFinite(n)) {
        const converted = unit === "years" ? n / 12 : n * 12;
        const limit = unit === "years" ? 7 : 84;
        setTenure(String(Math.min(limit, Math.round(converted * 100) / 100)));
      }
    }
    setTenureUnit(unit);
  };

  const applyDownPercent = (percent: number) => {
    if (price <= 0) return;
    setDownPayment(String(Math.round((price * percent) / 100)));
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const inputClass =
    "h-14 w-full rounded-xl border border-[#e3dccd] bg-[#fdfcf8] px-4 text-base font-semibold text-[#172238] shadow-[inset_0_1px_2px_rgba(11,26,51,0.04)] outline-none transition-all duration-200 focus:border-[#bd9749] focus:ring-4 focus:ring-[#bd9749]/10 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none sm:h-[56px] sm:text-sm";

  return (
    <main className="overflow-x-hidden bg-[#fbfaf7] pb-16 text-[#172238]">
      {/* HERO */}
      <section className="bg-[#fbfaf7]">
        <div className="h-20 bg-[#0a1830] lg:h-24" aria-hidden="true" />

        {/* Mobile / Tablet */}
        <div className="lg:hidden">
          <div className="px-5 pb-8 pt-10 sm:px-6 sm:pt-12">
            <HeroContent />
          </div>
          <div className="relative">
            <img
              src={topBackground}
              alt="Row of commercial trucks"
              className="h-72 w-full object-cover object-[75%_center] sm:h-96"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#fbfaf7] to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fbfaf7] to-transparent" />
          </div>
        </div>

        {/* Desktop */}
        <div className="relative hidden min-h-[440px] items-center lg:flex xl:min-h-[480px]">
          <div className="absolute inset-y-0 right-0 w-[55%] overflow-hidden">
            <img src={topBackground} alt="Row of commercial trucks" className="h-full w-full object-cover object-[68%_center]" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,#fbfaf7_0%,rgba(251,250,247,0.85)_16%,rgba(251,250,247,0.35)_42%,rgba(251,250,247,0)_70%)]" />
          </div>
          <div className="relative z-10 w-full px-10 py-12 xl:px-16">
            <div className="mx-auto max-w-[1320px]">
              <div className="max-w-[50%] xl:max-w-[52%]">
                <HeroContent />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINANCE PARTNERS */}
      <section id="finance-partners" className="px-5 pb-12 pt-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#a47d32]">
                Our Finance Network
                <span className="h-px w-12 bg-[#c9a85c]" aria-hidden="true" />
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#0b1a33] sm:text-4xl">
                Our Finance Partners
              </h2>
            </div>
            <div className="flex items-center gap-3 sm:text-right">
              <Handshake size={36} strokeWidth={1.4} className="hidden shrink-0 text-[#a47d32] sm:block" aria-hidden="true" />
              <div>
                <p className="font-serif text-base font-bold text-[#a47d32] sm:text-lg">
                  {partnerCountLabel} Trusted Finance Partners
                </p>
                <p className="mt-1 text-xs text-[#6c7280] sm:text-sm">
                  Explore financing options from leading lenders.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 min-[560px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {financePartners.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <span className="hidden h-px flex-1 bg-[#ddd6c6] sm:block" aria-hidden="true" />
            <p className="flex items-start gap-2 text-xs leading-5 text-[#858174] sm:items-center sm:text-center">
              <Info size={15} className="mt-0.5 shrink-0 sm:mt-0" aria-hidden="true" />
              Finance availability, interest rates, loan amount, tenure and approval are subject to the respective lender's terms, policies and applicant eligibility.
            </p>
            <span className="hidden h-px flex-1 bg-[#ddd6c6] sm:block" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* EMI CALCULATOR */}
      <section
        id="emi-calculator"
        className="relative isolate scroll-mt-24 overflow-hidden border-t border-[#eee8dc] bg-[#fbfaf7] px-5 pb-16 pt-16 sm:px-6 lg:px-10"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(232,196,120,0.25)_0%,rgba(232,196,120,0)_70%)]" />
          <div className="absolute -left-20 bottom-10 h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgba(236,222,190,0.4)_0%,rgba(236,222,190,0)_70%)]" />
        </div>

        <div className="mx-auto max-w-[1320px]">
          <div className="mb-10 max-w-2xl">
            <p className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#a47d32]">
              Plan Smart
              <span className="h-px w-14 bg-[#c9a85c]" aria-hidden="true" />
            </p>
            <h2 className="mt-3 font-serif text-[2.5rem] font-bold leading-[1.05] tracking-tight text-[#0b1a33] sm:text-5xl lg:text-[3.5rem]">
              Estimate Your <span className="text-[#a8792a]">EMI</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#5f6677] sm:text-base sm:leading-7">
              Get an approximate EMI for your commercial vehicle. Adjust the values to find a plan that suits your business needs.
            </p>
          </div>

          {/* Premium Calculator Card */}
          <div className="overflow-hidden rounded-[24px] border border-[#e8e1d3] bg-white shadow-[0_30px_80px_-20px_rgba(11,26,51,0.25)] sm:rounded-[28px]">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              
              {/* Left Input Panel */}
              <div className="flex flex-col bg-white p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#eadfc4] bg-[linear-gradient(145deg,#fbf3df,#f3e4bd)] text-[#8e6c2e] sm:h-14 sm:w-14">
                    <Calculator size={24} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl font-bold leading-tight text-[#0b1a33] sm:text-2xl">
                      Calculate Your EMI
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#737888] sm:text-sm">
                      Enter the vehicle details to get an estimated monthly EMI.
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-x-5 gap-y-6 min-[480px]:grid-cols-2">
                  <CalculatorField
                    label="Vehicle Price"
                    value={vehiclePrice}
                    onChange={updateVehiclePrice}
                    placeholder="Enter vehicle price"
                    className={inputClass}
                    prefix="₹"
                    hint={price > 0 ? currency(price) : "Total on-road price of the vehicle"}
                  />
                  <CalculatorField
                    label="Down Payment"
                    value={downPayment}
                    onChange={updateDownPayment}
                    placeholder="Enter down payment"
                    className={inputClass}
                    prefix="₹"
                    error={downPaymentInvalid}
                    hint={
                      downPaymentInvalid
                        ? "Down payment must be less than the vehicle price"
                        : price > 0 && down > 0
                          ? `${Math.round((down / price) * 100)}% of vehicle price`
                          : "Amount you pay upfront"
                    }
                  />
                  <CalculatorField
                    label="Interest Rate (Per Annum)"
                    value={interestRate}
                    onChange={updateInterestRate}
                    placeholder="Enter interest rate"
                    className={inputClass}
                    prefix={<Percent size={15} strokeWidth={2.4} aria-hidden="true" />}
                    suffix="%"
                    step="0.1"
                    hint="Up to 30% per annum"
                  />
                  <CalculatorField
                    label="Loan Tenure"
                    value={tenure}
                    onChange={updateTenure}
                    placeholder={tenureUnit === "years" ? "Enter tenure in years" : "Enter tenure in months"}
                    className={inputClass}
                    prefix={<CalendarDays size={16} strokeWidth={2} aria-hidden="true" />}
                    suffix={tenureUnit === "years" ? "Years" : "Months"}
                    step={tenureUnit === "years" ? "0.5" : "1"}
                    hint={`Up to ${maxTenure} ${tenureUnit}`}
                    labelAction={
                      <span role="group" aria-label="Tenure unit" className="inline-flex rounded-full border border-[#e3dccd] bg-[#f6f2ea] p-0.5">
                        {(["months", "years"] as const).map((unit) => (
                          <button
                            key={unit}
                            type="button"
                            aria-pressed={tenureUnit === unit}
                            onClick={() => switchTenureUnit(unit)}
                            className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#14203a] ${
                              tenureUnit === unit
                                ? "bg-[#0b1a33] text-white shadow-sm"
                                : "text-[#6c7280] hover:text-[#14203a]"
                            }`}
                          >
                            {unit}
                          </button>
                        ))}
                      </span>
                    }
                  />
                </div>

                {/* Quick Select */}
                <div className="mt-8 grid gap-6">
                  <div>
                    <p className="text-[13px] font-semibold text-[#172238]">
                      Quick down payment
                      {price <= 0 && (
                        <span className="ml-2 text-[11px] font-medium text-[#8a8778]">
                          Enter vehicle price first
                        </span>
                      )}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {[10, 20, 30, 40].map((percent) => {
                        const active = price > 0 && down > 0 && Math.round((price * percent) / 100) === down;
                        return (
                          <button
                            key={percent}
                            type="button"
                            disabled={price <= 0}
                            aria-pressed={active}
                            onClick={() => applyDownPercent(percent)}
                            className={`min-h-10 rounded-full border px-5 text-xs font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14203a] disabled:cursor-not-allowed disabled:opacity-40 ${
                              active
                                ? "border-[#c9a24d] bg-[#f6e9c6] text-[#7a5b1e] shadow-sm"
                                : "border-[#e3dccd] bg-white text-[#5f6677] enabled:hover:border-[#c9a24d] enabled:hover:bg-[#fcfaf3] enabled:hover:text-[#7a5b1e]"
                            }`}
                          >
                            {percent}%
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-[#172238]">Quick tenure select</p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {(tenureUnit === "months" ? [12, 24, 36, 48, 60, 72] : [1, 2, 3, 4, 5, 6, 7]).map((value) => {
                        const active = tenure === String(value);
                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={active}
                            onClick={() => updateTenure(String(value))}
                            className={`min-h-10 rounded-full border px-4 text-xs font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14203a] ${
                              active
                                ? "border-[#c9a24d] bg-[#f6e9c6] text-[#7a5b1e] shadow-sm"
                                : "border-[#e3dccd] bg-white text-[#5f6677] hover:border-[#c9a24d] hover:bg-[#fcfaf3] hover:text-[#7a5b1e]"
                            }`}
                          >
                            {value} {tenureUnit === "months" ? "months" : value === 1 ? "year" : "years"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="mt-auto pt-8">
                  <div className="flex items-start gap-3 rounded-xl border border-[#e8e0ce] bg-[#fbfaf7] px-4 py-4">
                    <Info size={20} strokeWidth={1.6} className="mt-0.5 shrink-0 text-[#a47d32]" aria-hidden="true" />
                    <p className="text-xs leading-5 text-[#6c7280] sm:text-[13px] sm:leading-6">
                      This is an illustrative estimate only. Actual rates, eligibility, tenure, charges and approval depend on the lender and applicant profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right EMI Result Panel (Premium Navy) */}
              <div className="relative flex flex-col overflow-hidden bg-[#0a1830] p-6 text-white sm:p-8 lg:p-10">
                {/* Premium Background Elements */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(228,190,100,0.25)_0%,rgba(228,190,100,0)_70%)]" />
                  <div className="absolute -left-10 bottom-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(40,80,150,0.4)_0%,rgba(40,80,150,0)_70%)]" />
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 fill=%22none%22><circle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(255,255,255,0.04)%22/></svg>')]" />
                </div>

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center gap-2.5 text-[#e4c578]">
                    <Coins size={20} strokeWidth={1.7} aria-hidden="true" />
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em]">
                      Your Estimated EMI
                    </p>
                  </div>

                  <p
                    className="mt-5 flex flex-wrap items-baseline gap-x-2 font-serif text-[3rem] font-bold leading-none tracking-tight bg-gradient-to-r from-white via-[#f3e3b8] to-[#e4c578] bg-clip-text text-transparent sm:text-[3.5rem]"
                    aria-live="polite"
                  >
                    {currency(monthlyEmi)}
                    <span className="font-sans text-sm font-medium tracking-normal text-white/50 sm:text-base bg-none">
                      / month
                    </span>
                  </p>

                  {/* Breakdown Bar */}
                  <div className="mt-8">
                    <div
                      className="flex h-3 w-full overflow-hidden rounded-full bg-white/10 backdrop-blur-sm"
                      role="img"
                      aria-label="Principal versus interest split"
                    >
                      {totalPayable > 0 && (
                        <>
                          <div
                            className="h-full bg-gradient-to-r from-[#f3d588] to-[#e4c578] transition-all duration-500 ease-out"
                            style={{ width: `${(principal / totalPayable) * 100}%` }}
                          />
                          <div
                            className="h-full bg-gradient-to-r from-[#8194c2] to-[#6f86b8] transition-all duration-500 ease-out"
                            style={{ width: `${(totalInterest / totalPayable) * 100}%` }}
                          />
                        </>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-white/70">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#e4c578]" aria-hidden="true" />
                        Principal
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#6f86b8]" aria-hidden="true" />
                        Interest
                      </span>
                    </div>

                    {totalPayable <= 0 && (
                      <p className={`mt-4 text-xs leading-5 ${downPaymentInvalid ? "text-[#f2a49b]" : "text-white/55"}`}>
                        {downPaymentInvalid
                          ? "Your down payment covers the full vehicle price, so no loan is needed. Reduce the down payment to see an EMI."
                          : "Fill in all four fields to see your monthly EMI and full payment breakdown."}
                      </p>
                    )}
                  </div>

                  {/* Summary Dashboard */}
                  <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
                    <SummaryItem 
                      label="Vehicle Price" 
                      value={price > 0 ? currency(price) : "—"} 
                    />
                    <SummaryItem 
                      label="Down Payment" 
                      value={down > 0 ? currency(down) : "—"} 
                    />
                    <SummaryItem 
                      label="Loan Amount" 
                      value={principal > 0 ? currency(principal) : "—"} 
                    />
                    <SummaryItem 
                      label="Loan Tenure" 
                      value={tenureLabel} 
                    />
                    <SummaryItem 
                      label="Total Interest" 
                      value={totalInterest > 0 ? currency(totalInterest) : "—"} 
                    />
                    <SummaryItem 
                      label="Total Payable" 
                      value={totalPayable > 0 ? currency(totalPayable) : "—"} 
                      emphasized 
                    />
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() => scrollTo("finance-assistance")}
                    className="mt-auto inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#f3d588] to-[#d9b952] px-5 py-3 text-sm font-bold text-[#0b1a33] shadow-[0_10px_25px_-10px_rgba(189,151,73,0.5)] transition-all duration-200 hover:shadow-[0_15px_30px_-10px_rgba(189,151,73,0.6)] hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    style={{ marginTop: "2.5rem" }}
                  >
                    Get Finance Assistance
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Highlight Strip */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {emiHighlights.map(({ title, description, icon: Icon }, index) => (
              <div
                key={title}
                className={`flex items-start gap-4 lg:px-6 ${
                  index === 0 ? "lg:pl-0" : "lg:border-l lg:border-[#e4dccb]"
                }`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#eadfc4] bg-[linear-gradient(145deg,#fbf3df,#f3e4bd)] text-[#8e6c2e] sm:h-14 sm:w-14">
                  <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-bold leading-snug text-[#0b1a33] sm:text-[17px]">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-[#6c7280]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Assistance */}
          <div
            id="finance-assistance"
            className="mt-10 scroll-mt-28 rounded-2xl border border-[#e8e0ce] bg-[#fdfcf8] px-6 py-5 sm:px-8 sm:py-6"
          >
            <p className="text-sm font-semibold text-[#172238]">
              Need help understanding your estimate?
            </p>
            <p className="mt-1 text-sm leading-6 text-[#6c7280]">
              Keep your vehicle price, down payment and estimated EMI handy when discussing finance options with our team.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-[#eee8dc] bg-white px-5 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">
          <SectionHeading
            eyebrow="How It Works"
            title="How Vehicle Finance Works"
            description="A simple and transparent process to get you on the road."
          />
          <div className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {processSteps.map(({ number, title, description, icon: Icon }, index) => (
              <div key={number} className="relative flex gap-4 lg:block">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#ddc98f] bg-[#fbf7ed] text-[#9b762f] lg:h-14 lg:w-14">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                {index < processSteps.length - 1 && (
                  <ArrowRight size={19} className="absolute right-2 top-4 hidden text-[#c5a35b] lg:block" />
                )}
                <div className="lg:mt-5">
                  <p className="text-[10px] font-extrabold tracking-[0.16em] text-[#a47d32]">
                    STEP {number}
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-[#0b1a33]">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#707585]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINANCE OPTIONS */}
      <section className="px-5 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">
          <SectionHeading
            eyebrow="Finance Options"
            title="Flexible Finance Solutions"
            description="Choose the right finance option based on your business needs."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {financeOptions.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="group flex gap-4 rounded-2xl border border-[#e9e3d8] bg-white p-6 shadow-[0_8px_30px_-20px_rgba(11,26,51,0.45)] transition-all duration-300 hover:shadow-[0_15px_40px_-20px_rgba(11,26,51,0.3)] sm:p-7"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f7f2e7] text-[#9c7834] transition-colors duration-300 group-hover:bg-[#f0e4c5]">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#0b1a33]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#707585]">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ELIGIBILITY + WHY US */}
      <section className="border-y border-[#eee8dc] bg-white px-5 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Eligibility & Documents"
              title="Basic Eligibility and Documents"
              description="Keep these documents ready to make your finance process smoother."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <ChecklistCard title="Basic Eligibility" items={eligibilityItems} />
              <ChecklistCard title="Common Documents" items={documentItems} />
            </div>
            <p className="mt-5 rounded-lg bg-[#f7f4ed] px-4 py-3 text-xs leading-5 text-[#777466]">
              Exact requirements may vary depending on the lender and applicant profile.
            </p>
          </div>

          <div className="rounded-3xl border border-[#e9e3d8] bg-[#fbfaf7] p-6 sm:p-8">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#a47d32]">
              Why Finance With Us
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-[#0b1a33] sm:text-3xl">
              Why Finance With Us?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#707585]">
              A better financing experience for your business vehicles.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {financeBenefits.map(({ title, description, icon: Icon }) => (
                <div key={title} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e2d3ac] bg-white text-[#987432]">
                    <Icon size={18} strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#1b263d]">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#737888]">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title="FAQ"
            description="Here are some common questions about vehicle finance."
          />
          <div className="mt-8 divide-y divide-[#e9e3d8] border-y border-[#e9e3d8] bg-white">
            {faqs.map(({ question, answer }, index) => {
              const isOpen = openFaq === index;
              const answerId = `finance-faq-answer-${index}`;
              return (
                <div key={question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex min-h-16 w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-[#1b263d] transition hover:text-[#8e6c2e] sm:px-5"
                  >
                    {question}
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#a47d32] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    id={answerId}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-4 pb-5 text-sm leading-6 text-[#707585] sm:px-5">
                        {answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="relative isolate overflow-hidden bg-[#08162c] bg-cover bg-center px-5 py-16 text-white sm:px-6 sm:py-20 lg:px-10"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(7, 19, 38, 0.96), rgba(7, 19, 38, 0.78)), url("${financeBackground}")`,
        }}
      >
        <div className="mx-auto flex max-w-[1320px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e4c578]">
              Get Started Today
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              Ready to <span className="text-[#e4c578]">finance</span> your next vehicle?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Let our team help you understand your finance options and get an estimated EMI.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:min-w-[220px]">
            <button
              type="button"
              onClick={() => scrollTo("emi-calculator")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#f3d588] to-[#d9b952] px-5 py-3 text-sm font-bold text-[#0b1a33] transition-all duration-200 hover:shadow-[0_10px_20px_-10px_rgba(189,151,73,0.4)]"
            >
              Calculate EMI
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollTo("finance-assistance")}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#e4c578] hover:bg-white/5 hover:text-[#e4c578]"
            >
              Talk to Finance Team
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
  HERO CONTENT
========================================================= */

function HeroContent() {
  return (
    <div>
      <p className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#a47d32]">
        Finance Partners
        <span className="h-px w-12 bg-[#c9a85c]" aria-hidden="true" />
      </p>
      <h1 className="mt-4 font-serif text-[2.75rem] font-bold leading-[1.05] tracking-tight text-[#0b1a33] sm:text-6xl lg:text-5xl xl:text-[3.75rem]">
        Vehicle Finance
        <span className="block text-[#c29b45]">Made Simple</span>
      </h1>
      <p className="mt-5 max-w-md text-sm leading-6 text-[#4f576a] sm:text-base sm:leading-7">
        We can help you explore suitable financing options through our finance partners, subject to lender eligibility and approval.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-2 sm:flex sm:flex-nowrap sm:items-center sm:gap-0">
        <HeroStat icon={Users} title={partnerCountLabel} label="Finance Partners" />
        <HeroStat icon={FileText} title="Flexible" label="Options" divider />
        <HeroStat icon={Truck} title="Commercial" label="Vehicle Finance" divider />
      </div>
    </div>
  );
}

/* =========================================================
  HERO STAT
========================================================= */

function HeroStat({
  icon: Icon,
  title,
  label,
  divider = false,
}: {
  icon: typeof Users;
  title: string;
  label: string;
  divider?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3 ${
        divider ? "sm:ml-5 sm:border-l sm:border-[#ddd5c3] sm:pl-5 xl:ml-6 xl:pl-6" : ""
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3ecdc] text-[#8e6c2e] sm:h-11 sm:w-11 xl:h-12 xl:w-12">
        <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div className="min-w-0 sm:whitespace-nowrap">
        <p className="font-serif text-base font-bold leading-tight text-[#0b1a33] sm:text-lg xl:text-xl">
          {title}
        </p>
        <p className="text-[11px] leading-4 text-[#5f6677] sm:text-[13px] xl:text-sm">
          {label}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
  PARTNER CARD
========================================================= */

function PartnerCard({ partner }: { partner: FinancePartner }) {
  const { name, type, logo } = partner;
  return (
    <article className="relative flex min-h-[100px] items-center gap-3 overflow-hidden rounded-2xl border border-[#ebe5d8] bg-white p-4 shadow-[0_6px_20px_-18px_rgba(11,26,51,0.5)] transition-all duration-300 hover:shadow-[0_12px_30px_-18px_rgba(11,26,51,0.4)] sm:min-h-[108px] sm:gap-4 sm:p-5">
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_62%,rgba(236,214,160,0.4)_100%)]" />
      <div className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white sm:h-[72px] sm:w-28">
        {logo ? (
          <img src={logo} alt={`${name} logo`} loading="lazy" className="h-full w-full object-contain" />
        ) : (
          <span className="font-serif text-xl font-bold text-[#a47d32]">
            {name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="relative min-w-0 flex-1">
        <h3 className="font-serif text-[15px] font-bold leading-tight text-[#0b1a33] sm:text-base">
          {name}
        </h3>
        <p className="mt-1 text-xs leading-4 text-[#737888] sm:text-[13px] sm:leading-5">
          {type}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
  CALCULATOR FIELD
========================================================= */

function CalculatorField({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  className,
  step = "1",
  hint,
  error = false,
  labelAction,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  prefix?: ReactNode;
  suffix?: string;
  className: string;
  step?: string;
  hint?: string;
  error?: boolean;
  labelAction?: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex min-h-7 items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-[#172238]">{label}</span>
        {labelAction}
      </span>
      <span className="relative block">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center">
            <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#f8f1e0] px-2 text-sm font-bold text-[#987432]">
              {prefix}
            </span>
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          step={step}
          min={0}
          aria-invalid={error}
          onChange={(event) => onChange(event.target.value)}
          className={`${className} ${prefix ? "pl-16" : ""} ${
            suffix ? "pr-20" : ""
          } placeholder:font-medium placeholder:text-[#a2a0a0]`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-medium text-[#858174]">
            {suffix}
          </span>
        )}
      </span>
      {hint && (
        <span
          className={`mt-2 block text-[11px] leading-4 ${
            error ? "font-semibold text-[#c0392b]" : "text-[#8a8778]"
          }`}
        >
          {hint}
        </span>
      )}
    </label>
  );
}

/* =========================================================
  SUMMARY ITEM (Premium Dashboard Look)
========================================================= */

function SummaryItem({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1 ${emphasized ? "col-span-2 mt-2 border-t border-white/10 pt-5" : ""}`}>
      <span className={`text-[11px] font-semibold uppercase tracking-wider ${emphasized ? "text-[#e4c578]" : "text-white/50"}`}>
        {label}
      </span>
      <span
        className={`text-right text-lg font-bold tabular-nums ${
          emphasized ? "text-[#e4c578]" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
  SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a47d32]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[#0b1a33] sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#707585] sm:text-base">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
  CHECKLIST CARD
========================================================= */

function ChecklistCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-[#e9e3d8] bg-[#fbfaf7] p-5 sm:p-6">
      <h3 className="font-serif text-lg font-semibold text-[#172238]">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-5 text-[#626a78]"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f0e7cf] text-[#92702e]">
              <Check size={12} strokeWidth={2.5} />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}