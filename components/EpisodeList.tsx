"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, Play } from "@/components/icons";
import type { Episode } from "@/lib/types";
import { cn, watchHref } from "@/lib/utils";

const RANGE = 100;

interface EpisodeListProps {
  episodes: Episode[];
  animeId: string;
  current?: number;
  /** The show has an official playlist the site can play. */
  allPlayHere?: boolean;
  /** Fixed-height scrolling list, for the watch page sidebar. */
  scroll?: boolean;
}

/**
 * The episode list reads like an animator's exposure sheet: numbered rows,
 * ruled lines, the current row marked in blue pencil.
 */
const EpisodeList = ({ episodes, animeId, current, allPlayHere, scroll }: EpisodeListProps) => {
  const currentIndex = current ? episodes.findIndex((e) => e.number === current) : -1;
  const ranges = Math.ceil(episodes.length / RANGE);
  const [range, setRange] = useState(currentIndex > 0 ? Math.floor(currentIndex / RANGE) : 0);
  const [jump, setJump] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLAnchorElement>(null);

  const titled = useMemo(
    () => episodes.filter((e) => e.title).length >= episodes.length * 0.5,
    [episodes]
  );

  const visible = useMemo(() => {
    if (jump) return episodes.filter((e) => String(e.number).startsWith(jump));
    return episodes.slice(range * RANGE, range * RANGE + RANGE);
  }, [episodes, range, jump]);

  // Centre the current episode inside the sidebar without scrolling the page.
  useEffect(() => {
    const list = listRef.current;
    const row = currentRef.current;
    if (scroll && list && row) {
      list.scrollTop = row.offsetTop - list.offsetTop - list.clientHeight / 2 + row.clientHeight / 2;
    }
  }, [scroll, current]);

  if (episodes.length === 0) {
    return (
      <p className="frame bg-surface px-5 py-6 text-sm text-muted">
        No episodes have aired yet. They&apos;ll appear here once the show starts broadcasting.
      </p>
    );
  }

  const status = (ep: Episode) =>
    ep.youtubeId || allPlayHere ? (
      <Play className="h-3.5 w-3.5 text-muted group-hover:text-accent" aria-label="Plays here" />
    ) : ep.officialUrl ? (
      <ExternalLink
        className="h-3.5 w-3.5 text-muted group-hover:text-accent"
        aria-label={`On ${ep.officialSite ?? "an official site"}`}
      />
    ) : null;

  return (
    <div className="frame overflow-hidden bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-3 py-2.5 md:px-4">
        <p className="text-sm font-semibold">
          <span className="num">{episodes.length}</span> {episodes.length === 1 ? "episode" : "episodes"}
        </p>
        <div className="flex items-center gap-2">
          {ranges > 1 && !jump && (
            <select
              aria-label="Episode range"
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="num h-9 rounded-control border border-line-strong bg-surface-2 px-2 text-sm text-ink"
            >
              {Array.from({ length: ranges }, (_, i) => {
                const first = episodes[i * RANGE]?.number;
                const last = episodes[Math.min((i + 1) * RANGE, episodes.length) - 1]?.number;
                return (
                  <option key={i} value={i}>
                    {first}–{last}
                  </option>
                );
              })}
            </select>
          )}
          {episodes.length > 24 && (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ep #"
              aria-label="Find episode number"
              value={jump}
              onChange={(e) => setJump(e.target.value.replace(/\D/g, ""))}
              className="num h-9 w-20 rounded-control border border-line-strong bg-surface-2 px-2.5 text-sm text-ink placeholder:text-muted"
            />
          )}
        </div>
      </div>

      <div
        ref={listRef}
        className={cn(scroll && "scroll-thin relative max-h-[26rem] overflow-y-auto lg:max-h-[calc(100svh-12rem)]")}
      >
        {visible.length === 0 ? (
          <p className="px-4 py-5 text-sm text-muted">No episode {jump}.</p>
        ) : titled ? (
          <ol>
            {visible.map((ep) => {
              const isCurrent = ep.number === current;
              return (
                <li key={ep.number} className="sheet-row last:border-b-0">
                  <Link
                    ref={isCurrent ? currentRef : undefined}
                    href={watchHref(animeId, ep.number)}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "group grid min-h-12 grid-cols-[3rem_1fr_auto] items-center gap-3 px-3 py-2 md:px-4",
                      isCurrent ? "bg-accent-2 text-on-accent-2" : "hover:bg-surface-2"
                    )}
                  >
                    <span className={cn("num text-sm font-semibold", !isCurrent && "text-muted")}>
                      {String(ep.number).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 truncate text-[0.9375rem]">
                      {ep.title || `Episode ${ep.number}`}
                    </span>
                    <span className="flex items-center text-xs">
                      {isCurrent ? <span className="font-semibold">Now playing</span> : status(ep)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <ol className="grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1.5 p-3 md:p-4">
            {visible.map((ep) => {
              const isCurrent = ep.number === current;
              return (
                <li key={ep.number}>
                  <Link
                    ref={isCurrent ? currentRef : undefined}
                    href={watchHref(animeId, ep.number)}
                    aria-current={isCurrent ? "page" : undefined}
                    aria-label={`Episode ${ep.number}`}
                    className={cn(
                      "num flex h-11 items-center justify-center rounded border text-sm font-semibold transition-colors",
                      isCurrent
                        ? "border-accent-2 bg-accent-2 text-on-accent-2"
                        : "border-line bg-surface-2 hover:border-accent hover:text-accent"
                    )}
                  >
                    {ep.number}
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
};

export default EpisodeList;
