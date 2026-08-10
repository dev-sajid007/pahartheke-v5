"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Type,
  Video,
  MousePointerClick,
  Eye,
  Loader2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface HeroData {
  tagline: string;       // "BANGLADESH'S"  → stored as title
  subheading: string;    // "First & Only"  → stored as subtitle
  mainHeading: string;   // "International Standard Abattoir" → stored as content
  sectionButton: string; // CTA text        → stored as ctaText
  bgVideo: string;       // video URL       → stored as heroImage
}

const DEFAULT: HeroData = {
  tagline: "BANGLADESH'S",
  subheading: "First & Only",
  mainHeading: "International Standard Abattoir",
  sectionButton: "Start Shopping Now",
  bgVideo: "/videos/HeroSectionVideo.mp4",
};

// ─── Inline Video Uploader ───────────────────────────────────────────────────
function VideoUploader({
  currentUrl,
  onUpload,
}: {
  currentUrl: string;
  onUpload: (url: string) => void;
}) {
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
      if (json.success) {
        onUpload(json.data.url);
      } else {
        alert(json.message || "Upload failed");
      }
    } catch {
      alert("Upload failed. Is the backend running?");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={currentUrl}
          onChange={(e) => onUpload(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
          placeholder="Paste Cloudinary / CDN video URL"
        />
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm"
          onChange={handleFile}
          className="hidden"
          id="hero-video-upload"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg bg-purple-100 px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-200 disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Upload Video"}
        </button>
      </div>
      {currentUrl && (
        <p className="text-xs text-gray-400 truncate">
          Current:{" "}
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            {currentUrl.split("/").pop()}
          </a>
        </p>
      )}
    </div>
  );
}

// ─── Field Card ──────────────────────────────────────────────────────────────
function FieldCard({
  icon,
  iconColor,
  label,
  hint,
  children,
}: {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <label
        className={`flex items-center gap-2 text-sm font-semibold text-[#1a1a2e] mb-3`}
      >
        <span className={iconColor}>{icon}</span>
        {label}
      </label>
      {children}
      <p className="mt-2 text-xs text-gray-400">{hint}</p>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function HeroPage() {
  const [data, setData] = useState<HeroData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = useSaveToast();

  useEffect(() => {
    getSectionByType("home", "hero")
      .then((s) => {
        if (s) {
          setData({
            tagline: s.title || DEFAULT.tagline,
            subheading: s.subtitle || DEFAULT.subheading,
            mainHeading: s.content || DEFAULT.mainHeading,
            sectionButton: s.ctaText || DEFAULT.sectionButton,
            bgVideo: s.heroImage || DEFAULT.bgVideo,
          });
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await upsertSection("home", "hero", {
        title: data.tagline,
        subtitle: data.subheading,
        content: data.mainHeading,
        ctaText: data.sectionButton,
        heroImage: data.bgVideo,
      });
      showToast("success", "Hero section saved successfully!");
    } catch {
      showToast("error", "Failed to save. Check backend connection.");
    }
  };

  const set = (key: keyof HeroData) => (val: string) =>
    setData((d) => ({ ...d, [key]: val }));

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#fdc700] border-t-transparent" />
      </div>
    );

  return (
    <div className="max-w-2xl">
      {Toast}

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#1a1a2e] flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#1a1a2e] font-medium">Hero Section</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">Hero Section</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Controls the full-screen hero banner — text, video & CTA button.
          </p>
        </div>
        <SaveButton onSave={handleSave} />
      </div>

      <div className="space-y-5">
        {/* Tagline */}
        <FieldCard
          icon={<Type className="h-4 w-4" />}
          iconColor="text-emerald-500"
          label="Tagline (Top Line)"
          hint={`Displayed above the main heading. Example: "BANGLADESH'S"`}
        >
          <input
            type="text"
            value={data.tagline}
            onChange={(e) => set("tagline")(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            placeholder="e.g. BANGLADESH'S"
          />
        </FieldCard>

        {/* Subheading */}
        <FieldCard
          icon={<Type className="h-4 w-4" />}
          iconColor="text-blue-400"
          label="Subheading (Italic Line)"
          hint={`Italic line shown between tagline and main heading. Example: "First & Only"`}
        >
          <input
            type="text"
            value={data.subheading}
            onChange={(e) => set("subheading")(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            placeholder="e.g. First & Only"
          />
        </FieldCard>

        {/* Main Heading */}
        <FieldCard
          icon={<Type className="h-4 w-4" />}
          iconColor="text-indigo-500"
          label="Main Heading (H1)"
          hint="The large bold heading — the primary message of the hero banner."
        >
          <input
            type="text"
            value={data.mainHeading}
            onChange={(e) => set("mainHeading")(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            placeholder="e.g. International Standard Abattoir"
          />
        </FieldCard>

        {/* CTA Button */}
        <FieldCard
          icon={<MousePointerClick className="h-4 w-4" />}
          iconColor="text-yellow-500"
          label="CTA Button Text"
          hint="Text on the action button overlaid on the hero video."
        >
          <input
            type="text"
            value={data.sectionButton}
            onChange={(e) => set("sectionButton")(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            placeholder="e.g. Start Shopping Now"
          />
        </FieldCard>

        {/* Background Video */}
        <FieldCard
          icon={<Video className="h-4 w-4" />}
          iconColor="text-purple-500"
          label="Background Video"
          hint="Upload an MP4/WebM video or paste a Cloudinary URL. Max size: 10 MB."
        >
          <VideoUploader
            currentUrl={data.bgVideo}
            onUpload={set("bgVideo")}
          />
        </FieldCard>

        {/* Live Preview */}
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-4 w-4 text-gray-400" />
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Preview
            </p>
          </div>
          <div className="relative h-36 rounded-xl bg-gradient-to-t from-slate-950 via-emerald-950 to-slate-800 flex flex-col items-center justify-center gap-1 overflow-hidden px-4 text-center">
            <p className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest">
              {data.tagline || "—"}
            </p>
            <p className="text-slate-300 text-[10px] italic font-semibold">
              {data.subheading || "—"}
            </p>
            <p className="text-white text-xs font-extrabold uppercase tracking-wide leading-tight">
              {data.mainHeading || "—"}
            </p>
            <button className="mt-2 rounded-md bg-emerald-800 text-slate-100 border border-slate-300/30 px-4 py-1 text-[10px] font-extrabold uppercase tracking-wide">
              {data.sectionButton || "—"}
            </button>
          </div>
          {data.bgVideo && (
            <p className="mt-3 text-xs text-gray-400">
              Video:{" "}
              <code className="bg-gray-200 px-1 rounded text-[11px]">
                {data.bgVideo.length > 60
                  ? "…" + data.bgVideo.slice(-55)
                  : data.bgVideo}
              </code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
