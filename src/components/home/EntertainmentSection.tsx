import Link from "next/link";
import { Clock } from "lucide-react";
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
  const left = entertainment.slice(1, 5);
  const center = entertainment[0];

  return (
    <section className="py-8 lg:py-10 bg-white border-t border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* IMYIDAGADURO LEFT LIST */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2" style={{ borderColor: color }}>
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight font-display" style={{ color }}>
                Imyidagaduro
              </h2>
              <Link
                href="/category/imyidagaduro"
                className="text-xs font-bold hover:text-[#e5b60d] transition-colors"
                style={{ color }}
              >
                Reba byose
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-200">
              {left.map((post) => (
                <Link
                  key={post.id}
                  href={`/article/${post.slug}`}
                  className="group flex gap-4 items-start py-4 first:pt-0"
                >
                  <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-lg">
                    <SmartImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm lg:text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors leading-snug line-clamp-3 font-display">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CENTER LARGE */}
          <div className="lg:col-span-5">
            <Link href={`/article/${center.slug}`} className="group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl mb-4">
                <SmartImage
                  src={center.coverImage}
                  alt={center.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight group-hover:text-[#e5b60d] transition-colors line-clamp-3 font-display">
                {center.title}
              </h1>
              <p className="text-gray-700 text-base lg:text-lg mt-3 line-clamp-3">{center.excerpt}</p>
            </Link>
          </div>

          {/* AMATANGAZO - remains as it is */}
          <div className="lg:col-span-4">
            <div className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-[#e5b60d]">
                <h3 className="font-black text-xl text-gray-900 font-display">Amatangazo</h3>
              </div>
              <div className="space-y-4">
                {amatangazo.slice(0, 5).map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/article/${post.slug}`}
                    className="group flex gap-4 items-start"
                  >
                    <div className="relative w-24 h-20 shrink-0 overflow-hidden rounded-lg">
                      <SmartImage
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="100px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[#e5b60d] font-black text-lg leading-none block mb-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display">
                        {post.title}
                      </h4>
                    </div>
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
