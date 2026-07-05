import { NextResponse } from "next/server";

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
        headers: { "User-Agent": "UmunsiFrontend/1.0", Accept: "application/json" },
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
