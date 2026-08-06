/* Created by Claude — INTERNAL
   GFDES-2175 — /pnib/sozluk, the dictionary index.

   Server component on purpose: all 82 terms and their teasers are in the
   server-rendered HTML before any JS runs. This page exists to be found in
   organic search, so the content cannot be behind hydration. `SozlukIndex`
   layers filtering on top of markup that is already complete. */

import type { Metadata } from "next";
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
        {/* No yellow `.hl` bar and no eyebrow, both removed in the 2026-08-06
            visual pass:

            - The mark belongs on benefit statements only (AGENTS.md's own audit
              rule from the round-1 revision), and "finans sözlüğü" is a label,
              not a benefit. paranaiyibak.com does not use the device at all —
              its yellow is filled badges and dates on dark panels.
            - The eyebrow read "paranaiyibak", which the header wordmark now says
              two rows above it. Live PİB puts the title straight in.

            Reveal stays — the entrance is unrelated to the highlight. */}
        <Reveal as="header" className="sozluk-hero" direction="none">
          <h1 className="sozluk-hero__title">finans sözlüğü</h1>
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
