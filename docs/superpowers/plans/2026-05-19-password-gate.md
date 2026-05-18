# Password Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an encrypted-content passphrase gate to the static Astro portfolio so the protected page never ships as plaintext. Wrong passphrases reveal nothing.

**Architecture:** Astro renders two HTML files at build time — a gate page (`index.html`) and a transient protected page (`protected/index.html`). A post-build Node script (`encrypt-payload.mjs`) reads the protected page's body, encrypts it with PBKDF2 → AES-GCM using the build-time `SITE_PASSPHRASE`, inlines the base64 ciphertext into `index.html`, and deletes the protected directory. The gate's client-side script uses the Web Crypto API to decrypt and DOM-swap on the correct passphrase.

**Tech Stack:** Astro 6 (static build, no integrations), Node 22 (built-in `node:crypto` and `node --test`), Web Crypto API on the client. No new npm dependencies.

**Spec:** `docs/superpowers/specs/2026-05-19-password-gate-design.md`

---

## File Structure

**New files (created in this plan):**

| Path | Purpose |
|---|---|
| `.env.example` | Document `SITE_PASSPHRASE` env var |
| `src/components/Protected.astro` | Markup for post-unlock content (silhouette + "soon") |
| `src/components/Gate.astro` | Markup + inline client decrypt script for the gate |
| `src/pages/protected.astro` | Page wrapper that renders `<Protected />` (transient build artifact) |
| `src/scripts/lib/crypto.mjs` | Pure `encryptHtml(plaintext, passphrase)` function — no I/O |
| `src/scripts/lib/crypto.test.mjs` | `node --test` unit tests for the crypto helper |
| `src/scripts/encrypt-payload.mjs` | Orchestrator that reads/writes `dist/`, calls `encryptHtml`, deletes `dist/protected/` |

**Modified files:**

| Path | Change |
|---|---|
| `src/pages/index.astro` | Rewritten — renders `<Gate />` instead of blank body |
| `package.json` | `build` script chains `node src/scripts/encrypt-payload.mjs` |
| `Dockerfile` | Accept `SITE_PASSPHRASE` as a build arg |

**Boundaries:**
- The crypto math lives in exactly two places: `src/scripts/lib/crypto.mjs` (build-time) and the inline `<script>` in `Gate.astro` (runtime). Same parameters, mirrored implementation.
- The orchestrator (`encrypt-payload.mjs`) is pure filesystem I/O — it does no crypto itself, it just calls `encryptHtml`.
- The two Astro pages are dumb composers (each just renders one component). Logic lives in components.

---

### Task 1: Document the `SITE_PASSPHRASE` env var

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Create the example env file**

Write `.env.example`:

```
# Passphrase baked into the build-time encryption of the protected page.
# Required by src/scripts/encrypt-payload.mjs. Build fails if unset.
# Rotating the passphrase requires a rebuild.
SITE_PASSPHRASE=NOMOREMASTERS/NOMORESLAVES
```

- [ ] **Step 2: Verify .gitignore covers .env**

Run: `grep -n "^\.env" .gitignore`
Expected: prints lines for `.env` and `.env.production` (already present).

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "chore: document SITE_PASSPHRASE env var"
```

---

### Task 2: Protected content component

**Files:**
- Create: `src/components/Protected.astro`
- Create: `src/pages/protected.astro`

The protected component is what gets injected into the DOM after a successful decrypt. Its styles must travel with its markup (the gate's `<head>` doesn't know about them), so we use inline `style=""` attributes.

- [ ] **Step 1: Create the Protected component**

Write `src/components/Protected.astro`:

```astro
---
---
<div
  style="
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0e0e10;
  "
>
  <img
    src="/brand assets/IMG_0685.jpg"
    alt=""
    draggable="false"
    style="
      max-height: 42vh;
      max-width: min(70vw, 360px);
      filter: invert(1);
      opacity: 0.92;
      user-select: none;
    "
  />
  <p
    style="
      margin-top: 1.75rem;
      font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
      font-size: 1.6rem;
      color: #f5f5f5;
      letter-spacing: 0.04em;
      opacity: 0.85;
    "
  >soon</p>
