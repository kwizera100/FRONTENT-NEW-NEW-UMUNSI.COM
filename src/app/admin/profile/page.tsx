"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Save, Download, Palette, Facebook, Twitter, Linkedin, Instagram, Globe, Loader2, Check } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";
const SERVER_BASE = "https://api.umunsi.com";

const PRESET_COLORS = [
  "#e5b60d", "#1a56db", "#059669", "#dc2626", "#7c3aed",
  "#db2777", "#0891b2", "#ea580c", "#4f46e5", "#0d9488",
  "#be123c", "#2563eb", "#16a34a", "#ca8a04", "#9333ea",
];

export default function ProfilePage() {
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [profileColor, setProfileColor] = useState("#e5b60d");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    website: "",
    studentProfile: "",
    writerProfile: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("umunsi_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    const userStr = localStorage.getItem("umunsi_admin_user");
    if (!userStr) {
      router.push("/admin/login");
      return;
    }
    const u = JSON.parse(userStr);
    setUser(u);
    setBio(u.bio || "");

    // Load extras from localStorage (profileColor, coverImage, socialLinks)
    const extrasStr = localStorage.getItem("umunsi_profile_extras");
    const extras = extrasStr ? JSON.parse(extrasStr) : {};
    const userExtras = {
      profileColor: u.profileColor || extras.profileColor || "#e5b60d",
      coverImage: u.coverImage || extras.coverImage || "",
      socialLinks: u.socialLinks || extras.socialLinks,
    };

    setProfileColor(userExtras.profileColor);
    setAvatarUrl(u.avatar || "");
    setCoverUrl(userExtras.coverImage);
    if (userExtras.socialLinks) {
      try {
        const links = typeof userExtras.socialLinks === "string" ? JSON.parse(userExtras.socialLinks) : userExtras.socialLinks;
        setSocialLinks({
          facebook: links.facebook || "",
          twitter: links.twitter || "",
          linkedin: links.linkedin || "",
          instagram: links.instagram || "",
          website: links.website || "",
          studentProfile: links.studentProfile || "",
          writerProfile: links.writerProfile || "",
        });
      } catch {}
    }

    // Fetch fresh user data from backend
    if (u.id) {
      fetch(`${API_BASE}/users/${u.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          const freshUser = data.data || data.user || data;
          if (freshUser && freshUser.id) {
            const merged = { ...u, ...freshUser };
            localStorage.setItem("umunsi_admin_user", JSON.stringify(merged));
            setUser(merged);
            setBio((prev) => prev || (merged.bio || ""));
            setAvatarUrl((prev) => prev || (merged.avatar || ""));
            setProfileColor((prev) => prev || (merged.profileColor || "#e5b60d"));
            setCoverUrl((prev) => prev || (merged.coverImage || ""));
            setSocialLinks((prev) => {
              if (prev.facebook || prev.twitter || prev.linkedin || prev.instagram || prev.website) return prev;
              if (!merged.socialLinks) return prev;
              try {
                const links = typeof merged.socialLinks === "string" ? JSON.parse(merged.socialLinks) : merged.socialLinks;
                return {
                  facebook: links.facebook || "",
                  twitter: links.twitter || "",
                  linkedin: links.linkedin || "",
                  instagram: links.instagram || "",
                  website: links.website || "",
                  studentProfile: links.studentProfile || "",
                  writerProfile: links.writerProfile || "",
                };
              } catch {
                return prev;
              }
            });
          }
        })
        .catch(() => {});
    }

    setLoading(false);
  }, [router]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("umunsi_admin_token") || "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const handleUpload = async (file: File, type: "avatar" | "cover") => {
    if (type === "avatar") setUploadingAvatar(true);
    else setUploadingCover(true);
    setError("");

    try {
      const token = localStorage.getItem("umunsi_admin_token") || "";
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        let errMsg = "Upload failed";
        try {
          const err = await res.json();
          errMsg = err.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const data = await res.json();
      const url = data.url;

      if (type === "avatar") {
        setAvatarUrl(url);
      } else {
        setCoverUrl(url);
      }
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploadingAvatar(false);
      setUploadingCover(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const token = localStorage.getItem("umunsi_admin_token") || "";
      const userId = user.id;

      // Try backend update with all fields
      let backendUpdated = false;
      let backendError = "";
      try {
        const res = await fetch("/api/users/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            bio,
            avatar: avatarUrl || undefined,
            profileColor,
            coverImage: coverUrl || undefined,
            socialLinks: JSON.stringify(socialLinks),
          }),
        });

        const result = await res.json().catch(() => ({}));
        if (res.ok || result.partial) {
          backendUpdated = true;
          if (result.warning && !result.partial) {
            backendError = result.warning;
          }
        } else {
          backendError = result.error || result.message || "Server did not accept the profile update";
        }
      } catch {
        backendError = "Network error while saving profile";
      }

      // Always save all profile data locally (including extras backend doesn't support)
      const profileExtras = {
        profileColor,
        coverImage: coverUrl || undefined,
        socialLinks,
        bio,
        avatar: avatarUrl || undefined,
      };
      const existingExtras = JSON.parse(localStorage.getItem("umunsi_profile_extras") || "{}");
      const mergedExtras = { ...existingExtras, ...profileExtras };
      localStorage.setItem("umunsi_profile_extras", JSON.stringify(mergedExtras));

      const updatedUser = { ...user, ...profileExtras };
      localStorage.setItem("umunsi_admin_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (!backendUpdated) {
        // Even if backend didn't fully accept, we saved locally
        // Show success but with a note
        setSaved(true);
        setError(backendError ? `Note: ${backendError}. Profile saved locally.` : "");
        setTimeout(() => setSaved(false), 3000);
      } else {
        setSaved(true);
        setError(backendError ? `Note: ${backendError}` : "");
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e: any) {
      setError(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const drawFallbackCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 460;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const articleCount = user?.articlesCount || user?._count?.articles || user?._count?.posts || 0;
    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—";

    // Background gradient
    const grd = ctx.createLinearGradient(0, 0, 600, 460);
    grd.addColorStop(0, profileColor);
    grd.addColorStop(1, `${profileColor}88`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 600, 460);

    // White card
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, 40, 60, 520, 340, 20);
    ctx.fill();

    // Umunsi logo (top of card)
    ctx.fillStyle = profileColor;
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("UMUNSI", 80, 105);
    ctx.fillStyle = "#111827";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(".COM", 80 + ctx.measureText("UMUNSI ").width - 6, 105);

    // Name
    ctx.fillStyle = "#111827";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(name, 80, 160);

    // Role
    ctx.fillStyle = profileColor;
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Author at Umunsi.com", 80, 200);

    // Bio (truncated)
    if (bio) {
      ctx.fillStyle = "#4b5563";
      ctx.font = "16px sans-serif";
      const maxWidth = 440;
      const words = bio.split(" ");
      let line = "";
      let y = 240;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > maxWidth) {
          ctx.fillText(line, 80, y);
          line = word + " ";
          y += 26;
          if (y > 340) break;
        } else {
          line = test;
        }
      }
      if (line && y <= 340) ctx.fillText(line, 80, y);
    }

    // Bottom info
    ctx.fillStyle = "#4b5563";
    ctx.font = "14px sans-serif";
    ctx.fillText(`Articles: ${articleCount}`, 80, 370);
    ctx.fillText(`Member since: ${memberSince}`, 80, 395);
    ctx.fillStyle = profileColor;
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("www.umunsi.com", 80, 420);

    return canvas.toDataURL("image/jpeg", 0.92);
  };

  const handleSaveAsImage = async () => {
    if (!profileRef.current) return;
    setError("");
    try {
      const { toJpeg } = await import("html-to-image");
      const dataUrl = await toJpeg(profileRef.current, {
        quality: 0.92,
        pixelRatio: 1,
        backgroundColor: "#ffffff",
        skipFonts: true,
      });
      const link = document.createElement("a");
      link.download = `umunsi-profile-${user?.username || "author"}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (e: any) {
      console.error("Save as image error:", e);
      // Fallback to a generated canvas card
      const dataUrl = drawFallbackCard();
      if (dataUrl) {
        const link = document.createElement("a");
        link.download = `umunsi-profile-${user?.username || "author"}.jpg`;
        link.href = dataUrl;
        link.click();
      } else {
        setError("Could not generate image. Right-click the preview and save it manually.");
      }
    }
  };

  // Helper for rounded rect on canvas
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Author";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-ink-900">My Profile</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAsImage}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
          >
            <Download className="w-4 h-4" /> Save as Image
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Profile Preview Card */}
      <div ref={profileRef} className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
        {/* Cover */}
        <div className="relative h-40 sm:h-48 overflow-hidden">
          {coverUrl ? (
            <img src={coverUrl} alt="Cover" crossOrigin="anonymous" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${profileColor}, ${profileColor}88)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Profile info */}
        <div className="px-6 sm:px-8 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Avatar */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-white shadow-lg shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} crossOrigin="anonymous" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-black text-4xl"
                  style={{ background: `linear-gradient(135deg, ${profileColor}, ${profileColor}dd)` }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 pt-2">
              <h2 className="text-xl font-black text-gray-900">{name}</h2>
              <p className="text-sm font-bold uppercase tracking-wide" style={{ color: profileColor }}>
                Author at Umunsi.com
              </p>
              {bio && <p className="text-gray-600 text-sm mt-2 leading-6 whitespace-pre-line">{bio}</p>}
              <div className="flex items-center gap-2 mt-3">
                {socialLinks.facebook && <Facebook className="w-4 h-4 text-gray-500" />}
                {socialLinks.twitter && <Twitter className="w-4 h-4 text-gray-500" />}
                {socialLinks.linkedin && <Linkedin className="w-4 h-4 text-gray-500" />}
                {socialLinks.instagram && <Instagram className="w-4 h-4 text-gray-500" />}
                {socialLinks.website && <Globe className="w-4 h-4 text-gray-500" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6">
        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-black text-2xl">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors">
              {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploadingAvatar ? "Uploading..." : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file, "avatar");
                }}
              />
            </label>
          </div>
        </div>

        {/* Cover Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-20 rounded-lg overflow-hidden ring-2 ring-gray-200 shrink-0">
              {coverUrl ? (
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors">
              {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploadingCover ? "Uploading..." : "Upload Cover"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file, "cover");
                }}
              />
            </label>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell readers about yourself..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm text-gray-700 resize-none"
          />
        </div>

        {/* Profile Color */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Palette className="w-4 h-4" /> Profile Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setProfileColor(color)}
                className={`w-10 h-10 rounded-full transition-all ${profileColor === color ? "ring-4 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
                style={{ backgroundColor: color }}
              />
            ))}
            <input
              type="color"
              value={profileColor}
              onChange={(e) => setProfileColor(e.target.value)}
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-200"
            />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Social Media Links</label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Facebook className="w-5 h-5 text-blue-600" />
              </div>
              <input
                type="url"
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                placeholder="https://facebook.com/yourname"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Twitter className="w-5 h-5 text-gray-700" />
              </div>
              <input
                type="url"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                placeholder="https://x.com/yourname"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Linkedin className="w-5 h-5 text-blue-700" />
              </div>
              <input
                type="url"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/yourname"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center shrink-0">
                <Instagram className="w-5 h-5 text-pink-600" />
              </div>
              <input
                type="url"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                placeholder="https://instagram.com/yourname"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-gray-600" />
              </div>
              <input
                type="url"
                value={socialLinks.website}
                onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0 bg-gray-50">
                <img src="/images/student-umunsi-logo.png" alt="Student" className="w-7 h-7 object-contain" />
              </div>
              <input
                type="url"
                value={socialLinks.studentProfile}
                onChange={(e) => setSocialLinks({ ...socialLinks, studentProfile: e.target.value })}
                placeholder="https://student.umunsi.com/your-profile"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0 bg-gray-50">
                <img src="/images/umunsimedia-logo.jpg" alt="Writer" className="w-7 h-7 object-contain" />
              </div>
              <input
                type="url"
                value={socialLinks.writerProfile}
                onChange={(e) => setSocialLinks({ ...socialLinks, writerProfile: e.target.value })}
                placeholder="https://writer.umunsi.com/your-profile"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save button at bottom too */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
