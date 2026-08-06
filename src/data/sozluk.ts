/* Created by Claude — INTERNAL
   GFDES-2175 — paranaiyibak finans sözlüğü data layer.

   Everything Turkish-collation-sensitive lives here so no component has to
   remember that plain JS sorts Turkish wrong. `sozluk.json` is mock content
   (82 original TR definitions); the shape is what the real CMS has to supply.

   Open product questions this file is deliberately shaped around (see
   gfdes-2175-finans-sozlugu.md): term count, whether term-of-month is search
   data or editorial, and Turkish/English pairing. None of the three is baked
   into a layout — counts are derived, the featured term is one optional
   record, and `english` is an optional field the entry renders only if
   present. */

import raw from "./sozluk.json";

export type SozlukCategory = string;

export interface Term {
  slug: string;
  term: string;
  /** Rail bucket. Authoritative from content — never re-derived, because
      deriving it would have to decide ı/i and I/İ all over again. */
  letter: string;
  category: SozlukCategory;
  /** Teaser. Always present, always shown in the list. */
  short: string;
  /** Long body. Only a subset has one — the entry page falls back to `short`. */
  long?: string;
  related?: string[];
  /** Not in the mock. Reserved for the TCMB-style English pairing (open
      question 6) so adding it later is a content change, not a rebuild. */
  english?: string;
  /** Not in the mock. A GF product link renders at the very END of the entry,
      never inside the definition body (AGENTS.md wording rules). */
  product?: { label: string; href: string };
}

export interface TermOfMonth {
  slug: string;
  term: string;
  search_count_label: string;
}

interface SozlukMeta {
  letters_tr: string[];
  letters_with_no_terms: string[];
}

const data = raw as unknown as {
  _meta: SozlukMeta;
  terms: Term[];
  term_of_month: TermOfMonth;
  popular_terms: string[];
};

/* The rail alphabet comes from content, not from a hardcoded string, so a
   content change can't silently disagree with the rail.

   28 letters: the Turkish alphabet minus Ğ. Q/W/X are not Turkish at all, and
   no Turkish word begins with Ğ — including it would add a letter that can
   never be anything but disabled, which is worse than omitting it. Flagged for
   the designer: if the rail should read as a complete alphabet regardless,
   add "Ğ" to `_meta.letters_tr` and it appears, permanently disabled. */
export const LETTERS_TR = data._meta.letters_tr;

/** Numeral bucket. Exists in the markup, hides while empty — unlike letters, a
    numeral group carries no expectation of completeness. */
export const NUMERAL_BUCKET = "#";

/* Turkish-aware fold for search. Two jobs:
   1. tr locale casing, so "IBAN" → "ıban" and "İBAN" → "iban" both work;
   2. diacritic stripping, so someone typing on an ASCII keyboard finds
      "bileşik faiz" by typing "bilesik faiz".
   Applied to both the query and the haystack, so it is symmetric. */
const TR_FOLD: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u",
};

export function fold(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşüâîû]/g, (c) => TR_FOLD[c] ?? c);
}

/** Turkish collation. Plain `sort()` puts Ç after Z and İ nowhere sensible. */
export function compareTr(a: string, b: string): number {
  return a.localeCompare(b, "tr");
}

export const TERMS: Term[] = [...data.terms].sort((a, b) => compareTr(a.term, b.term));

export const TERM_OF_MONTH: TermOfMonth = data.term_of_month;

/** Fallback suggestions for the no-result state, resolved to real records so a
    stale slug in the popular list can never render a dead link. */
export const POPULAR_TERMS: Term[] = data.popular_terms
  .map((slug) => TERMS.find((t) => t.slug === slug))
  .filter((t): t is Term => Boolean(t));

const BY_SLUG = new Map(TERMS.map((t) => [t.slug, t]));

export function getTerm(slug: string): Term | undefined {
  return BY_SLUG.get(slug);
}

/** Alphabetical neighbours, for the entry page's prev/next. Dictionary-native,
    and it gives every entry two more internal links for crawlers. */
export function getNeighbours(slug: string): { prev?: Term; next?: Term } {
  const i = TERMS.findIndex((t) => t.slug === slug);
  if (i === -1) return {};
  return { prev: TERMS[i - 1], next: TERMS[i + 1] };
}

export interface LetterGroup {
  letter: string;
  terms: Term[];
}

/** Which buckets actually have content. Drives the rail's disabled state. */
export function bucketCounts(terms: Term[] = TERMS): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of terms) {
    const bucket = /^\d/.test(t.term) ? NUMERAL_BUCKET : t.letter;
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }
  return counts;
}

/** Group into rail order. Empty letters are dropped from the *result list*
    (nothing to show) but stay in the rail — the rail is the alphabet, the list
    is the content. */
export function groupByLetter(terms: Term[]): LetterGroup[] {
  const buckets = new Map<string, Term[]>();
  for (const t of terms) {
    const bucket = /^\d/.test(t.term) ? NUMERAL_BUCKET : t.letter;
    const list = buckets.get(bucket);
    if (list) list.push(t);
    else buckets.set(bucket, [t]);
  }
  const order = [NUMERAL_BUCKET, ...LETTERS_TR];
  return order
    .filter((letter) => buckets.has(letter))
    .map((letter) => ({
      letter,
      terms: buckets.get(letter)!.sort((a, b) => compareTr(a.term, b.term)),
    }));
}

/** Search. Matches the headword first (so "faiz" ranks the term `faiz` above
    every definition that mentions faiz), then the definition text. */
export function searchTerms(query: string, terms: Term[] = TERMS): Term[] {
  const q = fold(query.trim());
  if (!q) return terms;
  const head: Term[] = [];
  const body: Term[] = [];
  for (const t of terms) {
    if (fold(t.term).includes(q)) head.push(t);
    else if (fold(t.short).includes(q) || (t.long && fold(t.long).includes(q))) body.push(t);
  }
  return [...head, ...body];
}
