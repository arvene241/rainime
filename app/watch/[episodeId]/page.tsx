import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import CardGrid from "@/components/CardGrid";
import EpisodeList from "@/components/EpisodeList";
import Section from "@/components/Section";
import StateMessage from "@/components/StateMessage";
import VideoPlayer from "@/components/VideoPlayer";
import { getAnimeInfo, getEpisodeSources } from "@/lib/api";
import { animeHref, titleOf, watchHref } from "@/lib/utils";

type Props = {
  params: { episodeId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const animeIdOf = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const animeId = animeIdOf(searchParams.anime);
  const episodeId = decodeURIComponent(params.episodeId);
  if (!animeId) return { title: "Watch" };
  const info = await getAnimeInfo(animeId);
  if (!info.ok) return { title: "Watch" };
  const ep = info.data.episodes?.find((e) => e.id === episodeId);
  return {
    title: `${titleOf(info.data.title)}${ep ? ` · Episode ${ep.number}` : ""}`,
    robots: { index: false },
  };
}

export default async function WatchPage({ params, searchParams }: Props) {
  const episodeId = decodeURIComponent(params.episodeId);
  const animeId = animeIdOf(searchParams.anime);

  const [sources, info] = await Promise.all([
    getEpisodeSources(episodeId),
    animeId ? getAnimeInfo(animeId) : Promise.resolve(null),
  ]);

  const anime = info?.ok ? info.data : null;
  const episodes = anime?.episodes ?? [];
  const index = episodes.findIndex((e) => e.id === episodeId);
  const episode = index >= 0 ? episodes[index] : null;
  const prev = index > 0 ? episodes[index - 1] : null;
  const next = index >= 0 && index < episodes.length - 1 ? episodes[index + 1] : null;
  const title = anime ? titleOf(anime.title) : episodeId.replace(/-/g, " ");
  const epTitle =
    episode?.title && !/^episode \d+$/i.test(episode.title) ? episode.title : null;

  return (
    <div className="container pt-5 md:pt-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0">
          {anime && (
            <Link
              href={animeHref(anime.id)}
              className="mb-2 inline-flex min-h-10 items-center gap-1 text-sm text-muted hover:text-ink"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              {title}
            </Link>
          )}
          <h1 className="display mb-4 text-2xl md:text-3xl">
            {episode ? (
              <>
                <span className="num text-accent">EP {episode.number}</span>
                <span className="sr-only">,</span> {epTitle ?? title}
              </>
            ) : (
              <span className="capitalize">{title}</span>
            )}
          </h1>

          {sources.ok ? (
            <VideoPlayer
              key={episodeId}
              sources={sources.data.sources}
              episodeId={episodeId}
              poster={episode?.image ?? anime?.cover}
              title={episode ? `${title}, episode ${episode.number}` : title}
            />
          ) : (
            <StateMessage
              className="aspect-video justify-center"
              title="This episode can’t be streamed right now"
              body={`${sources.error} Stream hosts come and go; try again later or pick another episode.`}
            />
          )}

          {(prev || next) && (
            <nav aria-label="Episodes" className="mt-5 flex items-center justify-between gap-3">
              {prev ? (
                <Link href={watchHref(prev.id, animeId)} className="btn btn-secondary" rel="prev">
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
                <Link href={watchHref(next.id, animeId)} className="btn btn-primary" rel="next">
                  <span>
                    <span className="hidden sm:inline">Next · </span>
                    <span className="num">EP {next.number}</span>
                  </span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </nav>
          )}

          {!animeId && (
            <p className="mt-5 text-sm text-muted">
              Open this episode from its show page to see the episode list.
            </p>
          )}
        </div>

        {anime && (
          <aside aria-label="Episode list" className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="display mb-4 text-xl lg:mt-12">Episodes</h2>
            <EpisodeList episodes={episodes} animeId={anime.id} currentId={episodeId} scroll />
          </aside>
        )}
      </div>

      {anime?.recommendations && anime.recommendations.length > 0 && (
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
