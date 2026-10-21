import type { MetadataRoute } from "next";
import { profile, projects } from "@/content/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${profile.siteUrl}/`, priority: 1 },
    ...projects.map((p) => ({ url: `${profile.siteUrl}/work/${p.slug}/`, priority: 0.8 })),
  ];
}
