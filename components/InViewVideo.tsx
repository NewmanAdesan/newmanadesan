"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/content/projects";

// A muted, looping recording that plays only while it is on screen, on phones too.
// Reduced motion and data saver start it paused; the button always lets the visitor play or pause.
export function InViewVideo({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setAuto(!reduced && !saveData);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !auto || userPaused) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [auto, userPaused]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      setUserPaused(false);
      el.play().catch(() => {});
    } else {
      setUserPaused(true);
      el.pause();
    }
  };

  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="relative">
        <video
          ref={ref}
          src={video.src}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          aria-label={video.label}
          className="block w-full"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? `Play: ${video.label}` : `Pause: ${video.label}`}
          className="absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
        >
          {paused ? (
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          )}
        </button>
      </div>
      <figcaption className="px-4 py-3 text-sm text-muted">{video.label}</figcaption>
    </figure>
  );
}
