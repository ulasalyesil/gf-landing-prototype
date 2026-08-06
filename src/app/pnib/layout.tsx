/* Created by Claude — INTERNAL
   GFDES-2175 — shared shell for the paranaiyibak surfaces.

   Owns the CSS import and the provisional chrome so all three routes
   (/pnib, /pnib/sozluk, /pnib/sozluk/[slug]) can't drift apart. */

import type { Metadata } from "next";
import { PnibHeader, PnibFooter } from "./PnibChrome";
import "./pnib.css";

export const metadata: Metadata = {
  title: {
    default: "paranaiyibak",
    template: "%s — paranaiyibak",
  },
};

export default function PnibLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pnib">
      <PnibHeader />
      {children}
      <PnibFooter />
    </div>
  );
}
