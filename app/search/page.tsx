import type { Metadata } from "next";
import BrowsePage from "@/components/BrowsePage";
import StateMessage from "@/components/StateMessage";
import { searchAnime } from "@/lib/api";
import { pageParam } from "@/lib/utils";

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

const keywordOf = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

export function generateMetadata({ searchParams }: Props): Metadata {
  const keyword = keywordOf(searchParams.keyword);
  return { title: keyword ? `“${keyword}”` : "Search", robots: { index: false } };
}

export default async function Search({ searchParams }: Props) {
  const keyword = keywordOf(searchParams.keyword);
  const page = pageParam(searchParams.page);

  if (!keyword) {
    return (
      <div className="container pt-8 md:pt-12">
        <h1 className="display mb-5 text-2xl md:text-[1.75rem]">Search</h1>
        <StateMessage
          title="Type a title in the search box above"
          body="English, romaji and Japanese titles all work."
          action={{ href: "/trending", label: "Browse trending instead" }}
        />
      </div>
    );
  }

  const result = await searchAnime(keyword, page);

  return (
    <BrowsePage
      kind="show"
      title={`Results for “${keyword}”`}
      tone="var(--tone-4)"
      page={page}
      result={result}
      empty={`No titles match “${keyword}”. Check the spelling or try the Japanese title.`}
      hrefFor={(p) => `/search?keyword=${encodeURIComponent(keyword)}&page=${p}`}
    />
  );
}
