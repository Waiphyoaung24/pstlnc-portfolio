# Password Gate — Design

**Status:** Draft — awaiting user approval
**Date:** 2026-05-19
**Project:** pstlnc-portfolio (Astro 6 static site, Dockerized on port 82)

## 1. Purpose

Add a passphrase gate to the site. The gate is a cryptographic lock, not a UI toggle: the protected page never exists as plaintext in the deployed artifact. Wrong passphrases reveal nothing.

The passphrase is a single literal string with the slash included:

```
NOMOREMASTERS/NOMORESLAVES
```

## 2. User-facing behavior

1. Visitor lands on `/`. Sees a near-black page: the crest (IMG_0698) centered, a slim underline input below, a muted hint reading `no masters / no slaves` below that. No button.
2. Visitor types the passphrase and presses Enter.
3. **Correct:** gate fades out (~220ms), DOM swaps to the protected page (white archer silhouette from IMG_0685 + the word `soon`), new content fades in (~260ms).
4. **Wrong:** input shakes once (~360ms), clears itself, refocuses. No text feedback. No counter, no lockout.
5. **Re-entry on every visit.** Nothing is persisted — closing the tab returns the visitor to the gate. (No `sessionStorage`, no `localStorage`, no cookies.)

## 3. Architecture

### 3.1 Two screens, one HTML file

- `dist/index.html` — the gate, plus the encrypted payload inline as a base64 string, plus the client crypto code.
- The protected page exists only as ciphertext inside `dist/index.html`. There is no `dist/protected/` directory in the deployed output (the build script deletes it).

### 3.2 Build-time flow

```
astro build
  └── renders src/pages/index.astro             → dist/index.html              (gate, with __ENC_PAYLOAD__ placeholder)
  └── renders src/pages/protected.astro         → dist/protected/index.html    (transient — read then deleted)

node src/scripts/encrypt-payload.mjs
  └── reads SITE_PASSPHRASE from process.env (hard-fails if missing)
  └── reads dist/protected/index.html, extracts <body> innerHTML as plaintext
  └── generates random 16-byte salt and 12-byte IV
  └── derives a 256-bit key via PBKDF2(passphrase, salt, 250000, SHA-256)
  └── encrypts plaintext with AES-GCM(key, iv) → ciphertext+tag
  └── encodes salt ‖ iv ‖ ciphertext as a single base64 string
  └── replaces __ENC_PAYLOAD__ in dist/index.html with that string
  └── deletes dist/protected/ recursively
```

The build hard-fails (non-zero exit) on: missing `SITE_PASSPHRASE`, missing `dist/protected/index.html`, or missing `__ENC_PAYLOAD__` placeholder in `dist/index.html`. A half-encrypted artifact never ships.

Note on naming: an underscore prefix (`_protected.astro`) would cause Astro to skip the file when building routes, so the protected page would never be rendered. We use `protected.astro` (no underscore) so Astro emits `dist/protected/index.html`, then we delete that directory in the encrypt script. The protected route is therefore only reachable during the build process, not in the deployed artifact.

### 3.3 Runtime flow (browser)

```
on form submit:
  pw      = input.value
  encB64  = "<replaced-at-build>"

  try:
    bytes = base64Decode(encB64)
    salt  = bytes[0..16]
    iv    = bytes[16..28]
    ct    = bytes[28..]

    keyMaterial = subtle.importKey("raw", utf8(pw), "PBKDF2", false, ["deriveKey"])
    key         = subtle.deriveKey(
                    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
                    keyMaterial,
                    { name: "AES-GCM", length: 256 },
                    false, ["decrypt"])
    plaintext   = subtle.decrypt({ name: "AES-GCM", iv }, key, ct)   // throws on wrong pw
    html        = new TextDecoder().decode(plaintext)

    fadeOut(gateRoot, 220ms)
    document.body.innerHTML = html
    fadeIn(document.body, 260ms)
    history.replaceState(null, "", "/")
  catch:
    input.classList.add("shake")
    on animationend → remove "shake"
    input.value = ""
    input.focus()
```

No network requests after page load. PBKDF2 derive takes ~50ms on commodity hardware; that latency is hidden inside the gate's fade-out.

## 4. File layout

