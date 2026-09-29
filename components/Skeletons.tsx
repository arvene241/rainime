import { gridClass } from "./CardGrid";
import { cn } from "@/lib/utils";

export const GridSkeleton = ({ count = 12, className }: { count?: number; className?: string }) => (
  <div className={cn(gridClass, className)} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <div key={i}>
        <div className="skeleton aspect-[2/3]" />
        <div className="skeleton mt-3 h-4 w-4/5" />
        <div className="skeleton mt-2 h-3 w-1/2" />
      </div>
    ))}
  </div>
);

export const HeadingSkeleton = () => <div className="skeleton mb-5 h-8 w-56" aria-hidden="true" />;

export const Loading = ({ children }: { children: React.ReactNode }) => (
  <div role="status" aria-live="polite">
    <span className="sr-only">Loading…</span>
    {children}
  </div>
);
