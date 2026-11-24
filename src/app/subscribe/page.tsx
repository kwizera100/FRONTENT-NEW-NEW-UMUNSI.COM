"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, CreditCard, Check, Shield, Zap, X, Loader2, AlertCircle, ArrowLeft, Infinity as InfinityIcon } from "lucide-react";

interface Plan {
  key: string;
  label: string;
  sub: string;
  price: number;
  period: string;
  highlight?: boolean;
  badge?: string;
  icon: React.ReactNode;
}

const PLANS: Plan[] = [
  {
    key: "monthly500",
    label: "Ukwezi",
    sub: "Monthly",
    price: 500,
    period: "/ukwezi",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    key: "quarterly",
    label: "Amezi 3",
    sub: "3 Months",
    price: 5000,
    period: "/amezi 3",
    highlight: true,
    badge: "IKUNZWE CYANE",
    icon: <Crown className="w-5 h-5" />,
  },
  {
    key: "lifetime",
    label: "Buringanire",
    sub: "Lifetime",
    price: 10000,
    period: "rimwe gusa",
    icon: <InfinityIcon className="w-5 h-5" />,
  },
];

export default function SubscribePage() {
  const [selected, setSelected] = useState<string>("quarterly");
  const [step, setStep] = useState<"plans" | "form" | "success">("plans");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const plan = PLANS.find((p) => p.key === selected)!;

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handlePay = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || cardNumber.replace(/\s/g, "").length < 12 || expiry.length < 4 || cvv.length < 3) {
      setError("Uzuza imirongo yose neza (amazina, email, telefoni n'ikarita).");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/payment/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package: selected,
          paymentMethod: "card",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        try { localStorage.setItem("umunsi_subscribed", "active"); } catch {}
        setStep("success");
      } else {
        setError(data.error || "Habayemo ikibazo. Gerageza nyuma.");
      }
    } catch {
      setError("Ntibishoboye. Gerageza nyuma.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#16213a] to-[#0f172a] text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Umunsi.com
          </Link>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#e5b60d]" />
            <span className="font-black text-lg tracking-tight">Umunsi <span className="text-[#e5b60d]">Premium</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        {step !== "success" && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#e5b60d]/15 border border-[#e5b60d]/30 text-[#e5b60d] text-xs font-black px-4 py-1.5 rounded-full mb-4">
              <Crown className="w-3.5 h-3.5" /> PREMIUM — NTA ADS
            </div>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight font-display">
              Soma inkuru zose
              <span className="text-[#e5b60d]"> nta ads zirimo</span>
            </h1>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Wishyure rimwe cyangwa buri gihe — ubone inkuru zisukuye, zidafise advertisement, kuri umunsi.com wose.
            </p>
          </div>
        )}

        {/* Plans */}
        {step === "plans" && (
          <>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
              {PLANS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelected(p.key)}
                  className={`relative text-left p-5 sm:p-6 rounded-2xl border-2 transition-all ${
                    selected === p.key
                      ? "border-[#e5b60d] bg-gradient-to-b from-[#e5b60d]/15 to-transparent shadow-lg shadow-[#e5b60d]/10"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  } ${p.highlight ? "sm:-translate-y-2" : ""}`}
                >
                  {p.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e5b60d] text-[#0f172a] text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                      {p.badge}
                    </span>
                  )}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${selected === p.key ? "bg-[#e5b60d] text-[#0f172a]" : "bg-white/10 text-[#e5b60d]"}`}>
                    {p.icon}
                  </div>
                  <p className="font-black text-lg font-display">{p.label}</p>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">{p.sub}</p>
                  <p className="mt-3">
                    <span className="text-2xl sm:text-3xl font-black text-[#e5b60d]">{p.price.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs ml-1">RWF {p.period}</span>
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#e5b60d] shrink-0" /> Inkuru zose nta ads</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#e5b60d] shrink-0" /> Soma ku mudasobwa &amp; terefone</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#e5b60d] shrink-0" /> Premium badge</li>
                  </ul>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("form")}
              className="w-full sm:max-w-md mx-auto flex items-center justify-center gap-2 bg-[#e5b60d] hover:bg-[#f5c81d] text-[#0f172a] font-black py-4 rounded-2xl transition-colors text-base"
            >
              <CreditCard className="w-5 h-5" />
              Ishyura {plan.price.toLocaleString()} RWF — {plan.sub}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Ubwishyu bwizewe — ikarita ya Visa/Mastercard
            </p>
          </>
        )}

        {/* Card form */}
        {step === "form" && (
          <div className="max-w-md mx-auto">
            <button onClick={() => setStep("plans")} className="text-xs text-gray-400 hover:text-white mb-4 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Subira inyuma
            </button>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-lg font-display">Ishyura n'ikarita</h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <CreditCard className="w-4 h-4 text-[#e5b60d]" /> Visa · Mastercard
                </div>
              </div>
              <div className="bg-[#e5b60d]/10 border border-[#e5b60d]/30 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
                <span className="text-sm font-bold">{plan.label} ({plan.sub})</span>
                <span className="font-black text-[#e5b60d]">{plan.price.toLocaleString()} RWF</span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Numero y'ikarita *</label>
                  <input
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e5b60d] font-mono tracking-wider"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Itariki *</label>
                    <input
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e5b60d] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">CVV *</label>
                    <input
                      inputMode="numeric"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e5b60d] font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Amazina *</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Amazina yawe yuzuye"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e5b60d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@urugero.rw"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e5b60d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Telefoni *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 7XX XXX XXX"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e5b60d]"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-300 text-xs">{error}</p>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-[#e5b60d] hover:bg-[#f5c81d] disabled:opacity-60 text-[#0f172a] font-black py-3.5 rounded-xl transition-colors"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Tegereza...</> : `Ishyura ${plan.price.toLocaleString()} RWF`}
              </button>
              <p className="text-center text-[10px] text-gray-500 mt-3">
                Numero z'ikarita ntizibikwa — zikoreshwa gusa mu kwishyura.
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="max-w-md mx-auto text-center py-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#e5b60d]/30">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display mb-3">Murakoze! 🎉</h2>
            <p className="text-gray-400 text-sm mb-6">
              Icyifuzo cyawe cyakiriwe. Ubu usoma inkuru zose za Umunsi.com <span className="text-[#e5b60d] font-bold">nta ads zirimo</span>.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3 text-sm mb-6">
              <p className="font-black text-[#e5b60d] text-xs uppercase tracking-wider">Gucunga subscription yawe</p>
              <p className="text-gray-300">• Subscription yawe ikora kuri <span className="text-white font-bold">iyi browser</span> — niba ushaka kuyirekura, siba site data.</p>
              <p className="text-gray-300">• Ikibazo runaka: twandikire <span className="text-[#e5b60d]">info@umunsi.com</span></p>
              <p className="text-gray-300">• Ibisubizo bisabwa: 24 hours nshingano.</p>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 bg-[#e5b60d] hover:bg-[#f5c81d] text-[#0f172a] font-black px-8 py-3.5 rounded-xl transition-colors">
              Subira ku rupapuro rw'ibanze
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
