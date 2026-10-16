/* Created by Claude · INTERNAL */
"use client";

import { stagger } from "motion/react";
import type { AnimationSequence } from "motion/react";
import { useStory } from "@/components/useStory";
import { CREDIT_BENEFITS } from "@/data/content";
import SealArt from "./SealArt";

/* Bento tile illustrations for /kredi-karti (Figma 22630:15619; the ₺0
   tile is Web comp 266:4725, 2026-10-16 — the ₺350 tile is gone). Rebuilt from
   the comp's layers rather than flattened, so each piece can animate.
   Geometry is comp px through `--u` (see `.dpc-tile__visual`, product-page.css);
   every visual is decorative — BenefitTile hides it from assistive tech.

   Motion pass (2026-09-25): each tile acts out its benefit once when it comes
   into view and again on hover (useStory). The rest frame is the comp.
   - maximum: the card taps down → the chain draws → the pill lands → +1, +2,
     +3 taksit stack up, each + turning as it lands.
   - ₺0 (Web comp, 2026-10-16): the field of white cards slides in run by
     run, the seal stamps onto it (the field flinches, a ring ripples out);
     then the star turns and the field drifts down its runs, slowly. */

const A = "/assets/img/kredi-karti";
const EASE = [0.16, 1, 0.3, 1] as const;
const POP = { type: "spring", duration: 0.5, bounce: 0.4 } as const;
/* dotted connectors are drawn by un-clipping them along their length */
const DRAW = { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] };

/** Hand holding the card → maximum pill → +1/+2/+3 taksit rows. */
export function MaximumVisual() {
  const { rows } = CREDIT_BENEFITS.maximum;
  const scope = useStory([
    [".ckp-max__hand", { y: [-22, 0], opacity: [0, 1] }, { type: "spring", duration: 0.7, bounce: 0.18 }],
    [".ckp-max__dots--a", DRAW, { duration: 0.22, ease: "linear", at: "-0.25" }],
    [".ckp-max__logo", { scale: [0.8, 1], opacity: [0, 1] }, POP],
    [".ckp-max__dots--b", DRAW, { duration: 0.22, ease: "linear", at: "-0.3" }],
    [".ckp-max__rows li", { y: [-16, 0], scale: [0.94, 1], opacity: [0, 1] }, { type: "spring", duration: 0.55, bounce: 0.25, delay: stagger(0.1) }],
    [".ckp-max__rows img", { rotate: [-180, 0] }, { duration: 0.6, ease: EASE, delay: stagger(0.05), at: "<" }],
  ]);
  return (
    <div className="ckp-max" ref={scope}>
      {/* the art is drawn upright and turned −90° in the comp */}
      <div className="ckp-max__hand">
        <div className="ckp-max__hand-rot">
          <img loading="lazy" src={`${A}/benefit-hand.webp`} alt="" width={900} height={1200} />
        </div>
      </div>
      <div className="ckp-max__chain">
        <img loading="lazy" className="ckp-max__dots ckp-max__dots--a" src={`${A}/connector-v.svg`} alt="" width={13} height={1} />
        <img loading="lazy" className="ckp-max__logo" src={`${A}/maximum-pill.svg`} alt="" width={212} height={66.9474} />
        <img loading="lazy" className="ckp-max__dots ckp-max__dots--b" src={`${A}/connector-v.svg`} alt="" width={13} height={1} />
        <ul className="ckp-max__rows">
          {rows.map((r) => (
            <li key={r}>
              <img loading="lazy" src={`${A}/plus-green.svg`} alt="" width={7.79716} height={8} />
              <span>{r}</span>
              <img loading="lazy" src={`${A}/plus-green.svg`} alt="" width={7.79716} height={8} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* the card field behind the ₺0 seal: five diagonal runs of white cards
   (comp column counts; the middle run is tighter and skips its third card) */
const FIELD = [5, 6, 5, 6, 5];

/** ₺0 seal stamped onto a field of white cards (Web comp 267:14480). */
export function AidatVisual() {
  const seq: AnimationSequence = [
    // the field slides in along its diagonal, run by run
    [".ckp-aidat__run", { y: [60, 0], opacity: [0, 1] }, { duration: 0.9, ease: EASE, delay: stagger(0.06) }],
    // the stamp: comes down big and tilted, lands hard
    [".ckp-aidat__seal", { scale: [1.6, 1], rotate: [-24, 0], opacity: [0, 1] }, { type: "spring", duration: 0.42, bounce: 0.28, at: 0.45 }],
    [".ckp-aidat__ripple", { scale: [0.7, 1.55], opacity: [0, 0.55, 0] }, { duration: 0.7, ease: "easeOut", at: 0.55 }],
    // the cards under it flinch from the impact
    [".ckp-aidat__field", { scale: [1, 0.97, 1] }, { duration: 0.4, ease: EASE, at: 0.55 }],
  ];
  const scope = useStory(seq, {
    loops: [
      [".seal-star", { rotate: [0, 360] }, { duration: 48, ease: "linear", repeat: Infinity }],
      // the field keeps drifting down its runs, one card pitch a minute-ish
      [".ckp-aidat__drift", { "--dy": [0, 1] }, { duration: 40, ease: "linear", repeat: Infinity }],
    ],
  });
  return (
    <div className="ckp-aidat" ref={scope}>
      <div className="ckp-aidat__field">
        <div className="ckp-aidat__rot">
          <div className="ckp-aidat__drift">
            {FIELD.map((n, c) => (
              <div key={c} className={c === 2 ? "ckp-aidat__run ckp-aidat__run--tight" : "ckp-aidat__run"}>
                {/* one extra card above and below so the drift never shows an end */}
                {Array.from({ length: n + 2 }, (_, i) => (
                  <img key={i} loading="lazy" src={`${A}/card-white-tilt.png`} alt="" width={270} height={416} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="ckp-aidat__stamp">
        <i className="ckp-aidat__ripple" />
        <SealArt className="ckp-aidat__seal" />
      </span>
    </div>
  );
}
