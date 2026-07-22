"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";

/* Card hover tilt (transitions.dev pattern, adapted) — perspective tilt
   toward the pointer + a screen-blend glare that tracks it. Gated per-event
   on pointerType === "mouse" rather than a CSS media query, so touch/pen never
   engages it (no fighting page scroll on mobile, no hybrid-device ambiguity).
   Reduced motion is neutralized purely in CSS (.t-tilt-card { transform: none
   !important } in debit-current.css), so this can run unconditionally.

   The pointer is tracked on the OUTER wrap (which never transforms) so the
   tilting card can't pull its own edges out from under the cursor. Callers
   attach wrapRef/onPointerMove/onPointerLeave to the flat hit area and
   cardRef to the nested element that should actually tilt (see SanalCard.tsx
   and AbroadCollage.tsx — in both, the hit area is an element with a fixed
   layout box that other code measures, so the tilt lives one level deeper
   and never perturbs that measurement). */

const DEFAULT_MAX_DEG = 26;

export function useTilt(max: number = DEFAULT_MAX_DEG) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    const r = wrap.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    wrap.classList.add("is-hover");
    card.classList.add("is-tilting");
    card.style.setProperty("--tilt-ry", ((px - 0.5) * max).toFixed(2) + "deg");
    card.style.setProperty("--tilt-rx", ((0.5 - py) * max).toFixed(2) + "deg");
    card.style.setProperty("--tilt-gx", (px * 100).toFixed(1) + "%");
    card.style.setProperty("--tilt-gy", (py * 100).toFixed(1) + "%");
  };

  const onPointerLeave = () => {
    wrapRef.current?.classList.remove("is-hover");
    const card = cardRef.current;
    if (!card) return;
    card.classList.remove("is-tilting");
    card.style.setProperty("--tilt-rx", "0deg");
    card.style.setProperty("--tilt-ry", "0deg");
  };

  return { wrapRef, cardRef, onPointerMove, onPointerLeave };
}
