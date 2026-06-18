"use client";

import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const tractionStats = [
  { icon: "🏷️", value: "BDT 1150", label: "Average Basket Price" },
  { icon: "📦", value: "600+", label: "Orders Per Day" },
  { icon: "📈", value: "45%", label: "Growth Over The Years" },
  { icon: "👥", value: "210k+", label: "Unique Customers Served" },
  { icon: "🏪", value: "24", label: "Outlets" },
  { icon: "🛒", value: "200+", label: "SKU" },
];

const investmentPlans = [
  {
    title: "HONEY PROJECT",
    description: "Start from BDT 100,000 for 1 year at 10% – 15% profit",
    tag: "Short Term",
  },
  {
    title: "EID UL ADHA PROJECT",
    description: "Start from BDT 500,000 for 6 months at 3.5% – 4.5% profit",
    tag: "Seasonal",
  },
  {
    title: "TRADING PROJECT",
    description: "Start from BDT 100,000 for 6 months at 7.5% – 9% profit",
    tag: "Medium Term",
  },
  {
    title: "OUTLET PROJECT",
    description:
      "Invest for 3 years with minimum BDT 1,00,000. Approx. profit like bonus 15–18%",
    tag: "Long Term",
  },
  {
    title: "RETAIL DISTRIBUTION PROJECT",
    description:
      "Invest for 3 years with minimum ticket size BDT 3,00,000. Expected 15–20% profit per annum",
    tag: "Premium",
  },
];

const factStats = [
  { icon: "💰", value: "BDT 153.8 Million", label: "Investments Raised Over The Years" },
  { icon: "📊", value: "BDT 20.6 Million", label: "Profit Disbursed Over The Years" },
  { icon: "🔄", value: "BDT 122 Million", label: "Investment Repaid To Our Investors" },
  { icon: "🌾", value: "2000+ Farmers", label: "Benefited From Our Projects" },
  { icon: "🚜", value: "3618 Metric Tons", label: "Agri-produce Purchased" },
  { icon: "📈", value: "3–5x Growth", label: "Farmers Income" },
];

const whyPoints = [
  "Halal Investment – Ethical, Shariah-compliant opportunities",
  "Safe Food Market Leader – Strong consumer trust & demand",
  "High Growth Potential – Up to 20% ROI on selected investments",
  "Sustainable & Zero-Emission Agro Processing Hub – The future of food production",
];

// ─── Button helpers ───────────────────────────────────────────────────────────

