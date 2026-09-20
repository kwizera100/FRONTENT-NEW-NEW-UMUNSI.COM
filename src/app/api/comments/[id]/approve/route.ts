import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = req.headers.get("authorization") || "";
  try {
    const res = await fetch(`${API_BASE}/comments/${params.id}/approve`, {
      method: "PATCH",
      headers: { Authorization: auth, Accept: "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Failed to approve comment:", error);
    return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
  }
}
