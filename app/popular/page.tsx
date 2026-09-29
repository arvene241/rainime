import type { Metadata } from "next";
import BrowsePage from "@/components/BrowsePage";
import { getPopular } from "@/lib/api";
import { pageParam } from "@/lib/utils";

export const metadata: Metadata = { title: "Popular" };

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function Popular(props: Props) {
  const searchParams = await props.searchParams;
  const page = pageParam(searchParams.page);
  const result = await getPopular(page, 30);

  return (
    <BrowsePage
      kind="show"
      title="Most popular"
      tone="var(--tone-1)"
      page={page}
      result={result}
      empty="The popular list is empty"
      hrefFor={(p) => `/popular?page=${p}`}
    />
  );
}
