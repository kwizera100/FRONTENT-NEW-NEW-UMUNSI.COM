import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({ error: "Invalid response" }));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Reset password proxy error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
