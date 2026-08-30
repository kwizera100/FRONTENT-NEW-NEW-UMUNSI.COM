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
  const cards = featured.slice(1, 5);
  const topStories = popular.slice(0, 6);

  return (
    <section className="py-6 lg:py-8 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main top story - ABC News style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-6">
          <div className="order-1 lg:order-1 lg:col-span-4 lg:row-start-1">
            <Link href={`/article/${main.slug}`} className="group block">
              <span
                className="inline-block px-3 py-1 rounded text-xs font-bold text-white uppercase tracking-wider mb-3"
                style={{ backgroundColor: main.category.color || "#e5b60d" }}
              >
                {main.category.name}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display mb-3">
                {main.title}
              </h1>
              <p className="text-gray-600 text-base lg:text-lg line-clamp-3">{main.excerpt}</p>
            </Link>
          </div>

          <div className="order-3 lg:order-3 lg:col-span-4 lg:row-start-2 h-48 lg:h-full min-h-[180px]">
            <SponsoredAdSection variant="vertical" />
          </div>

          <div className="order-2 lg:order-2 lg:col-span-8 lg:row-span-2">
            <Link href={`/article/${main.slug}`} className="group block">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                <SmartImage
                  src={main.coverImage}
                    alt={main.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </Link>
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
