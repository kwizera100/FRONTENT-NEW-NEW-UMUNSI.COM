"use client";

import { useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { mapApiPost, type ApiPost } from "@/lib/api";
import type { Post } from "@/lib/data";

interface LoadMoreProps {
  initialPosts: Post[];
}

export function LoadMore({ initialPosts }: LoadMoreProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?status=PUBLISHED&limit=20&page=${page}&sortBy=publishedAt&sortOrder=desc`);
      const data = await res.json();
      const newPosts: ApiPost[] = data.data || [];
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts.map(mapApiPost)]);
        setPage((p) => p + 1);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {posts.map((p) => (
          <ArticleCard key={p.id} post={p} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-[#e5b60d] hover:bg-[#c9a00c] text-white font-bold rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Kurakura..." : "Reba inkuru zindi"}
          </button>
        </div>
      )}
    </div>
  );
}
