import type { Metadata } from "next";
import BrowsePage from "@/components/BrowsePage";
import { getTrending } from "@/lib/api";
import { pageParam } from "@/lib/utils";

export const metadata: Metadata = { title: "Trending" };

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function Trending(props: Props) {
  const searchParams = await props.searchParams;
  const page = pageParam(searchParams.page);
  const result = await getTrending(page, 30);

  return (
    <BrowsePage
      kind="show"
      title="Trending this week"
      tone="var(--tone-2)"
      page={page}
      result={result}
      empty="Nothing is trending right now"
      hrefFor={(p) => `/trending?page=${p}`}
    />
  );
}
