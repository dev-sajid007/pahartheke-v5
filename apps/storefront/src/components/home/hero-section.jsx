"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CategorySection from "./category-section"
import { getSection } from "@/services/landing";

const DEFAULTS = {
  sectionButton: "Start Shopping Now",
  bgVideo: "/videos/HeroSectionVideo.mp4",
};

export default function HeroSection() {
  const [heroData, setHeroData] = useState(DEFAULTS);

  useEffect(() => {
    getSection("home", "hero").then((s) => {
      if (s) {
        setHeroData({
          sectionButton: s.ctaText || DEFAULTS.sectionButton,
          bgVideo: s.heroImage || DEFAULTS.bgVideo,
        });
      }
    }).catch((err) => { console.error("Hero data fetch failed:", err); });
  }, []);

  const { sectionButton, bgVideo } = heroData;

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[100dvh] w-full">
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src={bgVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <div className="max-w-4xl space-y-4 md:space-y-6">
            <div className="pt-2">
              <Link href="/">
                <Button className="h-12 rounded-md ThemeColor px-6 text-base font-semibold text-black hover:bg-yellow-300">
                  {sectionButton}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* import categories */}
      <CategorySection/>
    </section>
  )
}
