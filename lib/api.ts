import "server-only";

import type {
  AnimeInfo,
  AnimeSummary,
  Episode,
  OfficialEpisode,
  Paged,
  RecentEpisode,
  StreamEpisode,
  StreamingLink,
  WatchData,
} from "./types";
import { airedCount } from "./utils";

export { airedCount };

/**
 * Show data comes from AniList's public GraphQL API.
 * In-page playback needs a Consumet-compatible stream API that you host
 * yourself: set CONSUMET_API_URL (and optionally CONSUMET_PROVIDER). Without
 * it, the site links each episode to the licensed services AniList lists.
 */
const ANILIST_URL = process.env.ANILIST_API_URL ?? "https://graphql.anilist.co";
const STREAM_API_URL = process.env.CONSUMET_API_URL?.replace(/\/+$/, "") || null;
const STREAM_PROVIDER = process.env.CONSUMET_PROVIDER || null;

export const streamingEnabled = Boolean(STREAM_API_URL);

export type Result<T> = { ok: true; data: T } | { ok: false; error: string; status?: number };

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
  }
}

async function settle<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await promise };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Something went wrong.",
      status: err instanceof ApiError ? err.status : undefined,
    };
  }
}

async function send(url: string, init: RequestInit & { next?: { revalidate: number } }, label: string) {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(15_000) });
  } catch (err) {
    throw new ApiError(
      err instanceof Error && err.name === "TimeoutError"
        ? `${label} took too long to answer.`
        : `${label} could not be reached.`
    );
  }
}

/* ------------------------------------------------------------------ */
/* AniList                                                             */
/* ------------------------------------------------------------------ */

const MEDIA = `
  id
  title { romaji english native userPreferred }
  coverImage { extraLarge large color }
  bannerImage
  description(asHtml: false)
  status
  format
  episodes
  duration
  season
  seasonYear
  averageScore
  genres
  nextAiringEpisode { episode airingAt }
`;

interface AniMedia {
  id: number;
  title: AnimeSummary["title"];
  coverImage?: { extraLarge?: string; large?: string; color?: string | null } | null;
  bannerImage?: string | null;
  description?: string | null;
  status?: string | null;
  format?: string | null;
  episodes?: number | null;
  duration?: number | null;
  season?: string | null;
  seasonYear?: number | null;
  averageScore?: number | null;
  genres?: string[];
  nextAiringEpisode?: { episode: number; airingAt: number } | null;
  isAdult?: boolean;
}

async function anilist<T>(query: string, variables: Record<string, unknown>, revalidate: number) {
  const res = await send(
    ANILIST_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate },
    },
    "AniList"
  );
  let json: { data?: T; errors?: { message: string; status?: number }[] };
  try {
    json = await res.json();
  } catch {
    throw new ApiError("AniList sent a response we could not read.", res.status);
  }
  if (!res.ok || json.errors?.length || !json.data) {
    const status = json.errors?.[0]?.status ?? res.status;
    if (status === 404) throw new ApiError("That show was not found.", 404);
    if (status === 429) throw new ApiError("AniList is rate-limiting requests right now.", 429);
    throw new ApiError(json.errors?.[0]?.message ?? `AniList answered with ${res.status}.`, status);
  }
  return json.data;
}

function toSummary(m: AniMedia): AnimeSummary {
  return {
    id: String(m.id),
    title: m.title,
    image: m.coverImage?.extraLarge ?? m.coverImage?.large ?? null,
    cover: m.bannerImage ?? null,
    color: m.coverImage?.color ?? null,
    description: m.description,
    status: m.status,
    rating: m.averageScore,
    genres: m.genres ?? [],
    type: m.format,
    season: m.season,
    releaseDate: m.seasonYear,
    totalEpisodes: m.episodes,
    duration: m.duration,
    nextAiring: m.nextAiringEpisode ?? null,
  };
}

type PageData = {
  Page: { pageInfo: { currentPage: number; hasNextPage: boolean }; media: AniMedia[] };
};

// GraphQL rejects declared-but-unused variables, so $search is only declared when used.
const pageQuery = (args: string) => `
  query ($page: Int, $perPage: Int${args.includes("$search") ? ", $search: String" : ""}) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { currentPage hasNextPage }
      media(type: ANIME, isAdult: false, ${args}) { ${MEDIA} }
    }
  }
`;

