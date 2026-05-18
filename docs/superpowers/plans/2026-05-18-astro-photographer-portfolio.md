# Astro Photographer Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a minimal, image-forward Astro project with a single photographer-portfolio landing page in the existing empty `pstlnc-portfolio/` directory.

**Architecture:** Scaffold via the official `create-astro` CLI using the `minimal` template (TypeScript strict). Replace the generated homepage with a single `index.astro` containing four sections (hero, featured grid, about, contact) styled with a global CSS file plus scoped `<style>` blocks. All images flow through `astro:assets`' `<Image />` component for raster optimization.

**Tech Stack:** Astro (minimal template), TypeScript (strict), vanilla CSS with scoped styles, `astro:assets` for image optimization. No UI frameworks, no testing framework, no deployment adapter (static output only).

**Spec:** `docs/superpowers/specs/2026-05-18-astro-setup-design.md`

**Working directory for all commands:** `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio`

---

## File Structure

After this plan executes, the project will look like:

```
pstlnc-portfolio/
├── .git/                                  (pre-existing)
├── .gitignore                             (CLI-generated, Task 1)
├── astro.config.mjs                       (CLI-generated, Task 1)
├── package.json                           (CLI-generated, Task 1)
├── tsconfig.json                          (CLI-generated, Task 1)
├── public/
│   └── favicon.svg                        (CLI-generated, Task 1)
├── src/
│   ├── assets/
│   │   └── placeholder.jpg                (Task 2 — generated raster)
│   ├── pages/
│   │   └── index.astro                    (CLI in Task 1, overwritten in Task 3)
│   └── styles/
│       └── global.css                     (Task 2)
└── docs/
    ├── superpowers/
    │   ├── specs/
    │   │   └── 2026-05-18-astro-setup-design.md  (pre-existing)
    │   └── plans/
    │       └── 2026-05-18-astro-photographer-portfolio.md  (this file)
```

**Responsibility per file:**
- `src/styles/global.css`: CSS reset, root custom properties (colors, fonts), base body styles. Imported once in `index.astro`.
- `src/pages/index.astro`: The entire landing page — frontmatter imports, page markup for all four sections, scoped `<style>` block for section layout.
- `src/assets/placeholder.jpg`: 1200×800 solid-color JPEG, reused across all 5 image slots. Raster (not SVG) so `<Image />` exercises its WebP/AVIF pipeline during build verification.

---

## Task 1: Scaffold the Astro project

**Files:**
- Create: `.gitignore`, `astro.config.mjs`, `package.json`, `tsconfig.json`, `public/favicon.svg`, `src/pages/index.astro` (all CLI-generated)

- [ ] **Step 1: Verify starting state**

Run (PowerShell):
```powershell
Get-ChildItem -Force
```

Expected: directory contains `.git/` and `docs/`. No `package.json`, no `node_modules`, no `src/`.

- [ ] **Step 2: Run the Astro CLI scaffold**

Run (PowerShell):
```powershell
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --yes
```

Flag rationale:
- `.` — scaffold into current directory (works around existing `.git/` and `docs/`)
- `--template minimal` — barebones, no demo cruft
- `--typescript strict` — `tsconfig.json` extends `astro/tsconfigs/strict`
- `--no-install` — defer install to the next step so its output is visible
- `--no-git` — git is already initialized on `main`
- `--yes` — accept non-interactive defaults (also skips the "directory not empty" confirmation)

Expected: CLI completes with a "Next steps" summary. New files appear: `package.json`, `tsconfig.json`, `astro.config.mjs`, `src/pages/index.astro`, `public/favicon.svg`, `.gitignore`.

- [ ] **Step 3: Verify generated files exist**

Run (PowerShell):
```powershell
Get-ChildItem -Force; Get-ChildItem src -Recurse
```

Expected output includes:
- `package.json`, `tsconfig.json`, `astro.config.mjs`, `.gitignore`
- `src/pages/index.astro`
- `public/favicon.svg`

- [ ] **Step 4: Install dependencies**

Run (PowerShell):
```powershell
npm install
```

Expected: completes without errors. `node_modules/` directory and `package-lock.json` are created. `astro`, `@astrojs/check`, and `typescript` appear in `package.json` `devDependencies`.

- [ ] **Step 5: Verify dev server starts**

Run (PowerShell, background — interrupt after the URL line prints):
```powershell
npm run dev
```

