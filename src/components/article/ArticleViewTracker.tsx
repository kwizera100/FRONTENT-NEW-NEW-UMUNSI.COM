"use client";

import { useEffect } from "react";

interface ArticleViewTrackerProps {
  articleId: string;
}

export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  useEffect(() => {
    if (!articleId) return;

    const track = async () => {
      const body = JSON.stringify({ timeOnPage: Math.floor(performance.now() / 1000) });
      try {
        // Use sendBeacon for reliability — it survives page unload
        if (navigator.sendBeacon) {
          const blob = new Blob([body], { type: "application/json" });
          const sent = navigator.sendBeacon(
            `/api/analytics/article/${encodeURIComponent(articleId)}/view`,
            blob
          );
          if (sent) return;
        }
        // Fallback to fetch if sendBeacon is not available or failed
        await fetch(`/api/analytics/article/${encodeURIComponent(articleId)}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        });
      } catch (error) {
        console.error("Failed to track article view:", error);
      }
    };

    // Exactly one view per page load — same rule AdSense uses for page views.
    // (A visibilitychange re-track used to add an extra view every time the
    // reader switched tabs or locked their phone, inflating counts.)
    track();
  }, [articleId]);

  return null;
}
