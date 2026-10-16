/* Created by Claude · INTERNAL */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import Reveal, { RevealItem, useReducedMotionSafe } from "@/components/Reveal";
import { usePreloadImages } from "@/components/usePreloadImages";
import { CREDIT_BRANDS } from "@/data/content";

/* "maximum taksit" — Web comp 292:30840 (2026-10-16). Replaces the logo
   strip + detail row (BrandTabs, git history).

   A dark band: maximum logo + "taksit", sub, CTA; then a coverflow — the
   selected brand's campaign as an 860 × 550 card, its neighbours as dimmed
   300 × 400 cards either side, bottom-aligned — and under it the brand
   logos between a prev and a next button.

   - Circular: every brand can sit in the middle. Each card's slot is its
     offset from the selected one, wrapped into −⌊n/2⌋…⌈n/2⌉−1; a card that
     wraps from one end to the other moves off-screen, so it jumps there
     rather than flying across the band.
   - Every card springs to its slot's x / size / dim on the same spring, so
     the row stays consistent mid-flight.
   - Drag/swipe the row (a pan, not a scroll); click a side card; arrows;
     the logo row is an ARIA tablist (←/→, Home/End, automatic activation).
   - No auto-rotation: there is nothing to pause it with in the comp.
   - Reduced motion: every move is instant. */

