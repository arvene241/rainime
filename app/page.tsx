import AnimeCard from "@/components/AnimeCard";
import CardGrid from "@/components/CardGrid";
import RankList from "@/components/RankList";
import Section from "@/components/Section";
import Spotlight from "@/components/Spotlight";
import { ApiDown } from "@/components/StateMessage";
import { getPopular, getRecentEpisodes, getTrending } from "@/lib/api";

export const revalidate = 600;

const SPOTLIGHT = 5;

export default async function Home() {
  const [trending, recent, popular] = await Promise.all([
    getTrending(1, 17),
    getRecentEpisodes(1, 16),
    getPopular(1, 10),
  ]);

  const trendingList = trending.ok ? trending.data.results : [];

  return (
    <div className="container flex flex-col gap-14 pt-4 md:gap-16 md:pt-6">
      {trendingList.length > 0 ? (
        <Spotlight items={trendingList.slice(0, SPOTLIGHT)} />
      ) : (
        !trending.ok && <ApiDown error={trending.error} />
      )}

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Section title="New episodes" tone="var(--tone-1)" href="/recently-updated">
          {recent.ok ? (
            recent.data.results.length > 0 ? (
              <CardGrid className="lg:grid-cols-4">
                {recent.data.results.map((ep, i) => (
                  <li key={`${ep.id}-${ep.episodeNumber}`}>
                    <AnimeCard kind="episode" anime={ep} priority={i < 4 && trendingList.length === 0} />
                  </li>
                ))}
              </CardGrid>
            ) : (
              <p className="text-muted">Nothing new in the last day. Check back tonight.</p>
            )
          ) : (
            <ApiDown error={recent.error} />
          )}
        </Section>

        <Section title="Most popular" tone="var(--tone-1)" href="/popular" className="self-start">
          {popular.ok ? <RankList items={popular.data.results.slice(0, 10)} /> : <ApiDown error={popular.error} />}
        </Section>
      </div>

      {trendingList.length > SPOTLIGHT && (
        <Section title="Trending this week" tone="var(--tone-2)" href="/trending">
          <CardGrid className="xl:grid-cols-6">
            {trendingList.slice(SPOTLIGHT).map((anime) => (
              <li key={anime.id}>
                <AnimeCard kind="show" anime={anime} />
              </li>
            ))}
          </CardGrid>
        </Section>
      )}
    </div>
  );
}
