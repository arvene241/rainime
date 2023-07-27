import Pagination from "@/components/Pagination";
import PopularAnime from "@/components/PopularAnime";
import RecentlyUpdated from "@/components/RecentlyUpdated";

const Recently = () => {
  return (
    <section className="container w-full mt-8">
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <RecentlyUpdated pagination={true} perPage={40} />
        <PopularAnime />
      </div>
      <div className="my-4">
        <Pagination />
      </div>
    </section>
  );
};

export default Recently;
