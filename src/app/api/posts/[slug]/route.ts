import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const res = await fetch(`${API_BASE}/posts/${params.slug}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "application/json" },
      next: { revalidate: 0 },
    });
    const data = await res.json();
    const post = data.data;
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization") || "";
    const res = await fetch(`${API_BASE}/posts/${params.slug}`, {
      method: "PUT",
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
      const errMsg = data.errors?.map((e: any) => e.msg).join(", ") || data.error || data.message || "Failed to update post";
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
