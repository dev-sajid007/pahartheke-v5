"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/api/categories";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import CategorySection from "./category-section";
import { getSection } from "@/lib/api/landing-page"; 

const DEFAULTS = {
  tagline: "BANGLADESH'S",
  subheading: "First & Only",
  mainHeading: "International Standard Abattoir",
  sectionButton: "Start Shopping Now",
};

export default function HeroSection() {
  const [heroData, setHeroData] = useState({
    ...DEFAULTS,
    bgVideo: "",
  });
  const [categories, setCategories] = useState([]);

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
  );

  useEffect(() => {
    getSection("home", "hero")
      .then((s) => {
        if (s) {
          setHeroData({
            tagline: s.title || DEFAULTS.tagline,
            subheading: s.subtitle || DEFAULTS.subheading,
            mainHeading: s.content || DEFAULTS.mainHeading,
            sectionButton: s.ctaText || DEFAULTS.sectionButton,
            bgVideo: s.heroImage || "",
          });
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const { tagline, subheading, mainHeading, sectionButton, bgVideo } = heroData;

  return (
    <section className="relative overflow-hidden">
      {/* Mobile height further reduced to ensure categories are visible without scrolling */}
      <div className="relative h-[52dvh] min-h-[52vh] md:h-[calc(100dvh-4rem)] md:min-h-[calc(100vh-4rem)] w-full">
        {/* Background Video Layer */}
        <div className="absolute inset-0 overflow-hidden">
          {bgVideo && (
            <video
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              src={bgVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          )}
        </div>

        {/* Deep Forest/Emerald Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-emerald-950/60 to-slate-950/70" />

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
          <div className="max-w-4xl space-y-1.5 md:space-y-4">
            <h2 style={{ color: "#76B432" }} className="text-base md:text-3xl font-extrabold uppercase tracking-widest drop-shadow-sm">
              {tagline}
            </h2>
            <p style={{ color: "#8C9093" }} className="text-xs md:text-lg font-semibold italic">
              {subheading}
            </p>
            <h1 style={{ color: "#8C9093" }} className="text-lg md:text-5xl font-extrabold uppercase tracking-wide drop-shadow-md">
              {mainHeading}
            </h1>
            <div className="pt-2 md:pt-3">
              <Link href="/">
                <Button style={{ backgroundColor: "#76B432" }} className="h-9 md:h-11 rounded-md hover:opacity-90 text-slate-100 border border-slate-300/35 px-6 md:px-8 text-xs md:text-sm font-extrabold uppercase tracking-wide transition-all shadow-xl cursor-pointer">
                  {sectionButton}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* import categories */}
      <CategorySection />
    </section>
  );
}