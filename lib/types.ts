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
  results: T[];
}

export interface AnimeSummary {
  id: string;
  title: Title;
  image?: string | null;
  cover?: string | null;
  color?: string | null;
  description?: string | null;
  status?: string | null;
  rating?: number | null;
  genres?: string[];
  type?: string | null;
  season?: string | null;
  releaseDate?: number | null;
  totalEpisodes?: number | null;
  duration?: number | null;
  nextAiring?: { episode: number; airingAt: number } | null;
}

/** An episode that aired recently, from AniList's airing schedule. */
export interface RecentEpisode {
  id: string;
  title: Title;
  image?: string | null;
  type?: string | null;
  episodeNumber: number;
  airingAt: number;
}

/** A licensed streaming service listed for a show on AniList. */
export interface StreamingLink {
  site: string;
  url: string;
  color?: string | null;
  icon?: string | null;
  language?: string | null;
}

export interface OfficialEpisode {
  number: number | null;
  title: string;
  url: string;
  site: string;
  thumbnail?: string | null;
}

export interface AnimeInfo extends AnimeSummary {
  startDate?: FuzzyDate;
  endDate?: FuzzyDate;
  studios: string[];
  recommendations: AnimeSummary[];
  streamingLinks: StreamingLink[];
  officialEpisodes: OfficialEpisode[];
  trailer?: { id: string; site: string } | null;
}

/** An episode from the stream API (Consumet-compatible), if one is configured. */
export interface StreamEpisode {
  id: string;
  number: number;
  title?: string | null;
  image?: string | null;
}

/** The merged episode list the UI renders. */
export interface Episode {
  number: number;
  title?: string | null;
  image?: string | null;
  /** Playable in the site's own player. */
  streamId?: string | null;
  /** Official page for this episode on a licensed service. */
  officialUrl?: string | null;
  officialSite?: string | null;
}

export interface Source {
  url: string;
  isM3U8?: boolean;
  quality?: string;
}

export interface Subtitle {
  url: string;
  lang: string;
}

export interface WatchData {
  sources: Source[];
  subtitles?: Subtitle[];
}
