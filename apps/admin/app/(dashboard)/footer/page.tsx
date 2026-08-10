"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface LinkItem {
  id: number;
  label: string;
  href: string;
}

interface FooterData {
  logoUrl: string;
  description: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  quickLinks: LinkItem[];
  policies: LinkItem[];
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  paymentBannerUrl: string;
  copyrightText: string;
}

const DEFAULT: FooterData = {
  logoUrl: "https://pahartheke.com/assets/img/logo.png",
  description:
    "Online platform revolutionizing food industry by promoting ancient cultivation and sustainable agriculture. Supporting underprivileged hill tract farmers.",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  quickLinks: [
    { id: 1, label: "About Us", href: "/about" },
    { id: 2, label: "Track Order", href: "/track-order" },
  ],
  policies: [
    { id: 1, label: "Privacy Policy", href: "/privacy-policy" },
    { id: 2, label: "FAQs", href: "/faqs" },
    { id: 3, label: "Terms of use", href: "/terms" },
    { id: 4, label: "Refund Policy", href: "/refund-policy" },
  ],
  address: "House - 2/5, Road - 2 Block-F,\nLalmatia, Dhaka-1207, Bangladesh.\n02-223311311, 01531532139",
  phone: "01531532139",
  email: "pahar.theke@gmail.com",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=YOUR_EMBED_URL",
  paymentBannerUrl: "",
  copyrightText: "",
};

