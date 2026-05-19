# Resend Brand Guidelines as Reference — Design Spec

**Date:** 2026-05-19
**Author:** brainstorm session with Claude (Opus 4.7)
**Project:** pstlnc-portfolio
**Status:** Draft — awaiting user review

## Summary

Adopt the Resend DESIGN.md (from `npx getdesign@latest add resend`) as the **aspirational reference** for future design work on this portfolio, without touching the current gate or protected pages. Set up the three impeccable-skill context files (`PRODUCT.md`, `DESIGN.md`, `reference/resend-DESIGN.md`) so every future `/impeccable` command sees both the live tokens and the Resend target in one read.

## Motivation

- The impeccable skill needs `PRODUCT.md` + `DESIGN.md` at the project root or it falls back to generic AI-aesthetic output. Both are missing today (`hasProduct: false, hasDesign: false`).
- The user wants Resend's brand language available to future design work but does not want to redesign the current red gate or paper-grey protected feed. Those surfaces are deliberate.
- A single DESIGN.md with both *current state* and *aspirational reference* sections prevents the next `/impeccable craft` from either ignoring Resend or accidentally restyling shipped pages.

## Non-goals

- No visual redesign of `src/components/Gate.astro`, `src/components/Protected.astro`, or `src/styles/global.css`.
- No font licensing or font installation work. Resend's proprietary fonts (Domaine Display, ABC Favorit) are documented as aspirational only; open-source substitutes (Tiempos Headline / Geist / Inter / Geist Mono) are listed alongside.
- No edits to existing CLAUDE.md (the Resend reference is opt-in via the impeccable skill, not a project-wide directive).
- No changes to the encryption pipeline, build, or Docker.

## Architecture

Three files added, all repo-root unless noted:

```
pstlnc-portfolio/
├── PRODUCT.md                      [NEW] strategic brand doc
├── DESIGN.md                       [NEW] visual tokens — current + aspirational
└── reference/
    └── resend-DESIGN.md            [NEW] verbatim Resend DESIGN.md from getdesign
```

`reference/` is a new directory used exclusively for verbatim external design documents. It is not consumed by build or runtime; it exists so future refreshes (`npx getdesign@latest add resend` again) can diff against the pinned version.

## Build sequence

```
1. mkdir reference/                                    → verify: ls reference/
2. cd into project root
3. npx getdesign@latest add resend                     → verify: ls DESIGN.md (CLI writes here)
4. mv DESIGN.md reference/resend-DESIGN.md             → verify: file present, ./DESIGN.md absent
5. Write PRODUCT.md (content below)                    → verify: load-context.mjs shows hasProduct:true
6. Write DESIGN.md (content below)                     → verify: load-context.mjs shows hasDesign:true
7. Re-run load-context.mjs                             → verify: full JSON includes both files
```

Step 3 has side effects: downloads `getdesign@latest` (currently `0.6.20`), may show interactive prompts. If the CLI prompts for an output path, accept the default (project root). If it prompts to overwrite, decline (no DESIGN.md should exist at root yet).

If step 3 fails (network, npm issue, prompt timeout), fall back to writing `reference/resend-DESIGN.md` from the GitHub raw content already cached in this session. Document the fallback in the file's first comment.

## File contents

### PRODUCT.md

