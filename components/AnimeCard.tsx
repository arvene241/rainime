import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { AnimeSummary, RecentEpisode } from "@/lib/types";
import { animeHref, cn, titleCase, titleOf, watchHref } from "@/lib/utils";

type CardProps =
  | { kind: "show"; anime: AnimeSummary; priority?: boolean }
  | { kind: "episode"; anime: RecentEpisode; priority?: boolean };

function episodeCount(a: AnimeSummary) {
  const current = a.currentEpisode ?? a.currentEpisodeCount ?? null;
  const total = a.totalEpisodes ?? a.episodes ?? null;
  if (current && total && current !== total) return `${current}/${total} eps`;
  if (total) return `${total} ${total === 1 ? "ep" : "eps"}`;
  return null;
}

const AnimeCard = (props: CardProps) => {
  const { anime, priority } = props;
  const title = titleOf(anime.title);

  const href =
    props.kind === "episode"
      ? watchHref(props.anime.episodeId, props.anime.id)
      : animeHref(anime.id);

  const meta =
    props.kind === "episode"
      ? props.anime.episodeTitle && !/^episode \d+$/i.test(props.anime.episodeTitle)
        ? props.anime.episodeTitle
        : titleCase(props.anime.type)
      : [titleCase(props.anime.type), props.anime.releaseDate, episodeCount(props.anime)]
          .filter(Boolean)
          .join(" · ");

  return (
    <Link href={href} className="card group block rounded-card focus-visible:outline-none">
      <div className="card-poster">
        {anime.image ? (
          <Image
            src={anime.image}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1280px) 200px, (min-width: 768px) 22vw, 45vw"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-sm text-muted">
            {title}
          </span>
        )}
        {props.kind === "episode" && (
          <span className="badge badge-accent num absolute bottom-2 left-2">
            <Play className="h-3 w-3 fill-current" aria-hidden="true" />
            EP {props.anime.episodeNumber}
          </span>
        )}
      </div>
      <div className="pt-2.5">
        <h3 className="card-title line-clamp-2 text-[0.9375rem] font-semibold leading-snug">
          {title}
          {props.kind === "episode" && (
            <span className="sr-only">, episode {props.anime.episodeNumber}</span>
          )}
        </h3>
        {meta && <p className={cn("mt-1 truncate text-[0.8125rem] text-muted")}>{meta}</p>}
      </div>
    </Link>
  );
};

export default AnimeCard;
