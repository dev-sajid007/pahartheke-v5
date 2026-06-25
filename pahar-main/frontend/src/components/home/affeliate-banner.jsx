"use client"

import { useEffect, useState } from "react"
import { LogIn, Share2, BadgeDollarSign } from "lucide-react"
import { getSection } from "@/lib/api/landing-page";

const DEFAULTS = {
  SectionBgBanner: "images/frontand/TheamImage.jpg",
  SectionTitle: "EARN MONEY WITH US",
  ctaButtonText: "Register Now",
  steps: [
    { title: "SIGN UP", description: "Create your free affiliate account in minutes." },
    { title: "SHARE YOUR LINK", description: "Promote our mountin products using your unique referral link." },
    { title: "EARN COMMISSIONS", description: "Get paid for every successful referral." },
  ],
};

const stepIcons = [
  <LogIn className="mb-3 h-11 w-11 text-white" strokeWidth={2.2} />,
  <Share2 className="mb-3 h-10 w-10 text-white" strokeWidth={2.2} />,
  <BadgeDollarSign className="mb-3 h-11 w-11 text-white" strokeWidth={2.2} />,
];

export default function EarnMoneySection() {
  const [data, setData] = useState(DEFAULTS);

  useEffect(() => {
    getSection("home", "promo_banner").then((s) => {
      if (s?.content) {
        try {
          const parsed = JSON.parse(s.content);
          setData({
            SectionBgBanner: parsed.bgBanner || DEFAULTS.SectionBgBanner,
            SectionTitle: parsed.sectionTitle || DEFAULTS.SectionTitle,
            ctaButtonText: parsed.ctaButtonText || DEFAULTS.ctaButtonText,
            steps: parsed.steps?.length ? parsed.steps : DEFAULTS.steps,
          });
        } catch {}
      }
    }).catch((err) => { console.error("Affiliate data fetch failed:", err); });
  }, []);

  const { SectionBgBanner, SectionTitle, ctaButtonText, steps } = data;

  return (
    <section className="w-full">
      <div className="flex h-[50px] items-center justify-center bg-white">
        <h2 className="text-[13px] sm:text-[15px] font-bold uppercase tracking-tight text-[#0f172a]">
          {SectionTitle}
        </h2>
      </div>

      <div
        className="relative h-[200px] sm:h-[240px] md:h-[282px] w-full overflow-hidden"
        style={{
          backgroundImage: `url('${SectionBgBanner}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1240px] flex-col items-center justify-center px-6 text-white">
          <div className="grid w-full grid-cols-1 gap-8 text-center md:grid-cols-3 md:gap-12">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                {stepIcons[i] || stepIcons[0]}
                <h3 className="text-[14px] font-extrabold uppercase leading-none tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[260px] text-[12px] leading-5 text-white/80">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <button className="mt-10 rounded-[3px] bg-[#22c55e] px-5 py-[9px] text-[13px] font-medium text-black transition hover:bg-[#1fb157]">
            {ctaButtonText}
          </button>
        </div>
      </div>
    </section>
  )
}
