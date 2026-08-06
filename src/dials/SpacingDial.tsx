"use client";

import { useEffect } from "react";
import { SPACING_DIALS_ENABLED, useSpacingDials } from "./useSpacingDials";

/* Mounts the section-rhythm A/B (see useSpacingDials.ts). Renders nothing —
   it exists only to write `data-gf-spacing` onto <html>, which
   `styles/spacing-system.css` keys off.

   On <html> rather than <body> so the custom properties are in scope for
   anything that ever renders in a portal outside <body>'s subtree.

   Applied in an effect, never as JSX or an SSR attribute: the dial value
   settles on the client after the server rendered the default, and gating
   markup on it is the hydration mismatch that already bit CampaignsCarousel
   and AbroadCollage. CSS reading an attribute has no such problem — the
   pre-effect frame simply shows today's spacing. */
export default function SpacingDial() {
  const { newSystem } = useSpacingDials();

  useEffect(() => {
    if (!SPACING_DIALS_ENABLED) return;
    const root = document.documentElement;
    if (newSystem) root.setAttribute("data-gf-spacing", "new");
    else root.removeAttribute("data-gf-spacing");
    return () => root.removeAttribute("data-gf-spacing");
  }, [newSystem]);

  return null;
}
