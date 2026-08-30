import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    // Forward the visitor's real User-Agent so the backend can detect bots/crawlers.
    // If no UA is present, send a generic browser UA (but the backend will treat
    // empty UAs as bots anyway).
    const visitorUA = req.headers.get("user-agent") || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    const res = await fetch(`${API_BASE}/analytics/article/${encodeURIComponent(params.id)}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": visitorUA,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({ error: "Invalid response" }));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Article view proxy error:", error);
    return NextResponse.json({ error: "Failed to track article view" }, { status: 500 });
  }
}
