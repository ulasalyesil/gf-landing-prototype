"use client";
/* Created by Claude — INTERNAL
   GFDES-2175 — the dictionary index: search + letter rail + results.

   Interaction model (settled by the benchmark pass, see
   gfdes-2175-finans-sozlugu.md):

   - Search is the PRIMARY route, the rail is the browse FALLBACK. They are
     therefore mutually exclusive axes, not composable filters: typing releases
     the active letter, picking a letter clears the query. Composing them buys
     one extra capability and one new failure mode — "0 sonuç" because the query
     and the letter disagree — which reads as a broken page.
   - The rail is a WAI toolbar with roving tabindex: ONE tab stop for 29
     controls instead of 29, arrows/Home/End to move. Disabled letters ARE
     arrow-reachable (so a keyboard user learns J exists and hears
     `aria-disabled`) but are never the resting tab stop, because the resting
     stop is always the active chip and the active chip can never be disabled.
   - Focus is only ever moved by a user action: the clear button returns focus
     to the input it just emptied, and arrow keys move within the rail. Filtering
     itself never touches focus.

   The result count is announced through a debounced live region so a screen
   reader isn't read a new total on every keystroke; the visible count updates
   instantly and is aria-hidden to avoid double-announcing the same number. */

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  LETTERS_TR,
  NUMERAL_BUCKET,
  POPULAR_TERMS,
  bucketCounts,
  fold,
  groupByLetter,
  searchTerms,
  type Term,
} from "@/data/sozluk";

const ALL = "__all__";

/** How long to wait before telling assistive tech the new total. Long enough to
    cover typing, short enough that it still feels like a response. */
const ANNOUNCE_DELAY = 450;

interface RailItem {
  key: string;
  label: string;
  count: number;
  disabled: boolean;
}

