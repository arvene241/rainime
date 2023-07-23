"use client";

import { AnimeInfo } from "@/lib/types";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { animeStore } from "@/lib/context";

const EpisodeList = () => {
  const data: AnimeInfo = animeStore((state) => state.currentAnime);

  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 50;
  const totalEpisodes = data.episodes.length;
  const totalPages = Math.ceil(totalEpisodes / episodesPerPage);

  // Calculate the indexes of the episodes to be displayed on the current page
  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = data.episodes.slice().reverse().slice(indexOfFirstEpisode, indexOfLastEpisode);

  return (
    <div className="w-full my-8 bg-border rounded-lg p-3">
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({
          length: totalPages,
        }).map((_, index) => (
          <Button
            variant="anime"
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`h-0 py-3 px-3 ${
              currentPage === index + 1 && "bg-foreground text-background"
            }`}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {currentEpisodes?.map((ep) => {
          return (
            <Button key={ep.id} size="icon" asChild>
              <Link href={`/watch/${ep.id}`}>{ep.number}</Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default EpisodeList;
