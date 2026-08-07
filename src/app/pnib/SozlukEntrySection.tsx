/* Created by Claude — INTERNAL
   GFDES-2175 — the "paranaiyibak sözlük" section for the bottom of the PİB
   homepage.

   This is an ENTRY, not a preview of the whole set: search field on the left as
   the primary affordance, one featured term on the right as proof there is
   substance behind the link. No A–Z rail here — that is the page's job, and a
   28-item rail at the bottom of a homepage reads as a second navigation.

   The search field is a real GET form pointing at /pnib/sozluk, so it works
   with no JS at all and the query arrives as ?q= — which is exactly what the
   index page reads on the server. No client state in this section.

   The featured card follows the Merriam-Webster "Word of the Day" precedent
   the ticket's own instinct pointed at: a bordered side card with a single
   colour accent. Whether the term comes from real site-search data or an
   editorial CMS field is still open (question 3); either way it is one record
   with one label, so neither answer changes this layout. */

import Link from "next/link";
import Reveal, { RevealItem } from "@/components/Reveal";
import { TERMS, TERM_OF_MONTH, getTerm } from "@/data/sozluk";

export default function SozlukEntrySection() {
  const featured = getTerm(TERM_OF_MONTH.slug);

  return (
    <section className="pnib-sozluk-entry" aria-labelledby="sozluk-entry-title">
      <div className="pnib-container">
        <Reveal className="pnib-sozluk-entry__grid" stagger={0.08} direction="up">
          <RevealItem className="pnib-sozluk-entry__lead">
            {/* Yellow `.hl` bar removed 2026-08-06 — same reasoning as the index
                hero: the mark is for benefit statements, and paranaiyibak.com
                uses yellow as filled badges, not as a text underline. */}
            <h2 className="pnib-sozluk-entry__title" id="sozluk-entry-title">
              paranaiyibak sözlük
            </h2>
            <p className="pnib-sozluk-entry__copy">
              faiz, valör, kmh… paradan konuşurken karşına çıkan kelimeleri sade bir
              dille açıkladık. aradığın kelimeyi yaz, ya da tümüne bak.
            </p>

            {/* Plain GET form — no JS needed, and the query lands on the index
                page's server render rather than after hydration. */}
            <form className="pnib-entry-search" role="search" action="/pnib/sozluk" method="get">
              <label className="pnib-entry-search__label" htmlFor="pnib-sozluk-q">
                kelime ara
              </label>
              <div className="pnib-entry-search__row">
                <input
                  id="pnib-sozluk-q"
                  name="q"
                  type="search"
                  className="pnib-entry-search__input"
                  placeholder="örneğin: bileşik faiz"
                  autoComplete="off"
                  enterKeyHint="search"
                />
                <button type="submit" className="pnib-entry-search__submit">
                  ara
                </button>
              </div>
            </form>

            <Link href="/pnib/sozluk" className="pnib-sozluk-entry__all">
              {/* Count is derived, never written into copy — launch term volume
                  is still an open question and this line must not need an edit
                  when it changes. */}
              {TERMS.length} terimin tümüne bak
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
                <path
                  d="M3 8h9M8.5 4l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </RevealItem>

          {featured && (
            <RevealItem as="article" className="pnib-featured">
              <p className="pnib-featured__label">{TERM_OF_MONTH.search_count_label}</p>
              <h3 className="pnib-featured__term">
                <Link href={`/pnib/sozluk/${featured.slug}`}>{featured.term}</Link>
              </h3>
              <p className="pnib-featured__def">{featured.short}</p>
              <p className="pnib-featured__cta" aria-hidden="true">
                tanımı oku
              </p>
            </RevealItem>
          )}
        </Reveal>
      </div>
    </section>
  );
}
