"use client";

import { useState } from "react";

// Fallback image — hosted on api.umunsi.com so it's always available
const FALLBACK_IMAGE = "https://api.umunsi.com/uploads/media/umunsi-default-cover.jpg";

interface SmartImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function SmartImage({ src, alt, fill, sizes, priority, className }: SmartImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  // Use plain <img> instead of next/image to bypass Vercel image optimization
  // (which returns 402 Payment Required on the free plan)
  return (
    <img
      src={imgSrc}
      alt={alt}
      sizes={sizes}
      // @ts-expect-error — priority is not a native img attr, but harmless
      priority={priority}
      className={className}
      style={fill ? { width: "100%", height: "100%", objectFit: "cover" } : undefined}
      loading={priority ? "eager" : "lazy"}
      onError={() => {
        if (!errored) {
          setErrored(true);
          setImgSrc(FALLBACK_IMAGE);
        }
      }}
    />
  );
}
