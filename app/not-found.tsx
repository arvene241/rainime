import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60svh] flex-col items-start justify-center gap-5 py-16">
      <p className="num text-sm text-muted">404</p>
      <h1 className="display max-w-2xl text-4xl md:text-5xl">This page isn’t on the sheet</h1>
      <p className="max-w-prose text-muted">
        The link may be old, or the show was removed from the catalogue. Search for it by name, or
        start from what&apos;s new.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href="/" className="btn btn-primary">
          Go home
        </Link>
        <Link href="/recently-updated" className="btn btn-secondary">
          New episodes
        </Link>
      </div>
    </div>
  );
}
