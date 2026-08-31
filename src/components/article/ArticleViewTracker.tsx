"use client";

import { useEffect } from "react";

interface ArticleViewTrackerProps {
  articleId: string;
}

// Known bot/crawler user-agent signatures — don't track views for these.
// Good bots (Googlebot, Bingbot, etc.) can still access articles for SEO,
// but they don't execute client-side JS so this is a safety net.
// NOTE: "crawler" and "spider" removed — too broad, can match legit apps.
const BOT_SIGNATURES = [
  "googlebot", "bingbot", "duckduckbot", "slurp", "baiduspider", "yandexbot",
  "facebookexternalhit", "twitterbot", "linkedinbot", "telegrambot",
  "whatsapp", "slackbot", "discordbot", "applebot", "petalbot",
  "python-requests", "curl/", "wget/", "scrapy", "zgrab", "semrush",
  "ahrefsbot", "mj12bot", "dotbot", "bytespider",
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
          if (sent) {
            sessionStorage.setItem(key, String(Date.now()));
            return;
          }
        }
        // Fallback to fetch if sendBeacon is not available or failed
        await fetch(`/api/analytics/article/${encodeURIComponent(articleId)}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        });
        sessionStorage.setItem(key, String(Date.now()));
      } catch (error) {
        console.error("Failed to track article view:", error);
      }
    };

    // Check if already tracked in this session — but only block for 2 minutes
    // (reduced from 5 to count returning readers sooner)
    const tracked = sessionStorage.getItem(key);
    const lastTrack = tracked ? parseInt(tracked, 10) : 0;
    const reTrackAfterMs = 2 * 60 * 1000; // 2 minutes
    const shouldTrack = !tracked || Date.now() - lastTrack > reTrackAfterMs;

    if (shouldTrack) {
      // Track after 500ms — quick enough to catch most visitors
      const timer = setTimeout(track, 500);

      // Also track on page hide/unload as a safety net
      const onVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          track();
        }
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }
  }, [articleId]);

  return null;
}
