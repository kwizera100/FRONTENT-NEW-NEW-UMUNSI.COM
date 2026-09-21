import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(_req: NextRequest, { params }: { params: { referenceId: string } }) {
  try {
    const res = await fetch(`${API_BASE}/payment/mtn/status/${encodeURIComponent(params.referenceId)}`, {
      headers: { Accept: "application/json", "User-Agent": "UmunsiFrontend/1.0" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("MTN status proxy error:", error);
    return NextResponse.json({ success: false, error: "Status check failed" }, { status: 500 });
  }
}
