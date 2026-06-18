"use client";

import { useState, useEffect, useRef } from "react";
import { Store, Receipt, Lock, Save, Upload, X } from "lucide-react";
import api from "@/lib/axios";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("store");
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "",
    contactPhone: "",
    storeAddress: "",
    invoicePrefix: "",
    taxRate: 0,
    invoiceFooterMessage: "",
    logo: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      if (res.data.data) {
        setSettings(res.data.data);
        if (res.data.data.logo) {
          setLogoPreview(res.data.data.logo.startsWith("http") ? res.data.data.logo : `${BASE_URL}${res.data.data.logo}`);
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("storeName", settings.storeName);
      formData.append("contactPhone", settings.contactPhone);
      formData.append("storeAddress", settings.storeAddress);
      formData.append("invoicePrefix", settings.invoicePrefix);
      formData.append("taxRate", settings.taxRate);
      formData.append("invoiceFooterMessage", settings.invoiceFooterMessage);
      
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await api.put("/settings", formData);
      
      alert("Settings saved successfully!");
      fetchSettings(); // Refresh to get the actual logo URL from server
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Settings</h1>
        <p className="text-sm text-sidebar-foreground mt-1">
          Manage your store preferences, invoice templates, and security.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 custom-scrollbar">
            {[
              { id: "store", name: "Store Details", icon: Store },
              { id: "invoice", name: "Invoice & Tax", icon: Receipt },
              { id: "security", name: "Security", icon: Lock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSave} className="space-y-8">
              
              {activeTab === "store" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Store Information</h2>
                    <p className="text-sm text-sidebar-foreground mb-6">Update your business details and logo.</p>
                  </div>
                  
                  <div className="flex items-center gap-6 pb-6 border-b border-border">
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="relative flex h-32 w-32 items-center justify-center rounded-2xl bg-sidebar-accent border-2 border-dashed border-border text-sidebar-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 cursor-pointer overflow-hidden group"
                    >
                      {logoPreview ? (
                        <>
                          <img src={logoPreview} alt="Store Logo" className="h-full w-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Upload className="h-6 w-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-6 w-6 mb-2 text-sidebar-foreground/70" />
                          <span className="text-xs font-medium">Upload Logo</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                    <div className="text-sm text-sidebar-foreground">
                      <p className="font-bold text-foreground">Store Logo</p>
                      <p>Recommended size: 512x512px</p>
                      <p>Max file size: 2MB (PNG, JPG, WEBP)</p>
                      {logoFile && (
                        <button 
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(settings.logo ? `${BASE_URL}${settings.logo}` : null);
                          }}
                          className="mt-2 text-xs font-bold text-rose-500 flex items-center gap-1 hover:underline"
                        >
                          <X className="h-3 w-3" /> Remove Selection
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Store Name</label>
                      <input 
                        type="text" 
                        name="storeName"
                        value={settings.storeName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Contact Phone</label>
                      <input 
                        type="text" 
                        name="contactPhone"
                        value={settings.contactPhone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Store Address</label>
                      <textarea 
                        rows={3} 
                        name="storeAddress"
                        value={settings.storeAddress}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "invoice" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Invoice & Tax Settings</h2>
                    <p className="text-sm text-sidebar-foreground mb-6">Configure how your receipts look and tax rules.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Invoice Prefix</label>
                      <input 
                        type="text" 
                        name="invoicePrefix"
                        value={settings.invoicePrefix}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Tax Rate (%)</label>
                      <input 
                        type="number" 
                        name="taxRate"
                        value={settings.taxRate}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Invoice Footer Message</label>
                      <textarea 
                        rows={2} 
                        name="invoiceFooterMessage"
                        value={settings.invoiceFooterMessage}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
                    <p className="text-sm text-sidebar-foreground mb-6">Update your admin credentials.</p>
                  </div>
                  <p className="text-sm text-sidebar-foreground italic">Admin security features.</p>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-border mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:bg-blue-600 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Settings"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
