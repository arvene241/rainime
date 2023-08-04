import { RecentAnime } from "@/lib/types";
import AnimeCard from "./AnimeCard";
import Pagination from "./Pagination";

const getData = async ({ url }: { url: string }) => {
  const res = await fetch(url);
  const data = await res.json();
  console.log(url);

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return data;
};

interface RecentlyUpdatedProps {
  page: number;
  perPage: number;
  pagination?: boolean;
}

const RecentlyUpdated = async ({
  page,
  perPage,
  pagination,
}: RecentlyUpdatedProps) => {
  const url = "https://api.consumet.org/meta/anilist/recent-episodes";

  const data = await getData({
    url: `${url}?page=${page}&perPage=${perPage}`,
  });
  const results: RecentAnime[] = data.results;

  return (
    <section className="w-full max-w-[990px] relative">
      <h1 className="font-bold text-xl pb-4">Recently Updated</h1>
      <div className="flex flex-wrap w-full gap-[14px]">
        {results.map((anime) => (
          <AnimeCard anime={anime} key={anime.episodeTitle} />
        ))}
        {pagination && (
          <div className="my-4">
            {data.hasNextPage || page > 1 ? (
            <Pagination
              hasPrevPage={page > 1}
              hasNextPage={data.hasNextPage}
              route="recently-updated"
            />
          ) : (
            <></>
          )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyUpdated;
