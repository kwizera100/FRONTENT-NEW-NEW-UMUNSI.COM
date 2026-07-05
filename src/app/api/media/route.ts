import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const headers: Record<string, string> = {
      "User-Agent": "UmunsiFrontend/1.0",
      "Accept": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    const res = await fetch(`${API_BASE}/media`, {
      headers,
      next: { revalidate: 0 },
    });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : data.media || data.data || []);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
