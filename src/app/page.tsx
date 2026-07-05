import { api, mapApiPost, type ApiCategory } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroFeaturedSection } from "@/components/home/HeroFeaturedSection";
import { EntertainmentSection } from "@/components/home/EntertainmentSection";
import { CategoryGridSection } from "@/components/home/CategoryGridSection";

export const revalidate = 300;

export default async function HomePage() {
  const [featuredPosts, trendingPosts, categories] = await Promise.all([
    api.getFeaturedPosts(5),
    api.getTrendingPosts(6),
    api.getCategories(),
  ]);

  const featured = featuredPosts.map(mapApiPost);
  const popular = trendingPosts.map(mapApiPost);

  const orderedSlugs = [
    "inkuru-nyamukuru",
    "imikino",
    "imyidagaduro",
    "ikoranabuhanga",
    "ubuzima",
    "amatangazo",
    "amakuru",
  ];

  const allCats = categories as ApiCategory[];
  const activeCats = allCats.filter((c) => c.isActive);

  const orderedCategories = orderedSlugs
    .map((slug) => activeCats.find((c) => c.slug.toLowerCase() === slug))
    .filter((c): c is ApiCategory => c !== undefined);

  const remainingCategories = activeCats.filter(
    (c) => !orderedSlugs.includes(c.slug.toLowerCase())
  );

  const allDisplayCategories = [...orderedCategories, ...remainingCategories];

  const categoryPosts = await Promise.all(
    allDisplayCategories.map((cat) => api.getPostsByCategory(cat.slug, 6))
  );

  return (
    <>
      <Header categories={allCats} />

      <main>
        <HeroFeaturedSection featured={featured} popular={popular} />

        {allDisplayCategories.map((cat, i) => {
          const posts = categoryPosts[i].map(mapApiPost);
          if (posts.length === 0) return null;

          if (cat.slug.toLowerCase() === "imyidagaduro") {
            const amatangazoCat = activeCats.find(
              (c) => c.slug.toLowerCase() === "amatangazo"
            );
            const amatangazoIdx = allDisplayCategories.findIndex(
              (c) => c.slug.toLowerCase() === "amatangazo"
            );
            const amatangazoPosts =
              amatangazoIdx >= 0 ? categoryPosts[amatangazoIdx].map(mapApiPost) : [];

            if (amatangazoCat && amatangazoPosts.length > 0) {
              return (
                <EntertainmentSection
                  key={cat.id}
                  entertainment={posts}
                  amatangazo={amatangazoPosts}
                />
              );
            }
          }

          if (cat.slug.toLowerCase() === "amatangazo") {
            const hasEntertainment = activeCats.some(
              (c) => c.slug.toLowerCase() === "imyidagaduro"
            );
            if (hasEntertainment) return null;
          }

          return (
            <CategoryGridSection
              key={cat.id}
              title={cat.name}
              slug={cat.slug}
              color={cat.color}
              posts={posts}
            />
          );
        })}
      </main>

      <Footer />
    </>
  );
}
