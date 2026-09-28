"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink, Play, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmbedSource =
  | { kind: "youtube"; id: string }
  | { kind: "youtube-playlist"; id: string }
  | { kind: "dailymotion"; id: string };

export const watchUrlOf = (s: EmbedSource) => {
  switch (s.kind) {
    case "youtube":
      return `https://www.youtube.com/watch?v=${s.id}`;
    case "youtube-playlist":
      return `https://www.youtube.com/playlist?list=${s.id}`;
    case "dailymotion":
      return `https://www.dailymotion.com/video/${s.id}`;
  }
};

const thumbOf = (s: EmbedSource) =>
  s.kind === "youtube" ? `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg` : null;

/** Plain-language reason for a YouTube IFrame API error code. */
function reasonFor(code: number | null, source: EmbedSource) {
  const playlist = source.kind === "youtube-playlist";
  switch (code) {
    case 100:
      return playlist
        ? "These videos were removed or made private on YouTube."
        : "This video was removed or made private on YouTube.";
    case 101:
    case 150:
      return "The uploader only allows playback on YouTube itself, or blocks it in your country. Try opening it on YouTube; if it’s blocked there too, use another streaming service.";
    case 2:
      return "YouTube didn’t recognise this video link.";
    case 5:
      return "Your browser couldn’t play this video.";
    default:
      return "YouTube couldn’t load the player. It may be blocked on this network.";
  }
}

/* Minimal typing for the YouTube IFrame Player API. */
interface YTPlayer {
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement | string,
    opts: {
      host?: string;
      videoId?: string;
      playerVars?: Record<string, string | number>;
      events?: { onError?: (e: { data: number }) => void };
    }
  ) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApi: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!ytApi) {
    ytApi = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        if (window.YT) resolve(window.YT);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        ytApi = null;
        reject(new Error("YouTube player failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return ytApi;
}

interface VideoEmbedProps {
  source: EmbedSource;
  title: string;
  /** Artwork to show before the player loads, when the video has no thumbnail of its own. */
  poster?: string | null;
  label?: string;
  /** Shown under the error message when the video won't play (e.g. other services). */
  fallback?: React.ReactNode;
  /** Shown under the player unless it failed. */
  note?: React.ReactNode;
  className?: string;
}

/**
 * Official video, loaded only when the viewer presses play so the page
 * doesn't pull in the provider's player (and its cookies) up front.
 * YouTube runs through its IFrame API so a blocked or removed video turns
 * into a clear message and a link instead of YouTube's "Video unavailable".
 */
const VideoEmbed = ({ source, title, poster, label = "Play", fallback, note, className }: VideoEmbedProps) => {
  const [state, setState] = useState<"idle" | "playing" | "failed">("idle");
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [thumbFailed, setThumbFailed] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const thumb = (!thumbFailed && thumbOf(source)) || poster;

  useEffect(() => {
    if (state !== "playing" || source.kind === "dailymotion" || !mountRef.current) return;
    let player: YTPlayer | null = null;
    let cancelled = false;
    // YouTube replaces its target element, so give it one React doesn't own.
    const host = mountRef.current;
    const target = document.createElement("div");
    host.appendChild(target);

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        player = new YT.Player(target, {
          host: "https://www.youtube-nocookie.com",
          ...(source.kind === "youtube" ? { videoId: source.id } : {}),
          playerVars: {
            autoplay: 1,
            rel: 0,
            playsinline: 1,
            origin: window.location.origin,
            ...(source.kind === "youtube-playlist" ? { listType: "playlist", list: source.id } : {}),
          },
          // 2: bad id, 5: HTML5 error, 100: removed/private, 101/150: embedding blocked (owner or region).
          events: {
            onError: (e) => {
              setErrorCode(e.data);
              setState("failed");
            },
          },
        });
      })
      .catch(() => !cancelled && setState("failed"));

    return () => {
      cancelled = true;
      player?.destroy();
      host.replaceChildren();
    };
  }, [state, source]);

  const frame = cn("relative aspect-video w-full overflow-hidden rounded-card bg-black", className);

  if (state === "failed") {
    return (
      <div className={frame}>
        {thumb && <Image src={thumb} alt="" fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ background: "color-mix(in oklch, var(--scrim) 86%, transparent)" }}
        />
        <div
          role="alert"
          className="relative flex h-full flex-col items-start justify-center gap-3 p-5 sm:p-8"
          style={{ color: "oklch(0.97 0.005 250)" }}
        >
          <TriangleAlert className="h-6 w-6 text-accent" aria-hidden="true" />
          <p className="display text-lg sm:text-xl">This video can’t play here</p>
          <p className="max-w-md text-sm" style={{ color: "oklch(0.86 0.012 250)" }}>
            {reasonFor(errorCode, source)}
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={watchUrlOf(source)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Open on {source.kind === "dailymotion" ? "Dailymotion" : "YouTube"}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          {fallback}
          {errorCode != null && (
            <p className="num text-xs" style={{ color: "oklch(0.72 0.012 250)" }}>
              YouTube error {errorCode}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
    <div className={frame}>
      {state === "playing" ? (
        source.kind === "dailymotion" ? (
          <iframe
            src={`https://www.dailymotion.com/embed/video/${source.id}?autoplay=1`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div ref={mountRef} className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full" />
        )
      ) : (
        <button
          type="button"
          onClick={() => setState("playing")}
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
    {note}
    </>
  );
};

export default VideoEmbed;
