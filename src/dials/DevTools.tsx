"use client";

import { DialRoot } from "dialkit";
import { Agentation } from "agentation";
import SpacingDial from "./SpacingDial";
import "dialkit/styles.css";

/* Single entry point for every dev-only tool, so layout.tsx can pull them in
   through ONE dynamic import instead of four static ones.

   Why this file exists: `{process.env.NODE_ENV !== "production" && <DialRoot />}`
   gates the RENDER, not the BUNDLE. The import is static, so the bundler still
   has to include dialkit + agentation + their CSS in the graph. Measured on a
   clean production build of /hesap-karti: a 414KB chunk carrying both, out of
   1688KB of JS on the page — about a quarter of the payload, for tooling that
   renders nothing in production.

   Importing this module lazily (see layout.tsx) puts all of it in its own chunk
   that production never requests. Nothing about the dev experience changes.

   ⚠ Keep every dev-only import in THIS file. A dev tool imported directly by a
   component ships, and a React hook cannot be lazily loaded at all — that is
   exactly why the DialKit hooks in Hero.tsx and useMenuDials had to be deleted
   outright rather than moved here. */

export default function DevTools() {
  return (
    <>
      {/* bottom-left so it clears Agentation's bottom-right toolbar */}
      <DialRoot position="bottom-left" defaultOpen={false} />
      {/* section-rhythm A/B — writes data-gf-spacing on <html>, styled by
          styles/spacing-system.css. Renders nothing. Delete with the proposal
          once the rhythm is settled. */}
      <SpacingDial />
      {/* visual-feedback overlay: click elements → annotate → copy structured
          markdown for the agent */}
      <Agentation />
    </>
  );
}
