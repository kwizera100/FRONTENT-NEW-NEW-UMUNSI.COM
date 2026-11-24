"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Loader2, CheckCircle, XCircle, Clock, Smartphone, Crown, FileText } from "lucide-react";

interface Attempt {
  referenceId: string;
  type: "SUBSCRIPTION" | "ARTICLE";
  postId: string | null;
  msisdn: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | string;
  createdAt: string;
  paidAt: string | null;
  userEmail: string | null;
  plan: string | null;
}

const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
};

export default function AdminPaymentsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "SUBSCRIPTION" | "ARTICLE">("all");

  const token = typeof window !== "undefined" ? localStorage.getItem("umunsi_admin_token") : "";

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/admin/attempts", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d?.attempts) setAttempts(d.attempts);
      else setError(d.error || d.message || "Ntibyakunze — reba niba uri admin.");
    } catch {
      setError("Habayemo ikibazo muri network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = attempts.filter((a) => filter === "all" || a.type === filter);
  const succeeded = attempts.filter((a) => a.status === "SUCCESS");
  const totalRwf = succeeded.reduce((s, a) => s + (a.amount || 0), 0);

  const statusBadge = (st: string) => {
    if (st === "SUCCESS") return <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-bold"><CheckCircle className="w-3 h-3" /> Byishyuwe</span>;
    if (st === "FAILED") return <span className="inline-flex items-center gap-1 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full text-xs font-bold"><XCircle className="w-3 h-3" /> Byanze</span>;
    return <span className="inline-flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full text-xs font-bold"><Clock className="w-3 h-3" /> Pending</span>;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Ubwishyu (Payments)</h1>
          <p className="text-sm text-gray-500">Abagerageje kwishyura — MoMo subscriptions &amp; premium articles</p>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-bold uppercase">Attempts</p>
          <p className="text-2xl font-black text-gray-900">{attempts.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-bold uppercase">Byatsinze</p>
          <p className="text-2xl font-black text-emerald-600">{succeeded.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-bold uppercase">Byanze</p>
          <p className="text-2xl font-black text-red-500">{attempts.filter((a) => a.status === "FAILED").length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-bold uppercase">Amafaranga</p>
          <p className="text-2xl font-black text-gray-900">{totalRwf.toLocaleString()} <span className="text-sm">RWF</span></p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(["all", "SUBSCRIPTION", "ARTICLE"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-colors ${filter === f ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {f === "all" ? "Byose" : f === "SUBSCRIPTION" ? "Subscriptions" : "Articles"}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-black text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Ubwoko</th>
                <th className="px-4 py-3">Telefoni</th>
                <th className="px-4 py-3">Plan / Article</th>
                <th className="px-4 py-3">Amafaranga</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Konti</th>
                <th className="px-4 py-3">Itariki</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a) => (
                <tr key={a.referenceId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {a.type === "SUBSCRIPTION"
                      ? <span className="inline-flex items-center gap-1.5 font-bold text-[#b8940a]"><Crown className="w-4 h-4" /> Subscription</span>
                      : <span className="inline-flex items-center gap-1.5 font-bold text-gray-600"><FileText className="w-4 h-4" /> Article</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <span className="inline-flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-gray-400" />{a.msisdn || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {a.type === "SUBSCRIPTION" ? (a.plan || "—") : <span className="font-mono text-gray-500">{(a.postId || "").slice(0, 12)}…</span>}
                  </td>
                  <td className="px-4 py-3 font-bold">{(a.amount || 0).toLocaleString()} RWF</td>
                  <td className="px-4 py-3">{statusBadge(a.status)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{a.userEmail || "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{fmtDate(a.paidAt || a.createdAt)}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">Nta bwishyu buragaragara</td></tr>
              )}
              {loading && (
                <tr><td colSpan={7} className="px-4 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
