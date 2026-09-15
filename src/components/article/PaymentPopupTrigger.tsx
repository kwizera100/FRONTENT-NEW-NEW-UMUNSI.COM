"use client";

import { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import { PaymentPopup } from "./PaymentPopup";

interface PaymentPopupTriggerProps {
  adConfig?: string | null;
  isPremium?: boolean;
}

export function PaymentPopupTrigger({ adConfig, isPremium }: PaymentPopupTriggerProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Check if user is already subscribed (paid users don't see the button)
    try {
      const globalAccess = localStorage.getItem("umunsi_subscribed");
      if (globalAccess === "active") {
        setSubscribed(true);
        return;
      }
    } catch {}

    // If this article is premium (no ads), don't show the payment trigger
    if (isPremium) return;

    // Check if ads are turned off for this article
    let adsOff = false;
    if (adConfig) {
      try {
        const parsed = typeof adConfig === "string" ? JSON.parse(adConfig) : adConfig;
        if (parsed?.showAdsense === false && parsed?.showAdsterra === false) {
          adsOff = true;
        }
      } catch {
        // ignore
      }
    }
    // If all ads are off for this article, don't show the payment trigger
    if (adsOff) return;

    // Show the button after 30 seconds of reading
    const timer = setTimeout(() => setShowButton(true), 30000);
    // Also show on scroll near bottom
    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollPercent > 0.7) setShowButton(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [adConfig, isPremium]);

  if (subscribed || !showButton) return null;

  return (
    <>
      <div className="mt-8">
        <button
          onClick={() => setShowPopup(true)}
          className="w-full bg-gradient-to-r from-[#e5b60d] to-[#c9a00c] text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-base sm:text-lg group"
        >
          <Crown className="w-6 h-6 group-hover:scale-110 transition-transform" />
          SOMA INKURU NTA ADS ZIRIMO
          <span className="text-xs font-normal opacity-90 hidden sm:block">— Wishyure usome inkuru zose nta ads!</span>
        </button>
      </div>
      <PaymentPopup open={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}