Expected: server prints `astro  v<version>` and `Local   http://localhost:4321/`. Open the URL in a browser — the default minimal-template "Astro" page renders. Stop the dev server (Ctrl+C).

- [ ] **Step 6: Commit the scaffold**

Run (PowerShell):
```powershell
git add .gitignore astro.config.mjs package.json package-lock.json tsconfig.json public src
git commit -m "chore: scaffold Astro minimal template"
```

Expected: commit succeeds. `git status` shows a clean working tree (apart from `node_modules/`, which `.gitignore` excludes).

---

## Task 2: Add global styles and placeholder image

**Files:**
- Create: `src/styles/global.css`
- Create: `src/assets/placeholder.jpg`

- [ ] **Step 1: Create the styles directory**

Run (PowerShell):
```powershell
New-Item -ItemType Directory -Force -Path src\styles | Out-Null
```

- [ ] **Step 2: Write `src/styles/global.css`**

Create file `src/styles/global.css` with this exact content:

```css
:root {
  --bg: #0e0e10;
  --fg: #f5f5f5;
  --muted: #a0a0a8;
  --accent: #d4af37;
  --max-width: 1200px;
  --gutter: 1.5rem;
  --font-display: "Cormorant Garamond", Georgia, "Times New Roman", serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: var(--fg);
  text-decoration: none;
  border-bottom: 1px solid var(--muted);
  transition: border-color 120ms ease;
}

a:hover,
a:focus {
  border-bottom-color: var(--accent);
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: 0.02em;
  margin: 0;
}
```

- [ ] **Step 3: Create the assets directory**

Run (PowerShell):
```powershell
New-Item -ItemType Directory -Force -Path src\assets | Out-Null
```

- [ ] **Step 4: Generate `src/assets/placeholder.jpg`**

Run (PowerShell):
```powershell
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 1200, 800
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(38, 38, 42))
$bmp.Save("$PWD\src\assets\placeholder.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$bmp.Dispose()
```

- [ ] **Step 5: Verify the placeholder was created**

Run (PowerShell):
```powershell
Get-Item src\assets\placeholder.jpg | Select-Object Name, Length
```

Expected: file exists, size > 5 KB (a solid-color 1200×800 JPEG is typically 8–15 KB).

- [ ] **Step 6: Commit the styles and placeholder**

Run (PowerShell):
```powershell
git add src/styles/global.css src/assets/placeholder.jpg
git commit -m "chore: add global styles and placeholder image asset"
```

---

## Task 3: Write the landing page

**Files:**
- Modify (overwrite): `src/pages/index.astro`

- [ ] **Step 1: Overwrite `src/pages/index.astro`**

Replace the entire contents of `src/pages/index.astro` with:

```astro
---
import { Image } from "astro:assets";
import placeholder from "../assets/placeholder.jpg";
import "../styles/global.css";

const featured = [
  { title: "Untitled I", year: "2026" },
  { title: "Untitled II", year: "2026" },
  { title: "Untitled III", year: "2025" },
  { title: "Untitled IV", year: "2025" },
];
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Photographs by pstlnc — a photographer portfolio." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>pstlnc — photography</title>
  </head>
  <body>
    <main>
      <section class="hero">
        <Image
          src={placeholder}
          alt="Featured photograph"
          widths={[400, 800, 1200]}
          sizes="100vw"
          loading="eager"
          class="hero-image"
        />
        <div class="hero-overlay">
          <h1>pstlnc</h1>
          <p>Photographs of light, surface, and stillness.</p>
        </div>
      </section>

      <section class="works" aria-labelledby="works-heading">
        <h2 id="works-heading">Featured works</h2>
        <ul class="grid">
          {
            featured.map((piece) => (
              <li class="grid-item">
                <Image
                  src={placeholder}
                  alt={piece.title}
                  widths={[400, 600, 900]}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  loading="lazy"
                  class="grid-image"
                />
                <div class="caption">
                  <span class="caption-title">{piece.title}</span>
                  <span class="caption-year">{piece.year}</span>
                </div>
              </li>
            ))
          }
        </ul>
      </section>

      <section class="about" aria-labelledby="about-heading">
        <h2 id="about-heading">About</h2>
        <p>
          pstlnc is a photographer working in available light. Recent work has
          focused on the texture of overlooked surfaces — a wall, a corner, a
          window left open at dusk.
        </p>
      </section>

      <section class="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact</h2>
        <p>
          For commissions, prints, or print sales:{" "}
          <a href="mailto:hello@example.com">hello@example.com</a>
        </p>
      </section>
    </main>

    <style>
      main {
        display: flex;
        flex-direction: column;
        gap: 5rem;
        padding-bottom: 5rem;
      }

      section {
        padding-inline: var(--gutter);
        max-width: var(--max-width);
        margin-inline: auto;
        width: 100%;
      }

      .hero {
        position: relative;
        padding: 0;
        max-width: none;
        height: 100vh;
        min-height: 480px;
        overflow: hidden;
      }

      .hero-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .hero-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: var(--gutter);
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.55),
          rgba(0, 0, 0, 0) 40%
        );
      }

      .hero-overlay h1 {
        font-size: clamp(2.5rem, 8vw, 5rem);
        margin: 0;
      }

      .hero-overlay p {
        color: var(--muted);
        margin: 0;
        max-width: 32ch;
      }

      .works h2,
      .about h2,
      .contact h2 {
        font-size: clamp(1.5rem, 3vw, 2rem);
        margin-bottom: 1.5rem;
      }

      .grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 1.5rem;
        grid-template-columns: 1fr;
      }

      @media (min-width: 768px) {
        .grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }
      }

      .grid-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .grid-image {
        width: 100%;
        height: auto;
        aspect-ratio: 3 / 2;
        object-fit: cover;
      }

      .caption {
        display: flex;
        justify-content: space-between;
        color: var(--muted);
        font-size: 0.875rem;
      }

      .about p {
        max-width: 60ch;
        color: var(--muted);
      }

      .contact p {
        color: var(--muted);
      }
    </style>
  </body>
</html>
```

