import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ news: [] });
  }

  try {
    const res = await fetch(`${API_BASE}/news?search=${encodeURIComponent(q)}&status=PUBLISHED&limit=20`, {
      headers: { "User-Agent": "UmunsiFrontend/1.0", Accept: "application/json" },
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return NextResponse.json({ posts: data.news || [] });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