</div>
```

- [ ] **Step 2: Create the page that renders it**

Write `src/pages/protected.astro`:

```astro
---
import Protected from "../components/Protected.astro";
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>pstlnc</title>
    <meta name="robots" content="noindex,nofollow" />
  </head>
  <body style="margin:0;padding:0;">
    <Protected />
  </body>
</html>
```

- [ ] **Step 3: Build and verify the protected page renders**

Run: `npm run build`
Expected: build completes (the encryption script doesn't exist yet, so `package.json` is still the original `astro build` — that's fine).

Run: `test -f dist/protected/index.html && echo OK`
Expected: prints `OK`.

Run: `grep -c "soon" dist/protected/index.html`
Expected: prints `1` or higher.

Run: `grep -c "IMG_0685.jpg" dist/protected/index.html`
Expected: prints `1` or higher.

- [ ] **Step 4: Commit**

```bash
git add src/components/Protected.astro src/pages/protected.astro
git commit -m "feat: protected page content (silhouette + \"soon\")"
```

---

### Task 3: Pure encryption library

**Files:**
- Create: `src/scripts/lib/crypto.mjs`
- Test: `src/scripts/lib/crypto.test.mjs`

A pure, testable function that takes plaintext + passphrase and returns the base64-encoded `salt ‖ iv ‖ ciphertext` blob. No filesystem, no env access.

- [ ] **Step 1: Write the failing test**

Write `src/scripts/lib/crypto.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { encryptHtml } from "./crypto.mjs";

const PASSPHRASE = "NOMOREMASTERS/NOMORESLAVES";
const PLAINTEXT = "<div>secret</div>";

test("encryptHtml produces a base64 string", async () => {
  const out = await encryptHtml(PLAINTEXT, PASSPHRASE);
  assert.equal(typeof out, "string");
  assert.match(out, /^[A-Za-z0-9+/=]+$/);
});

test("encryptHtml output round-trips with the correct passphrase", async () => {
  const out = await encryptHtml(PLAINTEXT, PASSPHRASE);
  const bytes = Uint8Array.from(Buffer.from(out, "base64"));
  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const ct = bytes.slice(28);

  const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(PASSPHRASE),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const key = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  const plain = await webcrypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  assert.equal(new TextDecoder().decode(plain), PLAINTEXT);
});

test("encryptHtml output fails to decrypt with the wrong passphrase", async () => {
  const out = await encryptHtml(PLAINTEXT, PASSPHRASE);
  const bytes = Uint8Array.from(Buffer.from(out, "base64"));
  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const ct = bytes.slice(28);

  const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("wrong"),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const key = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  await assert.rejects(() =>
    webcrypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct)
  );
});

