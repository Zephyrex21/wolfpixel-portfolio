# Saurabh Raj Shekhar — Portfolio

Built in the Wolfpixel design system (React + Vite + Tailwind v4, Framer
Motion + GSAP), rebuilt with real content, live data, and a full set of
custom interactions.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build   # outputs to dist/
npm run start   # preview the production build locally
```

## Deploy

Ready for Vercel out of the box (`vercel.json` included for SPA routing).
Push to a GitHub repo and import it in Vercel, or run `vercel` from this
folder with the Vercel CLI.

## Setup checklist before going live

- **Contact form (EmailJS)** — `src/utils/emailConfig.ts` has three
  placeholder values. Sign up free at emailjs.com (~3 min), connect an
  email service, create a template with `{{from_name}}` / `{{from_email}}`
  / `{{message}}` variables, and drop your Service ID / Template ID /
  Public Key into that file. Until then the form shows a friendly
  "not wired up yet" message and points people at the email card instead
  — nothing breaks if you skip this.
- **Domain in meta tags** — `index.html`, `public/robots.txt`, and
  `public/sitemap.xml` currently point at `saurabhdev-xi.vercel.app`.
  Update those if you deploy to a different URL, so social share
  previews (OG image) and search engines resolve correctly.

## Notes

- Theme toggle lives in the navbar (desktop) / mobile menu pill. Preference
  is saved to `localStorage`. The transition is a native CSS color
  cross-fade (no page snapshot, no overlay) — see `App.tsx`.
- Project data lives in `src/pages/Home.tsx` — edit `flagshipProjects` and
  `moreProjects` there to add/remove/reorder projects.
- Real screenshots are in `public/screenshots/` (dark + light variants).
  Projects without a captured screenshot fall back to a generated gradient
  card automatically — drop a `-dark.webp` / `-light.webp` pair in and wire
  it into the `image` field on that project to upgrade it.
- Resume: `public/assets/resume.pdf`. Photo: `public/assets/photo-cutout.png`.
- GitHub repo count in the hero and Contact section is fetched live from
  the GitHub API on load (`src/utils/useGithubStats.ts`), cached per
  session, with a static fallback if the request fails.
- Command palette: `Cmd/Ctrl+K` anywhere on the site, or the `⌘K` button
  in the navbar. Navigate sections, open socials, copy email, download
  résumé, toggle theme — all from the keyboard.
- OG image (`public/og-image.png`) is a static rendered PNG — regenerate
  it manually if you update your name/role/stats significantly.
