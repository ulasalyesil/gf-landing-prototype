# TODO

**Scope:** this repo is no longer just a landing page prototype. The whole getirfinans.com website gets built here, page by page. Next page after the landing page: the debit card page (`/hesap-karti`).

## Next up

- [ ] **Mega menu — subtext fix** for *mini kredi* and *kasada kredi* items
- [x] **Motion integration** — landing page ported to Motion on the `motion-integration` branch (shared `Reveal` component replaces the GSAP reveals; ideation + build order in `docs/motion-ideation.md`). Remaining: `Loan` clip-path scroll-scrub still GSAP (port when touched)
- [x] **Yellow highlight — purple borders on light sections** — done on `motion-integration`: brand purple on all light sections, yellow kept on dark (.debit, .app-dark) and /hesap-karti
- [ ] **Debit card page — finalize design** (`/hesap-karti`, GFDES-2174; layout locked "Dakikalar, drenched" → layout iteration → micro-interactions, built with Motion)
  - **Hero decided: C kart xl** (2026-07-10). Lab deleted (`HeroVariants.tsx`, `debit-hero-variants.css`, picker, `?hero=`); C lives as `Hero.tsx` with its geometry baked into `debit-current.css`, copy in `content.ts` (`DEBIT_HERO`). Next: micro-interactions pass.
  - Sections 2–7 layout iterated (fluid grid replaces the absolute comp): earn polished (scrim, ₺1.250), steps → "dakikalar" lilac field with ghost numerals + **Turkish draft copy (needs owner/legal review — replaced English template text)**, transfers/ATM/sanal consolidated into a capability bento with dark sanal panel, abroad collage now %-based (scroll strip ≤920). Copy moved to `content.ts` (`DEBIT_*`). Entrances via shared `Reveal`; `.hl` underlines draw on scroll like landing.
  - Header light-hero variant done properly: `<Header variant="inner" />` applies the vanilla build's `.site-header--inner` styles (ink nav, purple logo, CTA visible at top) — the `body[data-hero]` CSS patch is gone. Note: `--inner` also shows the header CTA before scroll, which the old patch didn't; intended per the vanilla design.
  - **DialKit installed** (`DialRoot` mounted in layout, dev-only) — application plan in `docs/dialkit-plan.md`: hero-lab geometry dials first, then shared motion dials (`src/dials/`) for the micro-interactions pass; tuned values get baked in and dials removed.
  - **Teslimatı compact layout variant** (`DeliveryCompact.tsx`, link-only via `?steps=compact`, Figma 21619:8182): lilac intro panel + bg-soft steps panel, phone on the seam. Shares the stacked layout's driver/mode/SEG machinery (exported from `DeliverySteps.tsx`); no bars/courier — the phone is the progress readout. **Waiting on the phone-screens lottie** (`PHONE_LOTTIE` → `/assets/lottie/steps-phone.json`, author screens to SEG thirds; driver-scrubbed via goToAndStop, static phone img until then). Pick stacked vs compact, then delete the loser + the param plumbing.
  - **Teslimatı scroll sequence built** (`DeliverySteps.tsx`): sticky-pinned scrub ≥921 / timed in-view run 768–920 / settled ≤767+reduced-motion. **Waiting on 2 lottie files (step 1 + step 3)** — wire via `STEP1_LOTTIE`/`STEP3_LOTTIE`, then retune `SEG` holds to the lottie durations. Courier ported from landing `.debit__moto` (same curve/bob/travel pattern). Scrub feel needs a real-browser QA pass (headless can't scroll) — good first DialKit candidate.
  - **Abroad collage stagger** (`AbroadCollage.tsx`): card entrance completes → Lisbon → Berlin → rest shuffled once per load, 80ms stagger, never re-triggers. DOM order is fixed and the randomness lives in the delays — shuffling in render caused an SSR/client hydration mismatch (same trap as `CampaignsCarousel`).
  - **Sanal kart is now its own section** (`.dpc-sanal`, `#sanal-kart`, full-bleed dark like landing `.debit`) — it's a distinct product, not an attribute of the physical card. Heading `sanal hesap kartıyla / güvenle harca` is a **draft, needs owner review**. Section is anchor/deep-link ready if it ever gets its own page.

## Blocker

- [x] **Vercel 404** — resolved (Framework Preset set to Next.js, Deployment Protection off). Live and serving `main`: https://gf-landing-prototype.vercel.app/hesap-karti

## Bugs

- [x] `CampaignsCarousel` hydration mismatch — fixed on `motion-integration`: pos classes derive from state in render, no `window` reads
- [x] `Rates` GSAP "target not found" — gone with the Motion port (`motion-integration`); GSAP removed from Rates entirely
- [x] `AbroadCollage` hydration mismatch — shuffling during render made the prerendered order differ from the client (and vary per request); DOM order is now fixed and the randomness lives in the stagger delays, set in an event callback
- [x] `HeroVariants` `setState`-in-effect lint error reading `?hero=` — replaced with `useSyncExternalStore`

## Backlog

- [ ] Wire AI assistant mobile lottie (`ai-assistant-mobile.json`, slot framed 4:5) once exported
- [ ] GFDES-2135 revisions (source: Figma comments on the dev branch): hero flips title **and** subtitle through 4 offer pairs; FX cards drop average rate, push al/sat forward (needs design exploration); stats section gets a title, keep the 1.000.000+ badge; moped animates along the yellow underline; remove bottom "kendi uygulamasında" CTA
- [ ] 10/10 review pass — critique the page with design skills (animations, web design guidelines), produce findings, close them
- [ ] Consolidate the two mobile CSS layers (920 → 767)
