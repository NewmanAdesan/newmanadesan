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
  const sectionGrid = "grid grid-cols-1 gap-y-5 md:grid-cols-12 md:gap-x-8";
  const h2 = "font-display text-[1.75rem] sm:text-3xl leading-tight md:col-span-4 md:sticky md:top-24 md:self-start";
  const prose = "leading-relaxed text-[1.0625rem] md:col-span-7 md:col-start-6";

  return (
    <article className="pt-10 sm:pt-14">
      <Link href="/#work" className="link text-sm text-muted">
        All work
      </Link>

      <header className="grid grid-cols-1 gap-y-8 pt-14 pb-16 sm:pt-20 sm:pb-24 md:grid-cols-12 md:gap-x-8">
        <p className="settle text-muted md:col-span-12" style={{ "--i": 0 } as React.CSSProperties}>
          {project.tagline}
        </p>
        <h1
          className="settle font-display text-[3.25rem] leading-[0.92] sm:text-8xl lg:text-[8.5rem] md:col-span-12"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {project.name}
        </h1>
        <p
          className="settle text-xl leading-relaxed md:col-span-6 md:col-start-6 md:mt-6"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {project.summary}
        </p>

        <dl
          className="settle grid grid-cols-2 gap-6 text-sm md:col-span-4 md:col-start-1 md:row-start-3 md:mt-7 md:grid-cols-1"
          style={{ "--i": 3 } as React.CSSProperties}
        >
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
                <a href={project.link.href} className="link link-ruled text-accent">
                  {project.link.label}
                </a>
              </dd>
            </div>
          )}
          <div className="col-span-2 md:col-span-1">
            <dt className="text-muted">Tools</dt>
            <dd className="mt-1">
              <StackList items={project.stack} className="text-ink" />
            </dd>
          </div>
        </dl>
      </header>

      {leadVideo && <InViewVideo video={leadVideo} />}

      {project.videosLast && leadShots.length > 0 && <Gallery shots={leadShots} label="Highlights" />}

      <div className="mt-24 flex flex-col gap-20 sm:mt-32 sm:gap-28">
        <section className={sectionGrid}>
          <h2 className={h2}>The problem</h2>
          <p className={prose}>{project.context}</p>
        </section>

        <section className={sectionGrid}>
          <h2 className={h2}>What I built</h2>
          <ul className={`${prose} flex list-disc flex-col gap-3 pl-5 marker:text-accent`}>
            {project.built.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </div>

      {!project.videosLast && leadShots.length > 0 && (
        <div className="mt-24 sm:mt-32">
          <Gallery shots={leadShots} label="Highlights" />
        </div>
      )}

      {(project.timeline || project.story) && (
        <div className="mt-24 flex flex-col gap-20 sm:mt-32 sm:gap-28">
          {project.timeline && (
            <section className={sectionGrid}>
              <h2 className={h2}>Five versions, one codebase</h2>
              <ol className="flex flex-col divide-y divide-line border-y border-line md:col-span-7 md:col-start-6">
                {project.timeline.map((step) => (
                  <li key={step.label} className="grid grid-cols-[3.5rem_1fr] gap-4 py-4 leading-relaxed">
                    <span className="font-display text-2xl leading-none text-accent">{step.label}</span>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {project.story?.map((part) => (
            <section key={part.heading} className={sectionGrid}>
              <h2 className={h2}>{part.heading}</h2>
              <Story body={part.body} className={prose} />
              {part.demo && (
                <div className="mt-6 md:col-span-10 md:col-start-3">
                  <Demo id={part.demo} />
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {restShots.length > 0 && (
        <div className="mt-24 sm:mt-32">
          <Gallery shots={restShots} label="More screenshots" />
        </div>
      )}

      {moreVideos.length > 0 && (
        <section aria-label="Recordings" className="mt-24 grid gap-12 sm:mt-32">
          {moreVideos.map((video) => (
            <InViewVideo key={video.src} video={video} />
          ))}
        </section>
      )}

      <nav aria-label="Next project" className="group mt-32 border-t border-line pt-10">
        <Link href={`/work/${next.slug}`} className="grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-x-8">
          <span className="text-sm text-muted md:col-span-4 md:pt-5">Next project</span>
          <span className="font-display text-5xl leading-none sm:text-8xl md:col-span-8">
            <span className="lean inline-block origin-left">{next.name}</span>
          </span>
        </Link>
      </nav>
    </article>
  );
}

// A story opens with its first sentence set larger, so a skimmer gets the point of each section.
function Story({ body, className }: { body: string; className: string }) {
  const match = body.match(/^(.+?[.!?])\s+([\s\S]*)$/);
  const lede = match ? match[1] : body;
  const rest = match ? match[2] : "";
  return (
    <div className={`${className} flex flex-col gap-4`}>
      <p className="text-xl leading-snug font-medium">{lede}</p>
      {rest && <p className="whitespace-pre-line">{rest}</p>}
    </div>
  );
}

// Screenshots in an uneven rhythm: one wide, one narrow and set lower, then the reverse.
const SPANS = [
  "md:col-span-7",
  "md:col-span-5 md:mt-20",
  "md:col-span-5",
  "md:col-span-7 md:mt-20",
];

function Gallery({ shots, label }: { shots: Shot[]; label: string }) {
  return (
    <section aria-label={label} className="grid gap-12 md:grid-cols-12 md:gap-x-8">
      {shots.map((shot, i) => (
        <figure key={shot.src} className={SPANS[i % SPANS.length]}>
          <div className="overflow-hidden rounded-[3px] bg-card">
            <Image src={shot.src} alt={shot.alt} width={1200} height={900} className="w-full" />
          </div>
          <figcaption className="pt-3 text-sm leading-relaxed text-muted">{shot.alt}</figcaption>
        </figure>
      ))}
    </section>
  );
}
