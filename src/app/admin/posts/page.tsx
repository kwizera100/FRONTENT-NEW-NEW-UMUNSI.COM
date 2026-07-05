"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  PenSquare,
  Eye,
  Trash2,
  Star,
  Filter,
  Clock,
  Loader2,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import type { ApiPost, ApiCategory } from "@/lib/api";

export default function AdminPostsPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "50",
        page: String(page),
        sortBy: "publishedAt",
        sortOrder: "desc",
      });
      if (filterCat !== "all") {
        const cat = categories.find((c) => c.slug === filterCat);
        if (cat) params.set("category", cat.id);
      }
      if (search) params.set("search", search);

      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(data.data || []);
      if (data.pagination) {
        setTotalPages(data.pagination.pages || 1);
        setTotal(data.pagination.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filterCat, search, categories]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchPosts();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, filterCat, fetchPosts, page]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink-900">Inkuru zose</h2>
          <p className="text-ink-400 text-sm mt-1">
            {total.toLocaleString()} inkuru zose
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Shakisha inkuru..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none bg-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none bg-white font-semibold text-sm cursor-pointer"
          >
            <option value="all">Ibyiciro byose</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider px-5 py-3">
                  Inkuru
                </th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                  Icyiciro
                </th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                  Uumwanditsi
                </th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                  Amafatiro
                </th>
                <th className="text-left text-xs font-bold text-ink-500 uppercase tracking-wider px-5 py-3">
                  Imiterere
                </th>
                <th className="text-right text-xs font-bold text-ink-500 uppercase tracking-wider px-5 py-3">
                  Ibikorwa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
                    <p className="text-sm text-ink-400 mt-3">Birimo gukuramo inkuru...</p>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-ink-400">
                    Nta nkuru zabonetse. Ongera ushakishe.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-ink-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-ink-100">
                          {post.featuredImage && (
                            <img
                              src={post.featuredImage.startsWith("http") ? post.featuredImage : `https://api.umunsi.com${post.featuredImage}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-ink-900 line-clamp-1">
                            {post.title}
                          </p>
                          <p className="text-xs text-ink-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(post.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg text-white"
                        style={{ backgroundColor: post.category?.color || "#e5b60d" }}
                      >
                        {post.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-ink-700">
                        {[post.author?.firstName, post.author?.lastName].filter(Boolean).join(" ") || post.author?.username || "Umunsi"}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-sm font-semibold text-ink-700 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-ink-400" />
                        {(post.likeCount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {post.isFeatured && (
                          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg flex items-center gap-1">
                            <Star className="w-3 h-3" /> Featured
                          </span>
                        )}
                        {post.status === "PUBLISHED" ? (
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            Byasohotse
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-ink-400 bg-ink-50 px-2 py-1 rounded-lg">
                            Draft
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/article/${post.slug}`}
                          className="p-2 rounded-lg hover:bg-ink-100 text-ink-500 hover:text-ink-900 transition-colors"
                          title="Reba"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-2 rounded-lg hover:bg-blue-50 text-ink-500 hover:text-blue-600 transition-colors"
                          title="Hindura"
                        >
                          <PenSquare className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 rounded-lg hover:bg-red-50 text-ink-500 hover:text-red-600 transition-colors"
                          title="Siba"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-ink-100">
            <span className="text-sm text-ink-400">
              Paji {page} ya {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-2 rounded-lg border border-ink-200 text-sm font-bold text-ink-700 hover:bg-ink-50 disabled:opacity-50 transition-colors"
              >
                Ibanjirije
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-4 py-2 rounded-lg border border-ink-200 text-sm font-bold text-ink-700 hover:bg-ink-50 disabled:opacity-50 transition-colors"
              >
                Ikurikira
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
