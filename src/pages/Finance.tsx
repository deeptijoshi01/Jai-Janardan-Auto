import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  HandCoins,
  ShieldCheck,
  Truck,
  Wallet,
  Building2,
  Landmark,
} from "lucide-react";

import truckImage from "../assets/VehicleTypes/Truck.png";
import financeBackground from "../assets/why_to_choose/finance.png";

/* =========================================================
   FINANCE PROCESS
========================================================= */

const processSteps = [
  {
    number: "01",
    title: "Choose Your Vehicle",
    description:
      "Browse our available commercial vehicles and select the right one.",
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
    description:
      "Our team helps coordinate the required documentation.",
    icon: FileCheck2,
  },
  {
    number: "04",
    title: "Approval & Purchase",
    description:
      "Once approved, complete the purchase and take delivery of your vehicle.",
    icon: CheckCircle2,
  },
];

/* =========================================================
   FINANCE OPTIONS
========================================================= */

const financeOptions = [
  {
    title: "Commercial Vehicle Finance",
    description:
      "Financing support for trucks, pickups, tippers and other commercial vehicles.",
    icon: Truck,
  },
  {
    title: "Used Vehicle Finance",
    description:
      "Financing assistance for eligible pre-owned commercial vehicles.",
    icon: HandCoins,
  },
  {
    title: "Flexible Repayment Options",
    description:
      "Choose a suitable loan amount and tenure based on your eligibility.",
    icon: Wallet,
  },
];

/* =========================================================
   FINANCE PARTNERS
========================================================= */

const financePartners = [
  {
    name: "Tata Capital",
    type: "Vehicle & Commercial Finance",
  },
  {
    name: "BlackBuck",
    type: "Commercial Vehicle Finance",
  },
  {
    name: "Muthoot Finance",
    type: "Vehicle Finance",
  },
  {
    name: "Kotak Finance",
    type: "Vehicle Finance",
  },
  {
    name: "Chola Finance",
    type: "Commercial Vehicle Finance",
  },
  {
    name: "AU Finance",
    type: "Vehicle Finance",
  },
  {
    name: "Tiger Finance",
    type: "Vehicle Finance",
  },
  {
    name: "Vastu Finance",
    type: "Vehicle Finance",
  },
  {
    name: "SK Finance",
    type: "Commercial Vehicle Finance",
  },
  {
    name: "Shriram Finance",
    type: "Commercial Vehicle Finance",
  },
  {
    name: "Dugar Finance",
    type: "Vehicle Finance",
  },
  {
    name: "IDFC FIRST Bank",
    type: "Vehicle Finance",
  },
  {
    name: "Equitas Small Finance Bank",
    type: "Vehicle Finance",
  },
  {
    name: "HDB Financial Services",
    type: "Vehicle Finance",
  },
];

/* =========================================================
   ELIGIBILITY
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
  {
    title: "Simple Process",
    description:
      "Less paperwork confusion with guided assistance.",
    icon: CheckCircle2,
  },
  {
    title: "Transparent Information",
    description:
      "Clear vehicle pricing and finance estimates.",
    icon: ShieldCheck,
  },
  {
    title: "Vehicle-Focused Assistance",
    description:
      "Support specifically for commercial vehicle purchases.",
    icon: Truck,
  },
  {
    title: "Faster Coordination",
    description:
      "One point of contact throughout the finance process.",
    icon: BriefcaseBusiness,
  },
];

/* =========================================================
   FAQ
========================================================= */

