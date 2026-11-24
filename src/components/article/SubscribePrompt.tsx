"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Sparkles, ArrowRight } from "lucide-react";

// Small gold rectangle shown before the first paragraph of every article.
// Hidden for subscribers — localStorage "umunsi_subscribed" === "active".
export function SubscribePrompt() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    try {
      setHidden(localStorage.getItem("umunsi_subscribed") === "active");
    } catch {
      setHidden(false);
    }
  }, []);

  if (hidden) return null;

  return (
    <Link
      href="/subscribe"
      className="group block not-prose my-4 rounded-2xl overflow-hidden border-2 border-[#e5b60d]/60 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] hover:border-[#e5b60d] hover:shadow-lg hover:shadow-[#e5b60d]/20 transition-all"
    >
      <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] flex items-center justify-center shadow-md">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-white text-sm sm:text-base leading-tight font-display flex items-center gap-1.5">
            Soma nta ads zirimo
            <Sparkles className="w-3.5 h-3.5 text-[#e5b60d] shrink-0" />
          </p>
          <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">
            Kanda hano wishyure <span className="text-[#e5b60d] font-black">500 RWF/ukwezi</span> usome inkuru zose zisukuye.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 bg-[#e5b60d] group-hover:bg-[#f5c81d] text-[#0f172a] font-black text-xs sm:text-sm px-3.5 sm:px-5 py-2 rounded-xl transition-colors">
          Subscribe
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
