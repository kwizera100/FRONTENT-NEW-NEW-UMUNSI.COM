import { api } from "@/lib/api";

export const revalidate = 1800; // regenerate every 30 minutes

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://www.umunsi.com";
const FEED_URL = `${SITE_URL}/news-sitemap.xml`;
const PUB_NAME = "Umunsi";
const PUB_LANG = "rw";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Google News sitemap — required format for Google News / Publisher Center.
// Regular sitemap.xml does NOT qualify a site for Google News.
export async function GET() {
  let posts: any[] = [];
  try {
    posts = (await api.getLatestPosts(1000)) as any[];
  } catch {}

  const seen = new Set<string>();
  const urls = posts
    .filter((p) => p?.slug && p?.title)
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .map((p) => {
      const loc = `${SITE_URL}/article/${p.slug}`;
      const pubDate = p.publishedAt
        ? new Date(p.publishedAt).toUTCString()
        : new Date().toUTCString();
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${PUB_NAME}</news:name>
        <news:language>${PUB_LANG}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(p.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
