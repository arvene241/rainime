import PopularAnime from "@/components/PopularAnime";
import RecentlyUpdated from "@/components/RecentlyUpdated";

const Recently = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const perPage = searchParams.page ? Number(searchParams.page) : 40;

  return (
    <section className="container w-full mt-8">
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <div className="w-full max-w-[990px]">
          <RecentlyUpdated page={page} perPage={perPage} pagination={true} />
        </div>
        <PopularAnime />
      </div>
    </section>
  );
};

export default Recently;
