// The tools behind a project, set as a quiet line of text rather than a row of pills.
export function StackList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <p className={`text-sm leading-relaxed text-muted ${className}`}>
      <span className="sr-only">Tools used: </span>
      {items.join(", ")}
    </p>
  );
}
