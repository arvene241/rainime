"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60svh] flex-col items-start justify-center gap-5 py-16">
      <h1 className="display max-w-2xl text-4xl md:text-5xl">Something broke on our side</h1>
      <p className="max-w-prose text-muted">
        This page hit an unexpected error. Trying again usually fixes it; if it keeps happening,
        the anime API may be down.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary">
          Go home
        </Link>
      </div>
    </div>
  );
}
