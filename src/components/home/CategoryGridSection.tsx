import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Post } from "@/lib/data";
import { formatTimeAgo } from "@/lib/utils";
import { SmartImage } from "@/components/home/SmartImage";
import { AdSenseInline } from "@/components/ads/AdSenseInline";

interface CategoryGridSectionProps {
  title: string;
  slug: string;
  color?: string | null;
  posts: Post[];
}

const worldSlugs = ["imyidagaduro", "ikoranabuhanga", "cinema", "hanze", "imikino"];

export function CategoryGridSection({ title, slug, color, posts }: CategoryGridSectionProps) {
  if (posts.length === 0) return null;

  const accent = color || "#e5b60d";

  if (slug === "inkuru-nyamukuru") {
    return <InkuruNBCNewsHome title={title} slug={slug} color={accent} posts={posts} />;
  }

  if (worldSlugs.includes(slug.toLowerCase())) {
    return <NBCWorldSection title={title} slug={slug} color={accent} posts={posts} />;
  }

  const main = posts[0];
  const grid = posts.slice(1, 7);

  return (
    <section className="py-8 lg:py-10 bg-white border-t border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: accent }} />
            <h2 className="text-xl lg:text-2xl font-black text-gray-900 font-display">{title}</h2>
          </div>
          <Link
            href={`/category/${slug}`}
            className="text-sm font-bold flex items-center gap-1 hover:text-[#e5b60d] transition-colors"
            style={{ color: accent }}
          >
            Reba byose <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main */}
          <div className="lg:col-span-5">
            <Link href={`/article/${main.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4">
                <SmartImage
                  src={main.coverImage}
                  alt={main.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1.5 rounded-md text-xs font-bold text-white uppercase"
                    style={{ backgroundColor: accent }}
                  >
                    {title}
                  </span>
                </div>
              </div>
              <h3 className="text-lg lg:text-xl font-black text-gray-900 group-hover:text-[#e5b60d] transition-colors mb-2 font-display line-clamp-2">
                {main.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">{main.excerpt}</p>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(main.publishedAt)}
              </span>
            </Link>
          </div>

          {/* Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {grid.map((post) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl mb-3">
                  <SmartImage
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-bold text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {title}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-sm lg:text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display">
                  {post.title}
                </h4>
                <span className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(post.publishedAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NBCWorldSection({ title, slug, color, posts }: { title: string; slug: string; color: string; posts: Post[] }) {
  const main = posts[0];
  const secondary = posts[1];
  const fillCards = posts.slice(2, 5);
  const rowCards = posts.slice(5, 9);

  return (
    <section className="py-8 lg:py-10 bg-white border-t border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2" style={{ borderColor: color }}>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight font-display" style={{ color }}>
            {title}
          </h2>
          <Link
            href={`/category/${slug}`}
            className="text-sm font-bold flex items-center gap-1 hover:text-[#e5b60d] transition-colors"
            style={{ color }}
          >
            Reba byose <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Two image features: big left, smaller right + fill cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BIG feature — left, title below the image */}
          <div className="lg:col-span-8">
            <Link href={`/article/${main.slug}`} className="group block">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <SmartImage
                  src={main.coverImage}
                  alt={main.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display mt-4">
                {main.title}
              </h3>
            </Link>
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
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h4 className="text-base lg:text-lg font-black text-gray-900 leading-snug group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display mt-3">
                  {secondary.title}
                </h4>
              </Link>
            )}

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

        {/* Bottom row — remaining posts as compact cards */}
        {rowCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {rowCards.map((post) => (
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
                <h4 className="font-bold text-sm lg:text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display">
                  {post.title}
                </h4>
                <span className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(post.publishedAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function InkuruNBCNewsHome({ title, slug, color, posts }: { title: string; slug: string; color: string; posts: Post[] }) {
  const main = posts[0];
  const cards = posts.slice(1, 9);

  return (
    <section className="py-8 lg:py-10 bg-white border-t border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2" style={{ borderColor: color }}>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight font-display" style={{ color }}>
            {title}
          </h2>
          <Link
            href={`/category/${slug}`}
            className="text-sm font-bold flex items-center gap-1 hover:text-[#e5b60d] transition-colors"
            style={{ color }}
          >
            Reba byose <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT HALF — single large featured story */}
          <Link href={`/article/${main.slug}`} className="group block">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl mb-4">
              <SmartImage
                src={main.coverImage}
                alt={main.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase"
                  style={{ backgroundColor: color }}
                >
                  {title}
                </span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display">
              {main.title}
            </h3>
            <p className="text-gray-700 text-base mt-3 line-clamp-3">{main.excerpt}</p>
            <span className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(main.publishedAt)}
            </span>
          </Link>

          {/* RIGHT HALF — compact newspaper-style cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            {cards.map((post) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className="group flex gap-3 items-start p-3 rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-md transition-all"
              >
                <div className="relative w-24 h-20 shrink-0 overflow-hidden rounded-lg">
                  <SmartImage
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="96px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-3 font-display">
                    {post.title}
                  </h4>
                  <span className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(post.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <AdSenseInline slot="5694241340" />
        </div>
      </div>
    </section>
  );
}
