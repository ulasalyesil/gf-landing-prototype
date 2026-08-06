/* Created by Claude — INTERNAL
   GFDES-2175 — /pnib/sozluk, the dictionary index.

   Server component on purpose: all 82 terms and their teasers are in the
   server-rendered HTML before any JS runs. This page exists to be found in
   organic search, so the content cannot be behind hydration. `SozlukIndex`
   layers filtering on top of markup that is already complete. */

import type { Metadata } from "next";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import Reveal from "@/components/Reveal";
import { TERMS } from "@/data/sozluk";
import SozlukIndex from "./SozlukIndex";

export const metadata: Metadata = {
  title: "finans sözlüğü",
  description:
    "faizden valöre, kmh'den kredi notuna — paradan konuşurken karşına çıkan kelimeler sade bir dille açıklanıyor.",
  alternates: { canonical: "/pnib/sozluk" },
};

/* `?q=` is read on the server and handed down as the initial value, rather than
   with useSearchParams in the client — that would need a Suspense boundary and
   would flash an unfiltered list first. The trade is that this page renders
   dynamically; acceptable, and revisit if it ever needs to be fully static. */
export default async function SozlukPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const initialQuery = Array.isArray(q) ? (q[0] ?? "") : (q ?? "");

  return (
    <main className="pnib-main">
      <div className="pnib-container">
        {/* Reveal, not a plain header: the `.hl` yellow bar only draws once an
            ancestor carries `is-in`, which Reveal writes. The highlight sits on
            "finans", not "sözlüğü" — base.css tunes `.hl::after` for
            non-descender text and the ğ tail would disappear under the bar
            (the same clipping that needed scoped overrides on /hesap-karti). */}
        <Reveal as="header" className="sozluk-hero" direction="none">
          <p className="sozluk-hero__eyebrow">paranaiyibak</p>
          <h1 className="sozluk-hero__title">
            <AnimatedHighlight type="hl">finans</AnimatedHighlight> sözlüğü
          </h1>
          <p className="sozluk-hero__lead">
            faiz mi, valör mü, kmh mı? paradan konuşurken karşına çıkan kelimeleri
            sade bir dille topladık. hiçbiri bir şey satmak için yazılmadı.
          </p>
        </Reveal>

        <SozlukIndex terms={TERMS} initialQuery={initialQuery} />
      </div>
    </main>
  );
}
