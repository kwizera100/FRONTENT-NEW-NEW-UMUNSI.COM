"use client";

import { useEffect, useRef } from "react";
import { formatArticleHtml, normalizeMediaUrl } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface ArticleContentProps {
  html: string;
}

const AD_CLIENT = "ca-pub-3584259871242471";

const IN_CONTENT_ADS: Array<{ afterParagraph: number; slot: string }> = [
  { afterParagraph: 2, slot: "6173432779" },
  { afterParagraph: 4, slot: "8544566354" },
  { afterParagraph: 6, slot: "7231484683" },
  { afterParagraph: 8, slot: "5119226585" },
];

const END_AD_SLOT = "1008591184";

const PROFITABLE_RATE_AD_AFTER_PARAGRAPH = 4;
const PROFITABLE_RATE_SCRIPT_SRC = "https://pl18296255.profitableratecpmnetwork.com/533b579a4ffcc3c134a9961c1a434570/invoke.js";
const PROFITABLE_RATE_CONTAINER_ID = "container-533b579a4ffcc3c134a9961c1a434570";

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s<>]*)?$/i;

function decodeHtmlEntities(raw: string): string {
  return raw
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function convertImageUrlsToHtml(raw: string): string {
  return raw.replace(
    /(^|\s|>)(https?:\/\/[^\s<>"']+)(?=\s|$|<)/gi,
    (match, before, url) => {
      if (!IMAGE_EXTENSIONS.test(url)) return match;
      if (/<img[^>]*src=["'][^"']*$/i.test(match) || /\bdata:image\/\b/.test(url)) return match;
      return `${before}<img src="${normalizeMediaUrl(url)}" alt="" loading="lazy" class="rounded-xl max-w-full h-auto my-6 block" />`;
    }
  );
}

function cleanResizableImages(html: string): string {
  return html.replace(
    /<div class="umunsi-resizable-img"[^>]*style="([^"]*)"[^>]*>/gi,
    (match, style) => {
      const widthMatch = style.match(/width\s*:\s*([^;]+)/i);
      const width = widthMatch?.[1]?.trim() || "100%";
      return `<div class="umunsi-resizable-img" style="width: ${width}; max-width: 100%; margin: 1.5rem auto; display: block;">`;
    }
  );
}

function preprocessArticleHtml(html: string): string {
  const decoded = decodeHtmlEntities(html);
  return cleanResizableImages(convertImageUrlsToHtml(decoded));
}

function createFallbackAd(slot: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "my-6 sm:my-8";
  wrapper.style.cssText = "text-align: center; min-height: 250px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem;";

  const label = document.createElement("span");
  label.className = "text-xs font-bold text-gray-400 uppercase mb-3";
  label.textContent = "Advertisement";
  wrapper.appendChild(label);

  const adIns = document.createElement("ins");
  adIns.className = "adsbygoogle";
  adIns.style.cssText = "display:block; width:100%; min-height:250px;";
  adIns.setAttribute("data-ad-client", AD_CLIENT);
  adIns.setAttribute("data-ad-slot", slot);
  adIns.setAttribute("data-ad-format", "auto");
  adIns.setAttribute("data-full-width-responsive", "true");

  wrapper.appendChild(adIns);
  return wrapper;
}

function pushAd() {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    // AdSense not loaded yet
  }
}

function createProfitableRateAd(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "my-6 sm:my-8";
  wrapper.style.cssText = "text-align: center; min-height: 250px;";

  const container = document.createElement("div");
  container.id = PROFITABLE_RATE_CONTAINER_ID;
  wrapper.appendChild(container);

  const script = document.createElement("script");
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.src = PROFITABLE_RATE_SCRIPT_SRC;
  wrapper.appendChild(script);

  return wrapper;
}

export function ArticleContent({ html }: ArticleContentProps) {
  const normalizedHtml = formatArticleHtml(preprocessArticleHtml(html));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const paragraphs = container.querySelectorAll("p");

    IN_CONTENT_ADS.forEach(({ afterParagraph, slot }) => {
      if (paragraphs.length > afterParagraph) {
        const target = paragraphs[afterParagraph];
        const adEl = createFallbackAd(slot);
        target.insertAdjacentElement("afterend", adEl);
        pushAd();
      }
    });

    // Insert ProfitableRateCPM ad after 4th paragraph
    if (paragraphs.length > PROFITABLE_RATE_AD_AFTER_PARAGRAPH) {
      const target = paragraphs[PROFITABLE_RATE_AD_AFTER_PARAGRAPH];
      const adEl = createProfitableRateAd();
      target.insertAdjacentElement("afterend", adEl);
    }

    const endAd = createFallbackAd(END_AD_SLOT);
    container.appendChild(endAd);
    pushAd();
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose prose-base sm:prose-lg max-w-none text-gray-800 leading-8 space-y-6
        [&_p]:text-[15px] sm:[&_p]:text-[17px] [&_p]:leading-8 [&_p]:mb-6 [&_p]:mt-0 [&_p]:text-gray-800 [&_p]:text-justify
        [&_img]:rounded-xl [&_img]:max-w-full [&_img]:w-full [&_img]:h-auto [&_img]:my-6 [&_img]:block
        [&_figure]:my-8 [&_figure]:mx-auto
        [&_figcaption]:text-sm [&_figcaption]:text-gray-500 [&_figcaption]:italic [&_figcaption]:text-center [&_figcaption]:mt-3 [&_figcaption]:px-4 [&_figcaption]:py-2 [&_figcaption]:bg-gray-50 [&_figcaption]:rounded-lg [&_figcaption]:border-l-4 [&_figcaption]:border-[#e5b60d]/40
        [&_blockquote]:border-l-4 [&_blockquote]:border-[#e5b60d] [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:text-gray-700 [&_blockquote]:italic [&_blockquote]:bg-gray-50/50 [&_blockquote]:rounded-r-lg
        [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4
        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-gray-800
        [&_a]:text-[#e5b60d] [&_a]:font-semibold [&_a]:underline [&_a]:hover:text-[#c9a00c]
        [&_.video-wrapper]:my-8 [&_.video-wrapper]:rounded-xl [&_.video-wrapper]:overflow-hidden
        [&_iframe]:border-0 [&_iframe]:w-full [&_iframe]:h-full
        [&_.umunsi-resizable-img]:!resize-none [&_.umunsi-resizable-img]:!border-0 [&_.umunsi-resizable-img]:!overflow-visible [&_.umunsi-resizable-img]:!block [&_.umunsi-resizable-img]:my-6"
      dangerouslySetInnerHTML={{ __html: normalizedHtml }}
    />
  );
}
