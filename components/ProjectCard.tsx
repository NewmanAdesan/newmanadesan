import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { HoverVideo } from "./HoverVideo";
import { StackList } from "./StackList";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cover = project.cover ?? project.shots[0];
  const video = project.videos?.[0];

  return (
    <article className="group grid gap-6 border-t border-line py-10 md:grid-cols-[1fr_1.1fr] md:gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          {String(index + 1).padStart(2, "0")} · {project.period}
        </p>
        <h3 className="font-serif text-3xl tracking-tight">
          <Link href={`/work/${project.slug}`} className="hover:text-accent">
            {project.name}
          </Link>
        </h3>
        <p className="text-muted">{project.tagline}</p>
        <p className="leading-relaxed">{project.summary}</p>
        <StackList items={project.stack} />
        <Link
          href={`/work/${project.slug}`}
          className="mt-2 w-fit text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          Read the case study →
        </Link>
      </div>

      <Link
        href={`/work/${project.slug}`}
        aria-hidden="true"
        tabIndex={-1}
        className="relative block overflow-hidden rounded-lg border border-line bg-card"
      >
        {cover ? (
          <Image
            src={cover.src}
            alt=""
            width={1200}
            height={900}
            className="aspect-[4/3] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center p-8">
            <span className="font-serif text-4xl tracking-tight text-muted">{project.name}</span>
          </div>
        )}
        {cover && video && <HoverVideo video={video} />}
      </Link>
    </article>
  );
}
