import { CheckMark, PageTransition } from "@/components/Motion";
import { ProjectCard } from "@/components/ProjectCard";
import { analysis, engineering, profile, projects } from "@/content/projects";

// The title card. Each line wipes up in turn on first load, then the card recedes as the first scene arrives.
const lines = ["I build software", "that solves the", "business problem,"];

export default function Home() {
  return (
    <PageTransition>
      <section className="hero-recede wrap flex min-h-[calc(100svh-4.5rem)] flex-col justify-center gap-8 py-16">
        <p className="wipe text-sm text-muted" style={{ "--i": 0 } as React.CSSProperties}>
          {profile.name}, {profile.title.toLowerCase()} and {profile.secondTitle.toLowerCase()}
        </p>
        <h1 className="font-display text-[3.4rem] leading-[0.9] uppercase min-[400px]:text-6xl sm:text-7xl lg:text-[6rem]">
          {lines.map((line, i) => (
            <span key={line} className="wipe block" style={{ "--i": i + 1 } as React.CSSProperties}>
              {line}
            </span>
          ))}
          <span className="wipe block text-accent" style={{ "--i": 4 } as React.CSSProperties}>
            then check that{" "}
            <span className="whitespace-nowrap">
              it did.
              <CheckMark />
            </span>
          </span>
        </h1>
        <div
          className="wipe flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          style={{ "--i": 5 } as React.CSSProperties}
        >
          <p className="max-w-md text-lg leading-relaxed text-muted">{profile.intro}</p>
          <p className="flex gap-6 text-sm">
            <a href={`mailto:${profile.email}`} className="line-link press font-medium text-accent">
              Email me
            </a>
            <a href="#work" className="line-link press">
              Watch the work <span aria-hidden="true" className="scroll-cue inline-block">↓</span>
            </a>
          </p>
        </div>
      </section>

      <section id="work" aria-label="Selected work" className="scroll-mt-16">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </section>

      <section id="about" className="wrap scroll-mt-20 grid gap-12 border-t border-line py-24 sm:py-32 md:grid-cols-12">
        <h2 className="reveal font-display text-6xl leading-none uppercase sm:text-8xl md:col-span-5">About</h2>
        <div className="reveal flex flex-col gap-5 md:col-span-7">
          <p className="text-xl leading-relaxed">
            I have been building web products for clients since 2023, usually as the person responsible for the
            whole frontend. I work closely with founders and backend developers, and I like understanding the
            business problem before I write code.
          </p>
          <p className="leading-relaxed text-muted">{profile.education}</p>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 md:col-span-7 md:col-start-6">
          <div className="reveal">
            <h3 className="mb-5 font-display text-3xl uppercase">Solution analysis</h3>
            <ul className="flex flex-col gap-6">
              {analysis.map((item) => (
                <li key={item.name} className="flex flex-col gap-1">
                  <a href={item.href} className="line-link self-start font-medium">
                    {item.name}
                  </a>
                  <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <h3 className="mb-5 font-display text-3xl uppercase">Engineering</h3>
            <ul className="flex flex-col gap-6">
              {engineering.map((item) => (
                <li key={item.name} className="flex flex-col gap-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="reveal wrap scroll-mt-20 border-t border-line pt-24 sm:pt-32">
        <h2 className="font-display text-7xl leading-[0.88] uppercase sm:text-9xl lg:text-[11rem]">Let&apos;s talk.</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <p className="text-lg leading-relaxed text-muted md:col-span-5">
            I&apos;m open to frontend roles and to building products with businesses that need them.
          </p>
          <ul className="flex flex-col gap-3 text-lg md:col-span-5 md:col-start-8">
            <li>
              <a href={`mailto:${profile.email}`} className="line-link break-all">
                {profile.email}
              </a>
            </li>
            <li>
              <a href={profile.github} className="line-link">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.linkedin} className="line-link">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </section>
    </PageTransition>
  );
}
