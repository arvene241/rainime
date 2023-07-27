import { Skeleton } from "./ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <div className="w-[calc(50%-14px)] xs:w-[calc(33.33%-14px)] md:w-[calc(25%-14px)] lg:w-[calc(20%-14px)]">
      <div className="w-full">
        <Skeleton className="h-[260px] relative" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;