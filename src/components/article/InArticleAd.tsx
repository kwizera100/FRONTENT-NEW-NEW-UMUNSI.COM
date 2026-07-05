"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function InArticleAd() {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // AdSense not loaded yet — silently ignore
    }
  }, []);

  return (
    <div className="my-6 sm:my-8">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-3584259871242471"
        data-ad-slot="6173432779"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
