import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function proxyTip(req: NextRequest, backendPath: string) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const init: RequestInit = {
      method: req.method,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(req.method !== "GET" ? { "Content-Type": "application/json" } : {}),
      },
      cache: "no-store",
    };
    if (req.method !== "GET") init.body = await req.text();
    const res = await fetch(`${API_BASE}/tips${backendPath}`, init);
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Tips proxy error:", error);
    return NextResponse.json({ success: false, error: "Request failed" }, { status: 500 });
  }
}