/* ─── tiny inline image uploader ─── */
function ImgUploader({
  currentUrl,
  onUpload,
  label = "Upload Image",
  previewClass = "h-12 w-auto max-w-[200px] object-contain",
}: {
  currentUrl: string;
  onUpload: (url: string) => void;
  label?: string;
  previewClass?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const json = await res.json();
      if (json.success) onUpload(json.data.url);
      else alert(json.message || "Upload failed");
    } catch {
      alert("Upload failed. Is the backend running?");
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentUrl} alt="preview" className={previewClass} />
      )}
      <div className="flex flex-col gap-1">
        <input ref={ref} type="file" accept="image/*" onChange={handle} className="hidden" />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Uploading..." : currentUrl ? "Change" : label}
        </button>
        {currentUrl && (
          <button type="button" onClick={() => onUpload("")} className="text-[10px] text-red-400 hover:text-red-600 text-left">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default function FooterPage() {
  const [data, setData] = useState<FooterData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = useSaveToast();

  useEffect(() => {
    getSectionByType("home", "footer")
      .then((s) => {
        if (s?.content) {
          try {
            const parsed = JSON.parse(s.content);
            setData({ ...DEFAULT, ...parsed });
          } catch { }
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await upsertSection("home", "footer", {
        title: "Footer",
        content: JSON.stringify(data),
      });
      showToast("success", "Footer saved successfully!");
    } catch {
      showToast("error", "Failed to save. Check backend connection.");
    }
  };

  const set = <K extends keyof FooterData>(k: K, v: FooterData[K]) => setData((d) => ({ ...d, [k]: v }));

  /* quick link helpers */
  const addQuickLink = () =>
    set("quickLinks", [...data.quickLinks, { id: Date.now(), label: "New Link", href: "/" }]);
  const removeQuickLink = (id: number) =>
    set("quickLinks", data.quickLinks.filter((l) => l.id !== id));
  const updateQuickLink = (id: number, field: "label" | "href", value: string) =>
    set("quickLinks", data.quickLinks.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  /* policy helpers */
  const addPolicy = () =>
    set("policies", [...data.policies, { id: Date.now(), label: "New Policy", href: "/" }]);
  const removePolicy = (id: number) =>
    set("policies", data.policies.filter((p) => p.id !== id));
  const updatePolicy = (id: number, field: "label" | "href", value: string) =>
    set("policies", data.policies.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#fdc700] border-t-transparent" />
      </div>
    );

  const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1.5";

  return (
    <div className="max-w-3xl">
      {Toast}

      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#1a1a2e] flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#1a1a2e] font-medium">Footer</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">Footer Content</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage the footer section shown on all pages.
          </p>
        </div>
        <SaveButton onSave={handleSave} />
      </div>

      <div className="space-y-5">
        {/* ─── Brand ─── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Brand</h2>

          <div>
            <label className={labelCls}>Logo</label>
            <ImgUploader
              currentUrl={data.logoUrl}
              onUpload={(url) => set("logoUrl", url)}
              label="Upload Logo"
              previewClass="h-10 w-auto max-w-[180px] object-contain rounded bg-gray-100 p-1"
            />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={data.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {/* ─── Payment Banner ─── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Payment Banner</h2>
          <p className="text-xs text-gray-400">The payment methods banner shown above the footer.</p>

          <ImgUploader
            currentUrl={data.paymentBannerUrl}
            onUpload={(url) => set("paymentBannerUrl", url)}
            label="Upload Banner"
            previewClass="h-10 w-auto max-w-full object-contain rounded bg-gray-100 p-1"
          />
        </div>

        {/* ─── Social Links ─── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Social Links</h2>

          <div>
            <label className={labelCls}>Facebook URL</label>
            <input type="text" value={data.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Instagram URL</label>
            <input type="text" value={data.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>YouTube URL</label>
            <input type="text" value={data.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* ─── Quick Links ─── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1a1a2e]">Quick Links ({data.quickLinks.length})</h2>
            <button onClick={addQuickLink} className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2a2a4e]">
              <Plus className="h-3.5 w-3.5" /> Add Link
            </button>
          </div>

          <div className="space-y-3">
            {data.quickLinks.map((link, i) => (
              <div key={link.id} className="flex gap-3 items-center rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 shrink-0">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fdc700] text-xs font-bold text-[#1a1a2e]">{i + 1}</span>
                </div>
                <input type="text" value={link.label} onChange={(e) => updateQuickLink(link.id, "label", e.target.value)} className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]" placeholder="Label" />
                <input type="text" value={link.href} onChange={(e) => updateQuickLink(link.id, "href", e.target.value)} className="w-40 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]" placeholder="/path" />
                <button onClick={() => removeQuickLink(link.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Policies ─── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1a1a2e]">Policies ({data.policies.length})</h2>
            <button onClick={addPolicy} className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2a2a4e]">
              <Plus className="h-3.5 w-3.5" /> Add Policy
            </button>
          </div>

          <div className="space-y-3">
            {data.policies.map((policy, i) => (
              <div key={policy.id} className="flex gap-3 items-center rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 shrink-0">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fdc700] text-xs font-bold text-[#1a1a2e]">{i + 1}</span>
                </div>
                <input type="text" value={policy.label} onChange={(e) => updatePolicy(policy.id, "label", e.target.value)} className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]" placeholder="Label" />
                <input type="text" value={policy.href} onChange={(e) => updatePolicy(policy.id, "href", e.target.value)} className="w-40 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]" placeholder="/path" />
                <button onClick={() => removePolicy(policy.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Contact ─── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Contact Information</h2>

          <div>
            <label className={labelCls}>Address</label>
            <textarea value={data.address} onChange={(e) => set("address", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input type="text" value={data.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="text" value={data.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Google Maps Embed URL</label>
            <input type="text" value={data.mapEmbedUrl} onChange={(e) => set("mapEmbedUrl", e.target.value)} className={inputCls} placeholder="https://www.google.com/maps/embed?pb=..." />
          </div>
        </div>

        {/* ─── Copyright ─── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Copyright</h2>

          <div>
            <label className={labelCls}>Copyright Text</label>
            <input type="text" value={data.copyrightText} onChange={(e) => set("copyrightText", e.target.value)} className={inputCls} placeholder="© 2026 Pahar Theke. All rights reserved." />
            <p className="text-[10px] text-gray-400 mt-1">Leave empty to auto-generate with current year.</p>
          </div>
        </div>

        {/* ─── Preview ─── */}
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Preview</p>
          <div className="rounded-lg bg-[#171F24] p-5 text-white space-y-3">
            {data.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoUrl} alt="logo" className="h-8 w-auto object-contain" />
            )}
            <p className="text-xs text-gray-400 leading-relaxed">{data.description}</p>
            <p className="text-xs text-gray-400 whitespace-pre-line">{data.address}</p>
            <p className="text-xs text-gray-400">{data.phone} | {data.email}</p>
            {data.copyrightText && <p className="text-[10px] text-gray-500 border-t border-gray-700 pt-2">{data.copyrightText}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
