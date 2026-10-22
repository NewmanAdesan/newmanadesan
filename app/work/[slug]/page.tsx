import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Demo } from "@/components/demos/Demo";
import { InViewVideo } from "@/components/InViewVideo";
import { StackList } from "@/components/StackList";
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
  const next = projects[(index + 1) % projects.length];
  const videos = project.videos ?? [];
  const leadVideo = project.videosLast ? undefined : videos[0];
  const moreVideos = project.videosLast ? videos : videos.slice(1);
  const leadShots = project.shots.slice(0, 2);
  const restShots = project.shots.slice(2);
  const h2 = "mt-6 font-display text-2xl tracking-tight first:mt-0 md:mt-0";

  return (
    <article className="py-12 sm:py-16">
      <Link href="/#work" className="text-sm text-muted hover:text-ink">
        ← All work
      </Link>

      <header className="mt-8 flex flex-col gap-4 border-b border-line pb-10">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">{project.tagline}</p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{project.name}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p>

        <dl className="mt-4 grid gap-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Role</dt>
            <dd className="mt-1">{project.role}</dd>
          </div>
          <div>
            <dt className="text-muted">Period</dt>
            <dd className="mt-1">{project.period}</dd>
          </div>
          {project.link && (
            <div>
              <dt className="text-muted">Live</dt>
              <dd className="mt-1">
                <a href={project.link.href} className="text-accent underline-offset-4 hover:underline">
                  {project.link.label} ↗
                </a>
              </dd>
            </div>
          )}
        </dl>
        <StackList items={project.stack} />
      </header>

      {leadVideo && (
        <div className="mt-10">
          <InViewVideo video={leadVideo} />
        </div>
      )}

      {project.videosLast && leadShots.length > 0 && <Gallery shots={leadShots} label="Highlights" className="mt-10" />}

      <div className="mt-10 grid gap-x-10 gap-y-4 md:grid-cols-[1fr_2fr] md:gap-y-10">
        <h2 className={h2}>The problem</h2>
        <p className="leading-relaxed">{project.context}</p>

        <h2 className={h2}>What I built</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed marker:text-accent">
          {project.built.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      {!project.videosLast && leadShots.length > 0 && <Gallery shots={leadShots} label="Highlights" className="mt-12" />}

      {(project.timeline || project.story) && (
        <div className="mt-12 grid gap-x-10 gap-y-4 md:grid-cols-[1fr_2fr] md:gap-y-10">
          {project.timeline && (
            <>
              <h2 className={h2}>Five versions, one codebase</h2>
              <ol className="flex flex-col divide-y divide-line border-y border-line">
                {project.timeline.map((step) => (
                  <li key={step.label} className="grid grid-cols-[3rem_1fr] gap-3 py-3 leading-relaxed">
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
              <p className="whitespace-pre-line leading-relaxed">{part.body}</p>
              {part.demo && (
                <div className="mt-2 md:col-span-2 md:mt-0">
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
            <InViewVideo key={video.src} video={video} />
          ))}
        </section>
      )}

      <nav aria-label="Next project" className="mt-16 border-t border-line pt-8">
        <p className="text-sm text-muted">Next project</p>
        <Link href={`/work/${next.slug}`} className="font-display text-2xl tracking-tight hover:text-accent">
          {next.name} →
        </Link>
      </nav>
    </article>
  );
}

function Gallery({ shots, label, className }: { shots: Shot[]; label: string; className: string }) {
  return (
    <section aria-label={label} className={`${className} grid gap-6 sm:grid-cols-2`}>
      {shots.map((shot) => (
        <figure key={shot.src} className="overflow-hidden rounded-lg border border-line bg-card">
          <Image src={shot.src} alt={shot.alt} width={1200} height={900} className="w-full" />
          <figcaption className="px-4 py-3 text-sm text-muted">{shot.alt}</figcaption>
        </figure>
      ))}
    </section>
  );
}
