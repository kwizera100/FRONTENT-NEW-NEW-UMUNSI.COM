import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function extractMeta(html: string, url: string) {
  const get = (prop: string) => {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i"
    );
    const m = html.match(re);
    return m ? m[1].trim() : null;
  };

  const title =
    get("og:title") ||
    (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "").trim() ||
    null;
  const description =
    get("og:description") ||
    get("description") ||
    get("twitter:description") ||
    null;
  let image =
    get("og:image") ||
    get("og:image:url") ||
    get("twitter:image") ||
    get("twitter:image:src") ||
    null;
  const siteName = get("og:site_name") || null;
  const card = get("twitter:card") || null;

  // Make image absolute
  if (image && !image.startsWith("http")) {
    try {
      image = new URL(image, url).href;
    } catch {
      // leave as-is
    }
  }

  let domain = "Link";
  try {
    domain = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // keep default
  }

  return { title, description, image, siteName, domain, card };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Only http/https URLs allowed" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(parsed.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,fr;q=0.8,rw;q=0.7",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    const contentType = res.headers.get("content-type") || "";
    const finalUrl = res.url || parsed.href;

    // If it's an image, return image preview
    if (contentType.startsWith("image/")) {
      return NextResponse.json({
        url: finalUrl,
        title: null,
        description: null,
        image: finalUrl,
        siteName: null,
        domain: parsed.hostname.replace(/^www\./, ""),
        card: "image",
      });
    }

    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return NextResponse.json({
        url: finalUrl,
        title: parsed.hostname.replace(/^www\./, ""),
        description: null,
        image: null,
        siteName: null,
        domain: parsed.hostname.replace(/^www\./, ""),
        card: null,
      });
    }

    const html = await res.text();
    const meta = extractMeta(html, finalUrl);

    return NextResponse.json({
      url: finalUrl,
      ...meta,
    });
  } catch (error) {
    // Fallback: return basic info
    return NextResponse.json({
      url: parsed.href,
      title: parsed.hostname.replace(/^www\./, ""),
      description: null,
      image: null,
      siteName: null,
      domain: parsed.hostname.replace(/^www\./, ""),
      card: null,
    });
  }
}
