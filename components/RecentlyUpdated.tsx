"use client";

import { AnimeInfo, RecentAnime } from "@/lib/types";
import AnimeCard from "./AnimeCard";
import { useEffect, useState } from "react";
import { animeStore, recentPageStore } from "@/lib/context";
import LoadingSkeleton from "./CardLoading";

interface RecentProps {
  pagination?: boolean
  perPage?: number;
}

const RecentlyUpdated = ({ pagination, perPage }: RecentProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RecentAnime[]>([]);

  const page = recentPageStore((state) => state.page);
  const info: AnimeInfo = animeStore((state) => state.currentAnime);

  const url = `https://api.consumet.org/meta/anilist/recent-episodes?page=${pagination ? page : 1}&perPage=${perPage}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(url);
        const data = await res.json();
        setData(data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [url]);

  return (
    <section className="w-full max-w-[990px] relative">
      <h1 className="font-bold text-xl pb-4">Recently Updated</h1>
      <div className="flex flex-wrap w-full gap-[14px]">
        {data.map((anime) => (
          <>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <AnimeCard anime={anime} info={info} key={anime.episodeTitle} />
            )}
          </>
        ))}
      </div>
    </section>
  );
};

export default RecentlyUpdated;
