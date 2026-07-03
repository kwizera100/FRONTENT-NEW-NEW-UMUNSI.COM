"use client";

import { useState } from "react";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import { posts as allPosts } from "@/lib/data";
import type { Post } from "@/lib/data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 2) return;
    const filtered = allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    );
    setResults(filtered);
    setSearched(true);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-10 lg:py-16 min-h-[60vh]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Garuka ku rubuga
        </Link>

        <h1 className="text-3xl lg:text-4xl font-black text-ink-900 mb-2">
          Shakisha inkuru
        </h1>
        <p className="text-ink-400 mb-8">
          Shakisha inkuru zose za Umunsi.com
        </p>

        <form onSubmit={handleSearch} className="relative max-w-2xl mb-10">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Andika ikintu ushaka..."
            className="w-full pl-14 pr-32 py-4 rounded-2xl border-2 border-ink-100 focus:border-brand-500 outline-none text-lg"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors"
          >
            Shakisha
          </button>
        </form>

        {searched && (
          <div>
            <p className="text-ink-500 mb-6">
              {results.length} inkuru zabonetse ku murongo "{query}"
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {results.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-ink-400">
                  Nta nkuru zabonetse. Ongera ushakishe n'ayandi magambo.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
