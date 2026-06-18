"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getSection } from "@/lib/api/landing-page";

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Verified Customer",
    image: "https://i.pravatar.cc/100?img=32",
    rating: 5,
    review:
      "Absolutely amazing quality. The meat was fresh, neatly packed, and delivered on time. I am really impressed with the service.",
  },
  {
    id: 2,
    name: "Tanvir Hasan",
    role: "Regular Buyer",
    image: "https://i.pravatar.cc/100?img=12",
    rating: 5,
    review:
      "Very good experience overall. Ordering process was simple and delivery was fast. The quality felt premium and trustworthy.",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Verified Customer",
    image: "https://i.pravatar.cc/100?img=45",
    rating: 4,
    review:
      "Loved the freshness and packaging. Customer support was also responsive. I will definitely order again for my family.",
  },
  {
    id: 4,
    name: "Mehedi Rahman",
    role: "Happy Customer",
    image: "https://i.pravatar.cc/100?img=15",
    rating: 5,
    review:
      "One of the best online meat delivery experiences I have had. Great value, clean cuts, and very professional handling.",
  },
  {
    id: 5,
    name: "Farzana Islam",
    role: "Verified Customer",
    image: "https://i.pravatar.cc/100?img=25",
    rating: 5,
    review:
      "Fresh products, secure packaging, and on-time delivery. The whole experience felt reliable and premium from start to finish.",
  },
];

export default function CustomerReviewSection() {
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    getSection("home", "testimonials").then((s) => {
      if (s?.testimonials?.length) {
        setReviews(
          s.testimonials.map((t, i) => ({
            id: i + 1,
            name: t.name || "",
            role: t.position || "",
            image: t.avatar || "",
            rating: t.rating || 5,
            review: t.content || "",
          }))
        );
      }
    }).catch(() => {});
  }, []);

  const visibleCards = 3
  const maxIndex = useMemo(
    () => Math.max(0, reviews.length - visibleCards),
    [reviews]
  )

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 3500)

    return () => clearInterval(timer)
  }, [maxIndex])

  return (
    <section className="bg-[#f5f5f5] py-14 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FDC700]">
            Testimonials
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-7xl">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="w-full shrink-0 px-3 md:w-1/2 lg:w-1/3"
                >
                  <Card className="h-full rounded-2xl border bg-white shadow-sm dark:border-border dark:bg-card">
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={review.image}
                          alt={review.name}
                          className="h-16 w-16 rounded-full object-cover ring-4 ring-[#FDC700]/20"
                        />

                        <div>
                          <h3 className="text-lg font-semibold text-[#222] dark:text-white">
                            {review.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {review.role}
                          </p>

                          <div className="mt-2 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${
                                  index < review.rating
                                    ? "fill-[#FDC700] text-[#FDC700]"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-6 flex-1">
                        <div className="absolute -top-3 left-0 text-5xl font-bold leading-none text-[#FDC700]/20">
                          &ldquo;
                        </div>
                        <p className="relative pt-4 text-sm leading-7 text-[#444] dark:text-gray-300">
                          {review.review}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            aria-label="Previous review"
            className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-[#222] shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 dark:border-border dark:bg-card dark:text-white lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex === maxIndex}
            aria-label="Next review"
            className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-[#222] shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 dark:border-border dark:bg-card dark:text-white lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-8 bg-[#FDC700]"
                    : "w-2.5 bg-gray-300 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
