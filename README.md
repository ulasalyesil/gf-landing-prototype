# getirfinans — website

The getirfinans.com site, built page by page. This repo is the **Next.js migration** of a
hand-built vanilla prototype, matched closely to Figma. It is real work headed to
production, not a sandbox.

| | |
|---|---|
| Live | <https://gf-landing-prototype.vercel.app> |
| Deploy | Vercel, automatic on push to `main` |
| Stack | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 |

---

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Script | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build — run before pushing anything structural |
| `npm run start` | serve the production build |
| `npm run lint` | eslint |

`.claude/launch.json` pins a port per page (`hesap-karti` 3977, `kredi-karti` 3979,
`pnib-sozluk` 3975) so several can run side by side.

## Routes

| Route | |
|---|---|
| `/` | landing page — 13 sections, `Hero` through `Newsletter` |
| `/hesap-karti` | debit card (card pages v2). **Read [`docs/hesap-karti-handoff.md`](docs/hesap-karti-handoff.md) before touching it** |
| `/kredi-karti` | credit card (card pages v2) — same handoff doc, shared components |
| `/pnib`, `/pnib/sozluk` | #paranaiyibak campaign site and its glossary |

## Layout

```
src/app/          routes; a page with its own components keeps them in its folder
src/components/   shared sections and primitives (Header, Footer, Reveal, ProductHero…)
src/data/         content.ts — ALL copy and seed data, in Turkish
src/styles/       tokens · base · sections · mobile · product-page · spacing-system
src/dials/        dev-only tuning panels (see the warning below)
design-tokens/    verbatim Figma colour export — reference only, not built code
docs/             per-page handoff notes and design records
```

**Content is data, not JSX.** Copy lives in `src/data/content.ts`, including the site
nav — `NAV` feeds both the desktop mega-dropdown and the mobile menu. Don't hardcode
either back into components.

---

## Before you change anything

### CSS — the one that has already broken once

Four of the files in `src/styles/` — `tokens`, `base`, `sections`, `mobile` — are a
**verbatim port** from the vanilla build, with the original GF token names intact
(`--gf-purple`, `--sp-*`, `--fs-*`, `--r-*`). `product-page.css` and
`spacing-system.css` came later and are ordinary project CSS.

> **Do not move those tokens into Tailwind's `@theme`.** Tailwind v4 renames them and
> every component stylesheet breaks. `@theme` exists only for the handful of Tailwind
> utilities actually in use.

Import order is load-bearing: `tokens → base → sections → mobile`, from `globals.css`.
`mobile.css` (≤767px) is the authoritative mobile layer and must load last.

`--gf-ink-*` names do not all belong to one ramp — check
[`design-tokens/README.md`](design-tokens/README.md) before assuming a numbered step
continues the one above it.

### Motion

**[Motion](https://motion.dev) is the library for all new animation**, imported from
`motion/react`. GSAP is legacy, ported from the vanilla build; don't write new GSAP —
migrate a component to Motion when you next touch its animation.

Motion needs an explicit `initial` for any property you animate. Without a baseline it
writes the literal string `undefined` into the attribute — this has bitten the codebase
three times.

### Dev tooling

`dialkit` and `agentation` are development panels, wired through
`src/dials/DevTools.tsx` behind a **lazy** import.

> A `NODE_ENV` check gates the *render*, not the *bundle*. A static import ships the
> library to production regardless — that was once 443KB on a single page. Keep every
> dev-only import inside `DevTools.tsx`, and note that a React hook cannot be lazily
> loaded at all.

To verify before shipping: `npm run build`, then grep the emitted chunks in
`.next/static/chunks` for `DialRoot|useDialKit|Agentation`. Zero hits is the pass
condition.

### Copy

Two hard rules, both non-negotiable:

- Special rates are **"kampanyalı"**, never "sana özel" — a legal requirement.
- The **%** glyph is reserved for interest/faiz icons. Cashback and getirpara use a coin.

Full wording and framing rules are in [`AGENTS.md`](AGENTS.md).

---

## Where to look next

| | |
|---|---|
| [`AGENTS.md`](AGENTS.md) | project conventions in full — architecture, CSS rules, wording rules |
| [`TODO.md`](TODO.md) | the live task list: next up, blockers, bugs, backlog |
| [`docs/`](docs/) | per-page handoff notes and design records |

Typography is Open Sans, self-hosted via `next/font`, exposed to the stylesheets as
`--font-open-sans`.
