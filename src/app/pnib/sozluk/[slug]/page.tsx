/* Created by Claude — INTERNAL
   GFDES-2175 — /pnib/sozluk/[slug], one term, one URL.

   Never an accordion. Four of the seven glossaries in the benchmark pass
   collapsed definitions into accordions and gave up per-term URLs; for a page
   whose whole business case is organic search, that is the one unrecoverable
   mistake. So: a static route per term, its own <title>/<meta description>, and
   internal links (related terms, alphabetical neighbours) so nothing is an
   orphan.

   Server component, prerendered at build via generateStaticParams. */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { TERMS, getNeighbours, getTerm } from "@/data/sozluk";

/* `term.product.href` is the one href on this page that will come from a CMS
   rather than from a template literal, so it is the one that can carry a
   `javascript:` or `data:` URL once content is wired up. Constrained to
   same-origin paths at the point of render — cheaper to do now than to remember
   when the field is first populated. Protocol-relative `//evil.tld` is excluded
   too, since it reads as a path but resolves off-origin. */
function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export async function generateStaticParams() {
  return TERMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) return {};
  return {
    title: `${term.term} nedir?`,
    /* The teaser is written as a standalone sentence, so it doubles as the
       search snippet without a second field to maintain. */
    description: term.short,
    alternates: { canonical: `/pnib/sozluk/${term.slug}` },
  };
}

export default async function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) notFound();

  const { prev, next } = getNeighbours(term.slug);
  const related = (term.related ?? [])
    .map((s) => getTerm(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  /* Unresolved related slugs are content debt, not a render error — the entry
     just shows fewer links. Surfaced here rather than swallowed silently. */
  const missingRelated = (term.related ?? []).filter((s) => !getTerm(s));

  return (
    <main className="pnib-main">
      <div className="pnib-container">
        <nav className="pnib-crumb" aria-label="içerik yolu">
          <ol>
            <li>
              <Link href="/pnib/sozluk">sözlük</Link>
            </li>
            <li aria-hidden="true" className="pnib-crumb__sep">
              /
            </li>
            <li>
              {/* Anchors to the letter group heading rather than `?q=A`, which
                  would run a text search for "a" and match half the set. The
                  letter axis is client state, not a URL param. */}
              <Link href={`/pnib/sozluk#harf-${term.letter}`}>{term.letter}</Link>
            </li>
            <li aria-hidden="true" className="pnib-crumb__sep">
              /
            </li>
            <li aria-current="page">{term.term}</li>
          </ol>
        </nav>

        <article className="entry">
          <Reveal as="header" className="entry__head" direction="none">
            <p className="entry__kicker">{term.category}</p>
            <h1 className="entry__title">{term.term}</h1>
            {/* Optional TCMB-style English pairing (open question 6). Renders
                only when content supplies it; nothing shifts if it never does. */}
            {term.english && (
              <p className="entry__english">
                <span className="pnib-sr-only">İngilizcesi: </span>
                <span lang="en">{term.english}</span>
              </p>
            )}
          </Reveal>

          {/* The teaser leads as the one-sentence answer, then the long form
              expands it. On the 75 terms with no long form the lead simply is
              the definition — no empty section, no "detay yok" apology. */}
          <p className="entry__lead">{term.short}</p>
          {term.long && <p className="entry__body">{term.long}</p>}

          {related.length > 0 && (
            <section className="entry__related" aria-labelledby="ilgili">
              <h2 className="entry__subhead" id="ilgili">
                ilgili terimler
              </h2>
              <ul className="entry__chips">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/pnib/sozluk/${r.slug}`} className="sozluk-chip">
                      {r.term}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* A GF product link, when one exists, sits HERE — after the whole
              definition, outside the body copy (AGENTS.md: definitions explain,
              they never sell). No term in the mock carries one, so nothing
              renders; the slot exists so adding one is a content change. */}
          {term.product && isInternalHref(term.product.href) && (
            <aside className="entry__product">
              <Link href={term.product.href} className="entry__product-link">
                {term.product.label}
              </Link>
            </aside>
          )}
        </article>

        <nav className="entry__near" aria-label="alfabetik gezinme">
          {prev ? (
            <Link href={`/pnib/sozluk/${prev.slug}`} className="entry__near-link entry__near-link--prev">
              <span className="entry__near-label">önceki</span>
              <span className="entry__near-term">{prev.term}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/pnib/sozluk/${next.slug}`} className="entry__near-link entry__near-link--next">
              <span className="entry__near-label">sonraki</span>
              <span className="entry__near-term">{next.term}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>

        {missingRelated.length > 0 && (
          <p className="pnib-sr-only">
            {missingRelated.length} ilgili terim henüz yayında değil.
          </p>
        )}
      </div>
    </main>
  );
}
