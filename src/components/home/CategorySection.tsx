import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import type { Post, Category } from "@/lib/data";

interface CategorySectionProps {
  category: Category;
  posts: Post[];
}

export function CategorySection({ category, posts }: CategorySectionProps) {
  if (!posts.length) return null;

  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="flex items-center gap-3">
            <span
              className="w-1.5 h-8 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-ink-900">
                {category.name}
              </h2>
              <p className="text-sm text-ink-400">{category.description}</p>
            </div>
          </div>
          <Link
            href={`/category/${category.slug}`}
            className="flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Reba byinshi <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.slice(0, 4).map((post, i) => (
            <ArticleCard key={post.id} post={post} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
