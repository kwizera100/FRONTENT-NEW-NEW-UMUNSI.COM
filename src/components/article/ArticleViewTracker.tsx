"use client";

import { useEffect } from "react";

interface ArticleViewTrackerProps {
  articleId: string;
}

// Known bot/crawler user-agent signatures — don't track views for these.
// Good bots (Googlebot, Bingbot, etc.) can still access articles for SEO,
// but they don't execute client-side JS so this is a safety net.
const BOT_SIGNATURES = [
  "googlebot", "bingbot", "duckduckbot", "slurp", "baiduspider", "yandexbot",
  "facebookexternalhit", "twitterbot", "linkedinbot", "telegrambot",
  "whatsapp", "slackbot", "discordbot", "applebot", "petalbot",
  "python-requests", "curl/", "wget/", "scrapy", "zgrab", "semrush",
  "ahrefsbot", "mj12bot", "dotbot", "bytespider", "crawler", "spider",
];

function isBotUserAgent(ua: string): boolean {
  if (!ua || ua.trim().length === 0) return true;
  const normalized = ua.toLowerCase();
  return BOT_SIGNATURES.some((sig) => normalized.includes(sig));
}

export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  useEffect(() => {
    if (!articleId) return;

    // Skip tracking for bots/crawlers — only count real human visitors
    if (isBotUserAgent(navigator.userAgent)) return;

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
