import type { Metadata } from "next";
import CreditPage from "./CreditPage";

/* Server wrapper so this route can own its <title> and description.

   /hesap-karti cannot: it is a single `"use client"` page.tsx, and client
   components can't export `metadata`, so it silently inherits the LANDING
   page's title ("getirfinans — ama ne finans!") and its %44 faiz description —
   an open flag on GFDES-2174 since 2026-08-05.

   The live kredi-karti page already has correct metadata, so shipping this
   route without it would be a regression. Values below are the live page's,
   verbatim. Worth applying the same split to /hesap-karti. */

export const metadata: Metadata = {
  title: "getirfinans kredi kartı ile avantajlı alışveriş | getirfinans",
  description:
    "getirfinans kredi kartı ile yıllık aidat ödemeden alışveriş yap, getirpara kazan ve taksit fırsatlarından yararlan.",
};

export default function Page() {
  return <CreditPage />;
}
