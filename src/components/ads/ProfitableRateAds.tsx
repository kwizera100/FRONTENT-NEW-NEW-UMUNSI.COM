"use client";

import { useEffect } from "react";

export function ProfitableRateAds() {
  useEffect(() => {
    // Body-level ad script
    const bodyScript = document.createElement("script");
    bodyScript.async = true;
    bodyScript.src = "https://pl18337357.profitableratecpmnetwork.com/8b/bd/af/8bbdaf0eb5f4fa429c2183dbad47a65a.js";
    document.body.appendChild(bodyScript);

    return () => {
      bodyScript.remove();
    };
  }, []);

  return null;
}
