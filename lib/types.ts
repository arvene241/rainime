interface Title {
  native: string;
  romanju: string;
  english: string;
  userPreferred: string;
}

interface Genre {
  action: string;
  comedy: string;
  horror: string;
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
  genres: Genre;
  type: string;
  rating: number;
  releaseDate: string;
}

export interface RecentAnime {
  id: string;
  title: Title;
  image: string;
  genres: Genre;
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
  descripition: string;
  status: string;
  genres: Genre;
  totalEpisodes: number;
  currentEpisodes: number;
  type: string;
  rating: number;
  subOrDub: string;
  recommendations: Recommendations[];
}

export interface Results<T> {
  results: T[];
}