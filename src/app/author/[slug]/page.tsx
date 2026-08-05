import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Globe, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import { SmartImage } from "@/components/home/SmartImage";
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
  const avatar = normalizeMediaUrl(author.avatar);
  const bio = author.bio || `Articles by ${name} on Umunsi.com`;

  return {
    title: `${name} | Umunsi.com`,
    description: bio,
    openGraph: {
      type: "profile",
      title: `${name} | Umunsi.com`,
      description: bio,
      images: [{ url: avatar, width: 400, height: 400, alt: name }],
    },
    twitter: {
      card: "summary",
      title: `${name} | Umunsi.com`,
      description: bio,
      images: [avatar],
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const [author, categories] = await Promise.all([
    api.getAuthorByUsername(params.slug),
    api.getCategories(),
  ]);

  const allCats = (categories as ApiCategory[]) || [];

  // If author not found, show a fallback page instead of 404
  if (!author) {
    const fallbackName = params.slug
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return (
      <>
        <Header categories={allCats} />
        <main>
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] flex items-center justify-center text-white font-black text-4xl mx-auto mb-6">
                {fallbackName.charAt(0)}
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">{fallbackName}</h1>
              <p className="text-gray-500 mb-6">
                Author profile is being updated. Please check back later.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e5b60d] hover:bg-[#c9a00c] text-white font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Homepage
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const name = [author.firstName, author.lastName].filter(Boolean).join(" ") || author.username;
  const accent = author.profileColor || "#e5b60d";
  const avatar = normalizeMediaUrl(author.avatar);
  const coverImage = normalizeMediaUrl(author.coverImage);
  const bio = author.bio || "";
  const socialLinks = author.socialLinks
    ? (typeof author.socialLinks === "string" ? JSON.parse(author.socialLinks) : author.socialLinks)
    : {};

  const posts = await api.getPostsByAuthor(author.id, 20);
  const mappedPosts = posts.map((p) => mapApiPost(p));

  return (
    <>
      <Header categories={allCats} />

      <main>
        {/* Author Hero */}
        <div className="relative">
          {/* Cover */}
          <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
            {coverImage && coverImage !== normalizeMediaUrl(null) ? (
              <SmartImage src={coverImage} alt={name} fill sizes="100vw" className="object-cover" priority />
            ) : (
              <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)` }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          {/* Profile */}
          <div className="px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl shrink-0">
                  {avatar && avatar !== normalizeMediaUrl(null) ? (
                    <SmartImage src={avatar} alt={name} fill sizes="160px" className="object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-black text-5xl sm:text-6xl"
                      style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
                    >
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name + social */}
                <div className="flex-1 pb-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 font-display">{name}</h1>
                  <p className="text-sm font-bold uppercase tracking-wide mt-1" style={{ color: accent }}>
                    Author at Umunsi.com
                  </p>

                  {(socialLinks.facebook || socialLinks.twitter || socialLinks.linkedin || socialLinks.instagram || socialLinks.website) && (
                    <div className="flex items-center gap-2 mt-3">
                      {socialLinks.facebook && (
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:opacity-80" style={{ backgroundColor: accent }}>
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:opacity-80" style={{ backgroundColor: accent }}>
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:opacity-80" style={{ backgroundColor: accent }}>
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:opacity-80" style={{ backgroundColor: accent }}>
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.website && (
                        <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:opacity-80" style={{ backgroundColor: accent }}>
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {bio && (
                <div className="mt-6 max-w-3xl pl-4 border-l-4" style={{ borderColor: accent }}>
                  <p className="text-gray-700 text-base sm:text-lg leading-7 whitespace-pre-line">
                    {bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Articles */}
        <section className="py-8 lg:py-12" style={{ borderTop: `3px solid ${accent}` }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: accent }} />
                <h2 className="text-xl lg:text-2xl font-black font-display" style={{ color: accent }}>
                  Articles by {name}
                </h2>
                <span className="text-sm font-bold text-gray-400">({mappedPosts.length})</span>
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

              <div className="mt-8">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 transition-colors" style={{ color: accent }}>
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
