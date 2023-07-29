import AnimeCard from "@/components/AnimeCard";
import Pagination from "@/components/Pagination";
import PopularAnime from "@/components/PopularAnime";
import { AnimeResult } from "@/lib/types";

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

const Search = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams.page;
  const keyword = searchParams.keyword;

  const url = `https://api.consumet.org/meta/anilist`;

  const data = await getData({
    url: `${url}/${keyword}${page ? `?page=${page}` : ""}`,
  });
  const results: AnimeResult[] = data.results;

  return (
    <section className="container w-full mt-8">
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <div className="w-full max-w-[990px]">
          <h1 className="font-bold text-xl pb-4">Search Results for: {keyword}</h1>
          <div className="flex flex-wrap gap-[14px]">
            {results.map((result) => (
              <AnimeCard anime={result} key={result.id} />
            ))}
          </div>
          {data.hasNextPage || Number(page) > 1 ? (
            <Pagination
              hasPrevPage={page ? Number(page) > 1 : false}
              hasNextPage={data.hasNextPage}
              route="search"
              param="keyword"
              value={keyword}
            />
          ) : (
            <></>
          )}
        </div>
        <PopularAnime />
      </div>
    </section>
  );
};

export default Search;
