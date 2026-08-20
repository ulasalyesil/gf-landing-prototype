# /hesap-karti — handoff

Written 2026-08-20 for the frontend developer taking this page into the production
codebase.

**This is deliberately short.** The page is ~43% comments (59% in the stylesheet) and
those comments are the real documentation — they record what was measured, what was
rejected, and why. Read them; they are better than anything this file could restate.

What comments *cannot* carry, and what this file is for:

1. the shape of the page before you have opened eight files
2. what is deliberately unfinished, so you do not "fix" it
3. the constraints that span files and will break silently from somewhere else

Line numbers drift — each reference below also gives a string you can grep.

---

## 1. Anatomy

Six sections, top to bottom. `page.tsx` composes them; each owns its own file.

| # | Section | File | Notes |
|---|---|---|---|
| 1 | Hero | `Hero.tsx` (137) | copy column is the shared `components/ProductHero`; only the media is this page's |
| 2 | Earn | in `page.tsx` | three benefit tiles, no component of its own |
| 3 | Delivery | `DeliverySteps.tsx` (587) | the scroll-driven sequence — the page's biggest bet |
| 4 | Sanal kart | `SanalCard.tsx` (87) | dark full-bleed section, a distinct product |
| 5 | Abroad | `AbroadCollage.tsx` (195) | photo collage; the card slot is a handoff landing pad |
| 6 | Capabilities | in `page.tsx` | transfers / ATM, with two inline SVG illustrations |

Plus `CardHandoff.tsx` (309) — a fixed overlay that flies the card from §4 to §5. It is
a sibling of the sections, not inside either.

`Tilt.tsx` (53) is the shared pointer-tilt hook used by the sanal card and every
collage photo.

### Styles

```
globals.css:  tailwind → tokens → base → sections → mobile
page.tsx:     product-page.css → debit-current.css
```

Both orders are load-bearing. `mobile.css` (≤767) is the authoritative mobile layer and
loads last; `product-page.css` must load *before* `debit-current.css` so the page can
override the shared chrome.

⚠ The `dpc-` prefix reads as **"product detail page"**, not "debit page current". It is
shared with `/kredi-karti`. Anything in `product-page.css` is shared; anything in
`debit-current.css` is this page's.

### The three responsive modes

One decision drives most of the page's behaviour. `useStepsMode()` in
`DeliverySteps.tsx` returns:

| Width | Mode | Behaviour |
|---|---|---|
| ≥921px | `scrub` | pinned sticky sequence, scroll-linked; card handoff active |
| 768–920px | `timed` | no pin, one 5s in-view run of the same driver; phone sits in flow |
| ≤767px | `off` | settled end state; steps become a horizontal swipe deck |
| any + reduced motion | `off` | handoff never mounts |

**`AbroadCollage` and `CardHandoff` both import `useStepsMode` and gate on it.** All
three must agree, or the handoff can activate in a mode the sequence is not running in.
If you change the boundary, change it in one place.

921 is not arbitrary — it is where the header's own menu breakpoint sits, so the JS
media query and the CSS agree.

---

## 2. Deliberately unfinished

Do not treat these as bugs to fix. They are waiting on people.

| What | Where | Waiting on |
|---|---|---|
| Four disclaimer strings | `content.ts` — grep `DEBIT_DELIVERY_LEGAL` | **Legal.** The rendering slot exists and works; the delivery claim is already wired. Still unqualified: `ücretsiz` ×4, the %1/%3/%20 rates, and the ₺1.250 ceiling |
| Is ₺1.250 per-mechanic or combined? | same block | **Product.** `/kredi-karti` currently answers this differently — it is a real conflict, not a wording nit |
| Step descriptions | `content.ts:227` — grep `desc lines are DRAFT` | **Brand team** |
| Sanal heading | `content.ts:245` — grep `needs owner review` | **Brand team** |
| Earn subhead names 2 of 3 tiles | `content.ts:183` | **Brand team.** Omits the %20 abonelik tile, the strongest of the three |
| `"sanal kart oluştur"` | `content.ts:250` | **Owner sign-off.** Changed 2026-08-20 from `"kart al"`; kept on the owner's call |
| Every CTA href | grep `DEBIT_CTA_TODO` | **You.** Three CTAs, three real destinations. The hero and delivery share a product; the sanal one does **not** |
| `debit-earn-phone.png` | `public/assets/img/` | **Design.** Only asset still under-resolution (0.54×). Needs 1280×754 with transparent padding on all four sides |
| `placeholder-globe.svg` | `content.ts:267` | **Design.** Ships in the sanal feature row on the owner's explicit call; the filename still says placeholder |

### The one live variant

**`?hero=field`** renders the hero as a contained dark panel instead of the white field,
and swaps the video master (the white hero's multiply knockout would erase the card
against dark). Kept pending the credit-card hero work — see the comment block at the top
of `page.tsx` for its delete path.

**Nothing else on this page is a variant.** `?earn=bento` and `?steps=compact` were
deleted 2026-08-20. If you see a query param anywhere else, it is not scaffolding.