```
src/
  pages/
    index.astro              ← rewritten — the GATE (replaces current blank)
    protected.astro          ← NEW    — post-unlock content (rendered then deleted at build)
  components/
    Gate.astro               ← NEW    — gate markup + inline client decrypt script
    Protected.astro          ← NEW    — silhouette + "soon"
  scripts/
    encrypt-payload.mjs      ← NEW    — post-build Node encryption script
.env.example                 ← NEW    — documents SITE_PASSPHRASE
.gitignore                   ← edited — already ignores .env and .env.production
package.json                 ← edited — build script chains encrypt-payload.mjs
```

### 4.1 Component responsibilities

| Component | Single responsibility | Knows about |
|---|---|---|
| `Gate.astro` | Render the gate UI; emit the inline client JS that runs PBKDF2/AES-GCM decrypt and DOM swap; contain the `__ENC_PAYLOAD__` placeholder | Nothing about Protected |
| `Protected.astro` | Render the protected content. Pure markup, no auth logic. | Nothing about the gate |
| `index.astro` | Compose: render `<Gate />` | Nothing else |
| `protected.astro` | Compose: render `<Protected />` | Nothing else |
| `encrypt-payload.mjs` | Run the build-time encryption step | `dist/index.html` path, `dist/protected/index.html` path, the placeholder string, `SITE_PASSPHRASE` env var |

### 4.2 `package.json` change

```json
"scripts": {
  "dev":     "astro dev",
  "build":   "astro build && node src/scripts/encrypt-payload.mjs",
  "preview": "astro preview",
  "astro":   "astro"
}
```

The Dockerfile's `RUN npm run build` step picks this up automatically. The Dockerfile needs `SITE_PASSPHRASE` available during build — passed as a build arg or env var. (Implementation plan will pin the Dockerfile change.)

## 5. Crypto parameters

| Parameter | Value | Rationale |
|---|---|---|
| KDF | PBKDF2 with SHA-256 | Web Crypto API native; standard |
| PBKDF2 iterations | 250,000 | Modern OWASP-aligned for SHA-256; ~50ms first-derive latency |
| Salt | 16 random bytes, fresh per build | Required for PBKDF2; build-time random is sufficient |
| Cipher | AES-GCM, 256-bit key | Authenticated — wrong passphrase = auth-tag failure on decrypt |
| IV | 12 random bytes, fresh per build | AES-GCM standard length |
| Output encoding | base64(salt ‖ iv ‖ ciphertext+tag) — single string | Easy to inline as one JS literal |

Build-time random source: `crypto.randomBytes` (Node). Runtime decryption: `crypto.subtle` (Web Crypto API).

## 6. Visual specs

### 6.1 Design tokens (reuse from `src/styles/global.css`)

| Token | Value | Use |
|---|---|---|
| Background | `#0e0e10` (`--bg`) | Both screens |
| Foreground | `#f5f5f5` (`--fg`) | Input text, body text |
| Muted | `#a0a0a8` (`--muted`) | Available, not used directly on gate |
| Accent | `#d4af37` (`--accent`) | Reserved; not used on the gate (restraint) |
| Body font | system stack (`--font-body`) | Input, hint |
| Display font | Cormorant Garamond (`--font-display`) | "soon" on protected page only |

### 6.2 Gate (`/`)

```
viewport:   100dvh, flex column, centered both axes, background #0e0e10
crest:      <img src="/brand assets/IMG_0698.jpg" draggable="false">
            max-height: 52vh
            max-width:  min(80vw, 460px)
spacer:     2.25rem
input:      type="password" name="p" aria-label="passphrase"
            autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
            width: min(280px, 70vw)
            font: 0.85rem system, letter-spacing: 0.18em, color: #f5f5f5
            border: 0 0 1px 0 solid rgba(245,245,245,0.4)
            background: transparent
            text-align: center
            padding: 0.45rem 0
            outline: none; on :focus → border-color #f5f5f5
spacer:     0.9rem
hint:       <p> "no masters / no slaves"
            font: 0.62rem, uppercase, letter-spacing: 0.3em, color: rgba(245,245,245,0.45)
```

- `<title>`: `pstlnc` (unchanged — no hint in the tab)
- `<meta name="robots" content="noindex,nofollow">` on the gate
- Form is a real `<form>` so Enter submits; `preventDefault()` on submit handler

### 6.3 Protected page (post-unlock)

```
viewport:    100dvh, flex column, centered both axes, background #0e0e10
silhouette:  <img src="/brand assets/IMG_0685.jpg">
             max-height: 42vh
             max-width:  min(70vw, 360px)
             filter: invert(1)       ← turns black silhouette into white-on-onyx
             opacity: 0.92
spacer:      1.75rem
line:        <p> "soon"
             font: var(--font-display), 1.6rem, color: var(--fg)
             letter-spacing: 0.04em
             opacity: 0.85
```

