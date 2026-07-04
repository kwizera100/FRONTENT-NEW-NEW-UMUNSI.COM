import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { Post } from "@/lib/data";
import { formatTimeAgo } from "@/lib/utils";

interface BreakingNewsSectionProps {
  posts: Post[];
}

export function BreakingNewsSection({ posts }: BreakingNewsSectionProps) {
  if (posts.length === 0) return null;

  const main = posts[0];
  const side = posts.slice(1, 4);

  return (
    <section className="py-8 lg:py-12 bg-white border-t border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-8 bg-red-600 rounded-full" />
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 font-display">Inkuru Nyamukuru</h2>
          <span className="ml-auto px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">LIVE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main breaking */}
          <div className="lg:col-span-2">
            <Link href={`/article/${main.slug}`} className="group block">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl mb-4">
                <Image
                  src={main.coverImage}
                  alt={main.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1.5 rounded-md text-xs font-bold text-white uppercase"
                    style={{ backgroundColor: main.category.color || "#e5b60d" }}
                  >
                    {main.category.name}
                  </span>
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 group-hover:text-[#e5b60d] transition-colors mb-2 font-display line-clamp-2">
                {main.title}
              </h3>
              <p className="text-gray-600 text-sm lg:text-base line-clamp-2 mb-3">{main.excerpt}</p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{main.author.name}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTimeAgo(main.publishedAt)}
                </span>
              </div>
            </Link>
          </div>

          {/* Side breaking */}
          <div className="flex flex-col gap-5">
            {side.map((post) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className="group flex gap-4 items-start"
              >
                <div className="relative w-32 h-24 lg:w-40 lg:h-28 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="160px"
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
                  <h4 className="font-bold text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-3 mt-1 font-display">
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
