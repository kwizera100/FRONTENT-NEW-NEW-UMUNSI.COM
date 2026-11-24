"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Crown, Check, Shield, Zap, Loader2, AlertCircle, ArrowLeft, Infinity as InfinityIcon, Smartphone, Mail, LogIn, UserPlus } from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface Plan {
  key: string;
  label: string;
  sub: string;
  price: number;
  period: string;
  days: number | null; // null = lifetime
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
    days: 30,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    key: "quarterly",
    label: "Amezi 3",
    sub: "3 Months",
    price: 5000,
    period: "/amezi 3",
    days: 90,
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
    days: null,
    icon: <InfinityIcon className="w-5 h-5" />,
  },
];

export default function SubscribePage() {
  const [selected, setSelected] = useState<string>("quarterly");
  const [step, setStep] = useState<"plans" | "momo" | "pending" | "success">("plans");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Account creation / login (after payment or for returning subscribers)
  const [showAccount, setShowAccount] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState("");

  const plan = PLANS.find((p) => p.key === selected)!;

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // ?login=1 — auto-open the returning-subscriber login form
  useEffect(() => {
    try {
      if (window.location.search.includes("login=1")) {
        setShowLogin(true);
        setTimeout(() => document.getElementById("login-section")?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
      }
    } catch {}
  }, []);

  const startPayment = async () => {
    if (!phone.trim()) { setError("Shyiramo numero ya MTN MoMo"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/payment/mtn/requesttopay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: "subscription", msisdn: phone.trim(), amount: plan.price }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error || "Kwishyura ntibikunze. Gerageza nanone.");
        return;
      }
      setStep("pending");
      setReferenceId(data.referenceId);
      pollRef.current = setInterval(async () => {
        try {
          const sr = await fetch(`/api/payment/mtn/status/${data.referenceId}`);
          const sd = await sr.json().catch(() => ({}));
          if (sd.status === "SUCCESS") {
            if (pollRef.current) clearInterval(pollRef.current);
            const until = plan.days ? new Date(Date.now() + plan.days * 86400000).toISOString() : null;
            try {
              localStorage.setItem("umunsi_subscribed", "active");
              localStorage.setItem("umunsi_subscription_ref", data.referenceId);
              localStorage.setItem("umunsi_subscription_plan", plan.key);
              if (until) localStorage.setItem("umunsi_subscribed_until", until);
              else localStorage.removeItem("umunsi_subscribed_until");
            } catch {}
            setExpiresAt(until);
            setStep("success");
          } else if (sd.status === "FAILED") {
            if (pollRef.current) clearInterval(pollRef.current);
            setError(
              sd.reason === "PAYEE_NOT_FOUND" || sd.reason === "PAYER_NOT_FOUND"
                ? "Numero ya MTN ntibashije kuboneka — shyiramo numero yawe ya MoMo"
                : sd.reason === "NOT_ENOUGH_FUNDS"
                  ? "Nta mafrwanda ahagije kuri konti yawe ya MoMo"
                  : "Kwishyura ntibyagenze neza. Gerageza nanone."
            );
            setStep("momo");
          }
        } catch {}
      }, 3000);
    } catch {
      setError("Habayemo ikibazo. Gerageza nanone.");
    } finally {
      setLoading(false);
    }
  };

  const cancelPending = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStep("momo");
  };

  // After a backend login/signup returns a JWT — store it and sync premium
  const finishLogin = async (token: string, email: string) => {
    try { localStorage.setItem("umunsi_reader_token", token); } catch {}
    setLoggedInEmail(email);
    try {
      const res = await fetch("/api/payment/subscription/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await res.json().catch(() => ({}));
      if (d?.active) {
        try {
          localStorage.setItem("umunsi_subscribed", "active");
          localStorage.setItem("umunsi_subscription_plan", "account");
          if (d.premiumUntil) localStorage.setItem("umunsi_subscribed_until", d.premiumUntil);
          setExpiresAt(d.premiumUntil && new Date(d.premiumUntil).getFullYear() < 2090 ? d.premiumUntil : null);
        } catch {}
      }
    } catch {}
  };

  const handleSignup = async () => {
    if (!accountEmail.trim() || accountPassword.length < 6) {
      setAccountError("Shyiramo email n'ijambobanga (6+ inyuguti).");
      return;
    }
    setAccountError("");
    setAccountLoading(true);
    try {
      const res = await fetch("/api/payment/subscribe-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId: referenceId || undefined,
          email: accountEmail.trim(),
          password: accountPassword,
          name: accountName.trim() || accountEmail.split("@")[0],
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d?.token) {
        await finishLogin(d.token, d.user?.email || accountEmail.trim());
      } else {
        setAccountError(d.error || "Konti ntiyaremwe. Gerageza nanone.");
      }
    } catch {
      setAccountError("Habayemo ikibazo. Gerageza nanone.");
    } finally {
      setAccountLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!accountEmail.trim() || !accountPassword) {
      setAccountError("Shyiramo email n'ijambobanga.");
      return;
    }
    setAccountError("");
    setAccountLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: accountEmail.trim(), password: accountPassword }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d?.token) {
        await finishLogin(d.token, d.user?.email || accountEmail.trim());
        setStep("success");
      } else {
        setAccountError(d.error || d.message || "Injira ntibikunze — reba email n'ijambobanga.");
      }
    } catch {
      setAccountError("Habayemo ikibazo. Gerageza nanone.");
    } finally {
      setAccountLoading(false);
    }
  };

  // Google sign-in callback — receives the Google ID token
  const handleGoogleCredential = async (response: { credential?: string }) => {
    if (!response?.credential) return;
    setAccountError("");
    setAccountLoading(true);
    try {
      const res = await fetch("/api/payment/subscribe-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential, referenceId: referenceId || undefined }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d?.token) {
        await finishLogin(d.token, d.user?.email || "");
        setStep("success");
      } else {
        setAccountError(d.error || "Google sign-in ntibikunze.");
      }
    } catch {
      setAccountError("Habayemo ikibazo. Gerageza nanone.");
    } finally {
      setAccountLoading(false);
    }
  };

  // Render the Google button once its script loads
  const initGoogle = () => {
    if (!GOOGLE_CLIENT_ID || !window.google?.accounts?.id) return;
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });
      const el = document.getElementById("google-signin-btn");
      if (el && el.childElementCount === 0) {
        window.google.accounts.id.renderButton(el, { theme: "outline", size: "large", width: 320, text: "continue_with" });
      }
    } catch {}
  };

  useEffect(() => {
    if ((step === "success" || showLogin) && GOOGLE_CLIENT_ID) {
      const t = setTimeout(initGoogle, 400);
      return () => clearTimeout(t);
    }
  }, [step, showLogin, showAccount]);

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
              Wishyure ukoresheje MTN Mobile Money — ubone inkuru zisukuye, zidafise advertisement, kuri umunsi.com wose.
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
              onClick={() => setStep("momo")}
              className="w-full sm:max-w-md mx-auto flex items-center justify-center gap-2 bg-[#e5b60d] hover:bg-[#f5c81d] text-[#0f172a] font-black py-4 rounded-2xl transition-colors text-base"
            >
              <Smartphone className="w-5 h-5" />
              Ishyura {plan.price.toLocaleString()} RWF na MoMo
            </button>
            <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Ubwishyu bwizewe — MTN Mobile Money
            </p>

            {/* Returning subscribers */}
            <div className="text-center mt-8">
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="text-sm text-[#e5b60d] hover:text-[#f5c81d] font-bold inline-flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Wamaze kwishyura? Injira hano
              </button>

              {showLogin && (
                <div id="login-section" className="max-w-sm mx-auto mt-5 bg-white/5 border border-white/10 rounded-2xl p-5 text-left">
                  <p className="font-bold text-sm mb-3">Injira kuri konti yawe</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                      placeholder="Email yawe"
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e5b60d]"
                    />
                    <input
                      type="password"
                      value={accountPassword}
                      onChange={(e) => setAccountPassword(e.target.value)}
                      placeholder="Ijambobanga"
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e5b60d]"
                    />
                    {accountError && (
                      <p className="text-red-300 text-xs flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {accountError}
                      </p>
                    )}
                    <button
                      onClick={handleLogin}
                      disabled={accountLoading}
                      className="w-full flex items-center justify-center gap-2 bg-[#e5b60d] hover:bg-[#f5c81d] disabled:opacity-60 text-[#0f172a] font-black py-3 rounded-xl transition-colors text-sm"
                    >
                      {accountLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><LogIn className="w-4 h-4" /> Injira</>}
                    </button>
                    {GOOGLE_CLIENT_ID && <div id="google-signin-btn" className="flex justify-center pt-1" />}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* MoMo phone entry */}
        {step === "momo" && (
          <div className="max-w-md mx-auto">
            <button onClick={() => setStep("plans")} className="text-xs text-gray-400 hover:text-white mb-4 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Subira inyuma
            </button>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-lg font-display">Ishyura na MoMo</h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Smartphone className="w-4 h-4 text-[#e5b60d]" /> MTN Mobile Money
                </div>
              </div>
              <div className="bg-[#e5b60d]/10 border border-[#e5b60d]/30 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
                <span className="text-sm font-bold">{plan.label} ({plan.sub})</span>
                <span className="font-black text-[#e5b60d]">{plan.price.toLocaleString()} RWF</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Numero ya MTN *</label>
                <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-3 focus-within:border-[#e5b60d]">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="078XXXXXXX"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Uzahamagarwa kuri telefoni yawe — winjize PIN ya MoMo wemeze ubwishyu.</p>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-300 text-xs">{error}</p>
                </div>
              )}

              <button
                onClick={startPayment}
                disabled={loading}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-[#e5b60d] hover:bg-[#f5c81d] disabled:opacity-60 text-[#0f172a] font-black py-3.5 rounded-xl transition-colors"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Kohereza...</> : `Ishyura ${plan.price.toLocaleString()} RWF`}
              </button>
            </div>
          </div>
        )}

        {/* Waiting for MoMo approval */}
        {step === "pending" && (
          <div className="max-w-md mx-auto text-center py-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <Loader2 className="w-12 h-12 text-[#e5b60d] animate-spin mx-auto mb-5" />
              <h2 className="font-black text-xl font-display mb-2">Reba telefoni yawe</h2>
              <p className="text-gray-400 text-sm mb-1">Twakohereje icyifuzo cyo kwishyura kuri</p>
              <p className="text-[#e5b60d] font-black text-lg mb-4">{phone}</p>
              <p className="text-gray-400 text-xs mb-6">Injiza PIN ya MoMo wemeze kwishyura <strong className="text-white">{plan.price.toLocaleString()} RWF</strong>. Ikibazo gikimara kugenda — mutaze.</p>
              <button onClick={cancelPending} className="text-xs text-gray-500 hover:text-white underline underline-offset-2">
                Rekeza / hindura numero
              </button>
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
            <p className="text-gray-400 text-sm mb-2">
              Ubwishyu bwemejwe. Ubu usoma inkuru zose za Umunsi.com <span className="text-[#e5b60d] font-bold">nta ads zirimo</span>.
            </p>
            {expiresAt && (
              <p className="text-xs text-gray-500 mb-4">
                Subscription yawe irangira: <span className="text-gray-300 font-bold">{new Date(expiresAt).toLocaleDateString("rw-RW", { year: "numeric", month: "long", day: "numeric" })}</span>
              </p>
            )}
            {/* Account creation — use premium on any device */}
            {loggedInEmail ? (
              <div className="bg-[#e5b60d]/10 border border-[#e5b60d]/30 rounded-2xl p-5 mb-6 mt-4">
                <div className="flex items-center justify-center gap-2 text-[#e5b60d] font-black mb-1">
                  <Check className="w-5 h-5" /> Konti yemejwe
                </div>
                <p className="text-sm text-gray-300">
                  Winjiye nka <span className="text-white font-bold">{loggedInEmail}</span>. Kuri device iyo ariyo yose — injira ubashe gusoma nta ads.
                </p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left mb-6 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus className="w-4 h-4 text-[#e5b60d]" />
                  <p className="font-black text-sm">Fungura konti — koresha kuri device zose</p>
                </div>
                <p className="text-xs text-gray-400 mb-4">Shyiramo email n'ijambobanga, cyangwa ukoreshe Google — wishobore kwinjira kuri telefoni n'undi mudasobwa.</p>

                {GOOGLE_CLIENT_ID && <div id="google-signin-btn" className="flex justify-center mb-3" />}

                <div className="space-y-3">
                  <input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Amazina yawe"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e5b60d]"
                  />
                  <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-3 focus-within:border-[#e5b60d]">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="email"
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                      placeholder="Email yawe (Gmail)"
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                  </div>
                  <input
                    type="password"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    placeholder="Ijambobanga (6+ inyuguti)"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e5b60d]"
                  />
                  {accountError && (
                    <p className="text-red-300 text-xs flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {accountError}
                    </p>
                  )}
                  <button
                    onClick={handleSignup}
                    disabled={accountLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#e5b60d] hover:bg-[#f5c81d] disabled:opacity-60 text-[#0f172a] font-black py-3 rounded-xl transition-colors text-sm"
                  >
                    {accountLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fungura konti yanjye"}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3 text-sm mb-6">
              <p className="font-black text-[#e5b60d] text-xs uppercase tracking-wider">Gucunga subscription yawe</p>
              <p className="text-gray-300">• Ufite konti — injira kuri device iyo ariyo yose usome nta ads.</p>
              <p className="text-gray-300">• Ikibazo runaka: twandikire kuri WhatsApp <a href="https://wa.me/250783450859" target="_blank" rel="noopener noreferrer" className="text-[#e5b60d] font-bold underline underline-offset-2">0783 450 859</a></p>
              <p className="text-gray-300">• Ibisubizo bisabwa: 24 hours nshingano.</p>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 bg-[#e5b60d] hover:bg-[#f5c81d] text-[#0f172a] font-black px-8 py-3.5 rounded-xl transition-colors">
              Subira ku rupapuro rw'ibanze
            </Link>
          </div>
        )}
      </div>

      {GOOGLE_CLIENT_ID && (
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initGoogle} />
      )}
    </div>
  );
}