```markdown
# Product

## Register

brand

## Users

Prospective clients and collaborators who have been given the passphrase
directly by the studio. They are not cold traffic. They arrive having
already heard a recommendation or had a one-to-one conversation, and the
passphrase is the social handshake that lets them in.

Context: typically scrolling on a laptop or phone after a referral, with
~3–10 minutes of curiosity. They want to verify taste and depth before
replying to an email or scheduling a call.

## Product Purpose

A selective portfolio that converts qualified introductions into
conversations. Success is a viewer who leaves the gate, scans the dated
entries feed, and writes back through a channel the studio already
controls (email, the channel that delivered the passphrase). No public
contact form, no analytics-led optimisation, no broad funnel.

The site itself argues for the studio's restraint: the passphrase is the
first design decision, not a security layer.

## Brand Personality

Editorial. Confident. Considered.

Voice: spare. Sentences carry one idea each. Numbers are real (dates,
edition numbers), never marketing-rounded. Headings are statements, not
questions. The site never asks the viewer for anything.

Tone shifts: the gate is theatrical (deep red, one input, no
instructions). The protected feed is archival (paper-grey, Times Roman,
dated one-line entries). The contrast is intentional — threshold versus
archive.

## Anti-references

- **Public portfolio templates.** Hero image + project grid + about page + contact form. The shape that signals "I bought a template".
- **Loud CTAs and social proof carousels.** Logo bars, testimonial sliders, "Trusted by". The studio's proof is the passphrase already in the viewer's hand.
- **Bento grids.** The current SaaS-marketing cliché. Same-size cards lined up. Already on the impeccable skill's absolute-ban list.
- **The hero-metric template.** Big number + small label + supporting stat + gradient accent. Mentioned in the impeccable shared design laws.

## References (inspiration, not identity)

- **Resend** — the verbatim DESIGN.md lives at `reference/resend-DESIGN.md`, with an aspirational excerpt mirrored into `DESIGN.md § Aspirational reference`. What to borrow: serif-led editorial confidence, hairline borders instead of shadows, restraint in colour, atmospheric depth instead of decorative chrome. What NOT to borrow: developer-tool category cues (code-window components, traffic-light dots, dev API copy), the pure-black canvas as default (the studio's canvas is red→paper, not black), or Resend's proprietary type stack as a literal target.

## Design Principles

1. **The gate IS the brand.** The first screen is a deep-red field, a crest, and one input. No copy, no hint, no logo wordmark. Editing the gate is editing the brand; treat it like the cover of a book.

2. **Let work speak in dated entries.** The protected feed is a chronological list of one-line releases. No thumbnails, no case-study previews, no project cards. Date + title carries the weight; if the entry needs more, link out.

3. **Borrow Resend's restraint, not Resend's surface.** When generating new surfaces, reach for Resend's discipline (hairline borders, type carries hierarchy, one solid CTA at a time, no decorative chrome) but not its literal palette, component vocabulary, or pure-black canvas. The studio is not a developer tool. (Visual specifics — tinted neutrals, no `#000`/`#fff`, OKLCH — live in DESIGN.md, not here.)

## Accessibility & Inclusion

- Target WCAG AA on all surfaces.
- Honour `prefers-reduced-motion` (already implemented on the gate shake and protected glyph hover).
- Focus-visible outlines visible on dark and light surfaces. The protected page uses a 1px ink outline with 3px offset; new surfaces should match or exceed.
- Touch targets ≥ 44px on mobile (the gate input is already 44px tall via `min-height`).
- Input fields use ≥ 16px font-size to prevent iOS Safari focus zoom (already enforced on the gate).
- The crest `<img>` uses `alt=""` because it is decorative on the gate (no semantic meaning beyond brand mark) and `alt="pstlnc"` on the protected header where it is the only home link. Future crest uses should follow this rule.

## Notes

- `.gitignore`, `astro.config.mjs`, and the build pipeline are out of scope. This change is documentation-only.
- The CLAUDE.md project section already references the impeccable skill. No edit needed there.
```

### DESIGN.md

Structure: header, then two top-level sections.

```markdown
# Design

> **Read this file in two passes.**
> §1 (Current state) is the source of truth for what is shipped today.
> §2 (Aspirational reference) describes the Resend system imported as a
> reference target for future surfaces. Never apply §2 tokens to the
> existing gate or protected pages without explicit instruction.

---

## §1 — Current state (source of truth)

### Theme

Two surfaces, two registers:

