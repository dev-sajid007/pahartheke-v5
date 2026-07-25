"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Star } from "lucide-react";
import Link from "next/link";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";

interface Review {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  review: string;
}

const DEFAULT_REVIEWS: Review[] = [
  { id: 1, name: "Sarah Ahmed", role: "Verified Customer", image: "https://i.pravatar.cc/100?img=32", rating: 5, review: "Absolutely amazing quality. The meat was fresh, neatly packed, and delivered on time. I am really impressed with the service." },
  { id: 2, name: "Tanvir Hasan", role: "Regular Buyer", image: "https://i.pravatar.cc/100?img=12", rating: 5, review: "Very good experience overall. Ordering process was simple and delivery was fast. The quality felt premium and trustworthy." },
  { id: 3, name: "Nusrat Jahan", role: "Verified Customer", image: "https://i.pravatar.cc/100?img=45", rating: 4, review: "Loved the freshness and packaging. Customer support was also responsive. I will definitely order again for my family." },
  { id: 4, name: "Mehedi Rahman", role: "Happy Customer", image: "https://i.pravatar.cc/100?img=15", rating: 5, review: "One of the best online meat delivery experiences I have had. Great value, clean cuts, and very professional handling." },
  { id: 5, name: "Farzana Islam", role: "Verified Customer", image: "https://i.pravatar.cc/100?img=25", rating: 5, review: "Fresh products, secure packaging, and on-time delivery. The whole experience felt reliable and premium from start to finish." },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = useSaveToast();

  useEffect(() => {
    getSectionByType("home", "testimonials")
      .then((s) => {
        if (s?.testimonials?.length) {
          setReviews(
            s.testimonials.map((t: { name: string; position: string; avatar: string; rating: number; content: string }, i: number) => ({
              id: i + 1,
              name: t.name || "",
              role: t.position || "",
              image: t.avatar || "",
              rating: t.rating || 5,
              review: t.content || "",
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await upsertSection("home", "testimonials", {
        title: "Customer Reviews",
        testimonials: reviews.map((r) => ({
          name: r.name,
          position: r.role,
          avatar: r.image,
          rating: r.rating,
          content: r.review,
        })),
      });
      showToast("success", "Reviews saved successfully!");
    } catch {
      showToast("error", "Failed to save. Check backend connection.");
    }
  };

  const updateReview = <K extends keyof Review>(id: number, field: K, value: Review[K]) => {
    setReviews((r) => r.map((rev) => (rev.id === id ? { ...rev, [field]: value } : rev)));
  };

  const addReview = () => {
    setReviews((r) => [
      ...r,
      {
        id: Date.now(),
        name: "New Customer",
        role: "Verified Customer",
        image: "https://i.pravatar.cc/100",
        rating: 5,
        review: "",
      },
    ]);
  };

  const removeReview = (id: number) => {
    setReviews((r) => r.filter((rev) => rev.id !== id));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#fdc700] border-t-transparent" />
      </div>
    );

  return (
    <div className="max-w-3xl">
      {Toast}

      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#1a1a2e] flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#1a1a2e] font-medium">Customer Reviews</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">Customer Reviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage testimonials displayed in the homepage reviews slider.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addReview}
            className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2a2a4e]"
          >
            <Plus className="h-4 w-4" /> Add Review
          </button>
          <SaveButton onSave={handleSave} />
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev, i) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {rev.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={rev.image}
                      alt={rev.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-[#fdc700]/30"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-400">
                      {rev.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">{rev.name || "—"}</p>
                  <p className="text-xs text-gray-400">{rev.role}</p>
                  <div className="mt-1 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateReview(rev.id, "rating", star)}
                        className="p-0"
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            star <= rev.rating
                              ? "fill-[#fdc700] text-[#fdc700]"
                              : "text-gray-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">#{i + 1}</span>
                <button
                  onClick={() => removeReview(rev.id)}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  value={rev.name}
                  onChange={(e) => updateReview(rev.id, "name", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Role / Label</label>
                <input
                  type="text"
                  value={rev.role}
                  onChange={(e) => updateReview(rev.id, "role", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                  placeholder="e.g. Verified Customer"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={rev.image}
                onChange={(e) => updateReview(rev.id, "image", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                placeholder="https://i.pravatar.cc/100?img=1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Review Text</label>
              <textarea
                value={rev.review}
                onChange={(e) => updateReview(rev.id, "review", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                placeholder="Write the customer review here..."
              />
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-400">
            No reviews yet. Click &ldquo;Add Review&rdquo; to get started.
          </div>
        )}
      </div>
    </div>
  );
}
