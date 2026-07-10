"use client";

import React, { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { AnimationItem } from "lottie-web";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import Reveal from "@/components/Reveal";
import { DEBIT_STEPS, DEBIT_STEPS_SECTION } from "@/data/content";
import {
  APPEAR,
  SCRUB_PX,
  SEG,
  TIMED_DURATION,
  TIMED_EASE,
  TIMED_KEYS,
  TIMED_TIMES,
  useStepsMode,
} from "./DeliverySteps";

/* "Hızlı kart teslimatı" — COMPACT layout variant (?steps=compact).
   Figma: AVH9L2zSe30GBPTkTUAhTo node 21619:8182 — intro on a lilac-50
   panel left, steps on a bg-soft panel right, phone centered on top
   overlapping both. Same pin/driver/mode machinery as the stacked
   layout (constants imported from DeliverySteps.tsx); no bars/courier —
   the phone IS the progress indicator here.

   PHONE — a driver-scrubbed lottie showing the relevant app screen per
   step. The file is USER-SUPPLIED and not yet delivered: PHONE_LOTTIE
   stays null (do not source placeholders) and the slot falls back to the
   static phone render. When it lands: driver [0, SEG.done3] maps linearly
   onto the full frame range — author the lottie so each step's screen
   occupies its SEG third, then retune if the beats feel off. */

const PHONE_LOTTIE: string | null = null; // TODO user file → /assets/lottie/steps-phone.json

export default function DeliveryCompact() {
  const mode = useStepsMode();
  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    const measure = () => track.style.setProperty("--dpc-pin-h", `${pin.offsetHeight}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pin);
    return () => observer.disconnect();
  }, [mode]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", `${SCRUB_PX}px start`],
  });
  const scrubProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 28, mass: 1 });

  const timedProgress = useMotionValue(0);
  const inView = useInView(trackRef, { once: true, margin: "0px 0px -20% 0px" });
  useEffect(() => {
    if (mode !== "timed" || !inView) return;
    const controls = animate(timedProgress, TIMED_KEYS, {
      duration: TIMED_DURATION,
      times: [...TIMED_TIMES],
      ease: [...TIMED_EASE],
    });
    return () => controls.stop();
  }, [mode, inView, timedProgress]);

  const driver = mode === "timed" ? timedProgress : scrubProgress;

  // step copy: same appearance beats as the stacked layout
  const item1In = useTransform(driver, [0, APPEAR], [0, 1]);
  const item2In = useTransform(driver, [SEG.bar2[0] - APPEAR, SEG.bar2[0]], [0, 1]);
  const item3In = useTransform(driver, [SEG.bar3[0] - APPEAR, SEG.bar3[0]], [0, 1]);
  const item1Rise = useTransform(item1In, [0, 1], [16, 0]);
  const item2Rise = useTransform(item2In, [0, 1], [16, 0]);
  const item3Rise = useTransform(item3In, [0, 1], [16, 0]);
  const itemIn = [item1In, item2In, item3In];
  const itemRise = [item1Rise, item2Rise, item3Rise];

  // phone lottie: scrubbed by the driver across [0, SEG.done3]
  const phoneBoxRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  useEffect(() => {
    if (!PHONE_LOTTIE || !phoneBoxRef.current) return;
    let cancelled = false;
    let anim: AnimationItem | null = null;
    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !phoneBoxRef.current) return;
      anim = lottie.loadAnimation({
        container: phoneBoxRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: PHONE_LOTTIE,
      });
      animRef.current = anim;
    });
    return () => {
      cancelled = true;
      anim?.destroy();
      animRef.current = null;
    };
  }, []);
  useMotionValueEvent(driver, "change", (v) => {
    const anim = animRef.current;
    if (!anim || !anim.totalFrames) return;
    const p = Math.min(Math.max(v / SEG.done3, 0), 1);
    anim.goToAndStop(p * (anim.totalFrames - 1), true);
  });

  const settled = mode === "off";

  return (
    <section
      className="dpc-stepsc"
      data-mode={mode}
      ref={trackRef}
      style={{ "--dpc-scrub": `${SCRUB_PX}px` } as React.CSSProperties}
    >
      <div className="dpc-stepsc__pin" ref={pinRef}>
        <div className="dpc-container">
          <div className="dpc-stepsc__grid">
            <Reveal className="dpc-stepsc__intro">
              <h2 className="dpc-title">
                {DEBIT_STEPS_SECTION.title}{" "}
                <AnimatedHighlight type="hl">{DEBIT_STEPS_SECTION.titleHl}</AnimatedHighlight>
              </h2>
              <p className="dpc-stepsc__sub">{DEBIT_STEPS_SECTION.sub}</p>
              <a href="#" className="dpc-cta dpc-stepsc__cta">
                {DEBIT_STEPS_SECTION.cta}
              </a>
            </Reveal>

            <ol className="dpc-stepsc__list">
              {DEBIT_STEPS.map((step, i) => (
                <motion.li
                  key={step.title}
                  className="dpc-stepsc__item"
                  initial={false}
                  style={settled ? undefined : { opacity: itemIn[i], y: itemRise[i] }}
                >
                  <h3>{step.title}</h3>
                  <p>
                    {step.desc[0]} {step.desc[1]}
                  </p>
                </motion.li>
              ))}
            </ol>

            {/* phone sits on top of both panels, centered on the seam.
                Positioning lives on the plain outer div — Reveal (Motion)
                writes inline transforms and would stomp translate(-50%,-50%)
                (the hero media-fill trap) */}
            <div className="dpc-stepsc__phone">
              <Reveal direction="none" delay={0.15} className="dpc-stepsc__phone-fill">
                {PHONE_LOTTIE ? (
                  <div ref={phoneBoxRef} className="dpc-stepsc__phone-lottie" aria-hidden="true" />
                ) : (
                  /* interim mockup: the actual "hesap kartı seçimi" screen
                     (user-supplied still) at the landing transfer-phone scale;
                     the scrubbed lottie replaces this when it lands */
                  <img
                    src="/assets/img/debit-steps-phone.png"
                    alt=""
                    width={677}
                    height={1147}
                    loading="lazy"
                  />
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
