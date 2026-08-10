"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Truck, Loader2 } from "lucide-react";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";
import { PageHeader, Card, Field, TextInput } from "@/components/ui";

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
          } catch {}
        }
      })
      .catch(() => {})
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

  const addZone = () => setZones((prev) => [...prev, { id: Date.now(), label: "New Zone", cost: 0 }]);

  const removeZone = (id: number) => setZones((prev) => prev.filter((z) => z.id !== id));

  const updateZone = (id: number, field: "label" | "cost", value: string) =>
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, [field]: field === "cost" ? Number(value) || 0 : value } : z))
    );

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
        title="Delivery"
        description="Manage delivery zones and their prices shown on the checkout page."
        breadcrumb={[{ href: "/", label: "Dashboard" }, { href: "/delivery", label: "Delivery" }]}
        actions={<SaveButton onSave={handleSave} />}
      />

      <div className="max-w-4xl space-y-5">
        <Card
          title={`Delivery Zones (${zones.length})`}
          icon={<Truck className="h-4 w-4" />}
          actions={
            <button
              onClick={addZone}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#2a2a4e]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Zone
            </button>
          }
        >
          {zones.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">No zones yet. Click &quot;Add Zone&quot; to create one.</p>
          ) : (
            <div className="space-y-3">
              {zones.map((zone, i) => (
                <div key={zone.id} className="flex items-end gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fdc700] text-xs font-bold text-[#1a1a2e]">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <Field label="Zone Name">
                      <TextInput type="text" value={zone.label} onChange={(e) => updateZone(zone.id, "label", e.target.value)} placeholder="e.g. Inside Dhaka" />
                    </Field>
                  </div>
                  <div className="w-32 shrink-0">
                    <Field label="Price (৳)">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">৳</span>
                        <TextInput
                          type="number"
                          min={0}
                          value={zone.cost}
                          onChange={(e) => updateZone(zone.id, "cost", e.target.value)}
                          className="pl-7"
                          placeholder="0"
                        />
                      </div>
                    </Field>
                  </div>
                  <button onClick={() => removeZone(zone.id)} className="shrink-0 rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {zones.length > 0 && (
          <Card title="Preview — Checkout Page" className="border-dashed border-gray-300 bg-gray-50/60">
            <div className="space-y-2">
              {zones.map((zone, i) => (
                <div
                  key={zone.id}
                  className={`flex items-center justify-between rounded-lg border px-4 py-2.5 ${
                    i === 0 ? "border-[#76B432] bg-[#76B432]/5" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${i === 0 ? "border-[#76B432]" : "border-slate-300"}`}>
                      {i === 0 && <span className="h-2 w-2 rounded-full bg-[#76B432]" />}
                    </span>
                    <span className="text-sm font-medium text-slate-700">{zone.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#76B432]">৳{zone.cost}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700">
          <Truck className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <strong>Tip:</strong> The first zone in the list is selected by default on the checkout page. Zone names can be in Bengali or English.
          </div>
        </div>
      </div>
    </div>
  );
}
