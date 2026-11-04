import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Demo } from "@/components/demos/Demo";
import { InViewVideo } from "@/components/InViewVideo";
import { PageTransition, TitleTransition } from "@/components/Motion";
import type { Shot } from "@/content/projects";
import { projects } from "@/content/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const image = project.cover ?? project.shots[0];
  const url = `/work/${project.slug}/`;
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${project.name}: ${project.tagline}`,
      description: project.summary,
      url,
      images: [image ? { url: image.src, alt: image.alt } : { url: "/og.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: [image ? image.src : "/og.jpg"] },
  };
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const cover = project.cover ?? project.shots[0];
  const next = projects[(index + 1) % projects.length];
  const videos = project.videos ?? [];
  const leadVideo = project.videosLast ? undefined : videos[0];
  const moreVideos = project.videosLast ? videos : videos.slice(1);
  const leadShots = project.shots.slice(0, 2);
  const restShots = project.shots.slice(2);
  const h2 = "reveal mt-6 font-display text-4xl leading-none uppercase first:mt-0 md:mt-0";

  return (
    <PageTransition>
      <article>
        <div aria-hidden="true" className="read-progress fixed inset-x-0 top-0 z-50 h-0.5 bg-accent" />

        {/* Opening shot: the cover fills the screen behind the title, then drifts up and darkens as the story starts. */}
        <header className="relative flex min-h-[78svh] flex-col justify-end overflow-hidden">
          {cover && (
            <div aria-hidden="true" className="shot-drift absolute inset-0">
              <Image src={cover.src} alt="" fill priority sizes="100vw" className="object-cover object-top opacity-45 saturate-50" />
            </div>
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-paper from-15% via-paper/80 to-paper/30" />
          <div className="wrap relative flex flex-col gap-5 pt-24 pb-12">
            <Link href="/#work" transitionTypes={["nav-back"]} className="line-link self-start text-sm text-muted">
              All work
            </Link>
            <p className="rise text-lg">{project.tagline}</p>
            <TitleTransition slug={project.slug}>
              <h1 className="w-fit font-display text-[3.75rem] leading-[0.86] uppercase sm:text-8xl lg:text-[10rem]">
                {project.name}
              </h1>
            </TitleTransition>
          </div>
        </header>

        <div className="wrap">
        <section className="grid gap-8 border-b border-line py-12 md:grid-cols-12">
          <p className="rise text-xl leading-relaxed md:col-span-7 [--delay:120ms]">{project.summary}</p>
          <dl className="rise grid grid-cols-2 gap-6 text-sm md:col-span-4 md:col-start-9 [--delay:200ms]">
            <div>
              <dt className="text-muted">Role</dt>
              <dd className="mt-1">{project.role}</dd>
            </div>
            <div>
              <dt className="text-muted">Period</dt>
              <dd className="mt-1">{project.period}</dd>
            </div>
            {project.link && (
              <div className="col-span-2">
                <dt className="text-muted">Live</dt>
                <dd className="mt-1">
                  <a href={project.link.href} className="line-link text-accent">
                    {project.link.label}
                  </a>
                </dd>
              </div>
            )}
            <div className="col-span-2">
              <dt className="text-muted">Tools</dt>
              <dd className="mt-1 leading-relaxed">{project.stack.join(", ")}</dd>
            </div>
          </dl>
        </section>

        {leadVideo && (
          <div className="reveal mt-10">
            <InViewVideo video={leadVideo} />
          </div>
        )}

        {project.videosLast && leadShots.length > 0 && <Gallery shots={leadShots} label="Highlights" className="mt-10" />}

        <div className="mt-10 grid gap-x-10 gap-y-4 md:grid-cols-[1fr_2fr] md:gap-y-10">
          <h2 className={h2}>The problem</h2>
          <p className="reveal leading-relaxed">{project.context}</p>

          <h2 className={h2}>What I built</h2>
          <ul className="reveal flex list-disc flex-col gap-2 pl-5 leading-relaxed marker:text-accent">
            {project.built.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        {!project.videosLast && leadShots.length > 0 && <Gallery shots={leadShots} label="Highlights" className="mt-12" />}

        {(project.timeline || project.story) && (
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[1fr_2fr] md:gap-y-10">
            {project.timeline && (
              <>
                <h2 className={h2}>Five versions, one codebase</h2>
                <ol className="spine relative flex flex-col divide-y divide-line border-y border-line pl-4">
                  {project.timeline.map((step) => (
                    <li key={step.label} className="reveal grid grid-cols-[3rem_1fr] gap-3 py-3 leading-relaxed">
                      <span className="font-display text-lg text-accent">{step.label}</span>
                      <span>{step.text}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {project.story?.map((part) => (
              <div key={part.heading} className="contents">
                <h2 className={h2}>{part.heading}</h2>
                <p className="reveal whitespace-pre-line leading-relaxed">{part.body}</p>
                {part.demo && (
                  <div className="reveal mt-2 md:col-span-2 md:mt-0">
                    <Demo id={part.demo} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {restShots.length > 0 && <Gallery shots={restShots} label="More screenshots" className="mt-14" />}

        {moreVideos.length > 0 && (
          <section aria-label="Recordings" className="mt-14 grid gap-6">
            {moreVideos.map((video) => (
              <div key={video.src} className="reveal">
                <InViewVideo video={video} />
              </div>
            ))}
          </section>
        )}

        <nav aria-label="Next project" className="reveal mt-24 border-t border-line pt-10">
          <p className="text-sm text-muted">Next project</p>
          <Link
            href={`/work/${next.slug}`}
            transitionTypes={["nav-forward"]}
            className="press mt-2 inline-block font-display text-6xl leading-[0.88] uppercase sm:text-8xl"
          >
            <TitleTransition slug={next.slug}>
              <span className="inline-block">{next.name}</span>
            </TitleTransition>
          </Link>
        </nav>
        </div>
      </article>
    </PageTransition>
  );
}

function Gallery({ shots, label, className }: { shots: Shot[]; label: string; className: string }) {
  return (
    <section aria-label={label} className={`${className} grid gap-6 sm:grid-cols-2`}>
      {shots.map((shot) => (
        <figure key={shot.src} className="reveal overflow-hidden rounded-[3px] bg-card">
          <Image src={shot.src} alt={shot.alt} width={1200} height={900} className="w-full" />
          <figcaption className="px-4 py-3 text-sm text-muted">{shot.alt}</figcaption>
        </figure>
      ))}
    </section>
  );
}
