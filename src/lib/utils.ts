import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("rw-RW", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTimeAgo(date: string | Date | null) {
  if (!date) return "";
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (seconds < 60) return "za noneho";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `iminota ${minutes} zashize`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `amasaha ${hours} yashize`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `iminsi ${days} yashize`;
  return formatDate(date);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getYouTubeId(url: string) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYouTubeThumb(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

const BLOCK_TAG_RE =/<\s*(?:p|div|h[1-6]|ul|ol|li|blockquote|figure|figcaption|pre|table|thead|tbody|tr|td|th|section|article|header|footer|hr|br|img|iframe|video|audio|source|embed|object|canvas|svg|form|input|button|label|select|textarea|address|fieldset|legend|dl|dt|dd|details|summary|main|nav|aside|picture|noscript)[\s\/>]/i;

export function formatArticleHtml(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "";

  // If the content already contains block-level HTML, leave it as-is so
  // existing formatting (headings, figures, lists, etc.) is preserved.
  if (BLOCK_TAG_RE.test(trimmed)) {
    return trimmed;
  }

  // Otherwise treat the content as plain text and auto-wrap paragraphs.
  return trimmed
    .split(/\n\s*\n/)
    .map((block) => {
      const text = block.trim();
      if (!text) return "";
      const withBreaks = text.replace(/\n/g, "<br>");
      return `<p>${withBreaks}</p>`;
    })
    .filter(Boolean)
    .join("\n\n");
}
