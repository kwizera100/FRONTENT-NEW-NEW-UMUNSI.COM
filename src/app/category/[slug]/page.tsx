import { api, mapApiPost, type ApiCategory } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const revalidate = 300;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [allCategories, categoryPosts] = await Promise.all([
    api.getCategories(),
    api.getPostsByCategory(params.slug, 24),
  ]);

  const categories = allCategories as ApiCategory[];
  const category = categories.find((c) => c.slug === params.slug && c.isActive);

  if (!category) notFound();

  const mappedPosts = categoryPosts.map(mapApiPost);
  const color = category.color || "#f43f5e";

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

      <Footer />
    </>
  );
}
