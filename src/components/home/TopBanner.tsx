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

const DEFAULT_IMAGE = "/images/el-classico-top-banner.png";

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

  const rawUrl = slot?.imageUrl || DEFAULT_IMAGE;
  // /uploads/... paths are served by the backend; /images/... are frontend assets
  const imageUrl = rawUrl.startsWith("/uploads/")
    ? `https://api.umunsi.com${rawUrl}`
    : rawUrl;
  const targetUrl = slot?.targetUrl || "#";
  const alt = slot?.altText || "Sponsored";

  // Raw ad code (e.g. AdSense) takes priority over image
  if (slot?.adCode) {
    return (
      <div className="w-full bg-gray-50 border-b border-gray-100">
        <div
          className="max-w-[970px] mx-auto py-2 flex justify-center"
          dangerouslySetInnerHTML={{ __html: slot.adCode }}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 border-b border-gray-100">
      <a
        href={targetUrl}
        target={targetUrl.startsWith("http") ? "_blank" : undefined}
        rel={targetUrl.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block max-w-[970px] mx-auto"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto max-h-[120px] sm:max-h-[150px] object-contain mx-auto"
        />
      </a>
    </div>
  );
}
