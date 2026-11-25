export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest) {
  try {
    const msisdn = req.nextUrl.searchParams.get("msisdn") || "";
    const res = await fetch(`${API_BASE}/payment/subscription/restore?msisdn=${encodeURIComponent(msisdn)}`, {
      headers: { Accept: "application/json", "User-Agent": "UmunsiFrontend/1.0" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("restore proxy error:", error);
    return NextResponse.json({ success: false, error: "Restore failed" }, { status: 500 });
  }
}
