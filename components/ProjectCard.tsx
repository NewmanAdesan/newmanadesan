import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { TitleTransition } from "./Motion";
import { StageVideo } from "./StageVideo";

// One project as a scene. On wide screens the scene pins while its frame opens out to fill the screen,
// then the title card fades up over it (see "Cinematic scenes" in globals.css). On phones it is a tall
// still with the copy beneath, because pinned scroll scenes fight touch scrolling.
export function ProjectCard({ project }: { project: Project }) {
  const cover = project.cover ?? project.shots[0];
  const video = project.videos?.[0];
  const hasDemo = project.story?.some((part) => part.demo);
  const href = `/work/${project.slug}`;

  return (
    <article className="stage relative">
      <div className="stage-pin">
        <div className="stage-frame relative aspect-[4/5] overflow-hidden bg-card sm:aspect-[16/10] md:absolute md:inset-0 md:aspect-auto">
          <div className="stage-media absolute inset-0">
            {cover ? (
              <Image
                src={cover.src}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-6xl uppercase text-muted">{project.name}</span>
              </div>
            )}
            {cover && video && <StageVideo video={video} />}
          </div>
          <div
            aria-hidden="true"
            className="stage-shade absolute inset-0 hidden bg-gradient-to-t from-paper from-10% via-paper/85 via-40% to-paper/10 md:block"
          />
        </div>

        <div className="stage-copy wrap relative flex flex-col gap-4 pt-8 pb-20 md:absolute md:inset-x-0 md:bottom-0 md:pt-0 md:pb-16">
          <p className="text-sm text-muted">{project.period}</p>
          <h3 className="font-display text-6xl leading-[0.88] uppercase sm:text-7xl md:text-8xl lg:text-9xl">
            <TitleTransition slug={project.slug}>
              <Link href={href} transitionTypes={["nav-forward"]} className="inline-block">
                {project.name}
              </Link>
            </TitleTransition>
          </h3>
          <div className="grid gap-4 md:max-w-3xl md:grid-cols-2 md:gap-8">
            <p className="text-lg leading-snug">{project.tagline}</p>
            <p className="leading-relaxed text-muted">{project.proof}</p>
          </div>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm">
            <Link href={href} transitionTypes={["nav-forward"]} className="line-link press font-medium text-accent">
              Open the case study
            </Link>
            {hasDemo && <span className="text-muted">Includes a live demo</span>}
          </p>
        </div>
      </div>
    </article>
  );
}
