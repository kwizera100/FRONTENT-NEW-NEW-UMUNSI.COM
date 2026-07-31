"use client";

import { useEffect } from "react";

interface ArticleViewTrackerProps {
  articleId: string;
}

export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  useEffect(() => {
    if (!articleId) return;

    const tracked = sessionStorage.getItem(`view-tracked-${articleId}`);
    if (tracked) return;

    const track = async () => {
      try {
        await fetch(`/api/analytics/article/${encodeURIComponent(articleId)}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timeOnPage: 0 }),
        });
        sessionStorage.setItem(`view-tracked-${articleId}`, "1");
      } catch (error) {
        console.error("Failed to track article view:", error);
      }
    };

    const timer = setTimeout(track, 1500);
    return () => clearTimeout(timer);
  }, [articleId]);

  return null;
}
