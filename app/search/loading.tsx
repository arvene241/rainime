import { GridSkeleton, HeadingSkeleton, Loading } from "@/components/Skeletons";

export default function BrowseLoading() {
  return (
    <Loading>
      <div className="container pt-8 md:pt-12">
        <HeadingSkeleton />
        <GridSkeleton count={18} className="xl:grid-cols-6" />
      </div>
    </Loading>
  );
}
