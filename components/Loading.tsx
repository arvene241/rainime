import LoadingSkeleton from "@/components/CardLoading";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex flex-wrap w-full gap-[14px]">
      {Array(15)
        .fill(null)
        .map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
    </div>
  );
};

export default Loading;
