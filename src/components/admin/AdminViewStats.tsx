"use client";

import { useState, useEffect } from "react";
import { TrendingUp, CalendarDays, ChevronDown } from "lucide-react";

type ViewRange = "daily" | "monthly" | "yearly" | "2y" | "3y" | "5y";

interface ViewStatsData {
  period: string;
  granularity: string;
  from: string;
  to: string;
  totalViews: number;
  data: Array<{ date?: string; month?: string; year?: string; views: number }>;
}

const RANGE_LABELS: Record<ViewRange, string> = {
  daily: "Daily (30 days)",
  monthly: "Monthly (12 months)",
  yearly: "Yearly",
  "2y": "2 Years",
  "3y": "3 Years",
  "5y": "5 Years",
};

function toDateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function formatLabel(item: { date?: string; month?: string; year?: string }) {
  if (item.date) {
    const d = new Date(item.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }
  if (item.month) {
    const [y, m] = item.month.split("-");
    return `${m}/${y?.slice(2)}`;
  }
  return item.year || "";
}

export function AdminViewStats() {
  const [range, setRange] = useState<ViewRange>("daily");
  const [stats, setStats] = useState<ViewStatsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("umunsi_admin_token");
        const res = await fetch(`/api/analytics/admin/views?range=${encodeURIComponent(range)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({ success: false }));
        setStats(data.data || null);
      } catch (error) {
        console.error("Failed to fetch view stats:", error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [range]);

  const todayKey = toDateKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);
  const thisMonthKey = todayKey.slice(0, 7);

  const todayViews = stats?.data?.find((d) => d.date === todayKey)?.views || 0;
  const yesterdayViews = stats?.data?.find((d) => d.date === yesterdayKey)?.views || 0;
  const thisMonthViews = stats?.data?.reduce((sum, item) => {
    if (range === "daily" && item.date?.startsWith(thisMonthKey)) return sum + item.views;
    if (range !== "daily" && item.month?.startsWith(thisMonthKey)) return sum + item.views;
    return sum;
  }, 0) ?? 0;

  const maxViews = Math.max(1, ...(stats?.data?.map((d) => d.views) || []));

  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <span className="font-bold">Amafatiro y&apos;amaso</span>
        </div>
        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as ViewRange)}
            className="appearance-none text-sm font-semibold text-ink-900 bg-white/95 border-0 rounded-lg pl-3 pr-8 py-1.5 outline-none cursor-pointer"
          >
            {(Object.keys(RANGE_LABELS) as ViewRange[]).map((r) => (
              <option key={r} value={r}>
                {RANGE_LABELS[r]}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-ink-700 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/70 font-semibold mb-1">Uyu munsi</p>
          <p className="text-2xl font-black">{loading ? "..." : todayViews.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/70 font-semibold mb-1">Iryo hashize</p>
          <p className="text-2xl font-black">{loading ? "..." : yesterdayViews.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/70 font-semibold mb-1">Uku kwezi</p>
          <p className="text-2xl font-black">{loading ? "..." : thisMonthViews.toLocaleString()}</p>
        </div>
      </div>

      <p className="text-4xl font-black">
        {loading ? "..." : (stats?.totalViews ?? 0).toLocaleString()}
      </p>
      <p className="text-white/70 text-sm mt-1 mb-4">
        {stats ? `${RANGE_LABELS[range as ViewRange]} — ${stats.from || ""} to ${stats.to || ""}` : "Mu byiciro byose"}
      </p>

      {stats && stats.data && stats.data.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold mb-2">
            <CalendarDays className="w-4 h-4" />
            <span>Imbarwa z&apos;amaso</span>
          </div>
          <div className="flex items-end gap-1 h-24">
            {stats.data.map((item, idx) => {
              const height = `${Math.max(4, (item.views / maxViews) * 100)}%`;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full flex items-end justify-center h-20">
                    <div
                      className="w-full bg-white/40 hover:bg-white/70 rounded-t-sm transition-all"
                      style={{ height }}
                    />
                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-ink-900 text-white text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                      {item.views.toLocaleString()} views
                    </div>
                  </div>
                  <span className="text-[10px] text-white/60 leading-none">{formatLabel(item)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
