# Saurabh Raj Shekhar — Portfolio

Built in the Wolfpixel design system (React + Vite + Tailwind v4, Framer
Motion + GSAP), rebuilt with real content and an added light/dark theme.

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

## Notes

- Theme toggle lives in the navbar (desktop) / mobile menu pill. Preference
  is saved to `localStorage`.
- Project data lives in `src/pages/Home.tsx` — edit `flagshipProjects` and
  `moreProjects` there to add/remove/reorder projects.
- Real screenshots are in `public/screenshots/` (dark + light variants).
  Projects without a captured screenshot fall back to a generated gradient
  card automatically — drop a `-dark.webp` / `-light.webp` pair in and wire
  it into the `image` field on that project to upgrade it.
- Resume: `public/assets/resume.pdf`. Photo: `public/assets/photo.jpg`.
