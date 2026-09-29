import { GridSkeleton, HeadingSkeleton, Loading } from "@/components/Skeletons";

export default function HomeLoading() {
  return (
    <Loading>
      <div className="container flex flex-col gap-14 pt-4 md:pt-6">
        <div className="skeleton spot-stage" />
        <div>
          <HeadingSkeleton />
          <GridSkeleton count={10} />
        </div>
      </div>
    </Loading>
  );
}
