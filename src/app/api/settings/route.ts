import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

async function safeJson(res: Response): Promise<any> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  }
  const text = await res.text().catch(() => "");
  try { return JSON.parse(text); } catch { return { message: text.slice(0, 200) }; }
}

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });
    const data = await safeJson(res);
    if (!res.ok) {
      return NextResponse.json({ error: data.error || data.message || "Failed to fetch settings" }, { status: res.status });
    }
    return NextResponse.json(data.data || data);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization") || "";
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    };

    // Try PUT first, then POST if the backend only supports creation
    let res = await fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok && res.status === 404) {
      res = await fetch(`${API_BASE}/settings`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    }

    const data = await safeJson(res);
    if (!res.ok) {
      const errMsg = data.errors?.map((e: any) => e.msg).join(", ") || data.error || data.message || "Failed to save settings";
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }
    return NextResponse.json(data.data || data);
  } catch (error) {
    console.error("Failed to save settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
