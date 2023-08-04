"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

interface PaginationProps {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  route: string;
  param?: string;
  value?: string | string[] | undefined;
}

// @param hasPrevPage: to know when to disabled the previous button
//        hasNextPage: to know when to disabled the next button
//        route: the actual route of the page, ex: recent, trending, and popular
//        param: for api calls like page, and perPage
//        value: for actual value of the param like page=1, perPage=20

const Pagination = ({
  hasPrevPage,
  hasNextPage,
  route,
  param,
  value,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  return (
    <>
      {param ? (
        <div className="flex gap-5 my-4">
          <Button
            disabled={!hasPrevPage}
            onClick={() => {
              router.push(`/${route}?${param}=${value}&page=${page - 1}`);
            }}
          >
            Previous Page
          </Button>
          <Button
            disabled={!hasNextPage}
            onClick={() => {
              router.push(`/${route}?${param}=${value}&page=${page + 1}`);
            }}
          >
            Next Page
          </Button>
        </div>
      ) : (
        <div className="flex gap-5 my-4">
          <Button
            disabled={!hasPrevPage}
            onClick={() => {
              router.push(`/${route}?page=${page - 1}`);
            }}
          >
            Previous Page
          </Button>
          <Button
            disabled={!hasNextPage}
            onClick={() => {
              router.push(`/${route}?page=${page + 1}`);
            }}
          >
            Next Page
          </Button>
        </div>
      )}
    </>
  );
};

export default Pagination;
