/* Created by Claude · INTERNAL */
"use client";

import { useId } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import Reveal, { RevealItem } from "@/components/Reveal";
import { useStory } from "@/components/useStory";
import { ATM_MAP_SVG, ATM_PIN_DIST } from "./atmMap";
import { DEBIT_EXTRAS } from "@/data/content";

/* "hesap kartında daha neler var?" — Web comp 319:45165 (2026-10-14).
   Two stat tiles: 7/24 transfers with the paper plane flying off the right
   edge, 535 ATMs over a street map with ATM pins. Both pictures are the
   comp's vectors: the plane is split into body + trail (same viewBox), the
   map is inlined from `atmMap.ts` (generated, pins wrapped for motion).

   Stories (useStory: once in view, again on a hover over the tile; ≤767 /
   reduced motion = the comp, still):
   - 7/24  — the plane swoops in from the edge along its own dashed trail,
             which draws in behind it; 7 and 24 count up like a clock.
             Afterwards it idles on the air (a slow bob).
   - 535   — "you are here" drops onto a crossing, a search ring spreads
             from it, and each ATM pin lands the moment the ring reaches it
             (nearest first) while 535 counts up. The dot keeps pulsing. */

const A = "/assets/img/hesap-karti";
const EASE = [0.16, 1, 0.3, 1] as const;
const POP = { type: "spring", duration: 0.55, bounce: 0.45 } as const;

/* the search ring: easeOut-quad over WAVE s to 420 map px. A pin at
   distance d is reached at t = WAVE·(1 − √(1 − d/420)). */
const WAVE = 1.7;
const reach = (i: number) => WAVE * (1 - Math.sqrt(1 - Math.min(ATM_PIN_DIST[i] ?? 0, 419) / 420));

type Item = (typeof DEBIT_EXTRAS)["items"][number];

function Copy({ it, stat }: { it: Item; stat: React.ReactNode }) {
  return (
    <div className="dbc-extras__copy">
      <h3 className="dbc-extras__head">
        {/* the stat as text for AT, the counting digits for the eye */}
        <span className="dbc-extras__stat">
          <span className="dpc-sr">{it.stat}</span>
          <span aria-hidden="true">{stat}</span>
        </span>{" "}
        <span className="dbc-extras__label">{it.label}</span>
      </h3>
      <p className="dbc-extras__desc">
        {it.desc.map((l, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span className="dbc-extras__line">{l}</span>
          </span>
        ))}
      </p>
    </div>
  );
}

function TransferTile({ it }: { it: Item }) {
  const stat = it.stat;
  const [d0, h0] = stat.split("/").map((s) => Number(s.trim()));
  const days = useMotionValue(d0);
  const hours = useMotionValue(h0);
  const dText = useTransform(days, (v) => String(Math.round(v)));
  const hText = useTransform(hours, (v) => String(Math.round(v)));
  const scope = useStory<HTMLElement>(
    [
      [".dbc-extras__pb", { x: [240, 0], y: [26, 0], rotate: [-8, 0], scale: [0.7, 1], opacity: [0, 1] }, { duration: 1.05, ease: EASE }],
      // the trail is laid from the edge as the plane passes over it
      [".dbc-extras__pt", { clipPath: ["inset(0 0 0 100%)", "inset(0 0 0 0%)"] }, { duration: 0.95, ease: EASE, at: 0.08 }],
      [hours, [0, h0], { duration: 1.1, ease: EASE, at: 0.1 }],
      [days, [0, d0], { duration: 0.8, ease: EASE, at: 0.2 }],
    ],
    { amount: 0.6, hoverTarget: "self", loops: [[".dbc-extras__pb", { y: [0, -6, 0], rotate: [0, -2, 0] }, { duration: 3.8, ease: "easeInOut", repeat: Infinity }]] }
  );
  return (
    <RevealItem as="article" ref={scope} className="dbc-extras__tile dbc-extras__tile--transfer">
      <span className="dbc-extras__art" aria-hidden="true">
        <span className="dbc-extras__plane">
          <span className="dbc-extras__pt">
            <img src={`${A}/neler-plane-trail.svg`} alt="" width={400} height={191.641} loading="lazy" />
          </span>
          <span className="dbc-extras__pb">
            <img src={`${A}/neler-plane-body.svg`} alt="" width={400} height={191.641} loading="lazy" />
          </span>
        </span>
      </span>
      <Copy
        it={it}
        stat={
          <>
            <motion.span>{dText}</motion.span> / <motion.span>{hText}</motion.span>
          </>
        }
      />
    </RevealItem>
  );
}

function AtmTile({ it }: { it: Item }) {
  const to = Number(it.stat);
  const count = useMotionValue(to);
  const text = useTransform(count, (v) => String(Math.round(v)));
  const scope = useStory<HTMLElement>(
    [
      [".dbc-atm__you", { scale: [0, 1], opacity: [0, 1] }, { ...POP }],
      [".dbc-atm__wave", { scale: [0, 1], opacity: [0.55, 0] }, { duration: WAVE, ease: "easeOut", at: 0.3 }],
      [".dbc-atm__pin", { y: [-22, 0], scale: [0.4, 1], opacity: [0, 1] }, { type: "spring", duration: 0.6, bounce: 0.5, delay: (i: number) => reach(i), at: 0.3 }],
      [count, [0, to], { duration: 1.5, ease: EASE, at: 0.3 }],
    ],
    { amount: 0.6, hoverTarget: "self", loops: [[".dbc-atm__halo", { scale: [1, 2.6], opacity: [0.16, 0] }, { duration: 2.4, ease: "easeOut", repeat: Infinity }]] }
  );
  return (
    <RevealItem as="article" ref={scope} className="dbc-extras__tile dbc-extras__tile--atm">
      <span className="dbc-extras__art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ATM_MAP_SVG }} />
      <Copy it={it} stat={<motion.span>{text}</motion.span>} />
    </RevealItem>
  );
}

export default function Extras() {
  const E = DEBIT_EXTRAS;
  const uid = useId();
  return (
    <section className="dbc-extras" aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <Reveal className="dbc-extras__wrap" stagger={0.08}>
          <RevealItem as="h2" className="dbc-extras__title">
            <span id={`${uid}-h`}>{E.title}</span>
          </RevealItem>
          <div className="dbc-extras__row">
            {E.items.map((it) => (it.key === "transfer" ? <TransferTile key={it.key} it={it} /> : <AtmTile key={it.key} it={it} />))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
