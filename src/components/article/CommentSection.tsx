"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface CommentSectionProps {
  postId: string;
  postTitle: string;
}

export function CommentSection({ postId, postTitle }: CommentSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [loadedComments, setLoadedComments] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postId=${encodeURIComponent(postId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.comments) setComments(data.comments);
        setLoadedComments(true);
      })
      .catch(() => setLoadedComments(true));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, name, email, phone, content, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSuccess(true);
        setName(""); setEmail(""); setPhone(""); setContent(""); setWebsite("");
      } else {
        setError(data.error || data.details?.[0]?.message || "Habayemo ikibazo. Gerageza nyuma.");
      }
    } catch {
      setError("Ntibishoboye kohereza. Gerageza nyuma.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12 lg:mt-16">
      {/* Comments header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1.5 h-8 rounded-full bg-[#e5b60d]" />
        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 font-display flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-[#e5b60d]" />
          Ibyifuzo by&rsquo;abasomyi
        </h2>
      </div>

      {/* Existing comments */}
      {loadedComments && comments.length > 0 && (
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] flex items-center justify-center text-white font-bold shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString("rw-RW", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed pl-13">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-green-800 text-sm">Igitekerezo cyawe cyakiriwe neza cyane!</p>
            <p className="text-green-700 text-sm mt-1">
              Itsinda rya Umunsi.com rirakirekura kibonewe n&rsquo;abandi hano mu gihe gito (Ugaruke) urebe ibyo bagusubije. Komeza ube uwa mbere mu batanga ibitekerezo hano ku nkuru zacu.
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Andika igitekerezo cyawe</h3>

        <div className="hidden" aria-hidden="true">
          <label>Website (do not fill)
            <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Amazina <span className="text-red-500">*</span>
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} placeholder="Andika amazina yawe" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] focus:ring-2 focus:ring-[#e5b60d]/20 outline-none transition-all text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} placeholder="email@urugendo.rw" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] focus:ring-2 focus:ring-[#e5b60d]/20 outline-none transition-all text-sm" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Telefoni <span className="text-red-500">*</span>
          </label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={20} placeholder="+250 7XX XXX XXX" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] focus:ring-2 focus:ring-[#e5b60d]/20 outline-none transition-all text-sm" />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Igitekerezo cyawe <span className="text-red-500">*</span>
          </label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required minLength={3} maxLength={2000} rows={5} placeholder="Andika igitekerezo cyawe kuri iyi nkuru..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#e5b60d] focus:ring-2 focus:ring-[#e5b60d]/20 outline-none transition-all text-sm resize-none" />
          <p className="text-xs text-gray-400 mt-1">{content.length}/2000</p>
        </div>

        <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#e5b60d] hover:bg-[#c9a00c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold transition-colors text-sm">
          {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Kohereza...</>) : (<><Send className="w-4 h-4" /> Kohereza igitekerezo</>)}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Igitekerezo cyawe kizemezwa n&rsquo;abaditsi mbere y&rsquo;uko cyagaragara. Ibyanditsse n&rsquo;ababotsi cyangwa spam ntibyemewe.
        </p>
      </form>
    </section>
  );
}
