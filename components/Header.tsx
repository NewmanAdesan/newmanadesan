import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/projects";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap font-serif text-base tracking-tight sm:gap-2.5 sm:text-lg">
          <Image
            src="/newman.jpg"
            alt=""
            width={64}
            height={64}
            className="size-7 shrink-0 rounded-full border border-line object-cover max-[359px]:hidden sm:size-8"
          />
          {profile.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-4 text-sm text-muted sm:gap-5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-ink">
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
