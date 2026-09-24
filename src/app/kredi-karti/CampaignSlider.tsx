/* Created by Claude · INTERNAL */
"use client";

import { useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import { ArrowButton, PageDots } from "@/components/CarouselControls";
import { useAutoAdvance } from "@/components/useAutoAdvance";
import { CREDIT_CAMPAIGNS } from "@/data/content";

/* "kampanyalar" — one campaign at a time (Figma 22630:15194).
   A 960×720 photo with the white campaign card overlapping it from the right,
   and a 3×2 grid of brand shapes under the card that holds the pagination and
   the arrows. The yellow quarter sits on the photo's bottom-right corner.
   Rotates every 6s (useAutoAdvance): pauses on hover/focus, stops on any
   arrow press. The card is the link; its ↗ is decoration. */

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CampaignSlider() {
  const { slides } = CREDIT_CAMPAIGNS;
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const { index, next, prev, bind } = useAutoAdvance(slides.length, rootRef, 6000);
  const s = slides[index];

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
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </AnimatePresence>
            </div>

            <div className="ckp-camp__side">
              <div className="ckp-camp__card" id={`${uid}-slide`} aria-live="off">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={s.id}
                    className="ckp-camp__card-inner"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.22, ease: EASE }}
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
                <span className="ckp-camp__shape ckp-camp__shape--purple" aria-hidden="true" />
                <span className="ckp-camp__shape ckp-camp__shape--lilac" aria-hidden="true" />
                <span className="ckp-camp__shape ckp-camp__shape--yellow" aria-hidden="true" />
                <span className="ckp-camp__dots">
                  <PageDots count={slides.length} index={index} />
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
