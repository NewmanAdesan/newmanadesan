import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/projects";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

// Sits over the scenes as a thin bar. Solid paper colour, no backdrop blur, so scrolling never repaints a blur.
export function Header() {
  return (
    <header
      className="header-shade sticky top-0 z-40 bg-paper"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="wrap flex items-center justify-between gap-3 py-4">
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          className="flex items-center gap-2.5 whitespace-nowrap font-display text-base uppercase min-[360px]:text-lg min-[360px]:tracking-wide sm:text-xl"
        >
          <Image
            src="/newman.jpg"
            alt=""
            width={64}
            height={64}
            className="size-7 shrink-0 rounded-full object-cover max-[359px]:hidden sm:size-8"
          />
          {profile.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-4 text-sm text-muted min-[360px]:gap-5 sm:gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} transitionTypes={["nav-back"]} className="line-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
