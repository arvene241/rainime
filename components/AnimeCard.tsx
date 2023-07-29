import Image from "next/image";
import Link from "next/link";

// Recent Anime Card
interface AnimeCardProps {
  anime: any;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <div className="w-[calc(50%-14px)] xs:w-[calc(33.33%-14px)] md:w-[calc(25%-14px)] lg:w-[calc(20%-14px)]">
      <div className="w-full">
        <div className="h-[260px] relative">
          <Image
            src={anime.image}
            alt={anime.title.romaji}
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-sm"
          />
          <div className="absolute top-0 left-0 bg-foreground p-1 text-background text-xs font-semibold rounded-sm">
            HD
          </div>
          <div className="absolute bottom-0 left-0 bg-[#023047] p-1 text-white text-xs font-semibold rounded-sm">
            Ep {" "}
            {anime.episodes && anime.episodes} {" "}
            {anime.currentEpisodeCount && `${anime.currentEpisodeCount} / ${anime.totalEpisodes}`}{" "}
            {anime.episodeNumber && anime.episodeNumber}{" "}
            {anime.totalEpisodes && anime.totalEpisodes}
          </div>
          <Link
            href={`/info/${anime.title.romaji}/${anime.id}`}
            className="absolute inset-0 bg-transparent"
          />
        </div>
        <div>
          <h3 className="font-bold text-center">{anime.title.romaji}</h3>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
