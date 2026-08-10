"use client";

import { useEffect, useState } from "react";
import { Users, Share2, DollarSign, ArrowRight } from "lucide-react";
import { getSection } from "@/lib/api/landing-page";

const DEFAULTS = {
  sectionTag: "AFFILIATE PROGRAM",
  sectionTitle: "EARN",
  sectionSubtitle:
    "Three simple steps on the way to your first payout — no upfront cost, no inventory to hold.",
  ctaButtonText: "Register",
  ctaButtonLink: "/auth/register?role=affiliate",
  bgBanner: "",
  steps: [
    {
      step: "Step 1",
      title: "SIGN UP",
      description:
        "Create your free affiliate account in",
    },
    {
      step: "Step 2",
      title: "SHARE YOUR LINK",
      description:
        "Promote our mountain products using your unique referral",
    },
    {
      step: "Step 3",
      title: "EARN COMMISSIONS",
      description:
        "Get paid for every successful",
    },
  ],
};

const stepIcons = [
  <Users key="1" className="h-8 w-8 sm:h-9 sm:w-9 text-slate-400 dark:text-slate-400" strokeWidth={1.8} />,
  <Share2 key="2" className="h-8 w-8 sm:h-9 sm:w-9 text-slate-400 dark:text-slate-400" strokeWidth={1.8} />,
  <DollarSign key="3" className="h-8 w-8 sm:h-9 sm:w-9 text-slate-400 dark:text-slate-400" strokeWidth={1.8} />,
];

export default function EarnMoneySection() {
  const [data, setData] = useState(DEFAULTS);

  useEffect(() => {
    getSection("home", "promo_banner")
      .then((s) => {
        if (s?.content) {
          try {
            const parsed = JSON.parse(s.content);
            setData({
              sectionTag: parsed.sectionTag || DEFAULTS.sectionTag,
              sectionTitle: parsed.sectionTitle || DEFAULTS.sectionTitle,
              sectionSubtitle: parsed.sectionSubtitle || DEFAULTS.sectionSubtitle,
              ctaButtonText: parsed.ctaButtonText || DEFAULTS.ctaButtonText,
              ctaButtonLink: parsed.ctaButtonLink || DEFAULTS.ctaButtonLink,
              bgBanner: parsed.bgBanner || s.bannerImage || DEFAULTS.bgBanner,
              steps: parsed.steps?.length ? parsed.steps : DEFAULTS.steps,
            });
          } catch { }
        }
      })
      .catch(() => { });
  }, []);

  const { sectionTag, sectionTitle, sectionSubtitle, ctaButtonText, ctaButtonLink, steps } = data;

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 py-16 md:py-24 text-slate-900 dark:bg-[#0c1410] dark:text-slate-100">
      {/* Background Image Layer */}
      {data.bgBanner && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.bgBanner}
            alt="Affiliate background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-50/95 dark:bg-[#0c1410]/95" />
        </div>
      )}

      {/* Background Ripple Pattern */}
      <svg
        className="pointer-events-none absolute right-0 top-1/2 h-[700px] w-[700px] -translate-y-1/2 translate-x-1/4 text-emerald-900/5 dark:text-emerald-500/5 sm:h-[900px] sm:w-[900px]"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        <circle cx="500" cy="500" r="100" stroke="currentColor" strokeWidth="1" />
        <circle cx="500" cy="500" r="180" stroke="currentColor" strokeWidth="1" />
        <circle cx="500" cy="500" r="260" stroke="currentColor" strokeWidth="1" />
        <circle cx="500" cy="500" r="340" stroke="currentColor" strokeWidth="1" />
        <circle cx="500" cy="500" r="420" stroke="currentColor" strokeWidth="1" />
        <circle cx="500" cy="500" r="500" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Tag */}
        <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-400">
          {sectionTag}
        </span>

        {/* Heading */}
        <h2 
          style={{ color: "#76B432" }}
          className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        >
          {sectionTitle}
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 dark:text-slate-400 sm:text-base">
          {sectionSubtitle}
        </p>

        {/* Steps Container */}
        <div className="relative mt-14 md:mt-20">
          {/* Curved Dotted Connecting Line (Desktop) */}
          <svg
            className="pointer-events-none absolute left-[15%] top-10 hidden h-16 w-[70%] text-slate-400 dark:text-slate-600 md:block"
            viewBox="0 0 600 60"
            fill="none"
          >
            <path
              d="M 50 30 Q 300 55 550 30"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 6"
              fill="none"
            />
          </svg>

          {/* Grid of Steps */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((stepItem, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Step Circle & Pill */}
                <div className="relative mb-5 flex flex-col items-center">
                  {/* Step Pill */}
                  <span 
                    style={{ backgroundColor: "#76B432" }}
                    className="absolute -top-3.5 z-10 rounded-full px-3 py-0.5 text-[10px] font-extrabold text-white shadow-sm border border-slate-300/20"
                  >
                    {stepItem.step || `Step ${i + 1}`}
                  </span>

                  {/* Icon Circle */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-300 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900 sm:h-24 sm:w-24">
                    {stepIcons[i] || stepIcons[0]}
                  </div>
                </div>

                {/* Step Text */}
                <h3 
                  style={{ color: "#76B432" }}
                  className="font-serif text-lg font-bold sm:text-xl"
                >
                  {stepItem.title}
                </h3>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-400 dark:text-slate-400 sm:text-sm">
                  {stepItem.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 md:mt-16">
          <a
            href={ctaButtonLink}
            style={{ backgroundColor: "#76B432" }}
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-slate-100 shadow-lg border border-slate-300/20 transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:scale-[1.02]"
          >
            {ctaButtonText} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}