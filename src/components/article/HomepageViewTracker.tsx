"use client";

import { useEffect } from "react";

interface HomepageViewTrackerProps {
  articleId: string;
}

/**
 * Tracks homepage views using the SAME article analytics endpoint
 * so all views (homepage + articles) appear in one place in the admin dashboard.
 * Uses the first featured article's ID to record the view.
 */
export function HomepageViewTracker({ articleId }: HomepageViewTrackerProps) {
  useEffect(() => {
    if (!articleId) return;

    const track = async () => {
      const body = JSON.stringify({ timeOnPage: Math.floor(performance.now() / 1000) });
      try {
        if (navigator.sendBeacon) {
          const blob = new Blob([body], { type: "application/json" });
          const sent = navigator.sendBeacon(
            `/api/analytics/article/${encodeURIComponent(articleId)}/view`,
            blob
          );
          if (sent) return;
        }
        await fetch(`/api/analytics/article/${encodeURIComponent(articleId)}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        });
      } catch (error) {
        console.error("Failed to track homepage view:", error);
      }
    };

    // Track on every homepage load — no dedup, every visit counts
    track();
  }, [articleId]);

  return null;
}
