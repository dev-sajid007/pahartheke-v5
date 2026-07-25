"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Image as ImageIcon, Video } from "lucide-react";
import Link from "next/link";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import ImageUploader from "@/components/ImageUploader";
import { getSectionByType, upsertSection } from "@/lib/api";

interface HeroData {
  title: string;
  sectionButton: string;
  bgVideo: string;
}

const DEFAULT: HeroData = {
  title: "Hero Section",
  sectionButton: "Start Shopping Now",
  bgVideo: "/videos/HeroSectionVideo.mp4",
};

export default function HeroPage() {
  const [data, setData] = useState<HeroData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = useSaveToast();

  useEffect(() => {
    getSectionByType("home", "hero")
      .then((s) => {
        if (s) {
          setData({
            title: s.title || DEFAULT.title,
            sectionButton: s.ctaText || DEFAULT.sectionButton,
            bgVideo: s.heroImage || DEFAULT.bgVideo,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await upsertSection("home", "hero", {
        title: data.title,
        ctaText: data.sectionButton,
        heroImage: data.bgVideo,
      });
      showToast("success", "Hero section saved successfully!");
    } catch {
      showToast("error", "Failed to save. Check backend connection.");
    }
  };

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
            Controls the full-screen video and CTA button on the homepage.
          </p>
        </div>
        <SaveButton onSave={handleSave} />
      </div>

      <div className="space-y-5">
        {/* CTA Button Text */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#1a1a2e] mb-3">
            <ImageIcon className="h-4 w-4 text-blue-500" />
            Call-to-Action Button Text
          </label>
          <input
            type="text"
            value={data.sectionButton}
            onChange={(e) => setData({ ...data, sectionButton: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            placeholder="e.g. Start Shopping Now"
          />
          <p className="mt-2 text-xs text-gray-400">
            This text appears on the button overlaid on the hero video.
          </p>
        </div>

        {/* Background Video Path */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#1a1a2e] mb-3">
            <Video className="h-4 w-4 text-purple-500" />
            Background Video Path
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={data.bgVideo}
              onChange={(e) => setData({ ...data, bgVideo: e.target.value })}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
              placeholder="Video URL or path"
            />
            <ImageUploader
              currentUrl={data.bgVideo}
              onUpload={(url) => setData({ ...data, bgVideo: url })}
              accept="video/*"
              label="Upload Video"
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Upload a video or paste a URL.
          </p>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Preview</p>
          <div className="relative h-24 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-black/50" />
            <button className="relative z-10 rounded-md bg-[#fdc700] px-5 py-2 text-sm font-semibold text-[#1a1a2e]">
              {data.sectionButton || "—"}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Video: <code className="bg-gray-200 px-1 rounded">{data.bgVideo}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
