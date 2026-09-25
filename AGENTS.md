<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GF Landing — Project Context

GetirFinans (GF) website prototype. Started as the landing page; the **whole getirfinans.com site gets built here, page by page** — next up after the landing page is the debit card page (`/hesap-karti`). The repo is the **Next.js migration** of a hand-built vanilla prototype (`gf-landing-prototype`), matched close to Figma. The owner (Ulaş) is a designer-engineer leading product design at GetirFinans; this is real work headed to production, not a toy.

This file is the full context. The session running here has no access to the owner's notes vault, so don't assume outside references resolve.

## Stack

- Next.js 16.2.10 (App Router) · React 19 · TypeScript · Tailwind v4 (PostCSS)
- **Motion (motion.dev)** — the library for **all** motion/animation work going forward
- GSAP + `@gsap/react` — legacy, ported from the vanilla build. Don't write new GSAP; migrate to Motion when touching animated code
- `lottie-web` — Lottie asset playback only
- Deploy: Vercel, auto-deploys from GitHub `main` on push

## Where it lives

| | |
|---|---|
| GitHub | https://github.com/ulasalyesil/gf-landing-prototype (public) — `main` holds this Next.js app; vanilla source is in history |
| Vercel | https://vercel.com/ulas-alyesil/gf-landing-prototype · project `prj_TLf8CYQTVsMbp1jYYhBEqU8DIcCB` |
| Live | https://gf-landing-prototype.vercel.app |
| Figma (dev branch) | file `AVH9L2zSe30GBPTkTUAhTo`, branch `tLfL5q8xyHShMuHFV593nN` (Development — Website) |
| Figma (mega menu) | file `oQBanFVh7xrVxnYHokRLt7`, node `21442-42526` |
| Figma (faiz points, mobile) | node `21344:46572` |

## Architecture

- `src/app/page.tsx` — the landing page, 13 sections: hero → stats → rates → features → campaigns → loan/faiz/calculator → debit → transfer → app-split (dark toggle) → AI → footer
- `src/app/hesap-karti/` + `src/app/kredi-karti/` — debit (GFDES-2174) and credit (GFDES-2243) card pages, rebuilt 2026-09-23 from Figma `v2` as one family. Shared pieces (`ProductSubnav`, `ProductHero`, `SectionHead`, `BenefitTile`, `CarouselControls`, `useAutoAdvance`, `FaqCarousel`, `Footer variant="inner"`) are in `src/components/` + `src/styles/product-page.css`; page parts and `debit.css` / `credit.css` are in each route. Read `docs/hesap-karti-handoff.md` (covers both) before touching either
- `src/components/` — one component per section, BEM class names (`.hero__inner`, `.rate-card`…)
- `src/data/content.ts` — all copy and seed data (content is Turkish). Site nav is data too: `NAV` feeds both the desktop nav/mega-dropdown and the ≤920px hamburger menu in `Header.tsx` — don't hardcode menu items back into JSX.
- `src/styles/` — `tokens.css`, `base.css`, `sections.css`, `mobile.css`
- `src/dials/` — DialKit tuning panels (`use<Thing>Dials.ts`), dev-only comparison toggles that get baked into CSS and deleted once a call is made. See `docs/dialkit-plan.md`.
- `design-tokens/` — verbatim Figma colour-token export (primitives + Light/Dark semantics). Reference only, not built code — see `design-tokens/README.md` before assuming a `--gf-*` value maps to what its name implies.

## CSS conventions (critical — a broken migration was already fixed once)

- The four style files are a **verbatim port** from the vanilla build with **original GF token names intact** (`--gf-purple`, `--sp-*`, `--fs-*`, `--r-*`). Do **not** move tokens into Tailwind `@theme` — Tailwind v4 renames them and every component stylesheet breaks. `@theme` exists only for the few Tailwind utilities in use.
- Import cascade order is load-bearing: `tokens → base → sections → mobile` (from `globals.css`).
- One deliberate deviation: `--font-sans` → `var(--font-open-sans)` so `next/font` (self-hosted Open Sans) resolves.
- `mobile.css` (`@media ≤767px`, loaded last) is the authoritative mobile layer. A legacy `@media ≤920px` layer lives in `sections.css` — known tech debt, consolidate when touched, don't grow it. The header/menu rules in that block are now fully consolidated (single source, no duplication in `mobile.css`); the rest of the ≤920 block is still the old debt.
- `--gf-ink-*` names don't imply one ramp — `-700` is `neutral`, `-500`/`--gf-cool-400` are `cool gray`. Check `design-tokens/README.md` before assuming a numbered step continues the one above or below it.
- Yellow highlight sits **in front** of text (z-index); the kredi headline is the exception (per-line cloned bar behind, can't render in front in pure CSS).

## Motion conventions

- Install base: `motion` v12. Import from `"motion/react"` in components.
- All new animation: Motion. Springs over duration curves for interactive elements; scroll-driven work via Motion's scroll APIs rather than GSAP ScrollTrigger.
- Card-page illustrations tell their benefit as a micro-story: `useStory` (`src/components/useStory.ts`) — one scoped Motion sequence, rest frame = the comp, played in view / replayed on hover. Contract and tripwires: `docs/hesap-karti-handoff.md` §5. Media-query hooks must be hydration-safe (`useMotionOff`, `useReducedMotionSafe`), not Motion's `useReducedMotion`.
- Existing GSAP: section entrance reveals, rates, carousel. Replace opportunistically — when a component needs animation changes, port it to Motion in the same pass.
- Mobile ≤767px had reduced motion in the vanilla build; keep the desktop/mobile motion split and re-evaluate on resize (a resize-aware mode fix already shipped once — don't regress it).
- Agent skills pinned in `skills-lock.json`: `emil-design-eng`, `review-animations` (emilkowalski/skill), `ui-skills-root` (ibelick/ui-skills). Use `review-animations` after any motion work.

## GF wording & framing rules (hard rules)

- Special rates: say **"kampanyalı"**, never "sana özel" (legal requirement).
- Icons: the **%** glyph is reserved for interest/faiz; use a **coin** for cashback/getirpara.
- Never frame GF (brand or product) as behind or deficient; make design cases forward-looking.

## Todos

The live task list is **`TODO.md`** in the repo root — read it at session start, keep it updated as work lands. It carries the next-up items (mega menu subtext, Motion integration, highlight border color, debit card finalize), the Vercel 404 deploy blocker, known bugs, and the backlog.
