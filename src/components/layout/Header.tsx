"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderCategory {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
}

export function Header({ categories: _categories = [] }: { categories?: HeaderCategory[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-all duration-300 border-b border-gray-200",
        scrolled ? "shadow-md" : ""
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="/images/umunsi-logo.jpg"
                alt="Umunsi.com"
                width={200}
                height={50}
                className="h-10 lg:h-12 w-auto"
                loading="eager"
              />
            </Link>
            <a
              href="https://student.umunsi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center shrink-0"
            >
              <img
                src="/images/student-umunsi-logo.png"
                alt="student.umunsi.com"
                width={80}
                height={80}
                className="h-9 sm:h-10 w-auto"
                loading="lazy"
              />
            </a>
          </div>

          {/* Search action */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Shakisha"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="px-4 sm:px-6 lg:px-8 pb-4 animate-fade-in">
            <form action="/search" className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="q"
                type="text"
                placeholder="Shakisha inkuru..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#e5b60d]/30 focus:border-[#e5b60d] outline-none text-lg bg-gray-50"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
