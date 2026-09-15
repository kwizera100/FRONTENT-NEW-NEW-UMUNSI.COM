import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  try {
    const res = await fetch(`${API_BASE}/payment/admin/config`, {
      headers: { Authorization: auth, Accept: "application/json", "User-Agent": "UmunsiFrontend/1.0" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Failed to fetch admin payment config:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/payment/admin/config`, {
      method: "PUT",
      headers: { Authorization: auth, "Content-Type": "application/json", Accept: "application/json", "User-Agent": "UmunsiFrontend/1.0" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Failed to save payment config:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
