import AnimeCard from "./AnimeCard";
import CardGrid from "./CardGrid";
import Pagination from "./Pagination";
import Section from "./Section";
import StateMessage, { ApiDown } from "./StateMessage";
import type { AnimeSummary, Paged, RecentEpisode } from "@/lib/types";
import type { Result } from "@/lib/api";

type BrowseProps = {
  title: string;
  tone: string;
  page: number;
  hrefFor: (page: number) => string;
  empty: string;
} & (
  | { kind: "show"; result: Result<Paged<AnimeSummary>> }
  | { kind: "episode"; result: Result<Paged<RecentEpisode>> }
);

/** Shared layout for the paged poster lists: new episodes, trending, popular, search. */
const BrowsePage = (props: BrowseProps) => {
  const { title, tone, page, hrefFor, empty, result } = props;

  return (
    <div className="container pt-8 md:pt-12">
      <Section as="h1" title={title} tone={tone}>
        {!result.ok ? (
          <ApiDown error={result.error} />
        ) : result.data.results.length === 0 ? (
          <StateMessage
            title={page > 1 ? "That’s the end of the list" : empty}
            action={page > 1 ? { href: hrefFor(1), label: "Back to page 1" } : { href: "/", label: "Go home" }}
          />
        ) : (
          <>
            <CardGrid className="xl:grid-cols-6">
              {props.kind === "episode"
                ? props.result.ok &&
                  props.result.data.results.map((ep, i) => (
                    <li key={`${ep.id}-${ep.episodeNumber}`}>
                      <AnimeCard kind="episode" anime={ep} priority={i < 6} />
                    </li>
                  ))
                : props.result.ok &&
                  props.result.data.results.map((anime, i) => (
                    <li key={anime.id}>
                      <AnimeCard kind="show" anime={anime} priority={i < 6} />
                    </li>
                  ))}
            </CardGrid>
            <Pagination page={page} hasNextPage={result.data.hasNextPage} hrefFor={hrefFor} />
          </>
        )}
      </Section>
    </div>
  );
};

export default BrowsePage;
