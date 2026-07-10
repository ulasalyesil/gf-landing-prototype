# DialKit — application plan

`dialkit@1.3` (Josh Puckett) is installed and `<DialRoot position="bottom-right" defaultOpen={false} />`
is mounted in `src/app/layout.tsx`. It renders **only in dev builds** — production
(Vercel) never sees it, so it can stay mounted permanently.

## What it's for here

DialKit panels are **tunable design decisions, not permanent code**. The workflow:

1. wrap the values you're unsure about in `useDialKit(...)`
2. tune live in the browser (spring editor, sliders, color pickers, presets)
3. **Copy** (toolbar) exports the settled values as JSON
4. bake them into CSS/tokens/`content.ts`/Motion configs and delete the hook

A panel that survives a PR is a smell — values graduate to code, dials get removed.
Exception: lab pages (like the hero variant lab) may keep dials while the lab lives.

## Where to apply it (ordered by roadmap)

### 1. ~~Hero lab `/hesap-karti`~~ — done differently

C ("kart xl") won and the lab was deleted before a geometry-dial pass happened;
the hand-tuned C geometry is baked into `debit-current.css` (card 900px /
right -140 / top -30). If the hero geometry needs a retune, wrap those values
in a `useDialKit` panel ad hoc.

### 2. Micro-interactions pass (GFDES-2174 next phase) — the main event

The killer feature is the **spring control** — its return value passes straight
into Motion's `transition`:

- Create `src/dials/useMotionDials.ts` (shared panel, `id: "gf-motion"`, `persist: true`):
  - `reveal: { type: "spring", visualDuration: 0.6, bounce: 0 }` — currently hardcoded as `REVEAL_SPRING` in `Reveal.tsx`
  - `stagger: [0.08, 0.02, 0.2, 0.01]`
  - `hlDraw: [0.8, 0.2, 1.5, 0.05]` — underline draw duration (feeds a CSS var)
- During the pass, `Reveal` reads from the dial hook in dev; presets let us A/B
  a "crisp" vs "soft" motion personality across the whole page at once.
- Per-component panels as needed: CTA press scale, card hover lift, steps
  numeral entrance, badge pop.
- **Bake target:** a small `src/motion.ts` (or token additions) holding the final
  spring constants; `Reveal.tsx` imports from there; dials deleted.

### 3. Landing motion debt

When the `Loan` clip-path scroll-scrub gets ported GSAP → Motion (TODO), tune
scrub ranges/offsets with sliders instead of reload-guessing.

### 4. Optional: brand token sandbox

A `Tokens` panel (color controls for `--gf-purple`, highlight bar
height/offset) that writes CSS vars onto `:root` — useful for quick
"what if the bar were 12px" conversations. Build only if it earns its keep.

## Conventions

- Shared dial hooks live in `src/dials/`, one file per panel, named `use<Thing>Dials`.
- Panel names: section-level ("Hero C", "Steps", "Motion") — no per-div panels.
- Never pass `productionEnabled` to `DialRoot`.
- `persist: true` + `id` only for panels shared across pages/remounts (motion).
- Keyboard shortcuts sparingly; reserve `s` (spring-ish drags) and `m` per README examples.
