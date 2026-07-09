import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const res = await fetch(`${API_BASE}/posts/${params.id}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      next: { revalidate: 0 },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Post not found" }, { status: res.status });
    }
    return NextResponse.json(data.data || data);
  } catch (error) {
    console.error("Failed to fetch post by id:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
