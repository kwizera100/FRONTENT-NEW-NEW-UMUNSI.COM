import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Globe, ArrowRight } from "lucide-react";
import type { Post } from "@/lib/data";
import { normalizeMediaUrl } from "@/lib/utils";
import { AuthorAvatar } from "@/components/article/AuthorAvatar";

interface AuthorCardProps {
  author: Post["author"];
}

export function AuthorCard({ author }: AuthorCardProps) {
  const accent = author.profileColor || "#e5b60d";
  const socialLinks = author.socialLinks || {};
  const hasSocial = socialLinks.facebook || socialLinks.twitter || socialLinks.linkedin || socialLinks.instagram || socialLinks.website;
  const authorSlug = author.username || author.id;
  const avatar = normalizeMediaUrl(author.avatar);

  return (
    <div className="mt-8 lg:mt-12 rounded-2xl overflow-hidden border border-gray-200" style={{ borderTopColor: accent, borderTopWidth: "4px" }}>
      <div className="bg-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <Link href={`/author/${authorSlug}`} className="shrink-0 group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden" style={{ boxShadow: `0 0 0 4px ${accent}` }}>
              <AuthorAvatar
                src={avatar}
                name={author.name}
                color={accent}
                className="w-full h-full rounded-full"
                textClassName="text-2xl sm:text-3xl"
              />
            </div>
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/author/${authorSlug}`}>
              <h3 className="text-xl font-black transition-colors font-display" style={{ color: accent }}>
                {author.name}
              </h3>
            </Link>
            <p className="text-sm font-bold uppercase tracking-wide mt-0.5" style={{ color: accent }}>
              Author
            </p>

            {author.bio && (
              <p className="text-gray-600 text-sm mt-3 leading-6 line-clamp-2">
                {author.bio}
              </p>
            )}

            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <Link
                href={`/author/${authorSlug}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: accent }}
              >
                Read More <ArrowRight className="w-4 h-4" />
              </Link>

              {hasSocial && (
                <div className="flex items-center gap-2">
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
        </div>
      </div>
    </div>
  );
}
