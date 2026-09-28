export interface Title {
  romaji?: string | null;
  english?: string | null;
  native?: string | null;
  userPreferred?: string | null;
}

export interface FuzzyDate {
  year?: number | null;
  month?: number | null;
  day?: number | null;
}

export interface Paged<T> {
  currentPage: number;
  hasNextPage: boolean;
  totalPages?: number;
  totalResults?: number;
  results: T[];
}

/** The fields every list endpoint (trending, popular, search, recommendations) shares. */
export interface AnimeSummary {
  id: string;
  title: Title;
  image?: string;
  cover?: string;
  description?: string;
  status?: string;
  rating?: number | null;
  genres?: string[];
  type?: string;
  releaseDate?: string | number | null;
  totalEpisodes?: number | null;
  currentEpisode?: number | null;
  currentEpisodeCount?: number | null;
  episodes?: number | null;
  color?: string | null;
}

export interface RecentEpisode {
  id: string;
  title: Title;
  image?: string;
  rating?: number | null;
  genres?: string[];
  type?: string;
  episodeId: string;
  episodeNumber: number;
  episodeTitle?: string | null;
}

export interface Episode {
  id: string;
  number: number;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  airDate?: string | null;
}

export interface AnimeInfo extends Omit<AnimeSummary, "episodes"> {
  season?: string | null;
  duration?: number | null;
  popularity?: number | null;
  subOrDub?: string | null;
  studios?: string[];
  startDate?: FuzzyDate;
  endDate?: FuzzyDate;
  recommendations?: AnimeSummary[];
  episodes?: Episode[];
}

export interface Source {
  url: string;
  isM3U8?: boolean;
  quality?: string;
}

export interface WatchData {
  headers?: Record<string, string>;
  sources: Source[];
}
