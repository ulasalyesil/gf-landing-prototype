"use client";
/* Created by Claude — INTERNAL */

import React from "react";
import clsx from "clsx";
import {
  PLACEMENTS,
  usePlacement,
  setPlacement,
  useIsReviewHost,
  type Placement,
} from "./paranaiyibakPlacement";

/* On-screen switch for the #paranaiyibak placement review — lets the team compare
   the two arrangements on the Vercel preview without hand-editing a URL, and
   without a reload (see paranaiyibakPlacement.ts for why that matters).

   Deliberately a separate control, NOT the brand mark. The menu-subtexts dial
   made the #paranaiyibak badge itself the toggle and had to be dev-gated so a
   brand mark never does something unexpected when tapped in production. This flag
   ships to previews, so it must be visibly a review tool rather than product UI —
   hence the "önizleme" caption.

   Compact-only (≤920), like the drawer: above that breakpoint neither arrangement
   applies (the badge lives permanently in .site-header__actions and the drawer is
   hidden), so the control would do nothing visible. Hidden by CSS rather than by
   a JS media query — no resize listener to get wrong.

   TEMPORARY — delete with the rest of the review scaffolding. */

const LABELS: Record<Placement, string> = {
  header: "üstte",
  drawer: "altta",
};

export default function ParanaiyibakFlag() {
  const placement = usePlacement();
  const isReviewHost = useIsReviewHost();

  // Never renders on getirfinans.com; server snapshot is false so SSR omits it.
  if (!isReviewHost) return null;

  return (
    <div className="pnib-flag" role="group" aria-label="#paranaiyibak yerleşimi (önizleme)">
      <span className="pnib-flag__cap" aria-hidden="true">
        önizleme
      </span>
      {PLACEMENTS.map((p) => (
        <button
          key={p}
          type="button"
          className={clsx("pnib-flag__btn", placement === p && "is-active")}
          aria-pressed={placement === p}
          onClick={() => setPlacement(p)}
        >
          {LABELS[p]}
        </button>
      ))}
    </div>
  );
}
