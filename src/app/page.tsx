import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryBar } from "@/components/home/CategoryBar";
import { CategorySection } from "@/components/home/CategorySection";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { ArticleCard } from "@/components/home/ArticleCard";
import { Clock, Eye, Flame } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 300;

async function getData() {
  try {
    const [featuredPosts, latestPosts, popularPosts, categories] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED", isFeatured: true },
        include: { category: true, author: { select: { username: true, firstName: true, lastName: true } } },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        include: { category: true, author: { select: { username: true, firstName: true, lastName: true } } },
        orderBy: { publishedAt: "desc" },
        take: 8,
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        include: { category: true },
        orderBy: { viewCount: "desc" },
        take: 5,
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return { featuredPosts, latestPosts, popularPosts, categories };
  } catch (error) {
    console.error("Database fetch error:", error);
    return { featuredPosts: [], latestPosts: [], popularPosts: [], categories: [] };
  }
}

function mapPost(post: any) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content || "",
    featured: post.isFeatured,
    published: post.status === "PUBLISHED",
    views: post.viewCount,
    publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    createdAt: post.createdAt.toISOString(),
    category: {
      id: post.category?.id || "",
      slug: post.category?.slug || "uncategorized",
      name: post.category?.name || "Uncategorized",
      nameEn: post.category?.name || "",
      color: post.category?.color || "#f43f5e",
      icon: post.category?.icon || "Flame",
      description: post.category?.description || "",
      order: 0,
    },
    author: {
      name: [post.author?.firstName, post.author?.lastName].filter(Boolean).join(" ") || post.author?.username || "Umunsi",
    },
    media: [],
    tags: post.tags ? post.tags.split(",").filter(Boolean) : [],
    readTime: 5,
    coverImage: post.featuredImage || "https://images.unsplash.com/photo-1495020689067-958854a1dd38?w=1600&q=80",
  };
}

export default async function HomePage() {
  const { featuredPosts, latestPosts, popularPosts, categories } = await getData();

  const featured = featuredPosts.map(mapPost);
  const latest = latestPosts.map(mapPost);
  const popular = popularPosts.map(mapPost);

  return (
    <>
      <Header categories={categories} />
      <CategoryBar categories={categories} />

      {/* Hero Slider */}
      {featured.length > 0 && <HeroSlider posts={featured} />}

      {/* Breaking news ticker */}
      <div className="bg-brand-600 text-white py-2.5 overflow-hidden">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold text-sm shrink-0 bg-white/20 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4" /> Hano Nonaho
          </span>
          <div className="flex gap-8 overflow-hidden whitespace-nowrap text-sm">
            {latest.slice(0, 5).map((post) => (
              <span key={post.id} className="animate-marquee">
                {post.title} —{" "}
                <span className="text-white/70">{formatTimeAgo(post.publishedAt)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Latest + Trending sidebar */}
      <section className="py-10 lg:py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Main latest */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-8 rounded-full bg-brand-600" />
                <h2 className="text-2xl lg:text-3xl font-black text-ink-900">
                  Inkuru za none
                </h2>
              </div>

              {latest.length > 0 ? (
                <>
                  {/* First large */}
                  <div className="mb-8">
                    <ArticleCard post={latest[0]} variant="large" priority />
                  </div>

                  {/* Grid of latest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {latest.slice(1, 5).map((post) => (
                      <ArticleCard key={post.id} post={post} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-ink-400 text-center py-20">Nta nkuru ziboneka byose.</p>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <TrendingSidebar popular={popular} />

              {/* Most viewed compact list */}
              <div className="bg-ink-900 text-white rounded-2xl p-5 lg:p-6">
                <h3 className="text-lg font-black mb-5 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-brand-400" />
                  Ibyafatiwe amaso
                </h3>
                <div className="space-y-1">
                  {popular.map((post, i) => (
                    <a
                      key={post.id}
                      href={`/article/${post.slug}`}
                      className="group flex gap-3 items-start py-3 border-b border-white/10 last:border-0"
                    >
                      <span className="text-2xl font-black text-brand-500 leading-none w-7 shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-white/90 group-hover:text-brand-400 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <span className="text-xs text-white/40 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(post.publishedAt)}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category sections */}
      {categories.slice(0, 8).map((cat) => {
        const catPosts = latest.filter((p) => p.category.slug === cat.slug).slice(0, 4);
        if (catPosts.length === 0) return null;
        return (
          <CategorySection
            key={cat.id}
            category={{
              id: cat.id,
              slug: cat.slug,
              name: cat.name,
              nameEn: cat.name,
              color: cat.color || "#f43f5e",
              icon: cat.icon || "Flame",
              description: cat.description || "",
              order: 0,
            }}
            posts={catPosts}
          />
        );
      })}

      {/* Newsletter CTA */}
      <section className="py-14 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-black mb-4">
            Iyandikishe ku makuru ya Umunsi.com
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Wagure inkuru z'icyamamare z'umunsi buri munsi mu mailbox yawe.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Emeyili yawe"
              className="flex-1 px-5 py-3 rounded-xl bg-white/15 border border-white/30 text-white placeholder:text-white/50 outline-none focus:border-white"
            />
            <button className="px-8 py-3 bg-white text-brand-700 rounded-xl font-bold hover:bg-brand-50 transition-colors">
              Iyandikishe
            </button>
          </div>
        </div>
      </section>

      <Footer categories={categories} />
    </>
  );
}
