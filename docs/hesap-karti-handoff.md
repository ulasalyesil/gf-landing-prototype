<!-- Created by Claude · INTERNAL -->
# /hesap-karti + /kredi-karti — handoff

Rewritten 2026-09-23 for the **card pages v2** build (Figma section `v2`, 22630:19402 —
credit frame 22630:12072, debit 22630:16190). The previous version of this file described
the 2026-08 debit page (video hero, pinned lilac steps band, dark sanal section, abroad
collage with a card-handoff flight, 7/24 + ATM caps). All of that was replaced in place;
it is in git history before the `gfdes-2174-2243-card-pages-v2` branch.

The two card pages are one family now: they share the sub-nav, hero, section head, bento
tile, carousel controls, FAQ carousel and footer variant. Read the comments in the files —
they carry the measurements and the reasons. This file is for what comments cannot carry:
the shape, what is deliberately unfinished, and the constraints that break from elsewhere.

---

## 1. Anatomy

| # | /kredi-karti | /hesap-karti |
|---|---|---|
| 0 | `ProductSubnav` | `ProductSubnav` |
| 1 | `ProductHero` (centred, photo) | `ProductHero` (centred, photo) |
| 2 | bento — `visuals.tsx` (maximum, ₺350, ₺0) + photo | bento — `visuals.tsx` (getirpara phone, abonelik phone) + photo |
| 3 | `TaksitTabs` — category tabs, 5s rotation | `Delivery` — **scroll-scrubbed** steps + tracking card |
| 4 | `CampaignSlider` — 6s rotation | `Sanal` — frosted cards over the hand-held card |
| 5 | `BrandTabs` — merchant tabs, click-only | abroad bento — %1 tile, city photos, card, FX tile |
| 6 | `FaqCarousel` (compact) | `FaqCarousel` (wide) |
| 7 | `Footer variant="inner"` | `Footer variant="inner"` |

Each route is a server `page.tsx` (owns `metadata`) wrapping a client `CreditPage.tsx` /
`DebitPage.tsx`. Copy lives in `src/data/content.ts` (`CREDIT_*`, `DEBIT_*`, `PRODUCT_SUBNAV`).

### Styles

```
globals.css:  tailwind → tokens → base → sections → mobile
page:         product-page.css → credit.css | debit.css
```

Both orders are load-bearing. `product-page.css` is shared; the page file overrides it.
`dpc-` reads as "product detail page", `ckp-` is credit-only, `dbc-` debit page hooks.

### The scale unit

Bento and stage illustrations are fixed-px compositions in the comp. They are written as
`calc(N * var(--u))`, where `--u = min(100cqi / var(--tile-w), 1px)` is one comp pixel at
the tile's current width, capped at 1. See §3.1.

### The delivery modes

`useStepsMode()` in `Delivery.tsx`:

| Width | Mode | Behaviour |
|---|---|---|
| ≥921px | `scrub` | stage pins, scroll drives steps + tracking card |
| 768–920px | `timed` | no pin; one 6s in-view run; a click takes over |
| ≤767px | `off` | click accordion; the card follows the open step |
| any + reduced motion | `off` | |

921 matches the header's menu breakpoint, so the JS query and the CSS agree.

---

## 2. Deliberately unfinished

Do not fix these as bugs; they wait on people. The full design-issue list is the
2026-09-23 entry in `TODO.md`.

| What | Where | Waiting on |
|---|---|---|
| Copy marked `⚠ COMP` | `content.ts` | **Design/brand.** Built verbatim from the comps, including copy that is plainly placeholder or copied from the other card |
| Every CTA href | grep `CTA_TODO` | **You.** Physical card, virtual card and credit card are three destinations |
| Sub-nav targets | `PRODUCT_SUBNAV` | Pages that don't exist yet |
| Legal strings | grep `CARD_DELIVERY_LEGAL` | **Legal.** Only the delivery-speed claim is qualified; ücretsiz, %1/%3/%20, ₺350, ₺1.250 are not |
| Debit metadata | `hesap-karti/page.tsx` | The live page's own values |
| Campaign slides 2–4 | `CREDIT_CAMPAIGNS` | Real campaigns (they repeat slide 1) |
| Credit hero photo | `img/kredi-karti/hero.webp` | **Design.** 1024×480 for a 1298×607 slot |

---

## 3. Tripwires

**1 · `cqi` is the container's CONTENT box.** `.dpc-tile` is the size container and
`--tile-w` defaults to 472.67 (the comp tile minus its 1px borders). A tile with its own
horizontal padding (`.ckp-tile-aidat`, `.dbc-tile-fx`) must restate `--tile-w` for that
padding, or its art shrinks by the ratio. Same device on `.dpc-dl__visual` (615) and
`.dpc-sanal__stage` (1440 / 937 below 920).

**2 · No overflow on `.dpc-dl`.** The delivery pin is `position: sticky`; an ancestor with
`overflow` other than visible kills it silently.

**3 · The scrub's track height has three terms.** `pin-top + pin height + scrub`. The
pin engages `--dpc-pin-top` px before progress 0; dropping that term releases the pin
early with the sequence unfinished. `SCRUB_PX` is the single source for the CSS var and
the `useScroll` offset.

**4 · `-webkit-backdrop-filter` must precede `backdrop-filter`.** The minifier drops the
standard property when the prefixed one follows it (sanal cards, delivery glass).

**5 · Motion needs an explicit `initial` for any animated property.** Without one it can
write the literal string `undefined` into the attribute. It has bitten this codebase three
times.

**6 · The two bento phones follow the comp's render, not its layer data.** The getirpara
phone fades toward the top and the abonelik frame toward the bottom via CSS masks. The
exported layers say otherwise (the group is flipped in Figma). Re-exporting will not fix it.

**7 · Hero title icons.** Titles are `string[][]` in content; a `"@key"` segment is an
icon the page supplies. Segments join with real spaces, which are also the visual gap.
Heights and lifts are per-icon `--icon-h` / `--icon-y` in em, so they scale with the title.

**8 · Dev tooling stays behind the lazy import** (`src/dials/DevTools.tsx`). Before
shipping: `next build`, then grep the chunks for `DialRoot|useDialKit|Agentation`. Zero
hits is the pass condition.

---

## 4. Verified state (2026-09-23)

`tsc` clean; 0 lint errors in the new code; `next build` passes with both routes static;
0 dev-tooling hits in chunks. Real headless Chrome (repo `scratchpad/` harness,
gitignored) at 1728 → 320: no horizontal overflow, no broken images, 0 console errors;
tabs, FAQ disclosures and the delivery accordion keyboard-operable; modes flip correctly
on live resize.

Not covered: Firefox (no `text-box` trim there — the delivery step gaps open slightly),
Safari by hand, screen readers, 200% zoom.

**Known and not from this work:** `Reveal` hydrates with an attribute mismatch under
`prefers-reduced-motion` on every page; the landing's `.loan__snap` briefly overflows at
load.

Project-wide conventions live in `AGENTS.md`; the live task list is `TODO.md`.
