import { api, mapApiPost, type ApiCategory } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroFeaturedSection } from "@/components/home/HeroFeaturedSection";
import { BreakingNewsSection } from "@/components/home/BreakingNewsSection";
import { EntertainmentSection } from "@/components/home/EntertainmentSection";
import { CategoryGridSection } from "@/components/home/CategoryGridSection";

export const revalidate = 300;

export default async function HomePage() {
  const [featuredPosts, latestPosts, trendingPosts, categories, entertainmentPosts, amatangazoPosts] =
    await Promise.all([
      api.getFeaturedPosts(5),
      api.getLatestPosts(20),
      api.getTrendingPosts(6),
      api.getCategories(),
      api.getPostsByCategory("imyidagaduro", 5),
      api.getPostsByCategory("amatangazo", 6),
    ]);

  const featured = featuredPosts.map(mapApiPost);
  const latest = latestPosts.map(mapApiPost);
  const popular = trendingPosts.map(mapApiPost);
  const entertainment = entertainmentPosts.map(mapApiPost);
  const amatangazo = amatangazoPosts.map(mapApiPost);

  const excludeSlugs = ["imyidagaduro", "amatangazo", "inkuru-nyamukuru"];
  const otherCategories = (categories as ApiCategory[]).filter(
    (c) => c.isActive && !excludeSlugs.includes(c.slug.toLowerCase())
  );

  return (
    <>
      <Header categories={categories as ApiCategory[]} />

      <main>
        <HeroFeaturedSection featured={featured} popular={popular} />
        <BreakingNewsSection posts={latest.slice(0, 8)} />
        <EntertainmentSection entertainment={entertainment} amatangazo={amatangazo} />

        {otherCategories.map((cat) => {
          const catPosts = latest.filter(
            (p) => p.category.slug.toLowerCase() === cat.slug.toLowerCase()
          ).slice(0, 5);
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