test("encryptHtml produces different output on every call (fresh salt/iv)", async () => {
  const a = await encryptHtml(PLAINTEXT, PASSPHRASE);
  const b = await encryptHtml(PLAINTEXT, PASSPHRASE);
  assert.notEqual(a, b);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test src/scripts/lib/crypto.test.mjs`
Expected: FAIL — cannot import from `./crypto.mjs` (module not found).

- [ ] **Step 3: Implement the crypto helper**

Write `src/scripts/lib/crypto.mjs`:

```javascript
import { webcrypto, randomBytes } from "node:crypto";

const ITERATIONS = 250_000;
const SALT_LEN = 16;
const IV_LEN = 12;

export async function encryptHtml(plaintext, passphrase) {
  if (typeof plaintext !== "string") throw new TypeError("plaintext must be a string");
  if (typeof passphrase !== "string" || passphrase.length === 0)
    throw new TypeError("passphrase must be a non-empty string");

  const salt = new Uint8Array(randomBytes(SALT_LEN));
  const iv = new Uint8Array(randomBytes(IV_LEN));

  const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const key = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const ciphertext = new Uint8Array(
    await webcrypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(plaintext)
    )
  );

  const out = new Uint8Array(salt.length + iv.length + ciphertext.length);
  out.set(salt, 0);
  out.set(iv, salt.length);
  out.set(ciphertext, salt.length + iv.length);
  return Buffer.from(out).toString("base64");
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test src/scripts/lib/crypto.test.mjs`
Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/lib/crypto.mjs src/scripts/lib/crypto.test.mjs
git commit -m "feat: pure PBKDF2/AES-GCM encryption helper"
```

---

### Task 4: Encryption orchestrator script

**Files:**
- Create: `src/scripts/encrypt-payload.mjs`

The script that runs after `astro build`: reads the protected page's body, encrypts it, inlines the ciphertext into `dist/index.html`, and deletes `dist/protected/`. Fails loudly on any missing precondition.

- [ ] **Step 1: Create the orchestrator script**

Write `src/scripts/encrypt-payload.mjs`:

```javascript
#!/usr/bin/env node
import { readFile, writeFile, rm, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { encryptHtml } from "./lib/crypto.mjs";

const PLACEHOLDER = "__ENC_PAYLOAD__";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const GATE_PATH = resolve(ROOT, "dist", "index.html");
const PROTECTED_DIR = resolve(ROOT, "dist", "protected");
const PROTECTED_PATH = resolve(PROTECTED_DIR, "index.html");

function die(msg) {
  console.error(`[encrypt-payload] ERROR: ${msg}`);
  process.exit(1);
}

const passphrase = process.env.SITE_PASSPHRASE;
if (!passphrase) die("SITE_PASSPHRASE is not set");

try {
  await stat(GATE_PATH);
} catch {
  die(`gate not found: ${GATE_PATH}`);
}
try {
  await stat(PROTECTED_PATH);
} catch {
  die(`protected page not found: ${PROTECTED_PATH}`);
}

const gateHtml = await readFile(GATE_PATH, "utf8");
if (!gateHtml.includes(PLACEHOLDER)) {
  die(`placeholder "${PLACEHOLDER}" not found in ${GATE_PATH}`);
}

const protectedHtml = await readFile(PROTECTED_PATH, "utf8");
const bodyMatch = protectedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) die("could not extract <body> from protected page");
const plaintext = bodyMatch[1].trim();
if (!plaintext) die("protected page <body> is empty");

const payload = await encryptHtml(plaintext, passphrase);
const updated = gateHtml.replace(PLACEHOLDER, payload);
if (updated === gateHtml) die("placeholder replacement produced no change");

await writeFile(GATE_PATH, updated, "utf8");
await rm(PROTECTED_DIR, { recursive: true, force: true });

console.log(`[encrypt-payload] OK — payload size: ${payload.length} chars`);
```

- [ ] **Step 2: Smoke-test the script with a temporary placeholder**

This step verifies the script's error paths without needing the gate yet. We'll do the full integration test in Task 8.

First, set up a temporary gate with the placeholder:

```bash
echo '<!doctype html><html><body>__ENC_PAYLOAD__</body></html>' > dist/index.html
```

Run with no passphrase, expect failure:
```bash
SITE_PASSPHRASE="" node src/scripts/encrypt-payload.mjs; echo "exit=$?"
```
Expected: prints `[encrypt-payload] ERROR: SITE_PASSPHRASE is not set` and `exit=1`.

Run with passphrase, expect success:
```bash
SITE_PASSPHRASE="NOMOREMASTERS/NOMORESLAVES" node src/scripts/encrypt-payload.mjs; echo "exit=$?"
```
Expected: prints `[encrypt-payload] OK — payload size: <N> chars` and `exit=0`.

Verify the placeholder was replaced and `dist/protected/` is gone:
```bash
grep -c "__ENC_PAYLOAD__" dist/index.html
test -d dist/protected && echo "STILL EXISTS" || echo "REMOVED"
```
Expected: `0` and `REMOVED`.

- [ ] **Step 3: Clean up the smoke-test artifacts**

```bash
rm -rf dist
```

- [ ] **Step 4: Commit**

```bash
git add src/scripts/encrypt-payload.mjs
git commit -m "feat: post-build encryption orchestrator"
```

---

### Task 5: Wire the build script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update the build script**

Edit `package.json` to chain the encryption script after `astro build`. Change the `"build"` line to:

```json
    "build": "astro build && node src/scripts/encrypt-payload.mjs",
```

Final scripts block:

```json
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && node src/scripts/encrypt-payload.mjs",
    "preview": "astro preview",
    "astro": "astro"
  },
```

- [ ] **Step 2: Verify the wiring (will fail because Gate doesn't exist yet)**

Run: `SITE_PASSPHRASE="NOMOREMASTERS/NOMORESLAVES" npm run build`
Expected: `astro build` succeeds, then the script fails with `placeholder "__ENC_PAYLOAD__" not found in .../dist/index.html` (because we haven't built the Gate yet). This confirms the chain works.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "build: chain encrypt-payload after astro build"
```

---

### Task 6: Gate component

**Files:**
- Create: `src/components/Gate.astro`
- Modify: `src/pages/index.astro`

The gate renders the crest + input + hint, holds the `__ENC_PAYLOAD__` placeholder in a JS string, and contains the inline decrypt script. Scoped styles are fine here because the gate runs on its own page.

- [ ] **Step 1: Create the Gate component**

Write `src/components/Gate.astro`:

```astro
---
---
<div id="gate-root" class="gate-root">
  <img
    class="gate-crest"
    src="/brand assets/IMG_0698.jpg"
    alt=""
    draggable="false"
  />
  <form id="gate-form" autocomplete="off" novalidate>
    <input
      id="gate-input"
      class="gate-input"
      type="password"
      name="p"
      aria-label="passphrase"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
    />
  </form>
  <p class="gate-hint">no masters / no slaves</p>
</div>

<style>
  .gate-root {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    transition: opacity 220ms ease;
  }
  .gate-crest {
    max-height: 52vh;
    max-width: min(80vw, 460px);
    user-select: none;
  }
  #gate-form {
    margin-top: 2.25rem;
    margin-bottom: 0.9rem;
  }
  .gate-input {
    width: min(280px, 70vw);
    border: 0;
    border-bottom: 1px solid rgba(245, 245, 245, 0.4);
    background: transparent;
    color: var(--fg);
    font-family: var(--font-body);
    font-size: 0.85rem;
    letter-spacing: 0.18em;
    text-align: center;
    padding: 0.45rem 0;
    outline: none;
    transition: border-color 160ms ease;
  }
  .gate-input:focus {
    border-bottom-color: var(--fg);
  }
  .gate-hint {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(245, 245, 245, 0.45);
    margin: 0;
  }
  @keyframes gate-shake {
    0%, 100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(2px); }
  }
  .gate-input.shake { animation: gate-shake 360ms ease-in-out; }
  @media (prefers-reduced-motion: reduce) {
    .gate-root, .gate-input { transition: none; }
    .gate-input.shake { animation: none; }
  }
</style>

<script is:inline>
  (function () {
    const ENC_B64 = "__ENC_PAYLOAD__";
    const ITERATIONS = 250000;
    const SALT_LEN = 16;
    const IV_LEN = 12;

    const root = document.getElementById("gate-root");
    const form = document.getElementById("gate-form");
    const input = document.getElementById("gate-input");

    function shake() {
      input.classList.remove("shake");
      void input.offsetWidth;
      input.classList.add("shake");
      input.value = "";
      input.focus();
    }

    function fromB64(s) {
      const bin = atob(s);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return bytes;
    }

    async function deriveKey(pw, salt) {
      const km = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(pw),
        "PBKDF2",
        false,
        ["deriveKey"]
      );
      return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: salt, iterations: ITERATIONS, hash: "SHA-256" },
        km,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );
    }

    function reveal(html) {
      const onFadeOut = () => {
        root.removeEventListener("transitionend", onFadeOut);
        document.body.innerHTML = html;
        const newRoot = document.body.firstElementChild;
        if (newRoot) {
          newRoot.style.opacity = "0";
          newRoot.style.transition = "opacity 260ms ease";
          requestAnimationFrame(() => {
            newRoot.style.opacity = "1";
          });
        }
        history.replaceState(null, "", "/");
      };
      root.addEventListener("transitionend", onFadeOut);
      root.style.opacity = "0";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onFadeOut();
      }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const pw = input.value;
      if (!pw) return;
      try {
        if (!crypto || !crypto.subtle) throw new Error("no subtle");
        const bytes = fromB64(ENC_B64);
        const salt = bytes.slice(0, SALT_LEN);
        const iv = bytes.slice(SALT_LEN, SALT_LEN + IV_LEN);
        const ct = bytes.slice(SALT_LEN + IV_LEN);
        const key = await deriveKey(pw, salt);
        const plain = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: iv },
          key,
          ct
        );
        const html = new TextDecoder().decode(plain);
        reveal(html);
      } catch {
        shake();
      }
    });

    input.focus();
  })();
