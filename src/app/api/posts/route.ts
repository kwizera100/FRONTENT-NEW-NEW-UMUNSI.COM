import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();
  ["category", "featured", "breaking", "trending", "limit", "page", "search", "status", "sortBy", "sortOrder"].forEach((key) => {
    const val = searchParams.get(key);
    if (val) params.set(key, val);
  });

  try {
    const res = await fetch(`${API_BASE}/posts?${params.toString()}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 0 },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization") || "";
    const res = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      const errMsg = data.errors?.map((e: any) => e.msg).join(", ") || data.error || data.message || "Failed to create post";
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
