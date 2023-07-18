'use client'

import Image from "next/image";
import { AnimeInfo, RecentAnime } from "@/lib/types";
import { useFetch } from "@/lib/hooks/useFetch";

interface AnimeCardProps {
  anime: RecentAnime;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const url = "https://api.consumet.org/meta/anilist/info";

  const { loading, error, data } = useFetch<AnimeInfo>({ url: `${url}/${anime.id}` });

  console.log(data);

  return (
    <div className="w-[calc(20%-14px)]" key={anime.episodeTitle}>
      <div className="w-full">
        <div className="h-[260px] relative">
          <Image
            src={anime.image}
            alt={anime.title.userPreferred}
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-sm"
          />
          <div className="absolute top-0 left-0 bg-foreground p-1 text-background text-xs font-semibold rounded-sm">
            HD
          </div>
          <div className="absolute bottom-0 left-0 bg-accent p-1 text-background text-xs font-semibold rounded-sm">
            Ep {anime.episodeNumber}/{data?.totalEpisodes}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-center">{anime.title.userPreferred}</h3>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
