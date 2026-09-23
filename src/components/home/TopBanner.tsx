"use client";

import { useEffect, useState } from "react";

interface BannerSlot {
  enabled: boolean;
  adCode?: string;
  imageUrl?: string;
  targetUrl?: string;
  altText?: string;
  label?: string;
}

const MOBILE_IMAGE = "/images/beef-steak-top-banner.png";
const DESKTOP_IMAGE = "/images/el-classico-top-banner.png";
const DESKTOP_LINK = "https://instagram.com/el_classico_beach_chez_west/";

export function TopBanner() {
  const [slot, setSlot] = useState<BannerSlot | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/ads-banners", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const s = d?.slots?.leaderboardTop970x120;
        if (s) setSlot(s);
      })
      .catch(() => {});
  }, []);

  if (!mounted) return null;

  // If slot disabled entirely, show nothing
  if (slot && slot.enabled === false && !slot.imageUrl) return null;

  // Admin-uploaded image overrides both; otherwise per-device defaults
  const rawUrl = slot?.imageUrl || "";
  const customImage = rawUrl
    ? (rawUrl.startsWith("/uploads/") ? `https://api.umunsi.com${rawUrl}` : rawUrl)
    : "";
  const targetUrl = slot?.targetUrl || "";

  // Raw ad code (e.g. AdSense) takes priority over images
  if (slot?.adCode) {
    return (
      <div className="w-full border-b border-gray-100">
        <div
          className="w-full py-1 flex justify-center"
          dangerouslySetInnerHTML={{ __html: slot.adCode }}
        />
      </div>
    );
  }

  if (customImage) {
    return (
      <div className="w-full border-b border-gray-100">
        <a
          href={targetUrl || "#"}
          target={targetUrl.startsWith("http") ? "_blank" : undefined}
          rel={targetUrl.startsWith("http") ? "noopener noreferrer" : undefined}
          className="block w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={customImage} alt={slot?.altText || "Sponsored"} className="w-full h-auto block" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full border-b border-gray-100">
      {/* Desktop: CHEZ WEST flyer → Instagram */}
      <a
        href={DESKTOP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:block w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DESKTOP_IMAGE} alt="El Classico — Chez West" className="w-full h-auto block" />
      </a>
      {/* Mobile: beef steak flyer */}
      <div className="sm:hidden w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MOBILE_IMAGE} alt="Sponsored" className="w-full h-auto block" />
      </div>
    </div>
  );
}
