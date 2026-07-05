"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface ArticleContentProps {
  html: string;
}

export function ArticleContent({ html }: ArticleContentProps) {
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
      className="prose prose-base sm:prose-lg max-w-none text-gray-800 leading-relaxed space-y-4 [&_p]:text-base sm:[&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-4 [&_img]:rounded-xl [&_img]:max-w-full [&_img]:h-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
