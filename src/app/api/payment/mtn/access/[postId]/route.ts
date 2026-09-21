import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const ref = req.nextUrl.searchParams.get("ref") || "";
    const res = await fetch(
      `${API_BASE}/payment/mtn/access/${encodeURIComponent(params.postId)}?ref=${encodeURIComponent(ref)}`,
      { headers: { Accept: "application/json", "User-Agent": "UmunsiFrontend/1.0" }, cache: "no-store" }
    );
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("MTN access proxy error:", error);
    return NextResponse.json({ success: false, error: "Access check failed" }, { status: 500 });
  }
}
