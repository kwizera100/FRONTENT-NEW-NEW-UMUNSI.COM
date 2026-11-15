import Link from "next/link";
import { Clock, Megaphone } from "lucide-react";
import type { Post } from "@/lib/data";
import { formatTimeAgo } from "@/lib/utils";
import { SmartImage } from "@/components/home/SmartImage";

interface EntertainmentSectionProps {
  entertainment: Post[];
  amatangazo: Post[];
}

export function EntertainmentSection({ entertainment, amatangazo }: EntertainmentSectionProps) {
  if (entertainment.length === 0) return null;

  const color = "#e5b60d";
  const main = entertainment[0];
  const secondary = entertainment[1];
  const fillCards = entertainment.slice(2, 6);

  return (
    <section className="py-8 lg:py-10 bg-white border-t border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center justify-between mb-4 pb-3 border-b-2"
          style={{ borderColor: color }}
        >
          <h2
            className="text-2xl lg:text-3xl font-black tracking-tight font-display"
            style={{ color }}
          >
            Imyidagaduro
          </h2>
          <Link
            href="/category/imyidagaduro"
            className="text-sm font-bold flex items-center gap-1 hover:text-[#e5b60d] transition-colors"
            style={{ color }}
          >
            Reba byose
          </Link>
        </div>

        {/* Two image features + Amatangazo — every column filled */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BIG feature left + compact cards filling below */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <Link href={`/article/${main.slug}`} className="group block">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <SmartImage
                  src={main.coverImage}
                  alt={main.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display mt-4">
                {main.title}
              </h3>
            </Link>

            {/* Compact cards fill the space under the big feature */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              {fillCards.map((post) => (
                <Link
                  key={post.id}
                  href={`/article/${post.slug}`}
                  className="group flex gap-3 items-center p-3 rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded-lg">
                    <SmartImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-2 font-display">
                      {post.title}
                    </h4>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(post.publishedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right column — smaller feature + polished Amatangazo card */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {secondary && (
              <Link href={`/article/${secondary.slug}`} className="group block">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                  <SmartImage
                    src={secondary.coverImage}
                    alt={secondary.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h4 className="text-base lg:text-lg font-black text-gray-900 leading-snug group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display mt-3">
                  {secondary.title}
                </h4>
              </Link>
            )}

            {/* AMATANGAZO — announcements card */}
            <div className="flex-1 rounded-2xl border border-gray-200 bg-gradient-to-b from-amber-50/60 to-white overflow-hidden flex flex-col">
              <div className="flex items-center gap-2.5 px-4 py-3 bg-[#0f172a]">
                <span className="w-7 h-7 rounded-lg bg-[#e5b60d] flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4 text-[#0f172a]" />
                </span>
                <h3 className="font-black text-base text-white font-display tracking-wide">
                  Amatangazo
                </h3>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Itangazo
                </span>
              </div>
              <div className="flex flex-col divide-y divide-gray-100 flex-1">
                {amatangazo.slice(0, 5).map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/article/${post.slug}`}
                    className="group flex gap-3 items-center px-4 py-3 hover:bg-white transition-colors"
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
                      style={{ backgroundColor: `${color}22`, color: "#b8910b" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="relative w-16 h-14 shrink-0 overflow-hidden rounded-lg">
                      <SmartImage
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="flex-1 min-w-0 font-bold text-sm text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-2 font-display">
                      {post.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
