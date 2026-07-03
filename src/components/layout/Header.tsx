"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderCategory {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
}

export function Header({ categories: propCategories = [] }: { categories?: HeaderCategory[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState<HeaderCategory[]>([]);

  const categories = propCategories.length > 0 ? propCategories : fetchedCategories;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (propCategories.length === 0) {
      fetch("/api/categories")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setFetchedCategories(data);
        })
        .catch(() => {});
    }
  }, [propCategories.length]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-ink-900 text-white text-xs hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-brand-400">
              <TrendingUp className="w-3 h-3" /> Inkuru z'icyamamare
            </span>
            <span className="text-white/60">
              {new Intl.DateTimeFormat("rw-RW", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/70">
            <Link href="/admin" className="hover:text-brand-400 transition-colors">
              Admin
            </Link>
            <span>|</span>
            <span>Ikiyega: 24°C</span>
            <span>|</span>
            <span>Kigali, Rwanda</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-white transition-all duration-300",
          scrolled ? "shadow-lg" : "shadow-sm"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white font-black text-xl lg:text-2xl shadow-lg">
                U
              </div>
              <div>
                <Image
                  src="/images/logo.png"
                  alt="Umunsi.com"
                  width={180}
                  height={48}
                  className="h-10 lg:h-12 w-auto"
                  priority
                />
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.slice(0, 7).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-3 py-2 text-sm font-semibold text-ink-700 hover:text-brand-600 transition-colors rounded-lg hover:bg-brand-50"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/category/hanze"
                className="px-3 py-2 text-sm font-semibold text-ink-700 hover:text-brand-600 transition-colors rounded-lg hover:bg-brand-50"
              >
                Hanze
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-brand-50 text-ink-700 transition-colors"
                aria-label="Shakisha"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-brand-50 text-ink-700 transition-colors"
                aria-label="Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  type="text"
                  placeholder="Shakisha inkuru..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t animate-fade-in">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-50 transition-colors"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-semibold text-ink-800">{cat.name}</span>
                  <span className="text-xs text-ink-400 ml-auto">{cat.nameEn}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
