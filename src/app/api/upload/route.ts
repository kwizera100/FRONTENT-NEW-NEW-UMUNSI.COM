import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { R2_BUCKET, buildObjectKey, getR2Client, isAllowedMediaType, isR2Configured, publicUrlForKey } from "@/lib/r2";
import { verifyUploadToken } from "@/lib/upload-auth";

export const runtime = "nodejs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";
const SERVER_BASE = "https://api.umunsi.com";

// Server-side upload. Primary target is Cloudflare R2; the legacy VPS backend
// (/uploads on api.umunsi.com) is only used when R2 is not configured.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!isAllowedMediaType(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Please upload an image or video.` },
        { status: 415 }
      );
    }

    const authHeader = req.headers.get("authorization") || "";

    if (isR2Configured()) {
      if (!(await verifyUploadToken(authHeader))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const key = buildObjectKey(file.name || "upload", file.type);
      const bytes = Buffer.from(await file.arrayBuffer());
      await getR2Client().send(
        new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: bytes, ContentType: file.type, CacheControl: "public, max-age=31536000, immutable" })
      );
      return NextResponse.json({ url: publicUrlForKey(key), key, storage: "r2" });
    }

    return legacyBackendUpload(file, authHeader);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

async function legacyBackendUpload(file: File, authHeader: string) {
  const uploadHeaders: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
  };
  if (authHeader) uploadHeaders["Authorization"] = authHeader;

  let res: Response | null = null;
  for (const field of ["file", "files", "image"]) {
    const fd = new FormData();
    fd.append(field, file);
    res = await fetch(`${API_BASE}/media/upload`, { method: "POST", body: fd, headers: uploadHeaders });
    if (res.ok) break;
    const errText = await res.text().catch(() => "Upload failed");
    console.error(`Backend upload error (field=${field}, /media/upload):`, res.status, errText);
  }

  if (!res || !res.ok) {
    const errText = res ? await res.text().catch(() => "Upload failed") : "Upload failed";
    return NextResponse.json(
      { error: `Backend upload failed (${res?.status ?? 500}): ${errText.slice(0, 200)}` },
      { status: res?.status ?? 500 }
    );
  }

  const contentType = res.headers.get("content-type") || "";
  let data: any;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    try { data = JSON.parse(text); } catch { data = { url: text.trim() }; }
  }

  const imageUrl = data.url || data.data?.url || data.path || data.data?.path || (Array.isArray(data.media) && data.media[0]?.url) || "";
  const fullUrl = imageUrl && !imageUrl.startsWith("http") ? `${SERVER_BASE}${imageUrl}` : imageUrl;
  return NextResponse.json({ url: fullUrl, original: data, storage: "legacy" });
}
