"use client";

import { useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface ToastMsg {
  type: ToastType;
  text: string;
}

interface Props {
  onSave: () => Promise<void>;
  label?: string;
}

export function useSaveToast() {
  const [toast, setToast] = useState<ToastMsg | null>(null);

  const showToast = (type: ToastType, text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const Toast = toast ? (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-xl text-sm font-medium transition-all ${
        toast.type === "success"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle className="h-5 w-5 shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0" />
      )}
      {toast.text}
      <button onClick={() => setToast(null)}>
        <X className="h-4 w-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  ) : null;

  return { showToast, Toast };
}

export default function SaveButton({ onSave, label = "Save Changes" }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onSave();
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg bg-[#fdc700] px-5 py-2.5 text-sm font-semibold text-[#1a1a2e] transition hover:bg-[#e6b400] disabled:opacity-60"
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      {loading ? "Saving..." : label}
    </button>
  );
}
