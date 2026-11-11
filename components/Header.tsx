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
    <header className="sticky top-0 z-40 bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap font-display text-base min-[360px]:text-lg sm:text-xl">
          <Image
            src="/newman.jpg"
            alt=""
            width={64}
            height={64}
            className="size-7 shrink-0 rounded-full object-cover grayscale max-[359px]:hidden sm:size-8"
          />
          {profile.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-4 text-sm min-[360px]:gap-5 sm:gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link">
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
