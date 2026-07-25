"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import Link from "next/link";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";

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

  const updateStep = (id: number, field: keyof Omit<ProcessStep, "id">, value: string) => {
    setData((d) => ({
      ...d,
      steps: d.steps.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addStep = () => {
    setData((d) => ({
      ...d,
      steps: [...d.steps, { id: Date.now(), title: "New Step", theme: "dark" }],
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
        <span className="text-[#1a1a2e] font-medium">About Section</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">About Section</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Edit the &ldquo;কেন পাহাড় থেকে&rdquo; heading, description and process steps.
          </p>
        </div>
        <SaveButton onSave={handleSave} />
      </div>

      <div className="space-y-5">
        {/* Heading & Description */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Text Content</h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Section Heading</label>
            <input
              type="text"
              value={data.heading}
              onChange={(e) => setData({ ...data, heading: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
              dir="auto"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={7}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
              dir="auto"
            />
            <p className="mt-1 text-xs text-gray-400">Supports Bengali & English text.</p>
          </div>
        </div>

        {/* Process Steps */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1a1a2e]">Process Steps ({data.steps.length})</h2>
            <button
              onClick={addStep}
              className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2a2a4e]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Step
            </button>
          </div>

          <div className="space-y-3">
            {data.steps.map((step, i) => (
              <div key={step.id} className="flex gap-3 items-center rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 shrink-0">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                      step.theme === "dark"
                        ? "bg-[#343434] text-white"
                        : "bg-[#f4ca23] text-[#1f1f1f]"
                    }`}
                  >
                    {i + 1}
                  </div>
                </div>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(step.id, "title", e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                />
                <select
                  value={step.theme}
                  onChange={(e) => updateStep(step.id, "theme", e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                >
                  <option value="dark">Dark</option>
                  <option value="yellow">Yellow</option>
                </select>
                <button
                  onClick={() => removeStep(step.id)}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
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
          <p className="text-sm font-bold text-[#2c2c2c] leading-snug">{data.heading}</p>
          <p className="mt-2 text-xs leading-6 text-gray-500 line-clamp-3">{data.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.steps.map((s, i) => (
              <span
                key={i}
                className={`rounded px-2.5 py-1 text-[10px] font-semibold ${
                  s.theme === "dark"
                    ? "bg-[#343434] text-white"
                    : "bg-[#f4ca23] text-[#1f1f1f]"
                }`}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
