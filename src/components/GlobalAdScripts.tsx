"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const AD_SCRIPTS = [
  "https://pl18337357.profitableratecpmnetwork.com/8b/bd/af/8bbdaf0eb5f4fa429c2183dbad47a65a.js",
];

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3584259871242471";

function isLoggedInAdminOrAuthor(): boolean {
  try {
    const userStr = localStorage.getItem("umunsi_admin_user");
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return ["ADMIN", "AUTHOR"].includes(String(user?.role || "").toUpperCase());
  } catch {
    return false;
  }
}

export function GlobalAdScripts() {
  const pathname = usePathname();

  useEffect(() => {
    // Never load ads inside the admin dashboard
    if (pathname?.startsWith("/admin")) return;

    // Never load ads for logged-in admins/authors or paid subscribers
    if (isLoggedInAdminOrAuthor()) return;
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
