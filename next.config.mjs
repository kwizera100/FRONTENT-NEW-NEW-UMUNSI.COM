/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    formats: ["image/webp", "image/avif"],
    // Disable Vercel image optimization — it returns 402 Payment Required
    // on the free plan. We use plain <img> tags instead of next/image.
    unoptimized: true,
  },
  async redirects() {
    return [
      // Redirect old article URLs to /article/slug
      { source: "/post/:slug", destination: "/article/:slug", permanent: true },
      { source: "/posts/:slug", destination: "/article/:slug", permanent: true },
      { source: "/news/:slug", destination: "/article/:slug", permanent: true },
      { source: "/story/:slug", destination: "/article/:slug", permanent: true },
      { source: "/article/news/:slug", destination: "/article/:slug", permanent: true },
      { source: "/blog/:slug", destination: "/article/:slug", permanent: true },
      { source: "/p/:slug", destination: "/article/:slug", permanent: true },
      { source: "/read/:slug", destination: "/article/:slug", permanent: true },
      // Handle /post/ with subcategories
      { source: "/post/:category/:slug", destination: "/article/:slug", permanent: true },
      { source: "/posts/:category/:slug", destination: "/article/:slug", permanent: true },
      { source: "/news/:category/:slug", destination: "/article/:slug", permanent: true },
      // Redirect /profile to /admin/profile
      { source: "/profile", destination: "/admin/profile", permanent: true },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      // Public content: CDN-cacheable so Cloudflare/Vercel serve most page
      // views without executing server code. HTML revalidates every minute.
      {
        source: "/article/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" },
        ],
      },
      {
        source: "/category/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" },
        ],
      },
      {
        source: "/author/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=600" },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
