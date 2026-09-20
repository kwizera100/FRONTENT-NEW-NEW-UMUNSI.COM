"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderCategory {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
}

const mainNav = [
  { name: "Ahabanza", slug: "" },
  { name: "Inkuru Nyamukuru", slug: "inkuru-nyamukuru" },
  { name: "Imikino", slug: "imikino" },
  { name: "Imyidagaduro", slug: "imyidagaduro" },
  { name: "Ikoranabuhanga", slug: "ikoranabuhanga" },
  { name: "Ubuzima", slug: "ubuzima" },
  { name: "Amatangazo", slug: "amatangazo" },
];

export function Header({ categories = [] }: { categories?: HeaderCategory[] }) {
  const [isOpen, setIsOpen] = useState(false);
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
            <a
              href="https://writer.umunsi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center shrink-0"
            >
              <img
                src="/images/umunsimedia-logo.jpg"
                alt="writer.umunsi.com"
                width={80}
                height={80}
                className="h-9 sm:h-10 w-auto"
                loading="lazy"
              />
            </a>
            <a
              href="https://eng.umunsi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center shrink-0"
              title="Umunsi English"
            >
              <img
                src="/images/eng-umunsi-logo.svg"
                alt="eng.umunsi.com"
                width={60}
                height={36}
                className="h-7 sm:h-8 w-auto rounded"
                loading="lazy"
              />
            </a>
          </div>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.slug || "home"}
                href={item.slug ? `/category/${item.slug}` : "/"}
                className="px-3 py-2 text-sm font-bold text-gray-800 hover:text-[#e5b60d] transition-colors uppercase tracking-wide"
              >
                {item.name}
              </Link>
            ))}
            {categories.length > 0 && (
              <div className="relative group">
                <button className="px-3 py-2 text-sm font-bold text-gray-800 hover:text-[#e5b60d] transition-colors uppercase tracking-wide flex items-center gap-1">
                  Ibindi <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 rounded-xl min-w-[200px] py-2 hidden group-hover:block">
                  {categories
                    .filter((c) => !mainNav.some((n) => n.slug === c.slug))
                    .map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#e5b60d]/10 hover:text-[#e5b60d]"
                      >
                        {cat.name}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
              aria-label="Shakisha"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="xl:hidden bg-white border-t animate-fade-in shadow-xl">
          <nav className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.slug || "home"}
                href={item.slug ? `/category/${item.slug}` : "/"}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-base font-bold text-gray-800 hover:text-[#e5b60d] hover:bg-gray-50 rounded-xl"
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2" />
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#e5b60d] hover:bg-gray-50 rounded-xl"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