export default function SozlukIndex({
  terms,
  initialQuery = "",
}: {
  terms: Term[];
  initialQuery?: string;
}) {
  const reduced = useReducedMotion();
  const inputId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [bucket, setBucket] = useState<string>(ALL);

  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  /* ---- rail model -------------------------------------------------------- */

  /* Counts come from the FULL set, never from the filtered set: a letter is
     disabled because the dictionary has no term under it, not because the
     current query happens to exclude it. A rail whose disabled letters moved
     around as you typed would be unreadable. */
  const counts = useMemo(() => bucketCounts(terms), [terms]);
  const hasNumerals = (counts.get(NUMERAL_BUCKET) ?? 0) > 0;

  const railItems = useMemo<RailItem[]>(() => {
    const items: RailItem[] = [
      { key: ALL, label: "tümü", count: terms.length, disabled: false },
    ];
    /* The numeral bucket exists in the markup and hides while empty — unlike a
       letter, a numeral group carries no promise of completeness. */
    if (hasNumerals) {
      items.push({
        key: NUMERAL_BUCKET,
        label: NUMERAL_BUCKET,
        count: counts.get(NUMERAL_BUCKET) ?? 0,
        disabled: false,
      });
    }
    for (const letter of LETTERS_TR) {
      const count = counts.get(letter) ?? 0;
      items.push({ key: letter, label: letter, count, disabled: count === 0 });
    }
    return items;
  }, [counts, hasNumerals, terms.length]);

  /* Roving tabindex cursor. Moved by arrow keys, and re-anchored to whichever
     chip was just picked — so the single tab stop is always the active chip and
     Tab can never land on a disabled letter. Index 0 is "tümü", which is never
     disabled, so the initial value is always safe.

     Set from the handlers rather than synced from `bucket` in an effect: an
     effect here would be a cascading render for a value the click already
     knows. */
  const [cursor, setCursor] = useState(0);

  /* ---- filtering --------------------------------------------------------- */

  const results = useMemo(() => {
    if (query.trim()) return searchTerms(query, terms);
    if (bucket === ALL) return terms;
    return terms.filter((t) =>
      bucket === NUMERAL_BUCKET ? /^\d/.test(t.term) : t.letter === bucket,
    );
  }, [query, bucket, terms]);

  /* Search results are already relevance-ordered (headword matches first), so
     grouping them by letter would throw that ordering away. Grouped spine only
     while browsing. */
  const searching = query.trim().length > 0;
  const groups = useMemo(() => (searching ? [] : groupByLetter(results)), [searching, results]);

  const filtered = searching || bucket !== ALL;
  const countLabel = useMemo(() => {
    if (results.length === 0) return "sonuç bulunamadı";
    if (!filtered) return `${results.length} terim`;
    return `${results.length} terim bulundu`;
  }, [results.length, filtered]);

  /* Debounced announcement — see the header note. */
  const [announced, setAnnounced] = useState(countLabel);
  useEffect(() => {
    const t = window.setTimeout(() => setAnnounced(countLabel), ANNOUNCE_DELAY);
    return () => window.clearTimeout(t);
  }, [countLabel]);

  /* ---- sticky geometry ---------------------------------------------------- */

  /* The letter spine is sticky underneath a sticky bar, so it needs the bar's
     real height. Measured rather than hardcoded because the rail wraps to a
     different number of rows at every width. */
  useEffect(() => {
    const bar = barRef.current;
    const root = rootRef.current;
    if (!bar || !root) return;
    /* Written on the ROOT, not on the bar — the letter spine is a sibling
       subtree and would never inherit a custom property set on the bar. */
    const write = () => {
      root.style.setProperty("--sozluk-bar-h", `${Math.round(bar.offsetHeight)}px`);
    };
    write();
    const ro = new ResizeObserver(write);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  /* ---- handlers ---------------------------------------------------------- */

  const pickBucket = useCallback((key: string, index: number) => {
    /* Re-picking the active letter releases it. Cheaper than hunting for the
       "tümü" chip at the far left of a wrapped rail. */
    setBucket((current) => (current === key ? ALL : key));
    setCursor(index);
    /* Search and the rail are one axis, not two — see the header note. */
    setQuery("");
  }, []);

  const resetFilter = useCallback(() => {
    setQuery("");
    setBucket(ALL);
    setCursor(0);
  }, []);

  const onType = useCallback((value: string) => {
    setQuery(value);
    if (value.trim()) setBucket(ALL);
  }, []);

  const clear = useCallback(() => {
    setQuery("");
    /* User-initiated: they pressed the button that emptied this field, so
       putting the caret back in it is the expected outcome, not a surprise. */
    inputRef.current?.focus();
  }, []);

  const onRailKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const KEYS = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
      if (!KEYS.includes(event.key)) return;
      event.preventDefault();
      const last = railItems.length - 1;
      let next = cursor;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = cursor >= last ? 0 : cursor + 1;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = cursor <= 0 ? last : cursor - 1;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = last;
          break;
      }
      setCursor(next);
      const nodes = railRef.current?.querySelectorAll<HTMLButtonElement>("[data-rail-item]");
      nodes?.[next]?.focus();
    },
    [cursor, railItems.length],
  );

  /* 260ms, under the 300ms UI budget — this is a tab-style indicator and it
     should land, not glide. Spring rather than a curve so a second click
     mid-flight retargets from the current position instead of restarting.
     Reduced motion drops the movement entirely (the movement IS the animation
     here, so there is no gentler version to keep). */
  const indicatorTransition = reduced
    ? { duration: 0 }
    : ({ type: "spring", duration: 0.26, bounce: 0 } as const);
  /* Reduced motion keeps opacity and drops transform — gentler, not off. */
  const EASE_OUT = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="sozluk" ref={rootRef}>
      {/* ============ search + rail — one bar, two rows ============
          The sticky element is the WRAPPER, painted page-white, so rows
          scrolling underneath never show through the card's rounded corners. */}
      <div className="sozluk-barwrap" ref={barRef}>
      <div className="sozluk-bar">
        <form
          className="sozluk-bar__search"
          role="search"
          /* Real GET target so the field still works with JS unavailable; the
             client filter takes over once hydrated. */
          action="/pnib/sozluk"
          method="get"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="sozluk-bar__label" htmlFor={inputId}>
            kelime ara
          </label>
          <div className="sozluk-bar__field">
            <SearchGlyph />
            <input
              ref={inputRef}
              id={inputId}
              name="q"
              type="search"
              className="sozluk-bar__input"
              placeholder="örneğin: bileşik faiz"
              value={query}
              onChange={(e) => onType(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
              /* Safari's own clear affordance would sit next to ours. */
              style={{ WebkitAppearance: "none" }}
            />
            <AnimatePresence initial={false}>
              {query.length > 0 && (
                <motion.button
                  type="button"
                  className="sozluk-bar__clear"
                  onClick={clear}
                  aria-label="aramayı temizle"
                  /* 0.9, never scale(0) — a control that grows from nothing
                     reads as arriving from nowhere. Reduced motion keeps the
                     opacity fade and drops the scale. Exit is faster than
                     enter: dismissing is the system responding, appearing is
                     the thing worth watching. */
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.14, ease: EASE_OUT }}
                >
                  <CloseGlyph />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </form>

        <div className="sozluk-bar__rail">
          <span className="sozluk-bar__label" id="sozluk-rail-label">
            harfe göre gözat
          </span>
          <div
            ref={railRef}
            className="sozluk-rail"
            role="toolbar"
            aria-orientation="horizontal"
            aria-labelledby="sozluk-rail-label"
            onKeyDown={onRailKeyDown}
          >
            {railItems.map((item, i) => {
              const isActive = item.key === bucket;
              return (
                <button
                  key={item.key}
                  data-rail-item
                  type="button"
                  className={
                    "sozluk-rail__item" +
                    (item.key === ALL ? " sozluk-rail__item--all" : "") +
                    (isActive ? " is-active" : "") +
                    (item.disabled ? " is-empty" : "")
                  }
                  /* aria-disabled, not `disabled`: the letter has to stay
                     discoverable by arrow key and still announce why it does
                     nothing. `disabled` would make it invisible to that. */
                  aria-disabled={item.disabled || undefined}
                  aria-pressed={isActive}
                  tabIndex={i === cursor ? 0 : -1}
                  onClick={item.disabled ? undefined : () => pickBucket(item.key, i)}
                  onFocus={() => setCursor(i)}
                >
                  {/* The travelling indicator is an UNDERLINE, not a filled
                      pill. A pill would mean inverting the active label to
                      white the instant the class flips — while the pill is
                      still 300px away mid-flight — so the label would sit
                      white-on-cream for the length of the animation, and the
                      pill would pass over other labels at 2.7:1. An underline
                      obscures nothing, and purple-on-lilac clears the 3:1
                      non-text threshold that yellow (1.55:1) would fail. */}
                  {isActive && (
                    <motion.span
                      layoutId="sozluk-rail-ind"
                      className="sozluk-rail__ind"
                      transition={indicatorTransition}
                    />
                  )}
                  <span className="sozluk-rail__glyph">{item.label}</span>
                  {item.disabled && <span className="pnib-sr-only"> — terim yok</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* ============ count ============ */}
      <div className="sozluk__meta">
        {/* aria-hidden and NOT wrapping the reset button — a focusable control
            inside an aria-hidden container is unreachable-but-tabbable, which is
            worse than either state on its own. */}
        <p className="sozluk__count" aria-hidden="true">
          {countLabel}
        </p>
        {/* The announcement lives apart from the visible count so the same
            number isn't read twice, and so it can lag behind typing. */}
        <p role="status" aria-live="polite" className="pnib-sr-only">
          {announced}
        </p>
        {filtered && (
          <button type="button" className="sozluk__reset" onClick={resetFilter}>
            filtreyi kaldır
          </button>
        )}
      </div>

      {/* ============ results ============ */}
      {/* No `mode="wait"`: the results list below is outside this boundary and
          renders the instant there are results, so a lingering exit would
          overlap the two. Exit is therefore instant — asymmetric on purpose,
          since "here are your results" should never wait on a farewell. */}
      <AnimatePresence initial={false}>
        {results.length === 0 ? (
          <motion.div
            key="empty"
            className="sozluk-empty"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <p className="sozluk-empty__head">
              {searching ? (
                <>
                  <strong>“{query.trim()}”</strong> için bir terim bulamadık.
                </>
              ) : (
                <>
                  <strong>{bucket}</strong> ile başlayan bir terim henüz yok.
                </>
              )}
            </p>
            <p className="sozluk-empty__sub">
              yazımı kontrol edebilir ya da sık aranan terimlerden başlayabilirsin.
            </p>
            <ul className="sozluk-empty__chips">
              {POPULAR_TERMS.map((t) => (
                <li key={t.slug}>
                  <Link href={`/pnib/sozluk/${t.slug}`} className="sozluk-chip">
                    {t.term}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {results.length > 0 &&
        (searching ? (
          /* Flat, relevance-ordered list. No letter spine — the spine would
             claim an alphabetical order the results don't have. */
          <ul className="sozluk-list sozluk-list--flat">
            {results.map((t) => (
              <TermRow key={t.slug} term={t} query={query} />
            ))}
          </ul>
        ) : (
          groups.map((group) => (
            <section className="sozluk-group" key={group.letter} aria-labelledby={`harf-${group.letter}`}>
              <h2 className="sozluk-group__letter" id={`harf-${group.letter}`}>
                <span aria-hidden="true">{group.letter}</span>
                <span className="pnib-sr-only">{group.letter} harfi</span>
              </h2>
              <ul className="sozluk-list">
                {group.terms.map((t) => (
                  <TermRow key={t.slug} term={t} />
                ))}
              </ul>
            </section>
          ))
        ))}
    </div>
  );
}

/* One row of the index. A teaser is mandatory — a visitor has to be able to
   tell "is this the term I meant?" without clicking. Clamped to two lines so
   the 119-character definitions in the set can't make one row three times the
   height of its neighbours; the full text is one click away at its own URL. */
function TermRow({ term, query }: { term: Term; query?: string }) {
  return (
    <li className="sozluk-row">
      <Link href={`/pnib/sozluk/${term.slug}`} className="sozluk-row__link">
        <span className="sozluk-row__term">
          {query ? <Highlight text={term.term} query={query} /> : term.term}
        </span>
        <span className="sozluk-row__teaser">{term.short}</span>
        <ChevronGlyph />
      </Link>
    </li>
  );
}

/* Marks the matched run in the headword. Folded comparison, sliced from the
   ORIGINAL string, so "bilesik" highlights "bileşik" without mangling it —
   the fold is 1:1 per character, so indices stay aligned. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = fold(query.trim());
  const at = q ? fold(text).indexOf(q) : -1;
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="sozluk-mark">{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  );
}

/* ---- glyphs: inline so they inherit currentColor and need no network ---- */

function SearchGlyph() {
  return (
    <svg className="sozluk-bar__icon" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="8.75" cy="8.75" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.2 13.2 L17 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ChevronGlyph() {
  return (
    <svg className="sozluk-row__chev" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
