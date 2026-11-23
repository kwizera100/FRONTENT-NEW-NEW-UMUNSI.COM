"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AD_CLIENT = "ca-pub-3584259871242471";
// Dedicated social-bar popup unit (AdSense unit "GFFGVB").
const SOCIAL_BAR_SLOT = "5671764426";
const DISMISS_KEY = "umunsi_socialbar_closed";
const SHOW_DELAY_MS = 5000;

// Floating notification-style ad card (Adsterra "social bar" equivalent) —
// bottom-right on desktop, bottom-centered on mobile, dismissible per session.
export function SocialBarAd() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Desktop only — the notification-style popup is disabled on mobile
    if (window.matchMedia("(max-width: 767px)").matches) return;
    // Never inside the admin dashboard or author panels
    if (window.location.pathname.startsWith("/admin")) return;
    if (window.location.pathname.startsWith("/writer")) return;
    if (window.location.pathname.startsWith("/dashboard")) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {}
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet — push is queued by the array anyway
    }
  }, [visible]);

  if (!visible) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Advertisement"
      className="fixed z-[9999] bottom-3 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0
        w-[calc(100vw-1.5rem)] max-w-[340px] rounded-2xl overflow-hidden
        bg-white border border-gray-200 shadow-2xl"
    >
      {/* Notification-style header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Sponsored
        </span>
        <button
          onClick={dismiss}
          aria-label="Close ad"
          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={SOCIAL_BAR_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