- [ ] **Step 2: Verify the dev server renders all four sections**

Run (PowerShell, then interrupt with Ctrl+C after visual check):
```powershell
npm run dev
```

Open `http://localhost:4321/` in a browser. Expected:
- Hero fills the viewport with the dark-grey placeholder, overlaid by "pstlnc" and a tagline
- "Featured works" heading followed by a 2-column grid (1 column on mobile) of 4 placeholder thumbnails with title/year captions
- "About" heading followed by the bio paragraph
- "Contact" heading followed by a `mailto:` link
- No console errors

Stop the dev server (Ctrl+C).

- [ ] **Step 3: Commit the landing page**

Run (PowerShell):
```powershell
git add src/pages/index.astro
git commit -m "feat: add photographer landing page"
```

---

## Task 4: Verify the production build

**Files:** none modified

- [ ] **Step 1: Run a production build**

Run (PowerShell):
```powershell
npm run build
```

Expected: build completes without errors. Console output includes a `Completed in <time>` line and lists generated routes including `/index.html`.

- [ ] **Step 2: Verify build artifacts**

Run (PowerShell):
```powershell
Get-ChildItem dist; Get-ChildItem dist\_astro
```

Expected:
- `dist/index.html` exists
- `dist/_astro/` contains multiple optimized image variants derived from `placeholder.jpg` (typically `.webp` files, one per requested width in `widths={...}` × number of `<Image />` usages). If the directory is empty or contains no webp/avif files, the image pipeline did NOT run — investigate before proceeding.

- [ ] **Step 3: Verify preview serves the built output**

Run (PowerShell, then interrupt with Ctrl+C after visual check):
```powershell
npm run preview
```

Open the URL the command prints (typically `http://localhost:4321/`). Expected: page renders identically to dev mode. Stop the preview server (Ctrl+C).

- [ ] **Step 4: Final verification — clean working tree**

Run (PowerShell):
```powershell
git status
```

Expected: `nothing to commit, working tree clean`. The `dist/` and `node_modules/` directories should be ignored by `.gitignore` and not appear in the status output.

If `dist/` does appear, add it to `.gitignore`:
```powershell
Add-Content -Path .gitignore -Value "`ndist/"
git add .gitignore
git commit -m "chore: gitignore dist/"
```

---

## Done = all of these are true

1. `npm install` ran cleanly.
2. `npm run dev` serves the landing page at `localhost:4321` with all four sections rendering.
3. `npm run build` produces `dist/index.html` plus optimized image variants under `dist/_astro/`.
4. `npm run preview` serves the built site identically to dev.
5. `git log --oneline` shows commits for: spec, scaffold, styles+placeholder, landing page (plus optional gitignore-dist commit).
6. `git status` is clean.
