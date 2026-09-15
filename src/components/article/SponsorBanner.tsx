"use client";

import { Crown, ExternalLink } from "lucide-react";

interface SponsorBannerProps {
  adConfig?: string | null;
  isPremium?: boolean;
}

export function SponsorBanner({ adConfig, isPremium }: SponsorBannerProps) {
  let sponsor: { name: string; url: string } | null = null;

  if (adConfig) {
    try {
      const parsed = typeof adConfig === "string" ? JSON.parse(adConfig) : adConfig;
      if (parsed?.sponsorName) {
        sponsor = { name: parsed.sponsorName, url: parsed.sponsorUrl || "" };
      }
    } catch {
      // not JSON
    }
  }

  if (isPremium) {
    return (
      <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-[#e5b60d]/10 to-[#c9a00c]/10 border border-[#e5b60d]/30 flex items-center gap-2">
        <Crown className="w-4 h-4 text-[#e5b60d] shrink-0" />
        <p className="text-xs font-bold text-[#c9a00c]">PREMIUM ARTICLE — Nta Ads ziri muri iyi nkuru</p>
      </div>
    );
  }

  if (!sponsor?.name) return null;

  return (
    <div className="mb-6">
      <a
        href={sponsor.url || "#"}
        target={sponsor.url ? "_blank" : undefined}
        rel={sponsor.url ? "noopener noreferrer" : undefined}
        className="block p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:border-[#e5b60d]/50 transition-colors group"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500 font-semibold">
            Article Sponsored by <span className="text-[#e5b60d] font-black">{sponsor.name}</span>
          </p>
          {sponsor.url && <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#e5b60d] transition-colors" />}
        </div>
      </a>
    </div>
  );
}
