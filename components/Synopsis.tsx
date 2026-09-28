"use client";

import { useState } from "react";

const Synopsis = ({ paragraphs }: { paragraphs: string[] }) => {
  const [open, setOpen] = useState(false);

  if (paragraphs.length === 0) {
    return <p className="text-muted">No synopsis has been written for this show yet.</p>;
  }

  const long = paragraphs.join(" ").length > 420;

  return (
    <div className="max-w-[68ch]">
      <div
        id="synopsis"
        className={long && !open ? "line-clamp-5" : undefined}
      >
        {paragraphs.map((p, i) => (
          <p key={i} className="mb-3 text-[0.9375rem] leading-relaxed last:mb-0">
            {p}
          </p>
        ))}
      </div>
      {long && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls="synopsis"
          onClick={() => setOpen((o) => !o)}
          className="mt-2 min-h-10 text-sm font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default Synopsis;
