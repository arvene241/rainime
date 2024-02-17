import AnimeInfoDetail from "@/components/AnimeInfoDetail";
import EpisodeList from "@/components/EpisodeList";
import PopularAnime from "@/components/PopularAnime";
import Recommendations from "@/components/Recommendations";
import { AnimeInfo } from "@/lib/types";

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

const Info = async ({ params }: { params: { id: string[] } }) => {
  const url = "https://consumet-mocha.vercel.app/meta/anilist/info";

  const data: AnimeInfo = await getData({ url: `${url}/${params.id[1]}` });

  return (
    <section className="container w-full">
      <AnimeInfoDetail data={data} />
      <EpisodeList />
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <Recommendations />
        <PopularAnime />
      </div>
    </section>
  );
};

export default Info;
