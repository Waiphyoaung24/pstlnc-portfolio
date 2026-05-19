# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Project Context

**pstlnc-portfolio** — Astro 6 passphrase-gated portfolio site.

- Stack: Astro 6 only (no React, no Tailwind, no GSAP at present)
- Entry pages: `src/pages/index.astro` (gate), `src/pages/protected.astro` (gated content)
- Components: `src/components/Gate.astro`, `src/components/Protected.astro`
- Encryption pipeline: `src/scripts/encrypt-payload.mjs` runs after `astro build` and encrypts the protected payload with `SITE_PASSPHRASE`.
- Crypto helpers + tests: `src/scripts/lib/`
- Global styles: `src/styles/global.css`
- Astro config: `astro.config.mjs`
- Build: `npm run build` (build + encrypt) · Dev: `npm run dev`
- Docker: `Dockerfile` accepts `SITE_PASSPHRASE` at build time; serves `dist/` via `serve`.

## Skills

Project-local skills live in `.claude/skills/`. Always invoke via the `Skill` tool — never read the SKILL.md files manually.

### Always-on
- **karpathy-guidelines** (`.claude/skills/karpathy-guidelines/SKILL.md`) — Andrej Karpathy's coding discipline. Apply on every coding task.

### Animation (GSAP)

Installed via the `gsap-skills` plugin (GreenSock). Invoke through the `Skill` tool when animation work is involved.

- `gsap-core` — tweens, eases, basic API
- `gsap-timeline` — sequencing multiple animations
- `gsap-scrolltrigger` — scroll-driven animations
- `gsap-plugins` — Flip, Draggable, MotionPath, SplitText, etc.
- `gsap-react` — `useGSAP` hook and React integration
- `gsap-frameworks` — framework hookups (Astro, Next.js, Vue, Svelte)
- `gsap-performance` — `will-change`, batching, reduced-motion
- `gsap-utils` — utility methods

### Design & Frontend Work

Whenever the task involves **UI design, visual styling, layout, components, theming, or frontend polish**, the following skills are available locally in `.claude/skills/`. Invoke via the `Skill` tool — do not read SKILL.md files manually.

- `frontend-design` — distinctive, production-grade frontend interfaces (default starting point)
- `tailwind-design-system` / `tailwind-patterns` — Tailwind v4 conventions
- `web-design-guidelines` / `frontend-dev-guidelines` — general web craft
- `ui-skills` / `ui-ux-pro-max` / `ui-ux-designer` — broader UX guidance
- `theme-factory` / `radix-ui-design-system` — design tokens / component systems
- `react-patterns` / `react-best-practices` / `react-ui-patterns` — React component work
- `scroll-experience` / `interactive-portfolio` / `threejs-*` — motion / 3D (GSAP via the `gsap-skills` plugin)
- `accessibility-compliance-accessibility-audit` / `wcag-audit-patterns` — a11y
- `web-performance-optimization` — Lighthouse / Core Web Vitals
- `clone-website` / `redesign-skill` / `taste-skill` / `design-md` — research & taste passes
- `brand-guidelines-anthropic` / `brand-guidelines-community` — brand reference

Invoke the relevant skill before generating design code, then apply its guidance to this project.
