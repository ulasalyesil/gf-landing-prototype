"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import type { Variants } from "motion/react";
import Reveal, { useMotionOff } from "./Reveal";
import AnimatedHighlight from "./AnimatedHighlight";

/* Phone rises, cards fan out with a visible spring landing (the one place a
   bounce fits). Hovering the stage spreads the cards flat; springs retarget
   from current velocity, so entrance and hover interrupt each other cleanly. */

const FAN_SPRING = { type: "spring", duration: 0.7, bounce: 0.2 } as const;
const SPREAD_SPRING = { type: "spring", duration: 0.5, bounce: 0 } as const;

const phoneVariants: Variants = {
  hidden: { y: 60, opacity: 0, scale: 0.94 },
  shown: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", duration: 0.8, bounce: 0 },
  },
};

const cardVariants = (side: 1 | -1): Variants => ({
  hidden: { x: 0, rotate: 0, opacity: 0 },
  shown: {
    x: 185 * side,
    rotate: 11 * side,
    opacity: 1,
    transition: { ...FAN_SPRING, delay: 0.15 },
  },
  spread: {
    x: 240 * side,
    rotate: 0,
    opacity: 1,
    transition: SPREAD_SPRING,
  },
});

export default function Transfer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const off = useMotionOff();
  const inView = useInView(stageRef, { once: true, margin: "0px 0px -28% 0px" });
  const [isSpread, setIsSpread] = useState(false);

  const cardState = !inView ? "hidden" : isSpread ? "spread" : "shown";

  return (
    <section className="section transfer" id="transfer">
      <div className="transfer__rings hide-on-mobile" aria-hidden="true"></div>
      <div className="container">
        <Reveal className="eyebrow-wrap">
          <h2 className="h-sec">
            para transferi tabii ki{" "}
            <AnimatedHighlight type="mark">ücretsiz!</AnimatedHighlight>
          </h2>
          <p className="h-lead">
            para gönderirken ücret düşünme. 7/24 ücretsiz EFT, FAST ve havale
            yap.
            <br />
            getirfinanslılar arasında döviz ve değerli maden transferleri de
            ücretsiz
          </p>
        </Reveal>

        <div
          className="transfer__stage"
          ref={stageRef}
          onMouseEnter={() => setIsSpread(true)}
          onMouseLeave={() => setIsSpread(false)}
        >
          {off ? (
            /* Reduced motion / mobile: CSS static fallback transforms apply */
            <>
              <div className="transfer__card transfer__card--left">
                <div className="transfer__card-inner media-slot">
                  <img src="/assets/img/transfer-card-left.png" alt="" />
                </div>
              </div>
              <div className="transfer__phone media-slot">
                <img src="/assets/img/transfer-phone.png" alt="" />
              </div>
              <div className="transfer__card transfer__card--right">
                <div className="transfer__card-inner media-slot">
                  <img src="/assets/img/transfer-card-right.png" alt="" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="transfer__card transfer__card--left">
                <motion.div
                  className="transfer__card-inner media-slot"
                  variants={cardVariants(-1)}
                  initial="hidden"
                  animate={cardState}
                >
                  <img src="/assets/img/transfer-card-left.png" alt="" />
                </motion.div>
              </div>
              <motion.div
                className="transfer__phone media-slot"
                variants={phoneVariants}
                initial="hidden"
                animate={inView ? "shown" : "hidden"}
              >
                <img src="/assets/img/transfer-phone.png" alt="" />
              </motion.div>
              <div className="transfer__card transfer__card--right">
                <motion.div
                  className="transfer__card-inner media-slot"
                  variants={cardVariants(1)}
                  initial="hidden"
                  animate={cardState}
                >
                  <img src="/assets/img/transfer-card-right.png" alt="" />
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
