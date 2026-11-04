"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/content/projects";

// Plays a project's recording over its cover while the scene fills most of the screen, and pauses when it leaves.
// Nothing downloads until the scene is first in view. Reduced motion keeps the still cover.
export function StageVideo({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          el.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={video.src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
