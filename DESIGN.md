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
