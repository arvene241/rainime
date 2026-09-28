import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FuzzyDate, Title } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function titleOf(title?: Title | null): string {
  return (
    title?.userPreferred ||
    title?.romaji ||
    title?.english ||
    title?.native ||
    "Untitled"
  );
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
};

/** Turns the API's HTML-flavoured synopsis into plain paragraphs. */
export function cleanDescription(description?: string | null): string[] {
  if (!description) return [];
  const text = description
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\(Source:[^)]*\)/gi, "")
    .replace(/\[Written by[^\]]*\]/gi, "");
  return text
    .split(/\n\s*\n|\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** AniList months are 1-based; any part may be missing. */
export function formatDate(date?: FuzzyDate | null): string | null {
  if (!date?.year) return null;
  const month = date.month ? MONTHS[date.month - 1] : null;
  if (!month) return String(date.year);
  return date.day ? `${month} ${date.day}, ${date.year}` : `${month} ${date.year}`;
}

export function formatAirDate(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** AniList scores are 0–100. */
export function formatScore(rating?: number | null): string | null {
  if (!rating) return null;
  return `${rating}%`;
}

export function titleCase(value?: string | null): string | null {
  if (!value) return null;
  const upper = ["TV", "OVA", "ONA"];
  return value
    .split("_")
    .map((w) => (upper.includes(w) ? w : w.charAt(0) + w.slice(1).toLowerCase()))
    .join(" ");
}

export function animeHref(id: string) {
  return `/info/${encodeURIComponent(id)}`;
}

export function watchHref(episodeId: string, animeId?: string) {
  const base = `/watch/${encodeURIComponent(episodeId)}`;
  return animeId ? `${base}?anime=${encodeURIComponent(animeId)}` : base;
}

/** Reads a positive integer page number from a search param. */
export function pageParam(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}
