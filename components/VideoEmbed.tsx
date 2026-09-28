"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmbedSource =
  | { kind: "youtube"; id: string }
  | { kind: "youtube-playlist"; id: string }
  | { kind: "dailymotion"; id: string };

const srcOf = (s: EmbedSource) => {
  switch (s.kind) {
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${s.id}?autoplay=1&rel=0`;
    case "youtube-playlist":
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${s.id}&autoplay=1&rel=0`;
    case "dailymotion":
      return `https://www.dailymotion.com/embed/video/${s.id}?autoplay=1`;
  }
};

const thumbOf = (s: EmbedSource) =>
  s.kind === "youtube" ? `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg` : null;

interface VideoEmbedProps {
  source: EmbedSource;
  title: string;
  /** Artwork to show before the player loads, when the video has no thumbnail of its own. */
  poster?: string | null;
  label?: string;
  className?: string;
}

/**
 * Official video, loaded only when the viewer presses play so the page
 * doesn't pull in the provider's player (and its cookies) up front.
 */
const VideoEmbed = ({ source, title, poster, label = "Play", className }: VideoEmbedProps) => {
  const [active, setActive] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const thumb = (!thumbFailed && thumbOf(source)) || poster;

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-card bg-black", className)}>
      {active ? (
        <iframe
          src={srcOf(source)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={`${label}: ${title}`}
        >
          {thumb && (
            <Image
              src={thumb}
              alt=""
              fill
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-cover"
              onError={() => setThumbFailed(true)}
            />
          )}
          <span
            className="absolute inset-0"
            aria-hidden="true"
            style={{ background: "color-mix(in oklch, var(--scrim) 45%, transparent)" }}
          />
          <span className="btn btn-primary relative shadow-pop transition-transform group-hover:scale-[1.03]">
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            {label}
          </span>
        </button>
      )}
    </div>
  );
};

export default VideoEmbed;
