"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Post } from "@/lib/data";
import { SmartImage } from "@/components/home/SmartImage";

interface BigHeroSliderProps {
  posts: Post[];
}

// Auto-rotating hero — slides the whole card (image + title below) through
// the top featured posts. No arrows, no dots: just a clean continuous slide.
export function BigHeroSlider({ posts }: BigHeroSliderProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: false }),
  ]);

  if (posts.length === 0) return null;

  if (posts.length === 1) {
    const post = posts[0];
    return (
      <Link href={`/article/${post.slug}`} className="group block">
        <SlideImage post={post} />
        <SlideTitle post={post} />
      </Link>
    );
  }

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex">
        {posts.map((post) => (
          <div key={post.id} className="flex-[0_0_100%] min-w-0">
            <Link href={`/article/${post.slug}`} className="group block">
              <SlideImage post={post} />
              <SlideTitle post={post} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideImage({ post }: { post: Post }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
      <SmartImage
        src={post.coverImage}
        alt={post.title}
        fill
        sizes="(max-width: 1024px) 100vw, 66vw"
        priority
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute top-4 left-4">
        <span
          className="px-3 py-1.5 rounded text-xs font-bold text-white uppercase tracking-wider"
          style={{ backgroundColor: post.category.color || "#e5b60d" }}
        >
          {post.category.name}
        </span>
      </div>
    </div>
  );
}

function SlideTitle({ post }: { post: Post }) {
  return (
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display mt-4 min-h-[2.5em] sm:min-h-[2.2em]">
      {post.title}
    </h1>
  );
}
