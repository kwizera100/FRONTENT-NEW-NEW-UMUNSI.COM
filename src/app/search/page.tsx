"use client";

import { useState } from "react";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import { mapApiPost, type ApiPost } from "@/lib/api";
import type { Post } from "@/lib/data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const posts = (data.posts || []).map(mapApiPost);
      setResults(posts);
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16 min-h-[60vh]">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Garuka ku rubuga
        </Link>

        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 font-display">Shakisha inkuru</h1>
        <p className="text-gray-400 mb-8">Shakisha inkuru zose za Umunsi.com</p>

        <form onSubmit={handleSearch} className="relative max-w-2xl mb-10">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Andika ikintu ushaka..."
            className="w-full pl-14 pr-32 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#e5b60d] outline-none text-lg"
            autoFocus
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-[#e5b60d] hover:bg-[#c9a00c] text-white font-bold rounded-xl transition-colors">
            Shakisha
          </button>
        </form>

        {loading && <p className="text-gray-400">Bishyirwaho...</p>}

        {searched && !loading && (
          <div>
            <p className="text-gray-500 mb-6">{results.length} inkuru zabonetse ku murongo "{query}"</p>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {results.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-gray-400">Nta nkuru zabonetse. Ongera ushakishe n'ayandi magambo.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
