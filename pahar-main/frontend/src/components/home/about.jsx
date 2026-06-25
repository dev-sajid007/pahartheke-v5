"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Beef,
  Truck,
  Store,
} from "lucide-react"
import { getSection } from "@/lib/api/landing-page";

const DEFAULT_STEPS = [
  { title: "Boning &\nFabrication", theme: "dark" },
  { title: "Distribution", theme: "yellow" },
  { title: "Retail\nStore", theme: "dark" },
  { title: "Processing", theme: "yellow" },
  { title: "Chilling", theme: "dark" },
  { title: "Sourcing", theme: "yellow" },
];

const icons = [
  <Beef className="h-12 w-12 text-white" strokeWidth={2.2} />,
  <Truck className="h-12 w-12 text-[#2f2f2f]" strokeWidth={2.2} />,
  <Store className="h-12 w-12 text-white" strokeWidth={2.2} />,
  <Truck className="h-12 w-12 text-[#2f2f2f]" strokeWidth={2.2} />,
  <Store className="h-12 w-12 text-white" strokeWidth={2.2} />,
  <div className="flex items-center gap-2 text-[#2f2f2f]">
    <Beef className="h-8 w-8" strokeWidth={2.2} />
    <Beef className="h-7 w-7" strokeWidth={2.2} />
  </div>,
];

function getVisibleSlides() {
  if (typeof window === "undefined") return 4
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2
  return 4
}

const VISIBLE_SLIDES = 4

export default function WhyBengalMeatSection() {
  const [heading, setHeading] = useState("কেন পাহাড় থেকে ? – আমাদের সম্পর্কে");
  const [description, setDescription] = useState(
    "পাহাড় থেকে একটি বিশ্বস্ত অনলাইন প্ল্যাটফর্ম, যা পার্বত্য অঞ্চলের প্রাকৃতিক ও নিরাপদ খাদ্যসামগ্রী সরাসরি গ্রাহকের কাছে পৌঁছে দেয়। আমরা স্থানীয় কৃষকদের সাথে কাজ করে তাজা ফল, মাছ, মাংস ও মসলা সংগ্রহ করি, যাতে আপনি পান খাঁটি ও নিরাপদ খাবার। আমাদের লক্ষ্য হলো টেকসই কৃষিকে উৎসাহ দেওয়া, পাহাড়ি দরিদ্র কৃষকদের সহায়তা করা এবং শহরের মানুষের কাছে প্রাকৃতিক ও স্বাস্থ্যকর খাদ্য পৌঁছে দেওয়া। আমরা প্রতিশ্রুতিবদ্ধ—গুণগত মান, সতেজতা এবং দ্রুত ডেলিভারির মাধ্যমে আপনাদের আস্থা অর্জন করতে।"
  );
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleSlides, setVisibleSlides] = useState(4)

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
    }).catch((err) => { console.error("About data fetch failed:", err); });
  }, []);

  useEffect(() => {
    const update = () => setVisibleSlides(getVisibleSlides())
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const maxIndex = useMemo(
    () => Math.max(0, steps.length - visibleSlides),
    [steps, visibleSlides]
  )

  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(0)
  }, [maxIndex, currentIndex])

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const translatePercent = visibleSlides > 0 ? 100 / visibleSlides : 100

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  useEffect(() => {
    if (maxIndex === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [maxIndex])

  return (
    <section className="bg-[#f1f1f1] bg-gradient-to-br from-green-400/25 via-transparent to-yellow-400/25 py-12">
      <div className="mx-auto max-w-[1180px] px-4">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold tracking-tight text-[#2c2c2c]">
            {heading}
          </h2>

          <p className="mx-auto mt-3 max-w-[1000px] text-[14px] sm:text-[15px] leading-7 sm:leading-8 text-[#2f2f2f]">
            {description}
          </p>
        </div>

        <div className="relative mt-12">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="Previous slide"
            className="absolute left-0 md:left-[-20px] top-1/2 z-10 flex -translate-y-1/2 items-center justify-center"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
                canGoPrev
                  ? "border-[#bdbdbd] bg-[#f1f1f1]/90 text-[#8a8a8a] hover:bg-white"
                  : "cursor-not-allowed border-[#d7d7d7] bg-[#f6f6f6]/80 text-[#c9c9c9]"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Next slide"
            className="absolute right-0 md:right-[-20px] top-1/2 z-10 flex -translate-y-1/2 items-center justify-center"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
                canGoNext
                  ? "border-[#bdbdbd] bg-[#f1f1f1]/90 text-[#8a8a8a] hover:bg-white"
                  : "cursor-not-allowed border-[#d7d7d7] bg-[#f6f6f6]/80 text-[#c9c9c9]"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </span>
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * translatePercent}%)`,
              }}
            >
              {steps.map((step, index) => {
                const isDark = step.theme === "dark"

                return (
                  <div
                    key={index}
                    className="w-full shrink-0 px-3 md:w-1/2 lg:w-1/4"
                  >
                    <div
                      className={`group relative h-[150px] overflow-hidden rounded-[2px] transition-transform duration-300 hover:-translate-y-1 ${
                        isDark ? "bg-[#343434]" : "bg-[#f4ca23]"
                      }`}
                    >
                      <div
                        className={`absolute bottom-0 left-0 h-[68px] w-[68px] rounded-tr-[68px] ${
                          isDark ? "bg-[#9c8220]" : "bg-[#e8be19]"
                        }`}
                      />
                      <div
                        className={`absolute bottom-0 left-0 h-[52px] w-[52px] rounded-tr-[52px] ${
                          isDark ? "bg-[#343434]" : "bg-[#f4ca23]"
                        }`}
                      />

                      <div className="absolute left-5 top-5 z-10">
                        <h3
                          className={`whitespace-pre-line text-[14px] font-semibold leading-4 ${
                            isDark ? "text-white" : "text-[#1f1f1f]"
                          }`}
                        >
                          {step.title}
                        </h3>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`flex h-[108px] w-[108px] items-center justify-center rounded-full border-2 transition-transform duration-300 group-hover:scale-105 ${
                            isDark ? "border-white" : "border-[#1f1f1f]"
                          }`}
                        >
                          <div
                            className={`flex h-[94px] w-[94px] items-center justify-center rounded-full border ${
                              isDark ? "border-white/80" : "border-[#1f1f1f]"
                            }`}
                          >
                            {icons[index % icons.length]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => {
              const active = index === currentIndex

              return (
                <button
                  key={index}
                  aria-label={`Go to slide group ${index + 1}`}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    active ? "w-6 bg-[#f4ca23]" : "w-2.5 bg-[#bfbfbf]"
                  }`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
