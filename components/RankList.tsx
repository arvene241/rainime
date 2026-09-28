import Image from "next/image";
import Link from "next/link";
import type { AnimeSummary } from "@/lib/types";
import { animeHref, formatScore, titleCase, titleOf } from "@/lib/utils";

/** Ranked list of shows: rank numeral, thumbnail, title, one line of facts. */
const RankList = ({ items }: { items: AnimeSummary[] }) => (
  <ol className="flex flex-col">
    {items.map((anime, i) => (
      <li key={anime.id} className="sheet-row last:border-b-0">
        <Link
          href={animeHref(anime.id)}
          className="card group grid grid-cols-[2.25rem_3rem_1fr] items-center gap-3 py-2.5"
        >
          <span
            className={
              "num text-center text-xl font-bold leading-none " +
              (i < 3 ? "text-accent" : "text-muted")
            }
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="card-poster w-12">
            {anime.image && (
              <Image src={anime.image} alt="" fill sizes="48px" className="object-cover" />
            )}
          </span>
          <span className="min-w-0">
            <span className="card-title line-clamp-2 text-[0.9375rem] font-semibold leading-snug">
              {titleOf(anime.title)}
            </span>
            <span className="mt-0.5 block truncate text-[0.8125rem] text-muted">
              {[titleCase(anime.type), formatScore(anime.rating), anime.releaseDate]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </span>
        </Link>
      </li>
    ))}
  </ol>
);

export default RankList;
