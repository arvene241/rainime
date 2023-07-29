'use client'

import { AnimeInfo } from "@/lib/types";
import AnimeCard from "./AnimeCard";
import { animeStore } from "@/lib/context";

const Recommendations = () => {
  const data: AnimeInfo = animeStore((state) => state.currentAnime);

  return (
    <div className="w-full max-w-[990px] relative">
      <h1 className="font-bold text-xl pb-4">Suggestions</h1>
      <div className="flex flex-wrap w-full gap-[14px]">
        {data?.recommendations.slice(0, 15).map((reco) => (
          <AnimeCard anime={reco} key={reco.id} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
