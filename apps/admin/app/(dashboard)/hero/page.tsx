"use client";

import { useEffect, useRef, useState } from "react";
import { Type, Video, MousePointerClick, Upload, Loader2, Eye } from "lucide-react";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";
import { PageHeader, Card, Field, TextInput } from "@/components/ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface HeroData {
  tagline: string;
  subheading: string;
  mainHeading: string;
  sectionButton: string;
  bgVideo: string;
}

const DEFAULT: HeroData = {
  tagline: "BANGLADESH'S",
  subheading: "First & Only",
  mainHeading: "International Standard Abattoir",
  sectionButton: "Start Shopping Now",
  bgVideo: "/videos/HeroSectionVideo.mp4",
};

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
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <TextInput
          type="text"
          value={currentUrl}
          onChange={(e) => onUpload(e.target.value)}
          placeholder="Paste Cloudinary / CDN video URL"
          className="flex-1"
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
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload Video"}
        </button>
      </div>
      {currentUrl && (
        <p className="truncate text-xs text-gray-400">
          Current:{" "}
          <a href={currentUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
            {currentUrl.split("/").pop()}
          </a>
        </p>
      )}
    </div>
  );
}

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
      .catch(() => {})
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

  const set = (key: keyof HeroData) => (val: string) => setData((d) => ({ ...d, [key]: val }));

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
        title="Hero Section"
        description="Controls the full-screen hero banner — text, video & CTA button."
        breadcrumb={[{ href: "/", label: "Dashboard" }, { href: "/hero", label: "Hero Section" }]}
        actions={<SaveButton onSave={handleSave} />}
      />

      <div className="max-w-4xl space-y-5">
        <Card title="Text Content" icon={<Type className="h-4 w-4" />}>
          <div className="space-y-4">
            <Field label="Tagline (Top Line)" hint="Displayed above the main heading. Example: BANGLADESH'S">
              <TextInput type="text" value={data.tagline} onChange={(e) => set("tagline")(e.target.value)} placeholder="e.g. BANGLADESH'S" />
            </Field>
            <Field label="Subheading (Italic Line)" hint='Italic line between tagline and heading. Example: "First & Only"'>
              <TextInput type="text" value={data.subheading} onChange={(e) => set("subheading")(e.target.value)} placeholder="e.g. First & Only" />
            </Field>
            <Field label="Main Heading (H1)" hint="The large bold heading — the primary message of the hero banner.">
              <TextInput type="text" value={data.mainHeading} onChange={(e) => set("mainHeading")(e.target.value)} placeholder="e.g. International Standard Abattoir" />
            </Field>
            <Field label="CTA Button Text" hint="Text on the action button overlaid on the hero video.">
              <TextInput type="text" value={data.sectionButton} onChange={(e) => set("sectionButton")(e.target.value)} placeholder="e.g. Start Shopping Now" />
            </Field>
          </div>
        </Card>

        <Card title="Background Video" icon={<Video className="h-4 w-4" />} description="Upload an MP4/WebM video or paste a Cloudinary URL. Max size: 10 MB.">
          <VideoUploader currentUrl={data.bgVideo} onUpload={set("bgVideo")} />
        </Card>

        <Card title="Preview" icon={<Eye className="h-4 w-4" />} className="border-dashed border-gray-300 bg-gray-50/60">
          <div className="flex h-40 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-gradient-to-t from-slate-950 via-emerald-950 to-slate-800 px-4 text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              {data.tagline || "—"}
            </p>
            <p className="text-[11px] font-semibold italic text-slate-300">{data.subheading || "—"}</p>
            <p className="text-sm font-extrabold uppercase leading-tight tracking-wide text-white">
              {data.mainHeading || "—"}
            </p>
            <button className="mt-2 rounded-lg bg-emerald-800 px-5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-100 ring-1 ring-slate-300/30">
              {data.sectionButton || "—"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
