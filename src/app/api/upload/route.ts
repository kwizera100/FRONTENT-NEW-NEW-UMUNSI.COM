import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";
const SERVER_BASE = "https://api.umunsi.com";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Use JPEG, PNG, WebP, GIF, or SVG.` },
        { status: 415 }
      );
    }

    const forwardFormData = new FormData();
    forwardFormData.append("file", file);

    const authHeader = req.headers.get("authorization") || "";
    const uploadHeaders: Record<string, string> = {
      "User-Agent": "UmunsiFrontend/1.0",
    };
    if (authHeader) {
      uploadHeaders["Authorization"] = authHeader;
    }

    const res = await fetch(`${API_BASE}/media/upload`, {
      method: "POST",
      body: forwardFormData,
      headers: uploadHeaders,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "Upload failed");
      console.error("Backend upload error:", res.status, errText);
      return NextResponse.json(
        { error: `Backend upload failed (${res.status})` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const imageUrl = data.url || data.data?.url || data.path || data.data?.path || "";

    let fullUrl = imageUrl;
    if (imageUrl && !imageUrl.startsWith("http")) {
      fullUrl = `${SERVER_BASE}${imageUrl}`;
    }

    return NextResponse.json({ url: fullUrl, original: data });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
