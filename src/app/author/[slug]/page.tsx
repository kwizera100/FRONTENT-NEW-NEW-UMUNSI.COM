import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Globe, ArrowLeft, FileText, Calendar, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import { SmartImage } from "@/components/home/SmartImage";
import { AuthorAvatar } from "@/components/article/AuthorAvatar";
import { api, mapApiPost, type ApiCategory } from "@/lib/api";
import { normalizeMediaUrl } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 300;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await api.getAuthorByUsername(params.slug);
  if (!author) return { title: "Author not found | Umunsi.com" };

  const name = [author.firstName, author.lastName].filter(Boolean).join(" ") || author.username;
  const avatar = author.avatar ? normalizeMediaUrl(author.avatar) : undefined;

  // Decode profile extras from profileUrl
  let decodedBio = "";
  try {
    const rawUrl = (author as any).profileUrl || "";
    if (rawUrl && rawUrl.startsWith("https://umunsi.com/_p/")) {
      const b64 = rawUrl.replace("https://umunsi.com/_p/", "");
      const json = typeof Buffer !== "undefined"
        ? Buffer.from(b64, "base64").toString("utf-8")
        : decodeURIComponent(escape(atob(b64)));
      const extras = JSON.parse(json);
      decodedBio = extras.bio || "";
    }
  } catch {}
  const bio = decodedBio || author.bio || `Articles by ${name} on Umunsi.com`;

  return {
    title: `${name} | Umunsi.com`,
    description: bio,
    openGraph: {
      type: "profile",
      title: `${name} | Umunsi.com`,
      description: bio,
      ...(avatar ? { images: [{ url: avatar, width: 400, height: 400, alt: name }] } : {}),
    },
    twitter: {
      card: "summary",
      title: `${name} | Umunsi.com`,
      description: bio,
      ...(avatar ? { images: [avatar] } : {}),
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const [author, categories] = await Promise.all([
    api.getAuthorByUsername(params.slug),
    api.getCategories(),
  ]);

  const allCats = (categories as ApiCategory[]) || [];

  // If author not found, show a fallback page with author name
  if (!author) {
    const fallbackName = params.slug
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    // Try to fetch articles by this author slug even without profile
    let fallbackPosts: any[] = [];
    try {
      const postsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api"}/posts?authorUsername=${encodeURIComponent(params.slug)}&status=PUBLISHED&limit=20`, {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
        next: { revalidate: 60 },
      });
      if (postsRes.ok) {
        const data = await postsRes.json();
        fallbackPosts = data.data || [];
      }
    } catch {}

    const mappedFallback = fallbackPosts.map((p) => mapApiPost(p));

    return (
      <>
        <Header categories={allCats} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] flex items-center justify-center text-white font-black text-4xl mx-auto mb-4">
                  {fallbackName.charAt(0)}
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">{fallbackName}</h1>
                <p className="text-gray-500 mb-2">Author at Umunsi.com</p>
              </div>

              {mappedFallback.length > 0 ? (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-1.5 h-8 rounded-full bg-[#e5b60d]" />
                    <h2 className="text-xl lg:text-2xl font-black text-gray-900">
                      Articles by {fallbackName}
                    </h2>
                    <span className="text-sm font-bold text-gray-400">({mappedFallback.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mappedFallback.map((post) => (
                      <ArticleCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">No articles found for this author.</p>
              )}

              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e5b60d] hover:bg-[#c9a00c] text-white font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const name = [author.firstName, author.lastName].filter(Boolean).join(" ") || author.username;

  // Decode profile extras from profileUrl (carried publicly via the posts API).
  // Format: https://umunsi.com/_p/<base64-json>
  let decodedExtras: any = {};
  try {
    const rawUrl = (author as any).profileUrl || "";
    if (rawUrl && rawUrl.startsWith("https://umunsi.com/_p/")) {
      const b64 = rawUrl.replace("https://umunsi.com/_p/", "");
      const json = typeof Buffer !== "undefined"
        ? Buffer.from(b64, "base64").toString("utf-8")
        : decodeURIComponent(escape(atob(b64)));
      decodedExtras = JSON.parse(json);
    }
  } catch {}

  const accent = decodedExtras.profileColor || author.profileColor || "#e5b60d";
  const rawAvatar = author.avatar;
  const avatar = rawAvatar ? normalizeMediaUrl(rawAvatar) : null;
  const rawCover = decodedExtras.coverImage || author.coverImage;
  const coverImage = rawCover ? normalizeMediaUrl(rawCover) : null;
  const coverPosition = decodedExtras.coverPosition || author.coverPosition || 50;
  const bio = decodedExtras.bio || author.bio || "";
  const rawSocial = decodedExtras.socialLinks || author.socialLinks;
  const socialLinks = rawSocial
    ? (typeof rawSocial === "string" ? JSON.parse(rawSocial) : rawSocial)
    : {};

  const posts = await api.getPostsByAuthor(author.id, 20);
  const mappedPosts = posts.map((p) => mapApiPost(p));

  const memberSince = author.createdAt ? new Date(author.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : null;
  const articleCount = (author as any)._count?.posts ?? mappedPosts.length;

  const hasAnySocial = socialLinks.facebook || socialLinks.twitter || socialLinks.linkedin || socialLinks.instagram || socialLinks.website || socialLinks.studentProfile || socialLinks.writerProfile;

  return (
    <>
      <Header categories={allCats} />

      <main>
        {/* Author Hero — CNN-style: left text, right portrait */}
        <section className="py-10 lg:py-14">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                {/* Left: name, role, bio */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-gray-900 mb-2">
                    {name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    {author.role === 'ADMIN' ? 'Editor' : author.role === 'EDITOR' ? 'Editor' : 'Author'}, Umunsi English
                  </p>

                  {/* Bio excerpt — always visible */}
                  {bio && (
                    <div className="max-w-xl">
                      <p className="text-gray-700 text-base sm:text-lg leading-8 line-clamp-3">{bio}</p>
                      {bio.length > 180 && (
                        <details className="mt-2">
                          <summary className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold cursor-pointer transition-colors select-none">
                            Read Full Bio
                          </summary>
                          <p className="text-gray-700 text-base sm:text-lg leading-8 whitespace-pre-line mt-3">{bio}</p>
                        </details>
                      )}
                    </div>
                  )}

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: accent }}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {articleCount} {articleCount === 1 ? 'Article' : 'Articles'}
                    </span>
                    {memberSince && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        Since {memberSince}
                      </span>
                    )}
                  </div>

                  {/* Social links */}
                  {hasAnySocial && (
                    <div className="flex flex-wrap items-center gap-2 mt-5">
                      {socialLinks.facebook && (
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110" style={{ backgroundColor: "#1877f2" }} title="Facebook">
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110" style={{ backgroundColor: "#000" }} title="X">
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110" style={{ backgroundColor: "#0a66c2" }} title="LinkedIn">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110" style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }} title="Instagram">
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.website && (
                        <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110" style={{ backgroundColor: accent }} title="Website">
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.writerProfile && (
                        <a href={socialLinks.writerProfile} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors" title="Writer profile">
                          <img src="/images/umunsimedia-logo.jpg" alt="Writer" className="w-4 h-4 object-contain" /> Writer
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: portrait */}
                <div className="w-full lg:w-96 shrink-0">
                  <div className="relative w-full aspect-[4/5] max-h-[480px] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                    <AuthorAvatar
                      src={avatar}
                      name={name}
                      color={accent}
                      className="w-full h-full object-cover"
                      textClassName="text-7xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles — CNN-style horizontal rows */}
        <section className="pb-10 lg:pb-16">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-1.5 h-10 rounded-full" style={{ backgroundColor: accent }} />
                <h2 className="text-xl lg:text-2xl font-black font-display text-gray-900">
                  Articles by {name}
                </h2>
                <span className="text-sm font-bold text-gray-400">({articleCount})</span>
              </div>

              {mappedPosts.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No articles published yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {mappedPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/article/${post.slug}`}
                      className="group flex gap-4 sm:gap-6 py-5 first:pt-0 items-start"
                    >
                      <div className="relative w-28 h-20 sm:w-44 sm:h-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <SmartImage
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 112px, 176px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: post.category.color || accent }}>
                          {post.category.name}
                        </span>
                        <h3 className="font-bold text-base sm:text-xl text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 mt-1 font-display">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1 hidden sm:block">{post.excerpt}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-10 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
