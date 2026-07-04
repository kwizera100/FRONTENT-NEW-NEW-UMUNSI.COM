import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { Post } from "@/lib/data";
import { formatTimeAgo } from "@/lib/utils";

interface EntertainmentSectionProps {
  entertainment: Post[];
  amatangazo: Post[];
}

export function EntertainmentSection({ entertainment, amatangazo }: EntertainmentSectionProps) {
  if (entertainment.length === 0) return null;

  const main = entertainment[0];
  const grid = entertainment.slice(1, 4);

  return (
    <section className="py-8 lg:py-12 bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-8 bg-[#e5b60d] rounded-full" />
              <h2 className="text-2xl lg:text-3xl font-black text-gray-900 font-display">Imyidagaduro</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main entertainment card */}
              <Link href={`/article/${main.slug}`} className="group block md:row-span-2">
                <div className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden rounded-xl mb-4">
                  <Image
                    src={main.coverImage}
                    alt={main.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-md text-xs font-bold text-white bg-[#e5b60d]">
                      Imyidagaduro
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 group-hover:text-[#e5b60d] transition-colors mb-2 font-display line-clamp-2">
                  {main.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{main.excerpt}</p>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(main.publishedAt)}
                </span>
              </Link>

              {/* Side grid */}
              {grid.map((post) => (
                <Link
                  key={post.id}
                  href={`/article/${post.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-3">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold text-white bg-[#e5b60d]">
                        Imyidagaduro
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-base text-gray-900 group-hover:text-[#e5b60d] transition-colors line-clamp-2 font-display">
                    {post.title}
                  </h4>
                  <span className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(post.publishedAt)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Amatangazo sidebar - numbered ranking style */}
          <div className="lg:col-span-4">
            <div className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-[#e5b60d]">
                <h3 className="font-black text-xl text-gray-900 font-display">Amatangazo</h3>
              </div>
              <div className="space-y-4">
                {amatangazo.slice(0, 6).map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/article/${post.slug}`}
                    className="group flex gap-4 items-start"
                  >
                    <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="80px"
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
