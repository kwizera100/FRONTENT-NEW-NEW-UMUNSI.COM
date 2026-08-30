import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Post } from "@/lib/data";
import { formatTimeAgo } from "@/lib/utils";
import { SmartImage } from "@/components/home/SmartImage";

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
  const left = posts.slice(1, 5);
  const center = posts[0];
  const right = posts.slice(5, 8);

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT - list with small images */}
          <div className="lg:col-span-3 flex flex-col divide-y divide-gray-200">
            {left.map((post, i) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className={`group flex gap-4 items-start py-4 first:pt-0`}
              >
                <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-lg">
                  <SmartImage
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm lg:text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-3 font-display">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* CENTER - large article */}
          <div className="lg:col-span-6">
            <Link href={`/article/${center.slug}`} className="group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl mb-4">
                <SmartImage
                  src={center.coverImage}
                  alt={center.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display">
                {center.title}
              </h1>
              <p className="text-gray-700 text-base lg:text-lg mt-3 line-clamp-3">{center.excerpt}</p>
            </Link>
          </div>

          {/* RIGHT - 3 stacked image+title */}
          <div className="lg:col-span-3 flex flex-col divide-y divide-gray-200">
            {right.map((post, i) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className="group flex gap-4 items-start py-4 first:pt-0"
              >
                <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-lg">
                  <SmartImage
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm lg:text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-3 font-display">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InkuruNBCNewsHome({ title, slug, color, posts }: { title: string; slug: string; color: string; posts: Post[] }) {
  const leftTop = posts[1];
  const leftBottom = posts[4];
  const center = posts[0];
  const rightTop = posts[2];
  const rightBottom = posts[3];

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {leftTop && (
              <Link href={`/article/${leftTop.slug}`} className="group block">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg mb-3">
                  <SmartImage
                    src={leftTop.coverImage}
                    alt={leftTop.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg lg:text-xl font-black text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-tight line-clamp-3 font-display">
                  {leftTop.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{leftTop.excerpt}</p>
              </Link>
            )}

            {leftBottom && (
              <div className="pt-5 border-t border-gray-200">
                <Link href={`/article/${leftBottom.slug}`} className="group block">
                  <h3 className="text-base lg:text-lg font-black text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-3 font-display">
                    {leftBottom.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{leftBottom.excerpt}</p>
                </Link>
              </div>
            )}
          </div>

          {/* CENTER COLUMN */}
          <div className="lg:col-span-6">
            <Link href={`/article/${center.slug}`} className="group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl mb-4">
                <SmartImage
                  src={center.coverImage}
                  alt={center.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display">
                {center.title}
              </h1>
              <p className="text-gray-700 text-base lg:text-lg mt-3 line-clamp-3">{center.excerpt}</p>
            </Link>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {rightTop && (
              <Link href={`/article/${rightTop.slug}`} className="group block pb-6 border-b border-gray-200">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-3">
                  <SmartImage
                    src={rightTop.coverImage}
                    alt={rightTop.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-black text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-3 font-display">
                  {rightTop.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{rightTop.excerpt}</p>
              </Link>
            )}

            {rightBottom && (
              <Link href={`/article/${rightBottom.slug}`} className="group flex gap-3 items-start">
                <div className="relative w-20 h-14 shrink-0 overflow-hidden rounded-lg">
                  <SmartImage
                    src={rightBottom.coverImage}
                    alt={rightBottom.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display">
                    {rightBottom.title}
                  </h3>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
