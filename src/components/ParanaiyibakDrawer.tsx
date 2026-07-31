"use client";
/* Created by Claude — INTERNAL */

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePlacement } from "./paranaiyibakPlacement";

/* "#paranaiyibak" persistent bottom bar — Figma 22041:80165 (375×64 bar, logo
   160×32 centred, bg/surface/default on a border/base/default hairline).

   Compact-only (≤920): above that breakpoint the mark already sits permanently in
   .site-header__actions, so a second one would just be noise. 920 is the same
   breakpoint the rest of the header/menu chrome uses (where .nav hides), so this
   introduces no new breakpoint.

   Appears past the same 40px threshold Header uses for .is-scrolled — the two
   chrome changes land on the same scroll rather than 40px apart. The threshold is
   duplicated rather than shared because extracting a hook would mean rewiring
   Header's scroll effect for no behavioural gain; keep them in step by hand.

   PLACEMENT REVIEW — this competes with the scrolled header badge (commit
   e60995f): same mark, same trigger, same breakpoint. The two are alternatives,
   never both on screen (owner, 2026-07-31), switched by ParanaiyibakFlag. State
   and the ?pnib= param live in paranaiyibakPlacement.ts.

   The placement is applied as a data attribute on <html> from an effect — never
   gating JSX, which is the SSR hydration trap that already bit CampaignsCarousel
   and AbroadCollage. CSS does all the hiding, and the CSS default (no attribute
   yet) deliberately equals DEFAULT_PLACEMENT so nothing flashes before the effect
   runs. Drawer visibility is therefore CSS-only — this component stays mounted
   and animated in both placements. */

/** Mirrors Header's .is-scrolled threshold — change both together. */
const SCROLL_THRESHOLD = 40;
const DRAWER_SPRING = { type: "spring", duration: 0.45, bounce: 0.12 } as const;

export default function ParanaiyibakDrawer() {
  const placement = usePlacement();
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.gfPnib = placement;
    return () => {
      delete root.dataset.gfPnib;
    };
  }, [placement]);

  /* Plain scroll listener, no rAF throttle — matches Header's handler so the
     drawer and the header's colour flip can't disagree about being "scrolled". */
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="pnib-drawer"
      /* initial={false} so a reload at an already-scrolled position doesn't play
         the entrance from off-screen — the first commit reflects real state. */
      initial={false}
      animate={{ y: visible ? "0%" : "100%" }}
      transition={reduced ? { duration: 0 } : DRAWER_SPRING}
      /* inert (not just aria-hidden), matching the mega panel: the link has to
         leave the tab order while the bar is parked off-screen. */
      inert={!visible}
    >
      <a href="#" className="paranaiyibak" aria-label="#paranaiyibak">
        <img
          className="paranaiyibak__logo"
          src="/assets/logos/paranaiyibak.svg"
          alt="#paranaiyibak"
        />
      </a>
    </motion.div>
  );
}
