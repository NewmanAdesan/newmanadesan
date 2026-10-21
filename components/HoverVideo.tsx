"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/content/projects";

// Fades a recording in over the card's cover while the card is hovered.
// Only on devices with a mouse, and never with reduced motion. Nothing is downloaded until the first hover.
export function HoverVideo({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const card = el?.closest("article");
    if (!el || !card) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const enter = () => {
      el.play().then(() => setPlaying(true)).catch(() => {});
    };
    const leave = () => {
      el.pause();
      setPlaying(false);
    };
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    };
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
      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
