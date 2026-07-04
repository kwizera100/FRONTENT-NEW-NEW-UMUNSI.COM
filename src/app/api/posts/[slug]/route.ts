import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const res = await fetch(`${API_BASE}/news?search=${params.slug}&limit=1`, {
      headers: { "User-Agent": "UmunsiFrontend/1.0", Accept: "application/json" },
      next: { revalidate: 300 },
    });
    const data = await res.json();
    const post = data.news?.find((p: any) => p.slug === params.slug);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
