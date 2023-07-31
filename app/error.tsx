"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <section className="w-full h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-8 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">
            <ArrowLeftCircle className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
        </Button>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </section>
  );
}
