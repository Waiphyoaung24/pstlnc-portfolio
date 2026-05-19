# Resend Brand Guidelines as Reference — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install the Resend DESIGN.md from `npx getdesign@latest` as an aspirational reference, and seed the impeccable-skill context files (`PRODUCT.md`, `DESIGN.md`) so future `/impeccable` commands have ground-truth current-state tokens and Resend's tokens in one read.

**Architecture:** Three new files (no edits to existing code). The verbatim Resend doc lives at `reference/resend-DESIGN.md` for future drift-checking. The impeccable `DESIGN.md` at root has two clearly-marked sections: §1 the live tokens (red gate + paper protected), §2 Resend tokens marked "do not apply automatically". `PRODUCT.md` describes the portfolio's actual brand, citing Resend only under References.

**Tech Stack:** Astro 6 project (docs-only change, no Astro touched). `npx getdesign@latest add resend` from VoltAgent's `awesome-design-md` (pinned `0.6.20`). PowerShell on Windows is the primary shell; Bash fallback is available.

**Spec:** `docs/superpowers/specs/2026-05-19-resend-brand-reference-design.md`. Every "write the file content from spec §X" step below refers to that spec — read the named section verbatim, copy its content unchanged.

**Working directory:** `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio` (absolute paths used throughout).

**No commits unless the user explicitly approves at the end.** This project's CLAUDE.md says "NEVER commit changes unless the user explicitly asks you to". Each task ends with a `git status` verification step instead of a commit; the optional final commit step at the very bottom of the plan is gated on user approval.

---

## File Structure

| Path | Action | Source | Responsibility |
|---|---|---|---|
| `reference/` | create dir | — | new directory for verbatim external design docs |
| `reference/resend-DESIGN.md` | create | `npx getdesign@latest add resend` (fallback: GitHub raw) | pinned source of truth for Resend's system |
| `PRODUCT.md` | create | spec § File contents § PRODUCT.md | strategic brand doc for impeccable |
| `DESIGN.md` | create | spec § File contents § DESIGN.md | visual tokens — §1 current state, §2 Resend reference |

No existing files are modified. No `src/`, no `astro.config.mjs`, no `Dockerfile`, no `package.json`.

---

## Task 1: Create `reference/` directory and install the verbatim Resend DESIGN.md

**Files:**
- Create: `reference/` (directory)
- Create: `reference/resend-DESIGN.md` (verbatim file)

- [ ] **Step 1: Create the reference directory**

PowerShell:
```powershell
New-Item -ItemType Directory -Path "C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\reference" -Force
```

Bash equivalent (if using Bash tool):
```bash
mkdir -p "C:/Users/wai19/Desktop/pstlnc-portfolio/pstlnc-portfolio/reference"
```

