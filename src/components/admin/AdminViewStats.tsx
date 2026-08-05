"use client";

import { useState, useEffect } from "react";
import { TrendingUp, CalendarDays, BarChart3, Users, ChevronDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewRange = "daily" | "monthly" | "yearly";

interface ViewStatsData {
  period: string;
  granularity: string;
  from: string;
  to: string;
  totalViews: number;
  data: Array<{ date?: string; month?: string; year?: string; views: number }>;
}

interface OverviewStats {
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
  lifetime: number;
}

const RANGE_LABELS: Record<ViewRange, string> = {
  daily: "Daily (30 days)",
  monthly: "Monthly (12 months)",
  yearly: "Yearly",
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

function formatNumber(n: number) {
  return n.toLocaleString();
}

export function AdminViewStats() {
  const [range, setRange] = useState<ViewRange>("daily");
  const [stats, setStats] = useState<ViewStatsData | null>(null);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("umunsi_admin_token");
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const [statsRes, overviewRes] = await Promise.all([
          fetch(`/api/analytics/admin/views?range=${encodeURIComponent(range)}`, { headers, cache: "no-store" }),
          fetch(`/api/analytics/admin/views?range=overview`, { headers, cache: "no-store" }),
        ]);

        const statsData = await statsRes.json().catch(() => ({ success: false }));
        const overviewData = await overviewRes.json().catch(() => ({ success: false }));

        setStats(statsData.data || null);
        setOverview(overviewData.data || null);
      } catch (error) {
        console.error("Failed to fetch view stats:", error);
        setStats(null);
        setOverview(null);
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

  const todayViews = overview?.today ?? stats?.data?.find((d) => d.date === todayKey)?.views ?? 0;
  const yesterdayViews = overview?.yesterday ?? stats?.data?.find((d) => d.date === yesterdayKey)?.views ?? 0;
  const thisWeekViews = overview?.thisWeek ?? 0;
  const thisMonthViews = overview?.thisMonth ?? 0;
  const lastMonthViews = overview?.lastMonth ?? 0;
  const lifetimeViews = overview?.lifetime ?? stats?.totalViews ?? 0;

  const changeFromYesterday = yesterdayViews > 0
    ? Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100)
    : 0;

  const maxViews = Math.max(1, ...(stats?.data?.map((d) => d.views) || []));

  const statCards = [
    { label: "Uyu munsi", value: todayViews, icon: Eye, color: "bg-blue-500", change: changeFromYesterday },
    { label: "Iryo hashize", value: yesterdayViews, icon: CalendarDays, color: "bg-emerald-500", change: 0 },
    { label: "Iki cyumweru", value: thisWeekViews, icon: Users, color: "bg-violet-500", change: 0 },
    { label: "Uku kwezi", value: thisMonthViews, icon: BarChart3, color: "bg-amber-500", change: 0 },
    { label: "Ukwezi kwashize", value: lastMonthViews, icon: TrendingUp, color: "bg-rose-500", change: 0 },
    { label: "Lifetime", value: lifetimeViews, icon: TrendingUp, color: "bg-brand-600", change: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-4 lg:p-5 border border-ink-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", card.color)}>
                <card.icon className="w-5 h-5" />
              </div>
              {card.change !== 0 && (
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-1 rounded-lg",
                    card.change > 0 ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                  )}
                >
                  {card.change > 0 ? "+" : ""}{card.change}%
                </span>
              )}
            </div>
            <p className="text-2xl lg:text-3xl font-black text-ink-900">
              {loading ? "..." : formatNumber(card.value)}
            </p>
            <p className="text-sm text-ink-400 mt-1 font-semibold">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" />
              Amafatiro y&apos;amaso
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Reba uko amasambugiye kw&apos;inkuru zawe
            </p>
          </div>
          <div className="relative">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as ViewRange)}
              className="appearance-none text-sm font-bold text-ink-900 bg-white/95 border-0 rounded-xl pl-4 pr-10 py-2.5 outline-none cursor-pointer"
            >
              {(Object.keys(RANGE_LABELS) as ViewRange[]).map((r) => (
                <option key={r} value={r}>
                  {RANGE_LABELS[r]}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-ink-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 font-bold mb-1 uppercase tracking-wider">Uyu munsi</p>
            <p className="text-3xl font-black">{loading ? "..." : formatNumber(todayViews)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 font-bold mb-1 uppercase tracking-wider">Iryo hashize</p>
            <p className="text-3xl font-black">{loading ? "..." : formatNumber(yesterdayViews)}</p>
          </div>
          <div className="bg-brand-500/20 border border-brand-500/30 rounded-xl p-4">
            <p className="text-xs text-brand-300 font-bold mb-1 uppercase tracking-wider">Lifetime</p>
            <p className="text-3xl font-black text-brand-300">{loading ? "..." : formatNumber(lifetimeViews)}</p>
          </div>
        </div>

        {stats && stats.data && stats.data.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-white/80 text-sm font-bold mb-3">
              <CalendarDays className="w-4 h-4" />
              <span>Imbarwa z&apos;amaso</span>
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {stats.data.map((item, idx) => {
                const height = `${Math.max(4, (item.views / maxViews) * 100)}%`;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="relative w-full flex items-end justify-center h-28">
                      <div
                        className="w-full bg-white/30 hover:bg-brand-400 rounded-t-md transition-all"
                        style={{ height }}
                      />
                      <div className="absolute bottom-full mb-1 hidden group-hover:block bg-white text-ink-900 text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-xl z-10">
                        {item.views.toLocaleString()} views
                      </div>
                    </div>
                    <span className="text-[10px] text-white/60 leading-none font-semibold">{formatLabel(item)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