</script>
```

- [ ] **Step 2: Rewrite `index.astro` to render the Gate**

Write `src/pages/index.astro`:

```astro
---
import "../styles/global.css";
import Gate from "../components/Gate.astro";
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="robots" content="noindex,nofollow" />
    <title>pstlnc</title>
  </head>
  <body>
    <Gate />
  </body>
</html>
```

- [ ] **Step 3: Build and verify the placeholder is present in the pre-encrypt output**

Build with a passphrase so the full chain runs:
```bash
SITE_PASSPHRASE="NOMOREMASTERS/NOMORESLAVES" npm run build
```
Expected: build succeeds; final line prints `[encrypt-payload] OK — payload size: <N> chars`.

Verify the placeholder is gone and the ciphertext is inlined:
```bash
grep -c "__ENC_PAYLOAD__" dist/index.html
```
Expected: `0`.

Verify the gate markup is in place:
```bash
grep -c 'id="gate-root"' dist/index.html
```
Expected: `1`.

Verify `dist/protected/` is gone:
```bash
test -d dist/protected && echo "STILL EXISTS" || echo "REMOVED"
```
Expected: `REMOVED`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Gate.astro src/pages/index.astro
git commit -m "feat: passphrase gate with PBKDF2/AES-GCM decrypt"
```

