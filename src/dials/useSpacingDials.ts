"use client";

import { useDialKit } from "dialkit";

/* Gate for the dev-only affordance, same shape as MENU_DIALS_ENABLED. Runtime
   check, not a compile-time strip — what matters is behaviour: in a production
   build the attribute is never applied, so the page renders today's spacing. */
export const SPACING_DIALS_ENABLED = process.env.NODE_ENV !== "production";

/* Section-rhythm A/B (2026-08-05). Spec: vault
   `brand/website/landing-page/section-rhythm.md`, styles in
   `src/styles/spacing-system.css`.

   Plain useDialKit, not the Controller — unlike the menu subtexts dial there is
   no second on-page control that has to stay in sync, so there's nothing to
   arbitrate. The panel is the only driver.

   Defaults to the NEW system so a bare preview shows the proposal, matching the
   ?earn= / ?steps= / ?pnib= precedent. Flip it off to see today's page; the two
   states differ ONLY in section padding, so it's a clean read.

   Deliberately NOT persisted, for the reason logged on useMenuDials: a stored
   value outlives the decision it was made for and already masked a default once.
   Every reload starts from the proposal.

   The value must never gate JSX — it settles on the client after the server
   rendered the default. SpacingDial applies it as a data attribute inside an
   effect and CSS does the rest. */
export function useSpacingDials() {
  const values = useDialKit(
    "Spacing",
    { newSystem: true as boolean },
    { id: "gf-spacing" }
  );
  return { newSystem: values.newSystem };
}