const faqs = [
  {
    question: "Can I finance a used commercial vehicle?",
    answer:
      "Finance may be available for eligible pre-owned commercial vehicles. Vehicle age, condition, lender criteria and your applicant profile can affect eligibility.",
  },
  {
    question: "How much down payment is required?",
    answer:
      "The required down payment varies by vehicle, lender and applicant profile. Use the calculator above to explore an estimate with different down-payment amounts.",
  },
  {
    question: "What documents are required?",
    answer:
      "Common documents include identity and address proof, bank statements, income or business details, and vehicle documents. Exact requirements may vary.",
  },
  {
    question: "Can I calculate my EMI before selecting a vehicle?",
    answer:
      "Yes. The calculator provides an illustrative estimate using the vehicle price, down payment, annual interest rate and loan tenure you enter.",
  },
  {
    question: "How long does finance approval take?",
    answer:
      "Processing time depends on the lender, document verification and applicant profile. A specific timeline can only be confirmed once a request is reviewed.",
  },
  {
    question: "Is finance available for all vehicles?",
    answer:
      "Availability depends on the vehicle and the lender's criteria. Eligibility is assessed by the lender for each vehicle and applicant.",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Finance() {
  /*
   * IMPORTANT:
   * Keep calculator inputs empty initially.
   * No real/default values are shown to the user.
   */

  const [vehiclePrice, setVehiclePrice] =
    useState<string>("");

  const [downPayment, setDownPayment] =
    useState<string>("");

  const [interestRate, setInterestRate] =
    useState<string>("");

  const [tenure, setTenure] =
    useState<string>("");

  const [openFaq, setOpenFaq] =
    useState<number | null>(null);

  /* =======================================================
     NUMERIC VALUES FOR CALCULATION
  ======================================================= */

  const price = Number(vehiclePrice) || 0;
  const down = Number(downPayment) || 0;
  const rate = Number(interestRate) || 0;
  const months = Number(tenure) || 0;

  const principal = Math.max(
    0,
    price - down
  );

  const monthlyRate =
    rate / 100 / 12;

  const monthlyEmi =
    principal <= 0 || months <= 0
      ? 0
      : monthlyRate === 0
        ? principal / months
        : (principal *
            monthlyRate *
            (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1);

  const totalPayable =
    monthlyEmi * months;

  const totalInterest = Math.max(
    0,
    totalPayable - principal
  );

  /* =======================================================
     FORMAT CURRENCY
  ======================================================= */

  const currency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(
      Number.isFinite(amount) ? amount : 0
    );

  /* =======================================================
     INPUT HELPERS
  ======================================================= */

  const updateVehiclePrice = (
    value: string
  ) => {
    if (value === "") {
      setVehiclePrice("");
      return;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    setVehiclePrice(value);

    if (
      downPayment !== "" &&
      Number(downPayment) > numericValue
    ) {
      setDownPayment(value);
    }
  };

  const updateDownPayment = (
    value: string
  ) => {
    if (value === "") {
      setDownPayment("");
      return;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    if (
      price > 0 &&
      numericValue > price
    ) {
      setDownPayment(vehiclePrice);
      return;
    }

    setDownPayment(value);
  };

  const updateInterestRate = (
    value: string
  ) => {
    if (value === "") {
      setInterestRate("");
      return;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    if (numericValue > 30) {
      setInterestRate("30");
      return;
    }

    setInterestRate(value);
  };

  const updateTenure = (
    value: string
  ) => {
    if (value === "") {
      setTenure("");
      return;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    if (numericValue > 84) {
      setTenure("84");
      return;
    }

    setTenure(value);
  };

  /* =======================================================
     SCROLL
  ======================================================= */

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  /* =======================================================
     INPUT CLASS
  ======================================================= */

  const inputClass =
    "h-12 w-full rounded-lg border border-[#ddd7ca] bg-white px-4 text-sm font-semibold text-[#172238] outline-none transition focus:border-[#bd9749] focus:ring-4 focus:ring-[#bd9749]/10 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  return (
    <main className="overflow-x-hidden bg-[#fbfaf7] pb-16 text-[#172238]">

      {/* ===================================================
          EMI CALCULATOR
      =================================================== */}

      <section
        id="emi-calculator"
        className="scroll-mt-24 px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:px-10"
      >

        <div className="mx-auto max-w-[1320px]">

          {/* ================= HEADING ================= */}

          <div className="mb-7 max-w-2xl">

            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#a47d32]">
              Plan Smart
            </p>

            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#0b1a33] sm:text-4xl lg:text-[2.8rem]">
              Estimate Your EMI
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6c7280] sm:text-base sm:leading-7">
              Get an approximate EMI for your commercial vehicle.
              Adjust the values to find a plan that suits your
              business needs.
            </p>

          </div>

          {/* =================================================
              CALCULATOR
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-[#e5dfd3] bg-white shadow-[0_20px_60px_-35px_rgba(11,26,51,0.28)]">

            <div className="grid lg:grid-cols-[1fr_1.08fr]">

              {/* =================================================
                  LEFT INPUT PANEL
              ================================================= */}

              <div className="p-5 sm:p-8 lg:p-9">

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* VEHICLE PRICE */}

                  <CalculatorField
                    label="Vehicle Price"
                    value={vehiclePrice}
                    onChange={updateVehiclePrice}
                    placeholder="Enter vehicle price"
                    className={inputClass}
                    prefix="₹"
                  />

                  {/* DOWN PAYMENT */}

                  <CalculatorField
                    label="Down Payment"
                    value={downPayment}
                    onChange={updateDownPayment}
                    placeholder="Enter down payment"
                    className={inputClass}
                    prefix="₹"
                  />

                  {/* INTEREST */}

                  <CalculatorField
                    label="Interest Rate (Per Annum)"
                    value={interestRate}
                    onChange={updateInterestRate}
                    placeholder="Enter interest rate"
                    className={inputClass}
                    prefix="%"
                    suffix="%"
                    step="0.1"
                  />

                  {/* TENURE */}

                  <CalculatorField
                    label="Loan Tenure"
                    value={tenure}
                    onChange={updateTenure}
                    placeholder="Enter loan tenure"
                    className={inputClass}
                    prefix="▣"
                    suffix="Months"
                  />

                </div>

                {/* SMALL NOTE — NO EXTRA EMPTY SPACE */}

                <div className="mt-6 border-t border-[#eee9df] pt-4">

                  <p className="text-xs leading-5 text-[#858174]">
                    This is an illustrative estimate only.
                    Actual rates, eligibility, tenure, charges
                    and approval depend on the lender and
                    applicant profile.
                  </p>

                </div>

              </div>

              {/* =================================================
                  RIGHT EMI RESULT
              ================================================= */}

              <div className="relative overflow-hidden bg-[#f5efe2] p-5 sm:p-8 lg:p-9">

                <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.6)_30%,rgba(255,255,255,0.6)_55%,transparent_55%)] opacity-60" />

                <div className="relative z-10">

                  <div className="flex items-center gap-2 text-[#9b762f]">

                    <Gauge
                      size={17}
                      aria-hidden="true"
                    />

                    <p className="text-xs font-bold uppercase tracking-[0.14em]">
                      Your Estimated EMI
                    </p>

                  </div>

                  <p className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#0b1a33] sm:text-4xl">

                    {currency(monthlyEmi)}

                    <span className="ml-2 font-sans text-sm font-medium text-[#697080]">
                      / month
                    </span>

                  </p>

                  {/* SUMMARY */}

                  <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 border-y border-[#ded5c5] py-5 text-sm">

                    <SummaryRow
                      label="Vehicle Price"
                      value={
                        price > 0
                          ? currency(price)
                          : "—"
                      }
                    />

                    <SummaryRow
                      label="Down Payment"
                      value={
                        down > 0
                          ? currency(down)
                          : "—"
                      }
                    />

                    <SummaryRow
                      label="Loan Amount"
                      value={
                        principal > 0
                          ? currency(principal)
                          : "—"
                      }
                    />

                    <SummaryRow
                      label="Total Interest"
                      value={
                        totalInterest > 0
                          ? currency(totalInterest)
                          : "—"
                      }
                    />

                    <SummaryRow
                      label="Total Payable"
                      value={
                        totalPayable > 0
                          ? currency(totalPayable)
                          : "—"
                      }
                      emphasized
                    />

                  </div>

                  {/* TRUCK IMAGE */}

                  <div className="mt-5 overflow-hidden rounded-xl border border-[#e1d8c8] bg-white/80 p-3">

                    <img
                      src={truckImage}
                      alt="Commercial truck"
                      className="h-36 w-full object-contain sm:h-44"
                    />

                  </div>

                  {/* CTA */}

                  <button
                    type="button"
                    onClick={() =>
                      scrollTo(
                        "finance-assistance"
                      )
                    }
                    className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#e1bb5b] px-5 py-3 text-sm font-bold text-[#14203a] transition hover:bg-[#edcf7d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14203a]"
                  >
                    Get Finance Assistance

                    <ArrowRight size={16} />

                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* ================= ASSISTANCE ================= */}

          <div
            id="finance-assistance"
            className="mt-4 scroll-mt-28 rounded-xl border border-[#e8e0ce] bg-[#f5f0e5] px-5 py-4 sm:px-6"
          >

            <p className="text-sm font-semibold text-[#172238]">
              Need help understanding your estimate?
            </p>

            <p className="mt-1 text-sm leading-6 text-[#6c7280]">
              Keep your vehicle price, down payment and
              estimated EMI handy when discussing finance
              options with our team.
            </p>

          </div>

        </div>

      </section>

      {/* ===================================================
          HOW IT WORKS
      =================================================== */}

      <section className="border-y border-[#eee8dc] bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-10">

        <div className="mx-auto max-w-[1320px]">

          <SectionHeading
            eyebrow="How It Works"
            title="How Vehicle Finance Works"
            description="A simple and transparent process to get you on the road."
          />

          <div className="relative mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

            {processSteps.map(
              ({
                number,
                title,
                description,
                icon: Icon,
              }, index) => (

                <div
                  key={number}
                  className="relative flex gap-4 lg:block"
                >

                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#ddc98f] bg-[#fbf7ed] text-[#9b762f] lg:h-14 lg:w-14">

                    <Icon
                      size={22}
                      strokeWidth={1.7}
                    />

                  </span>

                  {index <
                    processSteps.length - 1 && (
                    <ArrowRight
                      size={19}
                      className="absolute right-2 top-4 hidden text-[#c5a35b] lg:block"
                    />
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
              )
            )}

          </div>

        </div>

      </section>

      {/* ===================================================
          FINANCE OPTIONS
      =================================================== */}

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-10">

        <div className="mx-auto max-w-[1320px]">

          <SectionHeading
            eyebrow="Finance Options"
            title="Flexible Finance Solutions"
            description="Choose the right finance option based on your business needs."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">

            {financeOptions.map(
              ({
                title,
                description,
                icon: Icon,
              }) => (

                <article
                  key={title}
                  className="flex gap-4 rounded-xl border border-[#e9e3d8] bg-white p-5 shadow-[0_8px_24px_-22px_rgba(11,26,51,0.45)] sm:p-6"
                >

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f7f2e7] text-[#9c7834]">

                    <Icon
                      size={21}
                      strokeWidth={1.7}
                    />

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
              )
            )}

          </div>

        </div>

      </section>

      {/* ===================================================
          FINANCE PARTNERS
      =================================================== */}

      <section
        id="finance-partners"
        className="border-y border-[#eee8dc] bg-[#f8f5ee] px-4 py-14 sm:px-6 sm:py-16 lg:px-10"
      >

        <div className="mx-auto max-w-[1320px]">

          <SectionHeading
            eyebrow="Finance Partners"
            title="Our Finance Network"
            description="We can help you explore suitable financing options through our finance partners, subject to lender eligibility and approval."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {financePartners.map(
              ({ name, type }) => (

                <article
                  key={name}
                  className="group rounded-xl border border-[#e6dfd1] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d5b66c] hover:shadow-[0_15px_35px_-25px_rgba(11,26,51,0.45)]"
                >

                  <div className="flex items-start gap-4">

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#eadfca] bg-[#faf6eb] text-[#a47d32]">

                      {name.includes("Bank") ? (
                        <Landmark
                          size={20}
                          strokeWidth={1.7}
                        />
                      ) : (
                        <Building2
                          size={20}
                          strokeWidth={1.7}
                        />
                      )}

                    </span>

                    <div className="min-w-0">

                      <h3 className="font-serif text-[17px] font-semibold text-[#0b1a33]">
                        {name}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#737888]">
                        {type}
                      </p>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>

          <p className="mt-6 text-center text-xs leading-5 text-[#858174]">
            Finance availability, interest rates, loan amount,
            tenure and approval are subject to the respective
            lender's terms, policies and applicant eligibility.
          </p>

        </div>

      </section>

      {/* ===================================================
          ELIGIBILITY + WHY US
      =================================================== */}

      <section className="border-y border-[#eee8dc] bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-10">

        <div className="mx-auto grid max-w-[1320px] gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">

          <div>

            <SectionHeading
              eyebrow="Eligibility & Documents"
              title="Basic Eligibility and Documents"
              description="Keep these documents ready to make your finance process smoother."
            />

            <div className="mt-7 grid gap-5 sm:grid-cols-2">

              <ChecklistCard
                title="Basic Eligibility"
                items={eligibilityItems}
              />

              <ChecklistCard
                title="Common Documents"
                items={documentItems}
              />

            </div>

            <p className="mt-4 rounded-lg bg-[#f7f4ed] px-4 py-3 text-xs leading-5 text-[#777466]">
              Exact requirements may vary depending on the
              lender and applicant profile.
            </p>

          </div>

          <div className="rounded-2xl border border-[#e9e3d8] bg-[#fbfaf7] p-5 sm:p-7">

            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#a47d32]">
              Why Finance With Us
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold text-[#0b1a33] sm:text-3xl">
              Why Finance With Us?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#707585]">
              A better financing experience for your business
              vehicles.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {financeBenefits.map(
                ({
                  title,
                  description,
                  icon: Icon,
                }) => (

                  <div
                    key={title}
                    className="flex gap-3"
                  >

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e2d3ac] bg-white text-[#987432]">

                      <Icon
                        size={17}
                        strokeWidth={1.7}
                      />

                    </span>

                    <div>

                      <h3 className="text-sm font-bold text-[#1b263d]">
                        {title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#737888]">
                        {description}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================
          FAQ
      =================================================== */}

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-10">

        <div className="mx-auto max-w-3xl">

          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title="FAQ"
            description="Here are some common questions about vehicle finance."
          />

          <div className="mt-7 divide-y divide-[#e9e3d8] border-y border-[#e9e3d8] bg-white">

            {faqs.map(
              ({ question, answer }, index) => {

                const isOpen =
                  openFaq === index;

                const answerId =
                  `finance-faq-answer-${index}`;

                return (
                  <div key={question}>

                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() =>
                        setOpenFaq(
                          isOpen ? null : index
                        )
                      }
                      className="flex min-h-16 w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-[#1b263d] transition hover:text-[#8e6c2e] sm:px-5"
                    >

                      {question}

                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-[#a47d32] transition-transform duration-200 ${
                          isOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                    </button>

                    <div
                      id={answerId}
                      className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
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
              }
            )}

          </div>

        </div>

      </section>

      {/* ===================================================
          FINAL CTA
      =================================================== */}

      <section
        className="relative isolate overflow-hidden bg-[#08162c] bg-cover bg-center px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-10"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(7, 19, 38, 0.96), rgba(7, 19, 38, 0.78)), url("${financeBackground}")`,
        }}
      >

        <div className="mx-auto flex max-w-[1320px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

          <div className="max-w-2xl">

            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e4c578]">
              Get Started Today
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">

              Ready to{" "}
              <span className="text-[#e4c578]">
                finance
              </span>{" "}
              your next vehicle?

            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Let our team help you understand your finance
              options and get an estimated EMI.
            </p>

          </div>

          <div className="flex flex-col gap-3 sm:min-w-[210px]">

            <button
              type="button"
              onClick={() =>
                scrollTo("emi-calculator")
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#dfbd68] px-5 py-3 text-sm font-bold text-[#14203a] transition hover:bg-[#edcf7d]"
            >
              Calculate EMI
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() =>
                scrollTo("finance-assistance")
              }
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#e4c578] hover:text-[#e4c578]"
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  prefix?: string;
  suffix?: string;
  className: string;
  step?: string;
}) {
  return (
    <label className="block min-w-0">

      <span className="mb-2 block text-xs font-semibold text-[#555d6c]">
        {label}
      </span>

      <span className="relative block">

        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center">

            <span className="flex h-8 min-w-8 items-center justify-center rounded-md bg-[#f8f2e6] px-2 text-sm font-bold text-[#987432]">
              {prefix}
            </span>

          </span>
        )}

        <input
          type="number"
          value={value}
          placeholder={placeholder}
          step={step}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`${className} ${
            prefix ? "pl-14" : ""
          } ${
            suffix ? "pr-20" : ""
          } placeholder:text-[#a2a0a0]`}
        />

        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-medium text-[#858174]">
            {suffix}
          </span>
        )}

      </span>

    </label>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <>
      <span
        className={
          emphasized
            ? "font-semibold text-[#172238]"
            : "text-[#707585]"
        }
      >
        {label}
      </span>

      <span
        className={`text-right tabular-nums ${
          emphasized
            ? "font-bold text-[#a47d32]"
            : "font-semibold text-[#172238]"
        }`}
      >
        {value}
      </span>
    </>
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
    <div className="rounded-xl border border-[#e9e3d8] bg-[#fbfaf7] p-4 sm:p-5">

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

              <Check
                size={12}
                strokeWidth={2.5}
              />

            </span>

            {item}

          </li>
        ))}

      </ul>

    </div>
  );
}