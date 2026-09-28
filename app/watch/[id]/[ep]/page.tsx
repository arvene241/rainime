import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, Tv } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import CardGrid from "@/components/CardGrid";
import EpisodeList from "@/components/EpisodeList";
import Section from "@/components/Section";
import StateMessage from "@/components/StateMessage";
import VideoEmbed from "@/components/VideoEmbed";
import WhereToWatch from "@/components/WhereToWatch";
import { airedCount, buildEpisodes, getAnimeInfo, isEmbeddable, officialPlaylist } from "@/lib/api";
import type { AnimeInfo, Episode } from "@/lib/types";
import { animeHref, titleOf, watchHref } from "@/lib/utils";

type Props = { params: { id: string; ep: string } };

const epOf = (value: string) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const info = await getAnimeInfo(params.id);
  if (!info.ok) return { title: "Watch" };
  return {
    title: `${titleOf(info.data.title)} · Episode ${params.ep}`,
    robots: { index: false },
  };
}

export default async function WatchPage({ params }: Props) {
  const number = epOf(params.ep);
  if (!number) notFound();

  const info = await getAnimeInfo(params.id);

  if (!info.ok) {
    if (info.status === 404) notFound();
    return (
      <div className="container pt-10">
        <StateMessage
          title="Couldn’t load this episode"
          body={`${info.error} Reload the page in a moment to try again.`}
          action={{ href: "/", label: "Go home" }}
        />
      </div>
    );
  }

  const anime = info.data;
  const title = titleOf(anime.title);
  const episodes = buildEpisodes(anime);
  const index = episodes.findIndex((e) => e.number === number);
  const episode = index >= 0 ? episodes[index] : null;
  const prev = index > 0 ? episodes[index - 1] : null;
  const next = index >= 0 && index < episodes.length - 1 ? episodes[index + 1] : null;

  // Only offer a player for uploads YouTube says can be embedded.
  const showPlaylist = officialPlaylist(anime);
  const [videoOk, playlistOk] = await Promise.all([
    episode?.youtubeId ? isEmbeddable({ kind: "youtube", id: episode.youtubeId }) : false,
    episode && showPlaylist ? isEmbeddable({ kind: "youtube-playlist", id: showPlaylist.id }) : false,
  ]);
  const videoId = videoOk ? episode?.youtubeId ?? null : null;
  const playlist = !videoId && playlistOk ? showPlaylist : null;
  const playable = Boolean(videoId || playlist);

  return (
    <div className="container pt-5 md:pt-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0">
          <Link
            href={animeHref(anime.id)}
            className="mb-2 inline-flex min-h-10 items-center gap-1 text-sm text-muted hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {title}
          </Link>
          <h1 className="display mb-4 text-2xl md:text-3xl">
            <span className="num text-accent">EP {number}</span>
            <span className="sr-only">,</span> {episode?.title ?? title}
          </h1>

          {videoId ? (
            <VideoEmbed
              key={videoId}
              source={{ kind: "youtube", id: videoId }}
              title={`${title}, episode ${number}`}
              poster={episode?.image ?? anime.cover ?? anime.image}
              label={`Play episode ${number}`}
            />
          ) : playlist ? (
            <VideoEmbed
              key={playlist.id}
              source={{ kind: "youtube-playlist", id: playlist.id }}
              title={`${title}: official playlist`}
              poster={episode?.image ?? anime.cover ?? anime.image}
              label="Play official playlist"
              note={
                <p className="mt-3 text-sm text-muted">
                  This plays the show&apos;s official playlist on {playlist.site}. Choose episode {number} from the
                  playlist menu in the player&apos;s top-right corner.
                </p>
              }
            />
          ) : (
            <NotPlayable anime={anime} episode={episode} number={number} />
          )}

          {playable && anime.streamingLinks.length > 0 && (
            <div className="mt-5">
              <h2 className="mb-2 text-sm font-semibold text-muted">Also streaming on</h2>
              <WhereToWatch links={anime.streamingLinks} />
            </div>
          )}

          {(prev || next) && (
            <nav aria-label="Episodes" className="mt-6 flex items-center justify-between gap-3">
              {prev ? (
                <Link href={watchHref(anime.id, prev.number)} className="btn btn-secondary" rel="prev">
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>
                    <span className="hidden sm:inline">Previous · </span>
                    <span className="num">EP {prev.number}</span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={watchHref(anime.id, next.number)} className="btn btn-primary" rel="next">
                  <span>
                    <span className="hidden sm:inline">Next · </span>
                    <span className="num">EP {next.number}</span>
                  </span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </nav>
          )}
        </div>

        <aside aria-label="Episode list" className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="display mb-4 text-xl lg:mt-12">Episodes</h2>
          <EpisodeList
            episodes={episodes}
            animeId={anime.id}
            current={number}
            allPlayHere={Boolean(officialPlaylist(anime))}
            scroll
          />
        </aside>
      </div>

      {anime.recommendations.length > 0 && (
        <Section title="Watch next" tone="var(--tone-2)" className="mt-16">
          <CardGrid className="xl:grid-cols-6">
            {anime.recommendations.slice(0, 12).map((r) => (
              <li key={r.id}>
                <AnimeCard kind="show" anime={r} />
              </li>
            ))}
          </CardGrid>
        </Section>
      )}
    </div>
  );
}

/** Fills the player frame when the site can't play the episode itself. */
function NotPlayable({
  anime,
  episode,
  number,
}: {
  anime: AnimeInfo;
  episode: Episode | null;
  number: number;
}) {
  const aired = number <= airedCount(anime) || Boolean(episode);
  const backdrop = episode?.image ?? anime.cover ?? anime.image;

  let heading: string;
  let body: string;
  if (!aired) {
    heading = `Episode ${number} hasn’t aired yet`;
    body = anime.nextAiring
      ? `Episode ${anime.nextAiring.episode} is next. Check back after it airs.`
      : "Check back once it’s been broadcast.";
  } else if (episode?.officialUrl) {
    heading = `Watch episode ${number} on ${episode.officialSite}`;
    body = "This episode is streaming legally there. It opens in a new tab.";
  } else if (anime.streamingLinks.length > 0) {
    heading = "Watch it on a streaming service";
    body = "These services carry the show. Each opens in a new tab.";
  } else {
    heading = "No stream available";
    body = "AniList doesn’t list a licensed service for this show yet.";
  }

  return (
    <div className="relative flex min-h-[18rem] w-full items-end overflow-hidden rounded-card bg-surface-2 sm:aspect-video sm:min-h-0 sm:items-center">
      {backdrop && <Image src={backdrop} alt="" fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: "color-mix(in oklch, var(--scrim) 84%, transparent)" }}
      />
      <div className="relative flex max-w-lg flex-col gap-3 p-5 sm:p-8" style={{ color: "oklch(0.97 0.005 250)" }}>
        <Tv className="h-6 w-6 text-accent" aria-hidden="true" />
        <p className="display text-xl sm:text-2xl">{heading}</p>
        <p className="text-sm" style={{ color: "oklch(0.86 0.012 250)" }}>
          {body}
        </p>
        {aired && episode?.officialUrl ? (
          <a href={episode.officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary self-start">
            Open on {episode.officialSite}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : (
          aired && <WhereToWatch links={anime.streamingLinks} />
        )}
      </div>
    </div>
  );
}
