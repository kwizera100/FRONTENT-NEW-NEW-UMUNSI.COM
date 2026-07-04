import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/media`, {
      headers: { "User-Agent": "UmunsiFrontend/1.0", Accept: "application/json" },
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : data.media || []);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
