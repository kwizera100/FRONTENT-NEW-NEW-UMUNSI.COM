import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET() {
  try {
    const all: any[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const url = new URL(`${API_BASE}/categories`);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", "100");

      const res = await fetch(url.toString(), {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "application/json" },
        next: { revalidate: 600 },
      });
      const data = await res.json();
      const cats = data.categories || data;
      if (Array.isArray(cats)) all.push(...cats);
      if (data.pagination?.totalPages) totalPages = data.pagination.totalPages;
      else break;
      page++;
    }

    return NextResponse.json(all);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization") || "";
    const res = await fetch(`${API_BASE}/categories`, {
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
      const errMsg = data.errors?.map((e: any) => e.msg).join(", ") || data.error || data.message || "Failed to create category";
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
