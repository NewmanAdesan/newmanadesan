# Newman Adesan · portfolio

Next.js 16 (App Router), TypeScript and Tailwind CSS 4, exported as a static site.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## Where things live

- `content/projects.ts` holds every word on the site: profile, projects, analysis and engineering work. Edit this file, not the components.
- `app/page.tsx` is the home page. `app/work/[slug]/page.tsx` renders one case study per project.
- `public/images/<project>/` holds screenshots and `public/videos/<project>/` holds recordings (MP4 plus a poster JPG). Don't put images under `public/work/`, because that path is taken by the case-study routes.

## Still to do before sharing the link

1. **Screenshots** live in `public/images/<project>/`. The ambulance platform has none until it launches.
2. **Stories** live in each project's `story` array in `content/projects.ts`. GloBam, Shkula and BA Digi have none yet.
3. **Check every fact** in `content/projects.ts`. Dates and claims were taken from your latest resume.
4. **Deploy:** push to a GitHub repo, import it on Vercel, no settings needed.
