"use client";

import { AnimeData, RecentAnime } from "@/lib/types";
import AnimeCard from "./AnimeCard";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";

interface RecentlyUpdatedProps {
  page: number;
  perPage: number;
  pagination?: boolean;
}

const RecentlyUpdated = ({
  page,
  perPage,
  pagination,
}: RecentlyUpdatedProps) => {
  const url = `https://api.consumet.org/meta/anilist/recent-episodes?page=${page}&perPage=${perPage}`;

  const [data, setData] = useState<AnimeData>({
    currentPage: 1,
    hasNextPage: false,
    totalPages: 1,
    totalResults: 1,
    results: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [url]);

  const results: RecentAnime[] = data.results;

  return (
    <section className="w-full max-w-[990px] relative">
      <h1 className="font-bold text-xl pb-4">Recently Updated</h1>
      <div className="flex flex-wrap w-full gap-[14px]">
        {results.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
        {pagination && (
          <div className="my-4">
            {data.hasNextPage || page > 1 ? (
            <Pagination
              hasPrevPage={page > 1}
              hasNextPage={data.hasNextPage}
              route="recently-updated"
            />
          ) : (
            <></>
          )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyUpdated;
