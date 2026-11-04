import Image from "next/image";
import { ProjectCard } from "@/components/ProjectCard";
import { analysis, engineering, profile, projects } from "@/content/projects";

// The headline settles in phrase by phrase on first load. Each phrase is its own line on wide screens.
const headline = ["I build software", "that solves the business problem,", "then check that it did."];

export default function Home() {
  return (
    <>
      <section className="grid grid-cols-1 gap-y-10 pt-12 pb-20 sm:gap-y-12 sm:pt-28 sm:pb-36 md:grid-cols-12 md:gap-x-8">
        <p className="settle text-sm text-muted md:col-span-12" style={{ "--i": 0 } as React.CSSProperties}>
          {profile.title} and {profile.secondTitle.toLowerCase()}
        </p>

        <h1 className="font-display text-[2.5rem] leading-[1.02] tracking-[-0.01em] sm:text-6xl md:col-span-12 lg:text-[4.9rem]">
          {headline.map((line, i) => (
            <span key={line} className="settle block" style={{ "--i": i + 1 } as React.CSSProperties}>
              {line}
            </span>
          ))}
        </h1>

        <div
          className="settle hidden md:block md:col-span-3 md:col-start-1 md:row-start-3 md:mt-10"
          style={{ "--i": 4 } as React.CSSProperties}
        >
          <Image
            src="/newman.jpg"
            alt={`Portrait of ${profile.name}`}
            width={450}
            height={450}
            priority
            className="w-32 rounded-[3px] object-cover sm:w-44"
          />
        </div>

        <div
          className="settle flex flex-col gap-8 md:col-span-5 md:col-start-7 md:row-start-3 md:mt-10"
          style={{ "--i": 5 } as React.CSSProperties}
        >
          <p className="text-xl leading-relaxed">{profile.intro}</p>
          <p className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <a href={`mailto:${profile.email}`} className="press link link-ruled font-display text-2xl text-accent">
              Email me
            </a>
            <a href="#work" className="link text-muted">
              See my work
            </a>
          </p>
        </div>
      </section>

      <section id="work" className="scroll-mt-20 border-t border-line pt-16">
        <div className="grid gap-4 md:grid-cols-12 md:gap-x-8">
          <h2 className="font-display text-3xl md:col-span-4">Selected work</h2>
          <p className="text-muted md:col-span-5 md:col-start-7 md:pt-2">
            Products I have built for clients, most of them live.
          </p>
        </div>
        <div className="divide-y divide-line">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section id="about" className="scroll-mt-20 grid gap-12 border-t border-line py-24 md:grid-cols-12 md:gap-x-8 sm:py-32">
        <h2 className="font-display text-5xl leading-none sm:text-6xl md:col-span-4">About</h2>

        <div className="flex flex-col gap-5 md:col-span-6 md:col-start-6">
          <p className="text-xl leading-relaxed">
            I have been building web products for clients since 2023, usually as the person responsible for the
            whole frontend. I work closely with founders and backend developers, and I like understanding the
            business problem before I write code.
          </p>
          <p className="leading-relaxed text-muted">{profile.education}</p>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 md:col-span-7 md:col-start-6 md:mt-8">
          <div>
            <h3 className="mb-5 font-display text-2xl">Solution analysis</h3>
            <ul className="flex flex-col gap-6">
              {analysis.map((item) => (
                <li key={item.name} className="flex flex-col gap-1">
                  <a href={item.href} className="link link-ruled self-start font-medium">
                    {item.name}
                  </a>
                  <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-5 font-display text-2xl">Engineering</h3>
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

      <section id="contact" className="scroll-mt-20 grid gap-10 border-t border-line pt-24 sm:pt-32 md:grid-cols-12 md:gap-x-8">
        <h2 className="font-display text-6xl leading-none sm:text-8xl md:col-span-8">Let&apos;s talk.</h2>
        <div className="flex flex-col gap-6 md:col-span-5 md:col-start-8">
          <p className="text-lg leading-relaxed text-muted">
            I&apos;m open to frontend roles and to building products with businesses that need them.
          </p>
          <ul className="flex flex-col gap-3 text-lg">
            <li>
              <a href={`mailto:${profile.email}`} className="link link-ruled break-all">
                {profile.email}
              </a>
            </li>
            <li>
              <a href={profile.github} className="link link-ruled">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.linkedin} className="link link-ruled">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
