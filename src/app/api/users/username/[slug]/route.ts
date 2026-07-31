import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const username = params.slug;
    const res = await fetch(`${API_BASE}/users`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "User not found" }, { status: res.status });
    }

    const data = await res.json();
    const users = Array.isArray(data) ? data : data.data || data.users || [];
    const user = users.find((u: any) => u.username === username || u.id === username);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user by username:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
