"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, Loader2, BadgeDollarSign, Image } from "lucide-react";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import ImageUploader from "@/components/ImageUploader";
import { getSectionByType, upsertSection } from "@/lib/api";
import { PageHeader, Card, Field, TextInput, TextArea } from "@/components/ui";

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
            setData(JSON.parse(s.content));
          } catch {}
        }
      })
      .catch(() => {})
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

  const set = <K extends keyof AffiliateData>(key: K, value: AffiliateData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const updateStep = (id: number, field: keyof Omit<Step, "id">, value: string) => {
    set("steps", data.steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addStep = () => {
    set("steps", [...data.steps, { id: Date.now(), title: "NEW STEP", description: "" }]);
  };

  const removeStep = (id: number) => {
    set("steps", data.steps.filter((s) => s.id !== id));
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
        title="Affiliate Banner"
        description="Manage the “Earn Money With Us” section on the homepage."
        breadcrumb={[{ href: "/", label: "Dashboard" }, { href: "/affiliate", label: "Affiliate Banner" }]}
        actions={<SaveButton onSave={handleSave} />}
      />

      <div className="max-w-4xl space-y-5">
        <Card title="General Settings" icon={<BadgeDollarSign className="h-4 w-4" />}>
          <div className="space-y-4">
            <Field label="Section Title">
              <TextInput type="text" value={data.sectionTitle} onChange={(e) => set("sectionTitle", e.target.value)} />
            </Field>
            <Field label="Background Image" hint="Upload an image or paste a path / URL.">
              <div className="flex flex-col gap-2 sm:flex-row">
                <TextInput type="text" value={data.bgBanner} onChange={(e) => set("bgBanner", e.target.value)} className="flex-1" placeholder="images/frontand/TheamImage.jpg" />
                <ImageUploader currentUrl={data.bgBanner} onUpload={(url) => set("bgBanner", url)} label="Upload Image" />
              </div>
            </Field>
            <Field label="CTA Button Text">
              <TextInput type="text" value={data.ctaButtonText} onChange={(e) => set("ctaButtonText", e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card
          title={`Steps (${data.steps.length})`}
          icon={<Image className="h-4 w-4" />}
          actions={
            <button
              onClick={addStep}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#2a2a4e]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Step
            </button>
          }
        >
          <div className="space-y-3">
            {data.steps.map((step, i) => (
              <div key={step.id} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex shrink-0 items-center gap-2 pt-1">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fdc700] text-xs font-bold text-[#1a1a2e]">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <TextInput type="text" value={step.title} onChange={(e) => updateStep(step.id, "title", e.target.value)} className="font-semibold uppercase" placeholder="Step title (uppercase)" />
                  <TextArea value={step.description} onChange={(e) => updateStep(step.id, "description", e.target.value)} rows={2} placeholder="Step description" />
                </div>
                <button onClick={() => removeStep(step.id)} className="shrink-0 rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {data.steps.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">No steps yet. Click “Add Step” to create one.</p>
            )}
          </div>
        </Card>

        <Card title="Preview" className="border-dashed border-gray-300 bg-gray-50/60">
          <div className="rounded-xl bg-gray-800 p-5 text-center">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white">{data.sectionTitle}</p>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              {data.steps.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] font-bold uppercase text-white">{s.title}</p>
                  <p className="mt-1 text-[9px] leading-4 text-white/60">{s.description}</p>
                </div>
              ))}
            </div>
            <button className="rounded-lg bg-[#22c55e] px-3 py-1.5 text-[10px] font-medium text-black">{data.ctaButtonText}</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
