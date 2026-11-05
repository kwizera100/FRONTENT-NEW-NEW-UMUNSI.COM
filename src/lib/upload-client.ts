"use client";

export type UploadProgress = (percent: number) => void;

export function isVideoFile(file: File) {
  return file.type.startsWith("video/");
}

export function isSupportedMediaFile(file: File) {
  return file.type.startsWith("image/") || file.type.startsWith("video/");
}

export function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|m4v|ogv|ogg)(\?[^\s]*)?$/i.test(url) || /\/videos\//i.test(url);
}

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("umunsi_admin_token") || "" : "";
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function putWithProgress(url: string, file: File, onProgress?: UploadProgress) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Storage upload failed (${xhr.status})`)));
    xhr.onerror = () => reject(new Error("Network error while uploading to storage"));
    xhr.send(file);
  });
}

// Uploads a file to Cloudflare R2. Preferred path: ask our API for a signed
// URL and PUT the file directly to R2 (no size limit from Vercel). Fallback:
// POST the file through /api/upload (server-side upload, small files only).
export async function uploadMediaFile(file: File, onProgress?: UploadProgress): Promise<string> {
  if (!isSupportedMediaFile(file)) {
    throw new Error(`Unsupported file type: ${file.name || file.type}`);
  }

  try {
    const presignRes = await fetch("/api/upload/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
    });
    if (presignRes.status === 401) throw new Error("Please log in again to upload media.");
    if (presignRes.ok) {
      const { uploadUrl, url } = await presignRes.json();
      await putWithProgress(uploadUrl, file, onProgress);
      return url as string;
    }
  } catch (err) {
    if (err instanceof Error && /log in/i.test(err.message)) throw err;
    console.warn("Direct R2 upload failed, falling back to server upload:", err);
  }

  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData, headers: authHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed. Please try again.");

  const url: string = data.url || data.media?.[0]?.url || data.data?.url || data.path || "";
  if (!url) throw new Error("Upload failed. Please try again.");
  if (url.startsWith("/")) return `${window.location.origin}${url}`;
  onProgress?.(100);
  return url;
}
