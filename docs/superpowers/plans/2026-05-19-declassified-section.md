# Declassified Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `.dossier` + `.box` blocks on `/protected` with a single `TRANSMISSION`-titled section: real bold uppercase title above a serif paragraph with inline word-level redactions.

**Architecture:** Single-file change to `src/components/Protected.astro`. Reuses the existing `.redact` CSS technique already in the file. Title font reuses the brandbar's Impact/Haettenschweiler stack at a smaller size in ink-black. No new dependencies, no new fonts, no JavaScript. Spec lives at `docs/superpowers/specs/2026-05-19-declassified-section-design.md`.

**Tech Stack:** Astro 6 (component-scoped CSS), existing Times serif body font, existing brandbar condensed sans-serif title stack.

**Note on TDD:** This is a static visual change to an Astro component. There is no component-test framework in the project (only `node --test` for crypto helpers in `src/scripts/lib/`). Verification is `npm run dev` + visual inspection at desktop and mobile widths, plus `npm run build` to confirm the encryption pipeline still completes. This is the appropriate verification surface for the change; introducing a new test framework solely for this section would violate the project's YAGNI principle.

---

## File Structure

Only one file changes:

- **Modify:** `src/components/Protected.astro`
  - **Markup:** delete `.dossier` block (lines 57–61) and `.box` block (lines 63–65); insert one new `.declass` section in their place (between the `.bar` header and the `.feed` section).
  - **Scoped CSS:** add `.declass`, `.declass-title`, `.declass-body` rules; add a `@media (min-width: 720px)` block for `.declass*` overrides; remove the orphaned `.dossier`, `.dossier-title`, `.dossier-text`, `.box`, `.split` rules. Leave the existing `.redact` rule (still used). Leave the pre-existing dead `.source` rule alone — it was dead before this change.

No other files in the repo are touched. No new files are created.

---

## Task 1: Replace markup and add scoped CSS

Single atomic change so the page never renders in a broken intermediate state: swap the old markup for the new section AND add the styles in one commit.

**Files:**
- Modify: `src/components/Protected.astro` (markup block ~lines 57–65; scoped `<style>` block at the bottom)

- [ ] **Step 1: Read the file to confirm current line numbers**

Run: read `src/components/Protected.astro` and locate the `.dossier` `<section>` (currently lines 57–61) and the `.box` `<div>` (currently lines 63–65). Note the exact whitespace/indentation so the replacement matches the surrounding indentation style.

- [ ] **Step 2: Replace the markup**

Find the block:

```astro
  <section class="dossier" aria-label="redacted excerpt">
    <h1 class="dossier-title"><span class="redact">Drake Equation</span></h1>
    <p class="dossier-text"><span class="redact">Drake Equation a billion trillion rings of Uranus take root and flourish consciousness Jean-François Champollion.</span></p>
    <p class="dossier-text"><span class="redact">mote of dust suspended in a sunbeam descended from astronomers inconspicuous motes of rock and gas the carbon</span></p>
  </section>

  <div class="box">
    <p class="split">Animation is the process of creating the illusion of motion and shape change by means of the rapid display of a sequence of static images that minimally differ from each other. The illusion—as in motion pictures in general—is thought to rely on the phi phenomenon. Animators are artists who specialize in the creation of animation.</p>
  </div>
```

Replace with:

```astro
  <section class="declass" aria-label="transmission">
    <h2 class="declass-title">Transmission</h2>
    <p class="declass-body">
      Animation is <span class="redact">the process of</span> creating the illusion of <span class="redact">motion</span> and shape change by means of <span class="redact">the rapid display</span> of a sequence of <span class="redact">static images</span> that minimally differ from each other. The illusion — as in <span class="redact">motion pictures</span> in general — is thought to rely on the <span class="redact">phi phenomenon</span>. Animators are artists who specialize in the <span class="redact">creation</span> of animation.
    </p>
  </section>
```

