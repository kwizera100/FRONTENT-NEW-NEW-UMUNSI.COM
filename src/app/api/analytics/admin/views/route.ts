import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "daily";
    const token = request.headers.get("authorization") || "";

    const res = await fetch(`${API_BASE}/analytics/admin/views?range=${encodeURIComponent(range)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({ success: false, error: "Invalid response" }));

    // If backend doesn't support overview, compute from posts total views
    if (range === "overview" && !data.success) {
      const postsRes = await fetch(`${API_BASE}/posts?status=PUBLISHED&limit=1`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
        },
        cache: "no-store",
      });
      const postsData = await postsRes.json().catch(() => ({ success: false }));
      const totalViews = postsData.totalViews ?? postsData.data?.[0]?.totalViews ?? 0;

      return NextResponse.json({
        success: true,
        data: {
          today: 0,
          yesterday: 0,
          thisWeek: 0,
          thisMonth: 0,
          lastMonth: 0,
          lifetime: totalViews,
        },
      });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Admin view analytics proxy error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch view analytics" }, { status: 500 });
  }
}
