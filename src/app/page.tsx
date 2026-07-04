import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroFeaturedSection } from "@/components/home/HeroFeaturedSection";
import { BreakingNewsSection } from "@/components/home/BreakingNewsSection";
import { EntertainmentSection } from "@/components/home/EntertainmentSection";
import { CategoryGridSection } from "@/components/home/CategoryGridSection";
import { Flame } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 300;

async function getData() {
  try {
    const [
      featuredPosts,
      latestPosts,
      popularPosts,
      categories,
      entertainmentPosts,
      amatangazoPosts,
    ] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED", isFeatured: true },
        include: {
          category: true,
          author: { select: { username: true, firstName: true, lastName: true } },
        },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        include: {
          category: true,
          author: { select: { username: true, firstName: true, lastName: true } },
        },
        orderBy: { publishedAt: "desc" },
        take: 12,
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        include: { category: true },
        orderBy: { viewCount: "desc" },
        take: 6,
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
      prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          category: { slug: { equals: "imyidagaduro", mode: "insensitive" } },
        },
        include: { category: true, author: { select: { username: true } } },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),
      prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          category: { slug: { equals: "amatangazo", mode: "insensitive" } },
        },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 6,
      }),
    ]);

    return {
      featuredPosts,
      latestPosts,
      popularPosts,
      categories,
      entertainmentPosts,
      amatangazoPosts,
    };
  } catch (error) {
    console.error("Database fetch error:", error);
    return {
      featuredPosts: [],
      latestPosts: [],
      popularPosts: [],
      categories: [],
      entertainmentPosts: [],
      amatangazoPosts: [],
    };
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
      color: post.category?.color || "#e5b60d",
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
  const {
    featuredPosts,
    latestPosts,
    popularPosts,
    categories,
    entertainmentPosts,
    amatangazoPosts,
  } = await getData();

  const featured = featuredPosts.map(mapPost);
  const latest = latestPosts.map(mapPost);
  const popular = popularPosts.map(mapPost);
  const entertainment = entertainmentPosts.map(mapPost);
  const amatangazo = amatangazoPosts.map(mapPost);

  const excludeSlugs = ["imyidagaduro", "amatangazo", "inkuru-nyamukuru"];
  const otherCategories = categories.filter((c) => !excludeSlugs.includes(c.slug.toLowerCase()));

  return (
    <>
      <Header categories={categories} />

      {/* Breaking news ticker */}
      <div className="bg-[#1a1a1a] text-white py-2.5 overflow-hidden">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold text-sm shrink-0 bg-[#e5b60d] px-3 py-1 rounded text-black">
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

      <main>
        {/* Hero + Featured + Izikunzwe */}
        <HeroFeaturedSection featured={featured} popular={popular} />

        {/* Inkuru Nyamukuru */}
        <BreakingNewsSection posts={latest.slice(0, 8)} />

        {/* Imyidagaduro + Amatangazo */}
        <EntertainmentSection entertainment={entertainment} amatangazo={amatangazo} />

        {/* Other categories */}
        {otherCategories.map((cat) => {
          const catPosts = latest.filter((p) => p.category.slug.toLowerCase() === cat.slug.toLowerCase()).slice(0, 5);
          if (catPosts.length === 0) return null;
          return (
            <CategoryGridSection
              key={cat.id}
              title={cat.name}
              slug={cat.slug}
              color={cat.color}
              posts={catPosts}
            />
          );
        })}
      </main>

      <Footer />
    </>
  );
}
