"use client"

import { useEffect, useState } from "react"
import { Shield, Share2, Users } from "lucide-react"
import { getSection } from "@/services/landing";

const DEFAULTS = {
  SectionBgBanner: "images/frontand/TheamImage.jpg",
  SectionTitle: "Invest With Us",
  ButtonText: "View Details",
  features: [
    { title: "High Returns", description: "Earn competitive returns with minimal risk, tailored to your investment goals." },
    { title: "Secure & Trusted", description: "We prioritize your investment security with transparent strategies and full compliance." },
    { title: "Expert Guidance", description: "Our experienced financial advisors help you make smart, informed investment choices." },
  ],
};

const featureIcons = [
  <Shield className="mb-3 h-10 w-10 text-white" strokeWidth={2.2} />,
  <Share2 className="mb-3 h-10 w-10 text-white" strokeWidth={2.2} />,
  <Users className="mb-3 h-10 w-10 text-[#FDC700]" strokeWidth={2.2} />,
];

export default function InvestSection() {
  const [data, setData] = useState(DEFAULTS);

  useEffect(() => {
    getSection("home", "newsletter").then((s) => {
      if (s?.content) {
        try {
          const parsed = JSON.parse(s.content);
          setData({
            SectionBgBanner: parsed.bgBanner || DEFAULTS.SectionBgBanner,
            SectionTitle: parsed.sectionTitle || DEFAULTS.SectionTitle,
            ButtonText: parsed.ctaButtonText || DEFAULTS.ButtonText,
            features: parsed.features?.length ? parsed.features : DEFAULTS.features,
          });
        } catch (e) {
          console.error("Invest parse error:", e);
        }
      }
    }).catch((err) => { console.error("Invest data fetch failed:", err); });
  }, []);

  const { SectionBgBanner, SectionTitle, ButtonText, features } = data;

  return (
    <section className="w-full">
      <div className="flex h-[48px] items-center justify-center bg-white">
        <h2 className="text-[14px] sm:text-[16px] font-bold uppercase tracking-wide text-[#0f172a]">
          {SectionTitle}
        </h2>
      </div>

      <div
        className="relative h-[200px] sm:h-[240px] md:h-[280px] w-full"
        style={{
          backgroundImage: `url('${SectionBgBanner}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col items-center justify-center px-6 text-white">
          <div className="grid w-full grid-cols-1 gap-8 text-center md:grid-cols-3 md:gap-12">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col items-center">
                {featureIcons[i] || featureIcons[0]}
                <h3 className="text-[14px] font-bold uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-[260px] text-[12px] leading-5 text-white/80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <button className="mt-8 rounded-[3px] bg-[#22c55e] px-6 py-2 text-[13px] font-medium text-black transition hover:bg-[#16a34a]">
            {ButtonText}
          </button>
        </div>
      </div>
    </section>
  )
}
