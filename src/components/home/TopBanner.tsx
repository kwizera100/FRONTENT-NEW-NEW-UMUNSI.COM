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

const DEFAULT_IMAGE = "/images/beef-steak-top-banner.png";

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

  const rawUrl = slot?.imageUrl;
  const imageUrl = rawUrl
    ? (rawUrl.startsWith("/uploads/") ? `https://api.umunsi.com${rawUrl}` : rawUrl)
    : DEFAULT_IMAGE;
  const targetUrl = slot?.targetUrl || "#";
  const alt = slot?.altText || "Sponsored";

  // Raw ad code (e.g. AdSense) takes priority over image
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

  return (
    <div className="w-full border-b border-gray-100">
      <a
        href={targetUrl}
        target={targetUrl.startsWith("http") ? "_blank" : undefined}
        rel={targetUrl.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto block"
        />
      </a>
    </div>
  );
}
