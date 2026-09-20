import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = req.headers.get("authorization") || "";
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/comments/${params.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth, Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Failed to reply to comment:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
