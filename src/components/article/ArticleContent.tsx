"use client";

import { useEffect, useRef } from "react";
import { formatArticleHtml, normalizeArticleMediaUrls } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface ArticleContentProps {
  html: string;
}

const AD_CLIENT = "ca-pub-3584259871242471";

// Ad slots: inserted after specific paragraph indices (0-based)
// After 3rd paragraph (index 2), 5th (index 4), 7th (index 6), 9th (index 8)
const IN_CONTENT_ADS: Array<{ afterParagraph: number; slot: string; format: string }> = [
  { afterParagraph: 2, slot: "6173432779", format: "auto" },   // after 3rd paragraph (existing)
  { afterParagraph: 4, slot: "8544566354", format: "auto" },   // after 5th paragraph
  { afterParagraph: 6, slot: "7231484683", format: "auto" },   // after 7th paragraph
  { afterParagraph: 8, slot: "5119226585", format: "auto" },   // after 9th paragraph
];

// Ad shown at the end of the article content (autorelaxed format)
const END_AD_SLOT = "1008591184";

function createAdElement(slot: string, format: string): HTMLElement {
  const adWrapper = document.createElement("div");
  adWrapper.className = "my-6 sm:my-8";
  adWrapper.style.cssText = "text-align: center;";

  const adIns = document.createElement("ins");
  adIns.className = "adsbygoogle";
  adIns.style.cssText = "display:block";
  adIns.setAttribute("data-ad-client", AD_CLIENT);
  adIns.setAttribute("data-ad-slot", slot);
  adIns.setAttribute("data-ad-format", format);
  if (format === "auto") {
    adIns.setAttribute("data-full-width-responsive", "true");
  }

  adWrapper.appendChild(adIns);
  return adWrapper;
}

function pushAd() {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    // AdSense not loaded yet
  }
}

export function ArticleContent({ html }: ArticleContentProps) {
  const normalizedHtml = formatArticleHtml(normalizeArticleMediaUrls(html));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const paragraphs = container.querySelectorAll("p");
    let adsPushed = 0;

    // Insert in-content ads after specified paragraphs
    IN_CONTENT_ADS.forEach(({ afterParagraph, slot, format }) => {
      if (paragraphs.length > afterParagraph) {
        const target = paragraphs[afterParagraph];
        const adEl = createAdElement(slot, format);
        target.insertAdjacentElement("afterend", adEl);
        pushAd();
        adsPushed++;
      }
    });

    // Insert end-of-content ad (autorelaxed) at the end of the container
    const endAd = createAdElement(END_AD_SLOT, "autorelaxed");
    container.appendChild(endAd);
    pushAd();
    adsPushed++;
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose prose-base sm:prose-lg max-w-none text-gray-800 leading-8 space-y-6
        [&_p]:text-[15px] sm:[&_p]:text-[17px] [&_p]:leading-8 [&_p]:mb-6 [&_p]:mt-0 [&_p]:text-gray-800 [&_p]:text-justify
        [&_img]:rounded-xl [&_img]:max-w-full [&_img]:h-auto
        [&_figure]:my-8 [&_figure]:mx-auto
        [&_figcaption]:text-sm [&_figcaption]:text-gray-500 [&_figcaption]:italic [&_figcaption]:text-center [&_figcaption]:mt-3 [&_figcaption]:px-4 [&_figcaption]:py-2 [&_figcaption]:bg-gray-50 [&_figcaption]:rounded-lg [&_figcaption]:border-l-4 [&_figcaption]:border-[#e5b60d]/40
        [&_blockquote]:border-l-4 [&_blockquote]:border-[#e5b60d] [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:text-gray-700 [&_blockquote]:italic [&_blockquote]:bg-gray-50/50 [&_blockquote]:rounded-r-lg
        [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4
        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-gray-800
        [&_a]:text-[#e5b60d] [&_a]:font-semibold [&_a]:underline [&_a]:hover:text-[#c9a00c]
        [&_.video-wrapper]:my-8 [&_.video-wrapper]:rounded-xl [&_.video-wrapper]:overflow-hidden
        [&_iframe]:border-0 [&_iframe]:w-full [&_iframe]:h-full"
      dangerouslySetInnerHTML={{ __html: normalizedHtml }}
    />
  );
}
