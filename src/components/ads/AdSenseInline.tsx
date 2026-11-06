"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AD_CLIENT = "ca-pub-3584259871242471";

interface AdSenseInlineProps {
  slot: string;
  className?: string;
}

// Bare responsive AdSense unit — no label, Google decides the creative.
export function AdSenseInline({ slot, className = "" }: AdSenseInlineProps) {
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
    <div className={className}>
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