| Surface | Canvas | Ink | Type | Mood |
|---|---|---|---|---|
| Gate (`src/components/Gate.astro`) | `#b52025` (deep red) | `#f5f5f5` (off-white) | system sans (`--font-body`) | theatrical threshold |
| Protected (`src/components/Protected.astro`) | `#d8d8d8` (paper grey) | `#0c0c0c` (ink) | Times Roman serif | archival magazine |

The two surfaces intentionally contrast. The gate is a curtain; the protected page is the archive behind it.

### Colors

```
canvas-gate          #b52025   deep red, gate background only
canvas-protected     #d8d8d8   paper grey, protected page background
ink                  #0c0c0c   primary text on protected
ink-faint            #8e8e90   dates, secondary text on protected
fg-on-red            #f5f5f5   text/border on gate (used as muted white)
hairline-on-red      rgba(245,245,245,0.4)   gate input bottom border (default)
hairline-focus       #f5f5f5                gate input bottom border (focus)
```

`src/styles/global.css` also defines a legacy dark theme (`--bg: #0e0e10`, `--accent: #d4af37` gold, `Cormorant Garamond` display) that is **not** currently rendered by any page. It is dead in the runtime tree but not flagged for deletion in this spec.

### Typography

| Token | Family | Use |
|---|---|---|
| `gate body` | `var(--font-body)` → system sans | gate input only |
| `protected body` | `"Times New Roman", Times, "Tinos", "Liberation Serif", serif` | protected page everything |
| `protected date` | inherits Times, 0.92rem, `font-variant-numeric: lining-nums tabular-nums` | entry dates |
| `protected title` | inherits Times, 1.1rem desktop / 1.18rem ≥720px, line-height 1.32, weight 400 | entry titles |

Hierarchy comes from size and the date prefix, not from weight. Weight stays at 400 everywhere on the protected page.

### Spacing

The protected page uses rem-based spacing without a formal token scale. The recurring values:

- gate vertical padding: `max(1.25rem, env(safe-area-inset-*))`
- protected vertical padding: `max(1.5rem, env(safe-area-inset-top))` → `max(2rem, env(safe-area-inset-bottom))`
- entry gap: `1.85rem` mobile, `2.1rem` ≥720px
- feed max-width: `38rem` mobile, `40rem` ≥720px
- header bar min-height: `11rem` (deliberate: pushes the feed below the fold on landing)

### Components (live)

- `.gate-crest` — `max-height: 52vh; max-width: min(80vw, 460px)`, non-draggable, no shadow. On short landscape phones drops to `max-height: 60vh; max-width: min(50vw, 320px)`.
- `.gate-input` — 280px wide max, 44px min-height, transparent background, 1px bottom border that thickens on focus, centred text with `0.18em` letter-spacing.
- `.gate-input.shake` — 360ms `ease-in-out` horizontal nudge on bad passphrase. Disabled under `prefers-reduced-motion`.
- `.glyph` — 1.05rem circular/triangular/dot/cross SVG buttons in the protected header, 0.78 default opacity, `translateY(-1px)` on hover. Disabled motion under `prefers-reduced-motion`.
- `.crest` (protected) — 2.4rem tall (2.6rem ≥720px), `mix-blend-mode: multiply` against paper grey.
- `.entry` — flex column, date above title, both Times Roman.

### Motion

- Gate fade: `opacity 220ms ease` on the gate root; revealed payload fades in over `260ms ease`.
- Gate shake: `360ms ease-in-out`, 5-keyframe horizontal jitter.
- Glyph hover: `160ms ease` opacity + transform.
- All motion respects `prefers-reduced-motion: reduce`.
- The protected page also loads jQuery + TweenMax + SplitText via CDN for a `.split` paragraph animation in the `.box`. That animation is heavy and uses a deprecated GSAP version (1.20.4). Out of scope to refactor here, but worth noting for a future `/impeccable optimize` pass.

### Elevation

No drop shadows anywhere. Depth is carried by:

