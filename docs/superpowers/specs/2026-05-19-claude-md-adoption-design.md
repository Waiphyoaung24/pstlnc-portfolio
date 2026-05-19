# Adopt CLAUDE.md from Redhorse-Landing into pstlnc-portfolio

**Date:** 2026-05-19
**Status:** Approved (pending user review of this spec)

## Goal

Seed `pstlnc-portfolio` with the same Claude-Code coding-discipline guidelines used in `redhorse-landing/Redhorse-Landing`, adjusted to reflect what pstlnc-portfolio actually is and what it actually depends on. Future Claude sessions should land with the same baseline rules (think-before-coding, simplicity, surgical changes, goal-driven execution) and a skills index — but with project framing accurate to pstlnc.

## Non-goals

- Not copying Redhorse's `.impeccable.md` or `DESIGN.md` — pstlnc has its own emerging aesthetic and we're deferring design-context capture.
- Not adopting Redhorse's Airbnb-aligned design tokens — they're the explicit anti-reference for pstlnc's editorial direction.
- Not modifying `.claude/settings.local.json` — pstlnc already has ~60 accumulated permission grants worth preserving.
- Not installing new dependencies (React, Tailwind, GSAP). The skills index documents them as available references only.

## Source-vs-target snapshot

**Redhorse-Landing (source)**
- Astro 6 + React 19 + Tailwind v4 + GSAP marketing site
- `CLAUDE.md`: 4 universal coding rules + Project Context + Skills index + Design Context (Airbnb-aligned)
- `.impeccable.md`: brand/design source-of-truth
- `.claude/`: only `settings.local.json` (no project-local skill files)

**pstlnc-portfolio (target)**
- Astro 6 only — no React, no Tailwind, no GSAP
- Passphrase-gated portfolio: `Gate.astro` + `Protected.astro`, custom encrypt-payload build step
- Existing `docs/superpowers/{specs,plans}/` from prior brainstorming sessions
- Existing `.claude/settings.local.json` with accumulated permissions

## Decisions (from brainstorming)

| Question | Decision |
|---|---|
| How much of Redhorse's CLAUDE.md to carry? | Universal rules verbatim + new Project Context. No Design Context. |
| Where should Design Context live? | Skip for now; revisit when patterns drift. |
| Which skills in the index? | Match Redhorse's full list verbatim. |
| Touch `.claude/settings.local.json`? | No — leave pstlnc's intact. |

## Deliverable

A single new file: `CLAUDE.md` at the repo root of `pstlnc-portfolio`.

### Section layout

1. **Sections 1–4: Universal coding discipline** — copied verbatim from Redhorse's CLAUDE.md.
   - Think Before Coding
   - Simplicity First
   - Surgical Changes
   - Goal-Driven Execution
   - The closing "These guidelines are working if…" paragraph.

2. **Project Context** — rewritten for pstlnc:
   ```
   **pstlnc-portfolio** — Astro 6 passphrase-gated portfolio site.

   - Stack: Astro 6 only (no React, no Tailwind, no GSAP at present)
   - Entry pages: src/pages/index.astro (gate), src/pages/protected.astro (gated content)
   - Components: src/components/Gate.astro, src/components/Protected.astro
   - Encryption pipeline: src/scripts/encrypt-payload.mjs runs after astro build and
     encrypts the protected payload with SITE_PASSPHRASE.
   - Crypto helpers + tests: src/scripts/lib/
   - Global styles: src/styles/global.css
   - Astro config: astro.config.mjs
   - Build: npm run build (build + encrypt) · Dev: npm run dev
   - Docker: Dockerfile accepts SITE_PASSPHRASE at build time; serves dist/ via serve.
   ```

3. **Skills** — copied verbatim from Redhorse:
   - "Always invoke via the `Skill` tool — never read the SKILL.md files manually."
   - Always-on: karpathy-guidelines
   - Animation (GSAP) subsection: gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-react, gsap-frameworks, gsap-performance, gsap-utils
   - Design & Frontend Work subsection: frontend-design, tailwind-design-system, tailwind-patterns, web-design-guidelines, frontend-dev-guidelines, ui-skills, ui-ux-pro-max, ui-ux-designer, theme-factory, radix-ui-design-system, react-patterns, react-best-practices, react-ui-patterns, scroll-experience, interactive-portfolio, threejs-*, accessibility-compliance-accessibility-audit, wcag-audit-patterns, web-performance-optimization, clone-website, redesign-skill, taste-skill, design-md, brand-guidelines-anthropic, brand-guidelines-community

### Sections explicitly NOT included

- ❌ Design Context (aesthetic tokens, brand personality, design principles)
- ❌ References to `.impeccable.md` or `DESIGN.md`
- ❌ Any Airbnb-aligned brand language

## File location

`C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\CLAUDE.md`

## Verification

After writing:
1. File exists at repo root.
2. Universal rules section matches Redhorse byte-for-byte.
3. Project Context references actual files (Gate.astro, Protected.astro, encrypt-payload.mjs, etc.) that exist in the repo.
4. No Design Context section.
5. `.claude/settings.local.json` unchanged.

## Out of scope / follow-up

- If patterns drift, capture a Design Context section in a follow-up spec (or `.impeccable.md`).
- If pstlnc later adopts Tailwind / React / GSAP, the skills index is already wired to surface the right tools.
- If you want the `enabledMcpjsonServers` (`filesystem`, `blender`) from Redhorse, do that as a separate small merge into `.claude/settings.local.json` — not in this change.
