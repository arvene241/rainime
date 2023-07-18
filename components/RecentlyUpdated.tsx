"use client";

import { useFetch } from "@/lib/hooks/useFetch";
import { RecentAnime, Results } from "@/lib/types";
import AnimeCard from "./AnimeCard";

const RecentlyUpdated = () => {
  const url = "https://api.consumet.org/meta/anilist/recent-episodes";

  const { loading, error, data } = useFetch<Results<RecentAnime>>({ url });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error fetching data.</div>;
  }

  const { results } = data;

  return (
    <section className="w-full max-w-[990px] relative">
      <h1 className="font-bold text-lg">Recently Updated</h1>
      <div className="flex flex-wrap w-full gap-[14px]">
        {results?.map((anime) => (
          <AnimeCard anime={anime} key={anime.episodeTitle} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyUpdated;
