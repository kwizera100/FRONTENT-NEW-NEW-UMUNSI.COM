import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const authHeader = req.headers.get("authorization") || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
    };
    if (authHeader) headers["Authorization"] = authHeader;

    // Try PUT first, then PATCH if backend uses PATCH
    let res = await fetch(`${API_BASE}/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok && res.status === 404) {
      res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      });
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const errMsg = data.errors?.map((e: any) => e.msg).join(", ") || data.error || data.message || "Failed to update user";
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
