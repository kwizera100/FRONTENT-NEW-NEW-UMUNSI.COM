"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Target, Eye, Heart, Zap, Users, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16 max-w-4xl">
        <h1 className="text-4xl lg:text-5xl font-black text-ink-900 mb-4">
          Tuzwiho
        </h1>
        <p className="text-xl text-ink-500 mb-12">
          Entertainment, Health and Social Life through Education. Home of Umunsimedia.com students App
        </p>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-ink-700 leading-relaxed text-lg">
            Umunsi.com ni urubuga rw&apos;icyamamare rukeneye gutanga amakuru y&apos;ukuri,
            mw&apos;imikino, ikoranabuhanga, imyidagaduro, n&apos;ibindi byinshi. Tugamije
            kuba urubuga rwa mbere mu Rwanda mu gutanga inkuru z&apos;ubwiza bwishe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
          {[
            { icon: Target, title: "Intego", desc: "Gutanga inkuru z'ukuri n'ubwiza bwishe" },
            { icon: Eye, title: "Ubwiza", desc: "Tukuze ubwiza mu byanditse no mu byerekanwe" },
            { icon: Heart, title: "Ubumwe", desc: "Tugamije kubaka umuryango w'abanyarwanda" },
            { icon: Zap, title: "Umuvuduko", desc: "Tugaburira inkuru z'icyamamare buri munsi" },
            { icon: Users, title: "Abanyarwanda", desc: "Inkuru z'Abanyarwanda ku Abanyarwanda" },
            { icon: Award, title: "Umwuga", desc: "Tukuze umwuga mu guandika amakuru" },
          ].map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl border border-ink-100 p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="font-bold text-lg text-ink-900 mb-2">{value.title}</h3>
              <p className="text-ink-500 text-sm">{value.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-10 lg:p-14 text-center text-white">
          <h2 className="text-3xl font-black mb-4">Wifuza kumurikirana natwe?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Turimo gushaka abanditsi bashya, abafotozi, n&apos;abahanga mu byitabwaho.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors"
          >
            Twandikire
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
