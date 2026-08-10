"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import Link from "next/link";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import ImageUploader from "@/components/ImageUploader";
import { getSectionByType, upsertSection } from "@/lib/api";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface AffiliateData {
  sectionTitle: string;
  bgBanner: string;
  ctaButtonText: string;
  steps: Step[];
}

const DEFAULT: AffiliateData = {
  sectionTitle: "EARN MONEY WITH US",
  bgBanner: "images/frontand/TheamImage.jpg",
  ctaButtonText: "Register Now",
  steps: [
    { id: 1, title: "SIGN UP", description: "Create your free affiliate account in minutes." },
    { id: 2, title: "SHARE YOUR LINK", description: "Promote our mountain products using your unique referral link." },
    { id: 3, title: "EARN COMMISSIONS", description: "Get paid for every successful referral." },
  ],
};

export default function AffiliatePage() {
  const [data, setData] = useState<AffiliateData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = useSaveToast();

  useEffect(() => {
    getSectionByType("home", "promo_banner")
      .then((s) => {
        if (s?.content) {
          try {
            const parsed = JSON.parse(s.content);
            setData(parsed);
          } catch { }
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await upsertSection("home", "promo_banner", {
        title: data.sectionTitle,
        bannerImage: data.bgBanner,
        ctaText: data.ctaButtonText,
        content: JSON.stringify(data),
      });
      showToast("success", "Affiliate banner saved!");
    } catch {
      showToast("error", "Failed to save. Check backend connection.");
    }
  };

  const updateStep = (id: number, field: keyof Omit<Step, "id">, value: string) => {
    setData((d) => ({
      ...d,
      steps: d.steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const addStep = () => {
    const newId = Date.now();
    setData((d) => ({
      ...d,
      steps: [...d.steps, { id: newId, title: "NEW STEP", description: "" }],
    }));
  };

  const removeStep = (id: number) => {
    setData((d) => ({ ...d, steps: d.steps.filter((s) => s.id !== id) }));
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

      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#1a1a2e] flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#1a1a2e] font-medium">Affiliate Banner</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">Affiliate Banner</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage the &ldquo;Earn Money With Us&rdquo; section on the homepage.
          </p>
        </div>
        <SaveButton onSave={handleSave} />
      </div>

      <div className="space-y-5">
        {/* General Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1a1a2e]">General Settings</h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Section Title</label>
            <input
              type="text"
              value={data.sectionTitle}
              onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Background Image Path</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.bgBanner}
                onChange={(e) => setData({ ...data, bgBanner: e.target.value })}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                placeholder="images/frontand/TheamImage.jpg"
              />
              <ImageUploader
                currentUrl={data.bgBanner}
                onUpload={(url) => setData({ ...data, bgBanner: url })}
                label="Upload Image"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">CTA Button Text</label>
            <input
              type="text"
              value={data.ctaButtonText}
              onChange={(e) => setData({ ...data, ctaButtonText: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1a1a2e]">Steps ({data.steps.length})</h2>
            <button
              onClick={addStep}
              className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2a2a4e]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Step
            </button>
          </div>

          <div className="space-y-3">
            {data.steps.map((step, i) => (
              <div
                key={step.id}
                className="flex gap-3 items-start rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fdc700] text-xs font-bold text-[#1a1a2e]">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(step.id, "title", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                    placeholder="Step title (uppercase)"
                  />
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(step.id, "description", e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                    placeholder="Step description"
                  />
                </div>
                <button
                  onClick={() => removeStep(step.id)}
                  className="shrink-0 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Preview</p>
          <div className="rounded-lg bg-gray-800 p-5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white mb-4">
              {data.sectionTitle}
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {data.steps.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] font-bold uppercase text-white">{s.title}</p>
                  <p className="text-[9px] text-white/60 mt-1 leading-4">{s.description}</p>
                </div>
              ))}
            </div>
            <button className="rounded bg-[#22c55e] px-3 py-1 text-[10px] font-medium text-black">
              {data.ctaButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
