import { ViewTransition, type ReactNode } from "react";

// Every animation here is CSS (see "Motion" in globals.css). React's <ViewTransition> only names
// what the browser's View Transitions API should animate; browsers without it navigate as before.

const directional = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

// Pages slide a little in the direction of travel: forward into a case study, back to the list.
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={directional} exit={directional} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

// A project's name on its card (or the "Next project" link) glides into the case study heading.
export function TitleTransition({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <ViewTransition name={`title-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

// Drawn after the headline's last words, once, on load.
export function CheckMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="draw-check ml-[0.18em] inline-block size-[0.8em] align-[-0.06em] text-accent"
    >
      <path
        d="M3.5 12.8 9.2 18.2 20.5 5.8"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
