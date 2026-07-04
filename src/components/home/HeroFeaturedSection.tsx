import Link from "next/link";
import Image from "next/image";
import { TrendingUp } from "lucide-react";
import type { Post } from "@/lib/data";

interface HeroFeaturedSectionProps {
  featured: Post[];
  popular: Post[];
}

export function HeroFeaturedSection({ featured, popular }: HeroFeaturedSectionProps) {
  if (featured.length === 0) return null;

  const main = featured[0];
  const side = featured.slice(1, 4);

  return (
    <section className="py-6 lg:py-8 bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main featured */}
          <div className="lg:col-span-7">
            <Link href={`/article/${main.slug}`} className="group block relative">
              <div className="relative aspect-[16/10] lg:aspect-[16/9] overflow-hidden rounded-xl">
                <Image
                  src={main.coverImage}
                  alt={main.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1.5 rounded-md text-xs font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: main.category.color || "#e5b60d" }}
                  >
                    {main.category.name}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-7">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-white leading-tight font-display group-hover:text-[#e5b60d] transition-colors line-clamp-3">
                    {main.title}
                  </h1>
                </div>
              </div>
            </Link>
          </div>

          {/* Side featured list */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {side.map((post) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className="group flex gap-4 items-start"
              >
                <div className="relative w-24 h-20 lg:w-28 lg:h-22 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="120px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: post.category.color || "#e5b60d" }}
                  >
                    {post.category.name}
                  </span>
                  <h3 className="font-bold text-sm lg:text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-3 mt-1 font-display">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Izikunzwe sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-[#f8f8f8] border-l-4 border-[#e5b60d] p-4 lg:p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#e5b60d]" />
                <h3 className="font-black text-lg text-gray-900 font-display">Izikunzwe</h3>
              </div>
              <div className="space-y-1">
                {popular.slice(0, 5).map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/article/${post.slug}`}
                    className="group flex gap-3 items-start py-2.5 border-b border-gray-200 last:border-0"
                  >
                    <span className="text-2xl font-black text-[#e5b60d]/40 group-hover:text-[#e5b60d] leading-none w-6 shrink-0 transition-colors">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display">
                        {post.title}
                      </h4>
                    </div>
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
