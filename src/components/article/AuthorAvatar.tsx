"use client";

import { useState } from "react";

interface AuthorAvatarProps {
  src?: string | null;
  name: string;
  color?: string;
  className?: string;
  textClassName?: string;
}

export function AuthorAvatar({ src, name, color = "#e5b60d", className = "", textClassName = "" }: AuthorAvatarProps) {
  const [errored, setErrored] = useState(false);
  const showFallback = !src || errored;

  return (
    <div className={`relative overflow-hidden shrink-0 ${className}`}>
      {showFallback ? (
        <div
          className={`w-full h-full flex items-center justify-center text-white font-black uppercase ${textClassName}`}
          style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
        >
          {name.charAt(0)}
        </div>
      ) : (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
