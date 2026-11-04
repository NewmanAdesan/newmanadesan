import { profile } from "@/content/projects";

export function Footer() {
  return (
    <footer className="wrap mt-24">
      <div className="flex flex-col gap-2 border-t border-line py-10 text-sm text-muted sm:flex-row sm:justify-between">
        <p>{profile.name}</p>
        <a href={`mailto:${profile.email}`} className="line-link self-start">
          {profile.email}
        </a>
      </div>
    </footer>
  );
}