- Gate: nothing — single flat field with a crest floating on it.
- Protected: nothing structural — `mix-blend-mode: multiply` on the crest gives a single subtle inked feel, but cards/borders/shadows are absent.

This matches Resend's "no traditional drop-shadow language" philosophy by coincidence, not by import.

### Shapes

- Gate input: `border-radius: 0` (explicit). No rounding anywhere on the gate.
- Glyph SVGs: their own geometry (circle, triangle, dot, plus).
- Crest images: rectangular, no border-radius.

The system has no rounded-corner vocabulary today. If new components are added, the impeccable craft pass should establish one.

### Responsive

- Gate landscape <500px tall: crest shrinks to keep the input above the fold.
- Protected: single breakpoint at 720px (font-size and spacing bumps).
- Both surfaces use `env(safe-area-inset-*)` for iOS notch/dynamic-island safety.

### Accessibility

- WCAG AA on both surfaces. Gate red (`#b52025`) vs off-white (`#f5f5f5`) clears 4.5:1.
- `prefers-reduced-motion` honoured throughout.
- Gate input: `aria-label="passphrase"`, no `placeholder` (prevents passphrase echo), `autocapitalize/autocomplete/autocorrect/spellcheck` all off.
- Memory: the gate must remain crest + input only. Never echo any part of the passphrase, never add a hint, never add a label.

---

## §2 — Aspirational reference (Resend, do not apply automatically)

> Source: `reference/resend-DESIGN.md`, installed via `npx getdesign@latest add resend`.
> Pinned version at write time: `getdesign@0.6.20`.
> Apply only when explicitly invoked (e.g. `/impeccable craft <new surface> in Resend register`).

### What to import when designing a new surface

- **Restraint over chrome.** Hairline 1px translucent borders carry separation. No drop-shadows. Depth from luminance and temperature shifts, not blur.
- **Type-led hierarchy.** Family change (serif display → sans body → mono code) does the work that weight change usually does. Hold body weight at 400.
- **One bright pixel.** A single solid CTA per viewport. The brightest surface is reserved.
- **Atmospheric accent.** Colour appears as low-opacity radial wash anchored to one section, never as full-bleed gradient or solid accent surface.
- **Strict radius vocabulary.** Buttons + inputs at one radius (Resend uses 8px); cards + wells at another (Resend uses 12px); pills + avatars full-round.
- **Hairline tokens, not shadow tokens.** When a new component needs separation, reach for `rgba(currentColor, 0.06)` / `0.14` borders instead of inventing `box-shadow`.

### What NOT to import

- **Pure `#000` canvas.** Resend sits on `#000000`; this project's canvases are deep red and paper grey. The shared design laws also discourage `#000` / `#fff`. Keep tinted neutrals.
- **Developer-tool component vocabulary.** Code windows with traffic-light dots, terminal shells, API-key chips, tab strips for languages. The studio is not a dev tool.
- **Proprietary fonts as a literal target.** Domaine Display and ABC Favorit are licensed. If a Resend-style surface is needed, substitute Tiempos Headline / Söhne (display) and Geist / Inter Tight (body). Inter and Geist Mono are open-source and may be used directly.
- **Resend's marketing copy patterns.** "Email for developers", "Integrate this weekend", code-callouts inline. These are register cues for a SaaS landing page, not a portfolio.

### Token cheat sheet (Resend, compressed)

These are excerpts of the verbatim file in `reference/resend-DESIGN.md`. Refer to that file for completeness.

Colors:
```
canvas              #000000
surface-card        #0a0a0c
surface-elevated    #101012
surface-deep        #06060a
ink                 #fcfdff
body                rgba(252,253,255,0.86)
charcoal            rgba(252,253,255,0.7)
mute                #a1a4a5
hairline            rgba(255,255,255,0.06)
hairline-strong     rgba(255,255,255,0.14)
accent-orange       #ff801f       (+ glow rgba(255,89,0,0.22))
accent-blue         #3b9eff       (+ glow rgba(0,117,255,0.34))
accent-green        #11ff99       (+ glow rgba(34,255,153,0.18))
accent-red          #ff2047       (+ glow rgba(255,32,71,0.34))
accent-yellow       #ffc53d
link                #3b9eff
```

