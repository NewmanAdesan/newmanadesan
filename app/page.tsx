import Image from "next/image";
import { CheckMark, PageTransition } from "@/components/Motion";
import { ProjectCard } from "@/components/ProjectCard";
import { analysis, engineering, profile, projects } from "@/content/projects";

export default function Home() {
  return (
    <PageTransition>
      <section className="grid items-center gap-10 py-16 sm:py-24 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <p className="rise text-sm uppercase tracking-[0.18em] text-accent">
            {profile.title} · {profile.secondTitle}
          </p>
          <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            I build software that solves the business problem, then check that{" "}
            <span className="whitespace-nowrap">
              it did.
              <CheckMark />
            </span>
          </h1>
          <p className="rise max-w-xl text-lg leading-relaxed text-muted [--delay:120ms]">{profile.intro}</p>
          <div className="rise flex flex-wrap gap-3 text-sm [--delay:220ms]">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full bg-ink px-5 py-2.5 font-medium text-paper transition hover:opacity-85 active:scale-[0.97]"
            >
              Email me
            </a>
            <a
              href="#work"
              className="rounded-full border border-line px-5 py-2.5 transition hover:border-ink active:scale-[0.97]"
            >
              See my work
            </a>
          </div>
        </div>
        <Image
          src="/newman.jpg"
          alt={`Portrait of ${profile.name}`}
          width={450}
          height={450}
          priority
          className="rise mx-auto w-56 rounded-2xl border border-line object-cover [--delay:160ms] sm:w-72"
        />
      </section>

      <section id="work" className="scroll-mt-20 py-8">
        <div className="reveal">
          <h2 className="mb-2 font-display text-2xl tracking-tight">Selected work</h2>
          <p className="mb-6 text-muted">Products I have built for clients, most of them live.</p>
        </div>
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </section>

      <section id="about" className="scroll-mt-20 grid gap-12 border-t border-line py-16 md:grid-cols-2">
        <div className="reveal flex flex-col gap-4">
          <h2 className="font-display text-2xl tracking-tight">About</h2>
          <p className="leading-relaxed">
            I have been building web products for clients since 2023, usually as the
            person responsible for the whole frontend. I work closely with founders and backend developers,
            and I like understanding the business problem before I write code.
          </p>
          <p className="leading-relaxed text-muted">{profile.education}</p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="reveal">
            <h3 className="mb-3 text-sm uppercase tracking-[0.18em] text-accent">Solution analysis</h3>
            <ul className="flex flex-col gap-4">
              {analysis.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="font-medium underline-offset-4 hover:underline">
                    {item.name} ↗
                  </a>
                  <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <h3 className="mb-3 text-sm uppercase tracking-[0.18em] text-accent">Engineering</h3>
            <ul className="flex flex-col gap-4">
              {engineering.map((item) => (
                <li key={item.name}>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="reveal scroll-mt-20 border-t border-line py-16">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Let&apos;s talk.</h2>
        <p className="mt-3 max-w-xl text-muted">
          I&apos;m open to frontend roles and to building products with businesses that need them.
        </p>
        <ul className="mt-6 flex flex-col gap-2 text-lg">
          <li>
            <a href={`mailto:${profile.email}`} className="underline-offset-4 hover:underline">
              {profile.email}
            </a>
          </li>
          <li>
            <a href={profile.github} className="underline-offset-4 hover:underline">
              GitHub
            </a>
          </li>
          <li>
            <a href={profile.linkedin} className="underline-offset-4 hover:underline">
              LinkedIn
            </a>
          </li>
        </ul>
      </section>
    </PageTransition>
  );
}
