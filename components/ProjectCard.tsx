import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { HoverVideo } from "./HoverVideo";
import { TitleTransition } from "./Motion";
import { StackList } from "./StackList";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cover = project.cover ?? project.shots[0];
  const video = project.videos?.[0];
  const hasDemo = project.story?.some((part) => part.demo);

  return (
    <article className="reveal group grid gap-6 border-t border-line py-10 md:grid-cols-[1fr_1.1fr] md:gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          {String(index + 1).padStart(2, "0")} · {project.period}
        </p>
        <h3 className="font-display text-3xl tracking-tight">
          <TitleTransition slug={project.slug}>
            <Link
              href={`/work/${project.slug}`}
              transitionTypes={["nav-forward"]}
              className="inline-block transition-colors hover:text-accent"
            >
              {project.name}
            </Link>
          </TitleTransition>
        </h3>
        <p className="text-muted">{project.tagline}</p>
        <p className="leading-relaxed">{project.summary}</p>
        <StackList items={project.stack} />
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <Link
            href={`/work/${project.slug}`}
            transitionTypes={["nav-forward"]}
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            Read the case study{" "}
            <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          {hasDemo && <span className="text-muted">Includes a live demo</span>}
        </p>
      </div>

      <Link
        href={`/work/${project.slug}`}
        transitionTypes={["nav-forward"]}
        aria-hidden="true"
        tabIndex={-1}
        className="relative block overflow-hidden rounded-lg border border-line bg-card transition duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.4)]"
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
            <span className="font-display text-4xl tracking-tight text-muted">{project.name}</span>
          </div>
        )}
        {cover && video && <HoverVideo video={video} />}
      </Link>
    </article>
  );
}
