import { profile } from "@/content/projects";

export function Footer() {
  return (
    <footer className="mx-auto mt-32 max-w-6xl px-5 sm:px-8">
      <div className="flex flex-col gap-2 border-t border-line py-10 text-sm text-muted sm:flex-row sm:justify-between">
        <p>{profile.name}</p>
        <a href={`mailto:${profile.email}`} className="link self-start">
          {profile.email}
        </a>
      </div>
    </footer>
  );
}
