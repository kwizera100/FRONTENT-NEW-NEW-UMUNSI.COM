"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const AD_SCRIPTS: string[] = [];

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3584259871242471";

export function GlobalAdScripts() {
  const pathname = usePathname();

  useEffect(() => {
    // Never load ads inside the admin dashboard
    if (pathname?.startsWith("/admin")) return;

    // Never load ads for paid subscribers
    try {
      if (localStorage.getItem("umunsi_subscribed") === "active") return;
    } catch {}

    const adsense = document.createElement("script");
    adsense.async = true;
    adsense.src = ADSENSE_SRC;
    adsense.crossOrigin = "anonymous";
    document.head.appendChild(adsense);

    AD_SCRIPTS.forEach((src) => {
      const s = document.createElement("script");
      s.async = true;
      s.src = src;
      document.body.appendChild(s);
    });
  }, [pathname]);

  return null;
}
