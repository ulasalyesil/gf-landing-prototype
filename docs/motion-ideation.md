# Landing Page — Micro-Interaction Review & Motion Ideation

Reviewed 2026-07-08 against the emil-design-eng / review-animations craft bar (skills pinned in `skills-lock.json`). Scope: all 13 landing sections. This doc feeds the **Motion integration** TODO item — every proposal assumes the Motion (motion.dev) port, not new GSAP.

Personality target: GF is playful-but-trustworthy fintech. Entrances can be warm; anything touching money (rates, calculator results) stays crisp and precise. Bounce only on decorative elements, never on numbers.

---

## Part 1 — Current-state findings

### What's already good

- Press feedback on `.btn` and `.hero__cta` (`scale(.97)`, 120ms, strong ease-out)
- Hover motion gated behind `(hover: hover) and (pointer: fine)` almost everywhere
- Hero text swap already uses the blur-crossfade trick (`--text-swap-blur: 2px`)
- Digit pop on rate updates with stagger + `tabular-nums` on `rate-leg__val`
- Success check draw on calculator (`t-success-check`, stroke-dash) — genuinely nice
- `prefers-reduced-motion` handled in the CSS primitives layer
- Strong custom easings tokenized (`--ease-out`, `--ease-out-strong`, `--ease-spring`)
- No `transition: all` anywhere

### Findings

| # | Where | Issue | Fix |
|---|---|---|---|
| 1 | All sections | Entrance system animates whole blocks (`sec-head`, `stats__card`, `calc__container` as single units). Skill bar: split into semantic chunks, stagger ~80–100ms | Motion port: variants + `staggerChildren` per section |
| 2 | `Rates.tsx:76`, `Features.tsx:56`, others | `".reveal"` selector unscoped inside `useGSAP` — the known "target not found" bug, and components can grab each other's nodes | Dies with the Motion port (`whileInView` per element) |
| 3 | GSAP reveals (all) | Only mobile bypass; no `prefers-reduced-motion` check in JS layer | `useReducedMotion()` in the shared reveal component |
| 4 | `Stats.tsx:52` + `sections.css:118` | `tabular-nums` bound to `.stat__num[data-count]` but `AnimatedNumber` never sets `data-count` → counting number reflows every frame | Apply `tabular-nums` on `.stat__num` directly (or set the attr) |
| 5 | `sections.css:264` | `.calc-res b` lacks `tabular-nums`; results change on every recalc | Add it |
| 6 | `rate-leg`, `calc__tab`, `calc-currency__btn`, `campaigns__dots button`, `rates__more`, `calc-rates-row`, `.feat` | Pressable elements with no `:active` scale | `transform: scale(.97)` + 120ms `--ease-out-strong`, same recipe as `.btn` |
| 7 | `CampaignsCarousel.tsx:126` | Position classes swap with no transition path between states (plus the hydration bug) | Motion `layout` animation on position change — fixes both |
| 8 | `Calculator.tsx:41` | Tab underline / currency pill slide via measured inline styles (offsetLeft/Width, breaks on resize/font-load) | Motion `layoutId` shared-layout indicator — spring, self-measuring |
| 9 | `Transfer.tsx:53` | Entrance timeline is keyframe-style; hover fan-out is interruptible only via GSAP `overwrite` | Springs retarget from current velocity for free in Motion |
| 10 | `campaigns__dots` | Dots are tiny (< 40×40 hit area) and give no hint of the 4s auto-advance | See Campaigns ideas below |

---

## Part 2 — Section-by-section ideation

Effort: ⚡ trivial · ⚙ moderate · 🔨 involved. Priority: ★ do it, ☆ if time allows.

### Global entrance system (the Motion port itself) ★🔨

One `<Reveal>` component replaces the seven duplicated GSAP blocks:

- `whileInView` + `viewport={{ once: true, margin: "-18%" }}` (matches current `top 82%`)
- Container variants with `staggerChildren: 0.08` — head → lead → body chunks, not whole blocks
- Transition: `{ type: "spring", duration: 0.6, bounce: 0 }`, `y: 24 → 0`, opacity
- Directional variants (`x: ±40`) replace `.reveal-left/right`
- `useReducedMotion()` → opacity-only; keep the ≤767px reduced-motion split, resize-aware
- Keep writing `is-in` on completion — the `hl`/`mark` underline draw and moped hang off it

