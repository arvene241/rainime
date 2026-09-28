import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AnimeSummary, FuzzyDate, Title } from "@/lib/types";

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

export function watchHref(animeId: string, episode: number) {
  return `/watch/${encodeURIComponent(animeId)}/${episode}`;
}

/** "3 hours ago", "2 days ago" for a unix timestamp in seconds. */
export function timeAgo(unixSeconds: number, now = Date.now()): string {
  const s = Math.max(0, Math.round(now / 1000 - unixSeconds));
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`;
  if (s < 86400) {
    const h = Math.round(s / 3600);
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  const d = Math.round(s / 86400);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

/** Reads a positive integer page number from a search param. */
export function pageParam(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/** How many episodes have aired so far. */
export function airedCount(anime: AnimeSummary): number {
  if (anime.nextAiring) return Math.max(0, anime.nextAiring.episode - 1);
  if (anime.status === "NOT_YET_RELEASED") return 0;
  return anime.totalEpisodes ?? 0;
}

export type YouTubeRef = { type: "video" | "playlist"; id: string };

/** Recognises YouTube video and playlist URLs. Channel links return null. */
export function youtubeOf(url?: string | null): YouTubeRef | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  const valid = (id: string | null, re: RegExp) => (id && re.test(id) ? id : null);
  const VIDEO = /^[\w-]{11}$/;
  const LIST = /^[\w-]{10,64}$/;

  if (host === "youtu.be") {
    const id = valid(u.pathname.slice(1), VIDEO);
    return id ? { type: "video", id } : null;
  }
  if (host !== "youtube.com" && host !== "youtube-nocookie.com") return null;

  const v = valid(u.searchParams.get("v"), VIDEO);
  if (u.pathname === "/watch" && v) return { type: "video", id: v };
  const embed = u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})$/);
  if (embed) return { type: "video", id: embed[1] };
  const list = valid(u.searchParams.get("list"), LIST);
  if (list) return { type: "playlist", id: list };
  return null;
}