---

### Task 7: Dockerfile build arg

**Files:**
- Modify: `Dockerfile`

The Docker build runs `npm run build`, which now requires `SITE_PASSPHRASE`. We accept it as a build arg and expose it as an env var inside the build stage. The runtime stage doesn't need it (the artifact is already baked).

- [ ] **Step 1: Update the Dockerfile**

Replace the build stage of `Dockerfile` so it reads:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
ARG SITE_PASSPHRASE
ENV SITE_PASSPHRASE=${SITE_PASSPHRASE}
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN test -n "$SITE_PASSPHRASE" || (echo "SITE_PASSPHRASE build arg is required" && exit 1)
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
ENV PORT=82
EXPOSE 82
CMD ["serve", "-s", "dist", "-l", "82"]
```

- [ ] **Step 2: Verify the Docker build accepts the build arg**

Run:
```bash
docker build --build-arg SITE_PASSPHRASE="NOMOREMASTERS/NOMORESLAVES" -t pstlnc-test .
```
Expected: builds successfully, ending with the runtime stage.

Run without the build arg, expect failure:
```bash
docker build -t pstlnc-test-fail . 2>&1 | tail -5
```
Expected: contains `SITE_PASSPHRASE build arg is required` and non-zero exit.

- [ ] **Step 3: Note Dokploy configuration**

In the Dokploy UI for this service, the operator must add `SITE_PASSPHRASE` as a **build-time environment variable** (not a runtime variable) so it's available to `ARG SITE_PASSPHRASE`. This is a deployment step, not a code step — but document it in the commit message for clarity.

- [ ] **Step 4: Commit**

```bash
git add Dockerfile
git commit -m "$(cat <<'EOF'
build: accept SITE_PASSPHRASE as Docker build arg

