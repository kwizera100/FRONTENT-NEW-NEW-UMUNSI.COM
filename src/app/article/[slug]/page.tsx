import { api, mapApiPost, type ApiCategory } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Eye, Share2, ArrowLeft } from "lucide-react";

export const revalidate = 300;

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const [allCategories, latestNews, trendingNews] = await Promise.all([
    api.getCategories(),
    api.getLatestNews(20),
    api.getTrendingNews(5),
  ]);

  const categories = allCategories as ApiCategory[];
  const post = latestNews.find((p) => p.slug === params.slug);

  if (!post) notFound();

  const mappedPost = mapApiPost(post);
  const coverImage = mappedPost.coverImage;
  const authorName = mappedPost.author.name;
  const publishedDate = mappedPost.publishedAt;

  const related = latestNews
    .filter((p) => p.category?.slug === post.category?.slug && p.id !== post.id)
    .slice(0, 3)
    .map(mapApiPost);

  const popular = trendingNews.map(mapApiPost);

  return (
    <>
      <Header categories={categories} />

      <div className="relative bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <Image src={coverImage} alt={post.title} fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <Link
              href={`/category/${post.category?.slug || ""}`}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold text-white mb-6"
              style={{ backgroundColor: post.category?.color || "#e5b60d" }}
            >
              {post.category?.name || ""}
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white text-balance leading-tight mb-6 font-display">
              {post.title}
            </h1>
            <p className="text-white/80 text-lg lg:text-xl mb-6 line-clamp-3">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              <span className="font-bold text-white text-base">{authorName}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDate(publishedDate)}</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.likeCount.toLocaleString()} byayeho</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />5 min gusoma</span>
            </div>
          </div>
        </div>
      </div>

      <article className="py-10 lg:py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            <div className="lg:col-span-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-8">
                <Image src={coverImage} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
              </div>

              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-500 flex items-center gap-1"><Share2 className="w-4 h-4" /> Sanga:</span>
                {["Facebook", "Twitter", "WhatsApp", "LinkedIn"].map((platform) => (
                  <button key={platform} className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-[#e5b60d]/10 text-gray-700 hover:text-[#e5b60d] text-sm font-semibold transition-colors">
                    {platform}
                  </button>
                ))}
              </div>

              <div
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-4 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] flex items-center justify-center text-white font-black text-xl">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{authorName}</h3>
                    <p className="text-sm text-gray-400">Umwanditsi</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-black text-gray-900 mb-5 font-display">Inkuru zizwi cyane</h3>
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
