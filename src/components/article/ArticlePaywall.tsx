"use client";

import { useState, useEffect } from "react";
import { Crown, Lock, CheckCircle, Loader2, Mail, Phone, User, AlertCircle, Smartphone, Building2 } from "lucide-react";

interface ArticlePaywallProps {
  postId: string;
  postTitle: string;
  articlePayment?: string | null;
  adConfig?: string | null;
}

interface PaymentConfig {
  paymentMethods: {
    mtn: { enabled: boolean; label: string; comingSoon: boolean };
    airtel: { enabled: boolean; label: string; comingSoon: boolean };
    bank: {
      enabled: boolean;
      label: string;
      comingSoon: boolean;
      bankName: string;
      accountName: string;
      accountNumber: string;
      swiftCode: string;
    };
  };
}

export function ArticlePaywall({ postId, postTitle, articlePayment, adConfig }: ArticlePaywallProps) {
  const [payment, setPayment] = useState<{ requirePayment: boolean; price: number } | null>(null);
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [comingSoon, setComingSoon] = useState(false);

  useEffect(() => {
    if (articlePayment) {
      try {
        const parsed = typeof articlePayment === "string" ? JSON.parse(articlePayment) : articlePayment;
        if (parsed?.requirePayment) {
          setPayment({ requirePayment: true, price: Number(parsed.price) || 0 });
        }
      } catch {
        // not JSON
      }
    }
  }, [articlePayment]);

  useEffect(() => {
    if (!payment?.requirePayment) return;
    // Check localStorage for global subscription access (paid users read ALL articles)
    try {
      const globalAccess = localStorage.getItem("umunsi_subscribed");
      if (globalAccess === "active") {
        setHasAccess(true);
        return;
      }
      // Check per-article access
      const accessKey = `umunsi_article_access_${postId}`;
      const access = localStorage.getItem(accessKey);
      if (access === "granted") setHasAccess(true);
    } catch {}
    // Fetch payment config
    fetch("/api/payment/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setConfig(data);
      })
      .catch(() => {});
  }, [payment, postId]);

  if (!payment?.requirePayment || hasAccess) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Fill in all fields: Name, Email, and Phone");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package: "monthly", // fallback
          paymentMethod: selectedMethod,
          name,
          email,
          phone,
          articleId: postId,
          articleTitle: postTitle,
          articlePrice: payment.price,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.comingSoon) {
        setComingSoon(true);
      } else if (data.success) {
        setBankInfo(data.bankInfo);
        setSuccess(true);
        try {
          localStorage.setItem(`umunsi_article_access_${postId}`, "granted");
          localStorage.setItem("umunsi_subscribed", "active");
        } catch {}
      } else {
        setError(data.error || "Something went wrong. Try again later.");
      }
    } catch {
      setError("Could not complete. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6">
      <div className="bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 text-white text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black mb-2">This article costs {payment.price.toLocaleString()} RWF</h3>
          <p className="text-sm text-white/90 mb-4">
            Pay to read this article yose ukwezi kose, kandi ugire uburenganzira bwo kuyisoma igihe cyose wifuza.
          </p>
          <div className="bg-white/10 rounded-xl p-3 mb-4 text-left">
            <p className="text-xs font-bold text-white mb-2">When you pay you get:</p>
            <ul className="space-y-1 text-xs text-white/90">
              <li className="flex items-start gap-2"><span className="font-black">1.</span> Verification Badge on our UMUNSI MEDIA App</li>
              <li className="flex items-start gap-2"><span className="font-black">2.</span> Read exclusive articles for free with no ads</li>
              <li className="flex items-start gap-2"><span className="font-black">3.</span> Chat with UMUNSI.COM journalists</li>
            </ul>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#c9a00c] font-black text-sm hover:bg-gray-50 transition-colors"
          >
            <Crown className="w-4 h-4" />
            Pay to read this article
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && !success && !comingSoon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#e5b60d] to-[#c9a00c] text-white p-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="font-black flex items-center gap-2"><Crown className="w-5 h-5" /> Pay to read</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-full hover:bg-white/20">×</button>
            </div>
            <div className="p-4">
              {!selectedMethod ? (
                <>
                  <p className="text-sm text-gray-600 mb-4 text-center">Choose a payment method:</p>
                  <div className="space-y-2">
                    {config?.paymentMethods.mtn.enabled && (
                      <button onClick={() => setSelectedMethod("mtn")} className="w-full text-left p-3 rounded-xl border-2 border-gray-200 hover:border-[#e5b60d]/50 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center"><Smartphone className="w-4 h-4 text-white" /></div>
                        <div className="flex-1"><p className="font-bold text-sm">{config.paymentMethods.mtn.label}</p>{config.paymentMethods.mtn.comingSoon && <span className="text-xs text-orange-500">Coming soon</span>}</div>
                      </button>
                    )}
                    {config?.paymentMethods.airtel.enabled && (
                      <button onClick={() => setSelectedMethod("airtel")} className="w-full text-left p-3 rounded-xl border-2 border-gray-200 hover:border-[#e5b60d]/50 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center"><Smartphone className="w-4 h-4 text-white" /></div>
                        <div className="flex-1"><p className="font-bold text-sm">{config.paymentMethods.airtel.label}</p>{config.paymentMethods.airtel.comingSoon && <span className="text-xs text-orange-500">Coming soon</span>}</div>
                      </button>
                    )}
                    {config?.paymentMethods.bank.enabled && (
                      <button onClick={() => setSelectedMethod("bank")} className="w-full text-left p-3 rounded-xl border-2 border-gray-200 hover:border-[#e5b60d]/50 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center"><Building2 className="w-4 h-4 text-white" /></div>
                        <div className="flex-1"><p className="font-bold text-sm">{config.paymentMethods.bank.label}</p><span className="text-xs text-green-600">Available now!</span></div>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setSelectedMethod("")} className="text-xs text-gray-500 mb-3">&larr; Go back</button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Your name" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] outline-none text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} placeholder="email@example.com" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] outline-none text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+250 7XX XXX XXX" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] outline-none text-sm" />
                      </div>
                    </div>
                  </div>
                  {error && <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200"><AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" /><p className="text-red-700 text-xs">{error}</p></div>}
                  <button onClick={handleSubmit} disabled={loading} className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#e5b60d] hover:bg-[#c9a00c] disabled:opacity-60 text-white font-bold transition-colors text-sm">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : `Pay ${payment.price.toLocaleString()} RWF`}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon */}
      {comingSoon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { setComingSoon(false); setShowForm(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3"><Smartphone className="w-7 h-7 text-orange-500" /></div>
            <h3 className="font-bold text-gray-900 mb-2">This method is coming very soon!</h3>
            <p className="text-sm text-gray-500 mb-4">MTN na Airtel bizaba ku murongo vuba. Kuri none, hitamo Bank Account.</p>
            <button onClick={() => { setComingSoon(false); setSelectedMethod(""); }} className="px-6 py-2.5 rounded-xl bg-[#e5b60d] hover:bg-[#c9a00c] text-white font-bold text-sm">Choose another method</button>
          </div>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"><CheckCircle className="w-7 h-7 text-green-600" /></div>
            <h3 className="font-bold text-gray-900 mb-2">Thank you! Payment successful.</h3>
            <p className="text-sm text-gray-500 mb-3">Twabayeje kuri email yawe amakuru. Ubu ushobora gusoma iyi nkuru igihe cyose wifuza.</p>
            {bankInfo && (
              <div className="bg-gray-50 rounded-xl p-3 text-left mb-3 text-xs">
                <p><strong>Bank:</strong> {bankInfo.bankName}</p>
                <p><strong>Account:</strong> {bankInfo.accountName}</p>
                <p><strong>Number:</strong> {bankInfo.accountNumber}</p>
                <p><strong>Amount:</strong> {bankInfo.amount?.toLocaleString()} {bankInfo.currency}</p>
              </div>
            )}
            <button onClick={() => { setSuccess(false); setShowForm(false); setHasAccess(true); }} className="px-6 py-2.5 rounded-xl bg-[#e5b60d] hover:bg-[#c9a00c] text-white font-bold text-sm">Read article</button>
          </div>
        </div>
      )}
    </div>
  );
}
