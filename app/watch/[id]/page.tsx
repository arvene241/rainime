import EpisodeList from "@/components/EpisodeList";
import PopularAnime from "@/components/PopularAnime";
import Recommendations from "@/components/Recommendations";
import VideoPlayer from "@/components/VideoPlayer";
import { AnimeInfo, Sources } from "@/lib/types";

const getData = async ({ url }: { url: string }) => {
  const res = await fetch(url);
  const data = await res.json();

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return data.sources;
};

const Watch = async ({ params }: { params: { id: string } }) => {
  const url = "https://api.consumet.org/meta/anilist/watch";

  const sources: Sources[] = await getData({ url: `${url}/${params.id}` });

  return (
    <section className="container w-full mt-8">
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <div className="w-full max-w-[990px]">
          <VideoPlayer anime={sources} id={params.id} />
          <EpisodeList />
          <Recommendations />
        </div>
        <PopularAnime />
      </div>
    </section>
  );
};

export default Watch;
