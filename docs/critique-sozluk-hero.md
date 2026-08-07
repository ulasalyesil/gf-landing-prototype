# Critique: `/pnib/sozluk` hero

Created by Claude — INTERNAL

Method: dual-agent (Assessment A: design review · Assessment B: detector + browser evidence), run blind to each other, isolated browser tabs. Scope: **only** the sözlük page's hero header block (`.sozluk-hero` in `src/app/pnib/sozluk/page.tsx:47-53`, styles in `src/app/pnib/pnib.css:578-600`) — nothing else on the site was reviewed.

## Design Health Score

Scored for the hero block plus its handoff into search/rail. Several heuristics are legitimately n/a for a static header with no state, no errors, and no navigation to escape from.

| # | Heuristic | Score | Applies? | Key issue |
|---|---|---|---|---|
| 1 | Visibility of System Status | n/a | No | Hero reports nothing dynamic — that's `.sozluk__meta`'s job below it |
| 2 | Match System / Real World | 4/4 | Yes | Plain lowercase Turkish, real jargon named, no corporate-speak |
| 3 | User Control and Freedom | n/a | No | No lock-in/modal to escape in a static header |
| 4 | Consistency and Standards | 3/4 | Yes | Uses `--fs-*`/`--gf-ink*` tokens correctly, but 400-weight 48px reads quieter than the word "hero" implies |
| 5 | Error Prevention | n/a | No | No input exists at this point |
| 6 | Recognition Rather Than Recall | 3/4 | Yes | Naming real confusing terms lets a visitor recognize her problem instantly, but doesn't help her recognize what to do next (type vs. browse) |
| 7 | Flexibility and Efficiency of Use | 2/4 | Yes | No signal that search (which matches definitions too) is the favored path over the 29-button letter rail, despite code comments calling the rail a "fallback" |
| 8 | Aesthetic and Minimalist Design | 3/4 | Yes | Clean and restrained, but the narrow 58ch column against the full-width search bar below reads as two stacked layout decisions, not one composed block |
| 9 | Error Recovery | n/a | No | No error states possible in a header |
| 10 | Help and Documentation | 3/4 | Yes | "hiçbiri bir şey satmak için yazılmadı" functions as pre-emptive trust copy |
| **Total** | | **18/24 (75%)** | | 6 of 10 heuristics apply; 4 are legitimately n/a for a static pre-interaction header |

## Design Specificity Verdict

**Copy is specific, composition is not.**

"faiz mi, valör mü, kmh mı?" names three real, current pieces of Turkish banking jargon — checkable against the actual term set in `src/data/sozluk.ts`, not filler. "hiçbiri bir şey satmak için yazılmadı" pre-emptively defuses the exact suspicion a bank-adjacent glossary invites. That copy is audience-aware in a way a generic template wouldn't bother with.

The container around it isn't doing the same work. `.sozluk-hero__title` and `.sozluk-hero__lead` are both neutral gray (`--gf-ink` / `--gf-ink-700`) — no purple, no lilac, no PİB-specific visual device. The 2026-08-06 removal of the eyebrow and yellow highlight (documented at `page.tsx:36-45`) was a defensible, reasoned edit — the eyebrow duplicated the header wordmark, and the highlight is reserved for benefit statements per `AGENTS.md`'s own rule, which the live paranaiyibak.com reference doesn't use either. But "remove the wrong two devices" quietly became "add nothing back": stripped of the wordmark above and the lilac search card below, this markup is currently an unstyled H1 + gray paragraph that could be dropped onto any glossary or FAQ page on the internet unchanged.

