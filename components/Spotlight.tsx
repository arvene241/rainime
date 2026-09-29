"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info, Play } from "@/components/icons";
import type { AnimeSummary } from "@/lib/types";
import { airedCount, animeHref, cleanDescription, cn, formatScore, titleCase, titleOf, watchHref } from "@/lib/utils";

/**
 * Trending spotlight. The strip beneath works like cels on a peg bar:
 * choosing one slides it over the current frame.
 */
const Spotlight = ({ items }: { items: AnimeSummary[] }) => {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  if (items.length === 0) return null;
  const current = items[index];

  const select = (i: number) => {
    if (i === index) return;
    setPrev(index);
    setIndex(i);
  };

  const facts = [
    titleCase(current.type),
    current.releaseDate,
    formatScore(current.rating) && `${formatScore(current.rating)} liked`,
    current.totalEpisodes ? `${current.totalEpisodes} episodes` : null,
  ].filter(Boolean);

  return (
    <section aria-label="Trending now" className="spotlight">
      <div className="spot-stage relative overflow-hidden bg-surface-2">
        {prev !== null && <Frame anime={items[prev]} key={`prev-${prev}`} />}
        <Frame anime={current} key={`cur-${index}`} entering={prev !== null} priority />

        <div className="spot-scrim absolute inset-0" aria-hidden="true" />

        <div className="spot-plate absolute inset-x-0 bottom-0 p-4 sm:p-6 md:max-w-2xl md:p-10">
          <div key={index} className="rise-in">
            <p className="mb-2 text-sm font-semibold text-accent">
              Trending #{index + 1}
            </p>
            <h2 className="display spot-title text-[2rem] sm:text-[2.5rem] md:text-5xl">
              <Link href={animeHref(current.id)} className="hover:underline">
                {titleOf(current.title)}
              </Link>
            </h2>
            {facts.length > 0 && (
              <p className="num mt-3 text-[0.8125rem] spot-muted">{facts.join("  ·  ")}</p>
            )}
            <p className="mt-3 line-clamp-2 hidden max-w-xl text-[0.9375rem] leading-relaxed spot-muted sm:[display:-webkit-box]">
              {cleanDescription(current.description)[0]}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {airedCount(current) > 0 && (
                <Link href={watchHref(current.id, 1)} className="btn btn-primary">
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Start watching
                </Link>
              )}
              <Link href={animeHref(current.id)} className="btn btn-secondary spot-secondary">
                <Info className="h-4 w-4" aria-hidden="true" />
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <div
          className="spot-strip scroll-thin -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 pt-3 sm:mx-0 sm:grid sm:overflow-visible sm:px-0"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
          role="group"
          aria-label="Choose a trending show"
        >
          {items.map((anime, i) => (
            <button
              key={anime.id}
              type="button"
              onClick={() => select(i)}
              aria-pressed={i === index}
              className={cn(
                "spot-cel group flex w-40 flex-none items-center gap-2.5 rounded-card p-1.5 pr-2 text-left transition-colors sm:w-auto",
                i === index ? "is-active" : "hover:bg-surface-2"
              )}
            >
              <span className="relative h-14 w-10 flex-none overflow-hidden rounded bg-surface-2">
                {anime.image && (
                  <Image src={anime.image} alt="" fill sizes="40px" className="object-cover" />
                )}
              </span>
              <span className="min-w-0">
                <span className="num block text-[0.6875rem] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="line-clamp-2 text-[0.8125rem] font-medium leading-tight">
                  {titleOf(anime.title)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

function Frame({
  anime,
  entering,
  priority,
}: {
  anime: AnimeSummary;
  entering?: boolean;
  priority?: boolean;
}) {
  const wide = anime.cover || anime.image;
  const tall = anime.image || anime.cover;
  return (
    <div className={cn("absolute inset-0", entering && "cel-enter")}>
      {tall && (
        <Image
          src={tall}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-top md:hidden"
        />
      )}
      {wide && (
        <Image
          src={wide}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1440px) 1440px, 100vw"
          className="hidden object-cover md:block"
        />
      )}
    </div>
  );
}

export default Spotlight;
