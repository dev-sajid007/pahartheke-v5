"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Type, Eye } from "lucide-react";
import Link from "next/link";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SectionLabels {
    title: string;
    subtitle: string;
}

interface AllSections {
    featured_products: SectionLabels;
    best_sellers: SectionLabels;
    popular_items: SectionLabels;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULTS: AllSections = {
    featured_products: {
        title: "Featured Products",
        subtitle: "Handpicked select items this week",
    },
    best_sellers: {
        title: "Best Sellers",
        subtitle: "Top seller products of this week",
    },
    popular_items: {
        title: "Popular Items",
        subtitle: "Customers' favorite items",
    },
};

const SECTION_KEYS = [
    {
        key: "featured_products" as keyof AllSections,
        label: "Featured Products Section",
        color: "text-emerald-500",
        previewBg: "bg-white",
    },
    {
        key: "best_sellers" as keyof AllSections,
        label: "Best Sellers Section",
        color: "text-blue-500",
        previewBg: "bg-gray-50",
    },
    {
        key: "popular_items" as keyof AllSections,
        label: "Popular Items Section",
        color: "text-purple-500",
        previewBg: "bg-gray-50",
    },
];

// ─── Field Card ───────────────────────────────────────────────────────────────
function FieldCard({
    label,
    hint,
    children,
}: {
    label: string;
    hint: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1a1a2e] mb-3">
                <span className="text-gray-400">
                    <Type className="h-4 w-4" />
                </span>
                {label}
            </label>
            {children}
            <p className="mt-2 text-xs text-gray-400">{hint}</p>
        </div>
    );
}

// ─── Section Block ────────────────────────────────────────────────────────────
function SectionBlock({
    label,
    color,
    previewBg,
    data,
    onChange,
}: {
    label: string;
    color: string;
    previewBg: string;
    data: SectionLabels;
    onChange: (field: keyof SectionLabels, value: string) => void;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <span className={`${color}`}>
                    <Type className="h-5 w-5" />
                </span>
                <h2 className="text-base font-semibold text-[#1a1a2e]">{label}</h2>
            </div>

            <div className="p-6 space-y-4">
                {/* Title */}
                <FieldCard
                    label="Section Title"
                    hint={`The main heading shown above the product list. Example: "${data.title}"`}
                >
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => onChange("title", e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                        placeholder="e.g. Featured Products"
                    />
                </FieldCard>

                {/* Subtitle */}
                <FieldCard
                    label="Section Subtitle"
                    hint={`The small descriptive line below the title. Example: "${data.subtitle}"`}
                >
                    <input
                        type="text"
                        value={data.subtitle}
                        onChange={(e) => onChange("subtitle", e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                        placeholder="e.g. Handpicked select items this week"
                    />
                </FieldCard>

                {/* Preview */}
                <div className={`rounded-xl border border-dashed border-gray-300 ${previewBg} p-5`}>
                    <div className="flex items-center gap-2 mb-3">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                            Preview
                        </p>
                    </div>
                    <p className="text-lg font-bold text-[#1a1a2e]">
                        {data.title || "—"}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {data.subtitle || "—"}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductSectionsPage() {
    const [sections, setSections] = useState<AllSections>(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const { showToast, Toast } = useSaveToast();

    // Load all 3 sections on mount
    useEffect(() => {
        const load = async () => {
            try {
                const [featured, bestSellers, popular] = await Promise.all([
                    getSectionByType("home", "featured_products"),
                    getSectionByType("home", "best_sellers"),
                    getSectionByType("home", "popular_items"),
                ]);

                setSections({
                    featured_products: {
                        title: featured?.title || DEFAULTS.featured_products.title,
                        subtitle: featured?.subtitle || DEFAULTS.featured_products.subtitle,
                    },
                    best_sellers: {
                        title: bestSellers?.title || DEFAULTS.best_sellers.title,
                        subtitle: bestSellers?.subtitle || DEFAULTS.best_sellers.subtitle,
                    },
                    popular_items: {
                        title: popular?.title || DEFAULTS.popular_items.title,
                        subtitle: popular?.subtitle || DEFAULTS.popular_items.subtitle,
                    },
                });
            } catch {
                // use defaults on error
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleChange =
        (sectionKey: keyof AllSections) =>
            (field: keyof SectionLabels, value: string) => {
                setSections((prev) => ({
                    ...prev,
                    [sectionKey]: { ...prev[sectionKey], [field]: value },
                }));
            };

    const handleSave = async () => {
        try {
            await Promise.all([
                upsertSection("home", "featured_products", {
                    title: sections.featured_products.title,
                    subtitle: sections.featured_products.subtitle,
                }),
                upsertSection("home", "best_sellers", {
                    title: sections.best_sellers.title,
                    subtitle: sections.best_sellers.subtitle,
                }),
                upsertSection("home", "popular_items", {
                    title: sections.popular_items.title,
                    subtitle: sections.popular_items.subtitle,
                }),
            ]);
            showToast("success", "All product section labels saved successfully!");
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
                <span className="text-[#1a1a2e] font-medium">Product Sections</span>
            </div>

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a2e]">Product Sections</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Edit the title and subtitle of the three homepage product sections.
                    </p>
                </div>
                <SaveButton onSave={handleSave} />
            </div>

            <div className="space-y-6">
                {SECTION_KEYS.map(({ key, label, color, previewBg }) => (
                    <SectionBlock
                        key={key}
                        label={label}
                        color={color}
                        previewBg={previewBg}
                        data={sections[key]}
                        onChange={handleChange(key)}
                    />
                ))}
            </div>
        </div>
    );
}
