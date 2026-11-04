import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { HoverVideo } from "./HoverVideo";
import { StackList } from "./StackList";

// One project on the home page. Text sits in a narrow left column; the cover takes the wider right side
// and starts lower than the title, so the two columns never line up into a card.
export function ProjectCard({ project }: { project: Project }) {
  const cover = project.cover ?? project.shots[0];
  const video = project.videos?.[0];
  const hasDemo = project.story?.some((part) => part.demo);

  return (
    <article className="group grid gap-8 py-16 sm:py-20 md:grid-cols-12 md:gap-x-8">
      <div className="flex flex-col gap-5 md:col-span-4">
        <p className="text-sm text-muted">{project.period}</p>
        <h3 className="font-display text-5xl leading-[0.95] sm:text-6xl">
          <Link href={`/work/${project.slug}`}>{project.name}</Link>
        </h3>
        <p className="text-lg leading-snug">{project.tagline}</p>
        <p className="leading-relaxed text-muted">{project.summary}</p>
        <StackList items={project.stack} />
        <p className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          <Link href={`/work/${project.slug}`} className="link link-ruled font-medium text-accent">
            Read the case study
          </Link>
          {hasDemo && <span className="text-muted">Includes a live demo</span>}
        </p>
      </div>

      <Link
        href={`/work/${project.slug}`}
        aria-hidden="true"
        tabIndex={-1}
        className="relative block overflow-hidden rounded-[3px] bg-card md:col-span-8 md:mt-24"
      >
        {cover ? (
          <Image
            src={cover.src}
            alt=""
            width={1200}
            height={900}
            className="lean aspect-[4/3] w-full object-cover object-top"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center p-8">
            <span className="font-display text-5xl text-muted">{project.name}</span>
          </div>
        )}
        {cover && video && <HoverVideo video={video} />}
      </Link>
    </article>
  );
}
