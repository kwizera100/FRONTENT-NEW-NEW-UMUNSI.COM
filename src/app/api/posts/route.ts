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
        "User-Agent": "UmunsiFrontend/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
