import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import type { Post } from "@/lib/data";
import { formatTimeAgo } from "@/lib/utils";

interface ArticleCardProps {
  post: Post;
  variant?: "default" | "horizontal" | "compact" | "large";
  priority?: boolean;
}

export function ArticleCard({ post, variant = "default", priority = false }: ArticleCardProps) {
  if (variant === "horizontal") {
    return (
      <Link
        href={`/article/${post.slug}`}
        className="group flex gap-4 items-start"
      >
        <div className="relative w-28 h-20 sm:w-36 sm:h-24 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="150px"
            priority={priority}
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: post.category.color || "#e5b60d" }}
          >
            {post.category.name}
          </span>
          <h3 className="font-bold text-sm lg:text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 mt-1 font-display">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(post.publishedAt)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/article/${post.slug}`}
        className="group flex gap-3 items-center py-2"
      >
        <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="64px"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display">
            {post.title}
          </h3>
          <span className="text-xs text-gray-500">{formatTimeAgo(post.publishedAt)}</span>
        </div>
      </Link>
    );
  }

  if (variant === "large") {
    return (
      <Link href={`/article/${post.slug}`} className="group block">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl mb-4">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: post.category.color || "#e5b60d" }}
            >
              {post.category.name}
            </span>
          </div>
        </div>
        <h2 className="text-xl lg:text-2xl font-black text-gray-900 group-hover:text-[#e5b60d] transition-colors mb-2 line-clamp-2 font-display">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm lg:text-base line-clamp-2 mb-3">{post.excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{post.author.name}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatTimeAgo(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {post.views.toLocaleString()}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${post.slug}`} className="group block">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl mb-3">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: post.category.color || "#e5b60d" }}
          >
            {post.category.name}
          </span>
        </div>
      </div>
      <h3 className="font-bold text-base lg:text-lg text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 mb-2 font-display">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="font-semibold text-gray-800">{post.author.name}</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatTimeAgo(post.publishedAt)}
        </span>
      </div>
    </Link>
  );
}
