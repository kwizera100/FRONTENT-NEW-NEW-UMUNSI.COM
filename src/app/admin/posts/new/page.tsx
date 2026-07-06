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
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  UserPlus,
  Loader2,
  Link2,
  FolderOpen,
  CheckCircle2,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { getYouTubeId, getYouTubeThumb } from "@/lib/utils";
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
  const [showCoverUploader, setShowCoverUploader] = useState(false);
  const [showMediaInContent, setShowMediaInContent] = useState(false);
  const [mediaCaptionInput, setMediaCaptionInput] = useState("");
  const [mediaUrlInput, setMediaUrlInput] = useState("");
  const [mediaStep, setMediaStep] = useState<"choose" | "upload" | "url" | "caption" | "youtube" | "library">("choose");
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState("");
  const [mediaLibrary, setMediaLibrary] = useState<{ url: string; caption?: string; type?: string }[]>([]);
  const [mediaLibraryLoading, setMediaLibraryLoading] = useState(false);
  const [isYouTube, setIsYouTube] = useState(false);

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

  const addAuthor = () => {
    if (authorInput.trim() && !authors.includes(authorInput.trim())) {
      setAuthors([...authors, authorInput.trim()]);
      setAuthorInput("");
    }
  };

  const removeAuthor = (name: string) => {
    setAuthors(authors.filter((a) => a !== name));
  };

  const insertMediaIntoContent = (url: string, caption: string, youtube: boolean) => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let html = "";
    if (youtube) {
      const videoId = getYouTubeId(url);
      if (videoId) {
        html = caption.trim()
          ? `<figure>\n  <div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:0.75rem;margin:1rem 0;">\n    <iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe>\n  </div>\n  <figcaption>${caption}</figcaption>\n</figure>`
          : `<div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:0.75rem;margin:1rem 0;">\n  <iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe>\n</div>`;
      }
    } else {
      html = caption.trim()
        ? `<figure>\n  <img src="${url}" alt="${caption}" />\n  <figcaption>${caption}</figcaption>\n</figure>`
        : `<figure>\n  <img src="${url}" alt="" />\n</figure>`;
    }
    if (!html) return;
    const newContent = content.substring(0, start) + html + content.substring(end);
    setContent(newContent);
    setShowMediaInContent(false);
    setMediaCaptionInput("");
    setMediaUrlInput("");
    setMediaStep("choose");
    setIsYouTube(false);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + html.length, start + html.length);
    }, 0);
  };

  const fetchMediaLibrary = async () => {
    setMediaLibraryLoading(true);
    try {
      const token = localStorage.getItem("umunsi_admin_token");
      const res = await fetch("/api/media", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMediaLibrary(data.map((m: any) => ({ url: m.url || m.path || "", caption: m.caption || m.altText || "", type: m.type || "image" })));
      }
    } catch {
      // ignore
    } finally {
      setMediaLibraryLoading(false);
    }
  };

  const insertTag = (tag: string) => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    let replacement = "";
    switch (tag) {
      case "h2": replacement = `<h2>${selected || "Heading"}</h2>`; break;
      case "h3": replacement = `<h3>${selected || "Subheading"}</h3>`; break;
      case "bold": replacement = `<strong>${selected || "bold text"}</strong>`; break;
      case "italic": replacement = `<em>${selected || "italic text"}</em>`; break;
      case "quote": replacement = `<blockquote>${selected || "quote"}</blockquote>`; break;
      case "list": replacement = `<ul>\n  <li>${selected || "Item 1"}</li>\n  <li>Item 2</li>\n</ul>`; break;
      case "image": return; // handled by modal
      default: replacement = selected;
    }
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setSaveError("Title and content are required.");
      return;
    }
    if (!categoryId) {
      setSaveError("Please select a category.");
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      const token = localStorage.getItem("umunsi_admin_token");
      const selectedCat = apiCategories.find((c) => c.slug === categoryId || c.id === categoryId);
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          categoryId: selectedCat ? Number(selectedCat.id) : Number(categoryId),
          featuredImage: coverImage || undefined,
          status: published ? "PUBLISHED" : "DRAFT",
          isFeatured: featured,
          tags: tags.length > 0 ? tags : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Failed to save article.");
      } else {
        router.push("/admin/posts");
      }
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
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
          <h2 className="text-2xl font-black text-ink-900">Write New Article</h2>
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
            {published ? "Published" : "Draft"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-2 block flex items-center gap-2">
              <Type className="w-4 h-4" /> Article Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title..."
              className="w-full text-2xl font-bold text-ink-900 border-0 outline-none placeholder:text-ink-300"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-2 block">
              Excerpt (Short Summary)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief summary of the article..."
              rows={3}
              className="w-full text-ink-800 border-0 outline-none resize-none placeholder:text-ink-300"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-3 block">
              Article Content
            </label>

            {/* Formatting toolbar */}
            <div className="flex items-center gap-1 mb-3 p-2 bg-ink-50 rounded-xl border border-ink-100">
              <button
                onClick={() => insertTag("h2")}
                className="p-2 rounded-lg hover:bg-white text-ink-600 transition-colors"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertTag("h3")}
                className="p-2 rounded-lg hover:bg-white text-ink-600 transition-colors"
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-ink-200 mx-1" />
              <button
                onClick={() => insertTag("bold")}
                className="p-2 rounded-lg hover:bg-white text-ink-600 transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertTag("italic")}
                className="p-2 rounded-lg hover:bg-white text-ink-600 transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-ink-200 mx-1" />
              <button
                onClick={() => insertTag("quote")}
                className="p-2 rounded-lg hover:bg-white text-ink-600 transition-colors"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertTag("list")}
                className="p-2 rounded-lg hover:bg-white text-ink-600 transition-colors"
                title="List"
              >
                <List className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-ink-200 mx-1" />
              <button
                onClick={() => {
                  setIsYouTube(false);
                  setMediaStep("choose");
                  setShowMediaInContent(true);
                }}
                className="p-2 rounded-lg hover:bg-white text-brand-600 transition-colors"
                title="Add Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowMediaInContent(true);
                  setMediaStep("youtube");
                  setIsYouTube(true);
                }}
                className="p-2 rounded-lg hover:bg-white text-red-600 transition-colors"
                title="Add YouTube Video"
              >
                <Youtube className="w-4 h-4" />
              </button>
              <span className="ml-auto text-xs text-ink-400">HTML supported</span>
            </div>

            <textarea
              id="content-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here... Use the toolbar above for formatting."
              rows={15}
              className="w-full text-ink-800 border-0 outline-none resize-y text-base leading-relaxed placeholder:text-ink-300"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Category */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-3 block">
              Category
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
              Cover Image — Optional
            </label>

            {coverImage ? (
              <div className="space-y-3">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-ink-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Image URL..."
                    className="flex-1 px-3 py-2 rounded-lg border border-ink-200 focus:border-brand-500 outline-none text-xs"
                  />
                  <button
                    onClick={() => setShowCoverUploader(true)}
                    className="px-3 py-2 bg-ink-900 hover:bg-ink-800 text-white rounded-lg text-xs font-bold whitespace-nowrap"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : showCoverUploader ? (
              <div className="space-y-3">
                <ImageUploader
                  onUploadComplete={(url) => {
                    setCoverImage(url);
                    setShowCoverUploader(false);
                  }}
                  onClose={() => setShowCoverUploader(false)}
                  compact
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Image URL..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none text-sm"
                />
                <button
                  onClick={() => setShowCoverUploader(true)}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <ImageIcon className="w-4 h-4" />
                  Upload
                </button>
              </div>
            )}
            <p className="text-xs text-ink-400 mt-2">
              Upload from device or paste a URL. Not required.
            </p>
          </div>

          {/* Featured */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-bold text-ink-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-500" />
                Featured Article
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
              Will appear on the homepage slider
            </p>
          </div>

          {/* Authors */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-3 block flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Authors
            </label>
            <p className="text-xs text-ink-400 mb-3">
              Add co-authors who contributed to this article. They will be shown in the article page.
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAuthor())}
                placeholder="Add author name..."
                className="flex-1 px-3 py-2 rounded-lg border border-ink-200 focus:border-brand-500 outline-none text-sm"
              />
              <button
                onClick={addAuthor}
                className="px-3 py-2 bg-ink-900 text-white rounded-lg text-sm font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {authors.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-50 border border-ink-100"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 text-sm font-semibold text-ink-700 truncate">{name}</span>
                  <button
                    onClick={() => removeAuthor(name)}
                    className="p-1 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {authors.length === 0 && (
                <p className="text-xs text-ink-400 text-center py-2">
                  No co-authors added.
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-ink-100 p-5">
            <label className="text-sm font-bold text-ink-700 mb-3 block">
              Tags (Keywords)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
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

      {/* Add Media to Content Modal */}
      {showMediaInContent && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowMediaInContent(false);
            setIsYouTube(false);
            setMediaStep("choose");
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-ink-900 flex items-center gap-2">
                {isYouTube ? (
                  <Youtube className="w-5 h-5 text-red-600" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-brand-600" />
                )}
                {isYouTube ? "Add YouTube Video" : "Add Image to Article"}
              </h3>
              <button
                onClick={() => {
                  setShowMediaInContent(false);
                  setIsYouTube(false);
                  setMediaStep("choose");
                }}
                className="p-2 rounded-lg hover:bg-ink-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step: choose */}
            {mediaStep === "choose" && (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsYouTube(false);
                    setMediaStep("upload");
                  }}
                  className="w-full p-4 border-2 border-dashed border-brand-300 hover:border-brand-500 hover:bg-brand-50 rounded-xl text-sm font-bold text-brand-600 flex items-center justify-center gap-3 transition-colors"
                >
                  <ImageIcon className="w-6 h-6" />
                  Upload from Device
                </button>
                <button
                  onClick={() => {
                    setIsYouTube(false);
                    setMediaStep("url");
                  }}
                  className="w-full p-4 border-2 border-ink-200 hover:border-ink-400 hover:bg-ink-50 rounded-xl text-sm font-bold text-ink-600 flex items-center justify-center gap-3 transition-colors"
                >
                  <Link2 className="w-6 h-6" />
                  Paste Image URL
                </button>
                <button
                  onClick={() => {
                    setIsYouTube(false);
                    fetchMediaLibrary();
                    setMediaStep("library");
                  }}
                  className="w-full p-4 border-2 border-ink-200 hover:border-ink-400 hover:bg-ink-50 rounded-xl text-sm font-bold text-ink-600 flex items-center justify-center gap-3 transition-colors"
                >
                  <FolderOpen className="w-6 h-6" />
                  Pick from Media Library
                </button>
                <button
                  onClick={() => {
                    setIsYouTube(true);
                    setMediaStep("youtube");
                  }}
                  className="w-full p-4 border-2 border-red-200 hover:border-red-400 hover:bg-red-50 rounded-xl text-sm font-bold text-red-600 flex items-center justify-center gap-3 transition-colors"
                >
                  <Youtube className="w-6 h-6" />
                  Add YouTube Video
                </button>
              </div>
            )}

            {/* Step: upload */}
            {mediaStep === "upload" && (
              <div className="space-y-4">
                <ImageUploader
                  onUploadComplete={(url) => {
                    setMediaUrlInput(url);
                    setMediaStep("caption");
                  }}
                  onClose={() => setMediaStep("choose")}
                />
              </div>
            )}

            {/* Step: url */}
            {mediaStep === "url" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none text-sm"
                  />
                  <button
                    onClick={() => mediaUrlInput.trim() && setMediaStep("caption")}
                    disabled={!mediaUrlInput.trim()}
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
                {mediaUrlInput && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-ink-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaUrlInput} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
                <button
                  onClick={() => setMediaStep("choose")}
                  className="text-sm text-ink-400 hover:text-ink-600 font-semibold"
                >
                  &larr; Back
                </button>
              </div>
            )}

            {/* Step: youtube */}
            {mediaStep === "youtube" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-red-500 outline-none text-sm"
                  />
                </div>
                {mediaUrlInput && getYouTubeId(mediaUrlInput) && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getYouTubeThumb(mediaUrlInput) || ""}
                      alt="YouTube preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
                        <Youtube className="w-7 h-7 text-white" fill="white" />
                      </div>
                    </div>
                  </div>
                )}
                {mediaUrlInput && !getYouTubeId(mediaUrlInput) && (
                  <p className="text-xs text-red-500 font-semibold">
                    Invalid YouTube URL. Use a link like https://www.youtube.com/watch?v=...
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setMediaStep("choose")}
                    className="px-4 py-2.5 bg-ink-100 hover:bg-ink-200 text-ink-700 font-bold rounded-xl text-sm transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => getYouTubeId(mediaUrlInput) && setMediaStep("caption")}
                    disabled={!getYouTubeId(mediaUrlInput)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-colors"
                  >
                    Next: Add Caption
                  </button>
                </div>
              </div>
            )}

            {/* Step: library */}
            {mediaStep === "library" && (
              <div className="space-y-4">
                {mediaLibraryLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                  </div>
                ) : mediaLibrary.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 text-ink-300 mx-auto mb-3" />
                    <p className="text-sm text-ink-400 font-semibold">No media in library yet.</p>
                    <p className="text-xs text-ink-400 mt-1">Upload images first to see them here.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-ink-500 font-semibold">
                      Select an image from your media library:
                    </p>
                    <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                      {mediaLibrary
                        .filter((m) => m.type !== "youtube" && !m.url?.includes("youtube"))
                        .map((media, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setMediaUrlInput(media.url);
                              setMediaCaptionInput(media.caption || "");
                              setMediaStep("caption");
                            }}
                            className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-brand-500 transition-colors group"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={media.url}
                              alt={media.caption || ""}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <CheckCircle2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                    </div>
                  </>
                )}
                <button
                  onClick={() => setMediaStep("choose")}
                  className="text-sm text-ink-400 hover:text-ink-600 font-semibold"
                >
                  &larr; Back
                </button>
              </div>
            )}

            {/* Step: caption */}
            {mediaStep === "caption" && mediaUrlInput && (
              <div className="space-y-4">
                {isYouTube ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getYouTubeThumb(mediaUrlInput) || ""}
                      alt="YouTube preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
                        <Youtube className="w-7 h-7 text-white" fill="white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-ink-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaUrlInput} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
                <div>
                  <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={mediaCaptionInput}
                    onChange={(e) => setMediaCaptionInput(e.target.value)}
                    placeholder={isYouTube ? "Describe this video..." : "Describe this image..."}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        insertMediaIntoContent(mediaUrlInput, mediaCaptionInput, isYouTube);
                      }
                    }}
                  />
                  <p className="text-xs text-ink-400 mt-1">
                    {isYouTube
                      ? "Caption will appear below the video. Leave empty to skip."
                      : "Caption will appear below the image. Leave empty to skip."}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMediaStep(isYouTube ? "youtube" : "choose")}
                    className="px-4 py-2.5 bg-ink-100 hover:bg-ink-200 text-ink-700 font-bold rounded-xl text-sm transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => insertMediaIntoContent(mediaUrlInput, mediaCaptionInput, isYouTube)}
                    className={`flex-1 py-2.5 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors ${
                      isYouTube ? "bg-red-600 hover:bg-red-700" : "bg-brand-600 hover:bg-brand-700"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Insert into Article
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
