"use client";

import { useEffect } from "react";

interface ArticleViewTrackerProps {
  articleId: string;
}

export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  useEffect(() => {
    if (!articleId) return;

    const key = `view-tracked-${articleId}`;
    const tracked = sessionStorage.getItem(key);

    const track = async () => {
      try {
        await fetch(`/api/analytics/article/${encodeURIComponent(articleId)}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timeOnPage: Math.floor(performance.now() / 1000) }),
        });
        sessionStorage.setItem(key, String(Date.now()));
      } catch (error) {
        console.error("Failed to track article view:", error);
      }
    };

    // Track immediately if not already tracked in this session,
    // or re-track after 5 minutes to count returning readers within same session
    const lastTrack = tracked ? parseInt(tracked, 10) : 0;
    const reTrackAfterMs = 5 * 60 * 1000; // 5 minutes
    const shouldTrack = !tracked || Date.now() - lastTrack > reTrackAfterMs;

    if (shouldTrack) {
      // Wait 3 seconds to ensure the reader is actually reading the article
      const timer = setTimeout(track, 3000);
      return () => clearTimeout(timer);
    }
  }, [articleId]);

  return null;
}
