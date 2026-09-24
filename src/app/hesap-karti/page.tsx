import type { Metadata } from "next";
import DebitPage from "./DebitPage";

/* Server wrapper so this route owns its <title> and description. The page
   used to be a single `"use client"` page.tsx, which cannot export
   `metadata`, so it inherited the LANDING page's title and its %44 faiz
   description — an open flag on GFDES-2174 since 2026-08-05. Same split as
   /kredi-karti.
   ⚠ Draft copy (card pages v2, 2026-09-23): the live page's own metadata was
   not available here. Wording is built only from claims the page already
   makes; replace with the live values before shipping. */

export const metadata: Metadata = {
  title: "getirfinans hesap kartı ile harcadıkça kazan | getirfinans",
  description:
    "ücretsiz getirfinans hesap kartıyla harcarken nakit iade ve getirpara kazan. kartın dakikalar içinde kapında.",
};

export default function Page() {
  return <DebitPage />;
}
