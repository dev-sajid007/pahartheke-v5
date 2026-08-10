"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, Loader2, TrendingUp, Image } from "lucide-react";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import ImageUploader from "@/components/ImageUploader";
import { getSectionByType, upsertSection } from "@/lib/api";
import { PageHeader, Card, Field, TextInput, TextArea } from "@/components/ui";

interface Feature {
  id: number;
  title: string;
  description: string;
}

interface InvestData {
  sectionTitle: string;
  bgBanner: string;
  ctaButtonText: string;
  features: Feature[];
}

const DEFAULT: InvestData = {
  sectionTitle: "Invest With Us",
  bgBanner: "images/frontand/TheamImage.jpg",
  ctaButtonText: "View Details",
  features: [
    { id: 1, title: "High Returns", description: "Earn competitive returns with minimal risk, tailored to your investment goals." },
    { id: 2, title: "Secure & Trusted", description: "We prioritize your investment security with transparent strategies and full compliance." },
    { id: 3, title: "Expert Guidance", description: "Our experienced financial advisors help you make smart, informed investment choices." },
  ],
};

export default function InvestPage() {
  const [data, setData] = useState<InvestData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = useSaveToast();

  useEffect(() => {
    getSectionByType("home", "newsletter")
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
      await upsertSection("home", "newsletter", {
        title: data.sectionTitle,
        bannerImage: data.bgBanner,
        ctaText: data.ctaButtonText,
        content: JSON.stringify(data),
      });
      showToast("success", "Invest banner saved!");
    } catch {
      showToast("error", "Failed to save. Check backend connection.");
    }
  };

  const set = <K extends keyof InvestData>(key: K, value: InvestData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const updateFeature = (id: number, field: keyof Omit<Feature, "id">, value: string) => {
    set("features", data.features.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const addFeature = () => {
    set("features", [...data.features, { id: Date.now(), title: "New Feature", description: "" }]);
  };

  const removeFeature = (id: number) => {
    set("features", data.features.filter((f) => f.id !== id));
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
        title="Invest Banner"
        description="Manage the “Invest With Us” section on the homepage."
        breadcrumb={[{ href: "/", label: "Dashboard" }, { href: "/invest", label: "Invest Banner" }]}
        actions={<SaveButton onSave={handleSave} />}
      />

      <div className="max-w-4xl space-y-5">
        <Card title="General Settings" icon={<TrendingUp className="h-4 w-4" />}>
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
          title={`Features (${data.features.length})`}
          icon={<Image className="h-4 w-4" />}
          actions={
            <button
              onClick={addFeature}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#2a2a4e]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Feature
            </button>
          }
        >
          <div className="space-y-3">
            {data.features.map((feat, i) => (
              <div key={feat.id} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex shrink-0 items-center gap-2 pt-1">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <TextInput type="text" value={feat.title} onChange={(e) => updateFeature(feat.id, "title", e.target.value)} className="font-semibold" placeholder="Feature title" />
                  <TextArea value={feat.description} onChange={(e) => updateFeature(feat.id, "description", e.target.value)} rows={2} placeholder="Feature description" />
                </div>
                <button onClick={() => removeFeature(feat.id)} className="shrink-0 rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {data.features.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">No features yet. Click “Add Feature” to create one.</p>
            )}
          </div>
        </Card>

        <Card title="Preview" className="border-dashed border-gray-300 bg-gray-50/60">
          <div className="rounded-xl bg-gray-700 p-5 text-center">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white">{data.sectionTitle}</p>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              {data.features.map((f, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] font-bold uppercase text-white">{f.title}</p>
                  <p className="mt-1 text-[9px] leading-4 text-white/60">{f.description}</p>
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
