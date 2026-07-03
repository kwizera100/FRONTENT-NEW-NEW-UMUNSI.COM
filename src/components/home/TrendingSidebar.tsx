import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface PopularPost {
  id: string;
  slug: string;
  title: string;
  views: number;
  publishedAt: string;
}

export function TrendingSidebar({ popular = [] }: { popular?: PopularPost[] }) {

  return (
    <div className="bg-white rounded-2xl border border-ink-100 p-5 lg:p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-brand-600" />
        </div>
        <h3 className="text-lg font-black text-ink-900">Bizwi cyane</h3>
      </div>

      <div className="space-y-1">
        {popular.map((post, i) => (
          <Link
            key={post.id}
            href={`/article/${post.slug}`}
            className="group flex gap-3 items-start py-3 border-b border-ink-50 last:border-0"
          >
            <span className="text-3xl font-black text-brand-100 group-hover:text-brand-300 transition-colors leading-none w-8 shrink-0">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-ink-800 group-hover:text-brand-600 transition-colors line-clamp-2 mb-1">
                {post.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-ink-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views.toLocaleString()}
                </span>
                <span>{formatTimeAgo(post.publishedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
