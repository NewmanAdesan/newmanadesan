import { ProjectCard } from "@/components/ProjectCard";
import { analysis, engineering, profile, projects } from "@/content/projects";

export default function Home() {
  return (
    <>
      <section id="work" className="scroll-mt-20 pt-12 sm:pt-20">
        <div className="grid gap-4 md:grid-cols-12 md:gap-x-8">
          <h1 className="settle font-display text-3xl md:col-span-4" style={{ "--i": 0 } as React.CSSProperties}>
            Selected work
          </h1>
          <p
            className="settle text-muted md:col-span-5 md:col-start-7 md:pt-2"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {profile.title} and {profile.secondTitle.toLowerCase()}. Products I have built for clients, most of them
            live.
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
