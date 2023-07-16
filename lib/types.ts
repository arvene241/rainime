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
  genre: Generator;
  type: string;
  rating: number;
  releaseDate: string;
}