import Link from "next/link";
import type { Post } from "@/lib/data";
import { SmartImage } from "@/components/home/SmartImage";
import { SponsoredAdSection } from "@/components/home/SponsoredAdSection";

interface HeroFeaturedSectionProps {
  featured: Post[];
  popular: Post[];
}

export function HeroFeaturedSection({ featured, popular }: HeroFeaturedSectionProps) {
  if (featured.length === 0) return null;

  const main = featured[0];
  const secondary = featured[1];
  const cards = featured.slice(secondary ? 2 : 1, 6);
  const topStories = popular.slice(0, 6);

  return (
    <section className="py-6 lg:py-8 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Two-image hero — big left, smaller right (magazine style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[480px]">
          {/* BIG feature — left */}
          <Link
            href={`/article/${main.slug}`}
            className="group relative block lg:col-span-8 rounded-2xl overflow-hidden"
          >
            <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full w-full">
              <SmartImage
                src={main.coverImage}
                alt={main.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8">
              <span
                className="inline-block px-3 py-1 rounded text-xs font-bold text-white uppercase tracking-wider mb-3"
                style={{ backgroundColor: main.category.color || "#e5b60d" }}
              >
                {main.category.name}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display">
                {main.title}
              </h1>
              <p className="text-white/80 text-sm lg:text-base mt-2 line-clamp-2 hidden sm:block">
                {main.excerpt}
              </p>
            </div>
          </Link>

          {/* Smaller feature — right */}
          {secondary ? (
            <Link
              href={`/article/${secondary.slug}`}
              className="group relative block lg:col-span-4 rounded-2xl overflow-hidden"
            >
              <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full w-full">
                <SmartImage
                  src={secondary.coverImage}
                  alt={secondary.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                <span
                  className="inline-block px-2.5 py-1 rounded text-[11px] font-bold text-white uppercase tracking-wider mb-2"
                  style={{ backgroundColor: secondary.category.color || "#e5b60d" }}
                >
                  {secondary.category.name}
                </span>
                <h2 className="text-lg lg:text-xl font-black text-white leading-snug group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display">
                  {secondary.title}
                </h2>
              </div>
            </Link>
          ) : (
            <div className="lg:col-span-4 h-full min-h-[180px]">
              <SponsoredAdSection variant="vertical" />
            </div>
          )}
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
