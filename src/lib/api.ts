const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";
const SERVER_BASE = "https://api.umunsi.com";

const HEADERS: HeadersInit = {
  "User-Agent": "UmunsiFrontend/1.0 (Next.js; +https://umunsi.com)",
  "Accept": "application/json",
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

function fixImageUrl(url: string | null | undefined): string {
  if (!url) return "https://images.unsplash.com/photo-1495020689067-958854a1dd38?w=1600&q=80";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SERVER_BASE}${url}`;
}

export interface ApiPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  status: string;
  isPremium: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  isFeatured: boolean;
  isPinned: boolean;
  allowComments: boolean;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  authorId: string;
  categoryId: string;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string;
    avatar: string | null;
    profileUrl: string | null;
    role: string;
    isVerified: boolean;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  };
  shareCount?: number;
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

interface PostsResponse {
  success: boolean;
  data: ApiPost[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

interface CategoriesResponse {
  success: boolean;
  categories: ApiCategory[];
}

interface SinglePostResponse {
  success: boolean;
  data: ApiPost;
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
    excerpt: post.excerpt || post.title,
    content: post.content || "",
    featured: post.isFeatured,
    published: post.status === "PUBLISHED",
    views: post.likeCount || 0,
    publishedAt: post.publishedAt || post.createdAt,
    createdAt: post.createdAt,
    category: {
      id: post.category?.id || "",
      slug: post.category?.slug || "uncategorized",
      name: post.category?.name || "Uncategorized",
      nameEn: post.category?.name || "",
      color: post.category?.color || "#e5b60d",
      icon: "Flame",
      description: "",
      order: 0,
    },
    author: {
      name: mapAuthorName(post.author),
      avatar: fixImageUrl(post.author?.avatar),
    },
    media: [],
    tags: Array.isArray(post.tags) ? post.tags : [],
    readTime: Math.max(3, Math.ceil((post.content || "").length / 1000)),
    coverImage: fixImageUrl(post.featuredImage),
  };
}

export const api = {
  getFeaturedPosts: (limit = 10) =>
    fetchAPI<PostsResponse>("/posts", { status: "PUBLISHED", limit: Math.max(limit * 3, 30), sortBy: "publishedAt", sortOrder: "desc" })
      .then((r) => (r.data || []).filter((p) => p.isFeatured).slice(0, limit)),

  getLatestPosts: (limit = 20, page = 1) =>
    fetchAPI<PostsResponse>("/posts", { status: "PUBLISHED", limit, page, sortBy: "publishedAt", sortOrder: "desc" })
      .then((r) => r.data || []),

  getPostsByCategory: async (categorySlug: string, limit = 20, page = 1) => {
    const categories = await api.getCategories();
    const cat = (categories as ApiCategory[]).find(
      (c) => c.slug.toLowerCase() === categorySlug.toLowerCase() ||
            c.name.toLowerCase() === categorySlug.toLowerCase()
    );
    if (!cat) return [];
    return fetchAPI<PostsResponse>("/posts", { status: "PUBLISHED", category: cat.id, limit, page, sortBy: "publishedAt", sortOrder: "desc" })
      .then((r) => r.data || []);
  },

  getPostBySlug: async (slug: string) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${slug}`, {
        headers: HEADERS,
        next: { revalidate: 300 },
      });
      if (!res.ok) return null;
      const data: SinglePostResponse = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  getTrendingPosts: (limit = 10) =>
    fetchAPI<PostsResponse>("/posts", { status: "PUBLISHED", limit: Math.max(limit * 5, 50), sortBy: "likeCount", sortOrder: "desc" })
      .then((r) => (r.data || []).slice(0, limit)),

  getCategories: async () => {
    const all: ApiCategory[] = [];
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages) {
      const r = await fetchAPI<CategoriesResponse & { pagination?: { totalPages: number } }>("/categories", { page, limit: 100 });
      if (r.categories) all.push(...r.categories);
      if (r.pagination?.totalPages) totalPages = r.pagination.totalPages;
      else break;
      page++;
    }
    return all;
  },

  searchPosts: (q: string, limit = 20) =>
    fetchAPI<PostsResponse>("/posts", { status: "PUBLISHED", search: q, limit, sortBy: "publishedAt", sortOrder: "desc" })
      .then((r) => r.data || []),

  getStats: async () => {
    const [postsRes, categories] = await Promise.all([
      fetchAPI<PostsResponse>("/posts", { status: "PUBLISHED", limit: 1, sortBy: "publishedAt", sortOrder: "desc" }),
      api.getCategories(),
    ]);
    const total = postsRes.pagination?.total || 0;
    const totalViews = (postsRes.data || []).reduce((sum, p) => sum + (p.likeCount || 0), 0);
    return {
      totalPosts: total,
      publishedCount: total,
      categoriesCount: (categories as ApiCategory[]).length,
      totalViews,
    };
  },

  getAllPosts: async (limit = 50, page = 1) => {
    return fetchAPI<PostsResponse>("/posts", { limit, page, sortBy: "publishedAt", sortOrder: "desc" })
      .then((r) => ({
        posts: r.data || [],
        pagination: r.pagination || { page, limit, total: 0, pages: 0 },
      }));
  },
};
