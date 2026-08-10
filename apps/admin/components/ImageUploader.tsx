"use client";

import { useState, useRef, useId } from "react";
import { Upload, X, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Props {
  currentUrl: string;
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
}

export default function ImageUploader({ currentUrl, onUpload, accept = "image/*", label = "Upload" }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        onUpload(json.data.url);
      } else {
        alert(json.message || "Upload failed");
      }
    } catch {
      alert("Upload failed. Is the backend running?");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
        id={uid}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Upload className="h-3.5 w-3.5" />
        )}
        {uploading ? "Uploading..." : label}
      </button>
      {currentUrl && (
        <a href={currentUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 truncate max-w-[200px] hover:underline">
          {currentUrl.split("/").pop()}
        </a>
      )}
    </div>
  );
}
