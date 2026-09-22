"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Bell, Shield, Image as ImageIcon, Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";

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
  const [sponsoredBannerImage, setSponsoredBannerImage] = useState("");
  const [sponsoredBannerLink, setSponsoredBannerLink] = useState("/contact");
  const [sponsoredBannerTitle, setSponsoredBannerTitle] = useState("Sponsored");
  const [sponsoredBanner2Image, setSponsoredBanner2Image] = useState("");
  const [sponsoredBanner2Link, setSponsoredBanner2Link] = useState("/contact");
  const [sponsoredBanner2Title, setSponsoredBanner2Title] = useState("Sponsored");
  const [topBannerImage, setTopBannerImage] = useState("");
  const [topBannerLink, setTopBannerLink] = useState("");
  const [topBannerEnabled, setTopBannerEnabled] = useState(true);
  const [topBannerSaving, setTopBannerSaving] = useState(false);
  const [topBannerMsg, setTopBannerMsg] = useState("");
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
        if (data.sponsoredBannerImage) setSponsoredBannerImage(data.sponsoredBannerImage);
        if (data.sponsoredBannerLink) setSponsoredBannerLink(data.sponsoredBannerLink);
        if (data.sponsoredBannerTitle) setSponsoredBannerTitle(data.sponsoredBannerTitle);
        if (data.sponsoredBanner2Image) setSponsoredBanner2Image(data.sponsoredBanner2Image);
        if (data.sponsoredBanner2Link) setSponsoredBanner2Link(data.sponsoredBanner2Link);
        if (data.sponsoredBanner2Title) setSponsoredBanner2Title(data.sponsoredBanner2Title);
      })
      .catch(() => {});

    // Load top leaderboard banner slot
    fetch("/api/ads-banners")
      .then((r) => r.json())
      .then((data) => {
        const s = data?.slots?.leaderboardTop970x120;
        if (s) {
          setTopBannerImage(s.imageUrl || "");
          setTopBannerLink(s.targetUrl || "");
          setTopBannerEnabled(s.enabled !== false);
        }
      })
      .catch(() => {});
  }, []);

  const saveTopBanner = async () => {
    setTopBannerSaving(true);
    setTopBannerMsg("");
    try {
      const token = localStorage.getItem("umunsi_admin_token");
      // Fetch current slots, update only the leaderboard slot
      const cur = await fetch("/api/ads-banners").then((r) => r.json()).catch(() => ({}));
      const slots = { ...(cur?.slots || {}) };
      slots.leaderboardTop970x120 = {
        ...(slots.leaderboardTop970x120 || {}),
        enabled: topBannerEnabled,
        imageUrl: topBannerImage,
        targetUrl: topBannerLink,
        adCode: "",
        altText: "Top Banner",
        size: "970x120",
        label: "Leaderboard Banner (Top)",
      };
      const res = await fetch("/api/admin/ads-banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slots }),
      });
      const data = await res.json();
      setTopBannerMsg(res.ok ? "Top banner saved!" : (data.error || "Failed to save"));
    } catch {
      setTopBannerMsg("Failed to save top banner.");
    } finally {
      setTopBannerSaving(false);
    }
  };

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

      {/* Top leaderboard banner — shows at very top of site */}
      <div className="bg-white rounded-2xl border border-ink-100 p-6">
        <h3 className="font-bold text-ink-900 mb-5 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-brand-600" />
          Top Banner (970x120 — hejuru y'urubuga)
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-ink-900">Show top banner</p>
              <p className="text-xs text-ink-400">Igaragara hejuru cyane, mbere ya navigation</p>
            </div>
            <button
              onClick={() => setTopBannerEnabled(!topBannerEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${topBannerEnabled ? "bg-brand-600" : "bg-ink-200"}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${topBannerEnabled ? "left-7" : "left-1"}`} />
            </button>
          </div>
          <ImageUploader
            compact
            onUploadComplete={(url) => setTopBannerImage(url)}
            onClose={() => {}}
          />
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">Banner Image URL</label>
            <input
              type="text"
              value={topBannerImage}
              onChange={(e) => setTopBannerImage(e.target.value)}
              placeholder="https://... or /images/... (GIF, PNG, JPG, WebP)"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
            <p className="text-xs text-ink-400 mt-1">Recommended size: 970x120 (wide leaderboard, GIF supported).</p>
          </div>
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">Click Link (optional)</label>
            <input
              type="text"
              value={topBannerLink}
              onChange={(e) => setTopBannerLink(e.target.value)}
              placeholder="https://... or /contact"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
          {topBannerImage && (
            <div className="rounded-xl overflow-hidden border border-ink-200 bg-white">
              <img src={topBannerImage} alt="Top banner preview" className="w-full h-auto max-h-[120px] object-contain mx-auto" />
            </div>
          )}
          <button
            onClick={saveTopBanner}
            disabled={topBannerSaving}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {topBannerSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {topBannerSaving ? "Bika..." : "Save Top Banner"}
          </button>
          {topBannerMsg && <p className={`text-sm ${topBannerMsg.includes("saved") ? "text-green-600" : "text-red-600"}`}>{topBannerMsg}</p>}
        </div>
      </div>

      {/* Sponsored banner */}
      <div className="bg-white rounded-2xl border border-ink-100 p-6">
        <h3 className="font-bold text-ink-900 mb-5 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-brand-600" />
          Sponsored Banner
        </h3>
        <div className="space-y-4">
          <ImageUploader
            compact
            onUploadComplete={(url) => setSponsoredBannerImage(url)}
            onClose={() => {}}
          />
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">Banner Image URL</label>
            <input
              type="text"
              value={sponsoredBannerImage}
              onChange={(e) => setSponsoredBannerImage(e.target.value)}
              placeholder="https://... (GIF, PNG, JPG, WebP)"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
            <p className="text-xs text-ink-400 mt-1">Recommended exact size: 300x250 (vertical slot, GIF supported).</p>
          </div>
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">Banner Title</label>
            <input
              type="text"
              value={sponsoredBannerTitle}
              onChange={(e) => setSponsoredBannerTitle(e.target.value)}
              placeholder="Sponsored"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">Click Link</label>
            <input
              type="text"
              value={sponsoredBannerLink}
              onChange={(e) => setSponsoredBannerLink(e.target.value)}
              placeholder="https://... or /contact"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
          {sponsoredBannerImage && (
            <div className="rounded-xl overflow-hidden border border-ink-200 h-[200px] w-full bg-white">
              <img src={sponsoredBannerImage} alt="Banner preview" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* Second sponsored banner */}
      <div className="bg-white rounded-2xl border border-ink-100 p-6">
        <h3 className="font-bold text-ink-900 mb-5 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-brand-600" />
          Second Sponsored Banner
        </h3>
        <div className="space-y-4">
          <ImageUploader
            compact
            onUploadComplete={(url) => setSponsoredBanner2Image(url)}
            onClose={() => {}}
          />
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">Banner Image URL</label>
            <input
              type="text"
              value={sponsoredBanner2Image}
              onChange={(e) => setSponsoredBanner2Image(e.target.value)}
              placeholder="https://... (GIF, PNG, JPG, WebP)"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
            <p className="text-xs text-ink-400 mt-1">Recommended exact size: 728x90 (leaderboard slot, GIF supported).</p>
          </div>
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">Banner Title</label>
            <input
              type="text"
              value={sponsoredBanner2Title}
              onChange={(e) => setSponsoredBanner2Title(e.target.value)}
              placeholder="Sponsored"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-ink-700 mb-1.5 block">Click Link</label>
            <input
              type="text"
              value={sponsoredBanner2Link}
              onChange={(e) => setSponsoredBanner2Link(e.target.value)}
              placeholder="https://... or /contact"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
            />
          </div>
          {sponsoredBanner2Image && (
            <div className="rounded-xl overflow-hidden border border-ink-200 h-[90px] w-full bg-white">
              <img src={sponsoredBanner2Image} alt="Second banner preview" className="w-full h-full object-contain" />
            </div>
          )}
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
                sponsoredBannerImage,
                sponsoredBannerLink,
                sponsoredBannerTitle,
                sponsoredBanner2Image,
                sponsoredBanner2Link,
                sponsoredBanner2Title,
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
