interface Title {
  native: string;
  romaji: string;
  english: string;
  userPreferred: string;
}

export interface Datee {
  year: number;
  month: number;
  day: number;
}

interface Recommendations {
  id: string;
  title: Title;
  status: string;
  episodes: number;
  image: string;
  cover: string;
  rating: number;
  type: string;
}

interface Episodes {
  id: string;
  title: string;
  description: string;
  number: number;
  image: string;
  airdate: string;
}

export interface AnimeResult {
  id: string;
  title: Title;
  image: string;
  type: string;
  rating: number;
  releaseDate: string;
}

export interface AnimeTrending {
  id: string;
  title: Title;
  description: string;
  cover: string;
  image: string;
  genres: string[];
  type: string;
  rating: number;
  releaseDate: string;
}

export interface RecentAnime {
  id: string;
  title: Title;
  image: string;
  genres: string[];
  type: string;
  rating: number;
  episodeId: string;
  episodeNumber: number;
  episodeTitle: string;
}

export interface AnimeInfo {
  id: string;
  title: Title;
  image: string;
  popularity: number;
  cover: string;
  description: string;
  status: string;
  genres: string[];
  studios: string[];
  totalEpisodes: number;
  currentEpisodes: number;
  type: string;
  rating: number;
  subOrDub: string;
  recommendations: Recommendations[];
  episodes: Episodes[];
  startDate: Datee;
  endDate: Datee;
  season: string
  releaseDate: string;
  duration: number;
}

export interface PopularAnime {
  id: string;
  title: Title;
  image: string;
  description: string;
  status: string;
  cover: string;
  rating: number;
  genres: string[];
  totalEpisodes: number;
  type: string;
}

export interface Results<T> {
  results: T[];
}