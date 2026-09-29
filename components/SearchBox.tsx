"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Spinner, Search, Close } from "@/components/icons";
import type { AnimeSummary } from "@/lib/types";
import { animeHref, cn, titleCase, titleOf } from "@/lib/utils";

type Status = "idle" | "loading" | "done" | "error";

const SearchBox = () => {
  const router = useRouter();
  const pathname = usePathname();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeSummary[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [expanded, setExpanded] = useState(false); // small screens only

  // Reset when the route changes.
  useEffect(() => {
    setOpen(false);
    setExpanded(false);
    setQuery("");
    setResults([]);
    setStatus("idle");
  }, [pathname]);

  // Debounced, cancellable suggestions.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const data: { results: AnimeSummary[] } = await res.json();
        setResults(data.results.slice(0, 6));
        setActive(-1);
        setStatus("done");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setStatus("error");
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        if (!query) setExpanded(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [query]);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && results[active]) {
      router.push(animeHref(results[active].id));
      return;
    }
    const q = query.trim();
    if (q) router.push(`/search?keyword=${encodeURIComponent(q)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
      if (!query) setExpanded(false);
    }
  };

  const showPanel = open && query.trim().length >= 2;

  return (
    <div
      ref={rootRef}
      className={cn(
        "sm:relative sm:w-full sm:max-w-sm",
        expanded && "absolute inset-x-0 top-0 z-10 flex h-16 items-center bg-bg px-4"
      )}
    >
      <button
        type="button"
        className={cn("btn btn-ghost btn-icon sm:hidden", expanded && "hidden")}
        aria-label="Search"
        onClick={() => setExpanded(true)}
      >
        <Search className="h-5 w-5" />
      </button>

      <form
        role="search"
        onSubmit={submit}
        className={cn("relative w-full", !expanded && "hidden sm:block")}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search anime
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search by title"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={`${listId}-list`}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
          className="h-11 w-full rounded-control border border-line-strong bg-surface pl-9 pr-10 text-[0.9375rem] text-ink placeholder:text-muted focus:border-accent-2 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {status === "loading" ? (
          <Spinner
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted"
            aria-hidden="true"
          />
        ) : (
          (query || expanded) && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                if (!query) setExpanded(false);
                inputRef.current?.focus();
              }}
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-control text-muted hover:text-ink"
            >
              <Close className="h-4 w-4" />
            </button>
          )
        )}

        {showPanel && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-card border bg-surface shadow-pop">
            <ul id={`${listId}-list`} role="listbox" aria-label="Suggestions">
              {results.map((r, i) => (
                <li
                  key={r.id}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                >
                  <a
                    href={animeHref(r.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(animeHref(r.id));
                    }}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2",
                      i === active && "bg-surface-2"
                    )}
                  >
                    <span className="relative h-14 w-10 flex-none overflow-hidden rounded bg-surface-2">
                      {r.image && (
                        <Image src={r.image} alt="" fill sizes="40px" className="object-cover" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{titleOf(r.title)}</span>
                      <span className="block text-xs text-muted">
                        {[titleCase(r.type), r.releaseDate].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {status === "done" && results.length === 0 && (
              <p className="px-4 py-5 text-sm text-muted">
                No titles match &ldquo;{query.trim()}&rdquo;. Try the English or Japanese name.
              </p>
            )}
            {status === "error" && (
              <p className="px-4 py-5 text-sm text-muted">
                Suggestions are unavailable right now. Press Enter to search anyway.
              </p>
            )}
            {status === "loading" && results.length === 0 && (
              <p className="px-4 py-5 text-sm text-muted">Searching…</p>
            )}
            {results.length > 0 && (
              <button
                type="submit"
                className="block w-full border-t px-4 py-3 text-left text-sm font-medium text-ink hover:bg-surface-2"
              >
                See all results for &ldquo;{query.trim()}&rdquo;
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBox;