**Deterministic scan**: `detect.mjs` returned zero findings for `page.tsx` and `PnibChrome.tsx`. Confirmed manually and independently by both assessments: no gradient text, no side-stripe borders, no uppercase eyebrow, no numbered markers, no glassmorphism, no bounce/elastic easing (`Reveal`'s spring is `bounce: 0`). The hero is clean of anti-patterns — its issue is absence of a specific device, not presence of a generic one.

## What's Working

1. **Copy specificity.** The lead paragraph is drawn from the real term set and speaks to an actual, checkable audience anxiety (is this an ad?) rather than a stock "financial terms explained" opener.
2. **A defensible prior edit.** The 2026-08-06 removal of the eyebrow and yellow highlight correctly diagnosed both devices as wrong for this spot, per the project's own written rules — not neglect.
3. **Clean technical foundation.** Real `<h1>`/`<header>` landmark, single `<h1>` on the page followed by sequential `<h2>`s with no skipped levels, contrast at 19.30:1 (title) and 10.70:1 (lead) — both pass AAA with room to spare. `prefers-reduced-motion` is correctly respected via `useReducedMotion()` in `Reveal.tsx`, independent of the `direction="none"` prop.

## Priority Issues

**[P1] Hero doesn't signal which path — search vs. letter rail — actually serves the visitor it's written for**
- **What**: `searchTerms()` (`src/data/sozluk.ts:152-161`) matches against definitions as well as headwords, so a visitor can type what she vaguely remembers and still find the right term. The 29-button letter rail requires the opposite — already knowing the spelling. The hero's own persona, someone confused by jargon, is by definition the worse fit for the rail, yet the rail sits at equal or greater visual weight than the search field directly beneath the hero. The codebase's own comments (`SozlukIndex.tsx:8-9`) call search primary and the rail a fallback, but nothing in the hero communicates that hierarchy.
- **Why it matters**: The least-experienced visitor is the one most likely to default to the alphabetical metaphor ("it's a dictionary, I browse A-Z") precisely because it's the more familiar affordance — even though it serves her worst.
- **Fix**: Either weight the search field visually heavier than the rail, or have the hero's closing line nudge toward typing (e.g. "aradığın kelimeyi yazman yeterli").

**[P2] Hero carries no PİB-specific visual device — brand identity by adjacency only**
- **What**: Both title and lead are neutral gray tokens with zero color, glyph, or device tying them to "parana iyi bak" specifically.
- **Why it matters**: As built, this exact markup is interchangeable with any glossary/help-center page; the stated rationale for removing the eyebrow/highlight doesn't extend to justifying zero replacement.
- **Fix**: One deliberate color moment — e.g. `--gf-purple` on one word in the lead or in "sözlüğü" — reintroduces specificity without resurrecting either retired device.

**[P2] Composition mismatch: narrow copy column vs. full-width interactive bar**
- **What**: `.sozluk-hero__lead` caps at `max-width: 58ch` (~500-550px) while `.sozluk-bar` immediately below spans the full 1200px container. Confirmed the gap between them is 0px at both desktop and mobile (`getBoundingClientRect`), so the mismatch is directly visible with no buffer to soften it.
- **Why it matters**: Reads as two independently laid-out modules stacked vertically, not one composed entry point — undercutting the funnel the hero exists to set up.
- **Fix**: Either widen the lead's effective measure to align its right edge with the bar's content, or add a balancing element on the hero's right side (e.g. the term count).

**[P3] Scope ("82 terim") is disclosed after the interaction, not before it**
- **What**: The term count lives in `.sozluk__meta`, rendered after the entire search+rail bar. The hero never states how many terms exist or what range they cover.
- **Why it matters**: An entry point should set expectations before asking for effort — a first-timer commits to the search UI without knowing if this is a 10-term or 80-term dictionary.
- **Fix**: Fold the scope cue into existing copy, e.g. "82 terimi faizden valöre kadar sade bir dille topladık" — no structural change needed.

**[P3] Flat typographic hierarchy risks the block reading as body copy, not a hero**
- **What**: Title (48px) and lead are both `font-weight: var(--fw-regular)`, per the measured PİB brand rule (400 at every heading size — this is intentional brand fidelity, not a bug).
- **Why it matters**: Combined with the colorlessness above, the compounding effect undersells the block's own job as a page-defining moment.
- **Fix**: Not a weight change (that rule is deliberate) — pairing it with the color fix above should restore some "this is the start of something" signal without touching weight.

## Persona Red Flags

**Jordan (confused first-timer, doesn't know financial jargon — literally who this page serves)**: The named terms in the lead let her recognize her own confusion within one sentence, and the trust clause removes her "is this a sales page" hesitation — the hero's strongest moment for her specifically. But she has no way to know that typing a vague description works better for her than the alphabet rail, and doesn't learn there are 82 terms until after she's already engaged with the search UI.

**Sam (accessibility-dependent, screen reader/keyboard)**: Real `<header>` landmark and genuine `<h1>` land cleanly for heading/landmark navigation. But nothing structurally connects the hero's promise ("we collected these words") to the search tool that fulfills it — a screen-reader user moving by heading jumps straight from the `<h1>` to the search form with no intermediate cue. Confirmed: single `<h1>` on the page, followed by sequential `<h2>`s (letter-group headings) with no skipped levels — the technical hierarchy itself is sound, this is a content-relationship gap, not a markup defect.

**Casey (distracted mobile user)**: At 375px, hero and the top of the search field are both visible without scrolling — she isn't asked to scroll blind first. But the full four-line lead sits between her and the tappable input; for a page whose own code treats search as primary, making her read a full sentence before she can tap anything works against that stated priority.

## Minor Observations

- `.sozluk-hero` padding-block is asymmetric (`clamp(40px,6vw,72px)` top / `clamp(28px,4vw,44px)` bottom) — a reasonable rhythm choice that tightens the gap to the search bar more than the gap to the chrome above, consistent with treating the search bar as the payoff. Measured gap between hero and bar is exactly 0px at both breakpoints (padding does all the work).
- The search input placeholder "örneğin: bileşik faiz" is a genuinely good example-driven affordance, worth keeping in mind if the hero copy gets revised, since it's immediately adjacent.
- A third-party dev-only feedback overlay (`agentation.com`) was visible in the local session — confirmed unrelated to GF source, not a finding against the design.

## Questions to Consider

1. What if the hero surfaced 2-3 tappable example terms (reusing the same `POPULAR_TERMS` already used in the empty-search state) instead of pure prose — turning "we collected these words" into an immediate first action?
2. What if "82 terim" moved into the hero copy itself, so scope is established before the search+rail UI appears rather than after it?
3. Given the code already treats search as primary and the rail as fallback, what if the hero's closing sentence did double duty as a UI hint nudging toward typing, so the visually competing rail doesn't win the "which do I try first" decision by default for the user least equipped to use it well?

---

*Note on process: run via the `ui-skills` critique protocol (`pbakaus/critique`) directly, not the local Impeccable plugin's full command flow — that flow requires a `PRODUCT.md` init step first, which this repo doesn't have yet. Snapshot persistence to `.impeccable/critique/` and trend tracking were skipped for the same reason; this file is a plain one-off write-up instead.*
