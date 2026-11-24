export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${API_BASE}/payment/subscription/me`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "UmunsiFrontend/1.0",
        Authorization: req.headers.get("authorization") || "",
      },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("subscription/me proxy error:", error);
    return NextResponse.json({ success: false, error: "Check failed" }, { status: 500 });
  }
}
