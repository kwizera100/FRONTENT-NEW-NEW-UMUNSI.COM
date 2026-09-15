"use client";

import { useState, useEffect } from "react";
import { X, Crown, CheckCircle, Loader2, Smartphone, Building2, Mail, Phone, User, AlertCircle } from "lucide-react";

interface PaymentPopupProps {
  open: boolean;
  onClose: () => void;
}

interface PaymentConfig {
  packages: {
    weekly?: { enabled: boolean; price: number; currency: string; label: string };
    monthly?: { enabled: boolean; price: number; currency: string; label: string };
    yearly?: { enabled: boolean; price: number; currency: string; label: string };
  };
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
  umunsiMediaSignupUrl: string;
}

export function PaymentPopup({ open, onClose }: PaymentPopupProps) {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [step, setStep] = useState<"packages" | "payment" | "form" | "success" | "comingSoon">("packages");
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bankInfo, setBankInfo] = useState<any>(null);

  useEffect(() => {
    if (open && !config) {
      fetch("/api/payment/config")
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setConfig(data);
        })
        .catch(() => {});
    }
  }, [open, config]);

  useEffect(() => {
    if (open) {
      setStep("packages");
      setSelectedPackage("");
      setSelectedMethod("");
      setError("");
      setBankInfo(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Uzuza amakuru yose: Amazina, Email, na Telefoni");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package: selectedPackage, paymentMethod: selectedMethod, name, email, phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.comingSoon) {
        setStep("comingSoon");
      } else if (data.success) {
        setBankInfo(data.bankInfo);
        setStep("success");
        // Set global subscription access — paid users read ALL articles without ads
        try {
          localStorage.setItem("umunsi_subscribed", "active");
        } catch {}
      } else {
        setError(data.error || "Habayemo ikibazo. Gerageza nyuma.");
      }
    } catch {
      setError("Ntibishoboye. Gerageza nyuma.");
    } finally {
      setLoading(false);
    }
  };

  const enabledPackages = config ? Object.entries(config.packages).filter(([, v]) => v.enabled) : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#e5b60d] to-[#c9a00c] text-white p-5 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6" />
            <h2 className="text-lg font-black">SOMA INKURU NTA ADS ZIRIMO</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Step 1: Packages */}
          {step === "packages" && (
            <div>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Wishyure usome inkuru zose nta ads zirimo ukwezi kose.
              </p>
              <div className="space-y-3">
                {enabledPackages.map(([key, pkg]) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedPackage(key); setStep("payment"); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedPackage === key ? "border-[#e5b60d] bg-[#e5b60d]/5" : "border-gray-200 hover:border-[#e5b60d]/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{pkg.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Soma inkuru zose nta ads</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-[#e5b60d]">{pkg.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{pkg.currency}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-bold text-blue-700 mb-2">Iyo wishyuye ubona:</p>
                <ul className="space-y-1.5 text-xs text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="font-black text-[#e5b60d]">1.</span>
                    <span>Verification Badge kuri App yacu ya UMUNSI MEDIA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-black text-[#e5b60d]">2.</span>
                    <span>Usoma inkuru zihariye ku buntu nta ads zirimo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-black text-[#e5b60d]">3.</span>
                    <span>Ubasha kuganira n&rsquo;abanyamakuru ba UMUNSI.COM</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === "payment" && (
            <div>
              <button onClick={() => setStep("packages")} className="text-xs text-gray-500 hover:text-gray-700 mb-3">&larr; Subira inyuma</button>
              <p className="text-sm text-gray-600 mb-4 text-center">Hitamo nzira y'ishyura:</p>
              <div className="space-y-3">
                {config?.paymentMethods.mtn.enabled && (
                  <button
                    onClick={() => { setSelectedMethod("mtn"); setStep("form"); }}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[#e5b60d]/50 transition-all flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{config.paymentMethods.mtn.label}</p>
                      {config.paymentMethods.mtn.comingSoon && <span className="text-xs text-orange-500 font-semibold">Baza vuba cyane!</span>}
                    </div>
                  </button>
                )}
                {config?.paymentMethods.airtel.enabled && (
                  <button
                    onClick={() => { setSelectedMethod("airtel"); setStep("form"); }}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[#e5b60d]/50 transition-all flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{config.paymentMethods.airtel.label}</p>
                      {config.paymentMethods.airtel.comingSoon && <span className="text-xs text-orange-500 font-semibold">Baza vuba cyane!</span>}
                    </div>
                  </button>
                )}
                {config?.paymentMethods.bank.enabled && (
                  <button
                    onClick={() => { setSelectedMethod("bank"); setStep("form"); }}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[#e5b60d]/50 transition-all flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{config.paymentMethods.bank.label}</p>
                      <span className="text-xs text-green-600 font-semibold">Biri ku murongo!</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Form */}
          {step === "form" && (
            <div>
              <button onClick={() => setStep("payment")} className="text-xs text-gray-500 hover:text-gray-700 mb-3">&larr; Subira inyuma</button>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Uzuza amakuru yawe. Twabayeje kuri email yawe ibyangobwa by'ishyura.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Amazina *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} placeholder="Andika amazina yawe" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] focus:ring-2 focus:ring-[#e5b60d]/20 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} placeholder="email@urugendo.rw" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] focus:ring-2 focus:ring-[#e5b60d]/20 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Telefoni *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={20} placeholder="+250 7XX XXX XXX" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] focus:ring-2 focus:ring-[#e5b60d]/20 outline-none text-sm" />
                  </div>
                </div>
              </div>
              {error && (
                <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#e5b60d] hover:bg-[#c9a00c] disabled:opacity-60 text-white font-bold transition-colors text-sm"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Kohereza...</> : "Emeza ishyura"}
              </button>
            </div>
          )}

          {/* Step 4: Coming Soon */}
          {step === "comingSoon" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Iyi nzira baza vuba cyane!</h3>
              <p className="text-sm text-gray-500 mb-4">
                MTN Mobile Money na Airtel Money bizaba biri ku murongo vuba. Kuri none, hitamo Bank Account wishyure.
              </p>
              <button onClick={() => setStep("payment")} className="px-6 py-2.5 rounded-xl bg-[#e5b60d] hover:bg-[#c9a00c] text-white font-bold text-sm transition-colors">
                Hitamo izindi nzira
              </button>
            </div>
          )}

          {/* Step 5: Success */}
          {step === "success" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Byakunze! Twabayeje kuri email yawe.</h3>
              <p className="text-sm text-gray-500 mb-4">
                Reba email yawe ubone amakuru y'ishyura kuri Bank. Nyuma y'uko wishyuye, uzahabwa Verification Badge ku murongo wa Umunsi Media.
              </p>
              {bankInfo && (
                <div className="bg-gray-50 rounded-xl p-4 text-left mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-2">Amakuru ya Bank:</p>
                  <p className="text-sm text-gray-700"><strong>Bank:</strong> {bankInfo.bankName}</p>
                  <p className="text-sm text-gray-700"><strong>Konti:</strong> {bankInfo.accountName}</p>
                  <p className="text-sm text-gray-700"><strong>Numero:</strong> {bankInfo.accountNumber}</p>
                  <p className="text-sm text-gray-700"><strong>Amfaranga:</strong> {bankInfo.amount?.toLocaleString()} {bankInfo.currency}</p>
                </div>
              )}
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-[#e5b60d] hover:bg-[#c9a00c] text-white font-bold text-sm transition-colors">
                Murakoze!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
