"use client";

import { useState } from "react";
import { Share2, Bookmark, Copy, Check, Facebook, Twitter, MessageCircle, Linkedin } from "lucide-react";

interface ShareBarProps {
  title: string;
  slug: string;
}

export function ShareBar({ title, slug }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/article/${slug}` : `https://umunsi.com/article/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title} - ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = `${title} - ${url}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmark = () => {
    const key = "umunsi-bookmarks";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    if (bookmarked) {
      const updated = existing.filter((s: string) => s !== slug);
      localStorage.setItem(key, JSON.stringify(updated));
      setBookmarked(false);
    } else {
      if (!existing.includes(slug)) {
        existing.push(slug);
        localStorage.setItem(key, JSON.stringify(existing));
      }
      setBookmarked(true);
    }
  };

  const shareLinks = [
    { icon: Facebook, label: "Facebook", color: "hover:bg-[#1877F2] hover:text-white", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { icon: Twitter, label: "Twitter", color: "hover:bg-[#1DA1F2] hover:text-white", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { icon: MessageCircle, label: "WhatsApp", color: "hover:bg-[#25D366] hover:text-white", url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}` },
    { icon: Linkedin, label: "LinkedIn", color: "hover:bg-[#0A66C2] hover:text-white", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 pb-6 border-b border-gray-100">
      <span className="text-sm font-bold text-gray-500 flex items-center gap-1.5 shrink-0">
        <Share2 className="w-4 h-4" /> Sanga:
      </span>

      <div className="flex items-center gap-2 flex-wrap">
        {shareLinks.map((platform) => (
          <a
            key={platform.label}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 sm:px-3 sm:py-1.5 rounded-lg bg-gray-50 text-gray-700 text-sm font-semibold transition-all flex items-center gap-1.5 ${platform.color}`}
            aria-label={`Sanga kuri ${platform.label}`}
          >
            <platform.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{platform.label}</span>
          </a>
        ))}
      </div>

      <button
        onClick={handleCopy}
        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-50 hover:bg-[#e5b60d]/10 text-gray-700 hover:text-[#e5b60d] text-sm font-semibold transition-colors flex items-center gap-1.5"
        aria-label="Kopi link"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        <span className="hidden sm:inline">{copied ? "Byakopiriwe!" : "Kopi link"}</span>
      </button>

      <button
        onClick={handleBookmark}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
          bookmarked
            ? "bg-[#e5b60d] text-white"
            : "bg-gray-50 hover:bg-[#e5b60d]/10 text-gray-700 hover:text-[#e5b60d]"
        }`}
        aria-label="Bika"
      >
        <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-white" : ""}`} />
        <span className="hidden sm:inline">{bookmarked ? "Byabitswe" : "Bika"}</span>
      </button>
    </div>
  );
}