Sequencing rule to keep everywhere: **container settles → text staggers in → highlight underline draws last.** The underline draw is the signature; never let it fight the entrance.

### Header / mega menu

- ★⚙ **Nav hover indicator** — a soft pill that slides between nav items (`layoutId`), instead of each item's independent background fade. Makes the nav feel like one object.
- ★⚙ **Panel content crossfade** — switching nav items while the mega is open should swap content in place (small x-shift + blur crossfade, 150ms), not feel like a reopen. Pairs with the mega-menu subtext TODO.
- ⚡ **Chevron/caret rotation** on the open item, spring, 180°.

### Hero

- ★⚙ **First-load sequence** (the page's only load animation — rare, so delight is allowed): badge → title → sub → CTA, stagger 90ms, `y: 16 → 0` + opacity, ease-out. Video overlay fades from slightly darker to final. `initial={false}` everywhere else; only the hero animates on load.
- ★⚡ **Pause offer flip on hover** over the text block — respects reading; resume on leave. (Backlog GFDES-2135 makes title+sub flip through 4 pairs; pausing becomes more important, not less.)
- ⚡ **CTA arrow nudge** — arrow icon `translateX(3px)` on hover, spring; already scales on press.
- ☆⚙ Badge count-style tick: when the badge text swaps, keep the icon static and swap only the text (already structured that way — port swap to `AnimatePresence` with `mode="popLayout"`, keep the blur values).

### Stats

- ★⚡ Fix finding #4 (`tabular-nums`).
- ★⚙ **Stagger the three stat cells** 100ms apart instead of revealing the card as one block; each cell: number first, label follows 60ms later.
- ★⚙ **Sequence the count-up**: card settles → 1.000.000+ counts (keep 1.8s, it's a hero number) → `hl` underline draws when the count lands. Currently underline and count race each other.
- ☆⚙ Odometer-style digit roll for the final settle (last 3 digits roll into place) — reuse the `t-digit` recipe from rates instead of building new.

### Rates

- ★⚙ **Direction-aware digit motion**: on update, digits pop *upward* when the rate went up, *downward* when down (`--digit-dir-y` already exists as a hook). Ticker semantics for free.
- ★⚡ **Leg flash tint by direction** — the flash should tint green/red to match `dir`, not a neutral flash. Money-adjacent: keep it under 400ms, no bounce.
- ⚙ **Trend chip morph** — when direction flips, rotate the arrow 180° with a spring instead of swapping the icon; color crossfades.
- ⚡ Press scale on `rate-leg` buttons (finding #6) — they're the al/sat forward actions per GFDES-2135, they must feel pressable.
- ⚡ "son güncelleme saati" — quick opacity dip-and-restore on the `<b>` when time updates, so the timestamp visibly ticks.
- Entrance: keep card stagger (60ms) and `scale(0.98)` start; port as-is.

### Features grid

- Existing hover (image zoom + arrow nudge) is right. Add:
- ⚡ **Card lift** — `y: -4` + shadow on hover, matching `rate-card`'s recipe, so hover language is consistent across the page's card types.
- ⚡ Arrow: crossfade thin → filled circle on hover (opacity swap of two states, 150ms) — reads as "armed".
- Entrance: keep 60ms grid stagger. Nothing more; four cards animating harder would be noise.

### Campaigns carousel

- ★⚙ **Dots → progress pills**: active dot stretches into a pill that fills over the 4s interval (scaleX, linear); hover pauses the fill visibly. Communicates auto-advance, fixes the affordance gap and gives a pause state for free. Extend hit areas to 40×40 (pseudo-element).
- ★🔨 **Layout-animated shuffle**: cards glide between left/center/right positions with springs (`layout` prop) instead of teleporting via class swap. Kills the hydration bug (`camp-pos-*` computed in render, not effect) in the same pass.
- ☆⚙ **Desktop drag**: Motion `drag="x"` with snap-to-position springs; velocity carries. The mobile scroll-snap behavior stays native.
- ⚡ Arrow-circle on card body: same hover nudge as features, consistency.

### Loan (clip-path reveal)

- ★🔨 Port the inset clip to Motion scroll APIs (`useScroll` + `useTransform`) — this is the section's signature, keep the mechanics exactly; only the copy entrance changes:
- ★⚡ **Stagger the copy** once past the 0.55 threshold: kicker → title → desc → button, 70ms apart, instead of the whole `loan__copy` sliding as one block.
- ☆⚡ "hesapla" → smooth-scroll to calc, then a one-time border pulse on `calc__container` on arrival (single pulse, 600ms, then done — an attention beacon, not a loop).

### Faiz

- ⚡ **Icon pop in the stagger**: each `fpoint__ic` scales 0.25 → 1 with 4px blur → 0 (the icon recipe from the skill), 60ms after its text lands. Spring, bounce 0.
- ☆⚙ **Phone image parallax** — scroll-linked ±16px y drift on the large media (`useScroll` on the section). Decorative, gate behind desktop + reduced-motion.

### Calculator

- ★⚙ **`layoutId` indicators** (finding #8): tab underline and currency pill become shared-layout elements with `{ type: "spring", duration: 0.4, bounce: 0.15 }` — slight bounce is fine here, it's a control, not a number.
- ★⚙ **Results count to new values**: on hesapla, each `calc-res b` tweens old → new (300ms, ease-out, `tabular-nums` per finding #5) instead of snapping. The check-draw already covers the button; the results deserve the same care since they're the answer.
- ⚡ **Label swap with blur**: "hesapla" → "hesaplandı" via the text-swap primitive (blur crossfade) instead of a hard swap.
- ⚡ Focus ring: `calc-field:focus-within` gets a soft shadow ring transition, not just border color (150ms).
- ⚡ Press scale on tabs + currency buttons (finding #6).

### Debit card

- ★⚙ **Moped rides the underline draw** (this is the GFDES-2135 note): sequence = copy reveals → `mark` underline draws left-to-right (0.8s, existing ease) → moped translates along `--travel` *synced to the draw*, tiny y-bob (2px sine) while moving, settles at the end. One-time, rare, high-delight, on-brand (courier delivers the card). The `--travel` measurement via ResizeObserver already exists — wire it to the same timeline.
- ⚡ **List item stagger**: two `debit__list` items enter 80ms apart with the icon-pop recipe.
- Float loop on the media (2.6s sine) is good; port verbatim (`animate` + `repeat: Infinity, repeatType: "mirror"`).

### Transfer

- ★⚙ **Springs on the fan-out**: phone rises, cards fan with `{ type: "spring", duration: 0.7, bounce: 0.2 }` — the one place a visible bounce fits (cards landing). Hover spread and entrance become interruptible by construction (finding #9).
- ☆⚙ **Mouse-tracking tilt on the phone**: `useSpring`-smoothed 2–3° rotate following cursor within the stage. Decorative, spring-damped, desktop-only, reduced-motion-gated.
- ⚡ **Rings idle pulse**: `transfer__rings` scale 1 → 1.03 opacity pulse, very slow (6s), linear-ish. Ambient, below attention threshold.

### App dark ("ışıkları kapattık!")

- ★⚙ **Lights-off moment** — strongest concept-motion match on the page and currently it just fades in like everything else. As the section crosses viewport center (scroll-linked, one-time): background image opacity/brightness sweeps from lifted to full dark, copy reveals *after* the dim lands, `mark` underline draws last like a light strip. Reduced-motion: simple fade.

### AI assistant

- Lottie play-once at 80% is right. Add:
- ⚡ **Replay on click** on the stage (rare, user-initiated, cheap).
- ☆⚡ Heading enters with a 40ms/word stagger — "typing" flavor without a cursor gimmick. Only if it doesn't fight the underline draw.

### Footer

- ⚡ Link hover: underline slide-in (scaleX from left, 150ms) on `footer__col a` instead of color-only.
- Nothing else. Footers don't perform.

---

## Part 3 — Suggested build order

1. **`<Reveal>` + Motion port of all section entrances** — unblocks everything, kills findings #1–3, closes the two TODO bugs (Rates scoping, and campaigns hydration lands with #2 below)
2. **Campaigns**: layout shuffle + progress dots (bug fix + best UX win)
3. **Calculator**: layoutId indicators + results count-up (most-touched interactive surface)
4. **Hero load sequence + flip pause**
5. **Press-state sweep** (finding #6 — one CSS pass, all pressables)
6. **Rates direction-aware ticker**
7. **Debit moped + dark-mode lights-off** (delight pass, do after fundamentals)
8. Remaining ☆ items opportunistically

After each motion PR: run the pinned `review-animations` skill per repo convention.
