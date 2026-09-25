/* Created by Claude · INTERNAL */
"use client";

import { useEffect, useId, useRef } from "react";
import clsx from "clsx";
import { motion, useInView, useMotionValue, useScroll, useTransform } from "motion/react";
import type { TargetAndTransition, Variants } from "motion/react";
import SectionHead from "@/components/SectionHead";
import Reveal, { RevealItem, useMotionOff } from "@/components/Reveal";
import { useAutoAdvance } from "@/components/useAutoAdvance";
import { DEBIT_SANAL } from "@/data/content";

/* "sanal hesap kartıyla güvenle harca" (card pages v2, Figma 22630:16495).
   Pale-yellow field, three frosted feature cards on the left, the hand-held
   virtual card with three rotated outline rings on the right, all fading to
   white at the foot. The art is positioned from the stage's centre in comp px
   (`--u`), so it tracks the column rather than the viewport edge.

   Feature glyphs: each is a 2×2 of 24px quarter-shapes (Figma draws them as
   flipped/rotated rounded squares); the cell list below is the resolved
   corner set for each, so no transforms are needed.

   Motion pass (2026-09-25) — the rings are card outlines, so they act out
   whichever feature is active:
     0 "ayrı kartlar oluştur"      → they fan apart: several cards
     1 "internet alışverişlerini…" → they pulse outward: a shield
     2 "limitini belirle"          → they draw in tight: a limit
   The active feature cycles while the section is in view (useAutoAdvance:
   pauses on hover/focus, stops for good on a pick); pointing at or focusing
   a card picks it. Its glyph quarters assemble from flat squares as the
   cards enter, and the art drifts up a little against the scroll.
   ≤767 / reduced motion: no cycle, rings at rest, art still. */

type Cell = { c: string; r: string };
/* order: top-left, top-right, bottom-left, bottom-right */
const GLYPHS: Cell[][] = [
  [
    { c: "var(--gf-yellow)", r: "15px 0 0 0" },
    { c: "var(--gf-purple)", r: "15px 0 0 0" },
    { c: "var(--dpc-sanal-lilac)", r: "15px" },
    { c: "var(--dpc-sanal-mauve)", r: "0 15px 0 0" },
  ],
  [
    { c: "var(--gf-yellow)", r: "0 0 15px 0" },
    { c: "var(--gf-purple)", r: "0 15px 0 0" },
    { c: "var(--dpc-sanal-mauve)", r: "0 15px 15px 0" },
    { c: "var(--dpc-sanal-lilac)", r: "15px" },
  ],
  [
    { c: "var(--dpc-sanal-lilac)", r: "15px" },
    { c: "var(--gf-purple)", r: "15px 15px 0 0" },
    { c: "var(--gf-yellow)", r: "0 15px 0 0" },
    { c: "var(--dpc-sanal-mauve)", r: "15px 0 0 0" },
  ],
];

/* glyph quarters: flat squares → their corner shapes, one after another */
const cellVariants: Variants = {
  hidden: { scale: 0.4, opacity: 0, borderRadius: "0px" },
  visible: (c: { r: string; j: number }) => ({
    scale: 1,
    opacity: 1,
    borderRadius: c.r,
    transition: { type: "spring", duration: 0.55, bounce: 0.3, delay: 0.18 + c.j * 0.06 },
  }),
};

/* ring i = 0 innermost … 2 outermost; each returns its pose for a feature */
const SETTLE = { type: "spring", duration: 0.9, bounce: 0.15 } as const;
function ringPose(mode: number | null, i: number): TargetAndTransition {
  switch (mode) {
    case 0:
      return { rotate: i * 10, scale: 1 + i * 0.02, transition: SETTLE };
    case 1:
      return {
        rotate: 0,
        scale: [1, 1.07 + i * 0.02, 1],
        transition: { rotate: SETTLE, scale: { duration: 1.6, ease: "easeInOut", repeat: Infinity, delay: i * 0.22 } },
      };
    case 2:
      return { rotate: 0, scale: 1 - (i + 1) * 0.05, transition: SETTLE };
    default:
      return { rotate: 0, scale: 1, transition: SETTLE };
  }
}

export default function Sanal() {
  const S = DEBIT_SANAL;
  const uid = useId();
  const off = useMotionOff();
  const colRef = useRef<HTMLDivElement>(null);
  const { index, select, progress, auto, bind } = useAutoAdvance(S.features.length, colRef, 3600);
  // rings rest while the section is off-screen (the shield pulse is a loop)
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "80px 0px" });
  const mode = off || !inView ? null : index;

  // the art drifts up against the scroll (gated by a motion value, not by
  // swapping style, so SSR and client agree)
  const on = useMotionValue(0);
  useEffect(() => {
    on.set(off ? 0 : 1);
  }, [off, on]);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const artY = useTransform(() => (on.get() ? (0.5 - scrollYProgress.get()) * 120 : 0));

  return (
    <section className="dpc-section dpc-sanal" id={S.id} aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <SectionHead
          eyebrow={S.eyebrow}
          eyebrowClassName="dpc-sanal__eyebrow"
          title={S.title}
          sub={S.sub}
          titleId={`${uid}-h`}
          className="dpc-sanal__head"
        />

        <div className="dpc-sanal__stage" ref={stageRef}>
          <motion.div className="dpc-sanal__art" aria-hidden="true" style={{ y: artY }}>
            {/* comp layer order: the rings sit over the hand */}
            <span className="dpc-sanal__hand">
              <img loading="lazy" src="/assets/img/hesap-karti/sanal-hand.webp" alt="" width={2250} height={1888} />
            </span>
            {[3, 2, 1].map((n) => (
              <motion.span
                key={n}
                className={`dpc-sanal__ring dpc-sanal__ring--${n}`}
                initial={false}
                animate={ringPose(mode, n - 1)}
              />
            ))}
          </motion.div>

          <Reveal className="dpc-sanal__col" stagger={0.08}>
            <div className="dpc-sanal__cards" ref={colRef} {...bind}>
              <ul className="dpc-sanal__list">
                {S.features.map((f, i) => {
                  const active = !off && index === i;
                  return (
                    <RevealItem as="li" key={f} className={clsx("dpc-sanal__card", active && "is-active")}>
                      {/* the whole card picks its feature; the list stays a plain list for AT */}
                      <span className="dpc-sanal__hit" onPointerEnter={(e) => e.pointerType === "mouse" && select(i)} />
                      <span className="dpc-sanal__glyph" aria-hidden="true">
                        {GLYPHS[i % GLYPHS.length].map((cell, j) => (
                          <motion.i key={j} custom={{ r: cell.r, j }} variants={cellVariants} style={{ background: cell.c }} />
                        ))}
                      </span>
                      <p className="dpc-sanal__text">
                        {/* the comp breaks each benefit after its comma */}
                        {f.includes(", ") ? (
                          <>
                            {f.slice(0, f.indexOf(", ") + 1)}
                            <br /> {f.slice(f.indexOf(", ") + 2)}
                          </>
                        ) : (
                          f
                        )}
                      </p>
                      {active && auto && <motion.i className="dpc-sanal__prog" aria-hidden="true" style={{ scaleX: progress }} />}
                    </RevealItem>
                  );
                })}
              </ul>
            </div>
            <RevealItem>
              <a className="dpc-cta" href={S.href}>
                {S.cta}
              </a>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
