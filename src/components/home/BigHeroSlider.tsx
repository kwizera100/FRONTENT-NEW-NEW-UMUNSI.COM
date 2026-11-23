"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "@/lib/data";
import { SmartImage } from "@/components/home/SmartImage";

interface BigHeroSliderProps {
  posts: Post[];
}

// Auto-rotating hero — crossfades the big image through the top featured
// posts every 5s. No arrows, no dots: just a clean continuous slide.
export function BigHeroSlider({ posts }: BigHeroSliderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (posts.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % posts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (posts.length === 0) return null;

  const current = posts[index] ?? posts[0];

  return (
    <Link href={`/article/${current.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-950">
        {posts.map((post, i) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <SmartImage
              src={post.coverImage}
              alt=""
              fill
              sizes="50vw"
              className="absolute inset-0 object-cover scale-125 blur-2xl opacity-60"
              aria-hidden
            />
            <SmartImage
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={i === 0}
              className="absolute inset-0 object-cover object-[50%_30%] group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        ))}
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display mt-4 min-h-[2.4em]">
        {current.title}
      </h1>
    </Link>
  );
}