async function mediaPage(args: string, page: number, perPage: number, revalidate: number, search?: string) {
  const variables = search === undefined ? { page, perPage } : { page, perPage, search };
  const data = await anilist<PageData>(pageQuery(args), variables, revalidate);
  return {
    currentPage: data.Page.pageInfo.currentPage,
    hasNextPage: data.Page.pageInfo.hasNextPage,
    results: data.Page.media.map(toSummary),
  } satisfies Paged<AnimeSummary>;
}

const HOUR = 60 * 60;

export const getTrending = (page = 1, perPage = 24) =>
  settle(mediaPage("sort: [TRENDING_DESC, POPULARITY_DESC]", page, perPage, HOUR));

export const getPopular = (page = 1, perPage = 24) =>
  settle(mediaPage("sort: [POPULARITY_DESC]", page, perPage, 6 * HOUR));

export const searchAnime = (query: string, page = 1, perPage = 30) =>
  settle(mediaPage("search: $search, sort: [SEARCH_MATCH]", page, perPage, HOUR, query));

/** Episodes that aired most recently, newest first, one row per show. */
export const getRecentEpisodes = (page = 1, perPage = 24) =>
  settle(
    (async () => {
      // Round "now" so the cached request is shared for ten minutes.
      const now = Math.floor(Date.now() / 1000 / 600) * 600;
      const data = await anilist<{
        Page: {
          pageInfo: { currentPage: number; hasNextPage: boolean };
          airingSchedules: { episode: number; airingAt: number; media: AniMedia | null }[];
        };
      }>(
        `query ($page: Int, $perPage: Int, $now: Int) {
          Page(page: $page, perPage: $perPage) {
            pageInfo { currentPage hasNextPage }
            airingSchedules(airingAt_lesser: $now, sort: [TIME_DESC]) {
              episode
              airingAt
              media { id isAdult title { romaji english native userPreferred } coverImage { extraLarge large color } format }
            }
          }
        }`,
        // Over-fetch: adult titles are filtered out below.
        { page, perPage: Math.min(50, Math.ceil(perPage * 1.4)), now },
        10 * 60
      );
      const seen = new Set<number>();
      const results: RecentEpisode[] = [];
      for (const s of data.Page.airingSchedules) {
        const m = s.media;
        if (!m || m.isAdult || seen.has(m.id)) continue;
        seen.add(m.id);
        results.push({
          id: String(m.id),
          title: m.title,
          image: m.coverImage?.extraLarge ?? m.coverImage?.large ?? null,
          type: m.format,
          episodeNumber: s.episode,
          airingAt: s.airingAt,
        });
        if (results.length === perPage) break;
      }
      return {
        currentPage: data.Page.pageInfo.currentPage,
        hasNextPage: data.Page.pageInfo.hasNextPage,
        results,
      } satisfies Paged<RecentEpisode>;
    })()
  );

const episodeNumberOf = (title: string) => {
  const m = title.match(/Episode\s+(\d+)/i);
  return m ? Number(m[1]) : null;
};

export const getAnimeInfo = (id: string) =>
  settle(
    (async () => {
      if (!/^\d+$/.test(id)) throw new ApiError("That show was not found.", 404);
      const { Media: m } = await anilist<{
        Media: AniMedia & {
          startDate?: AnimeInfo["startDate"];
          endDate?: AnimeInfo["endDate"];
          studios?: { nodes: { name: string }[] };
          recommendations?: { nodes: { mediaRecommendation: AniMedia | null }[] };
          externalLinks?: (StreamingLink & { type?: string })[];
          streamingEpisodes?: { title: string; thumbnail?: string; url: string; site: string }[];
          trailer?: { id: string; site: string } | null;
        };
      }>(
        `query ($id: Int) {
          Media(id: $id, type: ANIME) {
            ${MEDIA}
            isAdult
            startDate { year month day }
            endDate { year month day }
            studios(isMain: true) { nodes { name } }
            recommendations(sort: [RATING_DESC], perPage: 12) { nodes { mediaRecommendation { ${MEDIA} isAdult } } }
            externalLinks { site url type language color icon }
            streamingEpisodes { title thumbnail url site }
            trailer { id site }
          }
        }`,
        { id: Number(id) },
        HOUR
      );

      const officialEpisodes: OfficialEpisode[] = (m.streamingEpisodes ?? []).map((e) => ({
        number: episodeNumberOf(e.title),
        title: e.title.replace(/^Episode\s+\d+\s*[-–:]\s*/i, ""),
        url: e.url,
        site: e.site,
        thumbnail: e.thumbnail,
      }));

      return {
        ...toSummary(m),
        startDate: m.startDate,
        endDate: m.endDate,
        studios: m.studios?.nodes.map((s) => s.name) ?? [],
        recommendations: (m.recommendations?.nodes ?? [])
          .map((n) => n.mediaRecommendation)
          .filter((r): r is AniMedia => Boolean(r && !r.isAdult))
          .map(toSummary),
        streamingLinks: (m.externalLinks ?? [])
          .filter((l) => l.type === "STREAMING" && l.url)
          .map(({ site, url, color, icon, language }) => ({ site, url, color, icon, language })),
        officialEpisodes,
        trailer: m.trailer,
      } satisfies AnimeInfo;
    })()
  );

