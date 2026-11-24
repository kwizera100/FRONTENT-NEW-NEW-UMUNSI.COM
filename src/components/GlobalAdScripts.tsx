"use client";

import { useEffect, useState } from "react";
import { SocialBarAd } from "@/components/ads/SocialBarAd";
import { isSubscribed } from "@/lib/subscription";

// NOTE: adsbygoogle.js is injected into every public page's HTML by nginx
// (sub_filter before </body>). It must NOT also be mounted here — a duplicate
// script load makes Google throw "ins already has ads" errors → black boxes.
export function GlobalAdScripts() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Never show ads inside the admin dashboard — check the real browser
    // path because usePathname() can be null during prerender.
    try {
      const p = window.location.pathname;
      if (p.startsWith("/admin") || p.startsWith("/writer") || p.startsWith("/dashboard")) return;
    } catch {}

    // Never load ads for paid subscribers on public pages
    if (isSubscribed()) return;
    setEnabled(true);
  }, []);

  if (!enabled) return null;
  return <SocialBarAd />;
}
