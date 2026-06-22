# CLAUDE.md — gf-landing-prototype

## What this is

A high-fidelity marketing landing page for **getirfinans** (GF), a Turkish digital bank (banking by Fibabanka). Single-page, Turkish copy, built to mirror Figma designs pixel-close for a design review. Vanilla HTML/CSS/JS — **no framework, no build step** — chosen for maximum performance and granular GSAP animation control.

Tone: playful, confident, "para'na iyi bak" brand voice. Headline gimmick: hero title cycles through "ama ne finans / kazanç / kart / faiz!".

## Run

No build. Serve statically and open in a browser:

```
python3 -m http.server 8755 --bind 127.0.0.1
```

(`.claude/launch.json` defines this as the `gf-landing` config, port 8755.)

- `?static` query param reveals all `.reveal` elements and skips entrance animations — use for visual QA / screenshots (`main.js`).

## Architecture

**`index.html`** — one semantic markup file, 13 sections in order: hero → stats → rates → features (`#neler`) → campaigns → **[loan → faiz → calculator]** → debit → transfer → standalone/dark → AI → footer.

**CSS** (load order matters):
- `css/tokens.css` — source of truth. GF design-system vars: colors (`--gf-purple #5d3ebc`, `--gf-yellow #ffd300`), type scale, spacing (4-base), radius, motion, elevation. Source new values here, never hardcode.
- `css/base.css` — resets, type hierarchy, `.btn`, utility classes (`.reveal`/`.reveal-left`/`.reveal-right` scroll-in, `.hl`/`.mark` animated headers).
- `css/sections.css` — per-section layout + mobile `@media`, grouped chronologically by section.

**JS** (load order in `index.html`, all expose `window.init*` called by `main.js`):
- `js/content.js` — editable copy/config: `HERO_TITLES`, `HERO_BADGES`, `RATES_SEED`, `RATES_CYCLE_MS`. Swap copy here.
- `js/rates.js` — injects the live-updating currency cards (`#ratesCards`).
- `js/carousel.js` — campaigns slider; native CSS `scroll-snap` + JS to sync pagination dots.
- `js/animations.js` — all GSAP/ScrollTrigger timelines, including the staggered `.faiz-phone-1/2/3` reveal.
- `js/main.js` — bootstrap: header scroll state + logo swap, calculator mock logic, video pruning, optional AI Lottie, `?static` hook, orchestrates `start()`.

Libraries via CDN: GSAP + ScrollTrigger, lottie-web.

## Conventions — preserve these

- **Open Sans only**, weights **400 / 600 / 700**. No 800/900 (avoids "AI slop" density). Font requested in `index.html` and tokenized as `--fw-*`.
- **Animated headers**: `.hl` / `.mark` yellow underline is an absolutely-positioned `::after` (in `base.css`) overlapping text by `-4px`, animating `width: 0 → 100%` on `.reveal.is-in`. Not a background gradient.
- **`.bg-lilac-wrap`**: groups loan + faiz + calculator on a clean **white** field (matches Figma). Lilac is an accent only — the faiz points panel and the calc inner container — not a blanket background.
- **`.btn`**: Figma spacing (`padding: 12px 24px 12px 16px; gap: 8px`), **no box-shadow**, uses `<img src="assets/icons/arrow-right-circle.svg">` not inline SVG.
- **Campaigns**: pure CSS `scroll-snap-type: x mandatory` for mobile swipe. Don't `display:none` cards via JS — let CSS own the scroll physics.
- **Graceful degradation**: every `<img>`/`<video>` has `onerror` removal; missing assets fall back to styled `.ph` placeholders carrying a `data-label`. Never assume an asset exists.

## Assets

`.png` and `.svg` only — no `.jpg`. Exact paths and present/pending files are tracked in **`ASSETS.md`**; match the names there and assets appear with zero code changes. Currently pending: `ai-man.png`, `ai-phone.png`, `darkmode-phone.png` (render as placeholders until supplied).

## Before layout rewrites

Read the current `css/sections.css` media queries and `index.html` structure first — the prototype is tuned close to Figma, so changes regress easily. Make surgical edits; match surrounding style.

## Skills for working here

- **`landing-page-design`** — hero/CTA/above-the-fold conversion rules; primary reference for this project type.
- **`anthropic-skills:ui-ux-pro-max`** / **`product-design`** — visual system, typography, spacing, motion decisions.
- **`design:design-critique`** — structured feedback on a section before/after a pass.
- **`design:accessibility-review`** / **`anthropic-skills:web-design-guidelines`** — contrast, focus, touch targets, semantic HTML audit before handoff.
- **`design:design-handoff`** — generate dev specs from a section.
- **`ux-audit`** — dogfood the served page as a user, log friction.
- **`verify`** / **`run`** — launch and screenshot the page to confirm a change in-browser.
