"use client";

import { useState, useEffect } from "react";
import { Crown, Save, Loader2, CheckCircle, Building2, Smartphone, Globe, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminPaymentSettingsPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("umunsi_admin_token") : "";

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/admin/config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (data.config) setConfig(data.config);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/payment/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(config),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setMessage("Payment settings saved successfully!");
        if (data.config) setConfig(data.config);
        setTimeout(() => setMessage(""), 4000);
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const updatePackage = (key: string, field: string, value: any) => {
    setConfig((c: any) => ({
      ...c,
      packages: { ...c.packages, [key]: { ...c.packages[key], [field]: value } },
    }));
  };

  const updateMethod = (key: string, field: string, value: any) => {
    setConfig((c: any) => ({
      ...c,
      paymentMethods: { ...c.paymentMethods, [key]: { ...c.paymentMethods[key], [field]: value } },
    }));
  };

  const updateAdConfig = (field: string, value: any) => {
    setConfig((c: any) => ({ ...c, adConfig: { ...c.adConfig, [field]: value } }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#e5b60d] animate-spin" />
      </div>
    );
  }

  if (!config) {
    return <div className="text-center py-20 text-gray-400">Could not load payment settings.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-8 rounded-full bg-[#e5b60d]" />
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Crown className="w-7 h-7 text-[#e5b60d]" />
          Payment & Ads Settings
        </h1>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {message}
        </div>
      )}

      {/* Packages */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
        <h2 className="font-bold text-gray-900 mb-4">Payment Packages (Prices)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["weekly", "monthly", "yearly"].map((key) => {
            const pkg = config.packages[key];
            if (!pkg) return null;
            return (
              <div key={key} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-gray-700">{pkg.label}</span>
                  <button onClick={() => updatePackage(key, "enabled", !pkg.enabled)}>
                    {pkg.enabled ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={pkg.price}
                    onChange={(e) => updatePackage(key, "price", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#e5b60d] outline-none text-sm"
                  />
                  <span className="text-xs font-bold text-gray-500">{pkg.currency}</span>
                </div>
                <input
                  type="text"
                  value={pkg.label}
                  onChange={(e) => updatePackage(key, "label", e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#e5b60d] outline-none text-xs"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
        <h2 className="font-bold text-gray-900 mb-4">Payment Methods</h2>
        <div className="space-y-4">
          {/* MTN */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center"><Smartphone className="w-5 h-5 text-white" /></div>
              <div>
                <p className="font-bold text-sm text-gray-900">{config.paymentMethods.mtn.label}</p>
                <label className="flex items-center gap-2 mt-1">
                  <input type="checkbox" checked={config.paymentMethods.mtn.comingSoon} onChange={(e) => updateMethod("mtn", "comingSoon", e.target.checked)} className="rounded" />
                  <span className="text-xs text-orange-600 font-semibold">Coming Soon</span>
                </label>
              </div>
            </div>
            <button onClick={() => updateMethod("mtn", "enabled", !config.paymentMethods.mtn.enabled)}>
              {config.paymentMethods.mtn.enabled ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
            </button>
          </div>

          {/* Airtel */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center"><Smartphone className="w-5 h-5 text-white" /></div>
              <div>
                <p className="font-bold text-sm text-gray-900">{config.paymentMethods.airtel.label}</p>
                <label className="flex items-center gap-2 mt-1">
                  <input type="checkbox" checked={config.paymentMethods.airtel.comingSoon} onChange={(e) => updateMethod("airtel", "comingSoon", e.target.checked)} className="rounded" />
                  <span className="text-xs text-orange-600 font-semibold">Coming Soon</span>
                </label>
              </div>
            </div>
            <button onClick={() => updateMethod("airtel", "enabled", !config.paymentMethods.airtel.enabled)}>
              {config.paymentMethods.airtel.enabled ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
            </button>
          </div>

          {/* Bank */}
          <div className="p-3 border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center"><Building2 className="w-5 h-5 text-white" /></div>
                <p className="font-bold text-sm text-gray-900">{config.paymentMethods.bank.label}</p>
              </div>
              <button onClick={() => updateMethod("bank", "enabled", !config.paymentMethods.bank.enabled)}>
                {config.paymentMethods.bank.enabled ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={config.paymentMethods.bank.bankName} onChange={(e) => updateMethod("bank", "bankName", e.target.value)} placeholder="Bank Name" className="px-3 py-2 rounded-lg border border-gray-200 focus:border-[#e5b60d] outline-none text-xs" />
              <input type="text" value={config.paymentMethods.bank.accountName} onChange={(e) => updateMethod("bank", "accountName", e.target.value)} placeholder="Account Name" className="px-3 py-2 rounded-lg border border-gray-200 focus:border-[#e5b60d] outline-none text-xs" />
              <input type="text" value={config.paymentMethods.bank.accountNumber} onChange={(e) => updateMethod("bank", "accountNumber", e.target.value)} placeholder="Account Number" className="px-3 py-2 rounded-lg border border-gray-200 focus:border-[#e5b60d] outline-none text-xs" />
              <input type="text" value={config.paymentMethods.bank.swiftCode} onChange={(e) => updateMethod("bank", "swiftCode", e.target.value)} placeholder="Swift Code" className="px-3 py-2 rounded-lg border border-gray-200 focus:border-[#e5b60d] outline-none text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Global Ad Config */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
        <h2 className="font-bold text-gray-900 mb-4">Ads Global Config</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <span className="text-sm font-semibold text-gray-700">Google AdSense (Global)</span>
            <button onClick={() => updateAdConfig("globalAdsense", !config.adConfig.globalAdsense)}>
              {config.adConfig.globalAdsense ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
            </button>
          </label>
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <span className="text-sm font-semibold text-gray-700">Adsterra Ads (Global)</span>
            <button onClick={() => updateAdConfig("globalAdsterra", !config.adConfig.globalAdsterra)}>
              {config.adConfig.globalAdsterra ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
            </button>
          </label>
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <span className="text-sm font-semibold text-gray-700">Show Ads by Default</span>
            <button onClick={() => updateAdConfig("defaultShowAds", !config.adConfig.defaultShowAds)}>
              {config.adConfig.defaultShowAds ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
            </button>
          </label>
        </div>
      </div>

      {/* Umunsi Media URL */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-[#e5b60d]" /> Umunsi Media Signup URL</h2>
        <input
          type="text"
          value={config.umunsiMediaSignupUrl || ""}
          onChange={(e) => setConfig((c: any) => ({ ...c, umunsiMediaSignupUrl: e.target.value }))}
          placeholder="https://writer.umunsi.com/signup"
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] outline-none text-sm"
        />
        <p className="text-xs text-gray-400 mt-2">Aha ni ho user azahabwa Verification Badge nyuma y'uko wishyuye.</p>
      </div>

      {/* Save button */}
      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e5b60d] hover:bg-[#c9a00c] disabled:opacity-60 text-white font-bold transition-colors text-sm"
      >
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save payment settings</>}
      </button>
    </div>
  );
}
