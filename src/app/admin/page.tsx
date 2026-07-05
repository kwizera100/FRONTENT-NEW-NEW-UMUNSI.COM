import Link from "next/link";
import {
  FileText,
  Image,
  FolderTree,
  Eye,
  TrendingUp,
  PenSquare,
  Clock,
} from "lucide-react";
import { api, mapApiPost, type ApiCategory } from "@/lib/api";
import { formatTimeAgo } from "@/lib/utils";

export const revalidate = 60;

export default async function AdminDashboardPage() {
  const [stats, recentApiPosts, categories] = await Promise.all([
    api.getStats(),
    api.getLatestPosts(6),
    api.getCategories(),
  ]);

  const cats = categories as ApiCategory[];
  const recentPosts = recentApiPosts.map(mapApiPost);

  const statItems = [
    {
      label: "Inkuru zose",
      value: stats.totalPosts.toLocaleString(),
      icon: FileText,
      color: "bg-blue-500",
      change: `${stats.totalPosts > 0 ? "+" : ""}${Math.round(stats.totalPosts / 100)}%`,
    },
    {
      label: "Byasohotse",
      value: stats.publishedCount.toLocaleString(),
      icon: Eye,
      color: "bg-green-500",
      change: "Live",
    },
    {
      label: "Amafoto (Media)",
      value: stats.totalPosts.toLocaleString(),
      icon: Image,
      color: "bg-purple-500",
      change: "DB",
    },
    {
      label: "Ibyiciro",
      value: stats.categoriesCount.toString(),
      icon: FolderTree,
      color: "bg-brand-600",
      change: `${cats.filter((c) => c.isActive).length} active`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink-900">
            Murakaza neza, Admin! 👋
          </h2>
          <p className="text-ink-400 text-sm mt-1">
            Hano ni ho ushobora gucunga inkuru, media, n'ibyiciro bya Umunsi.com
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors"
        >
          <PenSquare className="w-5 h-5" />
          Andika inkuru nshya
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 lg:p-6 border border-ink-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center text-white`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl lg:text-3xl font-black text-ink-900">
              {stat.value}
            </p>
            <p className="text-sm text-ink-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent posts */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-ink-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-ink-100">
            <h3 className="font-bold text-ink-900">Inkuru za vuba</h3>
            <Link
              href="/admin/posts"
              className="text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              Reba zose
            </Link>
          </div>
          <div className="divide-y divide-ink-50">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 hover:bg-ink-50/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-ink-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-ink-900 line-clamp-1">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-ink-400">
                    <span
                      className="font-bold"
                      style={{ color: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {post.featured && (
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">
                      Featured
                    </span>
                  )}
                  {post.published ? (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      Byasohotse
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-ink-400 bg-ink-50 px-2 py-1 rounded-lg">
                      Draft
                    </span>
                  )}
                </div>
              </div>
            ))}
            {recentPosts.length === 0 && (
              <div className="text-center py-12 text-ink-400 text-sm">
                Nta nkuru zabonetse.
              </div>
            )}
          </div>
        </div>

        {/* Quick stats sidebar */}
        <div className="space-y-6">
          {/* Views */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold">Amafatiro y'amaso</span>
            </div>
            <p className="text-4xl font-black">{stats.totalViews.toLocaleString()}</p>
            <p className="text-white/70 text-sm mt-1">Mu byiciro byose</p>
          </div>

          {/* Featured count */}
          <div className="bg-white rounded-2xl border border-ink-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-purple-500" />
              <span className="font-bold text-ink-900">Inkuru z'icyamamare</span>
            </div>
            <p className="text-4xl font-black text-ink-900">{recentPosts.filter((p) => p.featured).length}</p>
            <p className="text-ink-400 text-sm mt-1">Ziri kuri homepage slider</p>
          </div>

          {/* Categories quick view */}
          <div className="bg-white rounded-2xl border border-ink-100 p-6">
            <h3 className="font-bold text-ink-900 mb-4">Ibyiciro</h3>
            <div className="space-y-2">
              {cats.filter((c) => c.isActive).slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/admin/categories`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-ink-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-ink-700">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color || "#e5b60d" }}
                    />
                    {cat.name}
                  </span>
                  <span className="text-xs font-bold text-ink-400">
                    {cat._count?.news || 0} inkuru
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
