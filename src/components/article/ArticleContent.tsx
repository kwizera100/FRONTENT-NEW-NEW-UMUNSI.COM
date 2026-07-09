"use client";

import { useEffect, useRef } from "react";
import { formatArticleHtml } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface ArticleContentProps {
  html: string;
}

export function ArticleContent({ html }: ArticleContentProps) {
  const normalizedHtml = formatArticleHtml(html);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Find all paragraph elements
    const paragraphs = container.querySelectorAll("p");

    if (paragraphs.length >= 3) {
      const thirdParagraph = paragraphs[2];

      // Create ad container
      const adWrapper = document.createElement("div");
      adWrapper.className = "my-6 sm:my-8";
      adWrapper.style.cssText = "text-align: center;";

      const adIns = document.createElement("ins");
      adIns.className = "adsbygoogle";
      adIns.style.cssText = "display:block";
      adIns.setAttribute("data-ad-client", "ca-pub-3584259871242471");
      adIns.setAttribute("data-ad-slot", "6173432779");
      adIns.setAttribute("data-ad-format", "auto");
      adIns.setAttribute("data-full-width-responsive", "true");

      adWrapper.appendChild(adIns);

      // Insert after the 3rd paragraph
      thirdParagraph.insertAdjacentElement("afterend", adWrapper);

      // Push to adsbygoogle
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded yet
      }
    }
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose prose-base sm:prose-lg max-w-none text-gray-800 leading-relaxed space-y-4
        [&_p]:text-base sm:[&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-4
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
