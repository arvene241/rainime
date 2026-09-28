"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Hls from "hls.js";
import { AlertTriangle, RotateCcw } from "lucide-react";
import type { Source } from "@/lib/types";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  sources: Source[];
  episodeId: string;
  poster?: string | null;
  title: string;
}

/** Order streams: adaptive "default"/"auto" first, then highest resolution. */
function rankSources(sources: Source[]) {
  const score = (s: Source) => {
    const q = (s.quality ?? "").toLowerCase();
    if (q === "default" || q === "auto") return 10_000;
    if (q === "backup") return -1;
    return parseInt(q, 10) || 0;
  };
  return [...sources].filter((s) => s.url).sort((a, b) => score(b) - score(a));
}

const labelFor = (s: Source) => {
  const q = (s.quality ?? "").toLowerCase();
  if (q === "default" || q === "auto") return "Auto";
  if (q === "backup") return "Backup";
  return s.quality || "Stream";
};

const storageKey = (id: string) => `rainime:pos:${id}`;

const VideoPlayer = ({ sources, episodeId, poster, title }: VideoPlayerProps) => {
  const ranked = useMemo(() => rankSources(sources), [sources]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const resumeAt = useRef<number | null>(null);

  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const source = ranked[sourceIndex];

  // Restore the saved position once per episode.
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(storageKey(episodeId)));
      resumeAt.current = saved > 5 ? saved : null;
    } catch {
      resumeAt.current = null;
    }
  }, [episodeId]);

  const indexRef = useRef(0);
  indexRef.current = sourceIndex;

  const fail = useCallback(() => {
    // Fall through to the next stream before giving up.
    if (indexRef.current + 1 < ranked.length) setSourceIndex(indexRef.current + 1);
    else setFailed(true);
  }, [ranked.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;
    let cancelled = false;
    setFailed(false);

    const seek = () => {
      if (resumeAt.current && video.duration && resumeAt.current < video.duration - 10) {
        video.currentTime = resumeAt.current;
      }
      resumeAt.current = null;
    };
    video.addEventListener("loadedmetadata", seek, { once: true });

    const isHls = source.isM3U8 ?? source.url.includes(".m3u8");
    const nativeHls = video.canPlayType("application/vnd.apple.mpegurl");

    if (!isHls || nativeHls) {
      video.src = source.url;
    } else {
      import("hls.js").then(({ default: HlsCtor }) => {
        if (cancelled) return;
        if (!HlsCtor.isSupported()) {
          setFailed(true);
          return;
        }
        const hls = new HlsCtor({ enableWorker: true });
        hlsRef.current = hls;
        hls.on(HlsCtor.Events.ERROR, (_e, data) => {
          if (!data.fatal) return;
          if (data.type === HlsCtor.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            fail();
          }
        });
        hls.loadSource(source.url);
        hls.attachMedia(video);
      });
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", seek);
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.removeAttribute("src");
      video.load();
    };
  }, [source, attempt, fail]);

  // Save progress every few seconds.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let last = 0;
    const onTime = () => {
      if (Math.abs(video.currentTime - last) < 5) return;
      last = video.currentTime;
      try {
        if (video.duration && video.currentTime > video.duration - 30) {
          localStorage.removeItem(storageKey(episodeId));
        } else {
          localStorage.setItem(storageKey(episodeId), String(Math.floor(video.currentTime)));
        }
      } catch {
        /* storage unavailable: resume is a convenience only */
      }
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [episodeId]);

  const changeSource = (i: number) => {
    const video = videoRef.current;
    if (video && video.currentTime > 0) resumeAt.current = video.currentTime;
    setSourceIndex(i);
  };

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-card bg-black">
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          poster={poster ?? undefined}
          onError={fail}
          aria-label={`Video player: ${title}`}
          className={cn("h-full w-full", failed && "invisible")}
        />
        {failed && (
          <div
            role="alert"
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
            style={{ color: "oklch(0.95 0.005 250)" }}
          >
            <AlertTriangle className="h-8 w-8 text-accent" aria-hidden="true" />
            <div>
              <p className="font-semibold">This stream won’t play</p>
              <p className="mt-1 max-w-sm text-sm opacity-80">
                Every source for this episode failed to load. The stream host may be down; try
                again, or pick another episode.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setSourceIndex(0);
                setAttempt((a) => a + 1);
                setFailed(false);
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
          </div>
        )}
      </div>

      {ranked.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="label mr-1 text-sm text-muted">Quality</span>
          {ranked.map((s, i) => (
            <button
              key={s.url}
              type="button"
              onClick={() => changeSource(i)}
              aria-pressed={i === sourceIndex}
              className={cn(
                "chip num",
                i === sourceIndex
                  ? "border-accent-2 bg-accent-2 text-on-accent-2"
                  : "hover:border-muted"
              )}
            >
              {labelFor(s)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
