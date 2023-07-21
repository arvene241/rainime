import { RecentAnime } from "@/lib/types";
import AnimeCard from "./AnimeCard";

const getData = async ({ url }: { url: string }) => {
  const res = await fetch(url);
  const data = await res.json();

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return data.results;
};

const RecentlyUpdated = async () => {
  const url = "https://api.consumet.org/meta/anilist/recent-episodes";

  const results: RecentAnime[] = await getData({ url });

  return (
    <section className="w-full max-w-[990px] relative">
      <h1 className="font-bold text-xl pb-4">Recently Updated</h1>
      <div className="flex flex-wrap w-full gap-[14px]">
        {results?.map((anime) => (
          <AnimeCard anime={anime} key={anime.episodeTitle} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyUpdated;
