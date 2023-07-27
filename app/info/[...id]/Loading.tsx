import LoadingSkeleton from "@/components/CardLoading";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section className="container w-full">
      <div className="flex flex-col mdl:flex-row py-8 px-4 justify-center gap-4 mdl:gap-8">
        <Skeleton className="w-[130px] mdl:w-[250px] h-[300px] rounded-lg" />
        <div className="flex flex-col mdl:flex-row gap-4 mdl:w-[80%] mdl:items-center mdl:gap-8">
          <div className="flex flex-col mdl:w-3/4 gap-4">
            <Skeleton className="w-[450px] h-[65px]" />
            <Skeleton className="w-[120px] h-[25px]" />
            <Skeleton className="w-full h-[50px]" />
            <div className="flex gap-3">
              <Skeleton className="w-[55px] h-[20px]" />
              <Skeleton className="w-[55px] h-[20px]" />
              <Skeleton className="w-[55px] h-[20px]" />
            </div>
          </div>
          <Skeleton className="mdl:w-1/4 h-full" />
        </div>
      </div>
      <Skeleton className="w-full my-8 bg-border rounded-lg p-3" />
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <div className="w-full max-w-[990px] relative">
          <div className="flex flex-wrap w-full gap-[14px]">
            {Array(15).fill(null).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        </div>
        <Skeleton className="w-full max-w-[298px] h-[500px] pt-2 pb-5 rounded-lg" />
      </div>
    </section>
  );
};

export default Loading;
