"use client";

import { useEffect, useState } from "react";
import { Type, Eye, Loader2 } from "lucide-react";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";
import { PageHeader, Card, Field, TextInput } from "@/components/ui";

interface SectionLabels {
  title: string;
  subtitle: string;
}

interface AllSections {
  featured_products: SectionLabels;
  best_sellers: SectionLabels;
  popular_items: SectionLabels;
}

const DEFAULTS: AllSections = {
  featured_products: { title: "Featured Products", subtitle: "Handpicked select items this week" },
  best_sellers: { title: "Best Sellers", subtitle: "Top seller products of this week" },
  popular_items: { title: "Popular Items", subtitle: "Customers' favorite items" },
};

const SECTION_KEYS: { key: keyof AllSections; label: string; badge: string }[] = [
  { key: "featured_products", label: "Featured Products", badge: "bg-emerald-50 text-emerald-600" },
  { key: "best_sellers", label: "Best Sellers", badge: "bg-blue-50 text-blue-600" },
  { key: "popular_items", label: "Popular Items", badge: "bg-violet-50 text-violet-600" },
];

function SectionBlock({
  label,
  badge,
  data,
  onChange,
}: {
  label: string;
  badge: string;
  data: SectionLabels;
  onChange: (field: keyof SectionLabels, value: string) => void;
}) {
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          {label}
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge}`}>
            {data.title || "Untitled"}
          </span>
        </span>
      }
      icon={<Type className="h-4 w-4" />}
    >
      <div className="space-y-4">
        <Field label="Section Title" hint="The main heading shown above the product list.">
          <TextInput type="text" value={data.title} onChange={(e) => onChange("title", e.target.value)} placeholder="e.g. Featured Products" />
        </Field>
        <Field label="Section Subtitle" hint="The small descriptive line below the title.">
          <TextInput type="text" value={data.subtitle} onChange={(e) => onChange("subtitle", e.target.value)} placeholder="e.g. Handpicked select items this week" />
        </Field>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-5">
          <div className="mb-2 flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-gray-400" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Preview</p>
          </div>
          <p className="text-lg font-bold text-[#1a1a2e]">{data.title || "—"}</p>
          <p className="mt-0.5 text-sm text-gray-500">{data.subtitle || "—"}</p>
        </div>
      </div>
    </Card>
  );
}

export default function ProductSectionsPage() {
  const [sections, setSections] = useState<AllSections>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = useSaveToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [featured, bestSellers, popular] = await Promise.all([
          getSectionByType("home", "featured_products"),
          getSectionByType("home", "best_sellers"),
          getSectionByType("home", "popular_items"),
        ]);
        setSections({
          featured_products: { title: featured?.title || DEFAULTS.featured_products.title, subtitle: featured?.subtitle || DEFAULTS.featured_products.subtitle },
          best_sellers: { title: bestSellers?.title || DEFAULTS.best_sellers.title, subtitle: bestSellers?.subtitle || DEFAULTS.best_sellers.subtitle },
          popular_items: { title: popular?.title || DEFAULTS.popular_items.title, subtitle: popular?.subtitle || DEFAULTS.popular_items.subtitle },
        });
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange =
    (sectionKey: keyof AllSections) => (field: keyof SectionLabels, value: string) => {
      setSections((prev) => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], [field]: value },
      }));
    };

  const handleSave = async () => {
    try {
      await Promise.all([
        upsertSection("home", "featured_products", { title: sections.featured_products.title, subtitle: sections.featured_products.subtitle }),
        upsertSection("home", "best_sellers", { title: sections.best_sellers.title, subtitle: sections.best_sellers.subtitle }),
        upsertSection("home", "popular_items", { title: sections.popular_items.title, subtitle: sections.popular_items.subtitle }),
      ]);
      showToast("success", "All product section labels saved successfully!");
    } catch {
      showToast("error", "Failed to save. Check backend connection.");
    }
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
        title="Product Sections"
        description="Edit the title and subtitle of the three homepage product sections."
        breadcrumb={[{ href: "/", label: "Dashboard" }, { href: "/product-sections", label: "Product Sections" }]}
        actions={<SaveButton onSave={handleSave} />}
      />
      <div className="max-w-4xl space-y-5">
        {SECTION_KEYS.map(({ key, label, badge }) => (
          <SectionBlock key={key} label={label} badge={badge} data={sections[key]} onChange={handleChange(key)} />
        ))}
      </div>
    </div>
  );
}
