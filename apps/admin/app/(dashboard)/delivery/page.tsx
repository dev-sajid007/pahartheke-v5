"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";

interface DeliveryZone {
    id: number;
    label: string;
    cost: number;
}

const DEFAULT_ZONES: DeliveryZone[] = [
    { id: 1, label: "Inside Dhaka", cost: 65 },
    { id: 2, label: "Outside Dhaka", cost: 150 },
];

export default function DeliveryPage() {
    const [zones, setZones] = useState<DeliveryZone[]>(DEFAULT_ZONES);
    const [loading, setLoading] = useState(true);
    const { showToast, Toast } = useSaveToast();

    useEffect(() => {
        getSectionByType("home", "delivery_charges")
            .then((s) => {
                if (s?.content) {
                    try {
                        const parsed = JSON.parse(s.content);
                        if (Array.isArray(parsed) && parsed.length > 0) setZones(parsed);
                    } catch { }
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        try {
            await upsertSection("home", "delivery_charges", {
                title: "Delivery Charges",
                content: JSON.stringify(zones),
            });
            showToast("success", "Delivery zones saved successfully!");
        } catch {
            showToast("error", "Failed to save. Check backend connection.");
        }
    };

    const addZone = () =>
        setZones((prev) => [
            ...prev,
            { id: Date.now(), label: "New Zone", cost: 0 },
        ]);

    const removeZone = (id: number) =>
        setZones((prev) => prev.filter((z) => z.id !== id));

    const updateZone = (id: number, field: "label" | "cost", value: string) =>
        setZones((prev) =>
            prev.map((z) =>
                z.id === id
                    ? { ...z, [field]: field === "cost" ? Number(value) || 0 : value }
                    : z
            )
        );

    const inputCls =
        "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]";

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
                <span className="text-[#1a1a2e] font-medium">Delivery Charges</span>
            </div>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a2e]">Delivery Charges</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage delivery zones and their prices shown on the checkout page.
                    </p>
                </div>
                <SaveButton onSave={handleSave} />
            </div>

            <div className="space-y-5">
                {/* Zones list */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-[#1a1a2e]">
                            Delivery Zones ({zones.length})
                        </h2>
                        <button
                            onClick={addZone}
                            className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2a2a4e]"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add Zone
                        </button>
                    </div>

                    {zones.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-6">
                            No zones yet. Click &quot;Add Zone&quot; to create one.
                        </p>
                    )}

                    <div className="space-y-3">
                        {zones.map((zone, i) => (
                            <div
                                key={zone.id}
                                className="flex gap-3 items-center rounded-xl border border-gray-100 bg-gray-50 p-4"
                            >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fdc700] text-xs font-bold text-[#1a1a2e]">
                                    {i + 1}
                                </span>

                                {/* Label */}
                                <div className="flex-1">
                                    <p className="text-[10px] font-medium text-gray-400 mb-1">
                                        Zone Name
                                    </p>
                                    <input
                                        type="text"
                                        value={zone.label}
                                        onChange={(e) =>
                                            updateZone(zone.id, "label", e.target.value)
                                        }
                                        className={inputCls}
                                        placeholder="e.g. Inside Dhaka"
                                    />
                                </div>

                                {/* Cost */}
                                <div className="w-32 shrink-0">
                                    <p className="text-[10px] font-medium text-gray-400 mb-1">
                                        Price (৳)
                                    </p>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                            ৳
                                        </span>
                                        <input
                                            type="number"
                                            min={0}
                                            value={zone.cost}
                                            onChange={(e) =>
                                                updateZone(zone.id, "cost", e.target.value)
                                            }
                                            className={`${inputCls} pl-7`}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeZone(zone.id)}
                                    className="mt-4 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live preview */}
                {zones.length > 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                            Preview — Checkout Page
                        </p>
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="block h-4 w-1 rounded-full bg-[#76B432]" />
                                <p className="text-sm font-bold text-slate-800">Delivery</p>
                            </div>
                            {zones.map((zone, i) => (
                                <div
                                    key={zone.id}
                                    className={`flex items-center justify-between rounded-lg border px-4 py-2.5 ${i === 0
                                            ? "border-[#76B432] bg-[#76B432]/5"
                                            : "border-slate-200 bg-slate-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${i === 0 ? "border-[#76B432]" : "border-slate-300"
                                                }`}
                                        >
                                            {i === 0 && (
                                                <span className="h-2 w-2 rounded-full bg-[#76B432]" />
                                            )}
                                        </span>
                                        <span className="text-sm font-medium text-slate-700">
                                            {zone.label}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#76B432]">
                                        ৳{zone.cost}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700 flex gap-3">
                    <Truck className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                        <strong>Tip:</strong> The first zone in the list is selected by
                        default on the checkout page. Zone names can be in Bengali or English.
                    </div>
                </div>
            </div>
        </div>
    );
}
