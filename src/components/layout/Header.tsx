"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search, ChevronDown, Crown, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { isSubscribed } from "@/lib/subscription";
import { TopBanner } from "@/components/home/TopBanner";

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
  const [subscriber, setSubscriber] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [readerUser, setReaderUser] = useState<{ email?: string; firstName?: string; lastName?: string; avatar?: string } | null>(null);
  const [accountMenu, setAccountMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    setSubscriber(isSubscribed());
    try {
      setHasAccount(!!localStorage.getItem("umunsi_reader_token"));
      const u = localStorage.getItem("umunsi_reader_user");
      if (u) setReaderUser(JSON.parse(u));
    } catch {}
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const signOut = () => {
    try {
      localStorage.removeItem("umunsi_reader_token");
      localStorage.removeItem("umunsi_reader_user");
      if (localStorage.getItem("umunsi_subscription_plan") === "account") {
        localStorage.removeItem("umunsi_subscribed");
        localStorage.removeItem("umunsi_subscribed_until");
        localStorage.removeItem("umunsi_subscription_plan");
      }
    } catch {}
    window.location.reload();
  };

  const avatarInitial = (readerUser?.firstName || readerUser?.email || "U").trim().charAt(0).toUpperCase();

  return (
    <header
      className={cn(
        "relative z-50 bg-white transition-all duration-300 border-b border-gray-200",
        scrolled ? "shadow-md" : ""
      )}
    >
      <TopBanner />
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
            {/* Subscribe / Premium */}
            {subscriber ? (
              <Link
                href="/subscribe"
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-[#e5b60d] to-[#c9a00c] text-[#0f172a] text-xs font-black px-4 py-2 rounded-full shadow-sm"
              >
                <Crown className="w-3.5 h-3.5" /> PREMIUM
              </Link>
            ) : (
              <Link
                href="/subscribe"
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#e5b60d] to-[#c9a00c] hover:from-[#f5c81d] hover:to-[#d9b00c] text-[#0f172a] text-xs font-black px-3 sm:px-4 py-2 rounded-full shadow-sm transition-all"
              >
                <Crown className="w-3.5 h-3.5" /> <span className="hidden xs:inline sm:inline">SUBSCRIBE</span>
              </Link>
            )}

            {/* Login / Account */}
            {hasAccount ? (
              <div className="relative">
                <button
                  onClick={() => setAccountMenu(!accountMenu)}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#e5b60d] hover:border-[#f5c81d] transition-colors"
                  title="Konti yawe"
                >
                  {readerUser?.avatar ? (
                    <img src={readerUser.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="w-full h-full bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] text-[#0f172a] font-black flex items-center justify-center text-sm">
                      {avatarInitial}
                    </span>
                  )}
                </button>
                {accountMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-black text-sm text-gray-900 truncate">
                        {readerUser?.firstName ? `${readerUser.firstName} ${readerUser.lastName || ""}`.trim() : "Reader"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{readerUser?.email}</p>
                      {subscriber && (
                        <span className="inline-flex items-center gap-1 mt-1.5 bg-[#e5b60d]/15 text-[#b8940a] text-[10px] font-black px-2 py-0.5 rounded-full">
                          <Crown className="w-3 h-3" /> PREMIUM — nta ads
                        </span>
                      )}
                    </div>
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sohoka (Sign out)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/subscribe?login=1"
                title="Injira"
                className="flex items-center gap-1.5 p-2.5 sm:px-3.5 rounded-full border border-gray-200 hover:border-[#e5b60d] hover:text-[#e5b60d] text-gray-700 transition-colors text-xs font-bold"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Injira</span>
              </Link>
            )}

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
            <div className="flex gap-2 px-2 py-2">
              <Link
                href="/subscribe"
                onClick={() => setIsOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#e5b60d] to-[#c9a00c] text-[#0f172a] text-sm font-black px-4 py-3 rounded-xl"
              >
                <Crown className="w-4 h-4" /> {subscriber ? "PREMIUM" : "SUBSCRIBE"}
              </Link>
              {hasAccount ? (
                <button
                  onClick={() => { setIsOpen(false); signOut(); }}
                  className="flex-1 flex items-center justify-center gap-1.5 border-2 border-red-200 text-red-600 text-sm font-black px-4 py-3 rounded-xl"
                >
                  <LogOut className="w-4 h-4" /> Sohoka
                </button>
              ) : (
                <Link
                  href="/subscribe?login=1"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 border-2 border-gray-200 text-gray-700 text-sm font-black px-4 py-3 rounded-xl"
                >
                  <User className="w-4 h-4" /> Injira
                </Link>
              )}
            </div>
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
