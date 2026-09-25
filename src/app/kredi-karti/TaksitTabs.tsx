/* Created by Claude · INTERNAL */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, useIsPresent, useMotionValue, useMotionValueEvent } from "motion/react";
import type { MotionValue, PanInfo } from "motion/react";
import SectionHead from "@/components/SectionHead";
import Reveal, { useReducedMotionSafe } from "@/components/Reveal";
import { ArrowButton } from "@/components/CarouselControls";
import { useAutoAdvance } from "@/components/useAutoAdvance";
import { usePreloadImages } from "@/components/usePreloadImages";
import { CREDIT_TAKSIT } from "@/data/content";

/* "ücretsiz 3 taksit" — category tabs (Figma 22630:15718).
   Left: the active category's title + copy over a row of thumbnail tabs;
   right: its photo with prev/next. Rotates on a 5s clock whose progress IS the
   underline under the active thumb (useAutoAdvance); any pick stops it.
   Tabs follow the ARIA pattern with automatic activation: ←/→ move and
   select, Home/End jump. The photo is decorative; the panel is the copy.

   Motion pass (2026-09-25):
   - the photo breathes with the clock: it drifts 1 → 1.05 over the 5s the
     category is on screen, so the underline and the picture keep one time;
   - a change wipes the next photo in from the side it comes from (next →
     from the right, prev → from the left) instead of crossfading;
   - the photo can be swiped/dragged sideways to go to the neighbour
     (rubber-banded, velocity-aware) — a pick, so it stops the rotation;
   - the title and copy swap with a short blur roll. */

const FADE = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };
const WIPE = { duration: 0.75, ease: [0.65, 0, 0.35, 1] as const };
const BREATH = 0.05;

/* A photo that follows the clock while it is the current one and freezes
   where it was once it starts leaving (so the exit never jumps back to 1). */
function BreathingPhoto({ src, dir, progress }: { src: string; dir: number; progress: MotionValue<number> }) {
  const present = useIsPresent();
  const reduced = useReducedMotionSafe();
  const scale = useMotionValue(1 + BREATH * progress.get());
  useMotionValueEvent(progress, "change", (v) => {
    if (present && !reduced) scale.set(1 + BREATH * v);
  });
  useEffect(() => {
    if (reduced) scale.set(1);
  }, [reduced, scale]);
  const from = dir >= 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
  return (
    <motion.img
      src={src}
      alt=""
      width={1600}
      height={1100}
      loading="lazy"
      draggable={false}
      className="ckp-taksit__photo"
      style={{ scale }}
      initial={reduced ? { opacity: 0 } : { clipPath: from, zIndex: 1 }}
      animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0 0%)", zIndex: 1 }}
      /* the outgoing photo pushes in underneath while the next one wipes over
         it (an animated value: a bare zIndex exit would end — and unmount —
         instantly) */
      exit={reduced ? { opacity: 0, transition: FADE } : { zIndex: 0, scale: 1.1, transition: { duration: WIPE.duration, ease: FADE.ease } }}
      transition={reduced ? FADE : { clipPath: WIPE }}
    />
  );
}

export default function TaksitTabs() {
  const { categories } = CREDIT_TAKSIT;
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const { index, select, next, prev, progress, bind } = useAutoAdvance(categories.length, rootRef, 5000);
  const active = categories[index];
  usePreloadImages(rootRef, categories.map((c) => c.img));

  // direction of the last change, for the wipe (+1 next, −1 prev; wraps count as a step)
  const [seen, setSeen] = useState({ index, dir: 1 });
  if (seen.index !== index) {
    const n = categories.length;
    setSeen({ index, dir: (index - seen.index + n) % n === n - 1 ? -1 : 1 });
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -60) next();
    else if (swipe > 60) prev();
  };

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
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -4, filter: "blur(2px)", transition: { duration: 0.12 } }}
                  transition={{ ...FADE, duration: 0.3 }}
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

            <motion.div
              className="ckp-taksit__media"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              dragMomentum={false}
              onDragEnd={onDragEnd}
            >
              <AnimatePresence initial={false}>
                <BreathingPhoto key={active.id} src={active.img} dir={seen.dir} progress={progress} />
              </AnimatePresence>
              <div className="ckp-taksit__arrows">
                <ArrowButton dir="prev" label="önceki sektör" controls={`${uid}-panel`} onClick={prev} />
                <ArrowButton dir="next" label="sonraki sektör" controls={`${uid}-panel`} onClick={next} />
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
