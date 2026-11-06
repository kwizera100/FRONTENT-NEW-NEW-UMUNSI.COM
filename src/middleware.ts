import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Bad-bot filter. Verified search engines and link-preview crawlers are NOT
// listed, so Googlebot/AdsBot-Google/Bingbot/WhatsApp/Telegram previews pass.
// Mirrors the nginx rule on api.umunsi.com.
const BAD_BOT_RE =
  /(sqlmap|nikto|nmap|masscan|zgrab|nuclei|wpscan|acunetix|nessus|openvas|dirbuster|gobuster|wfuzz|hydra|metasploit|gptbot|chatgpt-user|claudebot|claude-web|ccbot|bytespider|amazonbot|diffbot|imagesiftbot|timpibot|omgili|dataforseo|scrapy|python-requests|python-urllib|go-http-client|libwww|httpclient|httpie|curl\/|wget\/)/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  if (!ua || BAD_BOT_RE.test(ua)) {
    return new NextResponse(null, { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // All pages; skip static assets, images, and API routes (API is already
    // protected at the VPS nginx layer).
    "/((?!_next/static|_next/image|images|favicon.ico|api/).*)",
  ],
};
