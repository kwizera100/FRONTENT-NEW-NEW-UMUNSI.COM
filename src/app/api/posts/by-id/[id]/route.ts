import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const id = params.id;

    // Primary: backend tries exact ID, then exact slug
    const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(id)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: "no-store",
    });
    const data = await res.json();
    if (res.ok && (data.data || data)) {
      return NextResponse.json(data.data || data);
    }

    // Fallback: search by the id/slug as a keyword and return the best match
    try {
      const searchRes = await fetch(`${API_BASE}/posts?search=${encodeURIComponent(id)}&limit=20`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        cache: "no-store",
      });
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const posts = searchData.data || [];
        const match = posts.find(
          (p: any) =>
            p.id === id ||
            p.slug === id ||
            String(p.title).toLowerCase().includes(String(id).toLowerCase().replace(/-/g, " "))
        );
        if (match) {
          return NextResponse.json(match);
        }
      }
    } catch {}

    return NextResponse.json({ error: data.error || "Post not found" }, { status: res.status });
  } catch (error) {
    console.error("Failed to fetch post by id:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
