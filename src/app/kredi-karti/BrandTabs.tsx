/* Created by Claude · INTERNAL */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import Reveal, { RevealItem, useReducedMotionSafe } from "@/components/Reveal";
import { usePreloadImages } from "@/components/usePreloadImages";
import { CREDIT_BRANDS } from "@/data/content";

/* "maximum taksit" — merchant tabs (Figma 22630:15864).
   Six logo cells between hairlines; the selected one takes the grey fill and
   drives the detail row beneath (photo + brand / offer + copy + link).
   Click-only: the comp hides its pause control, so this one does not rotate.
   ARIA tabs with automatic activation (←/→, Home/End). Logo crops are the
   comp's — two of the exported images carry padding around the mark.

   Motion pass (2026-09-25): the grey cell glides from brand to brand (one
   shared-layout element, not six fills); the photo wipes in from the side
   of the brand you moved toward; the copy rolls in with a short blur and
   the offer's slash turns into place. */

const EASE = [0.16, 1, 0.3, 1] as const;
const WIPE = { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const };

export default function BrandTabs() {
  const { brands } = CREDIT_BRANDS;
  const uid = useId();
  const [index, setIndex] = useState(CREDIT_BRANDS.initial);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const b = brands[index];
  const stripRef = useRef<HTMLDivElement>(null);
  usePreloadImages(stripRef, brands.map((br) => br.photo));
  const reduced = useReducedMotionSafe();
  // which way the pick moved, for the photo wipe
  const [seen, setSeen] = useState({ index, dir: 1 });
  if (seen.index !== index) setSeen({ index, dir: index > seen.index ? 1 : -1 });

  /* ≤920 the strip scrolls sideways and the pre-selected brand (Beymen, 4th)
     starts off-screen; bring the active cell into the strip's view. Scrolls
     the strip only — never the page. */
  useEffect(() => {
    const strip = stripRef.current;
    const tab = tabsRef.current[index];
    if (!strip || !tab || strip.scrollWidth <= strip.clientWidth) return;
    const left = tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2;
    strip.scrollTo({ left, behavior: "auto" });
  }, [index]);

  const onKey = (e: KeyboardEvent) => {
    const n = brands.length;
    const to =
      e.key === "ArrowRight" ? (index + 1) % n
      : e.key === "ArrowLeft" ? (index - 1 + n) % n
      : e.key === "Home" ? 0
      : e.key === "End" ? n - 1
      : null;
    if (to === null) return;
    e.preventDefault();
    setIndex(to);
    tabsRef.current[to]?.focus();
  };

  return (
    <section className="dpc-section ckp-brands" aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <Reveal as="header" className="dpc-head ckp-brands__head" stagger={0.06}>
          <div className="dpc-head__text">
            <RevealItem>
              <h2 className="dpc-title ckp-brands__title" id={`${uid}-h`}>
                <img src="/assets/img/kredi-karti/maximum-logo.svg" alt="maximum" width={170} height={43.8129} />{" "}
                {CREDIT_BRANDS.title}
              </h2>
            </RevealItem>
            <RevealItem as="p" className="dpc-sub ckp-brands__sub">
              {CREDIT_BRANDS.sub}
            </RevealItem>
          </div>
          <RevealItem>
            <a className="dpc-cta" href={CREDIT_BRANDS.href} target="_blank" rel="noopener noreferrer">
              {CREDIT_BRANDS.cta}
            </a>
          </RevealItem>
        </Reveal>

        <Reveal className="ckp-brands__body">
          <div className="ckp-brands__tabs" ref={stripRef} role="tablist" aria-label="maximum üye iş yerleri" onKeyDown={onKey}>
            {brands.map((br, i) => {
              const on = i === index;
              return (
                <button
                  key={br.id}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  className={clsx("ckp-brands__tab", on && "is-active")}
                  onClick={() => setIndex(i)}
                >
                  {on && (
                    <motion.span
                      layoutId={`${uid}-cell`}
                      className="ckp-brands__cell"
                      aria-hidden="true"
                      transition={{ type: "spring", duration: 0.5, bounce: 0.12 }}
                    />
                  )}
                  <span
                    className={clsx("ckp-brands__logo", br.crop && "is-cropped")}
                    style={{ width: br.w, height: br.h }}
                  >
                    <img
                      src={br.logo}
                      alt={br.name}
                      width={br.w}
                      height={br.h}
                      loading="lazy"
                      style={br.crop ? { width: br.crop.w, height: br.crop.h, left: br.crop.l, top: br.crop.t } : undefined}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="ckp-brands__detail"
            id={`${uid}-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${index}`}
          >
            <div className="ckp-brands__media">
              <AnimatePresence initial={false}>
                <motion.img
                  key={b.id}
                  src={b.photo}
                  alt=""
                  width={1198}
                  height={963}
                  loading="lazy"
                  className="ckp-brands__photo"
                  initial={reduced ? { opacity: 0 } : { clipPath: seen.dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", scale: 1.06, zIndex: 1 }}
                  animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0 0%)", scale: 1, zIndex: 1 }}
                  /* pushes in under the incoming wipe (animated, so it stays until covered; scaling up never shows the frame) */
                  exit={reduced ? { opacity: 0, transition: { duration: 0.4, ease: EASE } } : { zIndex: 0, scale: 1.1, transition: { duration: WIPE.duration, ease: EASE } }}
                  transition={reduced ? { duration: 0.4, ease: EASE } : { clipPath: WIPE, scale: { duration: 1, ease: EASE } }}
                />
              </AnimatePresence>
            </div>
            <div className="ckp-brands__copy">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={b.id}
                  className="ckp-brands__copy-inner"
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -4, filter: "blur(2px)", transition: { duration: 0.12 } }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <h3 className="ckp-brands__name">
                    {/* spaces for the accessible name; flex drops them visually */}
                    <span>{b.name}</span>{" "}
                    <motion.span
                      className="ckp-brands__slash"
                      aria-hidden="true"
                      initial={{ rotate: -60, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", duration: 0.5, bounce: 0.3, delay: 0.08 }}
                    >
                      /
                    </motion.span>{" "}
                    <span className="ckp-brands__offer">{b.offer}</span>
                  </h3>
                  <p className="ckp-brands__desc">{b.desc}</p>
                  <a className="ckp-brands__link" href={b.href} target="_blank" rel="noopener noreferrer">
                    <span>{CREDIT_BRANDS.linkLabel}</span>
                    <img src="/assets/img/kartlar/arrow-up-right-purple.svg" alt="" width={24} height={24} loading="lazy" />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
