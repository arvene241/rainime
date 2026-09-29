import { Loading } from "@/components/Skeletons";

export default function InfoLoading() {
  return (
    <Loading>
      <div className="skeleton h-44 w-full rounded-none sm:h-60 md:h-72" />
      <div className="container -mt-24 grid gap-6 sm:-mt-28 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="skeleton aspect-[2/3] w-32 sm:w-40 md:w-full" />
        <div className="md:pt-24">
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton mt-3 h-4 w-1/2" />
          <div className="mt-6 flex gap-2">
            <div className="skeleton h-11 w-40" />
            <div className="skeleton h-11 w-32" />
          </div>
          <div className="skeleton mt-8 h-28 w-full max-w-[68ch]" />
        </div>
      </div>
    </Loading>
  );
}
