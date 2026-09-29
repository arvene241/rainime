import type { Metadata } from "next";
import BrowsePage from "@/components/BrowsePage";
import { getRecentEpisodes } from "@/lib/api";
import { pageParam } from "@/lib/utils";

export const metadata: Metadata = { title: "New episodes" };

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

export default async function RecentlyUpdated({ searchParams }: Props) {
  const page = pageParam(searchParams.page);
  const result = await getRecentEpisodes(page, 30);

  return (
    <BrowsePage
      kind="episode"
      title="New episodes"
      tone="var(--tone-1)"
      page={page}
      result={result}
      empty="No new episodes right now"
      hrefFor={(p) => `/recently-updated?page=${p}`}
    />
  );
}
