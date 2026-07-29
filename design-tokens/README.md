# Design tokens — colour

Created by Claude · Classification: INTERNAL

Verbatim [DTCG-format](https://tr.designtokens.org/format/) export of the GF colour system
from Figma, supplied by the owner 2026-07-29. **Reference material, not built code** —
nothing in `src/` imports these. They exist so colour questions have an authoritative
answer in-repo instead of needing a Figma round-trip.

| File | Contents |
|---|---|
| `primitives.json` | Raw ramps: `purple-dark`, `purple-light`, `yellow`, `neutral`, `cool gray`, `green`, `orange`, `red`, `transparent/{white,black}` |
| `semantic.Light.tokens.json` | Light-theme semantic roles (`text/content/*`, `bg/surface/*`, `border/*`, `icon/*`, `chart/*`) → primitives |
| `semantic.Dark.tokens.json` | Same role names, dark-theme values |

Do not hand-edit. Re-export from Figma and replace wholesale, so the files stay
diffable against the design system.

## Relationship to `src/styles/tokens.css`

`tokens.css` is the hand-maintained subset the site actually uses, with GF's original
names (`--gf-purple`, `--gf-ink-700`…). Per `AGENTS.md` those names are load-bearing —
a broken migration was already fixed once — so this export is **not** a drop-in
replacement and the CSS should not be regenerated from it.

Every hex in `tokens.css` was cross-checked against `primitives.json` on 2026-07-29.

Two things that audit turned up, both documented inline in `tokens.css`:

**1. The `--gf-ink-*` family spans two ramps.** Worth knowing before assuming a
consistent scale:

| CSS token | Hex | Primitive | Light semantic role |
|---|---|---|---|
| `--gf-ink` | `#0e0e0e` | `neutral/900` | `text/content/primary` |
| `--gf-ink-700` | `#3e3e3e` | `neutral/700` | `text/content/secondary` |
| `--gf-cool-400` | `#8c96a4` | `cool gray/400` | `text/content/tertiary` |
| `--gf-ink-500` | `#606a7c` | `cool gray/500` | `text/amount/default` |
| `--gf-ink-400` | `#959595` | `neutral/500` | `icon/selection/checked-disabled` |

`--gf-cool-400` was added on 2026-07-29 because `text/content/tertiary` had no token.
It had been guessed as `--gf-ink-400` (`#959595`) from ramp continuity — **wrong**;
tertiary is cool gray, not neutral. This export is why guessing is no longer necessary.

**2. Seven values are not in the export.** Hand-picked during the vanilla build, so
treat them as unversioned until a designer confirms them:

`--gf-purple-700` `#4a309c` · `--gf-purple-ink` `#1a1340` · `--gf-yellow-600` `#e3bd49` ·
`--gf-card-purple` `#2f205d` · `--gf-dark-bg` `#1c1340` · `--gf-dark-bg-2` `#130d2e` ·
`--gf-dark-surface` `#2a1f55`

Mostly the dark app-split section, which was composited by eye. Not changed — they're
used across the site and reconciling them is a design decision, not a cleanup.

## Dark theme

`semantic.Dark.tokens.json` is unused so far. The site's dark section uses the
hand-picked values above rather than the dark theme's roles. If the "flip the whole
site to dark on scroll" idea in `TODO.md` gets built, this file is the starting point —
role names match Light exactly, so a theme swap is a value substitution.
