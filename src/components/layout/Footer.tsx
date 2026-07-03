"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

interface FooterCategory {
  id: string;
  name: string;
  slug: string;
}

export function Footer({ categories: propCategories = [] }: { categories?: FooterCategory[] }) {
  const [fetchedCategories, setFetchedCategories] = useState<FooterCategory[]>([]);
  const categories = propCategories.length > 0 ? propCategories : fetchedCategories;

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
    <footer className="bg-ink-900 text-white mt-20">
      {/* Newsletter CTA */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-black mb-2">
                Bona inkuru z'icyamamare buri munsi
              </h3>
              <p className="text-white/60">
                Iyandikishe ku makuru yacu kugira ngo wagure ibyiza bya buri munsi.
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Emeyili yawe"
                className="flex-1 lg:w-80 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-brand-500"
              />
              <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-xl font-bold flex items-center gap-2 transition-colors">
                Iyandikishe <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white font-black text-2xl">
                U
              </div>
              <div>
                <Image
                  src="/images/logo.png"
                  alt="Umunsi.com"
                  width={180}
                  height={48}
                  className="h-12 w-auto brightness-0 invert"
                />
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Urubuga rw'inkuru z'icyamamare mu Rwanda no ku isi. Tukuze amakuru
              y'ukuri, mw'imikino, ikoranabuhanga, n'imyidagaduro.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-brand-400">Ibyiciro</h4>
            <ul className="space-y-3">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More categories */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-brand-400">Ibindi</h4>
            <ul className="space-y-3">
              {categories.slice(6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/about"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Tuzwiho
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Twandikire
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-brand-400">Twandikire</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/60">
                <MapPin className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                KN 5 Ave, Kigali, Rwanda
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Phone className="w-5 h-5 text-brand-500 shrink-0" />
                +250 788 000 000
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Mail className="w-5 h-5 text-brand-500 shrink-0" />
                info@umunsi.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <p>© {new Date().getFullYear()} Umunsi.com — Uburenganzira bwose bwizigamiwe.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Bimwerewe
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Amategeko
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
