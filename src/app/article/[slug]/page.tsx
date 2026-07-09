import { api, mapApiPost, type ApiCategory } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import { ShareBar } from "@/components/article/ShareBar";
import { ArticleContent } from "@/components/article/ArticleContent";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Eye } from "lucide-react";

export const revalidate = 300;

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const [allCategories, post, trendingPosts] = await Promise.all([
    api.getCategories(),
    api.getPostBySlug(params.slug),
    api.getTrendingPosts(5),
  ]);

  const categories = allCategories as ApiCategory[];

  if (!post) notFound();

  const latestPosts = await api.getPostsByCategory(post.category?.slug || "", 4);

  const mappedPost = mapApiPost(post);
  const coverImage = mappedPost.coverImage;
  const authorName = mappedPost.author.name;
  const publishedDate = mappedPost.publishedAt;

  const related = latestPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 3)
    .map(mapApiPost);

  const popular = trendingPosts.map(mapApiPost);

  return (
    <>
      <Header categories={categories} />

      <div className="relative bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <Image src={coverImage} alt={post.title} fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
          <div className="max-w-3xl">
            <Link
              href={`/category/${post.category?.slug || ""}`}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-white mb-4 sm:mb-6"
              style={{ backgroundColor: post.category?.color || "#e5b60d" }}
            >
              {post.category?.name || ""}
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white text-balance leading-tight mb-4 sm:mb-6 font-display">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/70 text-xs sm:text-sm">
              <span className="font-bold text-white text-sm sm:text-base">{authorName}</span>
              {post.coAuthors && Array.isArray(post.coAuthors) && post.coAuthors.map((coAuthor: string, idx: number) => (
                <span key={idx} className="font-bold text-white text-sm sm:text-base">
                  &middot; {coAuthor}
                </span>
              ))}
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{formatDate(publishedDate)}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{post.likeCount.toLocaleString()} byayeho</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{mappedPost.readTime} min gusoma</span>
            </div>
          </div>
        </div>
      </div>

      <article className="py-8 lg:py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-14">
            <div className="lg:col-span-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
                <Image src={coverImage} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
              </div>

              <ShareBar title={post.title} slug={post.slug} />

              <ArticleContent html={post.content || ""} />
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] flex items-center justify-center text-white font-black text-lg sm:text-xl shrink-0">
                    {authorName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{authorName}</h3>
                    <p className="text-sm text-gray-400">Author</p>
                  </div>
                </div>
                {post.coAuthors && Array.isArray(post.coAuthors) && post.coAuthors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Co-Authors</p>
                    <div className="space-y-2">
                      {post.coAuthors.map((coAuthor: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {coAuthor.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-gray-700 truncate">{coAuthor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-24">
                <h3 className="text-base sm:text-lg font-black text-gray-900 mb-4 sm:mb-5 font-display">Inkuru zizwi cyane</h3>
                <div className="space-y-1">
                  {popular.map((p, i) => (
                    <Link key={p.id} href={`/article/${p.slug}`} className="group flex gap-3 items-start py-3 border-b border-gray-50 last:border-0">
                      <span className="text-2xl font-black text-[#e5b60d]/30 group-hover:text-[#e5b60d] transition-colors leading-none w-7 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-800 group-hover:text-[#e5b60d] transition-colors line-clamp-2">{p.title}</h4>
                        <span className="text-xs text-gray-400 mt-1 block">{formatTimeAgo(p.publishedAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-10 lg:py-14 bg-gray-50/50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-8 rounded-full bg-[#e5b60d]" />
              <h2 className="text-2xl lg:text-3xl font-black text-gray-900 font-display">Inkuru zerekeye</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {related.map((p) => (
                <ArticleCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
