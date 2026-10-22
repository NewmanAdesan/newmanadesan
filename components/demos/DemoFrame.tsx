import type { ReactNode } from "react";

// The frame every interactive demo sits in, so a visitor can tell a working demo from a screenshot.
export function DemoFrame({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <figure className="overflow-clip rounded-lg border border-line bg-card">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3 text-sm">
        <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        <span className="font-medium">Try it</span>
        <span className="text-muted">· {title}</span>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
      <figcaption className="border-t border-line px-4 py-3 text-sm leading-relaxed text-muted">{note}</figcaption>
    </figure>
  );
}
