"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AD_CLIENT = "ca-pub-3584259871242471";

interface AdUnitProps {
  slot: string;
  className?: string;
  label?: string;
}

// Explicit responsive AdSense unit. Unlike Auto Ads (which picks its own
// placements), this guarantees an ad slot at the spot it's rendered.
export function AdUnit({ slot, className = "", label = "Advertisement" }: AdUnitProps) {
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (localStorage.getItem("umunsi_subscribed") === "active") return;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet — the push is queued by the array anyway
    }
  }, []);

  return (
    <div className={`my-6 sm:my-8 ${className}`}>
      <p className="text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">{label}</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
