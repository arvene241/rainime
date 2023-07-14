interface Title {
  native: string;
  romanju: string;
  english: string;
  userPreferred: string;
}

export interface AnimeResult {
  id: string;
  title: Title;
  image: string;
  type: string;
  rating: number;
  releaseDate: string;
}