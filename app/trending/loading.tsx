import LoadingSkeleton from "@/components/CardLoading";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section className="container w-full mt-8">
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <div className="w-full max-w-[990px] relative">
          <div className="flex flex-wrap w-full gap-[14px]">
            {Array(15)
              .fill(null)
              .map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
          </div>
        </div>
        <Skeleton className="w-full max-w-[298px] h-[500px] pt-2 pb-5 rounded-lg" />
      </div>
      <div className="my-4 flex gap-5">
        <Skeleton className="w-[65px] h-[35px]" />
        <Skeleton className="w-[65px] h-[35px]" />
      </div>
    </section>
  );
};

export default Loading;
