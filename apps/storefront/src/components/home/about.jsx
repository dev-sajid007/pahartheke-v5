"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Sparkles,
  Leaf,
  ShieldCheck,
  Award,
  HeartHandshake,
  TrendingUp,
} from "lucide-react"
import { getSection } from "@/lib/api/landing-page";

const defaultIcons = [
  <Leaf className="h-12 w-12 text-white" strokeWidth={2.2} key="leaf" />,
  <ShieldCheck className="h-12 w-12 text-white" strokeWidth={2.2} key="shield" />,
  <Award className="h-12 w-12 text-white" strokeWidth={2.2} key="award" />,
  <HeartHandshake className="h-12 w-12 text-white" strokeWidth={2.2} key="heart" />,
  <Sparkles className="h-12 w-12 text-white" strokeWidth={2.2} key="sparkles" />,
  <TrendingUp className="h-12 w-12 text-white" strokeWidth={2.2} key="trending" />,
];

const VISIBLE_SLIDES = 4

export default function WhyUs() {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSection("home", "about").then((s) => {
      if (s) {
        if (s.content) {
          try {
            const parsed = JSON.parse(s.content);
            if (parsed.heading) setHeading(parsed.heading);
            if (parsed.description) setDescription(parsed.description);
            if (parsed.steps?.length) setSteps(parsed.steps);
          } catch {
            if (s.title) setHeading(s.title);
            if (s.subtitle) setDescription(s.subtitle);
          }
        } else {
          if (s.title) setHeading(s.title);
          if (s.subtitle) setDescription(s.subtitle);
        }
      }
    }).catch(() => { }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const maxIndex = useMemo(
    () => Math.max(0, steps.length - VISIBLE_SLIDES),
    [steps]
  )

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  useEffect(() => {
    if (maxIndex === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [maxIndex])

  if (isLoading) {
    return (
      <section className="bg-slate-100 bg-gradient-to-br from-[#7CB73A]/10 via-slate-50 to-slate-200 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-[400px]">
        <div className="mx-auto max-w-[1180px] px-4 animate-pulse">
          <div className="mx-auto max-w-[980px] text-center">
            <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mx-auto mb-4" />
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded w-full mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (!heading && !description && steps.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-100 bg-gradient-to-br from-[#7CB73A]/10 via-slate-50 to-slate-200 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[1180px] px-4">
        <div className="mx-auto max-w-[980px] text-center">
          {heading && (
            <h2 className="text-[32px] font-bold tracking-tight text-[#7CB73A] dark:text-[#7CB73A]">
              {heading}
            </h2>
          )}

          {description && (
            <p className="mx-auto mt-3 max-w-[1000px] text-[15px] leading-8 text-slate-700 dark:text-slate-300">
              {description}
            </p>
          )}
        </div>

        {steps.length > 0 && (
          <div className="relative mt-12">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              aria-label="Previous slide"
              className="absolute left-[-30px] top-1/2 z-10 flex -translate-y-1/2 items-center justify-center"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
                  canGoPrev
                    ? " bg-[#76B432] hover:bg-[#76B432] "
                    : "cursor-not-allowed border-slate-200 bg-slate-100/80 text-slate-400"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </span>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="Next slide"
              className="absolute right-[-30px] top-1/2 z-10 flex -translate-y-1/2 items-center justify-center"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
                  canGoNext
                    ? " bg-[#76B432] hover:bg-[#76B432] "
                    : "cursor-not-allowed border-slate-200 bg-slate-100/80 text-slate-400"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </span>
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 25}%)`,
                }}
              >
                {steps.map((step, index) => {
                  const isYellow = step.theme === "yellow";
                  const cardBg = isYellow ? "bg-[#7CB73A]" : "bg-[#8C9093]";
                  const accentBg1 = isYellow ? "bg-[#8C9093]/40" : "bg-[#7CB73A]/40";
                  const accentBg2 = isYellow ? "bg-[#7CB73A]" : "bg-[#8C9093]";

                  return (
                    <div
                      key={step.id || index}
                      className="w-full shrink-0 px-3 md:w-1/2 lg:w-1/4"
                    >
                      <div
                        className={`group relative h-[150px] overflow-hidden rounded-[4px] transition-transform duration-300 hover:-translate-y-1 ${cardBg}`}
                      >
                        {/* Decorative corner accent layers */}
                        <div
                          className={`absolute bottom-0 left-0 h-[68px] w-[68px] rounded-tr-[68px] ${accentBg1}`}
                        />
                        <div
                          className={`absolute bottom-0 left-0 h-[52px] w-[52px] rounded-tr-[52px] ${accentBg2}`}
                        />

                        {/* Title */}
                        <div className="absolute left-5 top-5 z-10">
                          <h3 className="whitespace-pre-line text-[14px] font-semibold leading-4 text-white">
                            {step.title}
                          </h3>
                        </div>

                        {/* Circle Icon Badge with Relevant Dynamic Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-[108px] w-[108px] items-center justify-center rounded-full border-2 transition-transform duration-300 group-hover:scale-105 border-white/40">
                            <div className="flex h-[94px] w-[94px] items-center justify-center rounded-full border border-white/60">
                              {defaultIcons[index % defaultIcons.length]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pagination Indicators */}
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => {
                const active = index === currentIndex

                return (
                  <button
                    key={`indicator-${index}`}
                    aria-label={`Go to slide group ${index + 1}`}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      active ? "w-6 bg-[#7CB73A]" : "w-2.5 bg-[#8C9093]"
                    }`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}