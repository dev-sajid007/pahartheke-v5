"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, GripVertical, Upload, Loader2, Footprints, Link2, Phone, MapPin, ShieldCheck, AtSign } from "lucide-react";
import SaveButton, { useSaveToast } from "@/components/SaveButton";
import { getSectionByType, upsertSection } from "@/lib/api";
import { PageHeader, Card, Field, TextInput, TextArea } from "@/components/ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
  paymentBannerUrl: string;
  copyrightText: string;
}

const DEFAULT: FooterData = {
  logoUrl: "https://pahartheke.com/assets/img/logo.png",
  description: "Online platform revolutionizing food industry by promoting ancient cultivation and sustainable agriculture. Supporting underprivileged hill tract farmers.",
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
  paymentBannerUrl: "",
  copyrightText: "",
};

function ImgUploader({
  currentUrl,
  onUpload,
  label = "Upload Image",
  previewClass = "h-12 w-auto max-w-[200px] object-contain",
}: {
  currentUrl: string;
  onUpload: (url: string) => void;
  label?: string;
  previewClass?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const json = await res.json();
      if (json.success) onUpload(json.data.url);
      else alert(json.message || "Upload failed");
    } catch {
      alert("Upload failed. Is the backend running?");
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentUrl} alt="preview" className={previewClass} />
      )}
      <div className="flex flex-col gap-1">
        <input ref={ref} type="file" accept="image/*" onChange={handle} className="hidden" />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Uploading..." : currentUrl ? "Change" : label}
        </button>
        {currentUrl && (
          <button type="button" onClick={() => onUpload("")} className="text-left text-[10px] text-red-400 hover:text-red-600">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default function FooterPage() {
  const [data, setData] = useState<FooterData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const { showToast, Toast } = useSaveToast();

  useEffect(() => {
    getSectionByType("home", "footer")
      .then((s) => {
        if (s?.content) {
          try {
            setData({ ...DEFAULT, ...JSON.parse(s.content) });
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

  const set = <K extends keyof FooterData>(k: K, v: FooterData[K]) => setData((d) => ({ ...d, [k]: v }));

  const addItem = (key: "quickLinks" | "policies") =>
    set(key, [...data[key], { id: Date.now(), label: key === "quickLinks" ? "New Link" : "New Policy", href: "/" }]);
  const removeItem = (key: "quickLinks" | "policies", id: number) =>
    set(key, data[key].filter((l) => l.id !== id));
  const updateItem = (key: "quickLinks" | "policies", id: number, field: "label" | "href", value: string) =>
    set(key, data[key].map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-[#fdc700]" />
      </div>
    );
  }

  const LinkListCard = ({ title, icon, items, onAdd, onRemove, onUpdate }: {
    title: string;
    icon: React.ReactNode;
    items: LinkItem[];
    onAdd: () => void;
    onRemove: (id: number) => void;
    onUpdate: (id: number, field: "label" | "href", value: string) => void;
  }) => (
    <Card
      title={`${title} (${items.length})`}
      icon={icon}
      actions={
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#2a2a4e]">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      }
    >
      <div className="space-y-3">
        {items.map((link, i) => (
          <div key={link.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <div className="flex shrink-0 items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-300" />
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fdc700] text-xs font-bold text-[#1a1a2e]">
                {i + 1}
              </span>
            </div>
            <TextInput type="text" value={link.label} onChange={(e) => onUpdate(link.id, "label", e.target.value)} placeholder="Label" />
            <TextInput type="text" value={link.href} onChange={(e) => onUpdate(link.id, "href", e.target.value)} className="w-40" placeholder="/path" />
            <button onClick={() => onRemove(link.id)} className="shrink-0 rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">No items yet.</p>
        )}
      </div>
    </Card>
  );

  return (
    <div>
      {Toast}
      <PageHeader
        title="Footer Content"
        description="Manage the footer section shown on all pages."
        breadcrumb={[{ href: "/", label: "Dashboard" }, { href: "/footer", label: "Footer" }]}
        actions={<SaveButton onSave={handleSave} />}
      />

      <div className="max-w-4xl space-y-5">
        <Card title="Brand" icon={<Footprints className="h-4 w-4" />}>
          <div className="space-y-4">
            <Field label="Logo">
              <ImgUploader currentUrl={data.logoUrl} onUpload={(url) => set("logoUrl", url)} label="Upload Logo" previewClass="h-10 w-auto max-w-[180px] rounded bg-gray-100 p-1 object-contain" />
            </Field>
            <Field label="Description">
              <TextArea value={data.description} onChange={(e) => set("description", e.target.value)} rows={3} />
            </Field>
          </div>
        </Card>

        <Card title="Payment Banner" icon={<Footprints className="h-4 w-4" />} description="The payment methods banner shown above the footer.">
          <ImgUploader currentUrl={data.paymentBannerUrl} onUpload={(url) => set("paymentBannerUrl", url)} label="Upload Banner" previewClass="h-10 w-auto max-w-full rounded bg-gray-100 p-1 object-contain" />
        </Card>

        <Card title="Social Links" icon={<AtSign className="h-4 w-4" />}>
          <div className="space-y-4">
            <Field label="Facebook URL">
              <TextInput type="text" value={data.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} />
            </Field>
            <Field label="Instagram URL">
              <TextInput type="text" value={data.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} />
            </Field>
            <Field label="YouTube URL">
              <TextInput type="text" value={data.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} />
            </Field>
          </div>
        </Card>

        <LinkListCard
          title="Quick Links"
          icon={<Link2 className="h-4 w-4" />}
          items={data.quickLinks}
          onAdd={() => addItem("quickLinks")}
          onRemove={(id) => removeItem("quickLinks", id)}
          onUpdate={(id, field, value) => updateItem("quickLinks", id, field, value)}
        />

        <LinkListCard
          title="Policies"
          icon={<ShieldCheck className="h-4 w-4" />}
          items={data.policies}
          onAdd={() => addItem("policies")}
          onRemove={(id) => removeItem("policies", id)}
          onUpdate={(id, field, value) => updateItem("policies", id, field, value)}
        />

        <Card title="Contact Information" icon={<Phone className="h-4 w-4" />}>
          <div className="space-y-4">
            <Field label="Address">
              <TextArea value={data.address} onChange={(e) => set("address", e.target.value)} rows={3} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone">
                <TextInput type="text" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field label="Email">
                <TextInput type="text" value={data.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
            </div>
            <Field label="Google Maps Embed URL" hint="Paste the full maps embed iframe URL (…/maps/embed?pb=…).">
              <TextInput type="text" value={data.mapEmbedUrl} onChange={(e) => set("mapEmbedUrl", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
            </Field>
          </div>
        </Card>

        <Card title="Copyright" icon={<MapPin className="h-4 w-4" />}>
          <Field label="Copyright Text" hint="Leave empty to auto-generate with the current year.">
            <TextInput type="text" value={data.copyrightText} onChange={(e) => set("copyrightText", e.target.value)} placeholder="© 2026 Pahar Theke. All rights reserved." />
          </Field>
        </Card>

        <Card title="Preview" className="border-dashed border-gray-300 bg-gray-50/60">
          <div className="space-y-3 rounded-lg bg-[#171F24] p-5 text-white">
            {data.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoUrl} alt="logo" className="h-8 w-auto object-contain" />
            )}
            <p className="text-xs leading-relaxed text-gray-400">{data.description}</p>
            <p className="whitespace-pre-line text-xs text-gray-400">{data.address}</p>
            <p className="text-xs text-gray-400">
              {data.phone} | {data.email}
            </p>
            {data.copyrightText && (
              <p className="border-t border-gray-700 pt-2 text-[10px] text-gray-500">{data.copyrightText}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
