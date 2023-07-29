"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <section className="w-full h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-8 text-center">
      <h1 className="text-9xl font-semibold">404</h1>
      <div>
        <h2 className="text-3xl pb-2">
          Oops, sorry we can&apos;t find that page!
        </h2>
        <p className="text-sm">
          Either something went wrong or the page doesn&apos;t exist anymore.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          <ArrowLeftCircle className="w-4 h-4 mr-2" />
          Back to Homepage
        </Link>
      </Button>
    </section>
  );
}
