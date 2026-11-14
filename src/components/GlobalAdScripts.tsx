"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3584259871242471";

export function GlobalAdScripts() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Never load ads inside the admin dashboard
    if (pathname?.startsWith("/admin")) {
      setEnabled(false);
      return;
    }

    // Never load ads for paid subscribers on public pages
    try {
      if (localStorage.getItem("umunsi_subscribed") === "active") {
        setEnabled(false);
        return;
      }
    } catch {}

    setEnabled(true);
  }, [pathname]);

  // next/script dedupes by src across client-side navigations and starts
  // fetching right after hydration — the previous manual appendChild ran
  // later and could insert a duplicate script tag on every route change.
  if (!enabled) return null;
  return (
    <Script
      src={ADSENSE_SRC}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
