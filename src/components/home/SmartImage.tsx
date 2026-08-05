"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1495020689067-958854a1dd38?w=1600&q=80";

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

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => {
        if (!errored) {
          setErrored(true);
          setImgSrc(FALLBACK_IMAGE);
        }
      }}
    />
  );
}
