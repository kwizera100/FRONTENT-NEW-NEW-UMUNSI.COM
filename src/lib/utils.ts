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
