"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCategories } from "@/lib/api/categories";
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import CategorySection from "./category-section"
import { getSection } from "@/lib/api/landing-page";

const DEFAULTS = {
  sectionButton: "Start Shopping Now",
  bgVideo: "/videos/HeroSectionVideo.mp4",
};

export default function HeroSection() {
  const [heroData, setHeroData] = useState(DEFAULTS);
  const [categories, setCategories] = useState([])

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      dragFree: false,
    },
    [
      Autoplay({
        delay: 2000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  )

  useEffect(() => {
    getSection("home", "hero").then((s) => {
      if (s) {
        setHeroData({
          sectionButton: s.ctaText || DEFAULTS.sectionButton,
          bgVideo: s.heroImage || DEFAULTS.bgVideo,
        });
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories()
      setCategories(data)
    }

    fetchCategories()
  }, [])

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
            preload="auto"
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <div className="max-w-4xl space-y-4 md:space-y-6">
            <div className="pt-2">
              <Link href="/">
                <Button className="h-12 rounded-md TheamColor px-6 text-base font-semibold text-black hover:bg-yellow-300">
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
