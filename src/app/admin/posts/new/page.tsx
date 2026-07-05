"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Star,
  Image as ImageIcon,
  Youtube,
  X,
  Plus,
  Type,
} from "lucide-react";
import { getYouTubeThumb, getYouTubeId } from "@/lib/utils";
import type { ApiCategory } from "@/lib/api";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [mediaItems, setMediaItems] = useState<
    { url: string; type: "image" | "youtube"; caption: string }[]
  >([]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setApiCategories(data);
          if (data.length > 0) setCategoryId(data[0].slug);
        }
      })
      .catch(() => {});
  }, []);

  const categories = apiCategories.length > 0
    ? apiCategories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))
    : [{ id: "0", slug: "", name: "Loading..." }];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const addMedia = () => {
    if (!mediaUrl.trim()) return;
    const isYoutube = mediaUrl.includes("youtube") || mediaUrl.includes("youtu.be");
    setMediaItems([
      ...mediaItems,
      {
        url: mediaUrl,
        type: isYoutube ? "youtube" : "image",
        caption: mediaCaption,
      },
    ]);
    setMediaUrl("");
    setMediaCaption("");
  };

  const removeMedia = (index: number) => {
    setMediaItems(mediaItems.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Demo save
    alert("Inkuru yabitswe (demo mode). Ibi bizakorwa na backend API.");
    router.push("/admin/posts");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 rounded-lg hover:bg-ink-100 text-ink-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-black text-ink-900">Andika inkuru nshya</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPublished(!published)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${
              published
                ? "bg-green-50 text-green-600"
                : "bg-ink-50 text-ink-500"
            }`}
          >
            <Eye className="w-4 h-4" />
            {published ? "Bizasohoka" : "Draft"}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Bika
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-2 block flex items-center gap-2">
              <Type className="w-4 h-4" /> Umutwe w'inkuru
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Andika umutwe w'inkuru..."
              className="w-full text-2xl font-bold text-ink-900 border-0 outline-none placeholder:text-ink-300"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-2 block">
              Mu magambo magufi (Excerpt)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Andika mu magambo magufi ibyigarijwe n'iyi nkuru..."
              rows={3}
              className="w-full text-ink-800 border-0 outline-none resize-none placeholder:text-ink-300"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-2 block">
              Ibirimo by'inkuru
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Andika inkuru yawe hano... Wakoresha HTML."
              rows={15}
              className="w-full text-ink-800 border-0 outline-none resize-y font-mono text-sm placeholder:text-ink-300"
            />
          </div>

          {/* Media manager */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <h3 className="font-bold text-ink-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-brand-600" />
              Media (Amafoto & Videwo)
            </h3>

            {/* Add media */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="URL y'ifoto cyangwa YouTube link..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none text-sm"
              />
              <input
                type="text"
                value={mediaCaption}
                onChange={(e) => setMediaCaption(e.target.value)}
                placeholder="Caption (umwanzuro w'ifoto)..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none text-sm"
              />
              <button
                onClick={addMedia}
                className="px-4 py-2.5 bg-ink-900 hover:bg-ink-800 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Ongera
              </button>
            </div>

            {/* Media list */}
            <div className="space-y-3">
              {mediaItems.map((media, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start p-3 rounded-xl bg-ink-50 border border-ink-100"
                >
                  {/* Preview */}
                  <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-ink-200 relative">
                    {media.type === "youtube" && getYouTubeId(media.url) ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getYouTubeThumb(media.url) || ""}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Youtube className="w-6 h-6 text-red-600" fill="white" />
                        </div>
                      </>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={media.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                        media.type === "youtube"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {media.type === "youtube" ? "YouTube" : "Ifoto"}
                    </span>
                    <p className="text-sm text-ink-600 mt-1 line-clamp-1">
                      {media.url}
                    </p>
                    {media.caption && (
                      <p className="text-xs text-ink-400 mt-1 italic">
                        {media.caption}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeMedia(i)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {mediaItems.length === 0 && (
                <p className="text-sm text-ink-400 text-center py-6">
                  Nta media yongerewe. Ongera ifoto cyangwa YouTube link.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Category */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-3 block">
              Icyiciro
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none font-semibold text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-3 block">
              Ifoto y'icyamamare (Cover)
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="URL y'ifoto..."
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none text-sm mb-3"
            />
            {coverImage && (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-ink-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Featured */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-bold text-ink-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-500" />
                Inkuru y'icyamamare
              </span>
              <button
                onClick={() => setFeatured(!featured)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  featured ? "bg-brand-600" : "bg-ink-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    featured ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
            <p className="text-xs text-ink-400 mt-2">
              Izagaragara kuri homepage slider
            </p>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-3 block">
              Tags (Amagambo fatizo)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Ongera tag..."
                className="flex-1 px-3 py-2 rounded-lg border border-ink-200 focus:border-brand-500 outline-none text-sm"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-ink-900 text-white rounded-lg text-sm font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold"
                >
                  #{tag}
                  <button
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-brand-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
