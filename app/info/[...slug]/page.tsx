import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, ListVideo, Play } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import CardGrid from "@/components/CardGrid";
import EpisodeList from "@/components/EpisodeList";
import LocalTime from "@/components/LocalTime";
import Section from "@/components/Section";
import StateMessage from "@/components/StateMessage";
import Synopsis from "@/components/Synopsis";
import WhereToWatch from "@/components/WhereToWatch";
import { buildEpisodes, getAnimeInfo, getStreamEpisodes, streamingEnabled } from "@/lib/api";
import { cleanDescription, formatDate, formatScore, titleCase, titleOf, watchHref } from "@/lib/utils";

type Props = { params: { slug: string[] } };

/** Accepts both /info/{id} and the old /info/{title}/{id} links. */
const idOf = (slug: string[]) => decodeURIComponent(slug[slug.length - 1] ?? "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await getAnimeInfo(idOf(params.slug));
  if (!res.ok) return { title: "Anime" };
  const title = titleOf(res.data.title);
  const image = res.data.cover || res.data.image;
  return {
    title,
    description: cleanDescription(res.data.description)[0]?.slice(0, 160),
    openGraph: { title, images: image ? [image] : [] },
  };
}

export default async function InfoPage({ params }: Props) {
  const id = idOf(params.slug);
  if (!id) notFound();

  const [res, stream] = await Promise.all([
    getAnimeInfo(id),
    streamingEnabled ? getStreamEpisodes(id) : Promise.resolve(null),
  ]);
  if (!res.ok) {
    if (res.status === 404) notFound();
    return (
      <div className="container pt-10">
        <StateMessage
          title="Couldn’t load this show"
          body={`${res.error} Reload the page in a moment to try again.`}
          action={{ href: "/", label: "Go home" }}
        />
      </div>
    );
  }

  const anime = res.data;
  const title = titleOf(anime.title);
  const episodes = buildEpisodes(anime, stream?.ok ? stream.data : []);
  const first = episodes[0];
  const latest = episodes[episodes.length - 1];
  const paragraphs = cleanDescription(anime.description);
  const altTitles = [anime.title.english, anime.title.romaji, anime.title.native].filter(
    (t, i, all): t is string => Boolean(t) && t !== title && all.indexOf(t) === i
  );

  const start = formatDate(anime.startDate);
  const end = formatDate(anime.endDate);
  const details: [string, string | null | undefined][] = [
    ["Format", titleCase(anime.type)],
    ["Status", titleCase(anime.status)],
    ["Episodes", anime.totalEpisodes ? String(anime.totalEpisodes) : null],
    ["Length", anime.duration ? `${anime.duration} min` : null],
    ["Season", [titleCase(anime.season), anime.releaseDate].filter(Boolean).join(" ") || null],
    ["Aired", start ? (end && end !== start ? `${start} – ${end}` : start) : null],
    ["Studio", anime.studios.join(", ")],
    ["Audience score", formatScore(anime.rating)],
  ];

  return (
    <article>
      <div className="relative h-44 w-full overflow-hidden bg-surface-2 sm:h-60 md:h-72">
        {(anime.cover || anime.image) && (
          <Image src={anime.cover || anime.image!} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to top, var(--bg), color-mix(in oklch, var(--bg) 30%, transparent) 60%, transparent)",
          }}
        />
      </div>

      <div className="container relative -mt-24 grid gap-6 sm:-mt-28 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="card-poster frame w-32 shadow-pop sm:w-40 md:w-full">
          {anime.image && (
            <Image src={anime.image} alt={`${title} poster`} fill priority sizes="240px" className="object-cover" />
          )}
        </div>

        <div className="min-w-0 md:pt-24">
          <h1 className="display text-[2rem] sm:text-4xl lg:text-5xl">{title}</h1>
          {altTitles.length > 0 && <p className="mt-2 text-[0.9375rem] text-muted">{altTitles.join("  ·  ")}</p>}

          {anime.genres && anime.genres.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Genres">
              {anime.genres.map((g) => (
                <li key={g} className="chip">
                  {g}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {first ? (
              <>
                <Link href={watchHref(anime.id, first.number)} className="btn btn-primary">
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  Play episode {first.number}
                </Link>
                {latest && latest.number !== first.number && (
                  <Link href={watchHref(anime.id, latest.number)} className="btn btn-secondary">
                    Latest: episode {latest.number}
                  </Link>
                )}
              </>
            ) : (
              <span className="btn btn-secondary" aria-disabled="true">
                Not aired yet
              </span>
            )}
            <a href="#episodes" className="btn btn-ghost">
              <ListVideo className="h-4 w-4" aria-hidden="true" />
              All episodes
            </a>
          </div>

          {anime.nextAiring && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              <CalendarClock className="h-4 w-4 flex-none text-accent-2" aria-hidden="true" />
              <span>
                Episode {anime.nextAiring.episode} airs <LocalTime unixSeconds={anime.nextAiring.airingAt} />
              </span>
            </p>
          )}

          {anime.streamingLinks.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-semibold text-muted">Where to watch</h2>
              <WhereToWatch links={anime.streamingLinks} />
            </div>
          )}

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-12">
            <Synopsis paragraphs={paragraphs} />
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 self-start text-sm xl:grid-cols-1">
              {details
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="sheet-row pb-3 last:border-b-0">
                    <dt className="text-xs text-muted">{k}</dt>
                    <dd className="mt-0.5 font-medium">{v}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="container mt-14 flex flex-col gap-14">
        <section id="episodes" aria-label="Episodes" className="scroll-mt-24">
          <h2 className="display mb-5 text-2xl md:text-[1.75rem]">Episodes</h2>
          <EpisodeList episodes={episodes} animeId={anime.id} />
        </section>

        {anime.recommendations.length > 0 && (
          <Section title="If you liked this" tone="var(--tone-2)">
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
    </article>
  );
}
