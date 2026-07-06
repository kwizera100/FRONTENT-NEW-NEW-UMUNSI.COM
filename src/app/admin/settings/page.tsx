"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Bell, Shield, Image as ImageIcon, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("Umunsi.com");
  const [siteDesc, setSiteDesc] = useState(
    "Urubuga rw'inkuru z'icyamamare mu Rwanda no ku isi."
  );
  const [siteUrl, setSiteUrl] = useState("https://umunsi.com");
  const [logoUrl, setLogoUrl] = useState("");
  const [email, setEmail] = useState("info@umunsi.com");
  const [phone, setPhone] = useState("+250 788 000 000");
  const [address, setAddress] = useState("KN 5 Ave, Kigali, Rwanda");
  const [socialFacebook, setSocialFacebook] = useState("https://facebook.com/umunsi");
  const [socialTwitter, setSocialTwitter] = useState("https://twitter.com/umunsi");
  const [socialInstagram, setSocialInstagram] = useState("https://instagram.com/umunsi");
  const [socialYoutube, setSocialYoutube] = useState("https://youtube.com/umunsi");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.siteName) setSiteName(data.siteName);
        if (data.siteDescription) setSiteDesc(data.siteDescription);
        if (data.siteUrl) setSiteUrl(data.siteUrl);
        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.email) setEmail(data.email);
        if (data.phone) setPhone(data.phone);
        if (data.address) setAddress(data.address);
        if (data.socialFacebook) setSocialFacebook(data.socialFacebook);
        if (data.socialTwitter) setSocialTwitter(data.socialTwitter);
        if (data.socialInstagram) setSocialInstagram(data.socialInstagram);
        if (data.socialYoutube) setSocialYoutube(data.socialYoutube);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-ink-900">Igenamiterere</h2>
        <p className="text-ink-400 text-sm mt-1">
          Hano ni ho ushobora guhindura amakuru y'urubuga.
        </p>
      </div>

      {/* Site info */}
      <div className="bg-white rounded-2xl border border-ink-100 p-6">
        <h3 className="font-bold text-ink-900 mb-5 flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-600" />
          Amakuru y'urubuga
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">
              Izina ry'urubuga
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">
              Ibirango (Description)
            </label>
            <textarea
              value={siteDesc}
              onChange={(e) => setSiteDesc(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">
              URL y'urubuga
            </label>
            <input
              type="text"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">
              Logo URL
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-ink-100 p-6">
        <h3 className="font-bold text-ink-900 mb-5 flex items-center gap-2">
          <Mail className="w-5 h-5 text-brand-600" />
          Amakuru yo kwitumanaho
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">
              Emeyili
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">
              Telefoni
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">
              Aderesi
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Social media */}
      <div className="bg-white rounded-2xl border border-ink-100 p-6">
        <h3 className="font-bold text-ink-900 mb-5 flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-600" />
          Media ya sosiyete
        </h3>
        <div className="space-y-4">
          {[
            { label: "Facebook", value: socialFacebook, setter: setSocialFacebook },
            { label: "Twitter / X", value: socialTwitter, setter: setSocialTwitter },
            { label: "Instagram", value: socialInstagram, setter: setSocialInstagram },
            { label: "YouTube", value: socialYoutube, setter: setSocialYoutube },
          ].map((social) => (
            <div key={social.label}>
              <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                {social.label}
              </label>
              <input
                type="text"
                value={social.value}
                onChange={(e) => social.setter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={async () => {
          setSaving(true);
          setSaveMsg("");
          try {
            const token = localStorage.getItem("umunsi_admin_token");
            const res = await fetch("/api/settings", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                siteName,
                siteDescription: siteDesc,
                siteUrl,
                logoUrl,
                email,
                phone,
                address,
                socialFacebook,
                socialTwitter,
                socialInstagram,
                socialYoutube,
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              setSaveMsg(data.error || "Failed to save settings.");
            } else {
              setSaveMsg("Igenamiterere cyabitswe neza!");
            }
          } catch {
            setSaveMsg("Network error. Please try again.");
          } finally {
            setSaving(false);
          }
        }}
        disabled={saving}
        className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {saving ? "Birimo..." : "Bika igenamiterere"}
      </button>
      {saveMsg && (
        <p className={`text-sm font-semibold text-center ${saveMsg.includes("error") || saveMsg.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
          {saveMsg}
        </p>
      )}
    </div>
  );
}