---

## 3. Tripwires

Each is commented where it lives. You will break them from somewhere else.

**1 · `frame.png`'s alpha bounds feed CSS constants.**
`debit-current.css:427` (grep `--dpc-frame-bezel-top`) and `:537` (grep `left: 20.33%`).
The phone's vertical position and the screen hole's position are both derived from where
the opaque bezel sits in the PNG's alpha channel. Re-crop or re-pad that asset and the
phone sits wrong and the screens stop registering in the hole. Re-derive all six numbers
from the new alpha bounds, measured at alpha > 250 so the drop shadow is excluded.

**2 · `virtual-card.png` and `debit-card.png` are one canvas.**
`AbroadCollage.tsx:39`, `CardHandoff.tsx:94`. Both 648×984. The sanal→abroad handoff
crossfades between them and the swap is invisible *only* because they match. Re-export
both together or neither.

**3 · `--dpc-panel-pad` is the page's content edge.**
`product-page.css:34`. The earn copy and the delivery band both read from it so their
left edges line up. Hardcoding a matching number somewhere else is how they drift — and
they already did: the capabilities section still sits 32px off it above 1360px (see §4).

**4 · The copy column and the phone share one width budget.**
`debit-current.css:617` (grep `--dpc-steps-copy-w`). The phone subtracts this from the
stage to size itself. They used to be two independent numbers and collided — 174px of
every progress bar was painted over at 880px. Change the cap, not the phone.

**5 · `-webkit-backdrop-filter` must precede `backdrop-filter`.**
`debit-current.css:825`. The minifier drops the standard property when the prefixed one
follows it. Already caught once.

**6 · The sanal title's padding matches the highlight's offset.**
`debit-current.css:753`. The yellow mark is pushed to `bottom: -0.36em` to clear
"güvenle"'s descender, so it hangs below the title's box; the title reserves exactly that
much padding so the flex `gap` measures from the *bar*. Keep both in `em` and keep them
equal, or the gap silently collapses again (it was 3.6px before this fix).

**7 · Motion needs an explicit `initial` for any animated property.**
Without a baseline it writes the literal string `undefined` into the attribute. This has
bitten the codebase three times — most recently two console errors on every page load
from the hamburger icon. If you animate a new property, give it an `initial`.

**8 · Dev tooling must stay behind the lazy import.**
`src/dials/DevTools.tsx`. A `NODE_ENV` check gates the *render*, not the *bundle* — a
static import ships the library regardless. That was 443KB of dialkit + agentation on
this page. A React hook cannot be lazily loaded at all, which is why the dial hooks were
deleted rather than deferred. Before shipping: `next build`, then grep the emitted chunks
for `DialRoot|useDialKit|Agentation`. Zero hits is the pass condition.

---

## 4. Known-open design findings

Reviewed 2026-08-20. These are **known and not yet fixed** — not your bugs, and not
regressions you introduced.

- **Capabilities section is 32px off the page's content edge above 1360px.** `.dpc-cap`
  hardcodes `padding: 32px` while everything else uses `--dpc-panel-pad` (64px there).
  Measured ink edges at 1440: earn/steps 128, caps 96. Aligned at 1280 and below.
  `.dpc-cap` also has no background, so that inset reads as misalignment rather than card
  padding — worth deciding whether those are cards at all.
- **Hero title and sub are optically touching.** 7px of ink clearance at 1440, which is
  *tighter* than the 9px of leading inside the sub itself, so the grouping inverts. The
  constants in `product-page.css` were measured from the baseline and the title's last
  line ends in a descender ("muhteşem"). Turkish is descender-rich; this will recur.
- **Two headings run words together in their accessible name.** `<br>` contributes no
  space, so the `h1` announces as "geri dönüşümuhteşem kart". Same for the abroad
  heading. One-character fix — the codebase already solves this in `DeliverySteps.tsx`.
- **The ghost step numerals fail large-text contrast** at 2.35:1 against the lilac band
  (needs 3:1). The only contrast failure on the page.
- **The abonelik tile's art shows generic cashback, not subscriptions** — the third-party
  marks were refused by legal, so the benefit now lives entirely in the copy.
- **The earn title's highlight bar overhangs its text by 57px each side at 320px.** The
  abroad title has a guard for this; the earn title does not.

---

## 5. Verified state

At handoff: build passes, `/hesap-karti` prerenders static, 0 console errors in dev and
production across 320/390/880/1024/1280/1440, 0 lint errors in the route (the 8 that
remain repo-wide are pre-existing landing-component issues). Page media 3.96 MB,
first-load JS 1250 KB. Safari checked by hand, no issues.

Not covered: Firefox, Windows, screen readers, 200% zoom.

The full review — every measurement, the Safari regression checklist, and the findings
that were considered and rejected — is at:
<https://claude.ai/code/artifact/0a90d454-4600-4d99-967e-8c465cd16cff>

Project-wide conventions live in `AGENTS.md`; the live task list is `TODO.md`.
