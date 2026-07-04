import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: { "User-Agent": "UmunsiFrontend/1.0", Accept: "application/json" },
      next: { revalidate: 600 },
    });
    const data = await res.json();
    return NextResponse.json(data.categories || data);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
