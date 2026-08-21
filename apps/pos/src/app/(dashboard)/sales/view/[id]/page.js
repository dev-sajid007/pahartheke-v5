"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft, Download, Mail, Phone, MapPin, Globe, Award } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

export default function SaleViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [sale, setSale] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:7104/api").replace("/api", "");

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      if (res.data.data) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const fetchSaleDetails = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/sales/${id}`);
      if (res.data.data) {
        setSale(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch sale details", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSaleDetails();
      fetchSettings();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-xl font-bold text-foreground">Sale not found</p>
        <Link href="/sales/history" className="text-primary hover:underline">Back to Sales History</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header Actions - Hidden on Print */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/sales/history" className="rounded-full p-1.5 hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">View Invoice</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-blue-600"
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Container - A5 Landscape simulation (Half A4) */}
      <div className="mx-auto w-full max-w-[800px] overflow-x-auto print-root">
        <div 
          id="invoice-content"
          className="min-w-[700px] bg-white text-black p-6 shadow-xl border border-border print:shadow-none print:border-none print:p-0 print:m-0 mx-auto"
        >
          {/* Invoice Header */}
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
              <h2 className="text-2xl font-black text-gray-200 uppercase tracking-widest mb-1">INVOICE</h2>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-gray-500">Invoice Number</p>
                <p className="text-sm font-black text-primary">#{sale.invoiceNo}</p>
                <p className="text-[9px] font-bold">{new Date(sale.order_date || sale.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Customer & Billing Info */}
          <div className="grid grid-cols-2 gap-10 py-6">
            <div>
              <h3 className="text-[8px] font-black uppercase tracking-widest text-primary mb-1 border-b border-primary/20 pb-0.5 w-fit">Bill To</h3>
              {sale.customer ? (
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-gray-800">{sale.customer.name}</p>
                  <p className="text-xs font-bold text-gray-600">{sale.customer.phone}</p>
                  {sale.customer.address && (
                    <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" /> {sale.customer.address}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm font-black text-gray-400">Walk-in Customer</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 min-w-[150px]">
                <div className="space-y-1">
                   <div className="flex justify-between items-center text-[10px]">
                       <span className="text-gray-500 font-bold">Status</span>
                       <span className={`px-2 py-0.5 rounded-full font-black text-[8px] uppercase ${sale.dueAmount === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                         {sale.dueAmount === 0 ? 'Paid' : 'Due'}
                       </span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] mt-1">
                     <span className="text-gray-500 font-bold">Source</span>
                     <span className={`px-2 py-0.5 rounded-full font-black text-[8px] uppercase ${sale.source === "website" ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                       {sale.source === "website" ? "Website" : "POS"}
                     </span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sale Items Table */}
          <div className="flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-2 font-black uppercase text-[10px] rounded-tl-lg">Item</th>
                  <th className="px-4 py-2 font-black uppercase text-[10px] text-center">Rate</th>
                  <th className="px-4 py-2 font-black uppercase text-[10px] text-center">Disc</th>
                  <th className="px-4 py-2 font-black uppercase text-[10px] text-center">QTY</th>
                  <th className="px-4 py-2 font-black uppercase text-[10px] text-right rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-x border-b border-gray-100">
                {sale.items.map((item, idx) => {
                  const baseTotal = item.salePrice * item.quantity;
                  let discAmount = 0;
                  if (item.itemDiscountType === "Percentage") {
                    discAmount = baseTotal * (item.itemDiscount || 0) / 100;
                  } else if (item.itemDiscountType === "Fixed") {
                    discAmount = item.itemDiscount || 0;
                  }
                  const lineTotal = Math.round((baseTotal - discAmount) * 100) / 100;
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="px-4 py-2">
                        <p className="font-black text-gray-800 text-xs">{item.product?.name || item.name || 'Unknown Product'}</p>
                        {item.variantName && <p className="text-[9px] font-bold text-primary uppercase tracking-tight">{item.variantName}</p>}
                      </td>
                      <td className="px-4 py-2 text-center font-bold text-gray-600 text-xs">৳{item.salePrice}</td>
                      <td className="px-4 py-2 text-center font-bold text-gray-600 text-xs">{discAmount > 0 ? `-৳${discAmount}` : '—'}</td>
                      <td className="px-4 py-2 text-center font-bold text-gray-600 text-xs">{item.quantity}</td>
                      <td className="px-4 py-2 text-right font-black text-gray-800 text-xs">৳{lineTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Order Notes */}
          {sale.note && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Order Notes</p>
              <p className="text-[10px] font-medium text-gray-600">{sale.note}</p>
            </div>
          )}

          {/* Totals Section */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-[250px] space-y-1">
              <div className="flex justify-between items-center text-gray-600 text-[10px]">
                <span className="font-bold uppercase tracking-widest">Subtotal</span>
                  <span className="font-bold">৳{sale.subtotal || 0}</span>
              </div>
              {sale.badgeName && (
                <div className="flex justify-between items-center text-primary text-[10px]">
                  <span className="font-black uppercase tracking-widest flex items-center gap-1">
                    <Award className="h-2 w-2" /> {sale.badgeName} Reward
                  </span>
                  <span className="font-black">- ৳{sale.badgeDiscount || 0}</span>
                </div>
              )}
              {sale.discount > (sale.badgeDiscount || 0) && (
                <div className="flex justify-between items-center text-rose-500 text-[10px]">
                  <span className="font-bold uppercase tracking-widest">Additional Discount</span>
                  <span className="font-bold">- ৳{sale.discount - (sale.badgeDiscount || 0)}</span>
                </div>
              )}
              {sale.shippingCost > 0 && (
                <div className="flex justify-between items-center text-sky-600 text-[10px]">
                  <span className="font-bold uppercase tracking-widest">Shipping</span>
                  <span className="font-bold">+ ৳{sale.shippingCost || 0}</span>
                </div>
              )}
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-black uppercase text-xs tracking-widest text-primary">Total</span>
                  <span className="text-xl font-black text-primary">৳{sale.grandTotal || 0}</span>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex justify-between items-center text-emerald-600 text-[10px]">
                  <span className="font-bold uppercase tracking-widest">Paid</span>
                  <span className="font-black">৳{sale.paidAmount || 0}</span>
                </div>
                {sale.dueAmount > 0 && (
                  <div className="flex justify-between items-center text-rose-600 text-[10px]">
                    <span className="font-bold uppercase tracking-widest">Due</span>
                    <span className="font-black">৳{sale.dueAmount || 0}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-10 pt-4 border-t border-gray-100 flex justify-between items-end">
            <div>
              <p className="text-[8px] text-gray-400 font-bold max-w-[300px]">
                 {settings?.invoiceFooterMessage || "Thank you for your business!"}
              </p>
            </div>
            <div className="text-right">
              <div className="h-10 w-32 border-b border-gray-200 mb-1"></div>
              <p className="text-[8px] font-black uppercase text-gray-400">Signature</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }

          /* Hide sidebar, header, and other UI */
          body * {
            visibility: hidden;
          }

          /* Show only invoice content */
          #invoice-content,
          #invoice-content * {
            visibility: visible !important;
          }

          #invoice-content {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 5mm;
            box-shadow: none !important;
            border: none !important;
          }

          @page {
            size: A5 landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
