"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { AnimationItem } from "lottie-web";
import clsx from "clsx";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import Reveal, { RevealItem } from "@/components/Reveal";
import { DEBIT_STEPS, DEBIT_STEPS_SECTION } from "@/data/content";

/* "Hızlı kart teslimatı" scroll sequence (GFDES-2174 §2)

   PIN MECHANISM — position: sticky (not scroll-lock). The section is a tall
   scroll track; `.dpc-steps__pin` sticks for its length. Chosen because it is
   native (no scroll-event interception), scroll-up reversal comes for free
   (progress simply runs backwards), and it can never trap the user.

   PIN BOUNDARIES — the track is `pinHeight + SCRUB_PX` tall, so the sticky
   travel is exactly SCRUB_PX regardless of viewport height. The pin's height
   is measured (ResizeObserver) into `--dpc-pin-h`, so a resize — or content
   reflow — resizes the track and the boundaries move with it. Progress is
   read over ["start start", "<SCRUB_PX>px start"], which is the same travel:
   progress reaches 1 exactly as the pin releases. (Deriving the track from
   100vh instead lets the pin drift out early whenever its content is taller
   than the viewport.)

   PROGRESS MODEL — useScroll on the track → useSpring smoothing. The spring
   makes fast flicks animate THROUGH each state instead of teleporting past
   it, and threshold events fire on every crossing, so completion states
   always render (fast-scroll edge case). Segment map (track progress):

     bar 1  0.00–0.24   → lottie #1 fires at 0.24, hold until 0.32
     bar 2  0.32–0.58   → courier rides the bar, hold until 0.66
     bar 3  0.66–0.90   → lottie #3 fires at 0.90; getirpara + cashback
                          icons bounce; 0.90–1.00 hold, then unpin
   Holds are sized for ≤1s lottie files — retune SEG when the real files
   arrive so completions land in sync with scroll pacing.

   LOTTIES — step 1 and step 3 files are USER-SUPPLIED and not yet delivered.
   STEP1_LOTTIE / STEP3_LOTTIE stay null until then; the badge stubs to a
   static icon with the project's icon-pop recipe. Do not source placeholder
   lottie files. Scroll-up policy: lottie RESETS to first frame (goToAndStop 0)
   below the threshold (hysteresis 0.03) — the sequence never skips to
   unpinned on reverse.

   MODES (explicit touch decision — no silent broken scroll-jack):
     ≥921px             "scrub"  scroll-linked pinned sequence
     768–920px          "timed"  no pin; one 4s in-view run of the same
                                 driver, eased with the landing courier curve
                                 cubic-bezier(.16,1,.3,1)
     ≤767px / reduced   "off"    settled end state (bars full, icons shown,
                                 courier hidden — mirrors landing mobile)
   Mode re-evaluates on resize (matchMedia listeners); within scrub, sticky +
   useScroll recalculate boundaries natively, so a mid-pin resize cannot
   strand the section (resize edge case).

   COURIER — ported from the landing (.debit__moto in DebitCard.tsx /
   sections.css): same translateX(calc(-50% + travel)) composition, same
   ResizeObserver travel measurement, same `moto-bob` keyframes on the
   separate `translate` property. Travel is x-transform only (compositor)
   per fixing-motion-performance — no CSS-var/left animation. */

const STEP1_LOTTIE: string | null = null; // TODO user file → /assets/lottie/steps-1.json
const STEP3_LOTTIE: string | null = null; // TODO user file → /assets/lottie/steps-3.json

const SEG_DONE1 = 0.24;
const SEG_BAR2_IN = 0.32;
const SEG_BAR2_OUT = 0.58;
const SEG_BAR3_IN = 0.66;
const SEG_DONE3 = 0.9;

const SEG = {
  bar1: [0, SEG_DONE1] as [number, number],
  done1: SEG_DONE1,
  bar2: [SEG_BAR2_IN, SEG_BAR2_OUT] as [number, number],
  bar3: [SEG_BAR3_IN, SEG_DONE3] as [number, number],
  done3: SEG_DONE3,
};
const HYST = 0.03;
const TIMED_DURATION = 5;
/* Landing .debit__moto travel curve (sections.css: transform 2.4s
   cubic-bezier(.16,1,.3,1)). It governs the courier's TRAVEL leg only —
   driving the whole 3-step timeline with it collapses the sequence
   (all three bars finish inside ~1.2s), so the other legs run linear. */
