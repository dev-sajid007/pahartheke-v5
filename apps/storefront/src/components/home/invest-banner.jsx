"use client";

import { useEffect, useState } from "react";
import { Shield, TrendingUp, User, ArrowRight } from "lucide-react";
import { getSection } from "@/lib/api/landing-page";

const DEFAULTS = {
  sectionTag: "INVEST WITH US",
  sectionTitle: "Back Bangladesh's hill-tract farmers directly",
  sectionSubtitle:
    "Your capital funds cold-chain infrastructure and fair prices for the farming communities behind every order — with clear reporting on where it goes.",
  returnBadgeText: "12%+",
  returnBadgeLabel: "TARGET ANNUAL RETURN",
  minEntryText:
    "Minimum entry starts at ৳25,000. Full prospectus and risk disclosure available before you commit.",
  ctaButtonText: "View investment details",
  ctaButtonLink: "/invest",
  bgBanner: "",
  features: [
    {
      title: "Secure & audited",
      description:
        "Funds are held under regulated custody with independent, published audits.",
    },
    {
      title: "Transparent returns",
      description:
        "Track performance in real time from a dashboard, not a quarterly statement.",
    },
    {
      title: "Advisor-guided",
      description:
        "A dedicated advisor helps size your position to fit your goals and horizon.",
    },
  ],
};

const featureIcons = [
  <Shield key="1" className="h-6 w-6 text-slate-400" strokeWidth={1.8} />,
  <TrendingUp key="2" className="h-6 w-6 text-slate-400" strokeWidth={1.8} />,
  <User key="3" className="h-6 w-6 text-slate-400" strokeWidth={1.8} />,
];

export default function InvestSection() {
  const [data, setData] = useState(DEFAULTS);

  useEffect(() => {
    getSection("home", "newsletter")
      .then((s) => {
        if (s?.content) {
          try {
            const parsed = JSON.parse(s.content);
            setData({
              sectionTag: parsed.sectionTag || DEFAULTS.sectionTag,
              sectionTitle: parsed.sectionTitle || DEFAULTS.sectionTitle,
              sectionSubtitle: parsed.sectionSubtitle || DEFAULTS.sectionSubtitle,
              returnBadgeText: parsed.returnBadgeText || DEFAULTS.returnBadgeText,
              returnBadgeLabel: parsed.returnBadgeLabel || DEFAULTS.returnBadgeLabel,
              minEntryText: parsed.minEntryText || DEFAULTS.minEntryText,
              ctaButtonText: parsed.ctaButtonText || DEFAULTS.ctaButtonText,
              ctaButtonLink: parsed.ctaButtonLink || DEFAULTS.ctaButtonLink,
              bgBanner: parsed.bgBanner || s.bannerImage || DEFAULTS.bgBanner,
              features: parsed.features?.length ? parsed.features : DEFAULTS.features,
            });
          } catch { }
        }
      })
      .catch(() => { });
  }, []);

  const {
    sectionTag,
    sectionTitle,
    sectionSubtitle,
    returnBadgeText,
    returnBadgeLabel,
    minEntryText,
    ctaButtonText,
    ctaButtonLink,
    features,
  } = data;

  return (
    <section 
      style={{ backgroundColor: "#76B432" }}
      className="relative w-full overflow-hidden py-16 md:py-24 text-slate-300"
    >
      {/* Background Image Layer */}
      {data.bgBanner && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.bgBanner}
            alt="Invest background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#76B432]/90" />
        </div>
      )}

      {/* Background Subtle Overlay Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        {/* Top Header Layout: Left content + Right circular badge */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Left Text */}
          <div className="max-w-2xl">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.25em] text-slate-200">
              {sectionTag}
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl md:text-5xl md:leading-[1.18]">
              {sectionTitle}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
              {sectionSubtitle}
            </p>
          </div>

          {/* Right Annual Return Graphic */}
          <div className="relative flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-full border border-slate-300/40 bg-black/15 backdrop-blur-md shadow-2xl sm:h-44 sm:w-44">
            <div className="absolute inset-2 rounded-full border border-slate-300/20" />
            <div className="absolute inset-3 rounded-full border border-dashed border-slate-300/30" />

            <span className="font-serif text-3xl font-extrabold text-slate-100 sm:text-4xl">
              {returnBadgeText}
            </span>
            <span className="mt-1 px-3 text-center text-[9px] font-extrabold uppercase tracking-widest text-slate-200">
              {returnBadgeLabel}
            </span>
          </div>
        </div>

        {/* 3 Feature Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/20 bg-black/10 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-black/20"
            >
              <div className="mb-4">{featureIcons[i] || featureIcons[0]}</div>

              <h3 className="font-serif text-lg font-bold text-slate-100 sm:text-xl">
                {feature.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-slate-200 sm:text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Footer Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/20 pt-6 sm:flex-row">
          <p className="max-w-md text-center text-xs text-slate-200 sm:text-left">
            {minEntryText}
          </p>

          <a
            href={ctaButtonLink}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-slate-100 shadow-lg transition-all duration-200 hover:bg-black hover:scale-[1.02] hover:shadow-xl"
          >
            {ctaButtonText} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}