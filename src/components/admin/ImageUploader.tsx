"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X, Image as ImageIcon, Link2, CheckCircle2 } from "lucide-react";

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  onClose?: () => void;
  showUrlOption?: boolean;
  compact?: boolean;
}

export function ImageUploader({ onUploadComplete, onClose, showUrlOption = true, compact = false }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Allowed file types: JPEG, PNG, WebP, GIF");
      setUploading(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum 10MB.");
      setUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("umunsi_admin_token") : "";
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed. Please try again.");
        setUploading(false);
        return;
      }

      onUploadComplete(data.url);
      setUploading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUploadComplete(urlInput.trim());
      setUrlInput("");
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2.5 bg-ink-100 hover:bg-ink-200 text-ink-600 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode tabs */}
      {showUrlOption && (
        <div className="flex gap-2 p-1 bg-ink-50 rounded-xl">
          <button
            onClick={() => setMode("upload")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
              mode === "upload" ? "bg-white text-brand-600 shadow-sm" : "text-ink-400"
            }`}
          >
            <Upload className="w-4 h-4" /> Upload from Device
          </button>
          <button
            onClick={() => setMode("url")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
              mode === "url" ? "bg-white text-brand-600 shadow-sm" : "text-ink-400"
            }`}
          >
            <Link2 className="w-4 h-4" /> Image URL
          </button>
        </div>
      )}

      {/* Upload mode */}
      {mode === "upload" && (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-brand-500 bg-brand-50"
                : "border-ink-200 hover:border-brand-400 hover:bg-ink-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
                <p className="text-sm font-semibold text-ink-600">Uploading image...</p>
              </div>
            ) : preview ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-green-600">Image uploaded successfully!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-brand-600" />
                </div>
                <div>
                  <p className="font-bold text-ink-700 text-sm">
                    Drag an image here or click to select
                  </p>
                  <p className="text-xs text-ink-400 mt-1">
                    JPEG, PNG, WebP, GIF — 10MB max
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-semibold">{error}</p>
            </div>
          )}
        </>
      )}

      {/* URL mode */}
      {mode === "url" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/ifoto.jpg"
              className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none text-sm"
            />
            <button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-colors"
            >
              Confirm
            </button>
          </div>
          {urlInput && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-ink-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlInput} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
