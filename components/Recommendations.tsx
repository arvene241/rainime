'use client'

import { AnimeInfo } from "@/lib/types";
import AnimeCard2 from "./AnimeCard2";
import { animeStore } from "@/lib/context";

const Recommendations = () => {
  const data: AnimeInfo = animeStore((state) => state.currentAnime);

  return (
    <div className="w-full max-w-[990px] relative">
      <h1 className="font-bold text-xl pb-4">Suggestions</h1>
      <div className="flex flex-wrap w-full gap-[14px]">
        {data.recommendations.slice(0, 15).map((anime) => (
          <AnimeCard2 reco={anime} info={data} key={anime.id} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
