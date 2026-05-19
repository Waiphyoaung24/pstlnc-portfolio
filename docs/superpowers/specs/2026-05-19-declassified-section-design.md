# Declassified Section — Design

**Status:** Draft — awaiting user approval
**Date:** 2026-05-19
**Project:** pstlnc-portfolio (Astro 6 static site, Dockerized on port 82)
**Touches:** `src/components/Protected.astro` only

## 1. Purpose

Replace the current "Drake Equation" dossier block and the "Animation is the process…" paragraph on `/protected` with a single tighter section styled as a partially declassified document. The section sits between the page header bar and the entries feed.

The visual reference combines two screenshots the user supplied:

- **Image 1** (current state) — heading area of black blocks above a plain serif paragraph.
- **Image 2** (target style) — a real bold uppercase title above body text with black censorship bars over select words inside the paragraph.

Decision: drop image 1's stacked-bars heading entirely (user direction). Keep image 2's real-text title + inline body redactions. The "declassified" tension lives in the body, not the heading.

## 2. User-facing behavior

1. After unlocking the gate, the visitor sees the page header bar (PROPAGANDA, crest, glyph nav).
2. Below the header, a single left-aligned column displays:
   - A small bold uppercase title reading `TRANSMISSION`.
   - A short ink rule beneath the title.
   - A paragraph in Times serif containing the existing Animation copy, with select 1–4 word phrases blacked out as inline redactions.
3. Below this section, the existing dated entries feed renders unchanged.
4. The section is purely static — no interactions, no hover effects, no reveals.

## 3. Markup

Replace the two existing blocks in `src/components/Protected.astro`:

- Delete: `<section class="dossier" aria-label="redacted excerpt">…</section>` (lines 57–61).
- Delete: `<div class="box"><p class="split">…</p></div>` (lines 63–65).

Insert in their place a single new section:

```astro
<section class="declass" aria-label="transmission">
  <h2 class="declass-title">Transmission</h2>
  <p class="declass-body">
    Animation is <span class="redact">the process of</span> creating the illusion of <span class="redact">motion</span> and shape change by means of <span class="redact">the rapid display</span> of a sequence of <span class="redact">static images</span> that minimally differ from each other. The illusion — as in <span class="redact">motion pictures</span> in general — is thought to rely on the <span class="redact">phi phenomenon</span>. Animators are artists who specialize in the <span class="redact">creation</span> of animation.
  </p>
</section>
```

Notes:
- `<h2>` (not `<h1>`) — the page already implies a top-level structure via the brand bar; this is a subsection.
- Title rendered as title-case in source (`Transmission`); CSS uppercases it. This keeps the accessible name natural-cased.
- Reuses the existing `.redact` span technique; no new CSS technique introduced.
- Redaction count: 7 spans across ~70 words — dense enough to feel like a real document, sparse enough that the sentence remains parseable.

## 4. Styles

Add scoped rules to the `<style>` block in `Protected.astro`. Remove only the CSS this change orphans: `.dossier`, `.dossier-title`, `.dossier-text`, `.box`, `.split`. Note: `.source` (currently in the file, unused) is pre-existing dead code unrelated to this change — leave it in place and flag it to the user separately if desired. We clean up only what this change orphans.

```css
.declass {
  max-width: 38rem;
  margin: 2.5rem auto 3rem;
}

.declass-title {
  font-family: "Impact", "Haettenschweiler", "Arial Narrow Bold", "Oswald",
    "Helvetica Neue Condensed", sans-serif;
  font-weight: 900;
  font-size: clamp(1.05rem, 2.4vw, 1.3rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink);
  margin: 0 0 1.25rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid var(--ink);
  display: inline-block;
}

.declass-body {
  margin: 0;
  font-family: inherit; /* inherits Times stack from .page */
  font-size: 1.05rem;
  line-height: 1.55;
  letter-spacing: 0.005em;
}

@media (min-width: 720px) {
  .declass { margin-top: 3rem; margin-bottom: 3.5rem; }
  .declass-body { font-size: 1.15rem; }
}
```

The `.redact` rule already exists in the file and is reused as-is:

```css
.redact {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  box-shadow: inset 0 0 0 1000px var(--ink);
  color: var(--ink);
}
```

## 5. Visual rules (the why)

- **Title font** intentionally reuses the brandbar's Impact/Haettenschweiler stack to echo the `PROPAGANDA` header. Smaller size (~1.1–1.3rem vs 1.85–2.75rem) and ink-black (vs the brand's red) keep it subordinate — it reads as a section label, not a competing hero.
- **Title rule** (1px ink line under the title) reads as a document section divider. Inline-block constrains the rule to the title's width — looks deliberate, not full-bleed.
- **Column width** `38rem` matches the existing `.feed` max-width so the section visually aligns with the entries feed below.
- **Type sizes** match existing serif body sizes (`1.05rem` mobile, `1.15rem` desktop) — no new size step introduced.
- **Redaction density** chosen so the paragraph is still readable on first pass; redactions feel like specific words were removed, not whole sentences.
- **No animation, no hover, no reveal.** The section is a static document fragment. Motion lives elsewhere on the site.

## 6. Accessibility

- The `<h2>` provides a real document heading (improves over the previous `<h1>` inside the redacted dossier, where the heading text was visually unreadable but exposed to screen readers).
- The accessible name of the section is `transmission` via `aria-label`.
- Redacted spans render their underlying text to assistive tech. This is consistent with the existing `.redact` behavior elsewhere on the page; we are not changing semantics.
- Color contrast: ink `#0c0c0c` on paper `#d8d8d8` ≈ 13.5:1, well above WCAG AAA for body text.

## 7. Out of scope

- No copy changes to other sections (`PROPAGANDA` bar, glyph nav, entries feed).
- No new fonts, no new colors, no new global styles.
- No JavaScript behavior. No GSAP, no scroll triggers.
- No mobile-specific markup variants — the same DOM renders on every viewport.
- No dark-mode variant — the site is single-theme by design.

## 8. Files changed

- `src/components/Protected.astro` — remove `.dossier` block + `.box` block from markup; insert new `.declass` section; add `.declass*` CSS rules; remove only the CSS rules this change orphans (`.dossier`, `.dossier-title`, `.dossier-text`, `.box`, `.split`). Pre-existing dead `.source` rule is left untouched.

No other files touched. No new dependencies. No build script changes.

## 9. Verification

After implementing:

1. `npm run dev` — load `/protected` directly (or unlock through the gate).
2. Visual check at desktop (≥1024px) and mobile (~390px) widths:
   - Title `TRANSMISSION` renders bold uppercase, condensed.
   - 1px rule sits under the title, width matches the title text.
   - Body paragraph reads as a continuous sentence with ~7 black bars where redactions are.
   - Section sits ~2.5–3rem below the header bar and ~3rem above the entries feed.
3. Inspect element to confirm the old `.dossier` and `.box` markup is gone.
4. `npm run build` — verify no errors and that the encryption pipeline still completes (this change does not affect the build script).
