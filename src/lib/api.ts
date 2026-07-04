const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

const HEADERS: HeadersInit = {
  "User-Agent": "UmunsiFrontend/1.0 (Next.js; +https://umunsi.com)",
  "Accept": "application/json",
  "Content-Type": "application/json",
};

async function fetchAPI<T = any>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  try {
    const res = await fetch(url.toString(), {
      headers: HEADERS,
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`API error ${res.status}: ${endpoint}`);
      return [] as unknown as T;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return [] as unknown as T;
  }
}

export interface ApiPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  likeCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  isTrending: boolean;
  authorId: string;
  categoryId: string;
  author: {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
    icon: string | null;
    description?: string | null;
  };
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { news: number };
}

export interface NewsResponse {
  success: boolean;
  news: ApiPost[];
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface CategoriesResponse {
  success: boolean;
  categories: ApiCategory[];
}

function mapAuthorName(author: ApiPost["author"]): string {
  const parts = [author?.firstName, author?.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : author?.username || "Umunsi";
}

export function mapApiPost(post: ApiPost) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content || "",
    featured: post.isFeatured,
    published: post.status === "PUBLISHED",
    views: post.viewCount || post.likeCount || 0,
    publishedAt: post.publishedAt || post.createdAt,
    createdAt: post.createdAt,
    category: {
      id: post.category?.id || "",
      slug: post.category?.slug || "uncategorized",
      name: post.category?.name || "Uncategorized",
      nameEn: post.category?.name || "",
      color: post.category?.color || "#e5b60d",
      icon: post.category?.icon || "Flame",
      description: post.category?.description || "",
      order: 0,
    },
    author: {
      name: mapAuthorName(post.author),
    },
    media: [],
    tags: [],
    readTime: 5,
    coverImage: post.featuredImage || "https://images.unsplash.com/photo-1495020689067-958854a1dd38?w=1600&q=80",
  };
}

export const api = {
  getFeaturedNews: (limit = 10) =>
    fetchAPI<NewsResponse>("/news/featured", { limit }).then((r) => r.news || []),

  getBreakingNews: (limit = 10) =>
    fetchAPI<NewsResponse>("/news/breaking", { limit }).then((r) => r.news || []),

  getTrendingNews: (limit = 10) =>
    fetchAPI<NewsResponse>("/news/trending", { limit }).then((r) => r.news || []),

  getLatestNews: (limit = 20, page = 1) =>
    fetchAPI<NewsResponse>("/news", { status: "PUBLISHED", limit, page }).then((r) => r.news || []),

  getNewsByCategory: (categorySlug: string, limit = 20, page = 1) =>
    fetchAPI<NewsResponse>("/news", { status: "PUBLISHED", category: categorySlug, limit, page }).then((r) => r.news || []),

  getNewsById: (id: string) =>
    fetchAPI<{ success: boolean; news: ApiPost }>(`/news/${id}`).then((r) => r.news || null),

  getCategories: () =>
    fetchAPI<CategoriesResponse>("/categories").then((r) => r.categories || []),

  getAdsBanners: () =>
    fetchAPI("/ads-banners"),

  searchNews: (q: string, limit = 20) =>
    fetchAPI<NewsResponse>("/news", { status: "PUBLISHED", search: q, limit }).then((r) => r.news || []),
};
