"use client";

import { useDialKitController } from "dialkit";

/* Gate for the dev-only affordances. This is a runtime check, not a compile-time
   strip — a few identifiers still appear in the production bundle. What matters is
   behaviour, and that's verified: in a production build the badge renders as a plain
   <a> with no title and no data attribute, and clicking it does nothing. */
export const MENU_DIALS_ENABLED = process.env.NODE_ENV !== "production";

/* Mobile menu tuning panel. Per docs/dialkit-plan.md this is temporary: subtexts are
   ON by default (owner, 2026-07-28), so this survives only as a comparison toggle.
   Delete this hook, the effect + badge handler in Header.tsx and the
   [data-gf-menu-subtexts="off"] rule in sections.css once you're settled.

   Controller (not plain useDialKit) so the #paranaiyibak badge in the menu can drive
   the same value the panel shows — DialKit's panel stays in sync instead of the two
   controls disagreeing. The panel is unusable on a phone, which is the point: the
   badge is the on-device toggle.

   DialRoot's UI auto-hides in production but useDialKit still returns values — so
   `subtexts: true` below IS the shipped behaviour, and every consumer is additionally
   gated on MENU_DIALS_ENABLED.

   Deliberately NOT persisted. A stored value outlives the decision it was made for —
   it already masked this default once, showing subtexts off after they'd been turned
   on. Every reload starts from the shipped behaviour.

   The value must never gate JSX: it settles on the client after the server rendered
   the default, which is the hydration mismatch that already bit CampaignsCarousel and
   AbroadCollage. Header applies it as a data attribute inside an effect; CSS hides. */
export function useMenuDials() {
  /* `as boolean` widens the literal — DialKit infers `true` from the default and would
     otherwise reject setValues({ subtexts: false }). */
  const dial = useDialKitController(
    "Menu",
    { subtexts: true as boolean },
    { id: "gf-menu" }
  );
  const subtexts = dial.values.subtexts;
  return {
    subtexts,
    toggleSubtexts: () => dial.setValues({ subtexts: !subtexts }),
  };
}
