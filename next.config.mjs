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
      // Redirect old category-based article URLs to /article/slug
      // Update these patterns once you confirm the exact old URL structure
      { source: "/news/:slug", destination: "/article/:slug", permanent: true },
      { source: "/posts/:slug", destination: "/article/:slug", permanent: true },
      { source: "/story/:slug", destination: "/article/:slug", permanent: true },
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
