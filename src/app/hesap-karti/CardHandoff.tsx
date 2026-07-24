"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { DEBIT_SANAL } from "@/data/content";
import { useStepsMode } from "./DeliverySteps";

/* Sanal → abroad card handoff (GFDES-2174 §5 interaction, round 2)

   One continuous object across two sections: when the sanal section top
   reaches the viewport top, the virtual card SNAPS off the page (spring —
   a decisive click, not a scrub) to viewport center, un-tilting -20° → 0°
   and shrinking to the abroad collage card slot's size. It floats there
   while the rest of the sanal section scrolls past underneath, then rides
   down to meet the approaching collage, crossfading into the physical
   render mid-descent, and LANDS as `.dpc-abroad__img-card` — the same
   card the abroad collage always had. No added scroll distance: the whole
   sequence lives on the natural travel between the two sections.

   LAYERING (owner request 2026-07-17) — the traveler reads as part of the
   sections, not an overlay: it flies BEHIND the sanal content
   (.dpc-sanal__inner z 61 > traveler z 60; the glass cards frost it via
   backdrop blur), is CLIPPED at the dark section's live bottom edge so the
   section end carries it away, and re-emerges from UNDER the abroad captions
   on descent (see overlayClip below).

   MECHANISM — a fixed-position "traveler" (both card assets stacked),
   never a sticky pin. Two progress values compose:

     s  snap    0→1 spring, fired on crossing the section-top anchor
                (reverse crossing springs it back; s hitting 0 retires the
                traveler). Position lerps in-flow rect → viewport center,
                rotation -20° → 0°, scale 290px-stack → slot size. The
                in-flow card and the traveler coincide exactly at s=0, so
                the swap is invisible.
     d  descent pure function of the collage slot's LIVE viewport position:
                0 while the slot is below the fold, 1 when the slot's
                center reaches LAND_AT of the viewport. The traveler lerps
                center → slot(live), so at d=1 the positions coincide
                wherever the slot is — landing is exact by construction,
                and reverse scroll un-lands for free.

   Effective descent = d × s: a fast flick can't outrun the snap — if d
   maxes while the spring is mid-flight, the traveler simply lands the
   rest of the way as s completes.

   GEOMETRY — measured from the DOM (source stack, slot img, section top)
   into a ref on activation/resize/collage reflow; doc-space coords so any
   scroll position resolves. The source's center survives its own -20°
   rotation (rotation about center), but its SIZE must come from
   offsetWidth — getBoundingClientRect returns the rotated bbox. A version
   MotionValue is bumped on every re-measure so the transform chain
   (which reads the ref, invisible to Motion's dependency tracking)
   recomputes without waiting for the next scroll event.

   HANDOFF PROTOCOL — a module-level phase store (idle | flying | landed),
   read via useHandoffPhase(): SanalCard hides its in-flow stack while the
   phase is non-idle; AbroadCollage hides its card img until "landed" and
   keys its photo stagger to the landing (this page renders each exactly
   once, so a singleton is safe — documented trade-off).

   MODES — desktop scrub only (useStepsMode "scrub"): below 921px and
   under reduced motion the traveler never activates and both sections
   stay fully static. Mode flips mid-flight reset to idle. */

export type HandoffPhase = "idle" | "flying" | "landed";

let phase: HandoffPhase = "idle";
const listeners = new Set<() => void>();
function setPhase(next: HandoffPhase) {
  if (next === phase) return;
  phase = next;
  listeners.forEach((l) => l());
}
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
export function useHandoffPhase(): HandoffPhase {
  return useSyncExternalStore(subscribe, () => phase, () => "idle" as const);
}
/** Event-style subscription (setState belongs in the callback, per the
    set-state-in-effect rule). Fires on every phase TRANSITION. */