Expected: directory created at `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\reference\`. No output is fine.

- [ ] **Step 2: Verify the directory exists and is empty**

Use the Glob tool:
- Pattern: `reference/*`
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio`

Expected: zero matches (directory exists but is empty). If "no such file or directory", redo Step 1.

- [ ] **Step 3: Confirm no `DESIGN.md` exists at project root before running the CLI**

Use the Glob tool:
- Pattern: `DESIGN.md`
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio`

Expected: zero matches. If a `DESIGN.md` is found, STOP and ask the user — the CLI step would overwrite it.

- [ ] **Step 4: Run `npx getdesign@latest add resend` with a 30-second cap**

Bash (preferred — has `timeout`):
```bash
cd "/c/Users/wai19/Desktop/pstlnc-portfolio/pstlnc-portfolio" && timeout 30 npx --yes getdesign@latest add resend
```

PowerShell fallback (no native timeout — use the harness's `timeout` parameter on the PowerShell tool, set to 30000 ms):
```powershell
npx --yes getdesign@latest add resend
```

The `--yes` flag pre-accepts the npm install prompt for the package. The CLI itself may still prompt interactively for an output path; if it does, watch the output and act per Step 5.

Expected: stdout shows the package being downloaded, then a confirmation that DESIGN.md was written. Typical exit: 0.

If the command hangs > 30s or exits non-zero, go to Step 4-FALLBACK below.

- [ ] **Step 4-FALLBACK (only if Step 4 failed): Write `reference/resend-DESIGN.md` from the GitHub raw content**

Use the WebFetch tool to re-pull the exact source:
- URL: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/resend/DESIGN.md`
- Prompt: `"Return the full raw content of this DESIGN.md file. Do not summarize. Do not add a preface. Output only the file content."`

Then use the Write tool:
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\reference\resend-DESIGN.md`
- Content: prepend a single HTML-style comment as the file's first line, then the verbatim WebFetch output:
  ```
  <!-- Source: https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/resend/DESIGN.md
       Fallback used because `npx getdesign@latest add resend` failed at install time.
       Re-run the CLI once it's available to refresh this file. -->
  ```

Then SKIP Steps 5–7 (the CLI didn't write anything to move) and jump to Step 8.

- [ ] **Step 5: Locate where the CLI wrote DESIGN.md**

Most likely path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\DESIGN.md` (project root). Verify with the Glob tool:
- Pattern: `DESIGN.md`
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio`

Expected: exactly one match at project root.

If the CLI wrote it elsewhere (re-read the stdout from Step 4), use that path in Step 6. If you can't find it at all, treat Step 4 as failed and run Step 4-FALLBACK.

- [ ] **Step 6: Move the CLI-written DESIGN.md into `reference/`**

PowerShell:
```powershell
Move-Item -Path "C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\DESIGN.md" -Destination "C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\reference\resend-DESIGN.md"
```

Bash:
```bash
mv "C:/Users/wai19/Desktop/pstlnc-portfolio/pstlnc-portfolio/DESIGN.md" "C:/Users/wai19/Desktop/pstlnc-portfolio/pstlnc-portfolio/reference/resend-DESIGN.md"
```

Expected: no output. The file is now at `reference/resend-DESIGN.md`, and there is no `DESIGN.md` at the project root.

- [ ] **Step 7: Verify the move**

Use the Glob tool twice:

(a) Confirm the file is at the new location:
- Pattern: `reference/resend-DESIGN.md`
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio`
- Expected: one match.

(b) Confirm no `DESIGN.md` remains at root (it will be re-created with different content in Task 3):
- Pattern: `DESIGN.md`
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio`
- Expected: zero matches (or only the `reference/resend-DESIGN.md` if the glob also matches subdirs).

- [ ] **Step 8: Sanity-check the file contents**

Use the Read tool:
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\reference\resend-DESIGN.md`
- Limit: 40 (only the first 40 lines are needed for the check)

Expected (regardless of CLI vs fallback): the file starts with either the fallback HTML comment + `version: alpha` / `name: Resend-design-analysis`, OR directly with `version: alpha` / `name: Resend-design-analysis` (CLI path). If the file is empty, looks like an HTML 404 page, or doesn't mention "Resend", STOP and ask the user.

- [ ] **Step 9: Verify git status after Task 1**

PowerShell:
```powershell
git status --short
```

Expected lines (in some order):
```
?? reference/
```
(or `?? reference/resend-DESIGN.md` depending on git version)

The only Task-1 addition is the new untracked file under `reference/`. If anything else has changed compared to the start-of-session `git status`, STOP and investigate.

---

## Task 2: Write `PRODUCT.md`

**Files:**
- Create: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\PRODUCT.md`

**Source content:** The spec at `docs/superpowers/specs/2026-05-19-resend-brand-reference-design.md` contains the full `PRODUCT.md` body verbatim under section "## File contents → ### PRODUCT.md". Copy the content of the fenced ```markdown block (everything between the opening and closing triple backticks, excluding the backticks themselves).

- [ ] **Step 1: Read the spec's PRODUCT.md section**

Use the Read tool to load the spec file. Locate the section `### PRODUCT.md` under `## File contents`. The file body starts at the line `# Product` inside the markdown code fence and ends at the line `- The CLAUDE.md project section already references the impeccable skill. No edit needed there.` (the last bullet under `## Notes`, immediately before the closing fence).

Do NOT include the wrapping ```markdown / ``` fences in the output file.

- [ ] **Step 2: Write `PRODUCT.md` at project root**

Use the Write tool:
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\PRODUCT.md`
- Content: the verbatim block extracted in Step 1.

Expected: file created, ~100 lines, starts with `# Product` and includes the sections `## Register` (value `brand`), `## Users`, `## Product Purpose`, `## Brand Personality`, `## Anti-references`, `## References (inspiration, not identity)`, `## Design Principles`, `## Accessibility & Inclusion`.

- [ ] **Step 3: Verify the file via load-context.mjs**

Bash:
```bash
node "C:/Users/wai19/Desktop/pstlnc-portfolio/pstlnc-portfolio/.claude/skills/impeccable/scripts/load-context.mjs"
```

Expected JSON output includes:
```
"hasProduct": true,
"productPath": "C:\\Users\\wai19\\Desktop\\pstlnc-portfolio\\pstlnc-portfolio\\PRODUCT.md",
"hasDesign": false,
"migrated": false
```

If `hasProduct` is `false`, the loader didn't find the file — recheck the path. If `migrated` is `true`, it means a legacy `.impeccable.md` was renamed; investigate (unexpected here since the loader returned `hasProduct: false` earlier in this session).

- [ ] **Step 4: Spot-check PRODUCT.md content**

Use the Read tool:
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\PRODUCT.md`
- Limit: 30

Expected: lines include `# Product` (heading), then `## Register` followed by exactly `brand` on its own line, then `## Users` with the prospective-clients framing. If any of those are missing or mangled, redo Step 2.

- [ ] **Step 5: Verify git status after Task 2**

PowerShell:
```powershell
git status --short
```

Expected:
```
?? PRODUCT.md
?? reference/
```
(plus any pre-existing modifications from the start of the session — those are not from this task).

If `PRODUCT.md` appears as `M` (modified) instead of `??` (untracked), it means a `PRODUCT.md` already existed before this plan ran. STOP and ask the user how to reconcile.

---

## Task 3: Write `DESIGN.md`

**Files:**
- Create: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\DESIGN.md`

**Source content:** The spec at `docs/superpowers/specs/2026-05-19-resend-brand-reference-design.md` contains the full impeccable `DESIGN.md` body verbatim under section "## File contents → ### DESIGN.md". Copy the content of the fenced ```markdown block.

- [ ] **Step 1: Confirm no `DESIGN.md` exists at root before writing**

Use the Glob tool:
- Pattern: `DESIGN.md`
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio`

Expected: zero matches. If a `DESIGN.md` is present at root, Task 1 Step 6 did not move it — STOP and check.

- [ ] **Step 2: Read the spec's DESIGN.md section**

Use the Read tool to load the spec. Locate the section `### DESIGN.md` under `## File contents`. The file body starts at `# Design` and ends at `Open \`reference/resend-DESIGN.md\` and read the relevant section in full. This cheat sheet is a navigational aid, not a replacement.` (the last line inside the code fence).

Do NOT include the wrapping ```markdown / ``` fences.

- [ ] **Step 3: Write `DESIGN.md` at project root**

Use the Write tool:
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\DESIGN.md`
- Content: the verbatim block extracted in Step 2.

Expected: file created, ~200 lines. First line is `# Design`. Includes a blockquote `> **Read this file in two passes.** ...`, then `## §1 — Current state (source of truth)`, then `## §2 — Aspirational reference (Resend, do not apply automatically)`.

- [ ] **Step 4: Verify via load-context.mjs**

Bash:
```bash
node "C:/Users/wai19/Desktop/pstlnc-portfolio/pstlnc-portfolio/.claude/skills/impeccable/scripts/load-context.mjs"
```

Expected JSON output includes BOTH:
```
"hasProduct": true,
"hasDesign": true,
"designPath": "C:\\Users\\wai19\\Desktop\\pstlnc-portfolio\\pstlnc-portfolio\\DESIGN.md"
```

If `hasDesign` is `false`, the loader didn't find the file — recheck path/permissions.

- [ ] **Step 5: Spot-check DESIGN.md content**

Use the Read tool:
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio\DESIGN.md`
- Limit: 50

Expected: title `# Design`, blockquote warning, `## §1 — Current state (source of truth)` heading, color tokens including `canvas-gate          #b52025`, `canvas-protected     #d8d8d8`, and `ink                  #0c0c0c`. If §1 is missing or §2 appears first, redo Step 3.

Also use the Read tool with `offset: 100` to scan further in and confirm `## §2 — Aspirational reference (Resend, do not apply automatically)` appears with its warning blockquote and Resend's color tokens (`canvas              #000000` etc.).

- [ ] **Step 6: Verify git status after Task 3**

PowerShell:
```powershell
git status --short
```

Expected new files from this plan:
```
?? DESIGN.md
?? PRODUCT.md
?? reference/
```

Plus the pre-existing session changes (e.g. `M .gitignore`, `M src/components/Gate.astro`, `M src/components/Protected.astro`, `?? .agents/`, `?? skills-lock.json`) which this plan does not touch.

If any `src/` file appears as `M` and was not modified at start-of-session, STOP and investigate.

---

## Task 4: Final verification

**Files:** none modified.

- [ ] **Step 1: Re-run the impeccable loader for the canonical output**

Bash:
```bash
node "C:/Users/wai19/Desktop/pstlnc-portfolio/pstlnc-portfolio/.claude/skills/impeccable/scripts/load-context.mjs"
```

Required JSON fields:
- `"hasProduct": true`
- `"hasDesign": true`
- `"productPath"` ending in `PRODUCT.md`
- `"designPath"` ending in `DESIGN.md`
- `"migrated": false`

If any required field is missing or wrong, the plan has not completed successfully — return to the relevant task.

- [ ] **Step 2: Verify the three-file diff against repo root**

Use the Glob tool:
- Pattern: `{PRODUCT.md,DESIGN.md,reference/resend-DESIGN.md}`
- Path: `C:\Users\wai19\Desktop\pstlnc-portfolio\pstlnc-portfolio`

Expected: exactly three matches:
- `PRODUCT.md`
- `DESIGN.md`
- `reference/resend-DESIGN.md`

- [ ] **Step 3: Confirm no `src/` files were touched by this plan**

PowerShell:
```powershell
git diff --stat -- src/
```

Expected: no output (no `src/` modifications) OR only the modifications that existed at start-of-session for `src/components/Gate.astro` and `src/components/Protected.astro`. Use `git diff src/components/Gate.astro` to confirm the diff is byte-identical to what was there pre-plan. If unsure, run `git stash list` and `git log --oneline -3` to confirm no new commits were made.

- [ ] **Step 4: Confirm `astro.config.mjs`, `package.json`, `Dockerfile` are untouched**

PowerShell:
```powershell
git diff --stat -- astro.config.mjs package.json Dockerfile
```

Expected: empty output.

- [ ] **Step 5: Read the success criteria from the spec and tick each one**

Use the Read tool to re-open `docs/superpowers/specs/2026-05-19-resend-brand-reference-design.md` and locate the `## Success criteria` section. For each bullet, confirm it is satisfied based on the previous steps. Report which (if any) are unmet.

The criteria as written in the spec:
1. `load-context.mjs` returns `hasProduct: true` and `hasDesign: true` → covered by Task 4 Step 1.
2. `reference/resend-DESIGN.md` exists and is byte-identical to the CLI output (or fallback) → covered by Task 1 Steps 7–8.
3. No files under `src/`, no `astro.config.mjs`, no `Dockerfile`, no `package.json` modified by this plan → covered by Task 4 Steps 3–4.
4. `git status` shows exactly three new files (relative to start-of-session state) and zero modifications outside docs and root → covered by Task 3 Step 6.
5. Next `/impeccable shape` or `/impeccable craft` invocation references PRODUCT.md anti-references and DESIGN.md's two-section split → not testable in this plan; deferred to the user's next impeccable invocation.

- [ ] **Step 6: Summarize the outcome to the user**

Write one short message:
- The three files created (with paths)
- Whether the CLI succeeded or the fallback was used
- Any spec success criteria that are deferred (criterion 5)
- Ask whether the user wants to commit the three new files (and if so, whether to also commit `docs/superpowers/specs/` and `docs/superpowers/plans/` in the same commit)

---

## Optional Task 5: Commit (USER-GATED)

**Do NOT run this task unless the user explicitly says "commit" or "yes, commit".** CLAUDE.md is explicit: "NEVER commit changes unless the user explicitly asks you to."

- [ ] **Step 1: Confirm scope with the user**

Default proposal:
```
Files to commit:
  PRODUCT.md
  DESIGN.md
  reference/resend-DESIGN.md
  docs/superpowers/specs/2026-05-19-resend-brand-reference-design.md
  docs/superpowers/plans/2026-05-19-resend-brand-reference.md

Files NOT included (pre-existing unstaged changes outside this plan):
  .gitignore
  src/components/Gate.astro
  src/components/Protected.astro
  .agents/
  skills-lock.json
```

Wait for explicit confirmation or correction.

- [ ] **Step 2: Stage the approved files**

PowerShell example (replace with the user's actual confirmed list):
```powershell
git add PRODUCT.md DESIGN.md reference/resend-DESIGN.md docs/superpowers/specs/2026-05-19-resend-brand-reference-design.md docs/superpowers/plans/2026-05-19-resend-brand-reference.md
```

Do NOT use `git add -A` or `git add .` — they would pull in the unrelated pre-existing changes.

- [ ] **Step 3: Commit with a focused message**

Bash (heredoc preserves multi-line formatting):
```bash
git commit -m "$(cat <<'EOF'
docs: install Resend DESIGN.md as aspirational brand reference

Adopts the Resend design system (npx getdesign@latest add resend, v0.6.20)
as the impeccable skill's aspirational reference without touching live
gate/protected pages. PRODUCT.md captures the portfolio's actual brand;
DESIGN.md ships in two sections (live tokens + Resend reference, marked
'do not apply automatically'); reference/resend-DESIGN.md pins the
verbatim source for future drift-checking.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: Verify the commit**

PowerShell:
```powershell
git log -1 --stat
```

Expected: a single new commit listing the five (or user-confirmed) files added.

---

## Done

After Task 4 (or Task 5 if committing), the plan is complete. The impeccable skill now has full context for all future commands on this project.
