import Link from "next/link";
import type { Post } from "@/lib/data";
import { SmartImage } from "@/components/home/SmartImage";
import { SponsoredAdSection } from "@/components/home/SponsoredAdSection";
import { BigHeroSlider } from "@/components/home/BigHeroSlider";

interface HeroFeaturedSectionProps {
  featured: Post[];
  popular: Post[];
}

export function HeroFeaturedSection({ featured, popular }: HeroFeaturedSectionProps) {
  if (featured.length === 0) return null;

  const slides = featured.slice(0, 3);
  const secondary = featured[3];
  const topStories = popular.slice(0, 6);

  // Fill pools pull from featured first, then popular — guarantees the
  // right column and card row never sit empty when featured runs short.
  const usedIds = new Set(slides.map((p) => p.id));
  if (secondary) usedIds.add(secondary.id);

  const pick = (pool: Post[], count: number) => {
    const out: Post[] = [];
    for (const p of pool) {
      if (out.length >= count) break;
      if (!usedIds.has(p.id)) {
        usedIds.add(p.id);
        out.push(p);
      }
    }
    return out;
  };

  const fillCards = pick([...featured.slice(4), ...popular], 3);
  const cards = pick([...featured.slice(7), ...popular], 4);

  return (
    <section className="py-6 lg:py-8 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Auto-sliding big image left, smaller feature + cards right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BIG auto-slider — left, title below the image */}
          <div className="lg:col-span-8">
            <BigHeroSlider posts={slides} />
          </div>

          {/* Smaller feature + fill cards — right */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {secondary && (
              <Link href={`/article/${secondary.slug}`} className="group block">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                  <SmartImage
                    src={secondary.coverImage}
                    alt={secondary.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2.5 py-1 rounded text-[11px] font-bold text-white uppercase tracking-wider"
                      style={{ backgroundColor: secondary.category.color || "#e5b60d" }}
                    >
                      {secondary.category.name}
                    </span>
                  </div>
                </div>
                <h2 className="text-lg lg:text-xl font-black text-gray-900 leading-snug group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display mt-3">
                  {secondary.title}
                </h2>
              </Link>
            )}

            {/* Compact fill cards to close the empty space */}
            {fillCards.map((post) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className="group flex gap-3 items-center p-3 rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded-lg">
                  <SmartImage
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="flex-1 min-w-0 font-bold text-sm text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-2 font-display">
                  {post.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>

        {/* 4 cards + Top Stories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6 h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cards.map((post) => (
                <Link key={post.id} href={`/article/${post.slug}`} className="group block">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg mb-3">
                    <SmartImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: post.category.color || "#e5b60d" }}
                  >
                    {post.category.name}
                  </span>
                  <h3 className="font-bold text-sm lg:text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 mt-1 font-display">
                    {post.title}
                  </h3>
                </Link>
              ))}
            </div>
            <SponsoredAdSection variant="sidebar" />
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#0f172a] text-white p-4 lg:p-5 rounded-xl">
              <h3 className="font-black text-lg mb-4 font-display border-b border-white/20 pb-2">Top Stories</h3>
              <div className="flex flex-col gap-3">
                {topStories.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/article/${post.slug}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#e5b60d] mt-2 shrink-0" />
                    <h4 className="text-sm font-semibold text-white/90 group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display">
                      {post.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
