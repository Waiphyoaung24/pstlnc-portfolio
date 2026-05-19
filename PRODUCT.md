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
