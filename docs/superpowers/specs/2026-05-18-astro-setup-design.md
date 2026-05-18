# Astro Photographer Portfolio — Setup Design

**Date:** 2026-05-18
**Status:** Approved (pending user review of this written spec)
**Scope:** Initial Astro project scaffold for a single-page artist/photographer portfolio.

## Goal

Stand up a minimal, image-forward Astro project in the existing empty `pstlnc-portfolio/` directory so the user can begin filling in real content (images, copy, branding). No production deployment is in scope yet.

## Decisions (from brainstorming)

| Decision | Value | Rationale |
|---|---|---|
| Portfolio type | Artist / photographer | Image-heavy; image optimization is the most important capability |
| Styling | Vanilla CSS + Astro scoped `<style>` | No extra deps; matches "lean" intent |
| Pages in scope | Home / landing only | One page; more can be added later without rework |
| Deployment | Deferred | Build as static; pick host later (any of Vercel/Netlify/Cloudflare Pages works) |
| Interactivity | None | Pure static — no React/Vue/Svelte islands |
| Template | `minimal` via `npm create astro@latest` | Smallest footprint with correct defaults |

## Scaffold

Run from inside `pstlnc-portfolio/`:

```shell
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --yes
```

Flag rationale:
- `.` — scaffold into current directory (works around the existing `.git/`)
- `--template minimal` — barebones starting point, no demo cruft
- `--typescript strict` — `tsconfig.json` extends `astro/tsconfigs/strict`
- `--no-install` — run `npm install` separately so output is visible
- `--no-git` — git is already initialized on `main`
- `--yes` — non-interactive defaults

## Resulting Project Structure

```
pstlnc-portfolio/
├── .git/                  (pre-existing)
├── .gitignore             (CLI-generated; includes node_modules, dist, .astro)
├── astro.config.mjs       (CLI-generated default; empty config)
├── package.json           (scripts: dev, build, preview, astro)
├── tsconfig.json          (extends astro/tsconfigs/strict)
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/            (source images, processed by <Image />)
│   ├── pages/
│   │   └── index.astro    (the single landing page)
│   └── styles/
│       └── global.css     (reset + base typography + CSS variables)
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-18-astro-setup-design.md   (this file)
```

## Landing Page (`src/pages/index.astro`)

Single file with four sections (top → bottom):

1. **Hero** — full-viewport optimized image, artist name overlaid, short tagline.
2. **Featured works** — CSS grid of 4–6 thumbnails (placeholder images at first).
3. **About blurb** — one short paragraph.
4. **Contact** — `mailto:` link plus optional social links.

### Image strategy

- All source images live in `src/assets/` (NOT `public/`) so Astro processes them.
- Every image rendered through `<Image />` from `astro:assets` — yields responsive `srcset`, native lazy loading, modern formats (WebP/AVIF), and explicit width/height to prevent CLS.
- Placeholder images committed initially so the page renders out-of-the-box:
  - One small raster placeholder (`src/assets/placeholder.jpg`, ~1200×800, a solid neutral color) reused across all 5 image slots. Raster (not SVG) so Astro's `<Image />` actually exercises its WebP/AVIF pipeline during the build — verification step 3 depends on this.
  - The user later replaces this single file with real photos (or splits it into per-slot filenames like `hero.jpg`, `work-01.jpg`, etc.) once content is ready.

### Styling approach

- `src/styles/global.css` imported once in `index.astro` — CSS reset, custom properties for colors/typography, base body styles.
- Per-section styling in scoped `<style>` blocks inside `index.astro`.
- Mobile-first responsive: single column on phones, grid on desktop.
- Dark, image-forward palette by default (photographer aesthetic); easy to retheme later via CSS custom properties.

## Dev Workflow

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies (run once after scaffold) |
| `npm run dev` | Start dev server at `http://localhost:4321` |
| `npm run build` | Produce static site in `dist/` |
| `npm run preview` | Serve the built output locally |

## Verification (Done = all four pass)

1. `npm install` completes cleanly.
2. `npm run dev` starts and serves the homepage at `localhost:4321` showing all four sections.
3. `npm run build` produces `dist/index.html` plus optimized image variants under `dist/_astro/`.
4. `npm run preview` serves the built site identically to dev mode.

## Git Workflow

- Repo already initialized on `main`, no commits yet.
- Commit order:
  1. Commit this design doc first (`docs: add astro setup design spec`).
  2. After scaffold: one commit `chore: scaffold Astro minimal template`.
  3. After landing-page implementation: one commit `feat: add photographer landing page`.

## Out of Scope (Deferred)

- Deployment target / hosting adapter
- Additional pages (gallery index, individual project pages, dedicated about page)
- Contact form (server-side or third-party)
- Animations, lightboxes, image carousels
- UI framework integrations (React/Vue/Svelte)
- CMS / content collections
- Analytics, SEO meta beyond a basic `<title>` and `<meta name="description">`
- Custom fonts (system fonts initially)

## Open Questions

None — all decisions captured above.
