/* Created by Claude · INTERNAL */
"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { animate } from "motion/react";
import Reveal, { RevealItem } from "@/components/Reveal";
import { ArrowButton, PageDots } from "@/components/CarouselControls";

/* "sıkça sorulan sorular" — horizontal card deck (card pages v2).

   Credit comp 22630:15772 is the `compact` skin, debit 22630:16562 the `wide`
   one; the markup is the same. Cards snap on x; the arrows step one card and
   the dots follow the scroll position rather than driving it.

   The comp clamps long answers under a fade with no way to read the rest, so
   a card whose answer overflows becomes a disclosure: the question is a
   button (aria-expanded) whose hit area is stretched over the whole card.
   Cards that fit get no button — a control that does nothing is worse than
   none.

   With a mouse the disclosure also opens on hover (owner, 2026-10-16:
   "smooth reveal on hover"): the card springs to its full answer as the
   fade dissolves, and folds back when the pointer leaves. A click pins it
   open; touch and keyboard use the button alone. */

export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqCarousel({
  title,
  items,
  skin = "compact",
}: {
  title: string;
  items: FaqItem[];
  skin?: "compact" | "wide";
}) {
  const uid = useId();
  const trackId = `${uid}-track`;
  const trackRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const step = useCallback(() => {
    const t = trackRef.current;
    const card = t?.querySelector<HTMLElement>(".dpc-faq__card");
    if (!t || !card) return 1;
    return card.offsetWidth + parseFloat(getComputedStyle(t).columnGap || "0");
  }, []);

  // position → dots + arrow state. Scroll-driven so swipe, arrows and
  // keyboard scrolling all report through one path.
  const sync = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    const s = step();
    setPages(max > 1 ? Math.ceil(max / s - 0.05) + 1 : 1);
    setPage(max > 1 && t.scrollLeft >= max - 2 ? Math.ceil(max / s - 0.05) : Math.round(t.scrollLeft / s));
    setAtStart(t.scrollLeft <= 2);
    setAtEnd(t.scrollLeft >= max - 2);
  }, [step]);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    sync();
    t.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(t);
    return () => {
      t.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const go = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className={clsx("dpc-faq", skin === "wide" && "dpc-faq--wide")} aria-labelledby={`${uid}-title`}>
      <div className="dpc-container">
        <Reveal className="dpc-faq__wrap" stagger={0.06}>
          <RevealItem as="header" className="dpc-faq__head">
            <h2 className="dpc-faq__title" id={`${uid}-title`}>
              {title}
            </h2>
            <span className="dpc-faq__accent" aria-hidden="true" />
          </RevealItem>

          <RevealItem className={clsx("dpc-faq__viewport", atEnd && "is-end")}>
            <ul className="dpc-faq__track" id={trackId} ref={trackRef}>
              {items.map((item, i) => (
                <FaqCard key={item.q} item={item} id={`${uid}-a${i}`} />
              ))}
            </ul>
          </RevealItem>

          {pages > 1 && (
            <RevealItem className="dpc-faq__nav">
              <ArrowButton
                dir="prev"
                skin="chevron"
                label="önceki sorular"
                controls={trackId}
                onClick={() => go(-1)}
                disabled={atStart}
              />
              <PageDots count={pages} index={page} skin="ring" />
              <ArrowButton
                dir="next"
                skin="chevron"
                label="sonraki sorular"
                controls={trackId}
                onClick={() => go(1)}
                disabled={atEnd}
              />
            </RevealItem>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* hover intent: a pointer resting on a card this long opens it; leaving
   closes it after LEAVE_MS (unless it was clicked open, which pins it) */
const INTENT_MS = 120;
const LEAVE_MS = 180;

function FaqCard({ item, id }: { item: FaqItem; id: string }) {
  const liRef = useRef<HTMLLIElement>(null);
  const aRef = useRef<HTMLParagraphElement>(null);
  const [clamped, setClamped] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const open = clamped && (pinned || hover);
  // how much taller the answer is than its clamp, measured while closed
  const extra = useRef(0);
  const timer = useRef(0);

  // measure against the clamp, not the open state, so closing works too
  useEffect(() => {
    const a = aRef.current;
    if (!a) return;
    const measure = () => {
      if (open) return;
      extra.current = Math.max(0, a.scrollHeight - a.clientHeight);
      setClamped(extra.current > 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(a);
    return () => ro.disconnect();
  }, [open]);

  // the card's height springs between its clamp and its full answer; the
  // inline height is dropped once closed so the stylesheet owns it again
  const first = useRef(true);
  useEffect(() => {
    const li = liRef.current;
    if (!li) return;
    if (first.current) {
      first.current = false;
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = li.offsetHeight;
    li.style.height = "";
    const base = li.offsetHeight;
    const to = open ? base + extra.current : base;
    const ctl = animate(li, { height: [from, to] }, reduce ? { duration: 0 } : { type: "spring", duration: 0.5, bounce: 0.12 });
    // open rests at auto so a resize re-flows the answer; closed hands back to CSS
    ctl.finished.then(() => {
      li.style.height = open ? "auto" : "";
    });
    return () => ctl.stop();
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHover(true), INTENT_MS);
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHover(false), LEAVE_MS);
  };

  return (
    <li
      ref={liRef}
      className={clsx("dpc-faq__card", clamped && "is-clamped", open && "is-open")}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <h3 className="dpc-faq__q">
        {clamped ? (
          // a click pins the card open (or closes it, hover or not)
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => {
              setPinned(!open);
              if (open) setHover(false);
            }}
          >
            {item.q}
          </button>
        ) : (
          item.q
        )}
      </h3>
      <p className="dpc-faq__a" id={id} ref={aRef}>
        {item.a}
      </p>
    </li>
  );
}
