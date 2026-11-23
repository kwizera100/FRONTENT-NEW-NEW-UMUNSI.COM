import Link from "next/link";
import type { Post } from "@/lib/data";
import { SmartImage } from "@/components/home/SmartImage";
import { SponsoredAdSection } from "@/components/home/SponsoredAdSection";
import { BigHeroSlider } from "@/components/home/BigHeroSlider";
import { AdSenseInline } from "@/components/ads/AdSenseInline";

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

  const leftCards = pick([...featured.slice(4), ...popular], 3);
  const fillCards = pick([...featured.slice(7), ...popular], 3);
  const cards = pick([...featured.slice(10), ...popular], 4);

  const CompactCard = ({ post, titleClass }: { post: Post; titleClass: string }) => (
    <Link
      href={`/article/${post.slug}`}
      className="group block p-2.5 rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg mb-2">
        <SmartImage
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <h4 className={`font-bold text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-2 font-display ${titleClass}`}>
        {post.title}
      </h4>
    </Link>
  );

  return (
    <section className="py-6 lg:py-8 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Cards | BIG slider in the middle | smaller feature + cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BIG auto-slider — center, title below the image */}
          <div className="lg:col-span-6 lg:order-2">
            <BigHeroSlider posts={slides} />
          </div>

          {/* Compact article cards — left of the big image,
              spread to fill the slider's full height (no empty space) */}
          <div className="lg:col-span-3 lg:order-1 flex flex-col gap-4 lg:justify-between">
            {leftCards.map((post) => (
              <CompactCard key={post.id} post={post} titleClass="text-sm" />
            ))}
          </div>

          {/* Smaller feature + fill cards — right, spread to fill height */}
          <div className="lg:col-span-3 lg:order-3 flex flex-col gap-4 lg:justify-between">
            {secondary && (
              <Link href={`/article/${secondary.slug}`} className="group block">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-950">
                  <SmartImage
                    src={secondary.coverImage}
                    alt={secondary.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    priority
                    className="object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h2 className="text-base lg:text-lg font-black text-gray-900 leading-snug group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display mt-2">
                  {secondary.title}
                </h2>
              </Link>
            )}

            {/* Compact fill cards to close the empty space */}
            {fillCards.map((post) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className="group flex gap-3 items-center p-2.5 rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="relative w-16 h-14 shrink-0 overflow-hidden rounded-lg">
                  <SmartImage
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="flex-1 min-w-0 font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-2 font-display">
                  {post.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>

        {/* AdSense unit directly under the hero — the only other homepage
            units sit far down the page, so mobile visitors scrolling
            briefly would never see an ad */}
        <AdSenseInline slot="5694241340" className="w-full min-h-[90px]" />

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
                  <h3 className="font-bold text-sm lg:text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display">
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
