import Image from "next/image";
import { AnimeInfo, RecentAnime } from "@/lib/types";
import Link from "next/link";

interface AnimeCardProps {
  anime: RecentAnime;
}

const getData = async ({ url }: { url: string }) => {
  const res = await fetch(url);
  const data = await res.json();

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return data;
};

const AnimeCard = async ({ anime }: AnimeCardProps) => {
  const url = "https://api.consumet.org/meta/anilist/info";

  const data: AnimeInfo = await getData({ url: `${url}/${anime.id}` });

  return (
    <div
      className="w-[calc(50%-14px)] xs:w-[calc(33.33%-14px)] md:w-[calc(25%-14px)] lg:w-[calc(20%-14px)]"
      key={anime.episodeTitle}
    >
      <div className="w-full">
        <div className="h-[260px] relative">
          <Image
            src={anime.image}
            alt={anime.title.english}
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
          <Link
            href={`/info/${anime.title.english}/${anime.id}`}
            className="absolute inset-0 bg-transparent"
          />
        </div>
        <div>
          <h3 className="font-bold text-center">{anime.title.userPreferred}</h3>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
