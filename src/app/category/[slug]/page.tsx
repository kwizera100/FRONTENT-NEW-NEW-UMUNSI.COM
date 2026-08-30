import { api, mapApiPost, type ApiCategory } from "@/lib/api";
import { DEFAULT_IMAGE_FALLBACK, formatTimeAgo } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import { SmartImage } from "@/components/home/SmartImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

export const revalidate = 60;
export const dynamicParams = true;

function hasRealImage(post: { coverImage: string }): boolean {
  return post.coverImage !== DEFAULT_IMAGE_FALLBACK;
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [allCategories, categoryPosts] = await Promise.all([
    api.getCategories(),
    api.getPostsByCategory(params.slug, 24),
  ]);

  const categories = allCategories as ApiCategory[];
  const category = categories.find((c) => c.slug === params.slug && c.isActive);

  if (!category) notFound();

  const mappedPosts = categoryPosts.map(mapApiPost).filter(hasRealImage);
  const color = category.color || "#f43f5e";

  const isInkuru = params.slug === "inkuru-nyamukuru";

  return (
    <>
      <Header categories={categories} />

      <div
        className="relative py-16 lg:py-20 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: color }} />
        <div className="px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Garuka ku rubuga
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>
              <span className="text-3xl lg:text-4xl font-black">{category.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl lg:text-5xl font-black text-gray-900 font-display">{category.name}</h1>
              <p className="text-gray-500 text-lg mt-1">{category.description || ""}</p>
              <p className="text-sm text-gray-400 mt-1">{mappedPosts.length} inkuru ziri muri iki cyiciro</p>
            </div>
          </div>
        </div>
      </div>

      {isInkuru ? (
        <InkuruNBCNews posts={mappedPosts} color={color} />
      ) : (
        <section className="py-10 lg:py-14">
          <div className="px-4 sm:px-6 lg:px-8">
            {mappedPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {mappedPosts.map((post, i) => (
                  <ArticleCard key={post.id} post={post} priority={i < 4} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-gray-400">Nta nkuru ziboneka muri iki cyiciro byose.</p>
                <Link href="/" className="inline-flex items-center gap-2 mt-4 text-[#e5b60d] font-bold hover:text-[#c9a00c]">
                  <ArrowLeft className="w-4 h-4" /> Garuka ku rubuga
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

function InkuruNBCNews({ posts, color }: { posts: any[]; color: string }) {
  if (posts.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl text-gray-400">Nta nkuru ziboneka muri iki cyiciro byose.</p>
      </section>
    );
  }

  const left = posts[0];
  const center = posts[1] || posts[0];
  const right = posts.slice(2, 7);
  const bottom = posts.slice(7, 14);

  return (
    <>
      <section className="py-8 lg:py-10 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* LEFT */}
            <div className="lg:col-span-3">
              <Link href={`/article/${left.slug}`} className="group block h-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-4">
                  <SmartImage
                    src={left.coverImage}
                    alt={left.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h2 className="text-lg lg:text-xl font-black text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-tight line-clamp-3 font-display">
                  {left.title}
                </h2>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">{left.excerpt}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(left.publishedAt)}
                </div>
              </Link>
            </div>

            {/* CENTER */}
            <div className="lg:col-span-6">
              <Link href={`/article/${center.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl mb-4">
                  <SmartImage
                    src={center.coverImage}
                    alt={center.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1.5 rounded-md text-xs font-bold text-white uppercase tracking-wider"
                      style={{ backgroundColor: color }}
                    >
                      {center.category.name}
                    </span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display">
                  {center.title}
                </h1>
                <p className="text-gray-700 text-base lg:text-lg mt-3 line-clamp-3">{center.excerpt}</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {formatTimeAgo(center.publishedAt)}
                </div>
              </Link>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-3 border-l-0 lg:border-l border-gray-200 lg:pl-6">
              <div className="flex flex-col gap-5">
                {right.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/article/${post.slug}`}
                    className="group flex gap-3 items-start"
                  >
                    <div className="relative w-20 h-14 shrink-0 overflow-hidden rounded-lg">
                      <SmartImage
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display">
                        {post.title}
                      </h3>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {formatTimeAgo(post.publishedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM Ticker */}
          {bottom.length > 0 && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {bottom.map((post, i) => (
                  <div key={post.id} className="flex items-center gap-4">
                    <Link
                      href={`/article/${post.slug}`}
                      className="text-sm font-semibold text-gray-800 hover:text-[#e5b60d] transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    {i < bottom.length - 1 && (
                      <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
