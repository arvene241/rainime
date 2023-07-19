'use client'

import Image from "next/image";
import { AnimeInfo, RecentAnime } from "@/lib/types";
import { useFetch } from "@/lib/hooks/useFetch";
import Link from "next/link";

interface AnimeCardProps {
  anime: RecentAnime;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const url = "https://api.consumet.org/meta/anilist/info";

  const { loading, error, data } = useFetch<AnimeInfo>({ url: `${url}/${anime.id}` });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error fetching data.</div>;
  }

  return (  
    <div className="w-[calc(50%-14px)] xs:w-[calc(33.33%-14px)] md:w-[calc(25%-14px)] lg:w-[calc(20%-14px)]" key={anime.episodeTitle}>
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
          <div className="absolute bottom-0 left-0 bg-[#023047] p-1 text-white text-xs font-semibold rounded-sm">
            Ep {anime.episodeNumber}/{data?.totalEpisodes}
          </div>
          <div className="absolute bottom-0 right-0 bg-[#023047] p-1 text-white text-xs font-semibold rounded-sm uppercase">
            {data?.subOrDub}
          </div>
          <Link href={`/watch/${data?.episodes[0].id}`} className="absolute inset-0 bg-transparent" />
        </div>
        <div>
          <h3 className="font-bold text-center">{anime.title.userPreferred}</h3>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
