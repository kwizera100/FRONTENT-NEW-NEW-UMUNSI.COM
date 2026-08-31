"use client";

import { useEffect } from "react";

interface HomepageViewTrackerProps {
  articleId: string;
}

// Bot signatures — don't count bot visits
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

/**
 * Tracks homepage views using the SAME article analytics endpoint
 * so all views (homepage + articles) appear in one place in the admin dashboard.
 * Uses the first featured article's ID to record the view.
 */
export function HomepageViewTracker({ articleId }: HomepageViewTrackerProps) {
  useEffect(() => {
    if (!articleId) return;
    if (isBotUserAgent(navigator.userAgent)) return;

    const key = `homepage-view-tracked`;

    const track = async () => {
      const body = JSON.stringify({ timeOnPage: Math.floor(performance.now() / 1000) });
      try {
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
        await fetch(`/api/analytics/article/${encodeURIComponent(articleId)}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        });
        sessionStorage.setItem(key, String(Date.now()));
      } catch (error) {
        console.error("Failed to track homepage view:", error);
      }
    };

    const tracked = sessionStorage.getItem(key);
    const lastTrack = tracked ? parseInt(tracked, 10) : 0;
    const reTrackAfterMs = 2 * 60 * 1000;
    const shouldTrack = !tracked || Date.now() - lastTrack > reTrackAfterMs;

    if (shouldTrack) {
      const timer = setTimeout(track, 500);
      const onVisibilityChange = () => {
        if (document.visibilityState === "hidden") track();
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
