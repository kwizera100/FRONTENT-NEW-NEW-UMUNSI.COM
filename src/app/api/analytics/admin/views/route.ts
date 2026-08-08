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

    // If backend doesn't support overview, compute from daily stats
    if (range === "overview" && !data.success) {
      // Fetch daily stats and compute overview from them
      const dailyRes = await fetch(`${API_BASE}/analytics/admin/views?range=daily`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        cache: "no-store",
      });
      const dailyData = await dailyRes.json().catch(() => ({ success: false }));

      if (dailyData.success && dailyData.data?.data) {
        const dailyItems = dailyData.data.data as Array<{ date: string; views: number }>;
        const todayKey = new Date().toISOString().slice(0, 10);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toISOString().slice(0, 10);
        const monthPrefix = todayKey.slice(0, 7);

        const today = dailyItems.find((d) => d.date === todayKey)?.views ?? 0;
        const yesterdayViews = dailyItems.find((d) => d.date === yesterdayKey)?.views ?? 0;
        const thisWeek = dailyItems.slice(-7).reduce((sum, d) => sum + (d.views || 0), 0);
        const thisMonth = dailyItems.filter((d) => d.date?.startsWith(monthPrefix)).reduce((sum, d) => sum + (d.views || 0), 0);
        const lifetime = dailyData.data.totalViews || dailyItems.reduce((sum, d) => sum + (d.views || 0), 0);

        return NextResponse.json({
          success: true,
          data: {
            today,
            yesterday: yesterdayViews,
            thisWeek,
            thisMonth,
            lastMonth: 0,
            lifetime,
          },
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          today: 0,
          yesterday: 0,
          thisWeek: 0,
          thisMonth: 0,
          lastMonth: 0,
          lifetime: 0,
        },
      });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Admin view analytics proxy error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch view analytics" }, { status: 500 });
  }
}
