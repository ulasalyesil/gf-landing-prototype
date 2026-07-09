# TODO

**Scope:** this repo is no longer just a landing page prototype. The whole getirfinans.com website gets built here, page by page. Next page after the landing page: the debit card page (`/hesap-karti`).

## Next up

- [ ] **Mega menu — subtext fix** for *mini kredi* and *kasada kredi* items
- [x] **Motion integration** — landing page ported to Motion on the `motion-integration` branch (shared `Reveal` component replaces the GSAP reveals; ideation + build order in `docs/motion-ideation.md`). Remaining: `Loan` clip-path scroll-scrub still GSAP (port when touched)
- [x] **Yellow highlight — purple borders on light sections** — done on `motion-integration`: brand purple on all light sections, yellow kept on dark (.debit, .app-dark) and /hesap-karti
- [ ] **Debit card page — finalize design** (`/hesap-karti`, GFDES-2174; layout locked "Dakikalar, drenched" → layout iteration → micro-interactions, built with Motion)
  - Hero variant lab in place (`?hero=` + bottom picker): shortlist is **C kart xl** (title now matches landing hero scale) or **D lilac**; A wireframe + B drenched kept for comparison. Pick, delete lab scaffolding, then micro-interactions.
  - Sections 2–7 layout iterated (fluid grid replaces the absolute comp): earn polished (scrim, ₺1.250), steps → "dakikalar" lilac field with ghost numerals + **Turkish draft copy (needs owner/legal review — replaced English template text)**, transfers/ATM/sanal consolidated into a capability bento with dark sanal panel, abroad collage now %-based (scroll strip ≤920). Copy moved to `content.ts` (`DEBIT_*`). Entrances via shared `Reveal`; `.hl` underlines draw on scroll like landing.
  - Header needs a proper light-hero variant prop — white logo/nav were invisible over the white hero; currently patched via scoped CSS in `debit-hero-variants.css`.
  - **DialKit installed** (`DialRoot` mounted in layout, dev-only) — application plan in `docs/dialkit-plan.md`: hero-lab geometry dials first, then shared motion dials (`src/dials/`) for the micro-interactions pass; tuned values get baked in and dials removed.

## Blocker

- [ ] **Vercel 404** (project setting, not code) — Framework Preset is still "Other", so Vercel ignores `.next`. Dashboard: Settings → Build & Development → Framework Preset = **Next.js** (clear Output Directory override) → Redeploy. Also turn off Deployment Protection (Vercel Authentication) — it redirects every working URL to vercel.com/login.

## Bugs

- [x] `CampaignsCarousel` hydration mismatch — fixed on `motion-integration`: pos classes derive from state in render, no `window` reads
- [x] `Rates` GSAP "target not found" — gone with the Motion port (`motion-integration`); GSAP removed from Rates entirely

## Backlog

- [ ] Wire AI assistant mobile lottie (`ai-assistant-mobile.json`, slot framed 4:5) once exported
- [ ] GFDES-2135 revisions (source: Figma comments on the dev branch): hero flips title **and** subtitle through 4 offer pairs; FX cards drop average rate, push al/sat forward (needs design exploration); stats section gets a title, keep the 1.000.000+ badge; moped animates along the yellow underline; remove bottom "kendi uygulamasında" CTA
- [ ] 10/10 review pass — critique the page with design skills (animations, web design guidelines), produce findings, close them
- [ ] Consolidate the two mobile CSS layers (920 → 767)
