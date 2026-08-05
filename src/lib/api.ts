import { normalizeArticleMediaUrls, normalizeMediaUrl } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

const HEADERS: HeadersInit = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
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
  return normalizeMediaUrl(url);
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
  viewCount: number;
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
    bio: string | null;
    socialLinks: string | null;
    profileColor: string | null;
    coverImage: string | null;
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
  coAuthors?: string[];
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
  _count?: { news: number; posts: number; articles: number };
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
  const rawImage = post.featuredImage || (post as any).image || (post as any).cover || (post as any).thumbnail || null;
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || post.title,
    content: normalizeArticleMediaUrls(post.content || ""),
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
      icon: "Flame",
      description: "",
      order: 0,
    },
    author: {
      id: post.author?.id || post.authorId || "",
      username: post.author?.username || "",
      name: mapAuthorName(post.author),
      avatar: fixImageUrl(post.author?.avatar),
      bio: post.author?.bio || null,
      socialLinks: post.author?.socialLinks ? (typeof post.author.socialLinks === "string" ? JSON.parse(post.author.socialLinks) : post.author.socialLinks) : null,
      profileColor: post.author?.profileColor || "#e5b60d",
      coverImage: fixImageUrl(post.author?.coverImage),
    },
    media: [],
    tags: Array.isArray(post.tags) ? post.tags : [],
    readTime: Math.max(3, Math.ceil((post.content || "").length / 1000)),
    coverImage: fixImageUrl(rawImage),
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
      if (res.ok) {
        const data: SinglePostResponse = await res.json();
        if (data.data) return data.data;
      }

      // Fallback: search all posts and find by slug
      const allRes = await fetchAPI<PostsResponse>("/posts", { status: "PUBLISHED", limit: 100, sortBy: "publishedAt", sortOrder: "desc" });
      const posts = (allRes as PostsResponse).data || [];
      const found = posts.find((p) => p.slug === slug || p.id === slug);
      return found || null;
    } catch {
      return null;
    }
  },

  getTrendingPosts: (limit = 10) =>
    fetchAPI<PostsResponse>("/posts", { status: "PUBLISHED", limit: Math.max(limit * 5, 50), sortBy: "viewCount", sortOrder: "desc" })
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
    const totalViews = (postsRes.data || []).reduce((sum, p) => sum + (p.viewCount || p.likeCount || 0), 0);
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

  getAdminViewStats: async (range: "daily" | "monthly" | "yearly" | "2y" | "3y" | "5y" = "daily") => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("umunsi_admin_token") : null;
      const res = await fetch(`/api/analytics/admin/views?range=${encodeURIComponent(range)}`, {
        headers: {
          ...HEADERS,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  getAuthorByUsername: async (username: string) => {
    try {
      if (!username) return null;
      const res = await fetch(`${API_BASE}/users`, {
        headers: HEADERS,
        next: { revalidate: 60 },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const users = Array.isArray(data) ? data : data.data || data.users || [];
      const user = users.find((u: any) => u.username === username || u.id === username);
      if (user) return user;

      // If not found in users list, try fetching single user by ID
      try {
        const singleRes = await fetch(`${API_BASE}/users/${username}`, {
          headers: HEADERS,
          next: { revalidate: 60 },
        });
        if (singleRes.ok) {
          const singleData = await singleRes.json();
          return singleData.data || singleData.user || singleData;
        }
      } catch {}

      return null;
    } catch {
      return null;
    }
  },

  getPostsByAuthor: async (authorId: string, limit = 20): Promise<ApiPost[]> => {
    try {
      const res = await fetchAPI<PostsResponse>("/posts", { status: "PUBLISHED", authorId, limit, sortBy: "publishedAt", sortOrder: "desc" });
      return (res as PostsResponse).data || [];
    } catch {
      return [];
    }
  },

  updateProfile: async (profileData: Record<string, any>) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("umunsi_admin_token") : null;
      if (!token) throw new Error("Not authenticated");
      const userStr = typeof window !== "undefined" ? localStorage.getItem("umunsi_admin_user") : null;
      const userId = userStr ? JSON.parse(userStr).id : null;
      if (!userId) throw new Error("No user ID");

      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...HEADERS,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || "Failed to update profile");
      }
      const data = await res.json();
      return data.data || data.user || data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update profile");
    }
  },
};
