"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import Link from "next/link";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";

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
};

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
            setData(parsed);
          } catch {}
        }
      })
      .catch(() => {})
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

  const addQuickLink = () => {
    setData((d) => ({
      ...d,
      quickLinks: [...d.quickLinks, { id: Date.now(), label: "New Link", href: "/" }],
    }));
  };

  const removeQuickLink = (id: number) => {
    setData((d) => ({ ...d, quickLinks: d.quickLinks.filter((l) => l.id !== id) }));
  };

  const updateQuickLink = (id: number, field: keyof Omit<LinkItem, "id">, value: string) => {
    setData((d) => ({
      ...d,
      quickLinks: d.quickLinks.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    }));
  };

  const addPolicy = () => {
    setData((d) => ({
      ...d,
      policies: [...d.policies, { id: Date.now(), label: "New Policy", href: "/" }],
    }));
  };

  const removePolicy = (id: number) => {
    setData((d) => ({ ...d, policies: d.policies.filter((p) => p.id !== id) }));
  };

  const updatePolicy = (id: number, field: keyof Omit<LinkItem, "id">, value: string) => {
    setData((d) => ({
      ...d,
      policies: d.policies.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
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
        {/* Brand */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Brand</h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Logo URL</label>
            <input
              type="text"
              value={data.logoUrl}
              onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Social Links</h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Facebook URL</label>
            <input
              type="text"
              value={data.facebookUrl}
              onChange={(e) => setData({ ...data, facebookUrl: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Instagram URL</label>
            <input
              type="text"
              value={data.instagramUrl}
              onChange={(e) => setData({ ...data, instagramUrl: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">YouTube URL</label>
            <input
              type="text"
              value={data.youtubeUrl}
              onChange={(e) => setData({ ...data, youtubeUrl: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1a1a2e]">Quick Links ({data.quickLinks.length})</h2>
            <button
              onClick={addQuickLink}
              className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2a2a4e]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Link
            </button>
          </div>

          <div className="space-y-3">
            {data.quickLinks.map((link, i) => (
              <div key={link.id} className="flex gap-3 items-center rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 shrink-0">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fdc700] text-xs font-bold text-[#1a1a2e]">
                    {i + 1}
                  </span>
                </div>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateQuickLink(link.id, "label", e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateQuickLink(link.id, "href", e.target.value)}
                  className="w-40 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                  placeholder="/path"
                />
                <button
                  onClick={() => removeQuickLink(link.id)}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1a1a2e]">Policies ({data.policies.length})</h2>
            <button
              onClick={addPolicy}
              className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2a2a4e]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Policy
            </button>
          </div>

          <div className="space-y-3">
            {data.policies.map((policy, i) => (
              <div key={policy.id} className="flex gap-3 items-center rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 shrink-0">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fdc700] text-xs font-bold text-[#1a1a2e]">
                    {i + 1}
                  </span>
                </div>
                <input
                  type="text"
                  value={policy.label}
                  onChange={(e) => updatePolicy(policy.id, "label", e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={policy.href}
                  onChange={(e) => updatePolicy(policy.id, "href", e.target.value)}
                  className="w-40 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                  placeholder="/path"
                />
                <button
                  onClick={() => removePolicy(policy.id)}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Contact Information</h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Address</label>
            <textarea
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
            <input
              type="text"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Google Maps Embed URL</label>
            <input
              type="text"
              value={data.mapEmbedUrl}
              onChange={(e) => setData({ ...data, mapEmbedUrl: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Preview</p>
          <div className="rounded-lg bg-[#1a3a1a] p-5 text-white">
            <p className="text-xs text-gray-400 leading-relaxed mb-2">{data.description}</p>
            <p className="text-xs text-gray-400 mb-1">{data.address}</p>
            <p className="text-xs text-gray-400">{data.phone} | {data.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
