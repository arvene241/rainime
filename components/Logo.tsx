import { cn } from "@/lib/utils";

/**
 * Wordmark with the rainime mark: a punched animation sheet, laid slightly
 * askew on the desk, with three red-pencil rain strokes drawn across it.
 * Same drawing as app/icon.svg, without the tile.
 */
const Mark = ({ className }: { className?: string }) => (
  <svg viewBox="84 83 344 372" aria-hidden="true" className={cn("flex-none", className)}>
    <path
      fill="var(--ink)"
      fillRule="evenodd"
      transform="rotate(-8 256 270)"
      d="M122 104h268a14 14 0 0 1 14 14v302a14 14 0 0 1-14 14H122a14 14 0 0 1-14-14V118a14 14 0 0 1 14-14ZM160 136h28a12 12 0 0 1 0 24h-28a12 12 0 0 1 0-24ZM324 136h28a12 12 0 0 1 0 24h-28a12 12 0 0 1 0-24ZM239 148a17 17 0 1 0 34 0a17 17 0 1 0-34 0Z"
    />
    <path
      fill="var(--accent)"
      d="M233.3 198.3L145.2 397.2A20 20 0 0 0 182.8 410.8L242.7 201.7A5 5 0 0 0 233.3 198.3ZM319.8 194.5L249.1 349.9A18 18 0 0 0 282.9 362.1L328.2 197.5A4.5 4.5 0 0 0 319.8 194.5ZM386.2 248.6L337.9 348.9A15 15 0 0 0 366.1 359.1L393.8 251.4A4 4 0 0 0 386.2 248.6Z"
    />
  </svg>
);

const Logo = ({ className }: { className?: string }) => (
  <span className={cn("flex items-center gap-2", className)}>
    <Mark className="h-6 w-auto" />
    <span className="display text-[1.3125rem] leading-none">rainime</span>
  </span>
);

export default Logo;
