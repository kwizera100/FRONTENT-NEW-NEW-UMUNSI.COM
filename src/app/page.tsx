import { api, mapApiPost, type ApiCategory } from "@/lib/api";
import { DEFAULT_IMAGE_FALLBACK } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroFeaturedSection } from "@/components/home/HeroFeaturedSection";
import { EntertainmentSection } from "@/components/home/EntertainmentSection";
import { CategoryGridSection } from "@/components/home/CategoryGridSection";

export const revalidate = 60;
export const dynamic = "force-dynamic";

// Filter out posts whose coverImage resolves to the fallback (either no
// featuredImage or a broken old WordPress URL that gets replaced).
function hasRealImage(post: { coverImage: string }): boolean {
  return post.coverImage !== DEFAULT_IMAGE_FALLBACK;
}

export default async function HomePage() {
  const [featuredPosts, trendingPosts, categories] = await Promise.all([
    api.getFeaturedPosts(7),
    api.getTrendingPosts(8),
    api.getCategories(),
  ]);

  const featured = featuredPosts.map(mapApiPost).filter(hasRealImage);
  const popular = trendingPosts.map(mapApiPost).filter(hasRealImage);

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
    allDisplayCategories.map((cat) => api.getPostsByCategory(cat.slug, 12))
  );

  // Map and filter out posts whose coverImage is the fallback
  const categoryPostsWithImages = categoryPosts.map((posts) =>
    posts.map(mapApiPost).filter(hasRealImage)
  );

  return (
    <>
      <Header categories={allCats} />

      <main>
        <HeroFeaturedSection featured={featured} popular={popular} />

        {allDisplayCategories.map((cat, i) => {
          const posts = categoryPostsWithImages[i];
          if (posts.length === 0) return null;

          if (cat.slug.toLowerCase() === "imyidagaduro") {
            const amatangazoCat = activeCats.find(
              (c) => c.slug.toLowerCase() === "amatangazo"
            );
            const amatangazoIdx = allDisplayCategories.findIndex(
              (c) => c.slug.toLowerCase() === "amatangazo"
            );
            const amatangazoPosts =
              amatangazoIdx >= 0 ? categoryPostsWithImages[amatangazoIdx] : [];

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