const COURIER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
/* Driver keyframes for the timed fallback: fill 1 → hold → courier rides →
   hold → fill 3 → hold. Segment boundaries mirror SEG exactly. */
const TIMED_KEYS = [0, SEG_DONE1, SEG_BAR2_IN, SEG_BAR2_OUT, SEG_BAR3_IN, SEG_DONE3, 1];
const TIMED_TIMES = [0, 0.16, 0.22, 0.55, 0.62, 0.9, 1];
const TIMED_EASE = ["linear", "linear", COURIER_EASE, "linear", "linear", "linear"] as const;
/* Sticky travel. Single source of truth: fed to CSS as --dpc-scrub and to
   useScroll as the progress end edge, so the two can never disagree. */
const SCRUB_PX = 1600;

type Mode = "scrub" | "timed" | "off";

function useStepsMode(): Mode {
  const reduced = useReducedMotion();
  // null until mount: SSR/first paint renders the settled "off" layout,
  // avoiding a hydration mismatch; the section is below the fold so the
  // swap to scrub/timed happens before it is reached.
  const [wide, setWide] = useState<boolean | null>(null);
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 921px)");
    const mqSmall = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setWide(mqWide.matches);
      setSmall(mqSmall.matches);
    };
    update();
    mqWide.addEventListener("change", update);
    mqSmall.addEventListener("change", update);
    return () => {
      mqWide.removeEventListener("change", update);
      mqSmall.removeEventListener("change", update);
    };
  }, []);
  if (reduced || small || wide === null) return "off";
  return wide ? "scrub" : "timed";
}

/* Step completion mark: plays the supplied lottie once available; until
   then a static icon pops in (icon-pop recipe). Reset = first frame. */
function StepBadge({
  lottieSrc,
  fallbackIcon,
  done,
}: {
  lottieSrc: string | null;
  fallbackIcon: string;
  done: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!lottieSrc || !boxRef.current) return;
    let cancelled = false;
    let anim: AnimationItem | null = null;
    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !boxRef.current) return;
      anim = lottie.loadAnimation({
        container: boxRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: lottieSrc,
      });
      animRef.current = anim;
    });
    return () => {
      cancelled = true;
      anim?.destroy();
      animRef.current = null;
    };
  }, [lottieSrc]);

  useEffect(() => {
    const anim = animRef.current;
    if (!anim) return;
    if (done) anim.play();
    else anim.goToAndStop(0, true);
  }, [done]);

  if (lottieSrc) {
    return <div ref={boxRef} className="dpc-steps__badge" aria-hidden="true" />;
  }
  return (
    <motion.span
      className="dpc-steps__badge"
      aria-hidden="true"
      initial={false}
      animate={
        done
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, scale: 0.25, filter: "blur(4px)" }
      }
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
    >
      <img src={fallbackIcon} alt="" />
    </motion.span>
  );
}

