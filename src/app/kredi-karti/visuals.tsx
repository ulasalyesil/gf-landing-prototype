/* Created by Claude · INTERNAL */
"use client";

import { stagger } from "motion/react";
import type { AnimationSequence } from "motion/react";
import { useStory } from "@/components/useStory";
import { CREDIT_BENEFITS } from "@/data/content";
import SealArt from "./SealArt";

/* Bento tile illustrations for /kredi-karti (Figma 22630:15619). Rebuilt from
   the comp's layers rather than flattened, so each piece can animate.
   Geometry is comp px through `--u` (see `.dpc-tile__visual`, product-page.css);
   every visual is decorative — BenefitTile hides it from assistive tech.

   Motion pass (2026-09-25): each tile acts out its benefit once when it comes
   into view and again on hover (useStory). The rest frame is the comp.
   - maximum: the card taps down → the chain draws → the pill lands → +1, +2,
     +3 taksit stack up, each + turning as it lands.
   - ₺350: a statement row arrives → the brackets draw down from it → the
     reward coin pops out between them → sparkles; then they twinkle.
   - ₺0: the seal stamps onto the tile (the app icon flinches, a ring ripples
     out); then its scalloped star turns, slowly, forever-ish. */

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

/* statement bracket — inlined so it can draw (was bracket-left/right.svg;
   the right one is the same stroke with a 1px shorter top, mirrored in CSS) */
function Bracket({ side }: { side: "l" | "r" }) {
  return (
    <svg className={`ckp-txn__bracket ckp-txn__bracket--${side}`} viewBox="0 0 120.5 109" width="120.5" height="109" fill="none">
      <path
        className="ckp-txn__stroke"
        d={`M${side === "l" ? "17.64" : "16.5"} 0.5H8.5C4.08 0.5 0.5 4.08 0.5 8.5V100.5C0.5 104.92 4.08 108.5 8.5 108.5H120.5`}
        stroke="#EBEBEB"
      />
    </svg>
  );
}

/** Statement row → ₺350 coin, bracketed, with sparkles. */
export function TransactionVisual() {
  const { txn, reward } = CREDIT_BENEFITS.getirpara;
  const seq: AnimationSequence = [
    [".ckp-txn__row", { x: [-36, 0], opacity: [0, 1] }, { type: "spring", duration: 0.6, bounce: 0.15 }],
    [".ckp-txn__stroke", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.55, ease: EASE, at: "-0.2" }],
    [".ckp-txn__coin", { scale: [0.3, 1], rotate: [-30, 0], opacity: [0, 1] }, { type: "spring", duration: 0.6, bounce: 0.3, at: "-0.2" }],
    [".ckp-txn__spark", { scale: [0.2, 1], rotate: [-90, 0], opacity: [0, 1] }, { ...POP, delay: stagger(0.08), at: "-0.3" }],
  ];
  const scope = useStory(seq, {
    loops: [[".ckp-txn__spark", { scale: [1, 0.55, 1], opacity: [1, 0.45, 1] }, { duration: 2.6, ease: "easeInOut", repeat: Infinity, delay: stagger(0.7) }]],
  });
  return (
    <div className="ckp-txn" ref={scope}>
      <Bracket side="l" />
      <Bracket side="r" />
      <div className="ckp-txn__row">
        <span className="ckp-txn__date">
          <span className="ckp-txn__month">{txn.month}</span>
          <span className="ckp-txn__day">{txn.day}</span>
        </span>
        <span className="ckp-txn__merchant">{txn.merchant}</span>
        <span className="ckp-txn__amount">
          <small>{txn.amount.cur}</small>
          {txn.amount.int}
          <small>{txn.amount.dec}</small>
        </span>
      </div>
      <span className="ckp-txn__coin">{reward}</span>
      <img loading="lazy" className="ckp-txn__spark ckp-txn__spark--a" src={`${A}/sparkle-a.svg`} alt="" width={13} height={13} />
      <img loading="lazy" className="ckp-txn__spark ckp-txn__spark--b" src={`${A}/sparkle-b.svg`} alt="" width={17} height={17} />
      <img loading="lazy" className="ckp-txn__spark ckp-txn__spark--c" src={`${A}/sparkle-c.svg`} alt="" width={28.8} height={28.8} />
    </div>
  );
}

/** App-icon tile + ₺0 seal. */
export function AidatVisual() {
  const seq: AnimationSequence = [
    [".ckp-aidat__app", { y: [14, 0], opacity: [0, 1] }, { type: "spring", duration: 0.5, bounce: 0.2 }],
    // the stamp: comes down big and tilted, lands hard
    [".ckp-aidat__seal", { scale: [1.6, 1], rotate: [-24, 0], opacity: [0, 1] }, { type: "spring", duration: 0.42, bounce: 0.28, at: "-0.1" }],
    [".ckp-aidat__ripple", { scale: [0.7, 1.55], opacity: [0, 0.55, 0] }, { duration: 0.7, ease: "easeOut", at: "-0.18" }],
    [".ckp-aidat__app", { scale: [1, 0.9, 1] }, { duration: 0.36, ease: EASE, at: "<" }],
  ];
  const scope = useStory(seq, {
    loops: [[".seal-star", { rotate: [0, 360] }, { duration: 48, ease: "linear", repeat: Infinity }]],
  });
  return (
    <div className="ckp-aidat" ref={scope}>
      <span className="ckp-aidat__app">
        <span className="ckp-aidat__icon">
          <img loading="lazy" src={`${A}/icon-card-phone.svg`} alt="" width={61.2549} height={54.3606} />
        </span>
      </span>
      <span className="ckp-aidat__stamp">
        <i className="ckp-aidat__ripple" />
        <SealArt className="ckp-aidat__seal" />
      </span>
    </div>
  );
}
