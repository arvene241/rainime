import Image from "next/image";
import Link from "next/link";
import { Play } from "@/components/icons";
import type { AnimeSummary, RecentEpisode } from "@/lib/types";
import { animeHref, timeAgo, titleCase, titleOf, watchHref } from "@/lib/utils";

type CardProps =
  | { kind: "show"; anime: AnimeSummary; priority?: boolean }
  | { kind: "episode"; anime: RecentEpisode; priority?: boolean };

function episodeCount(a: AnimeSummary) {
  const aired = a.nextAiring ? a.nextAiring.episode - 1 : null;
  const total = a.totalEpisodes ?? null;
  if (aired && total) return `${aired}/${total} eps`;
  if (aired) return `${aired} eps`;
  if (total) return `${total} ${total === 1 ? "ep" : "eps"}`;
  return null;
}

const AnimeCard = (props: CardProps) => {
  const { anime, priority } = props;
  const title = titleOf(anime.title);

  const href =
    props.kind === "episode"
      ? watchHref(props.anime.id, props.anime.episodeNumber)
      : animeHref(anime.id);

  const meta =
    props.kind === "episode"
      ? [titleCase(props.anime.type), timeAgo(props.anime.airingAt)].filter(Boolean).join(" · ")
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
            <Play className="h-3 w-3" aria-hidden="true" />
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
        {meta && <p className="mt-1 truncate text-[0.8125rem] text-muted">{meta}</p>}
      </div>
    </Link>
  );
};

export default AnimeCard;
