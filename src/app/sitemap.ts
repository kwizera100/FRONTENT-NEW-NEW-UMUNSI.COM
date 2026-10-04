import type { MetadataRoute } from "next";
import { api } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.umunsi.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/categories`, changeFrequency: "daily", priority: 0.7 },
  ];

  try {
    const posts = await api.getLatestPosts(1000);
    const seen = new Set<string>();
    for (const p of posts as any[]) {
      if (!p?.slug || seen.has(p.slug)) continue;
      seen.add(p.slug);
      entries.push({
        url: `${SITE_URL}/article/${p.slug}`,
        lastModified: p.updatedAt || p.publishedAt || p.createdAt,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
    const categories = await api.getCategories().catch(() => []);
    for (const c of categories as any[]) {
      if (!c?.slug) continue;
      entries.push({
        url: `${SITE_URL}/category/${c.slug}`,
        changeFrequency: "hourly",
        priority: 0.7,
      });
    }
  } catch {}

  return entries;
}
