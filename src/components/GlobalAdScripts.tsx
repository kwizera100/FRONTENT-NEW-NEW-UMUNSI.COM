"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { SocialBarAd } from "@/components/ads/SocialBarAd";

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3584259871242471";

export function GlobalAdScripts() {
  const pathname = usePathname();
  const isAdminPath = (p: string) =>
    p.startsWith("/admin") || p.startsWith("/writer") || p.startsWith("/dashboard");
  const isAdmin =
    (pathname ? isAdminPath(pathname) : false) ||
    (typeof window !== "undefined" && isAdminPath(window.location.pathname));
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Never show ads inside the admin dashboard — check the real browser
    // path because usePathname() can be null during prerender.
    try {
      const p = window.location.pathname;
      if (p.startsWith("/admin") || p.startsWith("/writer") || p.startsWith("/dashboard")) return;
    } catch {}

    // Never load ads for paid subscribers on public pages
    try {
      if (localStorage.getItem("umunsi_subscribed") === "active") return;
    } catch {}
    setEnabled(true);
  }, []);

  // Never load ads inside the admin dashboard (known at render time)
  if (isAdmin) return null;

  // The <Script> renders on first paint — it must NOT wait for the enabled
  // effect, or mobile devices request adsbygoogle.js only after full
  // hydration and units sit empty for seconds.
  return (
    <>
      <Script
        src={ADSENSE_SRC}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      {enabled && <SocialBarAd />}
    </>
  );
}