Use the `Edit` tool with the full old_string and new_string above so the change is exact.

- [ ] **Step 3: Add the new CSS rules**

In the same file, locate the scoped `<style>` block (begins around line 109 with `.page { ... }`). Find the existing `.redact` rule (around line 244–249). Immediately **after** the `.redact` block and **before** the `.box` rule, insert:

```css
  .declass {
    max-width: 38rem;
    margin: 2.5rem auto 3rem;
  }
  .declass-title {
    font-family: "Impact", "Haettenschweiler", "Arial Narrow Bold", "Oswald", "Helvetica Neue Condensed", sans-serif;
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
    font-family: inherit;
    font-size: 1.05rem;
    line-height: 1.55;
    letter-spacing: 0.005em;
  }
```

- [ ] **Step 4: Extend the existing 720px media query**

Find the existing `@media (min-width: 720px)` block in the scoped `<style>` (around lines 205–216). It currently contains rules for `.page`, `.crest`, `.feed`, `.t`, `.dossier`, `.dossier-text`. Add two new rules to that same media query (so the breakpoint stays consolidated):

Add inside the existing `@media (min-width: 720px) { ... }`:

```css
    .declass { margin-top: 3rem; margin-bottom: 3.5rem; }
    .declass-body { font-size: 1.15rem; }
```

