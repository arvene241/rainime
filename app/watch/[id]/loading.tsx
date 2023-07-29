import LoadingSkeleton from "@/components/CardLoading";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section className="container w-full mt-8">
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <div className="w-full max-w-[990px]">
          <Skeleton className="w-[55px] h-[20px] mb-4" />
          <Skeleton className="w-full h-[560px]" />
          <div className="w-full my-8 bg-border rounded-lg p-3">
            <div className="flex flex-wrap gap-2 mb-4">
              {Array(2)
                .fill(null)
                .map((_, index) => (
                  <Skeleton key={index} className="w-5 h-5" />
                ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {Array(20)
                .fill(null)
                .map((_, index) => (
                  <Skeleton key={index} className="h-10 w-10" />
                ))}
            </div>
          </div>
          <div className="w-full max-w-[990px] relative">
            <div className="flex flex-wrap w-full gap-[14px]">
              {Array(15)
                .fill(null)
                .map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))}
            </div>
          </div>
        </div>
        <Skeleton className="w-full max-w-[298px] h-[500px] pt-2 pb-5 rounded-lg" />
      </div>
    </section>
  );
};

export default Loading;
