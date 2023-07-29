import AnimeCard from "@/components/AnimeCard";
import Pagination from "@/components/Pagination";
import Popular from "@/components/PopularAnime";
import { PopularAnime } from "@/lib/types";

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
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const url = "https://api.consumet.org/meta/anilist/popular";

  const data = await getData({
    url: `${url}?page=${page}&perPage=40`,
  });
  const results: PopularAnime[] = data.results;

  return (
    <section className="container w-full mt-8">
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <div className="w-full max-w-[990px]">
          <h1 className="font-bold text-xl pb-4">Popular Anime</h1>
          <div className="flex flex-wrap gap-[14px]">
            {results.map((result) => (
              <AnimeCard anime={result} key={result.id} />
            ))}
          </div>
          {data.hasNextPage || page > 1 ? (
            <Pagination
              hasPrevPage={page ? page > 1 : false}
              hasNextPage={data.hasNextPage}
              route="popular"
            />
          ) : (
            <></>
          )}
        </div>
        <Popular />
      </div>
    </section>
  );
};

export default Search;