Type stack (with open-source substitutes in brackets):
```
display    Domaine Display       [Tiempos Headline, Söhne]
body       ABC Favorit           [Geist, Inter Tight]
ui         Inter                 [Inter, no substitute needed]
code       Geist Mono            [Geist Mono, no substitute needed]
```

Radius:
```
none 0   xs 4   sm 6   md 8   lg 12   xl 16   full 9999
```

Spacing:
```
xxs 2  xs 4  sm 8  md 12  lg 16  xl 24  xxl 32  xxxl 48  section 96  band 128
```

Component skeletons (refer to verbatim file for full prop tables):
`button-primary` (white pill on black) · `button-ghost` · `button-outline` · `text-input` · `feature-card` · `code-window` · `email-mockup` · `badge-pill` · `status-dot` · `nav-bar` · `footer`.

### When in doubt

Open `reference/resend-DESIGN.md` and read the relevant section in full. This cheat sheet is a navigational aid, not a replacement.
```

### reference/resend-DESIGN.md

Contents: whatever `npx getdesign@latest add resend` writes, moved verbatim. No edits. First line is a single comment if the file format permits, noting the source command and pinned version (e.g. for YAML/markdown front-matter). If editing the verbatim file breaks the format, skip the comment and rely on this spec doc for provenance.

If the npx step fails, fall back: write the file from the GitHub raw URL content already fetched (`https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/resend/DESIGN.md`), and add a comment at the top noting the fallback path.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| `npx getdesign@latest add resend` is interactive and stalls | Pre-confirm prompts in this spec; if the CLI hangs > 30s, kill it and use the GitHub raw fallback documented above. |
| The CLI writes to a different path than `./DESIGN.md` | Inspect the CLI's stdout for the actual path; `mv` from wherever it landed. |
| A future `getdesign` version changes the Resend template | The verbatim file is pinned in `reference/`. Re-running the CLI later and diffing makes drift visible. The aspirational excerpt in DESIGN.md §2 stays manually curated, not auto-regenerated. |
| Future agents apply §2 tokens to live pages | DESIGN.md header warns explicitly; PRODUCT.md Design Principle #3 reinforces; this spec is the authority. |
| Adding `reference/` confuses build tooling | Astro 6 only builds `src/` and `public/`. `reference/` at repo root is invisible to the build. Verified by reading `astro.config.mjs` (no custom roots). |

## Success criteria

- `node .claude/skills/impeccable/scripts/load-context.mjs` returns `hasProduct: true` and `hasDesign: true`.
- `reference/resend-DESIGN.md` exists and is byte-identical to either (a) the file `npx getdesign@latest add resend` wrote, or (b) the GitHub raw fallback.
- No files under `src/`, no `astro.config.mjs`, no `Dockerfile`, no `package.json` have been modified.
- `git status` shows exactly three new files and zero modifications outside docs and root.
- The next `/impeccable shape` or `/impeccable craft` invocation references PRODUCT.md's anti-references and DESIGN.md's two-section split in its own output.

## Out of scope (followups)

- Decide whether to delete the unused `--bg / --accent / --font-display` tokens in `src/styles/global.css` (leftover from an earlier theme; not touched here per the user's "surgical changes" guideline).
- Refactor the protected page's jQuery + TweenMax 1.20.4 + SplitText CDN dependency (heavy, deprecated; out of scope for a documentation pass).
- Decide whether `reference/` should be `.gitignore`-d or committed. Default in this spec is committed (the verbatim file is the pinned source).
- Optional: add a short "Design Context" pointer to CLAUDE.md once PRODUCT.md is stable.
