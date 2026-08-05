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
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDirs: ["umunsi-backend"],
  },
};

export default nextConfig;
