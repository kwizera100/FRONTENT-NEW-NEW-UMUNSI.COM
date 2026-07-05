import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";
const SERVER_BASE = "https://api.umunsi.com";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    const res = await fetch(`${API_BASE}/upload/list`, {
      headers,
      next: { revalidate: 0 },
    });
    const data = await res.json();
    const media = Array.isArray(data) ? data : data.media || data.data || [];
    const withFullUrls = media.map((m: any) => ({
      ...m,
      url: m.url && !m.url.startsWith("http") ? `${SERVER_BASE}${m.url}` : m.url,
    }));
    return NextResponse.json(withFullUrls);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
