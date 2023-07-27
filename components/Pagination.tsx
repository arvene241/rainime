"use client";

import { Button } from "@/components/ui/button";
import { recentPageStore } from "@/lib/context";

const Pagination = () => {
  const increase = recentPageStore((state) => state.increase);
  const decrease = recentPageStore((state) => state.decrease);
  const page = recentPageStore((state) => state.page);

  return (
    <div className="flex gap-5">
      {page === 1 ? (
        <Button disabled onClick={() => decrease(1)}>
          Previous Page
        </Button>
      ) : (
        <Button onClick={() => decrease(1)}>Previous Page</Button>
      )}

      <Button onClick={() => increase(1)}>Next Page</Button>
    </div>
  );
};

export default Pagination;