/* ------------------------------------------------------------------ */
/* Stream API (optional, Consumet-compatible)                          */
/* ------------------------------------------------------------------ */

const withProvider = (url: string) =>
  STREAM_PROVIDER ? `${url}${url.includes("?") ? "&" : "?"}provider=${encodeURIComponent(STREAM_PROVIDER)}` : url;

async function streamApi<T>(path: string, revalidate: number): Promise<T> {
  if (!STREAM_API_URL) throw new ApiError("No stream API is configured.");
  const res = await send(withProvider(`${STREAM_API_URL}${path}`), { next: { revalidate } }, "The stream API");
  if (!res.ok) throw new ApiError(`The stream API answered with ${res.status}.`, res.status);
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError("The stream API sent a response we could not read.");
  }
}

export const getStreamEpisodes = (anilistId: string) =>
  settle(
    streamApi<StreamEpisode[] | { episodes?: StreamEpisode[] }>(
      `/meta/anilist/episodes/${encodeURIComponent(anilistId)}`,
      HOUR
    ).then((d) => {
      const list = Array.isArray(d) ? d : d?.episodes ?? [];
      return list
        .filter((e) => e && e.id && Number.isFinite(Number(e.number)))
        .map((e) => ({ ...e, number: Number(e.number) }));
    })
  );

export const getEpisodeSources = (episodeId: string) =>
  settle(
    streamApi<WatchData>(`/meta/anilist/watch/${encodeURIComponent(episodeId)}`, 30 * 60).then((d) => {
      const sources = Array.isArray(d?.sources) ? d.sources.filter((s) => s?.url) : [];
      if (sources.length === 0) throw new ApiError("No stream was found for this episode.");
      return {
        sources,
        subtitles: Array.isArray(d.subtitles)
          ? d.subtitles.filter((s) => s?.url && s.lang && !/thumbnails/i.test(s.lang))
          : [],
      };
    })
  );

/**
 * Merges what AniList knows (aired count, official episode pages) with what
 * the stream API can play into one ordered list.
 */
export function buildEpisodes(anime: AnimeInfo, stream: StreamEpisode[]): Episode[] {
  const byNumber = new Map<number, Episode>();
  const count = Math.max(airedCount(anime), stream.length ? Math.max(...stream.map((e) => e.number)) : 0);

  for (let n = 1; n <= count; n++) byNumber.set(n, { number: n });

  for (const e of anime.officialEpisodes) {
    if (e.number == null) continue;
    const ep = byNumber.get(e.number) ?? { number: e.number };
    byNumber.set(e.number, {
      ...ep,
      title: ep.title ?? (e.title || null),
      image: ep.image ?? e.thumbnail ?? null,
      officialUrl: e.url,
      officialSite: e.site,
    });
  }

  for (const e of stream) {
    const ep = byNumber.get(e.number) ?? { number: e.number };
    byNumber.set(e.number, {
      ...ep,
      streamId: e.id,
      title: ep.title ?? (e.title && !/^episode \d+$/i.test(e.title) ? e.title : null),
      image: ep.image ?? e.image ?? null,
    });
  }

  return Array.from(byNumber.values()).filter((e) => e.number > 0).sort((a, b) => a.number - b.number);
}
