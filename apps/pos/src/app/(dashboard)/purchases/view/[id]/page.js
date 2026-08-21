"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Printer, ArrowLeft, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

export default function PurchaseViewPage() {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:7104/api").replace("/api", "");

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      if (res.data.data) setSettings(res.data.data);
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const fetchPurchase = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/purchases/${id}`);
      if (res.data.data) setPurchase(res.data.data);
    } catch (error) {
      console.error("Failed to fetch purchase", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPurchase();
      fetchSettings();
    }
  }, [id]);

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-xl font-bold text-foreground">Purchase not found</p>
        <Link href="/purchases" className="text-primary hover:underline">Back to Purchases</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/purchases" className="rounded-full p-1.5 hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Purchase Details</h1>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-blue-600"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>

      <div className="mx-auto w-full max-w-[800px] overflow-x-auto">
        <div id="invoice-content" className="min-w-[700px] bg-white text-black p-6 shadow-xl border border-border print:shadow-none print:border-none print:p-0 print:m-0 mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-primary pb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {settings?.logo ? (
                  <img src={settings?.logo?.startsWith("http") ? settings.logo : `${BASE_URL}${settings?.logo || ''}`} alt="Logo" className="h-12 w-auto object-contain" />
                ) : (
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-black">
                    {settings?.storeName?.charAt(0) || "P"}
                  </div>
                )}
                <h1 className="text-xl font-black tracking-tighter text-primary uppercase">
                  {settings?.storeName || "PAHAR POS"}
                </h1>
              </div>
              <div className="space-y-0.5 text-[10px] text-gray-600 font-medium">
                <p className="flex items-center gap-1"><MapPin className="h-2 w-2" /> {settings?.storeAddress || "Bandarban Sadar, Chittagong"}</p>
                <p className="flex items-center gap-1"><Phone className="h-2 w-2" /> {settings?.contactPhone || "+880 1234 567890"}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-gray-200 uppercase tracking-widest mb-1">PURCHASE</h2>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-gray-500">Invoice Number</p>
                <p className="text-sm font-black text-primary">#{purchase.invoiceNo}</p>
                <p className="text-[9px] font-bold">{new Date(purchase.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Supplier */}
          <div className="py-6">
            <h3 className="text-[8px] font-black uppercase tracking-widest text-primary mb-1 border-b border-primary/20 pb-0.5 w-fit">Supplier</h3>
            {purchase.supplier ? (
              <div className="space-y-0.5 mt-1">
                <p className="text-sm font-black text-gray-800">{purchase.supplier.companyName || purchase.supplier.name}</p>
                <p className="text-xs font-bold text-gray-600">{purchase.supplier.phone}</p>
              </div>
            ) : (
              <p className="text-sm font-black text-gray-400 mt-1">No supplier</p>
            )}
          </div>

          {/* Items Table */}
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-2 font-black uppercase text-[10px] rounded-tl-lg">Item</th>
                <th className="px-4 py-2 font-black uppercase text-[10px] text-center">QTY</th>
                <th className="px-4 py-2 font-black uppercase text-[10px] text-right">Unit Cost</th>
                <th className="px-4 py-2 font-black uppercase text-[10px] text-right rounded-tr-lg">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-x border-b border-gray-100">
              {purchase.items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3">
                    <p className="font-black text-gray-800 text-xs">{item.product?.name || 'Unknown Product'}</p>
                    {item.variantId && item.product?.variants?.find(v => v.variantId === item.variantId) && (
                      <p className="text-[9px] font-bold text-primary uppercase tracking-tight">
                        {item.product.variants.find(v => v.variantId === item.variantId).name}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-600 text-xs">{item.quantity}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-600 text-xs">৳{item.purchasePrice}</td>
                  <td className="px-4 py-3 text-right font-black text-gray-800 text-xs">৳{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Additional Costs */}
          {purchase.additionalCosts?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Additional Costs</h4>
              {purchase.additionalCosts.map((cost, idx) => (
                <div key={idx} className="flex justify-between text-[10px] py-1">
                  <span className="font-bold text-gray-600">{cost.name}</span>
                  <span className="font-black text-gray-800">৳{cost.amount}</span>
                </div>
              ))}
            </div>
          )}

          {purchase.note && (
            <div className="mt-4 text-[10px] text-gray-500 italic font-medium">
              Note: {purchase.note}
            </div>
          )}

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-[250px] space-y-1">
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-black uppercase text-xs tracking-widest text-primary">Total</span>
                <span className="text-xl font-black text-primary">৳{purchase.totalAmount}</span>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex justify-between items-center text-emerald-600 text-[10px]">
                  <span className="font-bold uppercase tracking-widest">Paid</span>
                  <span className="font-black">৳{purchase.paidAmount || 0}</span>
                </div>
                {purchase.dueAmount > 0 && (
                  <div className="flex justify-between items-center text-rose-600 text-[10px]">
                    <span className="font-bold uppercase tracking-widest">Due</span>
                    <span className="font-black">৳{purchase.dueAmount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; background: white !important; }
          body * { visibility: hidden; }
          #invoice-content, #invoice-content * { visibility: visible !important; }
          #invoice-content { position: fixed; left: 0; top: 0; width: 100%; padding: 5mm; box-shadow: none !important; border: none !important; }
          @page { size: A5 landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
}
