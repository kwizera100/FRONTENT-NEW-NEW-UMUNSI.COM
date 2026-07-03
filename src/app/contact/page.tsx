"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName("");
      setEmail("");
      setMessage("");
    }, 3000);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-10 lg:py-16 max-w-5xl">
        <h1 className="text-4xl lg:text-5xl font-black text-ink-900 mb-4">
          Twandikire
        </h1>
        <p className="text-xl text-ink-500 mb-12">
          Waba ufite ibyo utubaza cyangwa se wifuza kumurikirana natwe? Tugiye hano.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-ink-100 p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                  Amazina yawe
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
                  placeholder="Amazina yawe..."
                />
              </div>
              <div>
                <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                  Emeyili
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
                  placeholder="emeyili@urugero.com"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                  Ubutumwa
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-brand-500 outline-none resize-none"
                  placeholder="Andika ubutumwa bwawe hano..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {sent ? "Byoherejwe!" : "Ohereza"}
                {!sent && <Send className="w-5 h-5" />}
              </button>
              {sent && (
                <p className="text-green-600 text-center font-semibold">
                  Murakoze! Ubutumwa bwawe byoherejwe.
                </p>
              )}
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: "Aderesi",
                value: "KN 5 Ave, Kigali, Rwanda",
                color: "bg-brand-100 text-brand-600",
              },
              {
                icon: Phone,
                title: "Telefoni",
                value: "+250 788 000 000",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Mail,
                title: "Emeyili",
                value: "info@umunsi.com",
                color: "bg-green-100 text-green-600",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-ink-100 p-6 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-ink-900">{item.title}</h3>
                  <p className="text-ink-500">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="bg-ink-900 rounded-2xl p-8 text-center text-white">
              <h3 className="font-bold text-lg mb-2">Dukurikire ku mbuga</h3>
              <p className="text-white/60 text-sm mb-4">
                Bona inkuru z'icyamamare ku mbuga za sosiyete.
              </p>
              <div className="flex justify-center gap-3">
                {["Facebook", "Twitter", "Instagram", "YouTube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="px-4 py-2 bg-white/10 hover:bg-brand-600 rounded-xl text-sm font-semibold transition-colors"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
