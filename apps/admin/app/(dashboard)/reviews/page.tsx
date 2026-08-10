"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Star, Upload, Loader2 } from "lucide-react";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";
import { PageHeader, Card, Field, TextInput, TextArea } from "@/components/ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

function AvatarUploader({ currentUrl, onUpload }: { currentUrl: string; onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const json = await res.json();
      if (json.success) onUpload(json.data.url);
      else alert(json.message || "Upload failed");
    } catch {
      alert("Upload failed. Is the backend running?");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentUrl} alt="avatar" className="h-14 w-14 rounded-full object-cover ring-2 ring-[#fdc700]/30" />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Upload className="h-5 w-5" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Uploading..." : currentUrl ? "Change Photo" : "Upload Photo"}
        </button>
        {currentUrl && (
          <button type="button" onClick={() => onUpload("")} className="text-left text-[10px] text-red-400 hover:text-red-600">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

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

  const buildPayload = (list: Review[]) => ({
    title: "Customer Reviews",
    testimonials: list.map((r) => ({
      name: r.name,
      position: r.role,
      avatar: r.image,
      rating: r.rating,
      content: r.review,
    })),
  });

  const handleSave = async () => {
    try {
      await upsertSection("home", "testimonials", buildPayload(reviews));
      showToast("success", "Reviews saved successfully!");
    } catch {
      showToast("error", "Failed to save. Check backend connection.");
    }
  };

  const updateReview = <K extends keyof Review>(id: number, field: K, value: Review[K]) => {
    setReviews((r) => r.map((rev) => (rev.id === id ? { ...rev, [field]: value } : rev)));
  };

  const addReview = () => {
    setReviews((r) => [...r, { id: Date.now(), name: "New Customer", role: "Verified Customer", image: "", rating: 5, review: "" }]);
  };

  const removeReview = async (id: number) => {
    const updated = reviews.filter((rev) => rev.id !== id);
    setReviews(updated);
    try {
      await upsertSection("home", "testimonials", buildPayload(updated));
      showToast("success", "Review deleted!");
    } catch {
      showToast("error", "Failed to delete. Check backend connection.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-[#fdc700]" />
      </div>
    );
  }

  return (
    <div>
      {Toast}
      <PageHeader
        title="Customer Reviews"
        description="Manage testimonials displayed in the homepage reviews slider."
        breadcrumb={[{ href: "/", label: "Dashboard" }, { href: "/reviews", label: "Customer Reviews" }]}
        actions={
          <>
            <button
              onClick={addReview}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1a1a2e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2a2a4e]"
            >
              <Plus className="h-4 w-4" /> Add Review
            </button>
            <SaveButton onSave={handleSave} />
          </>
        }
      />

      <div className="max-w-4xl space-y-4">
        {reviews.map((rev, i) => (
          <Card
            key={rev.id}
            title={
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">{rev.name || "—"}</p>
                  <p className="text-xs text-gray-400">{rev.role}</p>
                </div>
              </div>
            }
            actions={
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => updateReview(rev.id, "rating", star)} className="p-0.5">
                      <Star className={`h-3.5 w-3.5 ${star <= rev.rating ? "fill-[#fdc700] text-[#fdc700]" : "text-gray-200"}`} />
                    </button>
                  ))}
                </span>
                <span className="text-xs text-gray-400">#{i + 1}</span>
                <button onClick={() => removeReview(rev.id)} className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <Field label="Avatar Photo">
                <AvatarUploader currentUrl={rev.image} onUpload={(url) => updateReview(rev.id, "image", url)} />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <TextInput type="text" value={rev.name} onChange={(e) => updateReview(rev.id, "name", e.target.value)} />
                </Field>
                <Field label="Role / Label">
                  <TextInput type="text" value={rev.role} onChange={(e) => updateReview(rev.id, "role", e.target.value)} placeholder="e.g. Verified Customer" />
                </Field>
              </div>
              <Field label="Review Text">
                <TextArea value={rev.review} onChange={(e) => updateReview(rev.id, "review", e.target.value)} rows={3} placeholder="Write the customer review here..." />
              </Field>
            </div>
          </Card>
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
