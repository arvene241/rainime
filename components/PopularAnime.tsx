"use client";

import Image from "next/image";
import { useFetch } from "@/lib/hooks/useFetch";
import { Results, PopularAnime } from "@/lib/types";
import Link from "next/link";

const PopularAnime = () => {
  const url = "https://api.consumet.org/meta/anilist/popular";

  const { loading, error, data } = useFetch<Results<PopularAnime>>({ url });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>{error}</div>;
  }

  const { results } = data;

  return (
    <section className="w-full h-max flex-1 bg-border pt-2 pb-5 rounded-lg">
      <h1 className="font-bold text-xl pb-4 pt-2 px-4">Popular Anime</h1>
      <div className="w-full h-full flex flex-col gap-5">
        {results?.map((anime, index) => (
          <>
            {index == 0 ? (
              <div
                key={anime.title.userPreferred}
                className="relative h-[160px]"
              >
                <Image
                  src={anime.cover}
                  alt={anime.title.userPreferred}
                  fill
                  sizes="100%"
                  className="object-cover"
                />
                <div
                  className="absolute left-0 bottom-0 flex items-center px-4 w-full gap-3 pb-3"
                  style={{
                    background:
                      "linear-gradient(180deg,rgba(0,0,0,0) 0,#000 100%)",
                  }}
                >
                  <div className="w-[35px] h-[35px] flex items-center justify-center bg-foreground text-center text-background font-bold rounded">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-white">
                    {anime.title.userPreferred}
                  </h3>
                </div>
                <Link
                  href={`/anime/${anime.id}`}
                  className="absolute inset-0"
                />
              </div>
            ) : (
              <div
                key={anime.title.userPreferred}
                className="flex items-center gap-3 h-[60px] w-full px-4 relative group"
              >
                <div className="w-[35px] h-[35px] flex items-center justify-center bg-transparent border border-[#666] text-center text-[#666] rounded group-hover:text-foreground group-hover:font-bold">
                  {index + 1}
                </div>
                <Image
                  src={anime.image}
                  alt={anime.title.userPreferred}
                  width={100}
                  height={100}
                  className="w-[45px] h-full object-cover"
                />
                <h3 className="">{anime.title.userPreferred}</h3>
                <Link
                  href={`/anime/${anime.id}`}
                  className="absolute inset-0"
                />
              </div>
            )}
          </>
        ))}
      </div>
    </section>
  );
};

export default PopularAnime;