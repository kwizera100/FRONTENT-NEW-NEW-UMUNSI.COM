"use client";

import { useEffect, useState } from "react";
import {
  Coins,
  Loader2,
  Wallet,
  TrendingUp,
  CheckCircle,
  Smartphone,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Tip {
  referenceId: string;
  postTitle: string;
  amount: number;
  authorShare: number;
  status: string;
  createdAt: string;
}

interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  msisdn: string;
  amount: number;
  status: string;
  requestedAt: string;
  resolvedAt: string | null;
  note: string;
}

interface TipAttempt {
  referenceId: string;
  postTitle: string;
  msisdn: string;
  amount: number;
  authorShare: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

const rwf = (n: number) => `${Number(n || 0).toLocaleString()} RWF`;

export default function AdminEarningsPage() {
  const [role, setRole] = useState("AUTHOR");
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [attempts, setAttempts] = useState<TipAttempt[]>([]);
  const [platform, setPlatform] = useState<any>(null);
  const [msisdn, setMsisdn] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgError, setMsgError] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("umunsi_admin_token") : "";
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tips/author/earnings", { headers, cache: "no-store" });
      const data = await res.json();
      if (data.success) setEarnings(data);
    } catch {}
    try {
      const res = await fetch("/api/tips/admin/withdrawals", { headers, cache: "no-store" });
      const data = await res.json();
      if (data.success) setWithdrawals(data.withdrawals || []);
    } catch {}
    try {
      const res = await fetch("/api/tips/admin/summary", { headers, cache: "no-store" });
      const data = await res.json();
      if (data.success) setPlatform(data);
    } catch {}
    try {
      const res = await fetch("/api/tips/admin/attempts", { headers, cache: "no-store" });
      const data = await res.json();
      if (data.success) setAttempts(data.attempts || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("umunsi_admin_user") || "{}");
      setRole(String(user?.role || "AUTHOR").toUpperCase());
    } catch {}
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestWithdraw = async () => {
    setWithdrawing(true);
    setMsg("");
    try {
      const res = await fetch("/api/tips/author/withdraw", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ msisdn }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Withdrawal request submitted. Admin will process it soon.");
        setMsgError(false);
        setMsisdn("");
        load();
      } else {
        setMsg(data.error || "Withdrawal failed");
        setMsgError(true);
      }
    } catch {
      setMsg("Network error");
      setMsgError(true);
    } finally {
      setWithdrawing(false);
    }
  };

  const resolveWithdrawal = async (id: string, status: "PAID" | "REJECTED") => {
    try {
      await fetch(`/api/tips/admin/withdrawals/${id}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      load();
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#e5b60d] animate-spin" />
      </div>
    );
  }

  const available = earnings?.available || 0;
  const minWithdraw = earnings?.minWithdraw || 7000;
  const canWithdraw = available >= minWithdraw;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-8 rounded-full bg-[#e5b60d]" />
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Coins className="w-7 h-7 text-[#e5b60d]" />
          Earnings — Dutere Inkunga
        </h1>
      </div>

      {msg && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-sm font-semibold border ${
            msgError
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          {msgError ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />} {msg}
        </div>
      )}

      {/* Author stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase">Total Earned</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{rwf(earnings?.earned)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase">Available</p>
          <p className="text-2xl font-black text-green-600 mt-1">{rwf(available)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase">Pending Withdrawal</p>
          <p className="text-2xl font-black text-amber-500 mt-1">{rwf(earnings?.pendingWithdraw)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase">Withdrawn</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{rwf(earnings?.withdrawn)}</p>
        </div>
      </div>

      {/* Withdraw */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#e5b60d]" /> Withdraw Earnings
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Minimum withdrawal: <strong>{rwf(minWithdraw)}</strong>. Money is sent to your MTN MoMo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <Smartphone className="w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
              placeholder="MTN MoMo number (078XXXXXXX)"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <button
            onClick={requestWithdraw}
            disabled={!canWithdraw || withdrawing || !msisdn.trim()}
            className="px-6 py-3 bg-[#e5b60d] hover:bg-[#c9a00c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {withdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            Withdraw {rwf(available)}
          </button>
        </div>
        {!canWithdraw && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            You need {rwf(minWithdraw - available)} more to withdraw.
          </p>
        )}
      </div>

      {/* My tip history */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4">Tips Received</h2>
        {(earnings?.tips || []).length === 0 ? (
          <p className="text-sm text-gray-400">No tips yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-400 border-b border-gray-100">
                  <th className="py-2 pr-4">Article</th>
                  <th className="py-2 pr-4">Reader Paid</th>
                  <th className="py-2 pr-4">Your Share</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {(earnings.tips as Tip[]).map((t) => (
                  <tr key={t.referenceId} className="border-b border-gray-50">
                    <td className="py-2 pr-4 max-w-xs truncate">{t.postTitle || "—"}</td>
                    <td className="py-2 pr-4">{rwf(t.amount)}</td>
                    <td className="py-2 pr-4 font-bold text-green-600">{rwf(t.authorShare)}</td>
                    <td className="py-2 pr-4 text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin: platform summary + withdrawal requests */}
      {role === "ADMIN" && (
        <>
          {platform && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-900 rounded-2xl p-5 text-white">
                <p className="text-xs font-bold text-white/50 uppercase">Platform Share (Total)</p>
                <p className="text-2xl font-black mt-1">{rwf(platform.platformShare)}</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-5 text-white">
                <p className="text-xs font-bold text-white/50 uppercase">Author Shares Paid In</p>
                <p className="text-2xl font-black mt-1">{rwf(platform.authorShare)}</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-5 text-white">
                <p className="text-xs font-bold text-white/50 uppercase">Total Tips</p>
                <p className="text-2xl font-black mt-1">{platform.totalTips}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-1">Payment Attempts</h2>
            <p className="text-xs text-gray-400 mb-4">
              Includes failed/unfinished payments — visible to admin only. Only SUCCESS counts as paid.
            </p>
            {attempts.length === 0 ? (
              <p className="text-sm text-gray-400">No payment attempts yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-gray-400 border-b border-gray-100">
                      <th className="py-2 pr-4">Article</th>
                      <th className="py-2 pr-4">Phone</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((t) => (
                      <tr key={t.referenceId} className="border-b border-gray-50">
                        <td className="py-2 pr-4 max-w-xs truncate">{t.postTitle || "—"}</td>
                        <td className="py-2 pr-4 font-mono text-xs">{t.msisdn}</td>
                        <td className="py-2 pr-4">{rwf(t.amount)}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              t.status === "SUCCESS"
                                ? "bg-green-50 text-green-700"
                                : t.status === "FAILED"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-gray-500">
                          {new Date(t.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Withdrawal Requests</h2>
            {withdrawals.length === 0 ? (
              <p className="text-sm text-gray-400">No withdrawal requests.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-gray-400 border-b border-gray-100">
                      <th className="py-2 pr-4">Writer</th>
                      <th className="py-2 pr-4">MoMo Number</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Requested</th>
                      <th className="py-2 pr-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="border-b border-gray-50">
                        <td className="py-2 pr-4 font-semibold">{w.userName}</td>
                        <td className="py-2 pr-4">{w.msisdn}</td>
                        <td className="py-2 pr-4 font-bold">{rwf(w.amount)}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                              w.status === "PENDING"
                                ? "bg-amber-50 text-amber-700"
                                : w.status === "PAID"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-600"
                            }`}
                          >
                            {w.status === "PENDING" && <Clock className="w-3 h-3" />}
                            {w.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-gray-500">
                          {new Date(w.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 pr-4">
                          {w.status === "PENDING" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => resolveWithdrawal(w.id, "PAID")}
                                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg"
                              >
                                Mark Paid
                              </button>
                              <button
                                onClick={() => resolveWithdrawal(w.id, "REJECTED")}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
