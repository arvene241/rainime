import { cn } from "@/lib/utils";

/** Wordmark with an animation peg bar: one round peg flanked by two flat ones. */
const Logo = ({ className }: { className?: string }) => (
  <span className={cn("flex items-center gap-2", className)}>
    <svg
      viewBox="0 0 32 14"
      width="32"
      height="14"
      aria-hidden="true"
      className="flex-none text-accent"
    >
      <rect x="0.5" y="8" width="31" height="5.5" rx="1.5" fill="currentColor" opacity="0.35" />
      <rect x="2.5" y="3.5" width="7" height="5.5" rx="1" fill="currentColor" />
      <circle cx="16" cy="5.5" r="3.5" fill="currentColor" />
      <rect x="22.5" y="3.5" width="7" height="5.5" rx="1" fill="currentColor" />
    </svg>
    <span className="display text-[1.3125rem] leading-none">rainime</span>
  </span>
);

export default Logo;
