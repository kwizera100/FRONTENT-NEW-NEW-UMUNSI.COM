"use client";

import { useEffect } from "react";

// Syncs premium status from the reader's account on every page load.
// If a logged-in reader (umunsi_reader_token) has an active premium subscription
// on the backend, this device gets the ad-free flag — that is what makes the
// subscription work across devices after logging in.
export function PremiumSync() {
  useEffect(() => {
    let token: string | null = null;
    try { token = localStorage.getItem("umunsi_reader_token"); } catch {}
    if (!token) return;

    fetch("/api/payment/subscription/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json().catch(() => ({})))
      .then((d) => {
        try {
          if (d?.active) {
            localStorage.setItem("umunsi_subscribed", "active");
            localStorage.setItem("umunsi_subscription_plan", "account");
            if (d.premiumUntil) localStorage.setItem("umunsi_subscribed_until", d.premiumUntil);
            else localStorage.removeItem("umunsi_subscribed_until");
          } else if (d?.success === true && d?.active === false) {
            // Logged in but premium expired — remove account-granted flag only
            if (localStorage.getItem("umunsi_subscription_plan") === "account") {
              localStorage.removeItem("umunsi_subscribed");
              localStorage.removeItem("umunsi_subscribed_until");
            }
          } else if (d?.error === "Access denied" || d?.error === "Invalid token") {
            localStorage.removeItem("umunsi_reader_token");
          }
        } catch {}
      })
      .catch(() => {});
  }, []);

  return null;
}
