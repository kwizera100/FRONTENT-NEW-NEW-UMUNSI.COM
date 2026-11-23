import { api } from "@/lib/api";

export const revalidate = 1800; // regenerate every 30 minutes

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://www.umunsi.com";
const FEED_URL = `${SITE_URL}/rss.xml`;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

export async function GET() {
  let posts: any[] = [];
  try {
    posts = (await api.getLatestPosts(50)) as any[];
  } catch {}

  const lastBuild = new Date().toUTCString();
  const items = posts
    .filter((p) => p?.slug && p?.title)
    .map((p) => {
      const link = `${SITE_URL}/article/${p.slug}`;
      const pubDate = p.publishedAt
        ? new Date(p.publishedAt).toUTCString()
        : "";
      const desc = p.excerpt
        ? escapeXml(p.excerpt)
        : escapeXml(stripHtml(p.content || p.description || ""));
      const image = p.coverImage
        ? `      <enclosure url="${escapeXml(
            p.coverImage.startsWith("http")
              ? p.coverImage
              : `https://api.umunsi.com${p.coverImage}`
          )}" type="image/jpeg" />\n`
        : "";
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${desc}</description>${image}${pubDate ? `\n      <pubDate>${pubDate}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Umunsi — Inkuru za Rwanda</title>
    <link>${SITE_URL}</link>
    <description>Inkuru za Rwanda na ku isi — Umunsi News Rwanda</description>
    <language>rw-RW</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
