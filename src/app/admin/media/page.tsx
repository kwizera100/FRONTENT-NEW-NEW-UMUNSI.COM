"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Youtube,
  Search,
  Filter,
  Upload,
  Trash2,
  Copy,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import { getYouTubeThumb, getYouTubeId } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { ApiPost } from "@/lib/api";

export default function AdminMediaPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "youtube">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const [allMedia, setAllMedia] = useState<
    { id: string; url: string; type: "image" | "youtube"; caption: string; postTitle: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/posts?status=PUBLISHED&limit=100&sortBy=publishedAt&sortOrder=desc")
      .then((r) => r.json())
      .then((data) => {
        const posts: ApiPost[] = data.data || [];
        const media: { id: string; url: string; type: "image" | "youtube"; caption: string; postTitle: string }[] = [];
        posts.forEach((p) => {
          if (p.featuredImage) {
            const isYoutube = p.featuredImage.includes("youtube") || p.featuredImage.includes("youtu.be");
            media.push({
              id: `img-${p.id}`,
              url: p.featuredImage.startsWith("http") ? p.featuredImage : `https://api.umunsi.com${p.featuredImage}`,
              type: isYoutube ? "youtube" : "image",
              caption: p.title,
              postTitle: p.title,
            });
          }
        });
        setAllMedia(media);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = allMedia.filter((m) => {
    const matchesSearch =
      m.caption?.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || m.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddMedia = () => {
    if (!uploadedUrl.trim()) return;
    const isYoutube = uploadedUrl.includes("youtube") || uploadedUrl.includes("youtu.be");
    const newMediaItem = {
      id: `media-${Date.now()}`,
      url: uploadedUrl,
      type: isYoutube ? "youtube" as const : "image" as const,
      caption: newCaption || "",
      postTitle: "Media yongerewe n'admin",
    };
    setAllMedia([newMediaItem, ...allMedia]);
    setShowAdd(false);
    setUploadedUrl("");
    setNewCaption("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink-900">Media Library</h2>
          <p className="text-ink-400 text-sm mt-1">
            {allMedia.length} media — {allMedia.filter((m) => m.type === "image").length} amafoto,{" "}
            {allMedia.filter((m) => m.type === "youtube").length} YouTube videwo
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors"
        >
          <Upload className="w-5 h-5" />
          Ongera Media
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Shakisha media..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none bg-white"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "image", "youtube"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                filter === f
                  ? "bg-ink-900 text-white"
                  : "bg-white text-ink-500 border border-ink-200 hover:bg-ink-50"
              }`}
            >
              {f === "all" ? "Byose" : f === "image" ? "Amafoto" : "YouTube"}
            </button>
          ))}
        </div>
      </div>

      {/* Media grid */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
          <p className="text-sm text-ink-400 mt-3">Birimo gukuramo media...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((media) => (
          <div
            key={media.id}
            onClick={() => setSelected(media.id)}
            className="group relative aspect-square rounded-xl overflow-hidden bg-ink-100 cursor-pointer border border-ink-100 hover:border-brand-500 transition-colors"
          >
            {media.type === "youtube" && getYouTubeId(media.url) ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getYouTubeThumb(media.url) || ""}
                  alt={media.caption || ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 flex items-center justify-center">
                  <Youtube className="w-4 h-4 text-white" fill="white" />
                </div>
              </>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.url}
                  alt={media.caption || ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
              </>
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <p className="text-white text-xs font-semibold line-clamp-2">
                {media.caption || "Nta caption"}
              </p>
            </div>
          </div>
        ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-ink-400">
          Nta media yabonetse.
        </div>
      )}

      {/* Media detail modal */}
      {selected && (() => {
        const media = allMedia.find((m) => m.id === selected);
        if (!media) return null;
        return (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-ink-100">
                <h3 className="font-bold text-ink-900">Media by'umuntu</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg hover:bg-ink-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Preview */}
                <div className="relative aspect-video bg-ink-900">
                  {media.type === "youtube" && getYouTubeId(media.url) ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getYouTubeThumb(media.url) || ""}
                        alt={media.caption || ""}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                          <Youtube className="w-8 h-8 text-white" fill="white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={media.url}
                      alt={media.caption || ""}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                {/* Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-ink-400 uppercase">
                      Ubwoko
                    </label>
                    <span
                      className={`ml-2 text-xs font-bold px-2 py-1 rounded-lg ${
                        media.type === "youtube"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {media.type === "youtube" ? "YouTube Videwo" : "Ifoto"}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink-400 uppercase block mb-1">
                      URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={media.url}
                        className="flex-1 px-3 py-2 rounded-lg bg-ink-50 text-sm text-ink-600"
                      />
                      <button className="p-2 rounded-lg bg-ink-100 hover:bg-ink-200 text-ink-600">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink-400 uppercase block mb-1">
                      Caption
                    </label>
                    <p className="text-sm text-ink-700 bg-ink-50 rounded-lg p-3">
                      {media.caption || "Nta caption yanditse"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink-400 uppercase block mb-1">
                      Igishusho kiri muri
                    </label>
                    <p className="text-sm text-ink-700">{media.postTitle}</p>
                  </div>
                  <button className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Siba iyi media
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add media modal */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-ink-900">Ongera Media</h3>
              <button
                onClick={() => setShowAdd(false)}
                className="p-2 rounded-lg hover:bg-ink-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <ImageUploader onUploadComplete={(url) => setUploadedUrl(url)} />

              {uploadedUrl && (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-ink-100">
                    {getYouTubeId(uploadedUrl) ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getYouTubeThumb(uploadedUrl) || ""}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                          <Youtube className="w-5 h-5 text-white" fill="white" />
                        </div>
                      </>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={uploadedUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                      Caption (Umwanzuro w'ifoto) — Ushobora kuyisiga
                    </label>
                    <input
                      type="text"
                      value={newCaption}
                      onChange={(e) => setNewCaption(e.target.value)}
                      placeholder="Andika caption y'ifoto..."
                      className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
                    />
                    <p className="text-xs text-ink-400 mt-1">
                      Caption izagaragara munsi y'ifoto muri inkuru. Ni amahitamo.
                    </p>
                  </div>

                  <button
                    onClick={handleAddMedia}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Ongera Media
                  </button>
                </div>
              )}

              {!uploadedUrl && (
                <p className="text-sm text-ink-400 text-center py-4">
                  Hitamo ifoto ku byuma cyangwa shyira URL, hanyuma wongere caption.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