Required at build time so encrypt-payload.mjs can bake the
encrypted payload into dist/index.html. In Dokploy, set
SITE_PASSPHRASE as a build-time env var for this service.
EOF
)"
```

---

### Task 8: End-to-end verification

**Files:**
- (No code changes — verification only)

Confirm the full system works against a real browser. This is the only check that catches client-side regressions.

- [ ] **Step 1: Clean build**

```bash
rm -rf dist
SITE_PASSPHRASE="NOMOREMASTERS/NOMORESLAVES" npm run build
```
Expected: build succeeds; `[encrypt-payload] OK` prints.

- [ ] **Step 2: Verify the deployed artifact contents**

```bash
test -d dist/protected && echo "FAIL: protected dir still exists" || echo "OK: protected dir gone"
grep -c "__ENC_PAYLOAD__" dist/index.html
grep -c "id=\"gate-root\"" dist/index.html
grep -c "soon" dist/index.html
grep -c "IMG_0685" dist/index.html
```
Expected: `OK: protected dir gone`, `0`, `1`, `0`, `0`. The `soon` and `IMG_0685` should NOT appear as plaintext — they're inside the encrypted blob. If either is `>0`, the encryption didn't cover them.

- [ ] **Step 3: Serve locally**

```bash
npx serve -s dist -l 5173
```
Expected: server starts; URL printed.

- [ ] **Step 4: Manually verify in a browser**

Open `http://localhost:5173` in a real browser.

Verify each behavior:
- Crest is centered on a near-black background; input underline is visible below; hint reads "NO MASTERS / NO SLAVES" in muted small-caps below the input.
- Type a wrong passphrase (e.g. `wrong`) and press Enter. Input shakes once horizontally, clears, refocuses. No text appears.
- Type `NOMOREMASTERS/NOMORESLAVES` and press Enter. Gate fades out (~220ms), then the white archer silhouette appears centered with "soon" below it.
- Refresh the page. Gate returns (no persistence — correct per spec).
- View page source (Ctrl+U). The word "soon" should NOT appear anywhere in the source; only ciphertext.

- [ ] **Step 5: Stop the server**

`Ctrl+C` in the serve terminal.

- [ ] **Step 6: Verify reduced-motion behavior (optional but documented in spec)**

In browser DevTools → Rendering panel → "Emulate CSS media feature prefers-reduced-motion" → set to `reduce`. Reload, enter the correct passphrase. The DOM swap should be instant — no fade. Wrong passphrase should not animate the input.

- [ ] **Step 7: Final commit (only if you fixed anything during verification)**

If verification revealed issues that required code changes, commit them with a clear message describing what was fixed and why.

If verification passed cleanly, no commit is needed for this task.

---

## Self-Review

**Spec coverage check (against `docs/superpowers/specs/2026-05-19-password-gate-design.md`):**

| Spec section | Covered by |
|---|---|
| §2 User-facing behavior | Tasks 6 (gate + decrypt + shake + fade), 2 (protected content), 8 (manual verify) |
| §3.1 Two screens, one HTML file | Task 4 (orchestrator deletes protected dir) |
| §3.2 Build-time flow | Tasks 3, 4, 5 |
| §3.3 Runtime flow | Task 6 (inline script) |
| §4 File layout | All tasks; each new file has its own task |
| §5 Crypto parameters | Task 3 (lib) + Task 6 (client) — same constants in both |
| §6.1 Design tokens | Task 6 references `var(--bg)`, `var(--fg)`, `var(--font-body)`; Task 2 inlines the same colors |
| §6.2 Gate layout | Task 6 |
| §6.3 Protected page | Task 2 |
| §6.4 Shake animation | Task 6 (CSS + class toggle) |
| §6.5 Fade transition | Task 6 (transition + opacity + rAF) |
| §6.6 Accessibility | Task 6 (`aria-label`, hint as `<p>`), prefers-reduced-motion media query |
| §6.7 Responsive | Task 6 (`min()`/`vh`/`vw` constraints) |
| §7 Error handling | Task 4 (build-time hard fails), Task 6 (runtime silent catch → shake) |
| §10 Deployment notes | Task 7 (Dockerfile build arg + Dokploy note) |

No gaps.

**Placeholder scan:** No "TBD" / "TODO" / vague handwaving. Every code step contains full code; every command step contains the exact command and expected output.

**Type consistency:** `encryptHtml(plaintext, passphrase)` signature used identically in `crypto.mjs`, `crypto.test.mjs`, and `encrypt-payload.mjs`. Constants `ITERATIONS`, `SALT_LEN`, `IV_LEN` are 250000/16/12 in both build-time and runtime code. Placeholder string `__ENC_PAYLOAD__` is identical across `Gate.astro` and `encrypt-payload.mjs`. Element IDs (`gate-root`, `gate-form`, `gate-input`) match between markup and inline script.
