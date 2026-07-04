import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import { formatDate, formatTimeAgo, getYouTubeId, getYouTubeThumb } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Eye, Share2, Tag, ArrowLeft, Play } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      author: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true, bio: true } },
    },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  // Increment views
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  const [relatedPosts, popularPosts, allCategories] = await Promise.all([
    prisma.post.findMany({
      where: { categoryId: post.categoryId, status: "PUBLISHED", id: { not: post.id } },
      include: { category: true, author: { select: { username: true, firstName: true, lastName: true } } },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: { viewCount: "desc" },
      take: 5,
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  const authorName = [post.author?.firstName, post.author?.lastName].filter(Boolean).join(" ") || post.author?.username || "Umunsi";
  const coverImage = post.featuredImage || "https://images.unsplash.com/photo-1495020689067-958854a1dd38?w=1600&q=80";
  const tags = post.tags ? post.tags.split(",").filter(Boolean) : [];
  const publishedDate = post.publishedAt?.toISOString() || post.createdAt.toISOString();

  const mappedRelated = relatedPosts.map((p) => ({
    id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt || "", content: "", featured: false, published: true,
    views: p.viewCount, publishedAt: p.publishedAt?.toISOString() || p.createdAt.toISOString(), createdAt: p.createdAt.toISOString(),
    category: { id: p.category?.id || "", slug: p.category?.slug || "", name: p.category?.name || "", nameEn: "", color: p.category?.color || "#f43f5e", icon: p.category?.icon || "Flame", description: "", order: 0 },
    author: { name: [p.author?.firstName, p.author?.lastName].filter(Boolean).join(" ") || p.author?.username || "Umunsi" },
    media: [], tags: [], readTime: 5,
    coverImage: p.featuredImage || "https://images.unsplash.com/photo-1495020689067-958854a1dd38?w=1600&q=80",
  }));

  const mappedPopular = popularPosts.map((p) => ({
    id: p.id, slug: p.slug, title: p.title, excerpt: "", content: "", featured: false, published: true,
    views: p.viewCount, publishedAt: p.publishedAt?.toISOString() || p.createdAt.toISOString(), createdAt: p.createdAt.toISOString(),
    category: { id: p.category?.id || "", slug: p.category?.slug || "", name: p.category?.name || "", nameEn: "", color: p.category?.color || "#f43f5e", icon: p.category?.icon || "Flame", description: "", order: 0 },
    author: { name: "Umunsi" }, media: [], tags: [], readTime: 5,
    coverImage: p.featuredImage || "https://images.unsplash.com/photo-1495020689067-958854a1dd38?w=1600&q=80",
  }));

  return (
    <>
      <Header categories={allCategories} />

      {/* Article hero */}
      <div className="relative bg-ink-900">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={coverImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/80 to-ink-900/40" />
        </div>

        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl">
            <Link
              href={`/category/${post.category?.slug || ""}`}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold text-white mb-6"
              style={{ backgroundColor: post.category?.color || "#f43f5e" }}
            >
              {post.category?.name || ""}
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white text-balance leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-white/80 text-lg lg:text-xl mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              <span className="font-bold text-white text-base">
                {authorName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(publishedDate)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.viewCount.toLocaleString()} byayeho
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                5 min gusoma
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="py-10 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Cover image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-8">
                <Image
                  src={coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-ink-100">
                <span className="text-sm font-bold text-ink-500 flex items-center gap-1">
                  <Share2 className="w-4 h-4" /> Sanga:
                </span>
                {["Facebook", "Twitter", "WhatsApp", "LinkedIn"].map((platform) => (
                  <button
                    key={platform}
                    className="px-3 py-1.5 rounded-lg bg-ink-50 hover:bg-brand-50 text-ink-700 hover:text-brand-600 text-sm font-semibold transition-colors"
                  >
                    {platform}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none text-ink-800 leading-relaxed space-y-4
                  [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-ink-100">
                  <Tag className="w-4 h-4 text-ink-400" />
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg bg-ink-50 text-ink-600 text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Author card */}
              <div className="bg-white rounded-2xl border border-ink-100 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-black text-xl">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900">{authorName}</h3>
                    <p className="text-sm text-ink-400">Umwanditsi</p>
                  </div>
                </div>
              </div>

              {/* Popular */}
              <div className="bg-white rounded-2xl border border-ink-100 p-6 sticky top-24">
                <h3 className="text-lg font-black text-ink-900 mb-5">
                  Inkuru zizwi cyane
                </h3>
                <div className="space-y-1">
                  {mappedPopular.map((p, i) => (
                    <Link
                      key={p.id}
                      href={`/article/${p.slug}`}
                      className="group flex gap-3 items-start py-3 border-b border-ink-50 last:border-0"
                    >
                      <span className="text-2xl font-black text-brand-100 group-hover:text-brand-300 transition-colors leading-none w-7 shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-ink-800 group-hover:text-brand-600 transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                        <span className="text-xs text-ink-400 mt-1 block">
                          {formatTimeAgo(p.publishedAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {mappedRelated.length > 0 && (
        <section className="py-10 lg:py-14 bg-ink-50/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-8 rounded-full bg-brand-600" />
              <h2 className="text-2xl lg:text-3xl font-black text-ink-900">
                Inkuru zerekeye
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {mappedRelated.map((p) => (
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