export default function DeliverySteps() {
  const mode = useStepsMode();
  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const barTrackRef = useRef<HTMLDivElement>(null);

  /* Pin boundaries: track height = pin height + SCRUB_PX. Re-measured on
     resize/reflow, so the pin can never strand mid-animation. */
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

  // scrub driver: scroll progress across exactly the sticky travel
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", `${SCRUB_PX}px start`],
  });
  /* Overdamped on purpose: this IS the fast-flick throttle. A stiff spring
     lets a trackpad flick teleport progress 0→1 in ~100ms, firing both
     completion lotties at once. ~1s settle makes a flick animate through
     each step so every completion state is seen. Verified by probe. */
  const scrubProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 28, mass: 1 });

  // timed driver (768–920): one eased run when the section enters view
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

  const bar1 = useTransform(driver, SEG.bar1, [0, 1]);
  const bar2 = useTransform(driver, SEG.bar2, [0, 1]);
  const bar3 = useTransform(driver, SEG.bar3, [0, 1]);
  const bars = [bar1, bar2, bar3];

  // courier travel: measured once + on resize (DebitCard.tsx pattern) into a
  // motion value, then composed reactively as a pure x-transform
  // (full transform string = hardware-accelerated)
  const travel = useMotionValue(0);
  useEffect(() => {
    const el = barTrackRef.current;
    if (!el) return;
    const measure = () => travel.set(el.offsetWidth);
    measure();
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, travel]);
  const courierTransform = useTransform(
    () => `translateX(calc(-50% + ${(bar2.get() * travel.get()).toFixed(1)}px))`
  );
  const courierOpacity = useTransform(driver, [SEG.bar2[0] - 0.03, SEG.bar2[0]], [0, 1]);

  // threshold states (hysteresis so scroll-up retracts cleanly)
  const [done1, setDone1] = useState(false);
  const [done3, setDone3] = useState(false);
  const [riding, setRiding] = useState(false);
  useMotionValueEvent(driver, "change", (v) => {
    setDone1((prev) => (prev ? v > SEG.done1 - HYST : v >= SEG.done1));
    setDone3((prev) => (prev ? v > SEG.done3 - HYST : v >= SEG.done3));
    setRiding(v > SEG.bar2[0] && v < SEG.bar2[1]);
  });

  const settled = mode === "off";

  return (
    <section
      className="dpc-steps"
      data-mode={mode}
      ref={trackRef}
      style={{ "--dpc-scrub": `${SCRUB_PX}px` } as React.CSSProperties}
    >
      <div className="dpc-steps__pin" ref={pinRef}>
        <div className="dpc-container">
          <div className="dpc-steps__top">
            <Reveal className="dpc-steps__intro">
              <h2 className="dpc-title">
                {DEBIT_STEPS_SECTION.title}{" "}
                <AnimatedHighlight type="hl">{DEBIT_STEPS_SECTION.titleHl}</AnimatedHighlight>
              </h2>
              <p className="dpc-steps__sub">{DEBIT_STEPS_SECTION.sub}</p>
              <a href="#" className="dpc-cta dpc-steps__cta">
                {DEBIT_STEPS_SECTION.cta}
              </a>
            </Reveal>
            <Reveal direction="none" className="dpc-steps__phone">
              <img
                src="/assets/img/debit-phone-tilted.png"
                alt=""
                width={285}
                height={470}
                loading="lazy"
              />
            </Reveal>
          </div>
          <Reveal as="ol" className="dpc-steps__list" stagger={0.08}>
            {DEBIT_STEPS.map((step, i) => (
              <RevealItem as="li" key={step.title} className="dpc-steps__item">
                <span className="dpc-steps__num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{step.title}</h3>
                <p>
                  {step.desc[0]}
                  <br />
                  {step.desc[1]}
                </p>
                <div className="dpc-steps__bar" ref={i === 1 ? barTrackRef : undefined}>
                  <motion.div
                    className="dpc-steps__bar-fill"
                    style={settled ? undefined : { scaleX: bars[i] }}
                  />
                  {i === 1 && (
                    <motion.img
                      className={clsx("dpc-steps__courier", riding && "is-riding")}
                      src="/assets/icons/courier.svg"
                      alt="kurye"
                      style={settled ? undefined : { transform: courierTransform, opacity: courierOpacity }}
                    />
                  )}
                </div>
                {i === 0 && (
                  <div className="dpc-steps__done">
                    <StepBadge
                      lottieSrc={STEP1_LOTTIE}
                      fallbackIcon="/assets/icons/ek-hesap.svg"
                      done={settled || done1}
                    />
                  </div>
                )}
                {i === 2 && (
                  <div className="dpc-steps__done">
                    <StepBadge
                      lottieSrc={STEP3_LOTTIE}
                      fallbackIcon="/assets/icons/coin-gold.svg"
                      done={settled || done3}
                    />
                    <span className="dpc-steps__rewards" aria-hidden="true">
                      {["/assets/icons/getirpara.svg", "/assets/icons/cashback.svg"].map(
                        (src, j) => (
                          <motion.img
                            key={src}
                            src={src}
                            alt=""
                            initial={false}
                            animate={!settled && done3 ? { y: [0, -12, 0] } : { y: 0 }}
                            transition={
                              !settled && done3
                                ? { duration: 0.55, ease: "easeInOut", times: [0, 0.4, 1], delay: j * 0.08, repeat: 1 }
                                : { duration: 0.2 }
                            }
                          />
                        )
                      )}
                    </span>
                  </div>
                )}
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