### 6.4 Shake animation (wrong passphrase)

```css
@keyframes gate-shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-6px); }
  40%      { transform: translateX(6px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(2px); }
}
.shake { animation: gate-shake 360ms ease-in-out; }
```

JS adds `.shake` on decrypt failure, clears the input value, refocuses, and removes the class on `animationend` so the next failure re-triggers cleanly.

### 6.5 Fade transition (correct passphrase)

- Gate root has `transition: opacity 220ms ease`. JS sets `opacity: 0`, awaits `transitionend`.
- Body innerHTML is swapped to the decrypted content.
- New root starts at `opacity: 0`; one `requestAnimationFrame` later, transition to `opacity: 1` over 260ms ease.

Total perceived transition: ~480ms.

### 6.6 Accessibility

- Hint text is a `<p>`, not a placeholder — screen readers announce it without depending on focus
- Input has `aria-label="passphrase"`
- Contrast: `#f5f5f5` on `#0e0e10` ≈ 18:1 (AAA). Hint at 45% opacity ≈ 8:1 (AAA for >18pt; acceptable for non-essential text)
- `@media (prefers-reduced-motion: reduce)` disables shake and fade — instant DOM swap, no animation

### 6.7 Responsive

- Crest: capped at `52vh` and `min(80vw, 460px)` so it sits cleanly on short laptops and narrow phones
- Input: capped at `min(280px, 70vw)` for the same reason
- No media queries required beyond the `min()`/`vh`/`vw` constraints

## 7. Error handling

| Failure | Where | Visible behavior | Internal behavior |
|---|---|---|---|
| Wrong passphrase | Runtime | Input shakes, clears, refocuses | AES-GCM auth-tag failure throws; caught silently |
| `SITE_PASSPHRASE` not set at build | Build | Build fails with clear message | `encrypt-payload.mjs` exits non-zero before encryption |
| `dist/protected/index.html` missing | Build | Build fails | Script exits non-zero |
| `__ENC_PAYLOAD__` placeholder missing in `dist/index.html` | Build | Build fails | Script exits non-zero |
| `crypto.subtle` unavailable (very old browser) | Runtime | Input does nothing on submit | Caught and treated as "wrong passphrase" — silent shake. No fallback to insecure path. |
| Malformed payload (shouldn't happen) | Runtime | Treated as "wrong passphrase" | Caught and silently shake |

The catch-all "treat decrypt errors as wrong passphrase" means the gate stays silent under any error condition. This is intentional — no oracles, no information leak.

## 8. Security properties

**What this defends against**

- View-source on the gate reveals only ciphertext, the crypto code, and the gate's own UI. The protected page's plaintext is not in the artifact.
- Wrong passphrases reveal nothing — AES-GCM is authenticated; partial plaintext is impossible.
- A determined attacker downloading `dist/index.html` must brute-force passphrases against AES-GCM at ~20 attempts/sec (commodity hardware, 250k PBKDF2 iterations). The 24-character passphrase `NOMOREMASTERS/NOMORESLAVES` has enough entropy that *guessing it* is the binding constraint, not iteration count.

**What this does NOT defend against**

- Leakage of `SITE_PASSPHRASE` (Dokploy env, shell history, build logs). Document it as a deployment secret. Never commit it.
- The passphrase living anywhere else (chat, screenshots, browser history of someone who already entered it).
- Changing the passphrase: requires a rebuild, because the passphrase is baked into the encryption. By design.

## 9. Out of scope

- Persistence after unlock (Q4 answer: re-enter every visit)
- Wrong-passphrase text or error count
- Submit button (Enter only, matches restraint)
- Server-side auth (Dokploy continues to serve `dist/` as static)
- Multiple passphrases / per-user access (single shared passphrase only)
- Captcha, rate-limiting, lockout (static site — none possible)
- Real content behind the gate (placeholder only; the real site is a later spec)

## 10. Deployment notes

- `SITE_PASSPHRASE` must be set as a Dokploy build secret / env var. The Dockerfile change to consume it will be detailed in the implementation plan.
- `.env.example` documents the variable name; the real `.env` / `.env.production` are already gitignored.
- Rotating the passphrase = redeploy. There is no in-app rotation.
