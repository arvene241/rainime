import { Loading } from "@/components/Skeletons";

export default function WatchLoading() {
  return (
    <Loading>
      <div className="container pt-5 md:pt-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            <div className="skeleton mb-4 h-8 w-2/3" />
            <div className="skeleton aspect-video w-full" />
          </div>
          <div className="skeleton h-96 lg:mt-12" />
        </div>
      </div>
    </Loading>
  );
}
