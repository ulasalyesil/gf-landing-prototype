/* Created by Claude · INTERNAL */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import SectionHead from "@/components/SectionHead";
import Reveal, { useReducedMotionSafe } from "@/components/Reveal";
import { ArrowButton, PageDots } from "@/components/CarouselControls";
import { useAutoAdvance } from "@/components/useAutoAdvance";
import { usePreloadImages } from "@/components/usePreloadImages";
import { CREDIT_CAMPAIGNS } from "@/data/content";

/* "kampanyalar" — one campaign at a time (Figma 22630:15194).
   A 960×720 photo with the white campaign card overlapping it from the right,
   and a 3×2 grid of brand shapes under the card that holds the pagination and
   the arrows. The yellow quarter sits on the photo's bottom-right corner.
   Rotates every 6s (useAutoAdvance): pauses on hover/focus, stops on any
   arrow press. The card is the link; its ↗ is decoration.

   Motion pass (2026-09-25):
   - the next photo opens as a circle out of the yellow quarter's corner
     (bottom-right, where the brand shape touches it), easing in from 1.08;
   - the purple and lilac shapes turn a quarter per change, opposite ways —
     the brand geometry reshuffles with each campaign — while the yellow one
     stays pinned to the photo's corner and just breathes;
   - the pager's active pill fills with the 6s clock. */

const EASE = [0.16, 1, 0.3, 1] as const;
const TURN = { type: "spring", duration: 0.8, bounce: 0.2 } as const;

export default function CampaignSlider() {
  const { slides } = CREDIT_CAMPAIGNS;
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const { index, next, prev, progress, bind } = useAutoAdvance(slides.length, rootRef, 6000);
  const s = slides[index];
  usePreloadImages(rootRef, slides.map((sl) => sl.img));

  /* quarter turns, counted monotonically so a wrap (last → first) keeps
     turning the same way instead of spinning back */
  const [spin, setSpin] = useState({ index, turns: 0 });
  if (spin.index !== index) {
    const n = slides.length;
    const d = (index - spin.index + n) % n;
    setSpin({ index, turns: spin.turns + (d === n - 1 ? -1 : 1) });
  }
  const turns = spin.turns;

  const [yellow, animateYellow] = useAnimate<HTMLSpanElement>();
  useEffect(() => {
    if (turns && yellow.current) animateYellow(yellow.current, { scale: [1, 0.9, 1] }, { duration: 0.6, ease: EASE, delay: 0.12 });
  }, [turns, yellow, animateYellow]);

  // reduced motion: the photo crossfades instead of wiping
  const reduced = useReducedMotionSafe();
  const photoIn = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 } }
    : {
        initial: { clipPath: "circle(0% at 100% 100%)", scale: 1.08, zIndex: 1 },
        animate: { clipPath: "circle(150% at 100% 100%)", scale: 1, zIndex: 1 },
        transition: { clipPath: { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const }, scale: { duration: 1.2, ease: EASE } },
      };

  return (
    <section className="dpc-section ckp-camp" aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <SectionHead
          title={CREDIT_CAMPAIGNS.title}
          sub={
            <>
              <span className="ckp-camp__em">{CREDIT_CAMPAIGNS.sub.em}</span>
              {CREDIT_CAMPAIGNS.sub.rest}
            </>
          }
          titleId={`${uid}-h`}
          className="ckp-camp__head"
        />

        <Reveal className="ckp-camp__stage">
          <div
            className="ckp-camp__row"
            ref={rootRef}
            {...bind}
            role="group"
            aria-roledescription="carousel"
            aria-label={CREDIT_CAMPAIGNS.title}
          >
            <div className="ckp-camp__media">
              <AnimatePresence initial={false}>
                <motion.img
                  key={s.id}
                  src={s.img}
                  alt=""
                  width={2048}
                  height={1152}
                  loading="lazy"
                  className="ckp-camp__photo"
                  {...photoIn}
                  /* the outgoing photo pushes in underneath until it is covered
                     (animated: a bare zIndex exit would unmount it at once) */
                  exit={reduced ? { opacity: 0, transition: { duration: 0.4 } } : { zIndex: 0, scale: 1.1, transition: { duration: 0.9, ease: EASE } }}
                />
              </AnimatePresence>
            </div>

            <div className="ckp-camp__side">
              <div className="ckp-camp__card" id={`${uid}-slide`} aria-live="off">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={s.id}
                    className="ckp-camp__card-inner"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -4, filter: "blur(2px)", transition: { duration: 0.12 } }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <div className="ckp-camp__top">
                      <h3 className="ckp-camp__title">
                        <a href={s.href} className="ckp-camp__link">
                          {s.title[0]}
                          <br />
                          {" "}
                          {s.title[1]}
                        </a>
                      </h3>
                      <img src="/assets/img/kartlar/arrow-up-right.svg" alt="" width={24} height={24} loading="lazy" />
                    </div>
                    <p className="ckp-camp__desc">{s.desc}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="ckp-camp__grid">
                <motion.span className="ckp-camp__shape ckp-camp__shape--purple" aria-hidden="true" initial={false} animate={{ rotate: turns * 90 }} transition={TURN} />
                <motion.span className="ckp-camp__shape ckp-camp__shape--lilac" aria-hidden="true" initial={false} animate={{ rotate: turns * -90 }} transition={{ ...TURN, delay: 0.06 }} />
                <span ref={yellow} className="ckp-camp__shape ckp-camp__shape--yellow" aria-hidden="true" />
                <span className="ckp-camp__dots">
                  <PageDots count={slides.length} index={index} progress={progress} />
                </span>
                <span className="ckp-camp__arrows">
                  <ArrowButton dir="prev" skin="tint" label="önceki kampanya" controls={`${uid}-slide`} onClick={prev} />
                  <ArrowButton dir="next" skin="tint" label="sonraki kampanya" controls={`${uid}-slide`} onClick={next} />
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