function btnGreen(e) {
  e.currentTarget.style.background = "#1B5115";
  e.currentTarget.style.color = "#facc15";
}
function btnYellow(e) {
  e.currentTarget.style.background = "#facc15";
  e.currentTarget.style.color = "#1B5115";
}
function btnOutlineIn(e) {
  e.currentTarget.style.background = "#1B5115";
  e.currentTarget.style.color = "#fff";
}
function btnOutlineOut(e) {
  e.currentTarget.style.background = "transparent";
  e.currentTarget.style.color = "#1B5115";
}
function btnWhiteIn(e) {
  e.currentTarget.style.background = "#fff";
}
function btnWhiteOut(e) {
  e.currentTarget.style.background = "#facc15";
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f2d0c 0%, #1B5115 60%, #2d6e1f 100%)",
      }}
    >
      <div
        className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #a3e635 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #facc15 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div>
            <span className="inline-block bg-yellow-400 text-[#1B5115] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Halal Investment
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Why Invest in{" "}
              <span className="text-yellow-400">Khaas Food?</span>
            </h1>
            <ul className="space-y-3 mb-8">
              {whyPoints.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-green-100 text-sm md:text-base"
                >
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-[#1B5115]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <button
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-200"
              style={{
                background: "#1B5115",
                color: "#facc15",
                border: "2px solid #facc15",
              }}
              onMouseEnter={btnYellow}
              onMouseLeave={btnGreen}
            >
              Express Interest To Invest
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          {/* Right card */}
          <div className="hidden md:block">
            <div className="relative rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-8">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🌿</div>
                <p className="text-xl font-semibold text-yellow-400 mb-2">
                  Shariah-Compliant
                </p>
                <p className="text-green-200 text-sm">
                  Ethical investments powered by Bangladesh's leading safe food
                  brand
                </p>
                <div className="mt-6 flex justify-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">20%</div>
                    <div className="text-green-300">Max ROI</div>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">3–5x</div>
                    <div className="text-green-300">Farmer Growth</div>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">100%</div>
                    <div className="text-green-300">Halal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Traction ─────────────────────────────────────────────────────────────────

function TractionSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Traction
          </h2>
          <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {tractionStats.map((stat, i) => (
            <div
              key={i}
              className="group rounded-2xl border-2 border-gray-100 hover:border-yellow-400 p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div
                className="text-2xl md:text-3xl font-extrabold mb-1"
                style={{ color: "#1B5115" }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Investment Plans ─────────────────────────────────────────────────────────

function InvestmentPlansSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="py-16" style={{ background: "#f8faf8" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Choose Your Investment Plan
          </h2>
          <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full" />
        </div>

        <div className="space-y-4">
          {investmentPlans.map((plan, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border-2 bg-white p-6 transition-all duration-300 cursor-pointer"
              style={{
                borderColor: hoveredIdx === i ? "#1B5115" : "#e5e7eb",
                boxShadow:
                  hoveredIdx === i
                    ? "0 8px 32px rgba(27,81,21,0.10)"
                    : "none",
              }}
            >
              {/* Left */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg md:text-xl font-extrabold text-gray-900">
                    {plan.title}
                  </h3>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "#e8f5e2", color: "#1B5115" }}
                  >
                    {plan.tag}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              {/* Right – buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  className="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all duration-200"
                  style={{
                    borderColor: "#1B5115",
                    color: "#1B5115",
                    background: "transparent",
                  }}
                  onMouseEnter={btnOutlineIn}
                  onMouseLeave={btnOutlineOut}
                >
                  View Details
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                  style={{ background: "#1B5115", color: "#fff" }}
                  onMouseEnter={btnYellow}
                  onMouseLeave={btnGreen}
                >
                  I'm Interested to Invest
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Franchisee ───────────────────────────────────────────────────────────────

function FranchiseeSection() {
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f2d0c 0%, #1B5115 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <div className="text-5xl mb-4">🤝</div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          Become A Franchisee
        </h2>
        <p className="text-green-200 mb-8 text-base md:text-lg">
          Guide aspiring entrepreneurs & grow with Bangladesh's most trusted
          food brand.
        </p>
        <button
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200"
          style={{ background: "#facc15", color: "#1B5115" }}
          onMouseEnter={btnWhiteIn}
          onMouseLeave={btnWhiteOut}
        >
          Become a Franchisee
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

// ─── Fact Sheet ───────────────────────────────────────────────────────────────

function FactSheetSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Fact Sheet{" "}
            <span style={{ color: "#1B5115" }}>Regarding Investment</span>
          </h2>
          <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {factStats.map((stat, i) => (
            <div
              key={i}
              className="group rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-[#1B5115] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div
                className="text-xl md:text-2xl font-extrabold mb-1"
                style={{ color: "#1B5115" }}
              >
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-500 font-medium leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          className="mt-12 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ background: "#f0f9ee", border: "2px solid #c5e8bb" }}
        >
          <div>
            <p className="font-bold text-gray-900 text-lg">
              Ready to invest in Bangladesh's future of food?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Join 2000+ farmers and investors growing together.
            </p>
          </div>
          <button
            className="flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200"
            style={{ background: "#1B5115", color: "#facc15" }}
            onMouseEnter={btnYellow}
            onMouseLeave={btnGreen}
          >
            Start Investing Today →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function KhaasFoodInvestmentPage() {
  return (
    <main className="font-sans antialiased">
      <HeroSection />
      <TractionSection />
      <InvestmentPlansSection />
      <FranchiseeSection />
      <FactSheetSection />
    </main>
  );
}