export function subscribeHandoffPhase(cb: (p: HandoffPhase) => void): () => void {
  const listener = () => cb(phase);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/* same 648×984 canvas as the sanal virtual-card.png — crossfade is size-exact */
const PHYSICAL_CARD = { src: "/assets/img/debit-card.png", w: 648, h: 984 };
/* landing point: the slot's center reaches this fraction of the viewport
   height — below center, so the card visibly comes down to meet the collage
   before riding on with the page */
const LAND_AT = 0.62;
/* crossfade windows on effective descent */
const FADE_V: [number, number] = [0.25, 0.7];
const FADE_P: [number, number] = [0.3, 0.75];
/* decisive but not violent; ~0.5s settle */
const SNAP_SPRING = { type: "spring", stiffness: 200, damping: 25 } as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface Geom {
  anchor: number; // doc scrollY at which the sanal section top hits viewport top
  srcCX: number; // source stack center, doc coords
  srcCY: number;
  srcW: number; // layout width (NOT the rotated bbox)
  slotCX: number; // collage slot center, doc coords
  slotCY: number;
  slotW: number;
  slotH: number;
  sanalBottom: number; // sanal section bottom edge, doc coords (traveler cutoff)
  capBottom: number; // abroad captions bottom edge, doc coords (traveler reveal)
  vh: number;
  vw: number;
}

export default function CardHandoff() {
  const active = useStepsMode() === "scrub";
  const currentPhase = useHandoffPhase();
  const geom = useRef<Geom | null>(null);

  const { scrollY } = useScroll();
  const s = useMotionValue(0);
  const geomVersion = useMotionValue(0);
  // traveler box dims as MotionValues — imperative like the rest of the
  // geometry, so measuring never has to setState (set-state-in-effect rule)
  const boxW = useMotionValue(0);
  const boxH = useMotionValue(0);

  const measure = () => {
    const src = document.querySelector<HTMLElement>("[data-handoff-source]");
    const slot = document.querySelector<HTMLElement>(".dpc-abroad__img-card");
    const section = document.getElementById(DEBIT_SANAL.id);
    const captions = document.querySelector<HTMLElement>(".dpc-abroad__captions");
    if (!src || !slot || !section || !captions) return;
    const y = window.scrollY;
    const sr = src.getBoundingClientRect();
    const tr = slot.getBoundingClientRect();
    const secR = section.getBoundingClientRect();
    geom.current = {
      anchor: secR.top + y,
      srcCX: sr.left + sr.width / 2,
      srcCY: sr.top + sr.height / 2 + y,
      srcW: src.offsetWidth,
      slotCX: tr.left + tr.width / 2,
      slotCY: tr.top + tr.height / 2 + y,
      slotW: tr.width,
      slotH: tr.height,
      sanalBottom: secR.bottom + y,
      capBottom: captions.getBoundingClientRect().bottom + y,
      vh: window.innerHeight,
      vw: window.innerWidth,
    };
    boxW.set(tr.width);
    boxH.set(tr.height);
    geomVersion.set(geomVersion.get() + 1);
  };

  /* Keep geometry fresh: viewport resizes and collage reflow (lazy images,
     font swaps) both move the anchors. The collage container is observed
     rather than the img so %-based slot moves are caught too. */
  useEffect(() => {
    if (!active) return;
    measure();
    window.addEventListener("resize", measure);
    const collage = document.querySelector(".dpc-abroad__collage");
    const observer = collage ? new ResizeObserver(measure) : null;
    if (collage && observer) observer.observe(collage);
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  /* effective descent: the slot's live viewport position mapped to 0→1,
     gated by the snap so a flick can't outrun it.
     EXPLICIT dependency arrays throughout — the function form of
     useTransform collects dependencies by tracking .get() calls on its
     first evaluation, and with geometry not ready at mount that collection
     proved unreliable here (the computed value froze). The array form
     subscribes deterministically. */
  const descend = (y: number, S: number): number => {
    const g = geom.current;
    if (!g) return 0;
    const slotVY = g.slotCY - y;
    const from = g.vh + g.slotH / 2; // slot top edge at viewport bottom
    const to = g.vh * LAND_AT;
    return clamp01((from - slotVY) / (from - to)) * S;
  };
  const dEff = useTransform([scrollY, s, geomVersion] as const, (latest) => {
    const [y, S] = latest as number[];
    return descend(y, S);
  });

  const travelerT = useTransform([scrollY, s, geomVersion] as const, (latest) => {
    const [y, S] = latest as number[];
    const g = geom.current;
    if (!g) return "translate(-9999px, -9999px)";
    const D = descend(y, S);
    const srcVX = g.srcCX;
    const srcVY = g.srcCY - y;
    const slotVX = g.slotCX;
    const slotVY = g.slotCY - y;
    // float point (viewport center) → live slot position, then source → that
    const hx = lerp(g.vw / 2, slotVX, D);
    const hy = lerp(g.vh / 2, slotVY, D);
    const cx = lerp(srcVX, hx, S);
    const cy = lerp(srcVY, hy, S);
    const rot = -20 * (1 - S);
    const scale = lerp(g.srcW / g.slotW, 1, S);
    return `translate(${(cx - g.slotW / 2).toFixed(2)}px, ${(cy - g.slotH / 2).toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
  });

  const vOpacity = useTransform(dEff, FADE_V, [1, 0]);
  const pOpacity = useTransform(dEff, FADE_P, [0, 1]);

  /* Overlay clip — the traveler lives INSIDE the sections, not on top of the
     page (owner request 2026-07-17). Visible window = union of two viewport
     bands, both scroll-live:
       above the sanal section's bottom edge  → the card is cut off at the end
       of the dark section and disappears WITH it;
       below the abroad captions' bottom edge → the card re-emerges from under
       the caption points as it descends to the collage slot.
     Single polygon traces both rects joined by a zero-width seam on x=0.
     By landing, the slot sits fully below the captions (collage margin), so
     the clip never cuts the card at the traveler → slot img swap. */
  const overlayClip = useTransform([scrollY, geomVersion] as const, (latest) => {
    const [y] = latest as number[];
    const g = geom.current;
    if (!g) return "none";
    const a = Math.min(g.vh, Math.max(0, g.sanalBottom - y)).toFixed(1);
    const b = Math.min(g.vh, Math.max(0, g.capBottom - y)).toFixed(1);
    return `polygon(0px 0px, 100% 0px, 100% ${a}px, 0px ${a}px, 0px ${b}px, 100% ${b}px, 100% 100%, 0px 100%)`;
  });

  /* snap trigger: fire the spring on crossing the section-top anchor.
     The upward spring retires the traveler when it lands back at s=0. */
  const crossed = useRef(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    if (!active || !geom.current) return;
    const above = y >= geom.current.anchor;
    if (above && !crossed.current) {
      crossed.current = true;
      measure(); // source rect at the exact detach moment
      setPhase("flying");
      animate(s, 1, SNAP_SPRING);
    } else if (!above && crossed.current) {
      crossed.current = false;
      animate(s, 0, { ...SNAP_SPRING, onComplete: () => {
        if (!crossed.current) setPhase("idle");
      } });
    }
  });

  // landing threshold (and un-landing, on reverse)
  useMotionValueEvent(dEff, "change", (v) => {
    if (!active) return;
    if (v >= 0.999) setPhase("landed");
    else if (crossed.current) setPhase("flying");
  });

  /* init + mode flips: restore-scroll can start us mid-page; a resize below
     921px mid-flight must fully retire the traveler */
  useEffect(() => {
    if (!active) {
      crossed.current = false;
      s.jump(0);
      setPhase("idle");
      return;
    }
    measure();
    const g = geom.current;
    if (g && window.scrollY >= g.anchor) {
      crossed.current = true;
      s.jump(1);
      // raw math, not dEff.get() — a computed value can be stale pre-subscription
      setPhase(descend(window.scrollY, 1) >= 0.999 ? "landed" : "flying");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active || currentPhase !== "flying") return null;

  return (
    <motion.div className="dpc-handoff" aria-hidden="true" style={{ clipPath: overlayClip }}>
      <motion.div
        className="dpc-handoff__stack"
        style={{ width: boxW, height: boxH, transform: travelerT }}
      >
        <motion.img src={DEBIT_SANAL.media} alt="" width={648} height={984} style={{ opacity: vOpacity }} />
        <motion.img
          src={PHYSICAL_CARD.src}
          alt=""
          width={PHYSICAL_CARD.w}
          height={PHYSICAL_CARD.h}
          style={{ opacity: pOpacity }}
        />
      </motion.div>
    </motion.div>
  );
}
