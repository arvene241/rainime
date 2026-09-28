import { cn } from "@/lib/utils";

/** Poster grid: 2 columns on phones up to 6 on wide screens. */
export const gridClass =
  "grid grid-cols-2 gap-x-3 gap-y-6 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-x-4";

const CardGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <ul className={cn(gridClass, className)}>{children}</ul>;

export default CardGrid;