const GAP = 32;
const SPRING = { type: "spring", duration: 0.7, bounce: 0.12 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/* slot sizes at the comp's 1440 column, scaled down with the band */
function sizes(vw: number) {
  const k = Math.min(1, vw / 1200);
  const activeW = Math.min(860, vw - 48);
  const activeH = Math.round(activeW * (550 / 860));
  const sideW = Math.round(300 * Math.max(k, 0.62));
  const sideH = Math.round(sideW * (400 / 300));
  return { activeW, activeH, sideW, sideH };
}

const wrap = (d: number, n: number) => {
  const half = Math.floor(n / 2);
  return ((((d + half) % n) + n) % n) - half;
};

export default function MaximumCarousel() {
  const M = CREDIT_BRANDS;
  const n = M.brands.length;
  const uid = useId();
  const [index, setIndex] = useState(M.initial);
  const reduce = useReducedMotionSafe();
  const stageRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [vw, setVw] = useState(1312);
  usePreloadImages(stageRef, M.brands.map((b) => b.photo).filter(Boolean) as string[]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setVw(el.clientWidth));
    ro.observe(el);
    setVw(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // the selection we came from, to spot cards that wrap around the ends
  // (derived during render, React's "previous value" pattern)
  const [moved, setMoved] = useState({ index, from: index });
  if (moved.index !== index) setMoved({ index, from: moved.index });
  const S = sizes(vw);
  const centerOf = (slot: number) => {
    if (slot === 0) return 0;
    const side = S.activeW / 2 + GAP + (Math.abs(slot) - 1) * (S.sideW + GAP) + S.sideW / 2;
    return Math.sign(slot) * side;
  };
  const go = (to: number) => setIndex(((to % n) + n) % n);

  const onKey = (e: KeyboardEvent) => {
    const to =
      e.key === "ArrowRight" ? index + 1
      : e.key === "ArrowLeft" ? index - 1
      : e.key === "Home" ? 0
      : e.key === "End" ? n - 1
      : null;
    if (to === null) return;
    e.preventDefault();
    const next = ((to % n) + n) % n;
    go(next);
    tabsRef.current[next]?.focus();
  };

  /* ≤767 the logo row scrolls; keep the selected logo in its view (the
     row only — never the page) */
  useEffect(() => {
    const tab = tabsRef.current[index];
    const row = tab?.parentElement;
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  }, [index, reduce]);

  const b = M.brands[index];

  return (
    <section className="ckp-mx" aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <Reveal className="ckp-mx__head" stagger={0.08}>
          <RevealItem as="h2" className="ckp-mx__title">
            <span id={`${uid}-h`} className="ckp-mx__title-in">
              <img src="/assets/img/kredi-karti/maximum-logo.svg" alt="maximum" width={170} height={43.813} />
              <span>{M.title}</span>
            </span>
          </RevealItem>
          <RevealItem as="p" className="ckp-mx__sub">
            {M.sub}
          </RevealItem>
          <RevealItem>
            <a className="dpc-cta" href={M.href} target="_blank" rel="noopener noreferrer">
              {M.cta}
            </a>
          </RevealItem>
        </Reveal>
      </div>

      <Reveal className="ckp-mx__body" delay={0.1}>
        <RevealItem>
          <motion.div
            className="ckp-mx__stage"
            ref={stageRef}
            style={{ height: S.activeH }}
            onPanEnd={(_, info) => {
              if (info.offset.x < -50 || info.velocity.x < -400) go(index + 1);
              else if (info.offset.x > 50 || info.velocity.x > 400) go(index - 1);
            }}
          >
            {M.brands.map((br, i) => {
              const slot = wrap(i - index, n);
              const jumped = Math.abs(slot - wrap(i - moved.from, n)) > 1;
              const on = slot === 0;
              const w = on ? S.activeW : S.sideW;
              const h = on ? S.activeH : S.sideH;
              const x = vw / 2 + centerOf(slot) - w / 2;
              return (
                <motion.div
                  key={br.id}
                  id={`${uid}-card-${i}`}
                  role="group"
                  aria-roledescription="kampanya"
                  aria-label={`${br.name}, ${i + 1} / ${n}`}
                  aria-hidden={!on}
                  className={clsx("ckp-mx__card", on && "is-on", !br.photo && "is-empty")}
                  initial={false}
                  animate={{ x, width: w, height: h, opacity: on ? 1 : 0.5 }}
                  transition={reduce || jumped ? { duration: 0 } : SPRING}
                  onClick={on ? undefined : () => go(i)}
                >
                  {br.photo ? (
                    <img className="ckp-mx__photo" src={br.photo} alt="" loading="lazy" draggable={false} />
                  ) : (
                    // ⚠ COMP: no photo for this brand — its logo on the band's violet
                    <span className="ckp-mx__placeholder">
                      <img src={br.logo} alt="" draggable={false} />
                    </span>
                  )}
                  <span className="ckp-mx__shade" />
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        className="ckp-mx__copy"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.18, ease: EASE } }}
                        exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.12 } }}
                      >
                        <div className="ckp-mx__text">
                          <p className="ckp-mx__name">
                            {br.name} / <em>{br.offer}</em>
                          </p>
                          <p className="ckp-mx__period">
                            {M.periodLabel} <b>{br.period}</b>
                          </p>
                        </div>
                        <a className="ckp-mx__link" href={br.href} target="_blank" rel="noopener noreferrer" tabIndex={on ? 0 : -1}>
                          {M.linkLabel}
                          <img src="/assets/img/kredi-karti/max-arrow-circle.svg" alt="" width={32} height={32} />
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!on && (
                    <span className="ckp-mx__peek" aria-hidden="true">
                      <img src="/assets/img/kredi-karti/max-card-arrow.svg" alt="" width={24} height={24} />
                    </span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </RevealItem>

        <RevealItem className="ckp-mx__nav">
          <button type="button" className="ckp-mx__arrow ckp-mx__arrow--prev" aria-label="önceki marka" onClick={() => go(index - 1)}>
            <img src="/assets/img/kredi-karti/max-prev.svg" alt="" width={24} height={24} />
          </button>
          <div className="ckp-mx__brands" role="tablist" aria-label="maximum taksit markaları" onKeyDown={onKey}>
            {M.brands.map((br, i) => {
              const on = i === index;
              return (
                <button
                  key={br.id}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={`${uid}-card-${i}`}
                  tabIndex={on ? 0 : -1}
                  className={clsx("ckp-mx__brand", on && "is-on")}
                  onClick={() => go(i)}
                >
                  <span className="ckp-mx__logo" style={br.cell ? { backgroundColor: br.cell } : undefined}>
                    {/* the yellow ring is ONE element gliding between logos */}
                    {on && <motion.span className="ckp-mx__ring" layoutId={`${uid}-ring`} transition={reduce ? { duration: 0 } : SPRING} />}
                    <span className="ckp-mx__mark" style={{ width: br.w, height: br.h }}>
                      <img
                        src={br.logo}
                        alt=""
                        style={br.crop ? { position: "absolute", width: br.crop.w, height: br.crop.h, left: br.crop.l, top: br.crop.t, maxWidth: "none" } : undefined}
                      />
                    </span>
                  </span>
                  <span className="ckp-mx__label">{br.name}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className="ckp-mx__arrow ckp-mx__arrow--next" aria-label="sonraki marka" onClick={() => go(index + 1)}>
            <img src="/assets/img/kredi-karti/max-next.svg" alt="" width={24} height={24} />
          </button>
        </RevealItem>
        {/* the selected campaign, for screen readers */}
        <p className="dpc-sr" aria-live="polite">
          {b.name} {b.offer}, {M.periodLabel} {b.period}
        </p>
      </Reveal>
    </section>
  );
}
