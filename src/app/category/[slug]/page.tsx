import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category || !category.isActive) notFound();

  const posts = await prisma.post.findMany({
    where: { categoryId: category.id, status: "PUBLISHED" },
    include: { category: true, author: { select: { username: true, firstName: true, lastName: true } } },
    orderBy: { publishedAt: "desc" },
    take: 24,
  });

  const allCategories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  const mappedPosts = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    content: p.content || "",
    featured: p.isFeatured,
    published: true,
    views: p.viewCount,
    publishedAt: p.publishedAt?.toISOString() || p.createdAt.toISOString(),
    createdAt: p.createdAt.toISOString(),
    category: { id: category.id, slug: category.slug, name: category.name, nameEn: category.name, color: category.color || "#f43f5e", icon: category.icon || "Flame", description: category.description || "", order: 0 },
    author: { name: [p.author?.firstName, p.author?.lastName].filter(Boolean).join(" ") || p.author?.username || "Umunsi" },
    media: [],
    tags: p.tags ? p.tags.split(",").filter(Boolean) : [],
    readTime: 5,
    coverImage: p.featuredImage || "https://images.unsplash.com/photo-1495020689067-958854a1dd38?w=1600&q=80",
  }));

  return (
    <>
      <Header categories={allCategories} />

      {/* Category hero header */}
      <div
        className="relative py-16 lg:py-20 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${category.color || "#f43f5e"}15, ${category.color || "#f43f5e"}05)`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: category.color || "#f43f5e" }}
        />
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Garuka ku rubuga
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: category.color || "#f43f5e" }}
            >
              <span className="text-3xl lg:text-4xl font-black">
                {category.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl lg:text-5xl font-black text-ink-900">
                {category.name}
              </h1>
              <p className="text-ink-500 text-lg mt-1">{category.description || ""}</p>
              <p className="text-sm text-ink-400 mt-1">
                {mappedPosts.length} inkuru ziri muri iki cyiciro
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts grid */}
      <section className="py-10 lg:py-14">
        <div className="container mx-auto px-4">
          {mappedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {mappedPosts.map((post, i) => (
                <ArticleCard key={post.id} post={post} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-ink-400">
                Nta nkuru ziboneka muri iki cyiciro byose.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-4 text-brand-600 font-bold hover:text-brand-700"
              >
                <ArrowLeft className="w-4 h-4" /> Garuka ku rubuga
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
