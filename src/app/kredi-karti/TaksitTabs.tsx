/* Created by Claude · INTERNAL */
"use client";

import { useId, useRef } from "react";
import type { KeyboardEvent } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import { ArrowButton } from "@/components/CarouselControls";
import { useAutoAdvance } from "@/components/useAutoAdvance";
import { CREDIT_TAKSIT } from "@/data/content";

/* "ücretsiz 3 taksit" — category tabs (Figma 22630:15718).
   Left: the active category's title + copy over a row of thumbnail tabs;
   right: its photo with prev/next. Rotates on a 5s clock whose progress IS the
   underline under the active thumb (useAutoAdvance); any pick stops it.
   Tabs follow the ARIA pattern with automatic activation: ←/→ move and
   select, Home/End jump. The photo is decorative; the panel is the copy. */

const FADE = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

export default function TaksitTabs() {
  const { categories } = CREDIT_TAKSIT;
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const { index, select, next, prev, progress, bind } = useAutoAdvance(categories.length, rootRef, 5000);
  const active = categories[index];

  const onKey = (e: KeyboardEvent) => {
    const last = categories.length - 1;
    const to =
      e.key === "ArrowRight" ? (index + 1) % categories.length
      : e.key === "ArrowLeft" ? (index - 1 + categories.length) % categories.length
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    select(to);
    tabsRef.current[to]?.focus();
  };

  return (
    <section className="dpc-section ckp-taksit" aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <SectionHead
          eyebrow={CREDIT_TAKSIT.eyebrow}
          eyebrowClassName="ckp-taksit__eyebrow"
          title={CREDIT_TAKSIT.title}
          sub={CREDIT_TAKSIT.sub}
          titleId={`${uid}-h`}
        />

        <Reveal className="ckp-taksit__body">
          <div className="ckp-taksit__stage" ref={rootRef} {...bind}>
            <div className="ckp-taksit__copy">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  id={`${uid}-panel`}
                  role="tabpanel"
                  aria-labelledby={`${uid}-tab-${index}`}
                  className="ckp-taksit__panel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                  transition={{ ...FADE, duration: 0.22 }}
                >
                  <h3 className="ckp-taksit__title">{active.label}</h3>
                  <p className="ckp-taksit__desc">{active.desc}</p>
                </motion.div>
              </AnimatePresence>

              <div className="ckp-taksit__tabs" role="tablist" aria-label="taksit sektörleri" onKeyDown={onKey}>
                {categories.map((c, i) => {
                  const on = i === index;
                  return (
                    <button
                      key={c.id}
                      ref={(el) => {
                        tabsRef.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`${uid}-tab-${i}`}
                      aria-selected={on}
                      aria-controls={`${uid}-panel`}
                      tabIndex={on ? 0 : -1}
                      className={clsx("ckp-taksit__tab", on && "is-active")}
                      onClick={() => select(i)}
                    >
                      <span className="ckp-taksit__thumb">
                        <img src={c.thumb} alt="" width={280} height={187} loading="lazy" />
                      </span>
                      <span className="ckp-taksit__label">{c.label}</span>
                      <span className="ckp-taksit__line" aria-hidden="true">
                        {on && <motion.span className="ckp-taksit__fill" style={{ scaleX: progress }} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="ckp-taksit__media">
              <AnimatePresence initial={false}>
                <motion.img
                  key={active.id}
                  src={active.img}
                  alt=""
                  width={1600}
                  height={1100}
                  loading="lazy"
                  className="ckp-taksit__photo"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={FADE}
                />
              </AnimatePresence>
              <div className="ckp-taksit__arrows">
                <ArrowButton dir="prev" label="önceki sektör" controls={`${uid}-panel`} onClick={prev} />
                <ArrowButton dir="next" label="sonraki sektör" controls={`${uid}-panel`} onClick={next} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
