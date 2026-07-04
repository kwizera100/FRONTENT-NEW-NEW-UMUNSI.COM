import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import type { Post } from "@/lib/data";
import { formatTimeAgo } from "@/lib/utils";

interface CategoryGridSectionProps {
  title: string;
  slug: string;
  color?: string | null;
  posts: Post[];
}

export function CategoryGridSection({ title, slug, color, posts }: CategoryGridSectionProps) {
  if (posts.length === 0) return null;

  const accent = color || "#e5b60d";
  const main = posts[0];
  const grid = posts.slice(1, 5);

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
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4">
                <Image
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
                className="group flex gap-4 items-start"
              >
                <div className="relative w-24 h-20 sm:w-28 sm:h-22 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="120px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm lg:text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display">
                    {post.title}
                  </h4>
                  <span className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(post.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
