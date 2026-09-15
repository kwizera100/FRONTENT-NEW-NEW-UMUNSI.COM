import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${API_BASE}/payment/config`, {
      headers: { Accept: "application/json", "User-Agent": "UmunsiFrontend/1.0" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Failed to fetch payment config:", error);
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}
