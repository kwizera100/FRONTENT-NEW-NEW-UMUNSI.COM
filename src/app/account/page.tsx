"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, ArrowLeft, LogOut, Loader2, CheckCircle, XCircle, Clock, Smartphone, CalendarDays, Shield, User as UserIcon } from "lucide-react";

interface MeData {
  success: boolean;
  active: boolean;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  premiumUntil?: string | null;
}

interface HistoryItem {
  referenceId: string;
  amount: number;
  msisdn: string;
  status: string;
  plan: string;
  createdAt: string;
  paidAt?: string | null;
}

const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return iso; }
};

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token: string | null = null;
    try { token = localStorage.getItem("umunsi_reader_token"); } catch {}
    if (!token) {
      router.replace("/subscribe?login=1");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("/api/payment/subscription/me", { headers }).then((r) => r.json().catch(() => ({}))),
      fetch("/api/payment/subscription/history", { headers }).then((r) => r.json().catch(() => ({}))),
    ])
      .then(([meData, histData]) => {
        if (!meData?.success) {
          try { localStorage.removeItem("umunsi_reader_token"); } catch {}
          router.replace("/subscribe?login=1");
          return;
        }
        setMe(meData);
        if (histData?.history) setHistory(histData.history);
      })
      .catch(() => router.replace("/subscribe?login=1"))
      .finally(() => setLoading(false));
  }, []);

  const signOut = () => {
    try {
      localStorage.removeItem("umunsi_reader_token");
      localStorage.removeItem("umunsi_reader_user");
      if (localStorage.getItem("umunsi_subscription_plan") === "account") {
        localStorage.removeItem("umunsi_subscribed");
        localStorage.removeItem("umunsi_subscribed_until");
        localStorage.removeItem("umunsi_subscription_plan");
      }
    } catch {}
    window.location.href = "/";
  };

  const isLifetime = me?.premiumUntil && new Date(me.premiumUntil).getFullYear() > 2090;
  const fullName = [me?.firstName, me?.lastName].filter(Boolean).join(" ") || "Reader";
  const initial = (me?.firstName || me?.email || "U").charAt(0).toUpperCase();

  const statusBadge = (st: string) => {
    if (st === "SUCCESS") return <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" /> Byishyuwe</span>;
    if (st === "FAILED") return <span className="inline-flex items-center gap-1 text-red-400 text-xs font-bold"><XCircle className="w-3.5 h-3.5" /> Byanze</span>;
    return <span className="inline-flex items-center gap-1 text-yellow-400 text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Pending</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#16213a] to-[#0f172a] text-white">
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Umunsi.com
          </Link>
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-[#e5b60d]" />
            <span className="font-black text-lg tracking-tight">Konti <span className="text-[#e5b60d]">Yanjye</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#e5b60d]" /></div>
        ) : me && (
          <div className="space-y-5">
            {/* Profile card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
              {me.avatar ? (
                <img src={me.avatar} alt="" className="w-16 h-16 rounded-full border-2 border-[#e5b60d] object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] flex items-center justify-center text-[#0f172a] font-black text-2xl">
                  {initial}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-black text-xl font-display truncate">{fullName}</p>
                <p className="text-gray-400 text-sm truncate">{me.email}</p>
                {me.active ? (
                  <span className="inline-flex items-center gap-1.5 mt-2 bg-[#e5b60d]/15 border border-[#e5b60d]/30 text-[#e5b60d] text-xs font-black px-3 py-1 rounded-full">
                    <Crown className="w-3.5 h-3.5" /> PREMIUM — nta ads
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 mt-2 bg-white/10 text-gray-400 text-xs font-bold px-3 py-1 rounded-full">
                    Nta subscription
                  </span>
                )}
              </div>
            </div>

            {/* Subscription status */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="font-black text-xs uppercase tracking-wider text-[#e5b60d] mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Subscription yawe
              </p>
              {me.active ? (
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Irangira:</p>
                    <p className="font-black text-lg flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-[#e5b60d]" />
                      {isLifetime ? "Buringanire (Lifetime)" : fmtDate(me.premiumUntil)}
                    </p>
                  </div>
                  <Link href="/subscribe" className="bg-[#e5b60d] hover:bg-[#f5c81d] text-[#0f172a] font-black px-5 py-2.5 rounded-xl text-sm transition-colors">
                    Kongera / Upgrade
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <p className="text-sm text-gray-400">Nta subscription ikora. Ishyura usome inkuru zose nta ads.</p>
                  <Link href="/subscribe" className="bg-[#e5b60d] hover:bg-[#f5c81d] text-[#0f172a] font-black px-5 py-2.5 rounded-xl text-sm transition-colors">
                    Ishyura nonaha
                  </Link>
                </div>
              )}
            </div>

            {/* Payment history */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="font-black text-xs uppercase tracking-wider text-[#e5b60d] mb-4">Ubwishyu bwawe (history)</p>
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">Nta bwishyu buragaragara kuri iyi konti.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((h) => (
                    <div key={h.referenceId} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                      <Smartphone className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold">{h.plan} — {h.amount.toLocaleString()} RWF</p>
                        <p className="text-xs text-gray-500 font-mono truncate">{h.msisdn} · {fmtDate(h.paidAt || h.createdAt)}</p>
                      </div>
                      {statusBadge(h.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sign out */}
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-black py-3.5 rounded-2xl transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sohoka (Sign out)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
