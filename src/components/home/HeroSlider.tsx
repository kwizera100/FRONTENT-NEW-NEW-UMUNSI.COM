"use client";

import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Eye } from "lucide-react";
import type { Post } from "@/lib/data";
import { formatTimeAgo, cn } from "@/lib/utils";

export function HeroSlider({ posts }: { posts: Post[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setSlideCount(emblaApi.scrollSnapList().length);
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (!posts.length) return null;

  return (
    <div className="relative w-full overflow-hidden bg-ink-900">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex-[0_0_100%] min-w-0 relative"
            >
              <Link href={`/article/${post.slug}`} className="block">
                <div className="relative aspect-hero w-full">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    priority={posts.indexOf(post) === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="container mx-auto px-4 pb-10 lg:pb-16">
                      <div className="max-w-3xl">
                        {/* Category badge */}
                        <Link
                          href={`/category/${post.category.slug}`}
                          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 text-white"
                          style={{ backgroundColor: post.category.color }}
                        >
                          {post.category.name}
                        </Link>

                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-3 lg:mb-4 text-balance leading-tight">
                          {post.title}
                        </h2>

                        <p className="text-white/80 text-sm lg:text-lg mb-4 line-clamp-2 max-w-2xl">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-white/60 text-sm">
                          <span className="font-semibold text-white/90">
                            {post.author.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTimeAgo(post.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10"
        aria-label="Ibanzeho"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10"
        aria-label="Imbere"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        {Array.from({ length: slideCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === selectedIndex ? "w-8 bg-brand-500" : "w-2 bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
