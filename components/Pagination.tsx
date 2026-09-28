import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  hasNextPage: boolean;
  /** Builds the href for a given page number. */
  hrefFor: (page: number) => string;
}

const Pagination = ({ page, hasNextPage, hrefFor }: PaginationProps) => {
  if (page <= 1 && !hasNextPage) return null;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="btn btn-secondary" rel="prev">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Link>
      ) : (
        <span className="btn btn-secondary" aria-disabled="true">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </span>
      )}
      <span className="num text-sm text-muted">Page {page}</span>
      {hasNextPage ? (
        <Link href={hrefFor(page + 1)} className="btn btn-secondary" rel="next">
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className="btn btn-secondary" aria-disabled="true">
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
};

export default Pagination;
