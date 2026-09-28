import "server-only";

import type {
  AnimeInfo,
  AnimeSummary,
  Paged,
  RecentEpisode,
  WatchData,
} from "./types";

/**
 * Base URL of a Consumet API instance. Public instances go offline often,
 * so it is configurable: set CONSUMET_API_URL to your own deployment.
 */
export const API_URL = (
  process.env.CONSUMET_API_URL ?? "https://consumet-mocha.vercel.app"
).replace(/\/+$/, "");

const ANILIST = `${API_URL}/meta/anilist`;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function request<T>(url: string, revalidate: number): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      next: { revalidate },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    throw new ApiError(
      err instanceof Error && err.name === "TimeoutError"
        ? "The anime API took too long to answer."
        : "The anime API could not be reached."
    );
  }
  if (!res.ok) {
    throw new ApiError(`The anime API answered with ${res.status}.`, res.status);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError("The anime API sent a response we could not read.");
  }
}

/** Wraps a request so pages can render an honest failure state instead of crashing. */
async function settle<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await promise };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Something went wrong.",
    };
  }
}

const emptyPage = <T>(page: number): Paged<T> => ({
  currentPage: page,
  hasNextPage: false,
  results: [],
});

function normalizePage<T>(data: Partial<Paged<T>> | null, page: number) {
  if (!data || !Array.isArray(data.results)) return emptyPage<T>(page);
  return {
    currentPage: Number(data.currentPage) || page,
    hasNextPage: Boolean(data.hasNextPage),
    totalPages: data.totalPages,
    totalResults: data.totalResults,
    results: data.results,
  };
}

const HOUR = 60 * 60;

export const getTrending = (page = 1, perPage = 24) =>
  settle(
    request<Paged<AnimeSummary>>(
      `${ANILIST}/trending?page=${page}&perPage=${perPage}`,
      HOUR
    ).then((d) => normalizePage(d, page))
  );

export const getPopular = (page = 1, perPage = 24) =>
  settle(
    request<Paged<AnimeSummary>>(
      `${ANILIST}/popular?page=${page}&perPage=${perPage}`,
      6 * HOUR
    ).then((d) => normalizePage(d, page))
  );

export const getRecentEpisodes = (page = 1, perPage = 24) =>
  settle(
    request<Paged<RecentEpisode>>(
      `${ANILIST}/recent-episodes?page=${page}&perPage=${perPage}`,
      10 * 60
    ).then((d) => normalizePage(d, page))
  );

export const searchAnime = (query: string, page = 1) =>
  settle(
    request<Paged<AnimeSummary>>(
      `${ANILIST}/${encodeURIComponent(query)}?page=${page}`,
      HOUR
    ).then((d) => normalizePage(d, page))
  );

export const getAnimeInfo = (id: string) =>
  settle(
    request<AnimeInfo>(`${ANILIST}/info/${encodeURIComponent(id)}`, HOUR).then(
      (d) => {
        if (!d || !d.id) throw new ApiError("That show was not found.", 404);
        return {
          ...d,
          episodes: Array.isArray(d.episodes)
            ? [...d.episodes].sort((a, b) => a.number - b.number)
            : [],
          recommendations: Array.isArray(d.recommendations)
            ? d.recommendations
            : [],
        };
      }
    )
  );

export const getEpisodeSources = (episodeId: string) =>
  settle(
    request<WatchData>(
      `${ANILIST}/watch/${encodeURIComponent(episodeId)}`,
      30 * 60
    ).then((d) => {
      const sources = Array.isArray(d?.sources) ? d.sources : [];
      if (sources.length === 0)
        throw new ApiError("No stream was found for this episode.");
      return { ...d, sources };
    })
  );