(Don't create a new media query block — add into the existing one.)

- [ ] **Step 5: Run dev server and verify visually**

Run: `npm run dev`

Open `http://localhost:4321/` in a browser, enter the gate passphrase (`SITE_PASSPHRASE` from `.env`) to unlock the protected page.

Expected on desktop (≥1024px viewport):
- A small bold uppercase `TRANSMISSION` title sits below the header bar, left-flush in a column centered on the page.
- A 1px black horizontal rule sits directly under the title, matching the title's text width (not full column width).
- One paragraph below in Times serif with 7 black bars inline where redactions are. Sentence remains parseable around the bars.
- `.dossier` and `.box` content are gone (no "Drake Equation" anywhere, no full-line redactions).
- Below this section, the dated entries feed renders unchanged.

Expected on mobile (resize to ~390px viewport or use devtools mobile emulation):
- Same layout, body type slightly smaller (`1.05rem` vs `1.15rem`).
- Title rule still matches title width, section still centered.

If anything is off (rule too wide, font wrong, layout broken), stop and diagnose before committing.

- [ ] **Step 6: Commit**

```bash
git add src/components/Protected.astro
git commit -m "feat: replace dossier+box with declassified TRANSMISSION section"
```

---

## Task 2: Remove orphaned CSS rules

Now that no markup uses `.dossier*`, `.box`, or `.split`, remove those rules. `.source` was dead before this change and is left in place per CLAUDE.md ("clean up only your own mess").

**Files:**
- Modify: `src/components/Protected.astro` (scoped `<style>` block only)

- [ ] **Step 1: Remove `.dossier`, `.dossier-title`, `.dossier-text` rules**

In the scoped `<style>` block, find and delete:

```css
  .dossier {
    max-width: 38rem;
    margin: 0 auto 2.5rem;
  }
  .dossier-title {
    font-family: inherit;
    font-weight: 700;
    font-size: clamp(2.25rem, 8vw, 3.25rem);
    line-height: 1.05;
    letter-spacing: -0.01em;
    margin: 0 0 1.1rem;
    display: inline-block;
  }
  .dossier-text {
    margin: 0 0 0.75rem;
    font-size: 1.05rem;
    line-height: 1.55;
    letter-spacing: 0.005em;
    max-width: 34rem;
  }
  .dossier-text:last-child { margin-bottom: 0; }
```

- [ ] **Step 2: Remove `.box` and `.split` rules**

In the scoped `<style>` block, find and delete:

```css
  .box {
    max-width: 70vw;
    padding: 30px;
    margin: 0 auto 2.25rem;
    position: relative;
    font-size: 30px;
    line-height: 1.5;
    perspective: 400px;
  }

  .split {
    margin: 0;
  }
```

- [ ] **Step 3: Remove the orphaned `.dossier` lines inside the 720px media query**

In the existing `@media (min-width: 720px)` block, delete only these two lines (they reference now-removed selectors):

```css
    .dossier { max-width: 40rem; margin-bottom: 3rem; }
    .dossier-text { font-size: 1.15rem; max-width: 36rem; }
```

Leave all other rules in the media query (`.page`, `.crest`, `.feed`, `.t`, and the newly added `.declass*` rules) untouched.

- [ ] **Step 4: Confirm `.source` rule is left alone**

In the scoped `<style>` block, verify this rule still exists exactly as before (do NOT delete it — it was pre-existing dead code, not orphaned by this change):

```css
  .source {
    color: skyblue;
    margin: 0 auto;
  }
```

- [ ] **Step 5: Reload dev server and re-verify visually**

The page should look **identical** to after Task 1 — removing unused CSS rules has no visual effect when those selectors match nothing. If anything looks different, you accidentally removed a rule that was still in use.

Confirm:
- `TRANSMISSION` title still bold uppercase with rule under it.
- Body paragraph still has inline redactions.
- Entries feed and header bar still render correctly.

- [ ] **Step 6: Commit**

```bash
git add src/components/Protected.astro
git commit -m "refactor: drop CSS orphaned by declassified-section rewrite"
```

---

## Task 3: Production build verification

Confirm the encryption pipeline still completes — this change does not touch build scripts, but the build is the deployed artifact and must be checked.

**Files:** none modified in this task.

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected:
- `astro build` completes without errors.
- `src/scripts/encrypt-payload.mjs` runs, reads `SITE_PASSPHRASE` from `.env`, encrypts the protected payload, replaces the placeholder in `dist/index.html`, and deletes `dist/protected/`.
- Final console output indicates success; no "missing placeholder" or "missing passphrase" errors.

If the build fails: this change does not modify any build code, so a failure indicates either (a) a stray syntax error in `Protected.astro` from the edits, or (b) an unrelated environment issue. Open `Protected.astro` and look for unclosed tags or malformed CSS before assuming environment fault.

- [ ] **Step 2: Inspect the built artifact**

Open `dist/index.html` in a text editor (it should be a single file with the gate + encrypted payload). Confirm:
- No `class="dossier"` strings appear anywhere in `dist/index.html` (the dossier markup is gone).
- No `Drake Equation` strings appear (the encrypted payload is base64, so plaintext fragments of the protected page should not be visible).
- The `__ENC_PAYLOAD__` placeholder has been replaced (no literal `__ENC_PAYLOAD__` text remains).

- [ ] **Step 3: Optional — preview the build locally**

Run: `npm run preview`

Open the preview URL, enter the passphrase, and confirm the protected page renders identically to the dev server output.

- [ ] **Step 4: No commit needed**

This task is verification only. If verification passed, the plan is complete.

---

## Self-Review

The plan covers every requirement in the spec:

- Spec §3 (markup replacement) → Task 1 steps 1–2.
- Spec §4 (new CSS rules + media query) → Task 1 steps 3–4.
- Spec §4 ("remove only CSS this change orphans") → Task 2 steps 1–3; `.source` left alone per Task 2 step 4.
- Spec §5 (visual rules — title font, rule under title, column width, body type sizes) → encoded directly in the CSS in Task 1 step 3 and step 4.
- Spec §6 (accessibility — `<h2>`, `aria-label`) → encoded in the markup in Task 1 step 2.
- Spec §9 (verification: dev + mobile + build + dist inspection) → Task 1 step 5 (visual), Task 3 steps 1–2 (build + dist).

No placeholders. No "TBD"s. All code blocks contain the actual content. The `.redact` class referenced in Task 1 step 2 is already defined in the existing file (spec §4 explicitly notes this is reused as-is).
