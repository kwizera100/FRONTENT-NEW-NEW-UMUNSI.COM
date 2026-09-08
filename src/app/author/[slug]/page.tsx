import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Globe, ArrowLeft, FileText, Calendar, PenLine } from "lucide-react";
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
  const bio = author.bio || `Articles by ${name} on Umunsi.com`;

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
  const accent = author.profileColor || "#e5b60d";
  const rawAvatar = author.avatar;
  const avatar = rawAvatar ? normalizeMediaUrl(rawAvatar) : null;
  const rawCover = author.coverImage;
  const coverImage = rawCover ? normalizeMediaUrl(rawCover) : null;
  const coverPosition = author.coverPosition || 50;
  const bio = author.bio || "";
  const socialLinks = author.socialLinks
    ? (typeof author.socialLinks === "string" ? JSON.parse(author.socialLinks) : author.socialLinks)
    : {};

  const posts = await api.getPostsByAuthor(author.id, 20);
  const mappedPosts = posts.map((p) => mapApiPost(p));

  const memberSince = author.createdAt ? new Date(author.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : null;
  const articleCount = mappedPosts.length;

  const hasAnySocial = socialLinks.facebook || socialLinks.twitter || socialLinks.linkedin || socialLinks.instagram || socialLinks.website || socialLinks.studentProfile || socialLinks.writerProfile;

  return (
    <>
      <Header categories={allCats} />

      <main>
        {/* Author Hero */}
        <div className="relative">
          {/* Cover */}
          <div className="relative h-56 sm:h-72 lg:h-96 overflow-hidden">
            {coverImage ? (
              <SmartImage src={coverImage} alt={name} fill sizes="100vw" className="object-cover" style={{ objectPosition: `center ${coverPosition}%` }} priority />
            ) : (
              <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)` }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Profile Section */}
          <div className="px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative">
            <div className="max-w-5xl mx-auto">
              {/* Main profile card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-6">
                    {/* Avatar */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl shrink-0 -mt-16 sm:-mt-20">
                      <AuthorAvatar
                        src={avatar}
                        name={name}
                        color={accent}
                        className="w-full h-full rounded-full"
                        textClassName="text-5xl sm:text-6xl"
                      />
                    </div>

                    {/* Name + role */}
                    <div className="flex-1 pb-2">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display" style={{ color: accent }}>{name}</h1>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: accent }}
                        >
                          <PenLine className="w-3 h-3" />
                          Author at Umunsi.com
                        </span>
                        {memberSince && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                            <Calendar className="w-3 h-3" />
                            Since {memberSince}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats badge */}
                    <div className="flex items-center gap-3 pb-2">
                      <div
                        className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                      >
                        <FileText className="w-5 h-5 mb-1" />
                        <span className="text-2xl font-black leading-none">{articleCount}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide mt-0.5">Articles</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio - shown in profile card */}
                  {bio && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h2 className="text-sm font-black uppercase tracking-wide text-gray-400 mb-3">About</h2>
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <p className="text-gray-700 text-base sm:text-lg leading-8 whitespace-pre-line">
                          {bio}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Social Links - grouped in a card */}
                  {hasAnySocial && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h2 className="text-sm font-black uppercase tracking-wide text-gray-400 mb-3">Connect</h2>
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* Student platform */}
                          {socialLinks.studentProfile && (
                            <a
                              href={socialLinks.studentProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all hover:shadow-md"
                              title="Student profile"
                            >
                              <img src="/images/student-umunsi-logo.png" alt="Student" className="w-6 h-6 object-contain" />
                              <span className="text-sm font-bold text-gray-700">Student</span>
                            </a>
                          )}
                          {/* Writer platform */}
                          {socialLinks.writerProfile && (
                            <a
                              href={socialLinks.writerProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all hover:shadow-md"
                              title="Writer profile"
                            >
                              <img src="/images/umunsimedia-logo.jpg" alt="Writer" className="w-6 h-6 object-contain" />
                              <span className="text-sm font-bold text-gray-700">Writer</span>
                            </a>
                          )}
                          {/* Social icons */}
                          {(socialLinks.facebook || socialLinks.twitter || socialLinks.linkedin || socialLinks.instagram || socialLinks.website) && (
                            <div className="flex items-center gap-2">
                              {socialLinks.facebook && (
                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg" style={{ backgroundColor: "#1877f2" }} title="Facebook">
                                  <Facebook className="w-5 h-5" />
                                </a>
                              )}
                              {socialLinks.twitter && (
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg" style={{ backgroundColor: "#000000" }} title="X (Twitter)">
                                  <Twitter className="w-5 h-5" />
                                </a>
                              )}
                              {socialLinks.linkedin && (
                                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg" style={{ backgroundColor: "#0a66c2" }} title="LinkedIn">
                                  <Linkedin className="w-5 h-5" />
                                </a>
                              )}
                              {socialLinks.instagram && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg" style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }} title="Instagram">
                                  <Instagram className="w-5 h-5" />
                                </a>
                              )}
                              {socialLinks.website && (
                                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg" style={{ backgroundColor: accent }} title="Website">
                                  <Globe className="w-5 h-5" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles */}
        <section className="py-10 lg:py-16">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-1.5 h-10 rounded-full" style={{ backgroundColor: accent }} />
                <h2 className="text-xl lg:text-2xl font-black font-display" style={{ color: accent }}>
                  Articles by {name}
                </h2>
                <span className="text-sm font-bold text-gray-400">({articleCount})</span>
              </div>

              {mappedPosts.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No articles published yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mappedPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
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
