"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, Loader2, Info } from "lucide-react";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";
import { PageHeader, Card, Field, TextInput, TextArea, Select } from "@/components/ui";

interface ProcessStep {
  id: number;
  title: string;
  theme: "dark" | "yellow";
}

interface AboutData {
  heading: string;
  description: string;
  steps: ProcessStep[];
}

const DEFAULT: AboutData = {
  heading: "কেন পাহাড় থেকে ? – আমাদের সম্পর্কে",
  description: `পাহাড় থেকে একটি বিশ্বস্ত অনলাইন প্ল্যাটফর্ম, যা পার্বত্য অঞ্চলের প্রাকৃতিক ও নিরাপদ খাদ্যসামগ্রী সরাসরি গ্রাহকের কাছে পৌঁছে দেয়। আমরা স্থানীয় কৃষকদের সাথে কাজ করে তাজা ফল, মাছ, মাংস ও মসলা সংগ্রহ করি, যাতে আপনি পান খাঁটি ও নিরাপদ খাবার।

আমাদের লক্ষ্য হলো টেকসই কৃষিকে উৎসাহ দেওয়া, পাহাড়ি দরিদ্র কৃষকদের সহায়তা করা এবং শহরের মানুষের কাছে প্রাকৃতিক ও স্বাস্থ্যকর খাদ্য পৌঁছে দেওয়া। আমরা প্রতিশ্রুতিবদ্ধ—গুণগত মান, সতেজতা এবং দ্রুত ডেলিভারির মাধ্যমে আপনাদের আস্থা অর্জন করতে।`,
  steps: [
    { id: 1, title: "Boning & Fabrication", theme: "dark" },
    { id: 2, title: "Distribution", theme: "yellow" },
    { id: 3, title: "Retail Store", theme: "dark" },
    { id: 4, title: "Processing", theme: "yellow" },
    { id: 5, title: "Chilling", theme: "dark" },
    { id: 6, title: "Sourcing", theme: "yellow" },
  ],
};

export default function AboutPage() {
  const [data, setData] = useState<AboutData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = useSaveToast();

  useEffect(() => {
    getSectionByType("home", "about")
      .then((s) => {
        if (s) {
          const parsed = s.content ? (() => { try { return JSON.parse(s.content); } catch { return null; } })() : null;
          if (parsed) {
            setData(parsed);
          } else {
            setData({
              heading: s.title || DEFAULT.heading,
              description: s.subtitle || DEFAULT.description,
              steps: DEFAULT.steps,
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await upsertSection("home", "about", {
        title: data.heading,
        subtitle: data.description,
        content: JSON.stringify(data),
      });
      showToast("success", "About section saved!");
    } catch {
      showToast("error", "Failed to save. Check backend connection.");
    }
  };

  const set = <K extends keyof AboutData>(key: K, value: AboutData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const updateStep = (id: number, field: keyof Omit<ProcessStep, "id">, value: string) => {
    set("steps", data.steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addStep = () => {
    set("steps", [...data.steps, { id: Date.now(), title: "New Step", theme: "dark" }]);
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
        title="About Section"
        description="Edit the “কেন পাহাড় থেকে” heading, description and process steps."
        breadcrumb={[{ href: "/", label: "Dashboard" }, { href: "/about", label: "About Section" }]}
        actions={<SaveButton onSave={handleSave} />}
      />

      <div className="max-w-4xl space-y-5">
        <Card title="Text Content" icon={<Info className="h-4 w-4" />}>
          <div className="space-y-4">
            <Field label="Section Heading">
              <TextInput type="text" value={data.heading} onChange={(e) => set("heading", e.target.value)} dir="auto" />
            </Field>
            <Field label="Description" hint="Supports Bengali & English text.">
              <TextArea value={data.description} onChange={(e) => set("description", e.target.value)} rows={7} dir="auto" />
            </Field>
          </div>
        </Card>

        <Card
          title={`Process Steps (${data.steps.length})`}
          icon={<Info className="h-4 w-4" />}
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
              <div key={step.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex shrink-0 items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                      step.theme === "dark" ? "bg-[#343434] text-white" : "bg-[#f4ca23] text-[#1f1f1f]"
                    }`}
                  >
                    {i + 1}
                  </div>
                </div>
                <TextInput type="text" value={step.title} onChange={(e) => updateStep(step.id, "title", e.target.value)} className="flex-1" />
                <Select value={step.theme} onChange={(e) => updateStep(step.id, "theme", e.target.value)} className="w-28">
                  <option value="dark">Dark</option>
                  <option value="yellow">Yellow</option>
                </Select>
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
          <p className="text-sm font-bold leading-snug text-[#2c2c2c]">{data.heading}</p>
          <p className="mt-2 line-clamp-3 text-xs leading-6 text-gray-500">{data.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.steps.map((s, i) => (
              <span
                key={i}
                className={`rounded px-2.5 py-1 text-[10px] font-semibold ${
                  s.theme === "dark" ? "bg-[#343434] text-white" : "bg-[#f4ca23] text-[#1f1f1f]"
                }`}
              >
                {s.title}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
