"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { REVEAL_SPRING, useMotionOff } from "@/components/Reveal";
import { useStepsMode } from "./DeliverySteps";
import { subscribeHandoffPhase, useHandoffPhase } from "./CardHandoff";
import type { HandoffPhase } from "./CardHandoff";
import { useTilt } from "./Tilt";

/* Abroad collage entrance (GFDES-2174 §4)
   - The debit card render is the LANDING PAD of the sanal→abroad handoff
     (CardHandoff.tsx) on desktop: it stays hidden until the traveler lands
     on its exact rect, then simply becomes visible — the swap is invisible
     because the positions coincide by construction. The photo stagger keys
     off the landing.
   - Below 921px / reduced motion (no handoff): the card pops in when the
     collage scrolls into view (once), and the stagger keys off that
     entrance completing — the original behavior.
   - Lisbon (img-3) then Berlin (img-5) are fixed anchors, in that order;
     the remaining photos (1, 2, 4) follow in a random order, decided ONCE
     per page load. Re-entering the viewport never re-triggers or re-shuffles.
   - Pop = fade + scale .92→1 (never from 0), constant 80ms stagger.

   HYDRATION: DOM order is FIXED (anchors then declaration order) so the
   server and client render identical markup — this page is prerendered, and
   shuffling during render produced a different order per request. The
   randomness lives in the stagger DELAYS, assigned in an event/effect
   callback (post-hydration), never in render. Same trap as the
   CampaignsCarousel mismatch. */

interface CollageImg {
  cls: string;
  src: string;
  w: number;
  h: number;
}

/* debit-card.png and virtual-card.png (sanal section) are the SAME 648×984
   canvas — the handoff crossfade swaps them with zero size shift */
const CARD: CollageImg = { cls: "dpc-abroad__img-card", src: "/assets/img/debit-card.png", w: 648, h: 984 };
const LISBON: CollageImg = { cls: "dpc-abroad__img-3", src: "/assets/img/debit-abroad-3.png", w: 240, h: 174 };
const BERLIN: CollageImg = { cls: "dpc-abroad__img-5", src: "/assets/img/debit-abroad-5.png", w: 190, h: 256 };
const REST: CollageImg[] = [
  { cls: "dpc-abroad__img-1", src: "/assets/img/debit-abroad-1.png", w: 170, h: 256 },
  { cls: "dpc-abroad__img-2", src: "/assets/img/debit-abroad-2.png", w: 240, h: 174 },
  { cls: "dpc-abroad__img-4", src: "/assets/img/debit-abroad-4.png", w: 256, h: 170 },
];

const STAGGER = 0.08;
const POP = { type: "spring", duration: 0.5, bounce: 0.25 } as const;

/* Fixed DOM order. Anchors first, then the shuffled group in declaration
   order — only their DELAYS get shuffled. */
const PHOTOS: CollageImg[] = [LISBON, BERLIN, ...REST];
const ANCHORS = 2;

/** Delay slots: anchors keep slots 0 and 1; the rest get the remaining slots
    in random order. Called once, from an event/effect callback. */
function makeDelays(): number[] {
  const slots = PHOTOS.map((_, i) => i * STAGGER);
  const rest = slots.slice(ANCHORS);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [...slots.slice(0, ANCHORS), ...rest];
}

/* One decorative collage photo: the outer .dpc-abroad__photo wrapper carries
   position/size (its own slot class, e.g. img-3) and the Motion pop entrance;
   the inner .t-tilt-card is what actually tilts toward the pointer. Split out
   as its own component because useTilt is a hook and can't be called from
   inside the parent's .map() callback (Rules of Hooks). */
function CollagePhoto({
  img,
  delay,
  off,
  started,
}: {
  img: CollageImg;
  delay: number;
  off: boolean;
  started: boolean;
}) {
  const { wrapRef, cardRef, onPointerMove, onPointerLeave } = useTilt();
  return (
    <motion.div
      ref={wrapRef}
      className={`${img.cls} dpc-abroad__photo t-tilt`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={off ? false : { opacity: 0, scale: 0.92 }}
      animate={off || started ? { opacity: 1, scale: 1 } : undefined}
      transition={{ ...POP, delay }}
    >
      <div ref={cardRef} className="t-tilt-card">
        <img src={img.src} alt="" width={img.w} height={img.h} loading="lazy" />
        <div className="t-tilt-glare" aria-hidden="true" />
      </div>
    </motion.div>
  );
}

/* The card slot — same .dpc-abroad__photo/.t-tilt wrapping as CollagePhoto,
   but its box is also the LANDING PAD CardHandoff measures
   (querySelector(".dpc-abroad__img-card")). The wrapper's position/size stay
   exactly as before; only the nested .t-tilt-card tilts, so the handoff
   geometry is never touched by hover. Two render paths, same as the original
   inline ternary: a plain div toggling visibility (handoff mode) or a
   Motion entrance (mobile / reduced motion, no handoff). */
function CardSlot({
  handoff,
  phase,
  off,
  onLanded,
}: {
  handoff: boolean;
  phase: HandoffPhase;
  off: boolean;
  onLanded: () => void;
}) {
  const { wrapRef, cardRef, onPointerMove, onPointerLeave } = useTilt();
  const inner = (
    <div ref={cardRef} className="t-tilt-card">
      <img src={CARD.src} alt="" width={CARD.w} height={CARD.h} loading="lazy" />
      <div className="t-tilt-glare" aria-hidden="true" />
    </div>
  );

  if (handoff) {
    return (
      <div
        ref={wrapRef}
        className={`${CARD.cls} dpc-abroad__photo t-tilt`}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={phase === "landed" ? undefined : { visibility: "hidden" }}
      >
        {inner}
      </div>
    );
  }

  return (
    <motion.div
      ref={wrapRef}
      className={`${CARD.cls} dpc-abroad__photo t-tilt`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={off ? false : { opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -18% 0px" }}
      transition={REVEAL_SPRING}
      onAnimationComplete={onLanded}
    >
      {inner}
    </motion.div>
  );
}

export default function AbroadCollage() {
  const off = useMotionOff();
  const handoff = useStepsMode() === "scrub";
  const phase = useHandoffPhase();
  // null until the trigger (card entrance / traveler landing); set once
  const [delays, setDelays] = useState<number[] | null>(null);
  const started = delays !== null;

  /* handoff trigger: the traveler landing is an external-store transition, so
     the setState lives in the subscription callback (set-state-in-effect rule).
     CardHandoff mounts after this component (last sibling in page.tsx), so
     even a restore-scroll init that lands immediately is caught — its init
     effect runs after this subscription exists. */
  useEffect(() => {
    if (!handoff) return;
    return subscribeHandoffPhase((p) => {
      if (p === "landed") setDelays((prev) => prev ?? makeDelays());
    });
  }, [handoff]);

  return (
    <div className="dpc-abroad__collage">
      {PHOTOS.map((img, i) => (
        <CollagePhoto key={img.cls} img={img} delay={delays ? delays[i] : 0} off={off} started={started} />
      ))}
      <CardSlot
        handoff={handoff}
        phase={phase}
        off={off}
        onLanded={() => setDelays((prev) => prev ?? makeDelays())}
      />
    </div>
  );
}
