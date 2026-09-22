import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const res = await fetch(`${API_BASE}/admin/ads-banners`, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json", Authorization: auth },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const body = await req.json();
  const res = await fetch(`${API_BASE}/admin/ads-banners`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
      Authorization: auth,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
